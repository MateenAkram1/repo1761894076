import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/session';
import {
  getMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
} from '@/models/medicalRecord';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid record ID' });
  }

  try {
    const session = await getSession(req, res);

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    switch (method) {
      case 'GET':
        return await handleGET(req, res, session, id);
      case 'PUT':
        return await handlePUT(req, res, session, id);
      case 'DELETE':
        return await handleDELETE(req, res, session, id);
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return res.status(500).json({ error: message });
  }
}

async function handleGET(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any,
  id: string
) {
  const record = await getMedicalRecord(id);

  if (!record) {
    return res.status(404).json({ error: 'Medical record not found' });
  }

  // Check permissions
  const isAdmin = session.user.userRole === 'ADMIN';
  const isPatient = session.user.id === record.patientId;
  const isDoctor = session.user.id === record.doctorId;

  if (!isAdmin && !isPatient && !isDoctor) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  return res.status(200).json({ data: record });
}

async function handlePUT(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any,
  id: string
) {
  // Only doctors and admins can update medical records
  if (session.user.userRole !== 'DOCTOR' && session.user.userRole !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const record = await getMedicalRecord(id);

  if (!record) {
    return res.status(404).json({ error: 'Medical record not found' });
  }

  // Doctors can only update their own records
  if (session.user.userRole === 'DOCTOR' && session.user.id !== record.doctorId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const updateData: any = {};

  if (req.body.chiefComplaint) updateData.chiefComplaint = req.body.chiefComplaint;
  if (req.body.diagnoses) updateData.diagnoses = req.body.diagnoses;
  if (req.body.treatmentPlans) updateData.treatmentPlans = req.body.treatmentPlans;
  if (req.body.prescriptions) updateData.prescriptions = req.body.prescriptions;
  if (req.body.labResults) updateData.labResults = req.body.labResults;
  if (req.body.vitals) updateData.vitals = req.body.vitals;
  if (req.body.visitNotes) updateData.visitNotes = req.body.visitNotes;
  if (req.body.followUpDate) updateData.followUpDate = new Date(req.body.followUpDate);

  const updatedRecord = await updateMedicalRecord(id, updateData);

  return res.status(200).json({ data: updatedRecord });
}

async function handleDELETE(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any,
  id: string
) {
  // Only admins can delete medical records
  if (session.user.userRole !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const record = await getMedicalRecord(id);

  if (!record) {
    return res.status(404).json({ error: 'Medical record not found' });
  }

  await deleteMedicalRecord(id);

  return res.status(200).json({ data: { message: 'Medical record deleted successfully' } });
}

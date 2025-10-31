import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/session';
import {
  createMedicalRecord,
  getMedicalRecordsByPatient,
  getMedicalRecordsByDoctor,
  getAllMedicalRecords,
} from '@/models/medicalRecord';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    const session = await getSession(req, res);

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    switch (method) {
      case 'GET':
        return await handleGET(req, res, session);
      case 'POST':
        return await handlePOST(req, res, session);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
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
  session: any
) {

  // Admin can see all records
  if (session.user.userRole === 'ADMIN') {
    const records = await getAllMedicalRecords();
    return res.status(200).json({ data: records });
  }

  // Patient can see their own records
  if (session.user.userRole === 'PATIENT') {
    const records = await getMedicalRecordsByPatient(session.user.id);
    return res.status(200).json({ data: records });
  }

  // Doctor can see records for their patients
  if (session.user.userRole === 'DOCTOR') {
    const records = await getMedicalRecordsByDoctor(session.user.id);
    return res.status(200).json({ data: records });
  }

  return res.status(403).json({ error: 'Forbidden' });
}

async function handlePOST(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any
) {
  // Only doctors and admins can create medical records
  if (session.user.userRole !== 'DOCTOR' && session.user.userRole !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const {
    patientId,
    doctorId,
    visitDate,
    chiefComplaint,
    diagnoses,
    treatmentPlans,
    prescriptions,
    labResults,
    vitals,
    visitNotes,
    followUpDate,
  } = req.body;

  if (!patientId || !doctorId || !visitDate || !visitNotes) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Doctors can only create records for themselves
  if (session.user.userRole === 'DOCTOR' && doctorId !== session.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const record = await createMedicalRecord({
    patient: { connect: { id: patientId } },
    doctor: { connect: { id: doctorId } },
    visitDate: new Date(visitDate),
    chiefComplaint,
    diagnoses: diagnoses || {},
    treatmentPlans: treatmentPlans || {},
    prescriptions: prescriptions || {},
    labResults,
    vitals,
    visitNotes,
    followUpDate: followUpDate ? new Date(followUpDate) : undefined,
  });

  return res.status(201).json({ data: record });
}

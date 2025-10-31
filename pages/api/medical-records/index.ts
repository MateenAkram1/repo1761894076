import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/session';
import { ApiError } from '@/lib/errors';
import {
  createMedicalRecord,
  getMedicalRecordsByPatient,
  getMedicalRecordsByDoctor,
} from '@/models/medicalRecord';
import { UserRole } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getSession(req, res);

    if (!session) {
      throw new ApiError(401, 'Unauthorized');
    }

    const { method } = req;

    switch (method) {
      case 'GET':
        return await handleGET(req, res, session);
      case 'POST':
        return await handlePOST(req, res, session);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    res.status(statusCode).json({ error: message });
  }
}

async function handleGET(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any
) {
  const { id: userId, role } = session.user;
  const { patientId } = req.query;

  let records;

  if (role === UserRole.PATIENT) {
    records = await getMedicalRecordsByPatient(userId);
  } else if (role === UserRole.DOCTOR) {
    if (patientId && typeof patientId === 'string') {
      records = await getMedicalRecordsByPatient(patientId);
    } else {
      records = await getMedicalRecordsByDoctor(userId);
    }
  } else if (role === UserRole.ADMIN) {
    if (patientId && typeof patientId === 'string') {
      records = await getMedicalRecordsByPatient(patientId);
    } else {
      throw new ApiError(400, 'Patient ID required for admin access');
    }
  } else {
    throw new ApiError(403, 'Forbidden');
  }

  res.status(200).json(records);
}

async function handlePOST(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any
) {
  const { id: userId, role } = session.user;

  // Only doctors and admins can create medical records
  if (role !== UserRole.DOCTOR && role !== UserRole.ADMIN) {
    throw new ApiError(403, 'Only doctors and admins can create medical records');
  }

  const {
    patientId,
    appointmentId,
    visitDate,
    chiefComplaint,
    diagnoses,
    treatmentPlans,
    prescriptions,
    labResults,
    vitalSigns,
    visitNotes,
    followUpDate,
    attachments,
  } = req.body;

  if (!patientId || !visitDate) {
    throw new ApiError(400, 'Patient ID and visit date are required');
  }

  const record = await createMedicalRecord({
    patient: { connect: { id: patientId } },
    doctor: { connect: { id: userId } },
    appointmentId,
    visitDate: new Date(visitDate),
    chiefComplaint,
    diagnoses,
    treatmentPlans,
    prescriptions,
    labResults,
    vitalSigns,
    visitNotes,
    followUpDate: followUpDate ? new Date(followUpDate) : undefined,
    attachments,
  });

  res.status(201).json(record);
}

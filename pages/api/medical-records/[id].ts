import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/session';
import { ApiError } from '@/lib/errors';
import {
  getMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
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
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      throw new ApiError(400, 'Invalid record ID');
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
  session: any,
  id: string
) {
  const record = await getMedicalRecord(id);

  if (!record) {
    throw new ApiError(404, 'Medical record not found');
  }

  const { id: userId, role } = session.user;

  // Check permissions
  if (
    role !== UserRole.ADMIN &&
    record.patientId !== userId &&
    record.doctorId !== userId
  ) {
    throw new ApiError(403, 'Access denied');
  }

  res.status(200).json(record);
}

async function handlePUT(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any,
  id: string
) {
  const record = await getMedicalRecord(id);

  if (!record) {
    throw new ApiError(404, 'Medical record not found');
  }

  const { id: userId, role } = session.user;

  // Only the creating doctor and admins can update records
  if (role !== UserRole.ADMIN && record.doctorId !== userId) {
    throw new ApiError(403, 'Access denied');
  }

  const updatedRecord = await updateMedicalRecord(id, req.body);

  res.status(200).json(updatedRecord);
}

async function handleDELETE(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any,
  id: string
) {
  const { role } = session.user;

  // Only admins can delete medical records
  if (role !== UserRole.ADMIN) {
    throw new ApiError(403, 'Only admins can delete medical records');
  }

  await deleteMedicalRecord(id);

  res.status(200).json({ message: 'Medical record deleted successfully' });
}

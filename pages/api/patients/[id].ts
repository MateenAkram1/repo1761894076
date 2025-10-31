import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/session';
import { ApiError } from '@/lib/errors';
import { getPatientProfile, updatePatientProfile } from '@/models/patientProfile';
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
      throw new ApiError(400, 'Invalid patient ID');
    }

    switch (method) {
      case 'GET':
        return await handleGET(req, res, session, id);
      case 'PUT':
        return await handlePUT(req, res, session, id);
      default:
        res.setHeader('Allow', ['GET', 'PUT']);
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
  const { id: userId, role } = session.user;

  // Patients can only view their own profile
  if (role === UserRole.PATIENT && userId !== id) {
    throw new ApiError(403, 'Access denied');
  }

  const patientProfile = await getPatientProfile(id);

  if (!patientProfile) {
    throw new ApiError(404, 'Patient profile not found');
  }

  res.status(200).json(patientProfile);
}

async function handlePUT(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any,
  id: string
) {
  const { id: userId, role } = session.user;

  // Patients can only update their own profile, doctors and admins can update any
  if (role === UserRole.PATIENT && userId !== id) {
    throw new ApiError(403, 'Access denied');
  }

  const updatedProfile = await updatePatientProfile(id, req.body);

  res.status(200).json(updatedProfile);
}

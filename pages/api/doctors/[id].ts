import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/session';
import { ApiError } from '@/lib/errors';
import { getDoctorProfile, updateDoctorProfile } from '@/models/doctorProfile';
import { UserRole } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method } = req;
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      throw new ApiError(400, 'Invalid doctor ID');
    }

    switch (method) {
      case 'GET':
        return await handleGET(req, res, id);
      case 'PUT':
        return await handlePUT(req, res, id);
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
  id: string
) {
  const doctorProfile = await getDoctorProfile(id);

  if (!doctorProfile) {
    throw new ApiError(404, 'Doctor profile not found');
  }

  res.status(200).json(doctorProfile);
}

async function handlePUT(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  const session = await getSession(req, res);

  if (!session) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { id: userId, role } = session.user;

  // Doctors can only update their own profile, admins can update any
  if (role !== UserRole.ADMIN && userId !== id) {
    throw new ApiError(403, 'Access denied');
  }

  const updatedProfile = await updateDoctorProfile(id, req.body);

  res.status(200).json(updatedProfile);
}

import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/session';
import { ApiError } from '@/lib/errors';
import { getAllDoctors, createDoctorProfile } from '@/models/doctorProfile';
import { UserRole } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method } = req;

    switch (method) {
      case 'GET':
        return await handleGET(req, res);
      case 'POST':
        return await handlePOST(req, res);
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

async function handleGET(req: NextApiRequest, res: NextApiResponse) {
  const { specialty, isAcceptingPatients } = req.query;

  const doctors = await getAllDoctors({
    specialty: specialty as string,
    isAcceptingPatients: isAcceptingPatients === 'true',
  });

  res.status(200).json(doctors);
}

async function handlePOST(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);

  if (!session) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { role } = session.user;

  // Only admins can create doctor profiles
  if (role !== UserRole.ADMIN) {
    throw new ApiError(403, 'Only admins can create doctor profiles');
  }

  const {
    userId,
    specialty,
    qualifications,
    licenseNumber,
    experience,
    availabilitySchedule,
    bio,
    consultationFee,
    isAcceptingPatients,
  } = req.body;

  if (!userId || !specialty) {
    throw new ApiError(400, 'User ID and specialty are required');
  }

  const doctorProfile = await createDoctorProfile({
    user: { connect: { id: userId } },
    specialty,
    qualifications,
    licenseNumber,
    experience,
    availabilitySchedule,
    bio,
    consultationFee,
    isAcceptingPatients,
  });

  res.status(201).json(doctorProfile);
}

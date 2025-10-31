import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/session';
import {
  createDoctorProfile,
  getDoctorProfile,
  updateDoctorProfile,
} from '@/models/doctorProfile';

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
      case 'PUT':
        return await handlePUT(req, res, session);
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
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
  const { userId } = req.query;
  const targetUserId = userId as string || session.user.id;

  const profile = await getDoctorProfile({ userId: targetUserId });

  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  return res.status(200).json({ data: profile });
}

async function handlePOST(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any
) {
  // Only doctors and admins can create doctor profiles
  if (session.user.userRole !== 'DOCTOR' && session.user.userRole !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Check if profile already exists
  const existingProfile = await getDoctorProfile({ userId: session.user.id });

  if (existingProfile) {
    return res.status(400).json({ error: 'Profile already exists' });
  }

  const { specialty, qualifications, licenseNumber, bio, yearsOfExperience, consultationFee, education, languages } = req.body;

  if (!specialty) {
    return res.status(400).json({ error: 'Specialty is required' });
  }

  const profile = await createDoctorProfile({
    user: { connect: { id: session.user.id } },
    specialty,
    qualifications: qualifications || [],
    licenseNumber,
    bio,
    yearsOfExperience,
    consultationFee,
    education: education || [],
    languages: languages || [],
    isAcceptingPatients: true,
  });

  return res.status(201).json({ data: profile });
}

async function handlePUT(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any
) {
  const { userId } = req.query;
  const targetUserId = userId as string || session.user.id;

  // Doctors can only update their own profile, admins can update any
  if (
    session.user.userRole === 'DOCTOR' &&
    targetUserId !== session.user.id
  ) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (session.user.userRole !== 'DOCTOR' && session.user.userRole !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const updateData: any = {};

  if (req.body.specialty) updateData.specialty = req.body.specialty;
  if (req.body.qualifications) updateData.qualifications = req.body.qualifications;
  if (req.body.licenseNumber) updateData.licenseNumber = req.body.licenseNumber;
  if (req.body.availabilitySchedule) updateData.availabilitySchedule = req.body.availabilitySchedule;
  if (req.body.bio) updateData.bio = req.body.bio;
  if (req.body.yearsOfExperience) updateData.yearsOfExperience = req.body.yearsOfExperience;
  if (req.body.consultationFee) updateData.consultationFee = req.body.consultationFee;
  if (req.body.education) updateData.education = req.body.education;
  if (req.body.languages) updateData.languages = req.body.languages;
  if (req.body.isAcceptingPatients !== undefined) updateData.isAcceptingPatients = req.body.isAcceptingPatients;

  const profile = await updateDoctorProfile(targetUserId, updateData);

  return res.status(200).json({ data: profile });
}

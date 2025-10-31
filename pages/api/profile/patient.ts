import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/session';
import {
  createPatientProfile,
  getPatientProfile,
  updatePatientProfile,
} from '@/models/patientProfile';

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

  // Patients can only see their own profile, doctors and admins can see any
  if (
    session.user.userRole === 'PATIENT' &&
    targetUserId !== session.user.id
  ) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const profile = await getPatientProfile({ userId: targetUserId });

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
  // Check if profile already exists
  const existingProfile = await getPatientProfile({ userId: session.user.id });

  if (existingProfile) {
    return res.status(400).json({ error: 'Profile already exists' });
  }

  const profile = await createPatientProfile({
    user: { connect: { id: session.user.id } },
    dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : undefined,
    phone: req.body.phone,
    address: req.body.address,
    medicalHistory: req.body.medicalHistory,
    allergies: req.body.allergies || [],
    currentMedications: req.body.currentMedications || [],
    emergencyContactName: req.body.emergencyContactName,
    emergencyContactPhone: req.body.emergencyContactPhone,
    emergencyContactRelation: req.body.emergencyContactRelation,
    bloodType: req.body.bloodType,
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

  // Patients can only update their own profile
  if (
    session.user.userRole === 'PATIENT' &&
    targetUserId !== session.user.id
  ) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const updateData: any = {};

  if (req.body.dateOfBirth) updateData.dateOfBirth = new Date(req.body.dateOfBirth);
  if (req.body.phone) updateData.phone = req.body.phone;
  if (req.body.address) updateData.address = req.body.address;
  if (req.body.medicalHistory) updateData.medicalHistory = req.body.medicalHistory;
  if (req.body.allergies) updateData.allergies = req.body.allergies;
  if (req.body.currentMedications) updateData.currentMedications = req.body.currentMedications;
  if (req.body.emergencyContactName) updateData.emergencyContactName = req.body.emergencyContactName;
  if (req.body.emergencyContactPhone) updateData.emergencyContactPhone = req.body.emergencyContactPhone;
  if (req.body.emergencyContactRelation) updateData.emergencyContactRelation = req.body.emergencyContactRelation;
  if (req.body.bloodType) updateData.bloodType = req.body.bloodType;

  const profile = await updatePatientProfile(targetUserId, updateData);

  return res.status(200).json({ data: profile });
}

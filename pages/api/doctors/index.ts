import { NextApiRequest, NextApiResponse } from 'next';
import { getAllDoctors, getDoctorsBySpecialty } from '@/models/doctorProfile';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }

  try {
    const { specialty } = req.query;

    let doctors;

    if (specialty && typeof specialty === 'string') {
      doctors = await getDoctorsBySpecialty(specialty);
    } else {
      doctors = await getAllDoctors();
    }

    return res.status(200).json({ data: doctors });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return res.status(500).json({ error: message });
  }
}

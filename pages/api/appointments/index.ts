import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/session';
import {
  createAppointment,
  getAllAppointments,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
} from '@/models/appointment';
import { AppointmentStatus } from '@prisma/client';

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
  const { userId } = req.query;
  const { role } = req.query;

  // Admin can see all appointments
  if (session.user.userRole === 'ADMIN') {
    const filters: any = {};
    if (req.query.status) filters.status = req.query.status as AppointmentStatus;
    if (req.query.startDate) filters.startDate = new Date(req.query.startDate as string);
    if (req.query.endDate) filters.endDate = new Date(req.query.endDate as string);

    const appointments = await getAllAppointments(filters);
    return res.status(200).json({ data: appointments });
  }

  // Patient can see their own appointments
  if (session.user.userRole === 'PATIENT' || role === 'PATIENT') {
    const appointments = await getAppointmentsByPatient(
      userId as string || session.user.id
    );
    return res.status(200).json({ data: appointments });
  }

  // Doctor can see their appointments
  if (session.user.userRole === 'DOCTOR' || role === 'DOCTOR') {
    const startDate = req.query.startDate
      ? new Date(req.query.startDate as string)
      : undefined;
    const endDate = req.query.endDate
      ? new Date(req.query.endDate as string)
      : undefined;

    const appointments = await getAppointmentsByDoctor(
      userId as string || session.user.id,
      startDate,
      endDate
    );
    return res.status(200).json({ data: appointments });
  }

  return res.status(403).json({ error: 'Forbidden' });
}

async function handlePOST(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any
) {
  const {
    patientId,
    doctorId,
    date,
    duration,
    type,
    reason,
    symptoms,
  } = req.body;

  if (!patientId || !doctorId || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Patients can only book for themselves
  if (session.user.userRole === 'PATIENT' && patientId !== session.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const appointment = await createAppointment({
    patient: { connect: { id: patientId } },
    doctor: { connect: { id: doctorId } },
    date: new Date(date),
    duration: duration || 30,
    type: type || 'IN_PERSON',
    status: 'BOOKED',
    reason,
    symptoms,
  });

  return res.status(201).json({ data: appointment });
}

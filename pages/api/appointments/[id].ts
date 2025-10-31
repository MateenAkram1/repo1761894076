import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/session';
import {
  getAppointment,
  updateAppointment,
  deleteAppointment,
} from '@/models/appointment';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid appointment ID' });
  }

  try {
    const session = await getSession(req, res);

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
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
  session: any,
  id: string
) {
  const appointment = await getAppointment(id);

  if (!appointment) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  // Check permissions
  const isAdmin = session.user.userRole === 'ADMIN';
  const isPatient = session.user.id === appointment.patientId;
  const isDoctor = session.user.id === appointment.doctorId;

  if (!isAdmin && !isPatient && !isDoctor) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  return res.status(200).json({ data: appointment });
}

async function handlePUT(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any,
  id: string
) {
  const appointment = await getAppointment(id);

  if (!appointment) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  // Check permissions
  const isAdmin = session.user.userRole === 'ADMIN';
  const isPatient = session.user.id === appointment.patientId;
  const isDoctor = session.user.id === appointment.doctorId;

  if (!isAdmin && !isPatient && !isDoctor) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const updateData: any = {};

  if (req.body.date) updateData.date = new Date(req.body.date);
  if (req.body.status) updateData.status = req.body.status;
  if (req.body.notes) updateData.notes = req.body.notes;
  if (req.body.type) updateData.type = req.body.type;
  if (req.body.duration) updateData.duration = req.body.duration;
  if (req.body.cancellationReason) updateData.cancellationReason = req.body.cancellationReason;
  if (req.body.telehealth_link) updateData.telehealth_link = req.body.telehealth_link;

  const updatedAppointment = await updateAppointment(id, updateData);

  return res.status(200).json({ data: updatedAppointment });
}

async function handleDELETE(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any,
  id: string
) {
  const appointment = await getAppointment(id);

  if (!appointment) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  // Only admin or patient can delete
  const isAdmin = session.user.userRole === 'ADMIN';
  const isPatient = session.user.id === appointment.patientId;

  if (!isAdmin && !isPatient) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  await deleteAppointment(id);

  return res.status(200).json({ data: { message: 'Appointment deleted successfully' } });
}

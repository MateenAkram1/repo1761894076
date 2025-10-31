import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/session';
import { ApiError } from '@/lib/errors';
import {
  getAppointment,
  updateAppointment,
} from '@/models/appointment';
import { UserRole, AppointmentStatus } from '@prisma/client';

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
      throw new ApiError(400, 'Invalid appointment ID');
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
  const appointment = await getAppointment(id);

  if (!appointment) {
    throw new ApiError(404, 'Appointment not found');
  }

  const { id: userId, role } = session.user;

  // Check permissions
  if (
    role !== UserRole.ADMIN &&
    appointment.patientId !== userId &&
    appointment.doctorId !== userId
  ) {
    throw new ApiError(403, 'Access denied');
  }

  res.status(200).json(appointment);
}

async function handlePUT(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any,
  id: string
) {
  const appointment = await getAppointment(id);

  if (!appointment) {
    throw new ApiError(404, 'Appointment not found');
  }

  const { id: userId, role } = session.user;
  let updateData = req.body;

  // Check permissions
  if (role === UserRole.PATIENT && appointment.patientId !== userId) {
    throw new ApiError(403, 'Access denied');
  } else if (role === UserRole.DOCTOR && appointment.doctorId !== userId) {
    throw new ApiError(403, 'Access denied');
  }

  // Patients can only update certain fields
  if (role === UserRole.PATIENT) {
    const allowedFields = ['reasonForVisit', 'symptoms'];
    updateData = Object.keys(updateData)
      .filter(key => allowedFields.includes(key))
      .reduce((obj: any, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});
  }

  const updatedAppointment = await updateAppointment(id, updateData);

  res.status(200).json(updatedAppointment);
}

async function handleDELETE(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any,
  id: string
) {
  const appointment = await getAppointment(id);

  if (!appointment) {
    throw new ApiError(404, 'Appointment not found');
  }

  const { id: userId, role } = session.user;

  // Only patients (their own), doctors (their own), and admins can cancel
  if (
    role !== UserRole.ADMIN &&
    appointment.patientId !== userId &&
    appointment.doctorId !== userId
  ) {
    throw new ApiError(403, 'Access denied');
  }

  // Instead of deleting, mark as cancelled
  const updatedAppointment = await updateAppointment(id, {
    status: AppointmentStatus.CANCELLED,
  });

  res.status(200).json(updatedAppointment);
}

import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/session';
import { ApiError } from '@/lib/errors';
import {
  createAppointment,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
  getAllAppointments,
} from '@/models/appointment';
import { UserRole } from '@prisma/client';
import { sendAppointmentConfirmation } from '@/lib/email/sendAppointmentEmails';

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

    switch (method) {
      case 'GET':
        return await handleGET(req, res, session);
      case 'POST':
        return await handlePOST(req, res, session);
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

async function handleGET(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any
) {
  const { id: userId, role } = session.user;
  const { status, upcoming } = req.query;

  let appointments;

  if (role === UserRole.PATIENT) {
    appointments = await getAppointmentsByPatient(userId, {
      status: status as any,
      upcoming: upcoming === 'true',
    });
  } else if (role === UserRole.DOCTOR) {
    appointments = await getAppointmentsByDoctor(userId, {
      status: status as any,
    });
  } else if (role === UserRole.ADMIN) {
    appointments = await getAllAppointments({
      status: status as any,
    });
  } else {
    throw new ApiError(403, 'Forbidden');
  }

  res.status(200).json(appointments);
}

async function handlePOST(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any
) {
  const { id: userId, role } = session.user;
  const {
    doctorId,
    date,
    startTime,
    endTime,
    type,
    duration,
    reasonForVisit,
    symptoms,
  } = req.body;

  // Validate required fields
  if (!doctorId || !date || !startTime) {
    throw new ApiError(400, 'Missing required fields');
  }

  // Patients can only book for themselves, admins can book for anyone
  let patientId = userId;
  if (role === UserRole.ADMIN && req.body.patientId) {
    patientId = req.body.patientId;
  } else if (role !== UserRole.PATIENT && role !== UserRole.ADMIN) {
    throw new ApiError(403, 'Only patients and admins can book appointments');
  }

  const appointment = await createAppointment({
    patient: { connect: { id: patientId } },
    doctor: { connect: { id: doctorId } },
    date: new Date(date),
    startTime,
    endTime: endTime || calculateEndTime(startTime, duration || 30),
    type: type || 'IN_PERSON',
    duration: duration || 30,
    reasonForVisit,
    symptoms,
  });

  // Send confirmation email
  try {
    await sendAppointmentConfirmation(appointment);
  } catch (emailError) {
    console.error('Failed to send appointment confirmation:', emailError);
  }

  res.status(201).json(appointment);
}

function calculateEndTime(startTime: string, duration: number): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + duration;
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
}

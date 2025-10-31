import { prisma } from '@/lib/prisma';
import type { Appointment, AppointmentStatus, Prisma } from '@prisma/client';

export const createAppointment = async (
  data: Prisma.AppointmentCreateInput
): Promise<Appointment> => {
  return await prisma.appointment.create({
    data,
    include: {
      patient: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      doctor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const getAppointment = async (
  id: string
): Promise<Appointment | null> => {
  return await prisma.appointment.findUnique({
    where: { id },
    include: {
      patient: {
        select: {
          id: true,
          name: true,
          email: true,
          patientProfile: true,
        },
      },
      doctor: {
        select: {
          id: true,
          name: true,
          email: true,
          doctorProfile: true,
        },
      },
    },
  });
};

export const getAppointmentsByPatient = async (
  patientId: string
): Promise<Appointment[]> => {
  return await prisma.appointment.findMany({
    where: { patientId },
    include: {
      doctor: {
        select: {
          id: true,
          name: true,
          email: true,
          doctorProfile: true,
        },
      },
    },
    orderBy: {
      date: 'desc',
    },
  });
};

export const getAppointmentsByDoctor = async (
  doctorId: string,
  startDate?: Date,
  endDate?: Date
): Promise<Appointment[]> => {
  const where: Prisma.AppointmentWhereInput = { doctorId };

  if (startDate && endDate) {
    where.date = {
      gte: startDate,
      lte: endDate,
    };
  }

  return await prisma.appointment.findMany({
    where,
    include: {
      patient: {
        select: {
          id: true,
          name: true,
          email: true,
          patientProfile: true,
        },
      },
    },
    orderBy: {
      date: 'asc',
    },
  });
};

export const getAllAppointments = async (
  filters?: {
    status?: AppointmentStatus;
    startDate?: Date;
    endDate?: Date;
  }
): Promise<Appointment[]> => {
  const where: Prisma.AppointmentWhereInput = {};

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.startDate && filters?.endDate) {
    where.date = {
      gte: filters.startDate,
      lte: filters.endDate,
    };
  }

  return await prisma.appointment.findMany({
    where,
    include: {
      patient: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      doctor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      date: 'asc',
    },
  });
};

export const updateAppointment = async (
  id: string,
  data: Prisma.AppointmentUpdateInput
): Promise<Appointment> => {
  return await prisma.appointment.update({
    where: { id },
    data,
    include: {
      patient: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      doctor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const deleteAppointment = async (id: string): Promise<void> => {
  await prisma.appointment.delete({
    where: { id },
  });
};

export const getUpcomingAppointments = async (
  userId: string,
  userRole: 'PATIENT' | 'DOCTOR'
): Promise<Appointment[]> => {
  const now = new Date();
  const where: Prisma.AppointmentWhereInput = {
    date: { gte: now },
    status: { in: ['BOOKED', 'CONFIRMED'] },
  };

  if (userRole === 'PATIENT') {
    where.patientId = userId;
  } else {
    where.doctorId = userId;
  }

  return await prisma.appointment.findMany({
    where,
    include: {
      patient: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      doctor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      date: 'asc',
    },
    take: 10,
  });
};

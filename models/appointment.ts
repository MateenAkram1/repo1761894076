import { prisma } from '@/lib/prisma';
import { Prisma, AppointmentStatus } from '@prisma/client';

export const createAppointment = async (data: Prisma.AppointmentCreateInput) => {
  return await prisma.appointment.create({
    data,
    include: {
      patient: {
        select: {
          id: true,
          name: true,
          email: true,
          contactInfo: true,
        },
      },
      doctor: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
};

export const getAppointment = async (id: string) => {
  return await prisma.appointment.findUnique({
    where: { id },
    include: {
      patient: {
        select: {
          id: true,
          name: true,
          email: true,
          contactInfo: true,
        },
      },
      doctor: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      payment: true,
    },
  });
};

export const updateAppointment = async (id: string, data: Prisma.AppointmentUpdateInput) => {
  return await prisma.appointment.update({
    where: { id },
    data,
    include: {
      patient: true,
      doctor: true,
    },
  });
};

export const deleteAppointment = async (id: string) => {
  return await prisma.appointment.delete({
    where: { id },
  });
};

export const getAppointmentsByPatient = async (patientId: string, filters?: {
  status?: AppointmentStatus;
  upcoming?: boolean;
}) => {
  const where: Prisma.AppointmentWhereInput = { patientId };
  
  if (filters?.status) {
    where.status = filters.status;
  }
  
  if (filters?.upcoming) {
    where.date = {
      gte: new Date(),
    };
  }

  return await prisma.appointment.findMany({
    where,
    include: {
      doctor: {
        select: {
          id: true,
          name: true,
          image: true,
          doctorProfile: {
            select: {
              specialty: true,
            },
          },
        },
      },
    },
    orderBy: {
      date: 'asc',
    },
  });
};

export const getAppointmentsByDoctor = async (doctorId: string, filters?: {
  status?: AppointmentStatus;
  date?: Date;
}) => {
  const where: Prisma.AppointmentWhereInput = { doctorId };
  
  if (filters?.status) {
    where.status = filters.status;
  }
  
  if (filters?.date) {
    const startOfDay = new Date(filters.date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(filters.date);
    endOfDay.setHours(23, 59, 59, 999);
    
    where.date = {
      gte: startOfDay,
      lte: endOfDay,
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
          contactInfo: true,
        },
      },
    },
    orderBy: {
      date: 'asc',
    },
  });
};

export const getAllAppointments = async (filters?: {
  status?: AppointmentStatus;
  startDate?: Date;
  endDate?: Date;
}) => {
  const where: Prisma.AppointmentWhereInput = {};
  
  if (filters?.status) {
    where.status = filters.status;
  }
  
  if (filters?.startDate || filters?.endDate) {
    where.date = {};
    if (filters.startDate) {
      where.date.gte = filters.startDate;
    }
    if (filters.endDate) {
      where.date.lte = filters.endDate;
    }
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

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const createDoctorProfile = async (data: Prisma.DoctorProfileCreateInput) => {
  return await prisma.doctorProfile.create({
    data,
    include: {
      user: true,
    },
  });
};

export const getDoctorProfile = async (userId: string) => {
  return await prisma.doctorProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          contactInfo: true,
        },
      },
    },
  });
};

export const updateDoctorProfile = async (userId: string, data: Prisma.DoctorProfileUpdateInput) => {
  return await prisma.doctorProfile.update({
    where: { userId },
    data,
    include: {
      user: true,
    },
  });
};

export const getAllDoctors = async (filters?: {
  specialty?: string;
  isAcceptingPatients?: boolean;
}) => {
  const where: Prisma.DoctorProfileWhereInput = {};
  
  if (filters?.specialty) {
    where.specialty = filters.specialty;
  }
  
  if (filters?.isAcceptingPatients !== undefined) {
    where.isAcceptingPatients = filters.isAcceptingPatients;
  }

  return await prisma.doctorProfile.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: {
      rating: 'desc',
    },
  });
};

export const getDoctorBySpecialty = async (specialty: string) => {
  return await prisma.doctorProfile.findMany({
    where: {
      specialty: {
        contains: specialty,
        mode: 'insensitive',
      },
      isAcceptingPatients: true,
    },
    include: {
      user: {
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

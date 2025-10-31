import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const createPatientProfile = async (data: Prisma.PatientProfileCreateInput) => {
  return await prisma.patientProfile.create({
    data,
    include: {
      user: true,
    },
  });
};

export const getPatientProfile = async (userId: string) => {
  return await prisma.patientProfile.findUnique({
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

export const updatePatientProfile = async (userId: string, data: Prisma.PatientProfileUpdateInput) => {
  return await prisma.patientProfile.update({
    where: { userId },
    data,
    include: {
      user: true,
    },
  });
};

export const getAllPatients = async () => {
  return await prisma.patientProfile.findMany({
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
    orderBy: {
      createdAt: 'desc',
    },
  });
};

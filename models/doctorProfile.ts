import { prisma } from '@/lib/prisma';
import type { DoctorProfile, Prisma } from '@prisma/client';

export const createDoctorProfile = async (
  data: Prisma.DoctorProfileCreateInput
): Promise<DoctorProfile> => {
  return await prisma.doctorProfile.create({
    data,
  });
};

export const getDoctorProfile = async (
  key: Prisma.DoctorProfileWhereUniqueInput
): Promise<DoctorProfile | null> => {
  return await prisma.doctorProfile.findUnique({
    where: key,
    include: {
      user: true,
    },
  });
};

export const getAllDoctors = async (): Promise<DoctorProfile[]> => {
  return await prisma.doctorProfile.findMany({
    where: {
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

export const getDoctorsBySpecialty = async (
  specialty: string
): Promise<DoctorProfile[]> => {
  return await prisma.doctorProfile.findMany({
    where: {
      specialty,
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

export const updateDoctorProfile = async (
  userId: string,
  data: Prisma.DoctorProfileUpdateInput
): Promise<DoctorProfile> => {
  return await prisma.doctorProfile.update({
    where: { userId },
    data,
  });
};

export const deleteDoctorProfile = async (userId: string): Promise<void> => {
  await prisma.doctorProfile.delete({
    where: { userId },
  });
};

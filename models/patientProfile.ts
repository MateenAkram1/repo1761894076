import { prisma } from '@/lib/prisma';
import type { PatientProfile, Prisma } from '@prisma/client';

export const createPatientProfile = async (
  data: Prisma.PatientProfileCreateInput
): Promise<PatientProfile> => {
  return await prisma.patientProfile.create({
    data,
  });
};

export const getPatientProfile = async (
  key: Prisma.PatientProfileWhereUniqueInput
): Promise<PatientProfile | null> => {
  return await prisma.patientProfile.findUnique({
    where: key,
  });
};

export const updatePatientProfile = async (
  userId: string,
  data: Prisma.PatientProfileUpdateInput
): Promise<PatientProfile> => {
  return await prisma.patientProfile.update({
    where: { userId },
    data,
  });
};

export const deletePatientProfile = async (userId: string): Promise<void> => {
  await prisma.patientProfile.delete({
    where: { userId },
  });
};

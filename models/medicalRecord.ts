import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const createMedicalRecord = async (data: Prisma.MedicalRecordCreateInput) => {
  return await prisma.medicalRecord.create({
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

export const getMedicalRecord = async (id: string) => {
  return await prisma.medicalRecord.findUnique({
    where: { id },
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

export const updateMedicalRecord = async (id: string, data: Prisma.MedicalRecordUpdateInput) => {
  return await prisma.medicalRecord.update({
    where: { id },
    data,
    include: {
      patient: true,
      doctor: true,
    },
  });
};

export const deleteMedicalRecord = async (id: string) => {
  return await prisma.medicalRecord.delete({
    where: { id },
  });
};

export const getMedicalRecordsByPatient = async (patientId: string) => {
  return await prisma.medicalRecord.findMany({
    where: { patientId },
    include: {
      doctor: {
        select: {
          id: true,
          name: true,
          doctorProfile: {
            select: {
              specialty: true,
            },
          },
        },
      },
    },
    orderBy: {
      visitDate: 'desc',
    },
  });
};

export const getMedicalRecordsByDoctor = async (doctorId: string) => {
  return await prisma.medicalRecord.findMany({
    where: { doctorId },
    include: {
      patient: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      visitDate: 'desc',
    },
  });
};

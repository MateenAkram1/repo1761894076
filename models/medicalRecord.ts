import { prisma } from '@/lib/prisma';
import type { MedicalRecord, Prisma } from '@prisma/client';

export const createMedicalRecord = async (
  data: Prisma.MedicalRecordCreateInput
): Promise<MedicalRecord> => {
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

export const getMedicalRecord = async (
  id: string
): Promise<MedicalRecord | null> => {
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

export const getMedicalRecordsByPatient = async (
  patientId: string
): Promise<MedicalRecord[]> => {
  return await prisma.medicalRecord.findMany({
    where: { patientId },
    include: {
      doctor: {
        select: {
          id: true,
          name: true,
          email: true,
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

export const getMedicalRecordsByDoctor = async (
  doctorId: string
): Promise<MedicalRecord[]> => {
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

export const updateMedicalRecord = async (
  id: string,
  data: Prisma.MedicalRecordUpdateInput
): Promise<MedicalRecord> => {
  return await prisma.medicalRecord.update({
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

export const deleteMedicalRecord = async (id: string): Promise<void> => {
  await prisma.medicalRecord.delete({
    where: { id },
  });
};

export const getAllMedicalRecords = async (): Promise<MedicalRecord[]> => {
  return await prisma.medicalRecord.findMany({
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
      visitDate: 'desc',
    },
  });
};

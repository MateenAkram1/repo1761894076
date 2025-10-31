import { prisma } from '@/lib/prisma';
import { Prisma, PaymentStatus } from '@prisma/client';

export const createPayment = async (data: Prisma.PaymentCreateInput) => {
  return await prisma.payment.create({
    data,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      appointment: true,
    },
  });
};

export const getPayment = async (id: string) => {
  return await prisma.payment.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      appointment: {
        include: {
          doctor: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
};

export const updatePayment = async (id: string, data: Prisma.PaymentUpdateInput) => {
  return await prisma.payment.update({
    where: { id },
    data,
  });
};

export const getPaymentsByUser = async (userId: string) => {
  return await prisma.payment.findMany({
    where: { userId },
    include: {
      appointment: {
        select: {
          id: true,
          date: true,
          startTime: true,
          type: true,
        },
      },
    },
    orderBy: {
      transactionDate: 'desc',
    },
  });
};

export const getPaymentByAppointment = async (appointmentId: string) => {
  return await prisma.payment.findUnique({
    where: { appointmentId },
  });
};

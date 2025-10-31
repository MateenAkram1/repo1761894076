import { prisma } from '@/lib/prisma';
import type { EducationalContent, Prisma } from '@prisma/client';

export const createEducationalContent = async (
  data: Prisma.EducationalContentCreateInput
): Promise<EducationalContent> => {
  return await prisma.educationalContent.create({
    data,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const getEducationalContent = async (
  slug: string
): Promise<EducationalContent | null> => {
  return await prisma.educationalContent.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          doctorProfile: {
            select: {
              specialty: true,
              qualifications: true,
            },
          },
        },
      },
    },
  });
};

export const getAllEducationalContent = async (
  published = true
): Promise<EducationalContent[]> => {
  return await prisma.educationalContent.findMany({
    where: published ? { published: true } : undefined,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
  });
};

export const getEducationalContentByCategory = async (
  category: string,
  published = true
): Promise<EducationalContent[]> => {
  return await prisma.educationalContent.findMany({
    where: {
      categories: { has: category },
      published: published ? true : undefined,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
  });
};

export const searchEducationalContent = async (
  query: string,
  published = true
): Promise<EducationalContent[]> => {
  return await prisma.educationalContent.findMany({
    where: {
      published: published ? true : undefined,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { summary: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
  });
};

export const updateEducationalContent = async (
  id: string,
  data: Prisma.EducationalContentUpdateInput
): Promise<EducationalContent> => {
  return await prisma.educationalContent.update({
    where: { id },
    data,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
};

export const deleteEducationalContent = async (id: string): Promise<void> => {
  await prisma.educationalContent.delete({
    where: { id },
  });
};

export const incrementViews = async (id: string): Promise<void> => {
  await prisma.educationalContent.update({
    where: { id },
    data: {
      views: { increment: 1 },
    },
  });
};

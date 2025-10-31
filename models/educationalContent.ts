import { prisma } from '@/lib/prisma';
import { Prisma, ContentStatus } from '@prisma/client';

export const createEducationalContent = async (data: Prisma.EducationalContentCreateInput) => {
  return await prisma.educationalContent.create({
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

export const getEducationalContent = async (id: string) => {
  return await prisma.educationalContent.findUnique({
    where: { id },
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

export const getEducationalContentBySlug = async (slug: string) => {
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
            },
          },
        },
      },
    },
  });
};

export const updateEducationalContent = async (id: string, data: Prisma.EducationalContentUpdateInput) => {
  return await prisma.educationalContent.update({
    where: { id },
    data,
  });
};

export const deleteEducationalContent = async (id: string) => {
  return await prisma.educationalContent.delete({
    where: { id },
  });
};

export const getAllEducationalContent = async (filters?: {
  status?: ContentStatus;
  category?: string;
  tag?: string;
  search?: string;
}) => {
  const where: Prisma.EducationalContentWhereInput = {};
  
  if (filters?.status) {
    where.status = filters.status;
  } else {
    // By default, only show published content
    where.status = ContentStatus.PUBLISHED;
  }
  
  if (filters?.category) {
    where.categories = {
      has: filters.category,
    };
  }
  
  if (filters?.tag) {
    where.tags = {
      has: filters.tag,
    };
  }
  
  if (filters?.search) {
    where.OR = [
      {
        title: {
          contains: filters.search,
          mode: 'insensitive',
        },
      },
      {
        contentBody: {
          contains: filters.search,
          mode: 'insensitive',
        },
      },
    ];
  }

  return await prisma.educationalContent.findMany({
    where,
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
      publicationDate: 'desc',
    },
  });
};

export const incrementViewCount = async (id: string) => {
  return await prisma.educationalContent.update({
    where: { id },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  });
};

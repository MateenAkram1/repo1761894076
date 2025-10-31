import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/session';
import { ApiError } from '@/lib/errors';
import {
  createEducationalContent,
  getAllEducationalContent,
} from '@/models/educationalContent';
import { UserRole, ContentStatus } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method } = req;

    switch (method) {
      case 'GET':
        return await handleGET(req, res);
      case 'POST':
        return await handlePOST(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    res.status(statusCode).json({ error: message });
  }
}

async function handleGET(req: NextApiRequest, res: NextApiResponse) {
  const { status, category, tag, search } = req.query;

  const session = await getSession(req, res);
  
  // Determine if user can see draft content
  const canSeeDrafts = session?.user?.role === UserRole.DOCTOR || 
                       session?.user?.role === UserRole.ADMIN;

  const content = await getAllEducationalContent({
    status: canSeeDrafts ? (status as ContentStatus) : ContentStatus.PUBLISHED,
    category: category as string,
    tag: tag as string,
    search: search as string,
  });

  res.status(200).json(content);
}

async function handlePOST(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);

  if (!session) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { id: userId, role } = session.user;

  // Only doctors and admins can create content
  if (role !== UserRole.DOCTOR && role !== UserRole.ADMIN) {
    throw new ApiError(403, 'Only doctors and admins can create educational content');
  }

  const {
    title,
    slug,
    contentBody,
    excerpt,
    categories,
    tags,
    featuredImage,
    status,
    publicationDate,
    readingTime,
  } = req.body;

  if (!title || !slug || !contentBody) {
    throw new ApiError(400, 'Title, slug, and content body are required');
  }

  const content = await createEducationalContent({
    title,
    slug,
    contentBody,
    excerpt,
    categories: categories || [],
    tags: tags || [],
    featuredImage,
    status: status || ContentStatus.DRAFT,
    publicationDate: publicationDate ? new Date(publicationDate) : undefined,
    readingTime,
    author: { connect: { id: userId } },
  });

  res.status(201).json(content);
}

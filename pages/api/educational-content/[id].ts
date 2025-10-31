import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/session';
import { ApiError } from '@/lib/errors';
import {
  getEducationalContent,
  updateEducationalContent,
  deleteEducationalContent,
  incrementViewCount,
} from '@/models/educationalContent';
import { UserRole } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method } = req;
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      throw new ApiError(400, 'Invalid content ID');
    }

    switch (method) {
      case 'GET':
        return await handleGET(req, res, id);
      case 'PUT':
        return await handlePUT(req, res, id);
      case 'DELETE':
        return await handleDELETE(req, res, id);
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    res.status(statusCode).json({ error: message });
  }
}

async function handleGET(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  const content = await getEducationalContent(id);

  if (!content) {
    throw new ApiError(404, 'Content not found');
  }

  // Increment view count
  await incrementViewCount(id);

  res.status(200).json(content);
}

async function handlePUT(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  const session = await getSession(req, res);

  if (!session) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { role } = session.user;

  // Only doctors and admins can update content
  if (role !== UserRole.DOCTOR && role !== UserRole.ADMIN) {
    throw new ApiError(403, 'Only doctors and admins can update educational content');
  }

  const updatedContent = await updateEducationalContent(id, {
    ...req.body,
    lastUpdatedDate: new Date(),
  });

  res.status(200).json(updatedContent);
}

async function handleDELETE(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  const session = await getSession(req, res);

  if (!session) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { role } = session.user;

  // Only admins can delete content
  if (role !== UserRole.ADMIN) {
    throw new ApiError(403, 'Only admins can delete educational content');
  }

  await deleteEducationalContent(id);

  res.status(200).json({ message: 'Content deleted successfully' });
}

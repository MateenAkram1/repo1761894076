import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/session';
import {
  getEducationalContent,
  updateEducationalContent,
  deleteEducationalContent,
  incrementViews,
} from '@/models/educationalContent';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { slug } = req.query;

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Invalid slug' });
  }

  try {
    switch (method) {
      case 'GET':
        return await handleGET(req, res, slug);
      case 'PUT':
        return await handlePUT(req, res, slug);
      case 'DELETE':
        return await handleDELETE(req, res, slug);
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return res.status(500).json({ error: message });
  }
}

async function handleGET(
  req: NextApiRequest,
  res: NextApiResponse,
  slug: string
) {
  const content = await getEducationalContent(slug);

  if (!content) {
    return res.status(404).json({ error: 'Content not found' });
  }

  // Increment views
  await incrementViews(content.id);

  return res.status(200).json({ data: content });
}

async function handlePUT(
  req: NextApiRequest,
  res: NextApiResponse,
  slug: string
) {
  const session = await getSession(req, res);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Only doctors and admins can update content
  if (session.user.userRole !== 'DOCTOR' && session.user.userRole !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const content = await getEducationalContent(slug);

  if (!content) {
    return res.status(404).json({ error: 'Content not found' });
  }

  // Only author or admin can update
  if (session.user.userRole !== 'ADMIN' && session.user.id !== content.authorId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const updateData: any = {};

  if (req.body.title) updateData.title = req.body.title;
  if (req.body.slug) updateData.slug = req.body.slug;
  if (req.body.content) updateData.content = req.body.content;
  if (req.body.summary) updateData.summary = req.body.summary;
  if (req.body.categories) updateData.categories = req.body.categories;
  if (req.body.tags) updateData.tags = req.body.tags;
  if (req.body.featuredImage) updateData.featuredImage = req.body.featuredImage;
  if (req.body.published !== undefined) {
    updateData.published = req.body.published;
    if (req.body.published && !content.publishedAt) {
      updateData.publishedAt = new Date();
    }
  }
  if (req.body.readingTime) updateData.readingTime = req.body.readingTime;

  const updatedContent = await updateEducationalContent(content.id, updateData);

  return res.status(200).json({ data: updatedContent });
}

async function handleDELETE(
  req: NextApiRequest,
  res: NextApiResponse,
  slug: string
) {
  const session = await getSession(req, res);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Only admins can delete content
  if (session.user.userRole !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const content = await getEducationalContent(slug);

  if (!content) {
    return res.status(404).json({ error: 'Content not found' });
  }

  await deleteEducationalContent(content.id);

  return res.status(200).json({ data: { message: 'Content deleted successfully' } });
}

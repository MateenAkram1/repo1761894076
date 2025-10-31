import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/session';
import {
  createEducationalContent,
  getAllEducationalContent,
  getEducationalContentByCategory,
  searchEducationalContent,
} from '@/models/educationalContent';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        return await handleGET(req, res);
      case 'POST':
        return await handlePOST(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return res.status(500).json({ error: message });
  }
}

async function handleGET(req: NextApiRequest, res: NextApiResponse) {
  const { category, search, published } = req.query;

  const publishedOnly = published !== 'false';

  if (search && typeof search === 'string') {
    const content = await searchEducationalContent(search, publishedOnly);
    return res.status(200).json({ data: content });
  }

  if (category && typeof category === 'string') {
    const content = await getEducationalContentByCategory(category, publishedOnly);
    return res.status(200).json({ data: content });
  }

  const content = await getAllEducationalContent(publishedOnly);
  return res.status(200).json({ data: content });
}

async function handlePOST(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Only doctors and admins can create content
  if (session.user.userRole !== 'DOCTOR' && session.user.userRole !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const {
    title,
    slug,
    content,
    summary,
    categories,
    tags,
    featuredImage,
    published,
    readingTime,
  } = req.body;

  if (!title || !slug || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const educationalContent = await createEducationalContent({
    title,
    slug,
    content,
    summary,
    categories: categories || [],
    tags: tags || [],
    featuredImage,
    published: published || false,
    publishedAt: published ? new Date() : undefined,
    readingTime,
    author: { connect: { id: session.user.id } },
  });

  return res.status(201).json({ data: educationalContent });
}

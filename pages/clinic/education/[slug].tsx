import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import type { NextPageWithLayout } from 'types';

interface EducationalContent {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string | null;
  categories: string[];
  tags: string[];
  featuredImage: string | null;
  publishedAt: string | null;
  readingTime: number | null;
  views: number;
  author: {
    id: string;
    name: string;
    image: string | null;
    doctorProfile: {
      specialty: string;
      qualifications: string[];
    } | null;
  };
}

const ArticleDetail: NextPageWithLayout = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [article, setArticle] = useState<EducationalContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/educational-content/${slug}`);
      if (response.ok) {
        const result = await response.json();
        setArticle(result.data);
      }
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
          <Link href="/clinic/education" className="text-blue-600 hover:underline">
            Back to Education
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/clinic/education" className="text-white hover:underline mb-4 inline-block">
            ? Back to Education
          </Link>
          <div className="flex flex-wrap gap-2 mb-4">
            {article.categories.map((cat) => (
              <span
                key={cat}
                className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm"
              >
                {cat}
              </span>
            ))}
          </div>
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          <div className="flex items-center gap-4 text-sm opacity-90">
            <span>By Dr. {article.author.name}</span>
            {article.readingTime && <span>? {article.readingTime} min read</span>}
            <span>? {article.views} views</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {article.summary && (
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 rounded">
            <p className="text-lg text-gray-700">{article.summary}</p>
          </div>
        )}

        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }} />
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <h3 className="font-bold mb-4">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Info */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
              {article.author.image ? (
                <img
                  src={article.author.image}
                  alt={article.author.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                '?????'
              )}
            </div>
            <div>
              <h4 className="font-bold text-lg">Dr. {article.author.name}</h4>
              {article.author.doctorProfile && (
                <p className="text-gray-600">{article.author.doctorProfile.specialty}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
    },
  };
}

export default ArticleDetail;

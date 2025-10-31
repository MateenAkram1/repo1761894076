import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { NextPageWithLayout } from 'types';

interface EducationalContent {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  categories: string[];
  featuredImage: string | null;
  publishedAt: string | null;
  readingTime: number | null;
  views: number;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
}

const Education: NextPageWithLayout = () => {
  const [content, setContent] = useState<EducationalContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchContent();
  }, [selectedCategory, searchQuery]);

  const fetchContent = async () => {
    try {
      let url = '/api/educational-content?published=true';
      
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      } else if (selectedCategory !== 'all') {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }

      const response = await fetch(url);
      const result = await response.json();
      setContent(result.data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'All Topics',
    'Heart Disease',
    'Prevention',
    'Nutrition',
    'Exercise',
    'Medications',
    'Procedures',
    'Recovery',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Heart Health Education</h1>
          <p className="text-xl opacity-90">
            Learn about heart health, prevention, and treatment options
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(
                  category === 'All Topics' ? 'all' : category
                );
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                (selectedCategory === 'all' && category === 'All Topics') ||
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : content.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No articles found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.map((article) => (
              <Link
                key={article.id}
                href={`/clinic/education/${article.slug}`}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-6xl">
                  {article.featuredImage ? (
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    '??'
                  )}
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {article.categories.slice(0, 2).map((cat) => (
                      <span
                        key={cat}
                        className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  {article.summary && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.summary}
                    </p>
                  )}
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>By {article.author.name}</span>
                    {article.readingTime && (
                      <span>{article.readingTime} min read</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
    },
  };
}

export default Education;

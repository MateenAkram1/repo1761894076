import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import fetcher from '@/lib/fetcher';

interface EducationalContent {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  categories: string[];
  tags: string[];
  featuredImage: string | null;
  viewCount: number;
  publicationDate: string;
  readingTime: number;
  author: {
    name: string;
    image: string | null;
  };
}

export default function EducationPage() {
  const [content, setContent] = useState<EducationalContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadContent();
  }, [selectedCategory, searchTerm]);

  const loadContent = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);
      
      const data = await fetcher(`/api/educational-content?${params.toString()}`);
      setContent(data);
    } catch (error) {
      console.error('Failed to load content:', error);
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'all',
    'Heart Disease Prevention',
    'Nutrition & Diet',
    'Exercise & Fitness',
    'Medications',
    'Procedures & Treatments',
    'Living with Heart Conditions',
  ];

  return (
    <>
      <Head>
        <title>Patient Education - Heart Doctor Clinic</title>
        <meta name="description" content="Learn about heart health, prevention, and treatments through our comprehensive educational resources." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-red-600">Heart Doctor Clinic</h1>
              <nav className="flex gap-6">
                <Link href="/" className="text-gray-600 hover:text-red-600">
                  Home
                </Link>
                <Link href="/about" className="text-gray-600 hover:text-red-600">
                  About
                </Link>
                <Link href="/services" className="text-gray-600 hover:text-red-600">
                  Services
                </Link>
                <Link href="/doctors" className="text-gray-600 hover:text-red-600">
                  Doctors
                </Link>
                <Link href="/education" className="text-red-600 font-semibold">
                  Education
                </Link>
                <Link href="/contact" className="text-gray-600 hover:text-red-600">
                  Contact
                </Link>
                <Link href="/auth/join" className="text-red-600 hover:text-red-700 font-semibold">
                  Patient Portal
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-red-600 to-red-700 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Patient Education</h2>
              <p className="text-xl text-red-100 max-w-3xl mx-auto">
                Empowering you with knowledge about heart health and wellness
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Search and Filter */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full md:w-64 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Content Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : content.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No educational content available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.map((article) => (
                <Link key={article.id} href={`/education/${article.slug}`}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer h-full">
                    {article.featuredImage ? (
                      <img
                        src={article.featuredImage}
                        alt={article.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                        <svg className="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {article.categories.slice(0, 2).map((category) => (
                          <span
                            key={category}
                            className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          {article.author.image ? (
                            <img
                              src={article.author.image}
                              alt={article.author.name}
                              className="w-6 h-6 rounded-full mr-2"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-red-100 mr-2"></div>
                          )}
                          <span>{article.author.name}</span>
                        </div>
                        {article.readingTime && (
                          <span>{article.readingTime} min read</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-12 bg-red-600 rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Have Questions About Your Heart Health?</h2>
            <p className="text-xl text-red-100 mb-6">
              Schedule a consultation with one of our cardiologists today.
            </p>
            <Link
              href="/auth/join"
              className="inline-block bg-white text-red-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { locale } = context;

  return {
    props: {
      ...(locale && (await serverSideTranslations(locale, ['common']))),
    },
  };
}

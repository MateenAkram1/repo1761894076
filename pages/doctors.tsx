import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import fetcher from '@/lib/fetcher';

interface Doctor {
  id: string;
  specialty: string;
  bio: string;
  consultationFee: number;
  rating: number;
  reviewCount: number;
  experience: number;
  isAcceptingPatients: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadDoctors();
  }, [filter]);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? `?specialty=${filter}` : '';
      const data = await fetcher(`/api/doctors${params}`);
      setDoctors(data);
    } catch (error) {
      console.error('Failed to load doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const specialties = [
    'all',
    'Cardiology',
    'Interventional Cardiology',
    'Electrophysiology',
    'Heart Failure',
    'Preventive Cardiology',
  ];

  return (
    <>
      <Head>
        <title>Our Doctors - Heart Doctor Clinic</title>
        <meta name="description" content="Meet our experienced team of cardiologists dedicated to providing exceptional heart care." />
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
                <Link href="/doctors" className="text-red-600 font-semibold">
                  Doctors
                </Link>
                <Link href="/education" className="text-gray-600 hover:text-red-600">
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
              <h2 className="text-4xl font-bold text-white mb-4">Our Expert Team</h2>
              <p className="text-xl text-red-100 max-w-3xl mx-auto">
                Meet our board-certified cardiologists committed to your heart health
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Filter */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Specialty:
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="block w-full md:w-64 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            >
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty === 'all' ? 'All Specialties' : specialty}
                </option>
              ))}
            </select>
          </div>

          {/* Doctors Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No doctors found. Please check back later.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      {doctor.user.image ? (
                        <img
                          src={doctor.user.image}
                          alt={doctor.user.name}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                          <span className="text-2xl font-bold text-red-600">
                            {doctor.user.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="ml-4">
                        <h3 className="text-xl font-bold text-gray-900">Dr. {doctor.user.name}</h3>
                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {doctor.experience && (
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Experience:</span> {doctor.experience} years
                        </p>
                      )}
                      {doctor.rating > 0 && (
                        <div className="flex items-center">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(doctor.rating) ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            ({doctor.reviewCount} reviews)
                          </span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                            doctor.isAcceptingPatients
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {doctor.isAcceptingPatients ? 'Accepting Patients' : 'Not Accepting'}
                        </span>
                      </div>
                    </div>

                    {doctor.bio && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{doctor.bio}</p>
                    )}

                    {doctor.isAcceptingPatients && (
                      <Link
                        href="/auth/join"
                        className="block w-full text-center bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition"
                      >
                        Book Appointment
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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

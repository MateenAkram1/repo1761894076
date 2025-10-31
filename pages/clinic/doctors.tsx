import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { NextPageWithLayout } from 'types';
import { DoctorProfile } from '@prisma/client';

interface DoctorWithUser extends DoctorProfile {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

const Doctors: NextPageWithLayout = () => {
  const [doctors, setDoctors] = useState<DoctorWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');

  useEffect(() => {
    fetchDoctors();
  }, [selectedSpecialty]);

  const fetchDoctors = async () => {
    try {
      const url =
        selectedSpecialty === 'all'
          ? '/api/doctors'
          : `/api/doctors?specialty=${selectedSpecialty}`;
      const response = await fetch(url);
      const result = await response.json();
      setDoctors(result.data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const specialties = [
    'All Specialties',
    'Interventional Cardiology',
    'Electrophysiology',
    'Heart Failure',
    'Preventive Cardiology',
    'Pediatric Cardiology',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Our Doctors</h1>
          <p className="text-xl opacity-90">
            Meet our team of experienced cardiac specialists
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2">
          {specialties.map((specialty) => (
            <button
              key={specialty}
              onClick={() =>
                setSelectedSpecialty(
                  specialty === 'All Specialties' ? 'all' : specialty
                )
              }
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                (selectedSpecialty === 'all' && specialty === 'All Specialties') ||
                selectedSpecialty === specialty
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No doctors found in this specialty.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="w-24 h-24 rounded-full bg-blue-100 mx-auto mb-4 flex items-center justify-center text-4xl">
                    {doctor.user.image ? (
                      <img
                        src={doctor.user.image}
                        alt={doctor.user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      '?????'
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-center mb-1">
                    Dr. {doctor.user.name}
                  </h3>
                  <p className="text-blue-600 text-center font-medium mb-4">
                    {doctor.specialty}
                  </p>
                  {doctor.bio && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {doctor.bio}
                    </p>
                  )}
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    {doctor.yearsOfExperience && (
                      <div>
                        <strong>Experience:</strong> {doctor.yearsOfExperience} years
                      </div>
                    )}
                    {doctor.languages && doctor.languages.length > 0 && (
                      <div>
                        <strong>Languages:</strong> {doctor.languages.join(', ')}
                      </div>
                    )}
                    {doctor.consultationFee && (
                      <div>
                        <strong>Consultation Fee:</strong> ${doctor.consultationFee}
                      </div>
                    )}
                  </div>
                  {doctor.qualifications && doctor.qualifications.length > 0 && (
                    <div className="mb-4">
                      <p className="font-semibold text-sm mb-1">Qualifications:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {doctor.qualifications.slice(0, 3).map((qual, idx) => (
                          <li key={idx}>? {qual}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {doctor.isAcceptingPatients && (
                    <Link
                      href="/auth/join"
                      className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
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
  );
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
    },
  };
}

export default Doctors;

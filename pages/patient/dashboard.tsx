import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getSession } from '@/lib/session';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import fetcher from '@/lib/fetcher';
import { UserRole } from '@prisma/client';

export default function PatientDashboard() {
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const appointmentsData = await fetcher('/api/appointments?upcoming=true');
      setUpcomingAppointments(appointmentsData.slice(0, 3));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Patient Dashboard - Heart Doctor Clinic</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-red-600">Patient Portal</h1>
              <nav className="flex gap-6">
                <Link href="/patient/dashboard" className="text-red-600 font-semibold">
                  Dashboard
                </Link>
                <Link href="/patient/appointments" className="text-gray-600 hover:text-red-600">
                  Appointments
                </Link>
                <Link href="/patient/records" className="text-gray-600 hover:text-red-600">
                  Medical Records
                </Link>
                <Link href="/education" className="text-gray-600 hover:text-red-600">
                  Education
                </Link>
                <Link href="/api/auth/signout" className="text-gray-600 hover:text-red-600">
                  Sign Out
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome to Your Dashboard</h2>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Link
              href="/patient/appointments/new"
              className="bg-red-600 text-white p-6 rounded-lg shadow-md hover:bg-red-700 transition"
            >
              <div className="flex items-center">
                <svg className="w-8 h-8 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <h3 className="font-bold text-lg">Book Appointment</h3>
                  <p className="text-sm text-red-100">Schedule a consultation</p>
                </div>
              </div>
            </Link>

            <Link
              href="/patient/records"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="flex items-center">
                <svg className="w-8 h-8 mr-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Medical Records</h3>
                  <p className="text-sm text-gray-600">View your health history</p>
                </div>
              </div>
            </Link>

            <Link
              href="/education"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="flex items-center">
                <svg className="w-8 h-8 mr-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Health Education</h3>
                  <p className="text-sm text-gray-600">Learn about heart health</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Upcoming Appointments</h3>
              <Link href="/patient/appointments" className="text-red-600 hover:text-red-700 text-sm font-semibold">
                View All
              </Link>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
            ) : upcomingAppointments.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No upcoming appointments</p>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="border-l-4 border-red-600 pl-4 py-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          Dr. {appointment.doctor.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.startTime}
                        </p>
                        <p className="text-sm text-gray-500">
                          {appointment.type === 'TELEHEALTH' ? 'Telehealth' : 'In-Person'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        appointment.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'BOOKED' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Health Tips */}
          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Heart Health Tip of the Day</h3>
            <p className="text-gray-700 mb-4">
              Regular physical activity is one of the best things you can do for your heart health. 
              Aim for at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous 
              aerobic activity per week.
            </p>
            <Link href="/education" className="text-red-600 hover:text-red-700 font-semibold">
              Learn more about heart health ?
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { locale, req, res } = context;
  const session = await getSession(req, res);

  if (!session || session.user.role !== UserRole.PATIENT) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...(locale && (await serverSideTranslations(locale, ['common']))),
    },
  };
}

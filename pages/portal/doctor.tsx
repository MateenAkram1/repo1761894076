import { GetServerSidePropsContext } from 'next';
import { getSession } from '@/lib/session';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { NextPageWithLayout } from 'types';

interface Appointment {
  id: string;
  date: string;
  duration: number;
  type: string;
  status: string;
  reason: string | null;
  patient: {
    name: string;
  };
}

const DoctorDashboard: NextPageWithLayout = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Get today's date range
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const response = await fetch(
        `/api/appointments?role=DOCTOR&startDate=${today.toISOString()}&endDate=${tomorrow.toISOString()}`
      );
      const data = await response.json();
      setAppointments(data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const todayAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.date);
    const today = new Date();
    return (
      aptDate.toDateString() === today.toDateString() &&
      apt.status !== 'CANCELLED'
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Doctor Dashboard</h1>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="text-3xl mb-2">??</div>
            <div className="text-2xl font-bold">{todayAppointments.length}</div>
            <div className="text-sm text-gray-600">Today's Appointments</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="text-3xl mb-2">?</div>
            <div className="text-2xl font-bold">
              {todayAppointments.filter((a) => a.status === 'CONFIRMED').length}
            </div>
            <div className="text-sm text-gray-600">Confirmed</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="text-3xl mb-2">?</div>
            <div className="text-2xl font-bold">
              {todayAppointments.filter((a) => a.status === 'COMPLETED').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="text-3xl mb-2">??</div>
            <div className="text-2xl font-bold">
              {todayAppointments.filter((a) => a.type === 'TELEHEALTH').length}
            </div>
            <div className="text-sm text-gray-600">Telehealth</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/portal/doctor/schedule"
            className="bg-blue-600 text-white p-6 rounded-xl hover:bg-blue-700 transition-colors"
          >
            <div className="text-3xl mb-2">??</div>
            <h3 className="font-bold text-lg">My Schedule</h3>
            <p className="text-sm opacity-90">View and manage appointments</p>
          </Link>
          <Link
            href="/portal/doctor/patients"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl mb-2">??</div>
            <h3 className="font-bold text-lg">My Patients</h3>
            <p className="text-sm text-gray-600">View patient records</p>
          </Link>
          <Link
            href="/portal/doctor/content"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl mb-2">??</div>
            <h3 className="font-bold text-lg">Create Content</h3>
            <p className="text-sm text-gray-600">Share educational resources</p>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Today's Schedule</h2>
            {todayAppointments.length === 0 ? (
              <p className="text-gray-600">No appointments scheduled for today</p>
            ) : (
              <div className="space-y-4">
                {todayAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="font-semibold">{apt.patient.name}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(apt.date).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {' ? '}
                        {apt.duration} min
                        {' ? '}
                        {apt.type}
                      </div>
                      {apt.reason && (
                        <div className="text-sm text-gray-500 mt-1">{apt.reason}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          apt.status === 'CONFIRMED'
                            ? 'bg-green-100 text-green-700'
                            : apt.status === 'COMPLETED'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {apt.status}
                      </span>
                      {apt.type === 'TELEHEALTH' && (
                        <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                          Join Call
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context.req, context.res);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  const { locale } = context;

  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
    },
  };
}

export default DoctorDashboard;

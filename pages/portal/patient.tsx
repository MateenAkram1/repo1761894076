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
  doctor: {
    name: string;
    doctorProfile: {
      specialty: string;
    } | null;
  };
}

interface MedicalRecord {
  id: string;
  visitDate: string;
  chiefComplaint: string | null;
  visitNotes: string;
  doctor: {
    name: string;
  };
}

const PatientDashboard: NextPageWithLayout = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appointmentsRes, recordsRes] = await Promise.all([
        fetch('/api/appointments?role=PATIENT'),
        fetch('/api/medical-records'),
      ]);

      const appointmentsData = await appointmentsRes.json();
      const recordsData = await recordsRes.json();

      setAppointments(appointmentsData.data || []);
      setMedicalRecords(recordsData.data?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.date) > new Date() && apt.status !== 'CANCELLED'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Patient Dashboard</h1>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/portal/patient/book-appointment"
            className="bg-blue-600 text-white p-6 rounded-xl hover:bg-blue-700 transition-colors"
          >
            <div className="text-3xl mb-2">??</div>
            <h3 className="font-bold text-lg">Book Appointment</h3>
            <p className="text-sm opacity-90">Schedule a visit with our doctors</p>
          </Link>
          <Link
            href="/portal/patient/appointments"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl mb-2">???</div>
            <h3 className="font-bold text-lg">My Appointments</h3>
            <p className="text-sm text-gray-600">View and manage appointments</p>
          </Link>
          <Link
            href="/portal/patient/medical-records"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl mb-2">??</div>
            <h3 className="font-bold text-lg">Medical Records</h3>
            <p className="text-sm text-gray-600">Access your health records</p>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upcoming Appointments */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">Upcoming Appointments</h2>
              {upcomingAppointments.length === 0 ? (
                <p className="text-gray-600">No upcoming appointments</p>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.slice(0, 3).map((apt) => (
                    <div key={apt.id} className="border-l-4 border-blue-600 pl-4 py-2">
                      <div className="font-semibold">{new Date(apt.date).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-600">Dr. {apt.doctor.name}</div>
                      <div className="text-sm text-gray-500">
                        {apt.doctor.doctorProfile?.specialty} ? {apt.type}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link
                href="/portal/patient/appointments"
                className="block mt-4 text-blue-600 hover:underline"
              >
                View all appointments ?
              </Link>
            </div>

            {/* Recent Medical Records */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">Recent Medical Records</h2>
              {medicalRecords.length === 0 ? (
                <p className="text-gray-600">No medical records yet</p>
              ) : (
                <div className="space-y-4">
                  {medicalRecords.map((record) => (
                    <div key={record.id} className="border-l-4 border-green-600 pl-4 py-2">
                      <div className="font-semibold">
                        {new Date(record.visitDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-600">Dr. {record.doctor.name}</div>
                      {record.chiefComplaint && (
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {record.chiefComplaint}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <Link
                href="/portal/patient/medical-records"
                className="block mt-4 text-blue-600 hover:underline"
              >
                View all records ?
              </Link>
            </div>
          </div>
        )}

        {/* Health Resources */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">Heart Health Resources</h2>
          <p className="text-gray-600 mb-4">
            Learn more about maintaining a healthy heart through our educational resources
          </p>
          <Link
            href="/clinic/education"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Explore Resources
          </Link>
        </div>
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

  // Check if user has patient role
  // Note: Adjust this based on your actual session structure
  // if (session.user.userRole !== 'PATIENT') {
  //   return {
  //     redirect: {
  //       destination: '/dashboard',
  //       permanent: false,
  //     },
  //   };
  // }

  const { locale } = context;

  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
    },
  };
}

export default PatientDashboard;

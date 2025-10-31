import { GetServerSidePropsContext } from 'next';
import { getSession } from '@/lib/session';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { NextPageWithLayout } from 'types';

interface Stats {
  totalAppointments: number;
  totalPatients: number;
  totalDoctors: number;
  totalRecords: number;
}

const AdminDashboard: NextPageWithLayout = () => {
  const [stats, setStats] = useState<Stats>({
    totalAppointments: 0,
    totalPatients: 0,
    totalDoctors: 0,
    totalRecords: 0,
  });
  const [, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // In a real implementation, you'd have an API endpoint that returns these stats
      const [appointmentsRes, recordsRes] = await Promise.all([
        fetch('/api/appointments'),
        fetch('/api/medical-records'),
      ]);

      const appointmentsData = await appointmentsRes.json();
      const recordsData = await recordsRes.json();

      setStats({
        totalAppointments: appointmentsData.data?.length || 0,
        totalPatients: 0, // Would need separate endpoint
        totalDoctors: 0, // Would need separate endpoint
        totalRecords: recordsData.data?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="text-3xl mb-2">??</div>
            <div className="text-2xl font-bold">{stats.totalAppointments}</div>
            <div className="text-sm text-gray-600">Total Appointments</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="text-3xl mb-2">??</div>
            <div className="text-2xl font-bold">{stats.totalPatients}</div>
            <div className="text-sm text-gray-600">Total Patients</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="text-3xl mb-2">?????</div>
            <div className="text-2xl font-bold">{stats.totalDoctors}</div>
            <div className="text-sm text-gray-600">Total Doctors</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="text-3xl mb-2">??</div>
            <div className="text-2xl font-bold">{stats.totalRecords}</div>
            <div className="text-sm text-gray-600">Medical Records</div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/portal/admin/appointments"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl mb-2">??</div>
            <h3 className="font-bold text-lg">Manage Appointments</h3>
            <p className="text-sm text-gray-600">View and manage all appointments</p>
          </Link>
          <Link
            href="/portal/admin/patients"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl mb-2">??</div>
            <h3 className="font-bold text-lg">Manage Patients</h3>
            <p className="text-sm text-gray-600">View and manage patient records</p>
          </Link>
          <Link
            href="/portal/admin/doctors"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl mb-2">?????</div>
            <h3 className="font-bold text-lg">Manage Doctors</h3>
            <p className="text-sm text-gray-600">Manage doctor profiles and schedules</p>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/portal/admin/content"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl mb-2">??</div>
            <h3 className="font-bold text-lg">Manage Content</h3>
            <p className="text-sm text-gray-600">Educational content management</p>
          </Link>
          <Link
            href="/portal/admin/users"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl mb-2">??</div>
            <h3 className="font-bold text-lg">User Management</h3>
            <p className="text-sm text-gray-600">Manage user accounts and roles</p>
          </Link>
          <Link
            href="/portal/admin/reports"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl mb-2">??</div>
            <h3 className="font-bold text-lg">Reports & Analytics</h3>
            <p className="text-sm text-gray-600">View system reports and analytics</p>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="text-gray-600">
            <p>Activity log and audit trail would appear here</p>
          </div>
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

  const { locale } = context;

  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
    },
  };
}

export default AdminDashboard;

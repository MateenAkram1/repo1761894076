import Link from 'next/link';
import { type ReactElement } from 'react';
import type { NextPageWithLayout } from 'types';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import env from '@/lib/env';
import Head from 'next/head';

const Home: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Heart Care Excellence - Cardiac Clinic</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold text-blue-600">
                  ?? HeartCare Clinic
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/clinic/about" className="text-gray-700 hover:text-blue-600">
                  About
                </Link>
                <Link href="/clinic/doctors" className="text-gray-700 hover:text-blue-600">
                  Doctors
                </Link>
                <Link href="/clinic/education" className="text-gray-700 hover:text-blue-600">
                  Education
                </Link>
                <Link href="/auth/login" className="text-gray-700 hover:text-blue-600">
                  Sign In
                </Link>
                <Link
                  href="/auth/join"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Heart Care Excellence
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Comprehensive cardiac care from experienced specialists. 
                Your heart health is our priority.
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  href="/auth/join"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Book Appointment
                </Link>
                <Link
                  href="/clinic/doctors"
                  className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
                >
                  Meet Our Doctors
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-blue-600 text-4xl mb-4">??</div>
              <h3 className="text-xl font-bold mb-3">Expert Care</h3>
              <p className="text-gray-600">
                Board-certified cardiologists with years of experience in treating heart conditions.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-blue-600 text-4xl mb-4">??</div>
              <h3 className="text-xl font-bold mb-3">Telehealth</h3>
              <p className="text-gray-600">
                Virtual consultations available for your convenience and safety.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-blue-600 text-4xl mb-4">??</div>
              <h3 className="text-xl font-bold mb-3">Patient Portal</h3>
              <p className="text-gray-600">
                Access your medical records, test results, and appointment history online.
              </p>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-bold mb-2">Cardiac Consultations</h4>
                <p className="text-sm text-gray-600">Comprehensive heart health assessments</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-bold mb-2">Diagnostic Testing</h4>
                <p className="text-sm text-gray-600">ECG, Echocardiogram, Stress Tests</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-bold mb-2">Preventive Care</h4>
                <p className="text-sm text-gray-600">Risk assessment and lifestyle counseling</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-bold mb-2">Treatment Plans</h4>
                <p className="text-sm text-gray-600">Personalized cardiac care programs</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-blue-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Take Control of Your Heart Health?</h2>
            <p className="text-xl mb-8 opacity-90">
              Schedule your consultation today with one of our specialists
            </p>
            <Link
              href="/auth/join"
              className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // Redirect to login page if landing page is disabled
  if (env.hideLandingPage) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: true,
      },
    };
  }

  const { locale } = context;

  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
    },
  };
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default Home;

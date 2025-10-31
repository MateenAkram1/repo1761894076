import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us - Heart Doctor Clinic</title>
        <meta name="description" content="Learn about our heart health clinic, our mission, and our commitment to excellence in cardiac care." />
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
                <Link href="/about" className="text-red-600 font-semibold">
                  About
                </Link>
                <Link href="/services" className="text-gray-600 hover:text-red-600">
                  Services
                </Link>
                <Link href="/doctors" className="text-gray-600 hover:text-red-600">
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
              <h2 className="text-4xl font-bold text-white mb-4">About Heart Doctor Clinic</h2>
              <p className="text-xl text-red-100 max-w-3xl mx-auto">
                Dedicated to providing exceptional cardiac care with compassion and expertise
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Mission Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <div className="bg-white rounded-lg shadow-md p-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                At Heart Doctor Clinic, our mission is to provide world-class cardiovascular care to every patient who walks through our doors. We believe that heart health is fundamental to overall well-being, and we are committed to delivering personalized, evidence-based treatment plans tailored to each individual&apos;s unique needs.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We strive to create a welcoming environment where patients feel heard, respected, and empowered to take an active role in their cardiac health journey. Through cutting-edge technology, continuous education, and compassionate care, we aim to improve outcomes and enhance the quality of life for all our patients.
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Compassion</h3>
                <p className="text-gray-600">
                  We treat every patient with empathy, kindness, and respect, understanding the emotional aspects of heart health.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Excellence</h3>
                <p className="text-gray-600">
                  We maintain the highest standards of medical care through continuous learning and adoption of best practices.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Integrity</h3>
                <p className="text-gray-600">
                  We are honest, transparent, and ethical in all our interactions, building trust with every patient.
                </p>
              </div>
            </div>
          </div>

          {/* History Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our History</h2>
            <div className="bg-white rounded-lg shadow-md p-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Founded in 2010, Heart Doctor Clinic has grown from a small practice to a leading cardiovascular care center serving thousands of patients annually. Our journey began with a simple vision: to make exceptional heart care accessible to everyone in our community.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Over the years, we have expanded our services, welcomed renowned cardiologists to our team, and invested in state-of-the-art diagnostic and treatment technologies. Today, we are proud to offer comprehensive cardiac care ranging from preventive screenings to advanced interventional procedures, all under one roof.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-red-600 rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Take Care of Your Heart?</h2>
            <p className="text-xl text-red-100 mb-6">
              Schedule an appointment with one of our experienced cardiologists today.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/auth/join"
                className="inline-block bg-white text-red-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition"
              >
                Book Appointment
              </Link>
              <Link
                href="/contact"
                className="inline-block bg-red-700 text-white px-8 py-3 rounded-md font-semibold hover:bg-red-800 transition border-2 border-white"
              >
                Contact Us
              </Link>
            </div>
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

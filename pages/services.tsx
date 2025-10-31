import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';

const services = [
  {
    id: 1,
    title: 'Preventive Cardiology',
    description: 'Comprehensive heart health assessments, risk factor evaluation, and personalized prevention strategies to keep your heart healthy.',
    features: [
      'Heart health screenings',
      'Cholesterol management',
      'Blood pressure monitoring',
      'Lifestyle counseling',
      'Family history assessment',
    ],
  },
  {
    id: 2,
    title: 'Diagnostic Services',
    description: 'State-of-the-art diagnostic testing to accurately identify and assess cardiovascular conditions.',
    features: [
      'Electrocardiogram (ECG/EKG)',
      'Echocardiography',
      'Stress testing',
      'Holter monitoring',
      'Cardiac CT and MRI',
    ],
  },
  {
    id: 3,
    title: 'Interventional Cardiology',
    description: 'Advanced minimally invasive procedures to treat heart conditions without open-heart surgery.',
    features: [
      'Coronary angioplasty',
      'Stent placement',
      'Cardiac catheterization',
      'Pacemaker implantation',
      'Valve repair procedures',
    ],
  },
  {
    id: 4,
    title: 'Heart Failure Management',
    description: 'Comprehensive care and treatment plans for patients living with heart failure.',
    features: [
      'Medication management',
      'Device therapy',
      'Lifestyle modification programs',
      'Regular monitoring',
      'Advanced treatment options',
    ],
  },
  {
    id: 5,
    title: 'Arrhythmia Treatment',
    description: 'Specialized care for irregular heart rhythms including diagnosis and treatment options.',
    features: [
      'Rhythm monitoring',
      'Ablation procedures',
      'Pacemaker management',
      'Medication therapy',
      'Lifestyle interventions',
    ],
  },
  {
    id: 6,
    title: 'Cardiac Rehabilitation',
    description: 'Supervised programs to help patients recover after heart events and improve cardiovascular health.',
    features: [
      'Exercise programs',
      'Nutrition counseling',
      'Stress management',
      'Education sessions',
      'Ongoing support',
    ],
  },
  {
    id: 7,
    title: 'Telehealth Consultations',
    description: 'Convenient virtual appointments for follow-ups, consultations, and routine check-ins.',
    features: [
      'Video consultations',
      'Remote monitoring',
      'Prescription management',
      'Report reviews',
      'Health education',
    ],
  },
  {
    id: 8,
    title: 'Emergency Cardiac Care',
    description: '24/7 emergency services for acute cardiac events requiring immediate attention.',
    features: [
      'Rapid response team',
      'Advanced life support',
      'Emergency procedures',
      'Post-event care',
      'Family support',
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <Head>
        <title>Our Services - Heart Doctor Clinic</title>
        <meta name="description" content="Comprehensive cardiovascular services including preventive care, diagnostics, interventional procedures, and cardiac rehabilitation." />
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
                <Link href="/services" className="text-red-600 font-semibold">
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
              <h2 className="text-4xl font-bold text-white mb-4">Our Services</h2>
              <p className="text-xl text-red-100 max-w-3xl mx-auto">
                Comprehensive cardiovascular care tailored to your needs
              </p>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">What we offer:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-12 bg-red-600 rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Need More Information?</h2>
            <p className="text-xl text-red-100 mb-6">
              Contact us to learn more about our services or schedule a consultation.
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

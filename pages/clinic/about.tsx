import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import type { NextPageWithLayout } from 'types';

const About: NextPageWithLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">About Our Clinic</h1>
          <p className="text-xl opacity-90">
            Dedicated to providing exceptional cardiac care for over 20 years
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              To provide comprehensive, compassionate, and cutting-edge cardiac care to our 
              community. We strive to improve heart health through prevention, early detection, 
              and innovative treatment approaches while maintaining the highest standards of 
              patient care and safety.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Vision</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              To be the leading heart care center recognized for clinical excellence, 
              patient-centered care, and pioneering research in cardiovascular medicine. 
              We envision a healthier community where heart disease is prevented, detected 
              early, and managed effectively.
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-blue-600 text-5xl mb-4">??</div>
              <h3 className="font-bold text-xl mb-2">Compassion</h3>
              <p className="text-gray-600">
                We treat every patient with empathy and understanding
              </p>
            </div>
            <div className="text-center">
              <div className="text-blue-600 text-5xl mb-4">?</div>
              <h3 className="font-bold text-xl mb-2">Excellence</h3>
              <p className="text-gray-600">
                Committed to the highest standards of medical care
              </p>
            </div>
            <div className="text-center">
              <div className="text-blue-600 text-5xl mb-4">??</div>
              <h3 className="font-bold text-xl mb-2">Innovation</h3>
              <p className="text-gray-600">
                Embracing the latest advances in cardiac medicine
              </p>
            </div>
            <div className="text-center">
              <div className="text-blue-600 text-5xl mb-4">??</div>
              <h3 className="font-bold text-xl mb-2">Integrity</h3>
              <p className="text-gray-600">
                Honest, transparent, and ethical in all we do
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Facilities */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold mb-8">State-of-the-Art Facilities</h2>
        <div className="prose max-w-none text-gray-600">
          <p className="text-lg mb-4">
            Our clinic features the latest in cardiac diagnostic and treatment technology:
          </p>
          <ul className="space-y-2 text-lg">
            <li>Advanced echocardiography suites</li>
            <li>Nuclear cardiology imaging</li>
            <li>Cardiac catheterization laboratory</li>
            <li>Electrophysiology lab</li>
            <li>Cardiac rehabilitation center</li>
            <li>Modern patient consultation rooms</li>
            <li>Secure telehealth infrastructure</li>
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Experience the Difference</h2>
          <p className="text-xl mb-6 opacity-90">
            Join thousands of patients who trust us with their heart health
          </p>
          <Link
            href="/auth/join"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Become a Patient
          </Link>
        </div>
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

export default About;

import { sendEmail } from './sendEmail';

interface AppointmentData {
  id: string;
  date: Date;
  startTime: string;
  endTime?: string | null;
  type: string;
  patient: {
    name: string;
    email: string;
  };
  doctor: {
    name: string;
    email: string;
  };
  meetingLink?: string | null;
  reasonForVisit?: string | null;
}

export async function sendAppointmentConfirmation(appointment: AppointmentData) {
  const { patient, doctor, date, startTime, type, meetingLink } = appointment;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const appointmentType = type === 'TELEHEALTH' ? 'Telehealth' : 'In-Person';

  // Email to patient
  await sendEmail({
    to: patient.email,
    subject: 'Appointment Confirmation - Heart Doctor Clinic',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Appointment Confirmation</h2>
        <p>Dear ${patient.name},</p>
        <p>Your appointment has been successfully booked:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Doctor:</strong> Dr. ${doctor.name}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${startTime}</p>
          <p><strong>Type:</strong> ${appointmentType}</p>
          ${meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>` : ''}
        </div>
        <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
        <p>Best regards,<br/>Heart Doctor Clinic</p>
      </div>
    `,
  });

  // Email to doctor
  await sendEmail({
    to: doctor.email,
    subject: 'New Appointment Scheduled',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">New Appointment</h2>
        <p>Dear Dr. ${doctor.name},</p>
        <p>A new appointment has been scheduled:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Patient:</strong> ${patient.name}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${startTime}</p>
          <p><strong>Type:</strong> ${appointmentType}</p>
          ${appointment.reasonForVisit ? `<p><strong>Reason:</strong> ${appointment.reasonForVisit}</p>` : ''}
        </div>
        <p>Please review the appointment details in your dashboard.</p>
        <p>Best regards,<br/>Heart Doctor Clinic</p>
      </div>
    `,
  });
}

export async function sendAppointmentReminder(appointment: AppointmentData) {
  const { patient, doctor, date, startTime, type, meetingLink } = appointment;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const appointmentType = type === 'TELEHEALTH' ? 'Telehealth' : 'In-Person';

  await sendEmail({
    to: patient.email,
    subject: 'Appointment Reminder - Heart Doctor Clinic',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Appointment Reminder</h2>
        <p>Dear ${patient.name},</p>
        <p>This is a reminder of your upcoming appointment:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Doctor:</strong> Dr. ${doctor.name}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${startTime}</p>
          <p><strong>Type:</strong> ${appointmentType}</p>
          ${meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>` : ''}
        </div>
        <p>Please arrive 10 minutes early for in-person appointments.</p>
        <p>Best regards,<br/>Heart Doctor Clinic</p>
      </div>
    `,
  });
}

export async function sendAppointmentCancellation(appointment: AppointmentData) {
  const { patient, doctor, date, startTime } = appointment;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  await sendEmail({
    to: patient.email,
    subject: 'Appointment Cancellation - Heart Doctor Clinic',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Appointment Cancelled</h2>
        <p>Dear ${patient.name},</p>
        <p>Your appointment has been cancelled:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Doctor:</strong> Dr. ${doctor.name}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${startTime}</p>
        </div>
        <p>If you'd like to reschedule, please contact us or book online.</p>
        <p>Best regards,<br/>Heart Doctor Clinic</p>
      </div>
    `,
  });
}

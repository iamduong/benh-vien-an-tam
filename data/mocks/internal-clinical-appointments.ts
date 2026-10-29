import { getVietnamToday, toAppointmentIso } from "@/lib/booking/working-hours";
import type { ClinicalAppointment } from "@/types/internal-clinical";

const today = getVietnamToday();

function appointment(
  data: Omit<ClinicalAppointment, "appointmentAt" | "doctorNote"> & {
    time: string;
    doctorNote?: string;
  },
): ClinicalAppointment {
  const { time, doctorNote = "", ...rest } = data;
  return {
    ...rest,
    appointmentAt: new Date(toAppointmentIso(today, time)),
    doctorNote,
  };
}

export const mockInternalClinicalAppointments: ClinicalAppointment[] = [
  appointment({
    uuid: "9df649f8-a02d-41a4-a1ab-5a0a377ff101",
    patientName: "Nguyễn Văn Hải",
    gender: "Male",
    medicalCode: "BN-10231",
    note: "Tái khám theo lịch hẹn của bác sĩ.",
    time: "08:00",
    typeLabel: "Tái khám tim mạch",
    roomName: "P.203",
    status: "Done",
    doctorNote: "Đã hoàn tất thăm khám.",
  }),
  appointment({
    uuid: "9df649f8-a02d-41a4-a1ab-5a0a377ff102",
    patientName: "Lê Thị Thanh",
    gender: "Female",
    medicalCode: "BN-09128",
    note: "Khám theo lịch bác sĩ phụ trách.",
    time: "08:45",
    typeLabel: "Khám theo bác sĩ",
    roomName: "P.203",
    status: "Done",
  }),
  appointment({
    uuid: "9df649f8-a02d-41a4-a1ab-5a0a377ff103",
    patientName: "Nguyễn Thị Lan",
    gender: "Female",
    medicalCode: "BN-10248",
    note: "Đau ngực nhẹ khi vận động trong 3 ngày gần đây.",
    time: "09:30",
    typeLabel: "Khám theo bác sĩ",
    roomName: "P.203",
    status: "CheckedIn",
  }),
  appointment({
    uuid: "9df649f8-a02d-41a4-a1ab-5a0a377ff104",
    patientName: "Phạm Minh Đức",
    gender: "Male",
    medicalCode: "BN-08245",
    note: "Tái khám định kỳ.",
    time: "10:15",
    typeLabel: "Tái khám",
    roomName: "P.203",
    status: "Pending",
  }),
  appointment({
    uuid: "9df649f8-a02d-41a4-a1ab-5a0a377ff105",
    patientName: "Trần Thu Hương",
    gender: "Female",
    medicalCode: "BN-11408",
    note: "Khám theo lịch đã xác nhận.",
    time: "11:00",
    typeLabel: "Khám theo bác sĩ",
    roomName: "P.203",
    status: "Approved",
  }),
];

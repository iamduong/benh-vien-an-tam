import {
  AppointmentMedicalServiceStatus,
  type AppointmentMedicalService,
} from "@/types/models";

export const mockAppointmentMedicalServices: AppointmentMedicalService[] = [
  {
    uuid: "8e29df7b-900c-4e82-aee6-7fef0d5d1101",
    appointmentUuid: "b403f8b3-05aa-4368-a65f-fc57985c5103",
    medicalServiceUuid: "6fb2fb37-cf96-4926-b66a-bf81cce5ecb3",
    price: 180000,
    description: "Chỉ số đường huyết trong giới hạn theo dõi.",
    status: AppointmentMedicalServiceStatus.Completed,
  },
];

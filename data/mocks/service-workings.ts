import { mockMedicalServices } from "@/data/mocks/medical-services";
import { mockTimeWorkings } from "@/data/mocks/time-workings";
import type { ServiceWorking } from "@/types/models";

export const mockServiceWorkings: ServiceWorking[] = mockMedicalServices.flatMap((service, serviceIndex) =>
  mockTimeWorkings.slice(0, 6).map((working, workingIndex) => ({
    uuid: `33000000-${String(serviceIndex + 1).padStart(4, "0")}-4000-8000-${String(workingIndex + 1).padStart(12, "0")}`,
    serviceUuid: service.uuid,
    workingUuid: working.uuid,
  })),
);

import type AxiosMockAdapter from "axios-mock-adapter";
import { mockInternalClinicalAppointments } from "@/data/mocks/internal-clinical-appointments";
import { mockMedicalServices } from "@/data/mocks/medical-services";
import { mockMedicines } from "@/data/mocks/medicines";
import { getVietnamDateTimeParts } from "@/lib/booking/working-hours";
import type { ClinicalMedicalService } from "@/types/internal-clinical";

// In-memory store cho danh sách dịch vụ chỉ định của các ca khám
const clinicalMedicalServices: ClinicalMedicalService[] = [
    {
        uuid: "6217488b-bfe5-4754-b072-aa0424d7a101",
        appointmentUuid: "9df649f8-a02d-41a4-a1ab-5a0a377ff103",
        medicalServiceUuid: "d531fbd6-998a-49df-9e68-4388b8bf388b",
        name: "Siêu âm tổng quát",
        price: 450000,
        description: "",
        status: "InProgress",
    },
];

// In-memory store cho đơn thuốc theo appointmentUuid
const prescriptionsMap: Record<string, any> = {
    "9df649f8-a02d-41a4-a1ab-5a0a377ff103": {
        uuid: "pres-1",
        status: "Unpaid",
        note: "Tái khám sau 7 ngày nếu không đỡ.",
        details: [
            {
                uuid: "pd-1",
                medicineUuid: "med-1",
                medicineName: "Paracetamol 500mg",
                unit: "Viên",
                quantity: 10,
                quantityPerDose: 1,
                dosesPerDay: 2,
                duration: 5,
                note: "Uống khi sốt trên 38.5 độ",
            },
        ],
    },
};

export function registerInternalClinicalRoutes(mock: AxiosMockAdapter) {
    // 1. Lấy danh sách lịch khám theo ngày
    mock.onGet("/internal/clinical/appointments").reply((config) => {
        const date = typeof config.params?.date === "string" ? config.params.date : "";
        const items = mockInternalClinicalAppointments.filter(
            (item) => !date || getVietnamDateTimeParts(item.appointmentAt).date === date,
        );

        return [
            200,
            { data: items, message: "Lấy lịch khám được phân công thành công." },
        ];
    });

    // 2. Lấy chi tiết ca khám theo UUID
    mock
        .onGet(/^\/internal\/clinical\/appointments\/[^/]+?$/)
        .reply((config) => {
            // Đảm bảo không bắt nhầm các route con như /medical-services hay /prescription
            const urlPath = config.url?.split("?")[0] ?? "";
            const segments = urlPath.split("/");
            const uuid = decodeURIComponent(segments.pop() ?? "");

            const item = mockInternalClinicalAppointments.find(
                (appointment) => appointment.uuid === uuid,
            );

            return item
                ? [
                    200,
                    {
                        data: buildCaseDetail(item),
                        message: "Lấy thông tin ca khám thành công.",
                    },
                ]
                : [404, { message: "Không tìm thấy ca khám.", code: "NOT_FOUND" }];
        });

    // 3. Cập nhật trạng thái ca khám (Bắt đầu khám -> CheckedIn, Hủy ca -> Cancelled, Hoàn thành -> Done)
    mock
        .onPut(/^\/internal\/clinical\/appointments\/[^/]+\/status$/)
        .reply((config) => {
            const segments = config.url?.split("/") ?? [];
            const uuid = decodeURIComponent(segments.at(-2) ?? "");
            const body = parseBody<{ status?: string }>(config.data);
            const appointment = mockInternalClinicalAppointments.find(
                (item) => item.uuid === uuid,
            );

            if (!appointment) {
                return [404, { message: "Không tìm thấy ca khám." }];
            }

            // Kiểm tra nghiệp vụ khi bấm nút "Hoàn thành ca"
            if (body.status === "Done") {
                if (!appointment.doctorNote || !appointment.doctorNote.trim()) {
                    return [400, { message: "Vui lòng nhập thông tin chẩn đoán trước khi hoàn thành ca khám." }];
                }
                const services = clinicalMedicalServices.filter((s) => s.appointmentUuid === uuid);
                const allCompleted = services.every((s) => s.status === "Completed" && s.description?.trim());
                if (services.length > 0 && !allCompleted) {
                    return [400, { message: "Tất cả dịch vụ chỉ định phải hoàn thành và có kết quả đầy đủ." }];
                }
            }

            if (body.status) {
                appointment.status = body.status as any;
            }

            return [200, { data: true, message: "Cập nhật trạng thái ca khám thành công." }];
        });

    // 4. Thêm dịch vụ khám vào ca khám
    mock
        .onPost(/^\/internal\/clinical\/appointments\/[^/]+\/medical-services$/)
        .reply((config) => {
            const segments = config.url?.split("/") ?? [];
            const appointmentUuid = decodeURIComponent(segments.at(-2) ?? "");
            const body = parseBody<{ medicalServiceUuid?: string }>(config.data);
            const appointment = mockInternalClinicalAppointments.find(
                (item) => item.uuid === appointmentUuid,
            );
            const service = mockMedicalServices.find(
                (item) => item.uuid === body.medicalServiceUuid,
            );
            if (!appointment || !service) {
                return [404, { message: "Không tìm thấy ca khám hoặc dịch vụ." }];
            }
            if (
                clinicalMedicalServices.some(
                    (item) =>
                        item.appointmentUuid === appointmentUuid &&
                        item.medicalServiceUuid === service.uuid,
                )
            ) {
                return [409, { message: "Dịch vụ này đã được chỉ định cho ca khám." }];
            }

            const item: ClinicalMedicalService = {
                uuid: crypto.randomUUID(),
                appointmentUuid: appointmentUuid,
                medicalServiceUuid: service.uuid,
                name: service.name,
                price: service.price,
                description: "",
                status: "InProgress",
            };
            clinicalMedicalServices.push(item);
            return [201, { data: item, message: "Thêm chỉ định dịch vụ thành công." }];
        });

    // 5. Cập nhật dịch vụ khám (Nút "Lưu kết quả" hoặc "Hoàn tất dịch vụ")
    mock
        .onPut(
            /^\/internal\/clinical\/appointments\/[^/]+\/medical-services\/[^/]+$/,
        )
        .reply((config) => {
            const segments = config.url?.split("/") ?? [];
            const appointmentUuid = decodeURIComponent(segments.at(-3) ?? "");
            const uuid = decodeURIComponent(segments.at(-1) ?? "");
            const body = parseBody<{
                description?: string;
                status?: ClinicalMedicalService["status"];
            }>(config.data);

            const item = clinicalMedicalServices.find(
                (service) =>
                    service.uuid === uuid && service.appointmentUuid === appointmentUuid,
            );
            if (!item) return [404, { message: "Không tìm thấy dịch vụ chỉ định." }];

            const description = body.description?.trim() ?? item.description;

            // Nếu bấm hoàn tất dịch vụ mà chưa nhập kết quả -> Báo lỗi
            if (body.status === "Completed" && !description) {
                return [422, { message: "Vui lòng nhập kết quả trước khi hoàn tất dịch vụ." }];
            }

            item.description = description;
            if (body.status === "Completed" || body.status === "InProgress") {
                item.status = body.status;
            }

            return [200, { data: item, message: "Cập nhật dịch vụ thành công." }];
        });

    // 6. Lưu thông tin chẩn đoán (Nút "Lưu chẩn đoán")
    mock
        .onPost(/^\/internal\/clinical\/appointments\/[^/]+\/diagnosis$/)
        .reply((config) => {
            const segments = config.url?.split("/") ?? [];
            const uuid = decodeURIComponent(segments.at(-2) ?? "");
            const body = parseBody<{ doctorNote?: string }>(config.data);
            const appointment = mockInternalClinicalAppointments.find(
                (item) => item.uuid === uuid,
            );
            if (!appointment) return [404, { message: "Không tìm thấy ca khám." }];

            if (!body.doctorNote || !body.doctorNote.trim()) {
                return [400, { message: "Thông tin chẩn đoán không được để trống." }];
            }

            appointment.doctorNote = body.doctorNote.trim();
            return [200, { data: true, message: "Lưu chẩn đoán thành công." }];
        });

    // 7. Tìm kiếm thuốc (Hỗ trợ debounce, tối đa 10 kết quả)
    mock.onGet(/^\/internal\/clinical\/medicines\/search(?:\?.*)?$/).reply((config) => {
        const urlParams = new URLSearchParams(config.url?.split("?")[1] || "");
        const keyword = (config.params?.keyword || urlParams.get("keyword") || "").toLowerCase();

        const matched = mockMedicines
            .filter((m) => m.status === "Active" && m.name.toLowerCase().includes(keyword))
            .slice(0, 10)
            .map((m) => ({
                uuid: m.uuid,
                name: m.name,
                unit: m.unit,
            }));

        return [200, { data: matched, message: "Tìm kiếm thuốc thành công." }];
    });

    // 8. Lấy thông tin đơn thuốc của ca khám
    mock
        .onGet(/^\/internal\/clinical\/appointments\/[^/]+\/prescription$/)
        .reply((config) => {
            const segments = config.url?.split("/") ?? [];
            const uuid = decodeURIComponent(segments.at(-2) ?? "");
            const prescription = prescriptionsMap[uuid];
            if (!prescription) {
                return [404, { message: "Chưa có đơn thuốc." }];
            }
            return [200, { data: prescription, message: "Lấy đơn thuốc thành công." }];
        });

    // 9. Lưu đơn thuốc cho ca khám (Nút "Lưu đơn thuốc")
    mock
        .onPost(/^\/internal\/clinical\/appointments\/[^/]+\/prescription$/)
        .reply((config) => {
            const segments = config.url?.split("/") ?? [];
            const uuid = decodeURIComponent(segments.at(-2) ?? "");
            const body = parseBody<{
                note?: string;
                Items?: Array<{
                    medicineUuid: string;
                    quantity: number;
                    quantityPerDose: number;
                    dosesPerDay: number;
                    duration: number;
                    note: string;
                }>;
            }>(config.data);

            if (prescriptionsMap[uuid] && prescriptionsMap[uuid].status !== "Unpaid") {
                return [400, { message: "Đơn thuốc đã thanh toán hoặc đã hủy, không thể chỉnh sửa." }];
            }

            const newPrescription = {
                uuid: prescriptionsMap[uuid]?.uuid || crypto.randomUUID(),
                status: "Unpaid" as const,
                note: body.note ?? "",
                details: (body.Items ?? []).map((item, idx) => {
                    const med = mockMedicines.find((m) => m.uuid === item.medicineUuid);
                    return {
                        uuid: `pd-${Date.now()}-${idx}`,
                        medicineUuid: item.medicineUuid,
                        medicineName: med?.name ?? "Thuốc",
                        unit: med?.unit ?? "Viên",
                        quantity: item.quantity,
                        quantityPerDose: item.quantityPerDose,
                        dosesPerDay: item.dosesPerDay,
                        duration: item.duration,
                        note: item.note,
                    };
                }),
            };

            prescriptionsMap[uuid] = newPrescription;
            return [200, { data: newPrescription, message: "Lưu đơn thuốc thành công." }];
        });
}

function buildCaseDetail(
    appointment: (typeof mockInternalClinicalAppointments)[number],
) {
    return {
        ...appointment,
        medicalServices: clinicalMedicalServices.filter(
            (item) => item.appointmentUuid === appointment.uuid,
        ),
        availableMedicalServices: mockMedicalServices
            .filter((item) => item.status === "Active")
            .map((item) => ({ uuid: item.uuid, name: item.name, price: item.price })),
        availableMedicines: mockMedicines
            .filter((item) => item.status === "Active")
            .map((item) => ({ uuid: item.uuid, name: item.name, unit: item.unit })),
        prescription: prescriptionsMap[appointment.uuid] || null,
    };
}

function parseBody<T>(value: unknown): T {
    if (typeof value === "string") return JSON.parse(value) as T;
    return (value ?? {}) as T;
}
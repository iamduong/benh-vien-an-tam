"use client";

import {
    ArrowLeft,
    CheckCircle2,
    Clock3,
    FilePlus2,
    FlaskConical,
    LockKeyhole,
    Plus,
    Save,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
    DetailGrid,
    DetailItem,
    PortalAction,
    PortalPageHeader,
    PortalSection,
    StatusPill,
} from "@/components/internal/portal-ui";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getVietnamDateTimeParts } from "@/lib/booking/working-hours";
import { internalClinicalService } from "@/lib/services/appointment/InternalClinicalService";
import { cn } from "@/lib/utils";
import type {
    ClinicalAppointment,
    ClinicalCaseDetail,
    ClinicalMedicalService,
} from "@/types/internal-clinical";

type DetailState =
    | { status: "loading" }
    | { status: "success"; item: ClinicalCaseDetail }
    | { status: "error"; message: string };

export function AssignedCaseDetailScreen({ uuid }: { uuid: string }) {
    const [state, setState] = useState<DetailState>({ status: "loading" });
    const [selectedService, setSelectedService] = useState("");
    const [serviceError, setServiceError] = useState("");
    const [isAddingService, setIsAddingService] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        internalClinicalService
            .getAppointment(uuid, controller.signal)
            .then((item) => setState({ status: "success", item }))
            .catch((error: unknown) => {
                if (!controller.signal.aborted) {
                    setState({
                        status: "error",
                        message: error instanceof Error ? error.message : "Không thể tải ca khám.",
                    });
                }
            });
        return () => controller.abort();
    }, [uuid]);

    if (state.status === "loading") {
        return <p className="border bg-white p-8 text-center text-sm text-muted-foreground" > Đang tải thông tin ca khám...</p>;
    }

    if (state.status === "error") {
        return (
            <div className= "space-y-4 border bg-white p-8 text-center" >
            <p className="text-sm text-destructive" > { state.message } </p>
                < Link href = "/noi-bo/trang-tong/lich-kham" className = { buttonVariants({ variant: "outline" }) } >
                    <ArrowLeft aria-hidden="true" /> Quay lại lịch khám
                        </Link>
                        </div>
    );
    }

    const item = state.item;
    const dateTime = formatDateTime(item.appointmentAt);
    const canPrescribe = item.medicalServices.every(
        (service) => service.status === "Completed",
    );

    async function addMedicalService() {
        if (!selectedService) return;
        setIsAddingService(true);
        setServiceError("");
        try {
            const service = await internalClinicalService.addMedicalService(
                item.uuid,
                selectedService,
            );
            setState({
                status: "success",
                item: {
                    ...item,
                    medicalServices: [...item.medicalServices, service],
                },
            });
            setSelectedService("");
        } catch (error) {
            setServiceError(
                error instanceof Error ? error.message : "Không thể thêm dịch vụ.",
            );
        } finally {
            setIsAddingService(false);
        }
    }

    function updateMedicalService(service: ClinicalMedicalService) {
        setState({
            status: "success",
            item: {
                ...item,
                medicalServices: item.medicalServices.map((current) =>
                    current.uuid === service.uuid ? service : current,
                ),
            },
        });
    }

    return (
        <div className= "space-y-6" >
        <Link
        href="/noi-bo/trang-tong/lich-kham"
    className = { cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2")
}
      >
    <ArrowLeft aria-hidden="true" /> Lịch khám của tôi
        </Link>
        < PortalPageHeader
eyebrow = {`Ca đang xử lý · ${dateTime.time}`}
title = { item.patientName }
description = {`Mã y tế ${item.medicalCode} · ${genderLabel(item.gender)} · Lịch được phân công trực tiếp cho bạn.`}
actions = {
          <>
    <PortalAction>Hủy ca </PortalAction>
        < PortalAction variant = "default" > <CheckCircle2 />Hoàn thành ca</PortalAction >
            </>
        }
      />
    < div className = "grid gap-6 xl:grid-cols-[0.72fr_1.28fr]" >
        <div className="space-y-6" >
            <PortalSection title="Thông tin lượt khám" >
                <DetailGrid>
                <DetailItem label="Thời gian" value = {`${dateTime.time} · ${dateTime.date}`} />
                    < DetailItem label = "Phòng" value = { item.roomName } />
                        <DetailItem label="Loại lịch" value = { item.typeLabel } />
                            <DetailItem label="Trạng thái" value = {< StatusPill tone = "blue" > { statusLabel(item.status) } </StatusPill>} / >
                                <DetailItem label="Ghi chú đặt lịch" value = { item.note || "Không có ghi chú" } />
                                    <DetailItem label="UUID lịch" value = { item.uuid } />
                                        </DetailGrid>
                                        </PortalSection>
                                        < PortalSection title = "Lịch liên quan gần đây" >
                                            <div className="flex items-center gap-3 px-5 py-4 text-sm text-muted-foreground" >
                                                <Clock3 className="size-4 text-primary" /> Chưa có lịch liên quan gần đây.
            </div>
                                                    </PortalSection>
                                                    </div>
                                                    < div className = "space-y-6" >
                                                        <PortalSection
            title="Dịch vụ khám được chỉ định"
description = "Theo dõi kết quả X-quang, nội soi, xét nghiệm và các dịch vụ cận lâm sàng."
    >
    <div className="space-y-4 p-5" >
        <div className="flex flex-col gap-3 sm:flex-row" >
            <label className="min-w-0 flex-1" >
                <span className="sr-only" > Chọn dịch vụ khám </span>
                    < select
value = { selectedService }
onChange = {(event) => setSelectedService(event.target.value)}
className = "h-10 w-full rounded-md border bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
    >
    <option value="" > Chọn dịch vụ cần chỉ định </option>
{
    item.availableMedicalServices.map((service) => (
        <option key= { service.uuid } value = { service.uuid } >
        { service.name } · { formatPrice(service.price)
}
</option>
                    ))}
</select>
    </label>
    < Button
type = "button"
onClick = { addMedicalService }
disabled = {!selectedService || isAddingService}
                >
    <Plus aria-hidden="true" />
    { isAddingService? "Đang thêm...": "Thêm chỉ định" }
        </Button>
        </div>
{ serviceError ? <p className="text-sm text-destructive" > { serviceError } </p> : null }

{
    item.medicalServices.length ? (
        <div className= "space-y-3" >
        {
            item.medicalServices.map((service) => (
                <MedicalServiceResult
                      key= { service.uuid }
                      service = { service }
                      onUpdate = { updateMedicalService }
                />
                  ))
        }
        </div>
              ) : (
        <div className= "border border-dashed p-5 text-center text-sm text-muted-foreground" >
        Không có dịch vụ khám được chỉ định.Bác sĩ có thể kê đơn thuốc ngay.
                </div>
              )
}
</div>
    </PortalSection>

    < PortalSection
title = "Kê đơn cho ca khám"
description = "Đơn thuốc chỉ được kê khi tất cả dịch vụ khám đã hoàn tất."
    >
    {!canPrescribe ? (
        <div className= "mx-5 mt-5 flex gap-3 border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800" >
        <LockKeyhole className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <div>
            <p className="font-semibold" > Đang khóa kê đơn thuốc </p>
                < p className = "mt-1" > Vui lòng nhập kết quả và hoàn tất tất cả dịch vụ được chỉ định trước.</p>
                    </div>
                    </div>
            ) : null}
<fieldset disabled={ !canPrescribe } className = "space-y-5 p-5 disabled:opacity-55" >
    <div className="grid gap-4 sm:grid-cols-[1fr_7rem_7rem]" >
        <label className="space-y-2" >
            <span className="text-sm font-medium" > Thuốc </span>
                < select className = "h-10 w-full rounded-md border bg-white px-3 text-sm" >
                {
                    item.availableMedicines.map((medicine) => (
                        <option key= { medicine.uuid } value = { medicine.uuid } > { medicine.name } </option>
                    ))
                }
                    </select>
                    </label>
                    < Field label = "Số lượng" defaultValue = "10" type = "number" />
                        <Field label="Đơn vị" defaultValue = "Viên" />
                            </div>
                            < div className = "grid gap-4 sm:grid-cols-3" >
                                <Field label="Mỗi lần" defaultValue = "1" type = "number" />
                                    <Field label="Lần / ngày" defaultValue = "2" type = "number" />
                                        <Field label="Số ngày" defaultValue = "5" type = "number" />
                                            </div>
                                            < div className="space-y-2" > <Label htmlFor="case-medicine-note" > Hướng dẫn sử dụng </Label><Input id="case-medicine-note" defaultValue="Uống sau ăn sáng và tối" / > </div>
                                                < button type = "button" className = "flex w-full items-center justify-center gap-2 border border-dashed border-primary/40 bg-secondary/50 py-3 text-sm font-semibold text-primary hover:bg-secondary" > <FilePlus2 className="size-4" /> Thêm thuốc vào đơn </button>
                                                    < div className = "space-y-2" > <Label htmlFor="case-prescription-note" > Ghi chú đơn thuốc </Label><Textarea id="case-prescription-note" rows={4} placeholder="Lưu ý chung cho người bệnh" / > </div>
                                                        < div className = "flex justify-end" > <PortalAction variant="default" > <Save />Lưu đơn thuốc</PortalAction > </div>
                                                            </fieldset>
                                                            </PortalSection>
                                                            </div>
                                                            </div>
                                                            </div>
  );
}

function MedicalServiceResult({
    service,
    onUpdate,
}: {
    service: ClinicalMedicalService;
    onUpdate: (service: ClinicalMedicalService) => void;
}) {
    const [description, setDescription] = useState(service.description);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const isCompleted = service.status === "Completed";

    async function save(status: ClinicalMedicalService["status"]) {
        if (status === "Completed" && !description.trim()) {
            setError("Vui lòng nhập kết quả dịch vụ trước khi hoàn tất.");
            return;
        }
        setIsSaving(true);
        setError("");
        try {
            const updated = await internalClinicalService.updateMedicalService(
                service.appointmentUuid,
                service.uuid,
                { description: description, status: status },
            );
            setDescription(updated.description);
            onUpdate(updated);
        } catch (saveError) {
            setError(saveError instanceof Error ? saveError.message : "Không thể cập nhật dịch vụ.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <article className= "border bg-[#fbfdfe] p-4" >
        <div className="flex flex-wrap items-start justify-between gap-3" >
            <div className="flex min-w-0 gap-3" >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary text-primary" > <FlaskConical className="size-4" /> </span>
                    < div >
                    <h3 className="font-semibold text-[#173b57]" > { service.name } </h3>
                        < p className = "mt-1 text-xs text-muted-foreground" > { formatPrice(service.price) } </p>
                            </div>
                            </div>
                            < StatusPill tone = { isCompleted? "green": "amber" } > { isCompleted? "Đã xong": "Đang khám" } </StatusPill>
                                </div>
                                < div className = "mt-4 space-y-2" >
                                    <Label htmlFor={ `service-result-${service.uuid}` }> Kết quả dịch vụ </Label>
                                        < Textarea
    id = {`service-result-${service.uuid}`
}
rows = { 3}
value = { description }
disabled = { isCompleted || isSaving}
onChange = {(event) => setDescription(event.target.value)}
placeholder = "Nhập mô tả kết quả X-quang, nội soi, xét nghiệm..."
    />
    </div>
{ error ? <p className="mt-2 text-sm text-destructive" > { error } </p> : null }
{
    !isCompleted ? (
        <div className= "mt-3 flex flex-wrap justify-end gap-2" >
        <Button type="button" size = "sm" variant = "outline" disabled = { isSaving } onClick = {() => save("InProgress")
}> <Save />Lưu kết quả</Button >
    <Button type="button" size = "sm" disabled = { isSaving } onClick = {() => save("Completed")}> <CheckCircle2 />Hoàn tất dịch vụ</Button >
        </div>
      ) : null}
</article>
  );
}

function Field({ label, defaultValue, type = "text" }: { label: string; defaultValue: string; type?: string }) {
    const id = `case-${label.toLowerCase().replaceAll(" ", "-")}`;
    return <div className="space-y-2" > <Label htmlFor={ id }> { label } </Label><Input id={id} type={type} defaultValue={defaultValue} / > </div>;
}

function formatDateTime(value: Date) {
    const parts = getVietnamDateTimeParts(value);
    const [year, month, day] = parts.date.split("-");
    return { date: `${day}/${month}/${year}`, time: parts.time };
}

function genderLabel(gender: ClinicalAppointment["gender"]) {
    return gender === "Male" ? "Nam" : gender === "Female" ? "Nữ" : "Khác";
}

function statusLabel(status: ClinicalAppointment["status"]) {
    return {
        Approved: "Đã xác nhận",
        CheckedIn: "Đã check-in",
        Done: "Hoàn thành",
        Pending: "Chưa đến",
        Cancelled: "Đã hủy",
        Unconfirmed: "Chưa xác nhận",
    }[status];
}

function formatPrice(value: number) {
    return `${new Intl.NumberFormat("vi-VN").format(value)} đ`;
}

export type PortalIconName =
  | "dashboard"
  | "hospital"
  | "department"
  | "service"
  | "medicine"
  | "account"
  | "report"
  | "audit"
  | "room"
  | "appointment"
  | "prescription"
  | "review"
  | "patient"
  | "profile"
  | "payment"
  | "inventory"
  | "alert"
  | "provider"
  | "ticket"
  | "history"
  | "schedule"
  | "permission";

export type PortalNavigationItem = {
  slug: string;
  label: string;
  description: string;
  icon: PortalIconName;
};

export type PortalDefinition = {
  context: string;
  name: string;
  scope: string;
  description: string;
};

export type CombinedPortalArea = "system" | "branch" | "clinical" | "reception" | "inventory";

type CombinedPortalSection = {
  area: CombinedPortalArea;
  label: string;
  items: Array<PortalNavigationItem & { sourceSlug: string }>;
};

const item = (
  slug: string,
  sourceSlug: string,
  label: string,
  description: string,
  icon: PortalIconName,
): PortalNavigationItem & { sourceSlug: string } => ({ slug, sourceSlug, label, description, icon });

export const combinedPortalSections: CombinedPortalSection[] = [
  {
    area: "system",
    label: "Quản trị hệ thống",
    items: [
      item("tong-quan-he-thong", "tong-quan", "Tổng quan", "Theo dõi tình trạng vận hành và dữ liệu tổng hợp toàn hệ thống.", "dashboard"),
      item("co-so-y-te", "co-so-y-te", "Cơ sở y tế", "Quản lý chi nhánh và trạng thái hoạt động trên toàn hệ thống.", "hospital"),
      item("chuyen-khoa", "chuyen-khoa", "Chuyên khoa", "Quản lý danh mục chuyên khoa gốc dùng chung.", "department"),
      item("dich-vu", "dich-vu", "Dịch vụ", "Quản lý danh mục dịch vụ y tế gốc dùng chung.", "service"),
      item("thuoc", "thuoc", "Danh mục thuốc", "Quản lý danh mục thuốc dùng chung giữa các chi nhánh.", "medicine"),
      item("tai-khoan", "tai-khoan", "Tài khoản", "Quản lý tài khoản và quản trị viên chi nhánh.", "account"),
      item("bao-cao-he-thong", "bao-cao", "Báo cáo hệ thống", "Xem báo cáo tổng hợp không bao gồm nội dung lâm sàng chi tiết.", "report"),
      item("nhat-ky-he-thong", "nhat-ky-he-thong", "Nhật ký hệ thống", "Theo dõi audit log và các hành động quản trị quan trọng.", "audit"),
      item("khung-gio-lam-viec", "khung-gio-lam-viec", "Khung giờ làm việc", "Quản lý danh mục khung giờ dùng chung trong hệ thống.", "schedule"),
      item("phan-quyen", "phan-quyen", "Vai trò & quyền hạn", "Quản lý role và permission của cổng nội bộ.", "permission"),
    ],
  },
  {
    area: "branch",
    label: "Vận hành chi nhánh",
    items: [
      item("tong-quan-chi-nhanh", "tong-quan", "Tổng quan", "Theo dõi hoạt động khám chữa bệnh và vận hành trong chi nhánh.", "dashboard"),
      item("thong-tin-chi-nhanh", "thong-tin-chi-nhanh", "Thông tin chi nhánh", "Cập nhật thông tin và giờ làm việc của chi nhánh.", "hospital"),
      item("chuyen-khoa-dich-vu", "chuyen-khoa-dich-vu", "Chuyên khoa & dịch vụ", "Gán chuyên khoa và dịch vụ có sẵn cho chi nhánh.", "department"),
      item("phong-kham-chi-nhanh", "phong-kham", "Phòng khám", "Quản lý phòng và trạng thái sử dụng trong chi nhánh.", "room"),
      item("nhan-su", "nhan-su", "Nhân sự", "Quản lý tài khoản nhân sự thuộc phạm vi chi nhánh.", "account"),
      item("lich-hen-chi-nhanh", "lich-hen", "Lịch hẹn", "Theo dõi, xác nhận, điều phối và hủy lịch thuộc chi nhánh.", "appointment"),
      item("don-thuoc-chi-nhanh", "don-thuoc", "Đơn thuốc", "Xem đơn thuốc khi cần xử lý nghiệp vụ được phân quyền.", "prescription"),
      item("kho-thuoc", "kho-thuoc", "Kho thuốc", "Theo dõi tồn kho và duyệt phiếu nhập xuất của chi nhánh.", "inventory"),
      item("danh-gia-chi-nhanh", "danh-gia", "Đánh giá", "Kiểm duyệt đánh giá liên quan đến chi nhánh.", "review"),
      item("bao-cao-chi-nhanh", "bao-cao", "Báo cáo", "Xem báo cáo vận hành và tài chính trong phạm vi chi nhánh.", "report"),
      item("nhat-ky-chi-nhanh", "nhat-ky", "Nhật ký hoạt động", "Theo dõi audit log của chi nhánh.", "audit"),
      item("gio-lam-viec-benh-vien", "gio-lam-viec-benh-vien", "Giờ làm việc bệnh viện", "Cập nhật lịch hoạt động của bệnh viện.", "schedule"),
    ],
  },
  {
    area: "clinical",
    label: "Khám chữa bệnh",
    items: [
      item("tong-quan-bac-si", "tong-quan", "Tổng quan", "Theo dõi lịch khám và công việc chuyên môn được phân công.", "dashboard"),
      item("lich-kham", "lich-kham", "Lịch khám", "Xem lịch khám được phân công và đề xuất thay đổi khi cần.", "appointment"),
      item("ca-kham", "ca-kham", "Ca khám", "Xem thông tin tối thiểu của bệnh nhân và hoàn thành ca khám.", "patient"),
      item("don-thuoc-bac-si", "don-thuoc", "Đơn thuốc", "Tạo và quản lý đơn thuốc chưa thanh toán.", "prescription"),
      item("thuoc-kha-dung", "thuoc-kha-dung", "Thuốc khả dụng", "Tra cứu khả dụng của thuốc tại chi nhánh để hỗ trợ kê đơn.", "medicine"),
      item("ho-so-nghe-nghiep", "ho-so-nghe-nghiep", "Hồ sơ nghề nghiệp", "Cập nhật phần thông tin nghề nghiệp được cho phép.", "profile"),
      item("gio-lam-viec-bac-si", "gio-lam-viec-bac-si", "Giờ làm việc", "Xem lịch làm việc và tạo đơn đề nghị thay đổi.", "schedule"),
    ],
  },
  {
    area: "reception",
    label: "Tiếp nhận và điều phối",
    items: [
      item("tong-quan-tiep-nhan", "tong-quan", "Tổng quan", "Theo dõi lịch hẹn, lượt chờ và tình trạng phòng trong ngày.", "dashboard"),
      item("lich-hen-tiep-nhan", "lich-hen", "Lịch hẹn", "Tạo lịch thay bệnh nhân, xác nhận, đổi lịch và phân phòng.", "appointment"),
      item("tiep-nhan", "tiep-nhan", "Tiếp nhận", "Check-in và cập nhật trạng thái vận hành của lượt khám.", "patient"),
      item("phong-kham-tiep-nhan", "phong-kham", "Phòng khám", "Theo dõi và cập nhật trạng thái phòng trong chi nhánh.", "room"),
      item("thanh-toan-cap-thuoc", "thanh-toan-cap-thuoc", "Thanh toán & cấp thuốc", "Thu tiền và cấp thuốc theo đơn khi được giao nhiệm vụ.", "payment"),
      item("danh-gia-tiep-nhan", "danh-gia", "Đánh giá", "Hỗ trợ kiểm duyệt đánh giá khi có quyền phù hợp.", "review"),
    ],
  },
  {
    area: "inventory",
    label: "Kho thuốc",
    items: [
      item("tong-quan-kho", "tong-quan", "Tổng quan", "Theo dõi tồn kho, cảnh báo và hoạt động nhập xuất gần đây.", "dashboard"),
      item("ton-kho", "ton-kho", "Tồn kho", "Xem số lượng thuốc hiện có trong kho chi nhánh.", "inventory"),
      item("nha-cung-cap", "nha-cung-cap", "Nhà cung cấp", "Quản lý thông tin nhà cung cấp trong phạm vi được giao.", "provider"),
      item("phieu-nhap-xuat", "phieu-nhap-xuat", "Phiếu nhập xuất", "Tạo, sửa hoặc hủy phiếu khi còn chờ duyệt.", "ticket"),
      item("dieu-chinh-ton", "dieu-chinh-ton", "Điều chỉnh tồn", "Điều chỉnh tồn kho với lý do bắt buộc và audit log.", "medicine"),
      item("lich-su", "lich-su", "Lịch sử kho", "Tra cứu lịch sử nhập, xuất và biến động tồn kho.", "history"),
      item("bao-cao-kho", "bao-cao", "Báo cáo kho", "Xem báo cáo nhập, xuất, tồn và giá trị kho của chi nhánh.", "report"),
    ],
  },
];

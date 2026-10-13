import {
  Activity,
  ArrowRight,
  Baby,
  BookOpenText,
  Building2,
  CalendarCheck2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  ClipboardPlus,
  HeartPulse,
  Pill,
  Search,
  ShieldCheck,
  Stethoscope,
  UserRoundSearch,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { HomeFeaturedSections } from "@/components/home/home-featured-sections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const bookingPaths = [
  {
    title: "Đặt tại cơ sở",
    description: "Chọn nơi khám thuận tiện và thời gian phù hợp.",
    href: "/dat-lich/co-so-y-te",
    icon: Building2,
    border: "border-t-[#10a8e5]",
    tone: "bg-[#effaff] text-[#087fb8]",
  },
  {
    title: "Đặt theo bác sĩ",
    description: "Tìm theo chuyên môn, nơi làm việc và chi phí.",
    href: "/dat-lich/bac-si",
    icon: UserRoundSearch,
    border: "border-t-[#34a889]",
    tone: "bg-[#ecfaf6] text-[#23866e]",
  },
  {
    title: "Đặt theo dịch vụ",
    description: "Chọn dịch vụ cần thực hiện và cơ sở cung cấp.",
    href: "/dat-lich/dich-vu",
    icon: ClipboardPlus,
    border: "border-t-[#f5a623]",
    tone: "bg-[#fff8e7] text-[#a56800]",
  },
];

const assurances = [
  {
    icon: ShieldCheck,
    title: "Thông tin rõ ràng",
    description: "Đối chiếu cơ sở, bác sĩ và dịch vụ trước khi lựa chọn.",
  },
  {
    icon: CalendarCheck2,
    title: "Đặt lịch chủ động",
    description: "Chọn ngày, giờ phù hợp với kế hoạch của bạn.",
  },
  {
    icon: Stethoscope,
    title: "Đúng nhu cầu khám",
    description: "Nhiều cách tra cứu giúp bạn bắt đầu thuận tiện hơn.",
  },
];

const quickUtilities = [
  { label: "Tìm cơ sở", description: "Bệnh viện và phòng khám", href: "/co-so-y-te", icon: Building2 },
  { label: "Tìm bác sĩ", description: "Theo chuyên khoa", href: "/bac-si", icon: UserRoundSearch },
  { label: "Dịch vụ y tế", description: "Chi phí và nơi thực hiện", href: "/dich-vu", icon: ClipboardPlus },
  { label: "Lịch hẹn", description: "Theo dõi phiếu khám", href: "/tai-khoan/lich-hen", icon: CalendarDays },
  { label: "Đơn thuốc", description: "Xem hướng dẫn sử dụng", href: "/tai-khoan/don-thuoc", icon: Pill },
  { label: "Tra cứu nhanh", description: "Tìm trên toàn hệ thống", href: "/tim-kiem", icon: Search },
];

const healthArticles = [
  {
    category: "Sức khỏe tim mạch",
    title: "Những chỉ số nên theo dõi để chủ động bảo vệ trái tim",
    description: "Huyết áp, nhịp tim, đường huyết và mỡ máu là những dữ liệu quan trọng trong khám sức khỏe định kỳ.",
    image: "https://res.cloudinary.com/dzpgchw3n/image/upload/v1791856597/urwsaryesjkwxexiau27.jpg",
    icon: HeartPulse,
  },
  {
    category: "Chăm sóc gia đình",
    title: "Chuẩn bị gì trước khi đưa trẻ đi khám?",
    description: "Ghi lại triệu chứng, thuốc đang dùng và các mốc diễn tiến giúp buổi khám hiệu quả hơn.",
    image: "https://res.cloudinary.com/dzpgchw3n/image/upload/v1791856598/aw9nucvlohmatsu6ti22.jpg",
    icon: Baby,
  },
  {
    category: "Phòng bệnh chủ động",
    title: "Khám sức khỏe định kỳ không chỉ dành cho người có bệnh",
    description: "Lịch kiểm tra phù hợp giúp phát hiện sớm nguy cơ và xây dựng kế hoạch chăm sóc cá nhân.",
    image: "https://res.cloudinary.com/dzpgchw3n/image/upload/v1791856597/ubfkmnph8l9519zvyglz.jpg",
    icon: ClipboardCheck,
  },
];

export default function Home() {
  return (
    <>
      <section className="border-b border-primary/15">
        <div className="container-shell grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(24rem,0.9fr)] lg:py-20">
          <div className="max-w-3xl">
            <p className="inline-flex border-l-4 border-[#f5a623] pl-3 text-sm font-semibold text-primary">
              Nền tảng đặt lịch dành cho người bệnh
            </p>
            <h1 className="mt-3 text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-[3.5rem]">
              Chủ động tìm hiểu, dễ dàng đặt lịch khám
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Tra cứu cơ sở y tế, bác sĩ và dịch vụ trên một nền tảng thống nhất. So sánh thông tin cần thiết trước khi chọn lịch phù hợp.
            </p>

            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              <li className="flex items-start gap-2 text-sm font-medium leading-6">
                <CheckCircle2 aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" />
                Cơ sở và dịch vụ đang hoạt động
              </li>
              <li className="flex items-start gap-2 text-sm font-medium leading-6">
                <CheckCircle2 aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" />
                Quản lý lịch hẹn trong một tài khoản
              </li>
            </ul>

            <form
              action="/tim-kiem"
              method="get"
              role="search"
              className="mt-7 flex max-w-2xl flex-col gap-2 border border-primary/20 bg-card p-2 shadow-md sm:flex-row"
            >
              <div className="relative min-w-0 flex-1">
                <Search
                  aria-hidden="true"
                  className="absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  name="q"
                  aria-label="Tìm cơ sở y tế, bác sĩ hoặc dịch vụ"
                  placeholder="Tìm cơ sở, bác sĩ hoặc dịch vụ..."
                  className="h-12 border-0 bg-transparent pl-11 shadow-none focus-visible:ring-0"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-6">
                <Search aria-hidden="true" />
                Tìm kiếm
              </Button>
            </form>
          </div>

          <div className="overflow-hidden border-4 border-white bg-card shadow-lg">
            <div className="relative aspect-16/10 bg-muted">
            <img src="https://res.cloudinary.com/dzpgchw3n/image/upload/v1790131625/ChatGPT_Image_Sep_23_2026_09_45_33_AM_a071ix.png" alt="" />
            </div>
            <div className="grid gap-3 border-t p-4 sm:grid-cols-3">
              <HeroMetric value="Cơ sở" label="Tìm nơi khám" />
              <HeroMetric value="Bác sĩ" label="Xem chuyên môn" />
              <HeroMetric value="Dịch vụ" label="Tra cứu chi phí" />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="quick-utilities-title" className="border-b bg-white">
        <div className="container-shell py-8 sm:py-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary">Tiện ích cho người bệnh</p>
              <h2 id="quick-utilities-title" className="mt-1 text-xl font-bold sm:text-2xl">
                Bạn cần AnTam hỗ trợ gì hôm nay?
              </h2>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 border-l border-t sm:grid-cols-3 lg:grid-cols-6">
            {quickUtilities.map(({ label, description, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group min-w-0 border-b border-r bg-white p-4 transition-colors hover:bg-secondary sm:p-5"
              >
                <Icon aria-hidden="true" className="size-7 text-primary" />
                <strong className="mt-3 block text-sm group-hover:text-primary">{label}</strong>
                <span className="mt-1 hidden text-xs leading-5 text-muted-foreground sm:block">
                  {description}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="booking-paths-title" className="container-shell py-12 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-primary">Đặt lịch theo nhu cầu</p>
            <h2 id="booking-paths-title" className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Chọn cách bắt đầu phù hợp với bạn
            </h2>
          </div>
          <Link
            href="/tim-kiem"
            className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline sm:flex"
          >
            Tìm kiếm tổng hợp
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {bookingPaths.map(({ title, description, href, icon: Icon, border, tone }, index) => (
            <Link
              key={href}
              href={href}
              aria-label={`${title}: ${description}`}
              className={`group flex min-w-0 items-start gap-4 border border-t-4 bg-card p-5 transition hover:shadow-md sm:p-6 ${border}`}
            >
              <span className={`flex size-12 shrink-0 items-center justify-center rounded-md ${tone}`}>
                <Icon aria-hidden="true" className="size-6" />
              </span>
              <span className="min-w-0">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Lựa chọn {index + 1}
                </span>
                <strong className="mt-1 block text-lg group-hover:text-primary">{title}</strong>
                <span className="mt-1 block text-sm leading-6 text-muted-foreground">{description}</span>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Bắt đầu
                  <ArrowRight aria-hidden="true" className="size-4" />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/40">
        <div className="container-shell grid gap-6 py-8 md:grid-cols-3">
          {assurances.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background text-primary shadow-sm">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <div>
                <h2 className="font-semibold">{title}</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell py-12 sm:py-16" aria-labelledby="campaign-title">
        <div className="grid overflow-hidden lg:grid-cols-[0.92fr_1.08fr]">
          <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">
              Chương trình sức khỏe tháng này
            </p>
            <h2 id="campaign-title" className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Chủ động tầm soát, an tâm chăm sóc sức khỏe lâu dài
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
              Tham khảo các gói kiểm tra sức khỏe, dịch vụ xét nghiệm và cơ sở phù hợp trước khi lên lịch. AnTam giúp bạn giữ toàn bộ lịch hẹn trong một tài khoản.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/dich-vu" className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white hover:bg-[#056c9e]">
                Xem dịch vụ tầm soát
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link href="/co-so-y-te" className="inline-flex h-11 items-center justify-center rounded-md border border-primary/30 bg-white px-5 text-sm font-semibold text-primary hover:bg-secondary">
                Tìm cơ sở gần bạn
              </Link>
            </div>
          </div>
          <div className="relative min-h-72 border-t border-primary/10 lg:min-h-108 lg:border-l lg:border-t-0">
            <img src="https://res.cloudinary.com/dzpgchw3n/image/upload/v1790131623/635551_thumb_1772066271_07375226_qvad85.jpg" alt="" />
          </div>
        </div>
      </section>

      <HomeFeaturedSections />

      <section className="border-y bg-white" aria-labelledby="health-knowledge-title">
        <div className="container-shell py-12 sm:py-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="flex items-center gap-2 text-sm font-semibold text-primary">
                <BookOpenText aria-hidden="true" className="size-4" />
                Kiến thức y tế
              </p>
              <h2 id="health-knowledge-title" className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Hiểu đúng để chăm sóc sức khỏe chủ động
              </h2>
              <p className="mt-2 leading-7 text-muted-foreground">
                Nội dung tham khảo giúp bạn chuẩn bị tốt hơn trước khi khám và trao đổi hiệu quả với nhân viên y tế.
              </p>
            </div>
            <p className="text-xs leading-5 text-muted-foreground sm:max-w-xs sm:text-right">
              Nội dung không thay thế chẩn đoán hoặc chỉ định trực tiếp từ bác sĩ.
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <HealthLeadArticle article={healthArticles[0]} />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              {healthArticles.slice(1).map((article) => (
                <HealthCompactArticle key={article.title} article={article} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-12 sm:py-16">
        <div className="flex flex-col gap-6 border-l-4 border-l-[#ffc94a] bg-[#075d8a] p-6 text-white sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-[#72d7ff]">
              <Activity aria-hidden="true" className="size-4" />
              Đồng hành cùng sức khỏe của bạn
            </p>
            <h2 className="mt-2 text-2xl font-bold">Bắt đầu từ một lựa chọn phù hợp hôm nay</h2>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Tìm cơ sở, bác sĩ hoặc dịch vụ và chủ động chọn lịch thuận tiện.
            </p>
          </div>
          <Link href="/tim-kiem" className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-[#ffc94a] px-5 text-sm font-semibold text-[#173b57] hover:bg-[#ffbd24]">
            Khám phá ngay
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

type HealthArticle = (typeof healthArticles)[number];

function HealthLeadArticle({ article }: { article: HealthArticle }) {
  const Icon = article.icon;
  return (
    <article className="grid min-w-0 overflow-hidden border bg-card sm:grid-cols-[0.95fr_1.05fr]">
      <div className="relative min-h-64 bg-muted sm:min-h-full">
        {/* <Image src={article.image} alt="" fill sizes="(min-width: 1024px) 36vw, 100vw" className="object-cover" /> */}
        <img src={article.image} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-8">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
          <Icon aria-hidden="true" className="size-4" />
          {article.category}
        </p>
        <h3 className="mt-3 text-2xl font-bold leading-8">{article.title}</h3>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">{article.description}</p>
        <span className="mt-6 text-xs font-medium text-muted-foreground">5 phút đọc · Nội dung tham khảo</span>
      </div>
    </article>
  );
}

function HealthCompactArticle({ article }: { article: HealthArticle }) {
  const Icon = article.icon;
  return (
    <article className="grid min-w-0 grid-cols-[7rem_minmax(0,1fr)] overflow-hidden border bg-card sm:grid-cols-1 lg:grid-cols-[9rem_minmax(0,1fr)]">
      <div className="relative min-h-36 bg-muted sm:min-h-44 lg:min-h-full">
        {/* <Image src={article.image} alt="" fill sizes="144px" className="object-cover" /> */}
        <img src={article.image} alt=""className="h-full w-full object-cover" />
      </div>
      <div className="p-4 sm:p-5">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-primary">
          <Icon aria-hidden="true" className="size-3.5" />
          {article.category}
        </p>
        <h3 className="mt-2 font-bold leading-6">{article.title}</h3>
        <p className="mt-2 hidden text-sm leading-6 text-muted-foreground sm:line-clamp-2">{article.description}</p>
      </div>
    </article>
  );
}

function HeroMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="min-w-0 text-center sm:text-left">
      <p className="text-sm font-bold text-primary">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

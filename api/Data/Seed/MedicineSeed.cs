using api.Model;
using api.Model.Enum;

namespace api.Data.Seed;

public static class MedicineSeed
{
    private const string MedicineImage =
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80";

    private static readonly DateTime SeededAt = new(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

    public static IReadOnlyList<Medicine> Medicines { get; } =
    [
        Create("036aeccd-f365-42a6-9e04-d068c7164baf", "Paracetamol 500 mg", "Thuốc giảm đau, hạ sốt; sử dụng đúng liều được hướng dẫn.", 1200, MedicineUnit.Tablet, true, 0.8f),
        Create("9e5b33fc-15bd-425d-9ad1-8fa05bb266af", "Ibuprofen 400 mg", "Thuốc giảm đau, kháng viêm không steroid; cần lưu ý nguy cơ trên dạ dày.", 1800, MedicineUnit.Tablet, true, 0.8f),
        Create("82e9b25d-d872-4aef-bc5e-22bf9e23c8b7", "Amoxicillin 500 mg", "Kháng sinh penicillin, chỉ sử dụng khi có chỉ định của bác sĩ.", 2500, MedicineUnit.Tablet, true, 0.8f),
        Create("6c23dad5-8938-4a06-af07-21dc9ba17978", "Amoxicillin/Clavulanate 875/125 mg", "Kháng sinh phối hợp; dùng đủ liệu trình theo đơn và lưu ý tiền sử dị ứng penicillin.", 14500, MedicineUnit.Tablet, true, 0.8f),
        Create("55d0a06a-9934-4bff-a146-113d6a28ae46", "Azithromycin 500 mg", "Kháng sinh nhóm macrolide, sử dụng theo chẩn đoán và đơn thuốc.", 12000, MedicineUnit.Tablet, true, 0.8f),
        Create("c815e301-5461-4417-8f33-8130020d759f", "Cefuroxime 500 mg", "Kháng sinh cephalosporin; không tự ý dùng cho nhiễm virus thông thường.", 15000, MedicineUnit.Tablet, true, 0.8f),
        Create("65af0a2b-3fa4-479c-949c-50b241d41e86", "Metronidazole 250 mg", "Thuốc điều trị một số nhiễm khuẩn kỵ khí và ký sinh trùng theo chỉ định.", 900, MedicineUnit.Tablet, true, 0.8f),
        Create("c5b5e8b1-decf-4f59-bbd0-d2d9e72c73e7", "Omeprazole 20 mg", "Thuốc ức chế tiết acid dạ dày, thường dùng trước bữa ăn theo hướng dẫn.", 1300, MedicineUnit.Tablet, true, 0.8f),
        Create("0a687332-e663-43ff-8ab4-359906254dab", "Esomeprazole 40 mg", "Thuốc ức chế bơm proton dùng trong một số bệnh lý liên quan acid dạ dày.", 5500, MedicineUnit.Tablet, true, 0.8f),
        Create("f85251fb-7e9d-4a1d-8e9d-c623e2752829", "Pantoprazole 40 mg", "Thuốc giảm tiết acid dạ dày; thời gian sử dụng theo chỉ định chuyên môn.", 3500, MedicineUnit.Tablet, true, 0.8f),
        Create("ca281ba6-e73b-491a-b334-861d990a6d97", "Domperidone 10 mg", "Thuốc hỗ trợ điều trị buồn nôn và rối loạn vận động tiêu hóa theo chỉ định.", 1600, MedicineUnit.Tablet, true, 0.5f),
        Create("1918e16c-2921-4d8e-a84f-7c7983dbe90e", "Oresol áp lực thẩm thấu thấp", "Bột bù nước và điện giải; pha đúng lượng nước ghi trên bao bì.", 4500, MedicineUnit.Sachet, true, 0.8f),
        Create("8ab64ed5-dca4-4f0b-9b81-4f8cde3bfe00", "Diosmectite 3 g", "Thuốc dạng gói hỗ trợ điều trị triệu chứng tiêu chảy theo hướng dẫn.", 4000, MedicineUnit.Sachet, true, 0.5f),
        Create("1fcb3999-4793-4381-bf96-d8d7a11d203c", "Lactulose 3.35 g/5 ml - 100 ml", "Dung dịch nhuận tràng thẩm thấu, liều dùng được điều chỉnh theo đáp ứng.", 48000, MedicineUnit.Bottle, true, 0.5f),
        Create("3b22896a-efbd-4976-b9d0-dc7eedcf1ee2", "Bisacodyl 5 mg", "Thuốc nhuận tràng kích thích, chỉ nên dùng ngắn hạn theo hướng dẫn.", 900, MedicineUnit.Tablet, true, 0.5f),
        Create("5a815127-0801-434e-ad98-6e77c930590c", "Salbutamol bình hít 100 mcg/liều", "Thuốc giãn phế quản dạng hít; cần được hướng dẫn kỹ thuật sử dụng bình hít.", 72000, MedicineUnit.Bottle, true, 0.8f),
        Create("0f7e50a7-d269-41f1-bf84-71882c1e2774", "Budesonide khí dung 0.5 mg/2 ml", "Corticosteroid dạng khí dung kiểm soát viêm đường thở, dùng theo đơn.", 135000, MedicineUnit.Box, true, 0.8f),
        Create("35d71696-f7c4-4162-ac93-112b90a300c8", "Cetirizine 10 mg", "Thuốc kháng histamine hỗ trợ giảm triệu chứng dị ứng.", 1200, MedicineUnit.Tablet, true, 0.5f),
        Create("6fd78f28-5720-4299-b9f5-039691329d80", "Loratadine 10 mg", "Thuốc kháng histamine dùng trong viêm mũi dị ứng và mày đay.", 1500, MedicineUnit.Tablet, true, 0.5f),
        Create("8bb56dd6-9f04-4833-9d68-4f479b308e1e", "Chlorpheniramine 4 mg", "Thuốc kháng histamine có thể gây buồn ngủ; thận trọng khi lái xe.", 500, MedicineUnit.Tablet, true, 0.8f),
        Create("e4dc79f2-cfde-4db5-84b2-48688778acbc", "Dextromethorphan siro 15 mg/5 ml - 100 ml", "Siro giảm ho khan; không dùng thay thế việc đánh giá nguyên nhân ho kéo dài.", 38000, MedicineUnit.Bottle, false, 0f),
        Create("92b6ae12-1264-444f-9c6b-21ad099cd8c2", "Acetylcysteine 200 mg", "Thuốc long đờm dạng gói; hòa tan hoàn toàn trước khi uống.", 2500, MedicineUnit.Sachet, true, 0.5f),
        Create("f854d43f-b17f-4882-be04-131dc91c9383", "Ambroxol 30 mg", "Thuốc tiêu nhầy, hỗ trợ làm loãng đờm trong bệnh lý đường hô hấp.", 1200, MedicineUnit.Tablet, true, 0.5f),
        Create("c91ae78d-2bd4-4680-9163-69ca0d70da91", "Losartan 50 mg", "Thuốc điều trị tăng huyết áp; cần theo dõi huyết áp và chức năng thận.", 2200, MedicineUnit.Tablet, true, 0.8f),
        Create("fdbbdc1a-4c2a-4617-b26b-0f9272fe3158", "Amlodipine 5 mg", "Thuốc chẹn kênh canxi điều trị tăng huyết áp và một số trường hợp đau thắt ngực.", 1000, MedicineUnit.Tablet, true, 0.8f),
        Create("fb9e8dc2-196d-491c-bcc2-507d205f3876", "Bisoprolol 5 mg", "Thuốc chẹn beta; không tự ý ngừng đột ngột khi đang điều trị.", 3000, MedicineUnit.Tablet, true, 0.8f),
        Create("d6ae74b5-74ec-43d1-853e-19d0fc5a6bbd", "Atorvastatin 20 mg", "Thuốc hạ lipid máu nhóm statin, kết hợp chế độ ăn và theo dõi định kỳ.", 2500, MedicineUnit.Tablet, true, 0.8f),
        Create("985c68d7-8d12-45c9-b05b-17e392217dc6", "Rosuvastatin 10 mg", "Thuốc hạ cholesterol nhóm statin, dùng theo đánh giá nguy cơ tim mạch.", 4500, MedicineUnit.Tablet, true, 0.8f),
        Create("a49b2f0a-fce2-42a4-9298-76f193da0b4f", "Aspirin 81 mg", "Thuốc kháng kết tập tiểu cầu liều thấp; chỉ dùng khi đã được đánh giá nguy cơ chảy máu.", 1000, MedicineUnit.Tablet, true, 0.8f),
        Create("21671875-846f-43c1-b817-5753ad9057f2", "Clopidogrel 75 mg", "Thuốc kháng kết tập tiểu cầu, sử dụng theo chỉ định tim mạch hoặc thần kinh.", 5500, MedicineUnit.Tablet, true, 0.8f),
        Create("b229c4c7-984c-4c42-86f7-5026e6a6923a", "Metformin 500 mg", "Thuốc điều trị đái tháo đường type 2, dùng cùng chế độ dinh dưỡng phù hợp.", 900, MedicineUnit.Tablet, true, 0.8f),
        Create("2476615a-8777-4bb1-813d-6e69f3700b2b", "Gliclazide MR 30 mg", "Thuốc hạ đường huyết phóng thích kéo dài; lưu ý nguy cơ hạ đường huyết.", 2500, MedicineUnit.Tablet, true, 0.8f),
        Create("289aa313-b1ea-49c9-a9d6-056f55a13ab1", "Insulin glargine 100 IU/ml - bút 3 ml", "Insulin tác dụng kéo dài; bảo quản và tiêm đúng kỹ thuật được hướng dẫn.", 285000, MedicineUnit.Box, true, 0.8f),
        Create("a7ad1d42-9230-407f-b23c-c8e58983166b", "Levothyroxine 50 mcg", "Hormone tuyến giáp tổng hợp; thường uống lúc đói và theo dõi xét nghiệm định kỳ.", 1800, MedicineUnit.Tablet, true, 0.8f),
        Create("61b33d56-8b3a-4c00-a13e-83979c60c950", "Allopurinol 300 mg", "Thuốc giảm tạo acid uric trong điều trị dài hạn; không dùng để cắt cơn gút cấp.", 2500, MedicineUnit.Tablet, true, 0.8f),
        Create("9479e702-5a84-4690-8fc5-06012f21c751", "Colchicine 1 mg", "Thuốc dùng trong một số trường hợp gút; cần tuân thủ chặt chẽ liều kê đơn.", 3200, MedicineUnit.Tablet, true, 0.8f),
        Create("3a0e5044-b2e3-4f08-8c2d-ae38329bb703", "Diclofenac gel 1% - 20 g", "Gel bôi ngoài da hỗ trợ giảm đau tại chỗ; không bôi lên vết thương hở.", 29000, MedicineUnit.Tube, false, 0f),
        Create("0e8ce2f7-692f-4070-ac51-e1ecacf6d45d", "Meloxicam 7.5 mg", "Thuốc giảm đau kháng viêm không steroid, dùng liều thấp nhất trong thời gian phù hợp.", 1800, MedicineUnit.Tablet, true, 0.8f),
        Create("c2aaf13f-8c14-4f70-9ec0-757058723f90", "Gabapentin 300 mg", "Thuốc dùng trong một số đau thần kinh và động kinh; có thể gây chóng mặt, buồn ngủ.", 3500, MedicineUnit.Tablet, true, 0.8f),
        Create("0cc4ac88-1c60-48e4-90fd-b7bbb781b74c", "Pregabalin 75 mg", "Thuốc điều trị một số dạng đau thần kinh, sử dụng theo đơn và đánh giá đáp ứng.", 8500, MedicineUnit.Tablet, true, 0.8f),
        Create("06cea414-bc4a-4536-bfb1-315122590d38", "Sertraline 50 mg", "Thuốc chống trầm cảm nhóm SSRI; hiệu quả và tác dụng không mong muốn cần được theo dõi.", 4000, MedicineUnit.Tablet, true, 0.8f),
        Create("06dd189c-9492-4587-8eff-b3c65439ea3a", "Vitamin C 500 mg", "Sản phẩm bổ sung vitamin C khi khẩu phần không đáp ứng đủ nhu cầu.", 1800, MedicineUnit.Tablet, false, 0f),
        Create("7f242f9c-380d-4125-917f-5266ea216441", "Vitamin D3 1000 IU", "Bổ sung vitamin D theo nhu cầu và hướng dẫn của nhân viên y tế.", 2200, MedicineUnit.Tablet, false, 0f),
        Create("c99c115e-4faa-4fed-a36a-24a80a9eb8e2", "Calcium carbonate 500 mg + Vitamin D3", "Bổ sung calci và vitamin D; cần lưu ý tổng lượng calci từ thực phẩm và thuốc.", 3500, MedicineUnit.Tablet, false, 0f),
        Create("116fc685-f1ec-4dfe-99a0-b0e5faf681dc", "Sắt fumarate + Acid folic", "Bổ sung sắt và acid folic trong các trường hợp được xác định có nhu cầu.", 2800, MedicineUnit.Tablet, true, 0.5f),
        Create("6e8f0bc6-92d7-4482-8533-d140d57e3186", "Kẽm 10 mg", "Bổ sung kẽm theo độ tuổi, tình trạng dinh dưỡng và hướng dẫn chuyên môn.", 1500, MedicineUnit.Tablet, false, 0f),
        Create("395bd57b-bd92-4f6b-bf40-d5932e348eb9", "Natri clorid 0.9% - 500 ml", "Dung dịch natri clorid đẳng trương dùng trong cơ sở y tế theo chỉ định.", 18000, MedicineUnit.Bottle, true, 0.8f),
        Create("615f7045-5c22-44ed-b726-2b94d1718921", "Povidone iodine 10% - 90 ml", "Dung dịch sát khuẩn dùng ngoài da; tránh dùng khi có chống chỉ định với iod.", 24000, MedicineUnit.Bottle, false, 0f),
        Create("f056d891-c813-4f21-aafe-c459714646be", "Clotrimazole cream 1% - 15 g", "Kem bôi kháng nấm ngoài da, dùng đủ thời gian được hướng dẫn.", 28000, MedicineUnit.Tube, true, 0.5f),
        Create("92302b4c-4662-44b0-bbcb-ed0159e5b242", "Hydrocortisone cream 1% - 15 g", "Corticosteroid bôi da mức độ nhẹ; không tự ý bôi kéo dài hoặc trên diện rộng.", 32000, MedicineUnit.Tube, true, 0.5f)
    ];

    private static Medicine Create(
        string uuid, string name, string description, int price, MedicineUnit unit,
        bool isInsured, float insuranceCap) => new()
    {
        Uuid = Guid.Parse(uuid),
        Image = MedicineImage,
        Name = name,
        Description = description,
        Price = price,
        Unit = unit,
        Status = BaseStatus.Active,
        IsInsured = isInsured,
        InsuranceCap = isInsured ? insuranceCap : 0,
        CreatedAt = SeededAt,
        UpdatedAt = SeededAt,
        DeletedAt = null
    };
}

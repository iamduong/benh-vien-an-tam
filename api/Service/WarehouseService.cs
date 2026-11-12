using api.Contract.Warehouse;
using api.Lib;
using api.Model;
using api.Model.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Service;

[NonController]
public sealed class WarehouseService(DBContext dbContext) : ControllerBase
{
    public async Task<IActionResult> GetProviders(bool includeDeleted, CancellationToken cancellationToken)
    {
        var items = await dbContext.Providers.AsNoTracking()
            .Where(item => includeDeleted || item.DeletedAt == null)
            .OrderBy(item => item.Name)
            .ToListAsync(cancellationToken);
        return Ok(new { message = "Lấy danh sách nhà cung cấp thành công.", data = items });
    }

    public async Task<IActionResult> CreateProvider(ProviderRequest request, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var provider = new Provider { Uuid = Guid.NewGuid(), Name = request.Name.Trim(), Address = request.Address.Trim(), Hotline = request.Hotline.Trim(), Status = request.Status, CreatedAt = now, UpdatedAt = now };
        dbContext.Providers.Add(provider);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Created($"/api/warehouse/providers/{provider.Uuid}", new { message = "Đã thêm nhà cung cấp.", data = provider });
    }

    public async Task<IActionResult> UpdateProvider(Guid uuid, ProviderRequest request, CancellationToken cancellationToken)
    {
        var provider = await dbContext.Providers.FirstOrDefaultAsync(item => item.Uuid == uuid && item.DeletedAt == null, cancellationToken);
        if (provider is null) return NotFound(new { message = "Không tìm thấy nhà cung cấp." });
        provider.Name = request.Name.Trim(); provider.Address = request.Address.Trim(); provider.Hotline = request.Hotline.Trim(); provider.Status = request.Status; provider.UpdatedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(new { message = "Đã cập nhật nhà cung cấp.", data = provider });
    }

    public async Task<IActionResult> DeleteProvider(Guid uuid, CancellationToken cancellationToken)
    {
        var provider = await dbContext.Providers.FirstOrDefaultAsync(item => item.Uuid == uuid && item.DeletedAt == null, cancellationToken);
        if (provider is null) return NotFound(new { message = "Không tìm thấy nhà cung cấp." });
        provider.DeletedAt = provider.UpdatedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(new { message = "Đã xóa nhà cung cấp." });
    }

    public async Task<IActionResult> RestoreProvider(Guid uuid, CancellationToken cancellationToken)
    {
        var provider = await dbContext.Providers.FirstOrDefaultAsync(item => item.Uuid == uuid && item.DeletedAt != null, cancellationToken);
        if (provider is null) return NotFound(new { message = "Không tìm thấy nhà cung cấp đã xóa." });
        provider.DeletedAt = null; provider.UpdatedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(new { message = "Đã khôi phục nhà cung cấp.", data = provider });
    }

    public async Task<IActionResult> GetInventory(CancellationToken cancellationToken)
    {
        var hospitalUuid = GetHospitalUuid();
        if (!hospitalUuid.HasValue) return Forbid();
        var items = await (from inventory in dbContext.MedicineInventories.AsNoTracking()
                           join medicine in dbContext.Medicines.AsNoTracking() on inventory.MedicineUuid equals medicine.Uuid
                           where inventory.HospitalUuid == hospitalUuid && inventory.DeletedAt == null && medicine.DeletedAt == null
                           orderby medicine.Name
                           select new { inventory.Uuid, inventory.MedicineUuid, MedicineName = medicine.Name, medicine.Unit, medicine.Price, inventory.Quantity, inventory.MinimumQuantity, inventory.UpdatedAt }).ToListAsync(cancellationToken);
        return Ok(new { message = "Lấy tồn kho thành công.", data = items });
    }

    public async Task<IActionResult> GetOptions(CancellationToken cancellationToken)
    {
        var medicines = await dbContext.Medicines.AsNoTracking().Where(item => item.DeletedAt == null && item.Status == BaseStatus.Active).OrderBy(item => item.Name).Select(item => new { item.Uuid, item.Name, item.Unit, item.Price }).ToListAsync(cancellationToken);
        var providers = await dbContext.Providers.AsNoTracking().Where(item => item.DeletedAt == null && item.Status == ProviderStatus.Active).OrderBy(item => item.Name).Select(item => new { item.Uuid, item.Name }).ToListAsync(cancellationToken);
        return Ok(new { message = "Lấy lựa chọn kho thành công.", data = new { medicines, providers } });
    }

    public async Task<IActionResult> GetImports(CancellationToken cancellationToken) => await GetTickets(true, cancellationToken);

    public async Task<IActionResult> GetExports(CancellationToken cancellationToken) => await GetTickets(false, cancellationToken);

    public async Task<IActionResult> CreateImport(CreateImportTicketRequest request, CancellationToken cancellationToken)
    {
        var session = GetSession(); if (session is null) return Forbid();
        if (!await dbContext.Providers.AnyAsync(item => item.Uuid == request.ProviderUuid && item.DeletedAt == null && item.Status == ProviderStatus.Active, cancellationToken)) return BadRequest(new { message = "Nhà cung cấp không hợp lệ." });
        if (!await DetailsAreValid(request.Details, cancellationToken)) return BadRequest(new { message = "Chi tiết nhập hàng không hợp lệ." });
        var now = DateTime.UtcNow;
        var ticket = new ImportTicket { Uuid = Guid.NewGuid(), HospitalUuid = session.Value.Hospital, AccountUuid = session.Value.Account, ProviderUuid = request.ProviderUuid, Note = request.Note.Trim(), Status = ImportTicketStatus.Pending, CreatedAt = now, UpdatedAt = now };
        dbContext.ImportTickets.Add(ticket);
        dbContext.ImportTicketDetails.AddRange(request.Details.Map(item => new ImportTicketDetail { Uuid = Guid.NewGuid(), ImportTicketUuid = ticket.Uuid, MedicineUuid = item.MedicineUuid, Quantity = item.Quantity, Price = item.Price }));
        await dbContext.SaveChangesAsync(cancellationToken);
        return Created($"/api/warehouse/imports/{ticket.Uuid}", new { message = "Đã tạo phiếu nhập hàng.", data = ticket });
    }

    public async Task<IActionResult> CreateExport(CreateExportTicketRequest request, CancellationToken cancellationToken)
    {
        var session = GetSession(); if (session is null) return Forbid();
        if (!await DetailsAreValid(request.Details, cancellationToken)) return BadRequest(new { message = "Chi tiết xuất hàng không hợp lệ." });
        var now = DateTime.UtcNow;
        var ticket = new ExportTicket { Uuid = Guid.NewGuid(), HospitalUuid = session.Value.Hospital, AccountUuid = session.Value.Account, Note = request.Note.Trim(), Status = ExportTicketStatus.Pending, CreatedAt = now, UpdatedAt = now };
        dbContext.ExportTickets.Add(ticket);
        dbContext.ExportTicketDetails.AddRange(request.Details.Map(item => new ExportTicketDetail { Uuid = Guid.NewGuid(), ExportTicketUuid = ticket.Uuid, MedicineUuid = item.MedicineUuid, Quantity = item.Quantity, Price = item.Price }));
        await dbContext.SaveChangesAsync(cancellationToken);
        return Created($"/api/warehouse/exports/{ticket.Uuid}", new { message = "Đã tạo phiếu xuất hàng.", data = ticket });
    }

    public async Task<IActionResult> UpdateImport(Guid uuid, CreateImportTicketRequest request, CancellationToken cancellationToken)
    {
        var hospitalUuid = GetHospitalUuid();
        if (!hospitalUuid.HasValue) return Forbid();
        if (!await dbContext.Providers.AnyAsync(item => item.Uuid == request.ProviderUuid && item.DeletedAt == null && item.Status == ProviderStatus.Active, cancellationToken))
            return BadRequest(new { message = "Nhà cung cấp không hợp lệ." });
        if (!await DetailsAreValid(request.Details, cancellationToken))
            return BadRequest(new { message = "Chi tiết nhập hàng không hợp lệ." });

        var ticket = await dbContext.ImportTickets.FirstOrDefaultAsync(
            item => item.Uuid == uuid && item.HospitalUuid == hospitalUuid && item.Status == ImportTicketStatus.Pending,
            cancellationToken);
        if (ticket is null) return NotFound(new { message = "Không tìm thấy phiếu nhập đang chờ xác nhận." });

        await using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);
        var currentDetails = await dbContext.ImportTicketDetails
            .Where(item => item.ImportTicketUuid == uuid)
            .ToListAsync(cancellationToken);
        dbContext.ImportTicketDetails.RemoveRange(currentDetails);
        dbContext.ImportTicketDetails.AddRange(request.Details.Map(item => new ImportTicketDetail
        {
            Uuid = Guid.NewGuid(),
            ImportTicketUuid = ticket.Uuid,
            MedicineUuid = item.MedicineUuid,
            Quantity = item.Quantity,
            Price = item.Price
        }));
        ticket.ProviderUuid = request.ProviderUuid;
        ticket.Note = request.Note.Trim();
        ticket.UpdatedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);
        return Ok(new { message = "Đã cập nhật phiếu nhập đang chờ.", data = ticket });
    }

    public async Task<IActionResult> UpdateExport(Guid uuid, CreateExportTicketRequest request, CancellationToken cancellationToken)
    {
        var hospitalUuid = GetHospitalUuid();
        if (!hospitalUuid.HasValue) return Forbid();
        if (!await DetailsAreValid(request.Details, cancellationToken))
            return BadRequest(new { message = "Chi tiết xuất hàng không hợp lệ." });

        var ticket = await dbContext.ExportTickets.FirstOrDefaultAsync(
            item => item.Uuid == uuid && item.HospitalUuid == hospitalUuid && item.Status == ExportTicketStatus.Pending,
            cancellationToken);
        if (ticket is null) return NotFound(new { message = "Không tìm thấy phiếu xuất đang chờ xác nhận." });

        await using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);
        var currentDetails = await dbContext.ExportTicketDetails
            .Where(item => item.ExportTicketUuid == uuid)
            .ToListAsync(cancellationToken);
        dbContext.ExportTicketDetails.RemoveRange(currentDetails);
        dbContext.ExportTicketDetails.AddRange(request.Details.Map(item => new ExportTicketDetail
        {
            Uuid = Guid.NewGuid(),
            ExportTicketUuid = ticket.Uuid,
            MedicineUuid = item.MedicineUuid,
            Quantity = item.Quantity,
            Price = item.Price
        }));
        ticket.Note = request.Note.Trim();
        ticket.UpdatedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);
        return Ok(new { message = "Đã cập nhật phiếu xuất đang chờ.", data = ticket });
    }

    public Task<IActionResult> ConfirmImport(Guid uuid, CancellationToken cancellationToken) => ConfirmTicket(uuid, true, cancellationToken);

    public Task<IActionResult> ConfirmExport(Guid uuid, CancellationToken cancellationToken) => ConfirmTicket(uuid, false, cancellationToken);

    public Task<IActionResult> CancelImport(Guid uuid, CancellationToken cancellationToken) => CancelTicket(uuid, true, cancellationToken);

    public Task<IActionResult> CancelExport(Guid uuid, CancellationToken cancellationToken) => CancelTicket(uuid, false, cancellationToken);

    private async Task<IActionResult> GetTickets(bool import, CancellationToken cancellationToken)
    {
        var hospitalUuid = GetHospitalUuid(); if (!hospitalUuid.HasValue) return Forbid();
        if (import)
        {
            var items = await dbContext.ImportTickets.AsNoTracking().Where(item => item.HospitalUuid == hospitalUuid && item.DeletedAt == null).OrderByDescending(item => item.CreatedAt).Select(item => new { item.Uuid, item.ProviderUuid, ProviderName = dbContext.Providers.Where(provider => provider.Uuid == item.ProviderUuid).Select(provider => provider.Name).FirstOrDefault(), item.Note, Status = item.Status.ToString(), item.CreatedAt, item.UpdatedAt, Details = dbContext.ImportTicketDetails.Where(detail => detail.ImportTicketUuid == item.Uuid).Join(dbContext.Medicines, detail => detail.MedicineUuid, medicine => medicine.Uuid, (detail, medicine) => new { detail.MedicineUuid, MedicineName = medicine.Name, medicine.Unit, detail.Quantity, detail.Price }).ToList() }).ToListAsync(cancellationToken);
            return Ok(new { message = "Lấy phiếu nhập thành công.", data = items });
        }
        var exports = await dbContext.ExportTickets.AsNoTracking().Where(item => item.HospitalUuid == hospitalUuid && item.DeletedAt == null).OrderByDescending(item => item.CreatedAt).Select(item => new { item.Uuid, item.Note, Status = item.Status.ToString(), item.CreatedAt, item.UpdatedAt, Details = dbContext.ExportTicketDetails.Where(detail => detail.ExportTicketUuid == item.Uuid).Join(dbContext.Medicines, detail => detail.MedicineUuid, medicine => medicine.Uuid, (detail, medicine) => new { detail.MedicineUuid, MedicineName = medicine.Name, medicine.Unit, detail.Quantity, detail.Price }).ToList() }).ToListAsync(cancellationToken);
        return Ok(new { message = "Lấy phiếu xuất thành công.", data = exports });
    }

    private async Task<IActionResult> ConfirmTicket(Guid uuid, bool import, CancellationToken cancellationToken)
    {
        var hospitalUuid = GetHospitalUuid(); if (!hospitalUuid.HasValue) return Forbid();
        await using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);
        if (import)
        {
            var ticket = await dbContext.ImportTickets.FirstOrDefaultAsync(item => item.Uuid == uuid && item.HospitalUuid == hospitalUuid && item.Status == ImportTicketStatus.Pending, cancellationToken);
            if (ticket is null) return NotFound(new { message = "Không tìm thấy phiếu nhập đang chờ." });
            var details = await dbContext.ImportTicketDetails.Where(item => item.ImportTicketUuid == uuid).ToListAsync(cancellationToken);
            foreach (var detail in details) await ChangeInventory(hospitalUuid.Value, detail.MedicineUuid!.Value, detail.Quantity, cancellationToken);
            ticket.Status = ImportTicketStatus.Confirmed; ticket.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            var ticket = await dbContext.ExportTickets.FirstOrDefaultAsync(item => item.Uuid == uuid && item.HospitalUuid == hospitalUuid && item.Status == ExportTicketStatus.Pending, cancellationToken);
            if (ticket is null) return NotFound(new { message = "Không tìm thấy phiếu xuất đang chờ." });
            var details = await dbContext.ExportTicketDetails.Where(item => item.ExportTicketUuid == uuid).ToListAsync(cancellationToken);
            foreach (var detail in details) if (!await HasStock(hospitalUuid.Value, detail.MedicineUuid!.Value, detail.Quantity, cancellationToken)) return Conflict(new { message = "Tồn kho không đủ để xác nhận phiếu xuất." });
            foreach (var detail in details) await ChangeInventory(hospitalUuid.Value, detail.MedicineUuid!.Value, -detail.Quantity, cancellationToken);
            ticket.Status = ExportTicketStatus.Confirmed; ticket.UpdatedAt = DateTime.UtcNow;
        }
        await dbContext.SaveChangesAsync(cancellationToken); await transaction.CommitAsync(cancellationToken);
        return Ok(new { message = import ? "Đã xác nhận nhập hàng và cập nhật tồn kho." : "Đã xác nhận xuất hàng và cập nhật tồn kho." });
    }

    private async Task<IActionResult> CancelTicket(Guid uuid, bool import, CancellationToken cancellationToken)
    {
        var hospitalUuid = GetHospitalUuid(); if (!hospitalUuid.HasValue) return Forbid();
        if (import) { var item = await dbContext.ImportTickets.FirstOrDefaultAsync(x => x.Uuid == uuid && x.HospitalUuid == hospitalUuid && x.Status == ImportTicketStatus.Pending, cancellationToken); if (item is null) return NotFound(new { message = "Không tìm thấy phiếu nhập đang chờ." }); item.Status = ImportTicketStatus.Cancelled; item.UpdatedAt = DateTime.UtcNow; }
        else { var item = await dbContext.ExportTickets.FirstOrDefaultAsync(x => x.Uuid == uuid && x.HospitalUuid == hospitalUuid && x.Status == ExportTicketStatus.Pending, cancellationToken); if (item is null) return NotFound(new { message = "Không tìm thấy phiếu xuất đang chờ." }); item.Status = ExportTicketStatus.Cancelled; item.UpdatedAt = DateTime.UtcNow; }
        await dbContext.SaveChangesAsync(cancellationToken); return Ok(new { message = "Đã hủy phiếu." });
    }

    private async Task ChangeInventory(Guid hospitalUuid, Guid medicineUuid, int change, CancellationToken cancellationToken)
    {
        var item = await dbContext.MedicineInventories.FirstOrDefaultAsync(x => x.HospitalUuid == hospitalUuid && x.MedicineUuid == medicineUuid && x.DeletedAt == null, cancellationToken);
        if (item is null) { item = new MedicineInventory { Uuid = Guid.NewGuid(), HospitalUuid = hospitalUuid, MedicineUuid = medicineUuid, Quantity = 0, MinimumQuantity = 10, CreatedAt = DateTime.UtcNow }; dbContext.MedicineInventories.Add(item); }
        item.Quantity += change; item.UpdatedAt = DateTime.UtcNow;
    }

    private Task<bool> HasStock(Guid hospitalUuid, Guid medicineUuid, int quantity, CancellationToken cancellationToken) => dbContext.MedicineInventories.AnyAsync(item => item.HospitalUuid == hospitalUuid && item.MedicineUuid == medicineUuid && item.DeletedAt == null && item.Quantity >= quantity, cancellationToken);
    private async Task<bool> DetailsAreValid(IReadOnlyList<StockTicketDetailRequest> details, CancellationToken cancellationToken) => details.Count > 0 && details.Select(item => item.MedicineUuid).Distinct().Count() == details.Count && details.All(item => item.MedicineUuid != Guid.Empty && item.Quantity > 0 && item.Price >= 0) && await dbContext.Medicines.CountAsync(item => details.Select(detail => detail.MedicineUuid).Contains(item.Uuid) && item.DeletedAt == null, cancellationToken) == details.Count;
    private Guid? GetHospitalUuid() => User.GetHospitalUuid();
    private (Guid Hospital, Guid Account)? GetSession() { var hospital = User.GetHospitalUuid(); var account = User.GetAccountUuid(); return hospital.HasValue && account.HasValue ? (hospital.Value, account.Value) : null; }
}

file static class WarehouseEnumerableExtensions
{
    public static IEnumerable<TResult> Map<TSource, TResult>(this IEnumerable<TSource> source, Func<TSource, TResult> selector) => source.Select(selector);
}

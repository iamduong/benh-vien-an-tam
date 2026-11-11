using System.ComponentModel.DataAnnotations;
using api.Model.Enum;

namespace api.Contract.Warehouse;

public sealed class ProviderRequest
{
    [Required, StringLength(200, MinimumLength = 2)] public string Name { get; init; } = string.Empty;
    [Required, StringLength(500, MinimumLength = 5)] public string Address { get; init; } = string.Empty;
    [Required, StringLength(20, MinimumLength = 8)] public string Hotline { get; init; } = string.Empty;
    public ProviderStatus Status { get; init; } = ProviderStatus.Active;
}

public sealed class StockTicketDetailRequest
{
    public Guid MedicineUuid { get; init; }
    [Range(1, int.MaxValue)] public int Quantity { get; init; }
    [Range(0, int.MaxValue)] public int Price { get; init; }
}

public sealed class CreateImportTicketRequest
{
    public Guid ProviderUuid { get; init; }
    [StringLength(1000)] public string Note { get; init; } = string.Empty;
    [MinLength(1)] public IReadOnlyList<StockTicketDetailRequest> Details { get; init; } = [];
}

public sealed class CreateExportTicketRequest
{
    [StringLength(1000)] public string Note { get; init; } = string.Empty;
    [MinLength(1)] public IReadOnlyList<StockTicketDetailRequest> Details { get; init; } = [];
}

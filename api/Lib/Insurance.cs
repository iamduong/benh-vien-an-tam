using System.Text;
using System.Globalization;
using System.Text.RegularExpressions;
using api.Contract;
using api.Lib.Type;
using api.Model.Enum;

namespace api.Lib;

// SV4797524117384|4e677579e1bb856e204e616d2044c6b0c6a16e67|14/02/2005|1|54e1bb95203132204b50205068c3ba204de1bbb92c205068c6b0e1bb9d6e67205875c3a26e204ce1baad702c205468c3a06e68207068e1bb91204c6f6e67204b68c3a16e682c2054e1bb896e6820c490e1bb936e67204e6169|79 - 015|01/01/2025|-|23/12/2024|7915075205020410|-|4|01/01/2023|3d39a4720d7a15f7-1202|$

public sealed class Insurance
{
    private const int ExpectedPartCount = 15;
    private const string DateFormat = "dd/MM/yyyy";

    private readonly UTF8Encoding _utf8Encoding = new(false, true);

    public IdentityInsurance ValidateIdentity(string code)
    {
        if (string.IsNullOrWhiteSpace(code))
        {
            throw Invalid("Mã bảo hiểm không được để trống.");
        }

        var parts = code.Trim().Split('|');
        if (parts.Length != ExpectedPartCount || parts[^1] != "$")
        {
            throw Invalid("Mã bảo hiểm không đúng cấu trúc.");
        }

        var insuranceCardCode = parts[0].Trim().ToUpperInvariant();
        if (!Regex.IsMatch(insuranceCardCode, @"^(?:[A-Z]{2}[1-5]\d{12}|\d{10})$"))
        {
            throw Invalid("Số thẻ bảo hiểm y tế không hợp lệ.");
        }

        var name = DecodeHex(parts[1], "họ tên");
        var birthDate = ParseDate(parts[2], "ngày sinh");
        if (birthDate > DateTime.Today)
        {
            throw Invalid("Ngày sinh không hợp lệ.");
        }

        var gender = parts[3].Trim() switch
        {
            "1" => Gender.Male,
            "2" => Gender.Female,
            _ => throw Invalid("Giới tính trong mã bảo hiểm không hợp lệ.")
        };

        var address = DecodeHex(parts[4], "địa chỉ");
        var validFrom = ParseDate(parts[6], "ngày bắt đầu hiệu lực");
        var validToValue = parts[7].Trim();
        DateTime? validTo = validToValue == "-"
            ? null
            : ParseDate(validToValue, "ngày hết hiệu lực");

        if (validTo.HasValue && validTo.Value < validFrom)
        {
            throw Invalid("Thời hạn sử dụng thẻ bảo hiểm không hợp lệ.");
        }

        var today = DateTime.Today;
        if (validFrom > today || (validTo.HasValue && validTo.Value < today))
        {
            throw Invalid("Thẻ bảo hiểm y tế chưa có hiệu lực hoặc đã hết hạn.");
        }

        var identityCardCode = parts[9].Trim();
        if (!Regex.IsMatch(identityCardCode, @"^\d{10,20}$"))
        {
            throw Invalid("Mã định danh trong thẻ bảo hiểm không hợp lệ.");
        }

        var refCode = parts[13].Trim();
        if (!Regex.IsMatch(refCode, @"^[A-Fa-f0-9]+-\d+$"))
        {
            throw Invalid("Mã tham chiếu bảo hiểm không hợp lệ.");
        }

        return new IdentityInsurance
        {
            Medical = new IdentityMedical
            {
                RefCode = refCode,
                InsuranceCardCode = insuranceCardCode,
                ValidFrom = validFrom.ToString(DateFormat, CultureInfo.InvariantCulture),
                ValidTo = validTo?.ToString(DateFormat, CultureInfo.InvariantCulture) ?? "-"
            },
            Patient = new IdentityPatient
            {
                IdentityCardCode = identityCardCode,
                Name = name,
                Gender = gender,
                BirthDate = birthDate.ToString(DateFormat, CultureInfo.InvariantCulture),
                Address = address
            }
        };
    }

    private string DecodeHex(string value, string fieldName)
    {
        var normalized = value.Trim();
        if (string.IsNullOrEmpty(normalized) || normalized.Length % 2 != 0)
        {
            throw Invalid($"Thông tin {fieldName} trong mã bảo hiểm không hợp lệ.");
        }

        try
        {
            var decoded = _utf8Encoding.GetString(Convert.FromHexString(normalized)).Trim();
            if (string.IsNullOrEmpty(decoded) || decoded.Any(char.IsControl))
            {
                throw Invalid($"Thông tin {fieldName} trong mã bảo hiểm không hợp lệ.");
            }

            return decoded;
        }
        catch (Exception exception) when (
            exception is FormatException or DecoderFallbackException)
        {
            throw Invalid($"Thông tin {fieldName} trong mã bảo hiểm không hợp lệ.");
        }
    }

    private static DateTime ParseDate(string value, string fieldName)
    {
        if (!DateTime.TryParseExact(
                value.Trim(),
                DateFormat,
                CultureInfo.InvariantCulture,
                DateTimeStyles.None,
                out var date))
        {
            throw Invalid($"Thông tin {fieldName} trong mã bảo hiểm không hợp lệ.");
        }

        return date;
    }

    private static InvalidException Invalid(string message)
    {
        return new InvalidException(new Dictionary<string, string[]>
        {
            ["code"] = [message]
        });
    }
}

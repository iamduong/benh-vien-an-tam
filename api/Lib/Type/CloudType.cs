namespace api.Lib.Type;

public sealed class UploadResult
{
    public string Uri { get; set; } = string.Empty;
    public int Bytes { get; set; }
    public string Format { get; set; } = string.Empty;
}
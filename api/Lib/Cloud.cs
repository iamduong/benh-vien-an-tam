using api.Lib.Setting;
using CloudinaryDotNet;
using Microsoft.Extensions.Options;

namespace api.Lib;

public sealed class Cloud
{
    private CloudSetting _setting;
    public Cloudinary cloudinary;

    public Cloud(IOptions<CloudSetting> options)
    {
        this._setting = options.Value;
        
        Account account = new(
            this._setting.CloudName,
            this._setting.ApiKey,
            this._setting.ApiSecret
        );

        this.cloudinary = new Cloudinary(account);
    }
}
using System.Text;
using DeepAgenix.Common.Authentication;
using DeepAgenix.Common.ModelGateway;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace DeepAgenix.Common;

public static class CommonExtension
{
    private static bool registered = false;
    public static IServiceCollection AddCommonModule(this IServiceCollection services, IConfiguration configuration)
    {
        if (registered is true)
            return services;
        registered = true;
        services.Configure<JwtTokenOption>(configuration.GetSection("Jwt"));
        var jwtOption = services.BuildServiceProvider().GetRequiredService<IOptions<JwtTokenOption>>().Value;
        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer = jwtOption.Issuer,
                ValidAudience = jwtOption.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOption.Secret)),
                ClockSkew = TimeSpan.Zero
            };
        });
        services.AddAuthorization();
        services.AddScoped<IUserContext, UserContext>();
        services.AddModelGateway(configuration);

        return services;
    }
}
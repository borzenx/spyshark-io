using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System;
using System.Text;
using ShopifyStatsAPIs.Data; // Make sure to include your DbContext namespace
using Microsoft.IdentityModel.Logging;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = "https://spyshark.b2clogin.com/spyshark.onmicrosoft.com/B2C_1_signupsignin";
        options.Audience = "c4820a16-4060-4b19-a95e-55730da12d74";
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "https://spyshark.b2clogin.com/c62f29ac-a0de-470b-a839-c96befc63890/v2.0/",
            ValidAudience = "c4820a16-4060-4b19-a95e-55730da12d74",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("B2C_1A_SingningKey"))
        };
    });

// Add services
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins("https://spyshark-io.azurewebsites.net", "https://shopifystatsapi.azurewebsites.net")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Add DbContext
builder.Services.AddDbContext<MyDatabaseContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("AZURE_SQL_CONNECTIONSTRING")));

// Configure AutoMapper


builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Shopify Stats API", Version = "v1" });

    // Add the security requirement for Bearer token
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

IdentityModelEventSource.ShowPII = true;

app.UseHttpsRedirection();
app.UseRouting();

// Apply the CORS policy
app.UseCors();

// Add authentication and authorization
app.UseAuthentication();
app.UseAuthorization();

app.UseDeveloperExceptionPage();
app.UseSwagger();

app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Shopify Stats API/DB ");
});

app.MapControllers();

app.Run();

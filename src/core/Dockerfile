FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["src/core/", "core/"]
RUN dotnet restore "core/core.csproj"
RUN dotnet publish "core/core.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
COPY src/configs ./configs
EXPOSE 8080
ENTRYPOINT ["dotnet", "core.dll"]
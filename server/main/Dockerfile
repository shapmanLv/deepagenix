FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY main/ main/
COPY services/ services/
RUN dotnet restore "main/main.csproj"
RUN dotnet publish "main/main.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
COPY configs ./configs
EXPOSE 8080
ENTRYPOINT ["dotnet", "main.dll"]
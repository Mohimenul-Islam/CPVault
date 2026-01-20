# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project file and restore dependencies
COPY CPVault.csproj .
RUN dotnet restore

# Copy everything else and build
COPY . .
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .

# Expose port
EXPOSE 5263

# Set environment variables
ENV ASPNETCORE_URLS=http://+:5263
ENV ASPNETCORE_ENVIRONMENT=Development

ENTRYPOINT ["dotnet", "CPVault.dll"]

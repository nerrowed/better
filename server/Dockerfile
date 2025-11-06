# Use Alpine Linux for lightweight image
FROM alpine:latest

# Set working directory
WORKDIR /app

# Install dependencies (wget for downloading, ca-certificates for HTTPS, unzip for extraction)
RUN apk add --no-cache \
    ca-certificates \
    wget \
    unzip

# Download and install PocketBase
# Check latest version at: https://github.com/pocketbase/pocketbase/releases
ARG PB_VERSION=0.26.2
RUN wget https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip \
    && unzip pocketbase_${PB_VERSION}_linux_amd64.zip \
    && rm pocketbase_${PB_VERSION}_linux_amd64.zip \
    && chmod +x pocketbase

# Copy existing PocketBase data and migrations
COPY pb_data ./pb_data
COPY pb_migrations ./pb_migrations
COPY pb_hooks ./pb_hooks

# Copy public files (frontend build if using PocketBase as full-stack)
# If you want to serve frontend from PocketBase
# COPY pb_public ./pb_public

# Create volume for data persistence
VOLUME /app/pb_data

# Expose port 8080 (Back4app default)
EXPOSE 8080

# Health check endpoint
# PocketBase health endpoint is at /api/health
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || exit 1

# Start PocketBase server
# --http flag to specify host:port (Back4app requires 0.0.0.0:8080)
CMD ["/app/pocketbase", "serve", "--http=0.0.0.0:8080"]

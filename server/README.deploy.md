# Deploy PocketBase ke Back4app dengan Docker

## 📋 Prerequisites

- Akun Back4app
- Docker installed (untuk testing lokal)
- Git repository

## 🚀 Langkah Deploy ke Back4app

### 1. Test Docker Locally (Optional)

```bash
cd h:\Projek\websisak\server

# Build Docker image
docker build -t pocketbase-app .

# Run container
docker run -p 8080:8080 -v $(pwd)/pb_data:/app/pb_data pocketbase-app

# Test
# Buka: http://localhost:8080/_/
```

### 2. Push ke Git Repository

```bash
cd h:\Projek\websisak
git init
git add .
git commit -m "Add PocketBase with Docker support"
git remote add origin <YOUR_REPO_URL>
git push -u origin main
```

### 3. Deploy di Back4app

#### A. Via Back4app Dashboard

1. **Login ke Back4app**: https://www.back4app.com/
2. **Create New App** > **Container as a Service**
3. **Connect Git Repository**: Pilih repository Anda
4. **Configure Build**:
   - **Build context**: `/server`
   - **Dockerfile path**: `/server/Dockerfile`
   - **Port**: `8080`

5. **Environment Variables** (Optional):
   Tambahkan jika diperlukan:
   ```
   TZ=Asia/Jakarta
   ```

6. **Deploy**: Klik "Deploy"

#### B. Environment Configuration

Setelah deploy, dapatkan URL aplikasi Anda:
```
https://your-app-name.back4app.app
```

### 4. Setup Frontend

Update `.env` di frontend:

```env
# h:\Projek\websisak\client\.env
VITE_API_URL=https://your-app-name.back4app.app
```

### 5. Setup CORS di PocketBase

1. Login ke PocketBase admin: `https://your-app-name.back4app.app/_/`
2. Go to **Settings** > **Application**
3. Tambahkan ke **Allowed origins**:
   ```
   https://your-netlify-app.netlify.app
   http://localhost:5173
   ```

## 📝 Catatan Penting

### Volume/Storage di Back4app

⚠️ **WARNING**: Back4app Container as a Service mungkin **ephemeral** (tidak persistent).
Untuk production, pertimbangkan:

1. **External Database**:
   - Gunakan external S3 untuk file storage
   - Setup di PocketBase admin > Settings > Files storage

2. **External Storage Provider**:
   - AWS S3
   - Cloudflare R2
   - Backblaze B2

### Backup Data

Setup automatic backup:

1. Login ke PocketBase admin
2. Go to Settings > Backups
3. Enable automatic backups
4. Configure S3 backup location (recommended)

## 🔧 Troubleshooting

### Port Issues

Jika Back4app menggunakan PORT environment variable:

Edit Dockerfile, ganti:
```dockerfile
CMD ["/app/pocketbase", "serve", "--http=0.0.0.0:8080"]
```

Dengan:
```dockerfile
CMD /app/pocketbase serve --http=0.0.0.0:${PORT:-8080}
```

### Health Check Failed

Test health endpoint:
```bash
curl https://your-app-name.back4app.app/api/health
```

### Database Issues

Check logs di Back4app dashboard untuk error messages.

## 📚 Resources

- [PocketBase Docker Docs](https://pocketbase.io/docs/)
- [Back4app Container Docs](https://www.back4app.com/docs)
- [PocketBase GitHub](https://github.com/pocketbase/pocketbase)

## 🆘 Alternative: PocketHost

Jika Back4app bermasalah, coba PocketHost (hosting khusus PocketBase):
- Website: https://pockethost.io
- Free tier tersedia
- Persistent storage included
- Automatic backups

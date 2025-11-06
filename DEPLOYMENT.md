# 🚀 Deployment Guide - WebSisak

## Status Deployment

- ✅ **Backend (PocketBase)**: https://bace-3wsptpz1.b4a.run
  - Admin Dashboard: https://bace-3wsptpz1.b4a.run/_/
  - API Health: https://bace-3wsptpz1.b4a.run/api/health
  - Deployed on: Back4app (Docker)

- 🔄 **Frontend (React + Vite)**: *Pending deployment to Netlify*

---

## 📋 Backend Setup (DONE ✅)

### Back4app (PocketBase)

**URL**: https://bace-3wsptpz1.b4a.run

**Admin Credentials**:
- Email: sbima2432@gmail.com
- Password: 24@Kucingku lutu sekali

**Important Steps Done**:
1. ✅ Dockerfile created and fixed
2. ✅ Deployed to Back4app
3. ✅ Server running successfully
4. ⚠️ **TODO**: Setup CORS in admin dashboard

### Setup CORS (Required!)

1. Login to: https://bace-3wsptpz1.b4a.run/_/
2. Go to: **Settings** > **Application**
3. Add to **Allowed origins**:
   ```
   http://localhost:5173
   https://your-netlify-app.netlify.app
   *
   ```
4. Save changes

---

## 🌐 Frontend Deployment to Netlify

### Prerequisites
- [ ] Backend CORS configured
- [ ] Git repository created
- [ ] Netlify account

### Method 1: Git Deploy (Recommended)

#### Step 1: Push to Git

```bash
cd h:\Projek\websisak

# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/websisak.git

# Push
git push -u origin main
```

#### Step 2: Deploy on Netlify

1. Login to [Netlify](https://netlify.com)
2. Click **"Add new site"** > **"Import an existing project"**
3. Connect your Git repository
4. Configure build settings:
   - **Base directory**: `client`
   - **Build command**: `bun run build`
   - **Publish directory**: `client/dist`
   - **Node version**: 20

5. **Environment Variables**:
   Go to: Site settings > Environment variables > Add
   ```
   VITE_API_URL=https://bace-3wsptpz1.b4a.run
   ```

6. Click **"Deploy site"**

### Method 2: Manual Deploy (Quick Test)

```bash
# Build locally
cd h:\Projek\websisak\client
bun run build

# The build output will be in: client/dist
```

Then drag & drop the `client/dist` folder to Netlify dashboard.

---

## 🔧 Post-Deployment

### 1. Update CORS with Production URL

After getting Netlify URL (e.g., `https://websisak.netlify.app`):

1. Go to PocketBase admin: https://bace-3wsptpz1.b4a.run/_/
2. Settings > Application > Allowed origins
3. Add your Netlify URL:
   ```
   https://websisak.netlify.app
   ```

### 2. Test the Application

1. Open your Netlify URL
2. Try to login with:
   - **NIM/NIP** atau **Email**: (test user credentials)
   - **Password**: (test user password)

### 3. Create Test Users (if needed)

Login to PocketBase admin and create test users in:
- `students` collection (use NIM as identifier)
- `lecturers` collection (use NIP as identifier)

---

## 📊 Architecture

```
┌─────────────────────────────────────────────┐
│                                             │
│  Frontend (Netlify)                         │
│  https://your-app.netlify.app               │
│                                             │
│  - React + TypeScript + Vite                │
│  - TailwindCSS + Radix UI                   │
│                                             │
└──────────────────┬──────────────────────────┘
                   │
                   │ HTTPS/API Calls
                   │
┌──────────────────▼──────────────────────────┐
│                                             │
│  Backend (Back4app)                         │
│  https://bace-3wsptpz1.b4a.run              │
│                                             │
│  - PocketBase (Docker)                      │
│  - SQLite Database                          │
│  - Authentication & API                     │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🆘 Troubleshooting

### CORS Errors
```
Access to fetch at '...' has been blocked by CORS policy
```
**Solution**: Add frontend URL to PocketBase allowed origins (see above)

### 401 Unauthorized
```
Failed to authenticate
```
**Solution**:
1. Check credentials
2. Check if users exist in PocketBase admin
3. Check collection auth rules

### Connection Refused
```
Failed to connect to backend
```
**Solution**:
1. Check if backend is running: https://bace-3wsptpz1.b4a.run/api/health
2. Check VITE_API_URL in Netlify environment variables

---

## 🔐 Security Notes

### Production Checklist

- [ ] Remove wildcard `*` from CORS allowed origins
- [ ] Use specific frontend URL only
- [ ] Enable HTTPS only (already done)
- [ ] Review API rules for all collections
- [ ] Setup automatic backups in PocketBase
- [ ] Consider external S3 storage for files
- [ ] Setup monitoring/alerting

### Environment Variables

**Never commit these files**:
- ❌ `.env` (contains secrets)
- ✅ `.env.example` (template only)

---

## 📚 Resources

- [PocketBase Docs](https://pocketbase.io/docs/)
- [Back4app Docs](https://www.back4app.com/docs)
- [Netlify Docs](https://docs.netlify.com/)
- [Vite Docs](https://vitejs.dev/)

---

## 📞 Support

For issues or questions:
1. Check logs in Back4app dashboard
2. Check browser console for frontend errors
3. Check PocketBase admin logs
4. Review API rules in collections settings

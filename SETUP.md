# Hetzel's Workshop — Setup & Deployment Guide

## 🛠 Local Development

### Prerequisites
- **Node.js >= 20.19.0**
- npm

### Quick Start
```bash
npm install
npm run dev
```

## 🚀 Deployment Guide (GitHub to Vercel)

This application is built with **Vite 7** and is designed to be deployed seamlessly on **Vercel**.

### 1. Prepare your Repository
Ensure your code is committed and pushed to a GitHub repository.
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Connect to Vercel
1.  Log in to [Vercel](https://vercel.com).
2.  Click **"Add New..."** and select **"Project"**.
3.  Select your GitHub repository from the list.

### 3. Build Settings
Vercel will automatically detect the Vite framework. Verify the following settings:
- **Framework Preset**: `Vite`
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4. Environment Variables (Optional)
If you decide to use private webhooks or API keys in the future, add them in the **"Environment Variables"** section of the project settings on Vercel.

### 5. Deploy
Click **"Deploy"**. Vercel will clone your repo, run the build command, and serve the `dist` folder.

## 🔧 Configuration

### Discord Presence
Update `src/lib/site-constants.ts` with your Discord ID:
```ts
export const DISCORD_ID = "1097536305027629119";
```

### Webhooks
The contact form and survey use the `DISCORD_WEBHOOK` constant in `src/lib/site-constants.ts`. Ensure this is set to a valid Discord webhook URL.

## 📱 Mobile Optimization
The site uses Tailwind CSS 4 for responsive design. Test your deployment on various screen sizes using Vercel's preview URLs.

## 🔍 Troubleshooting
- **Build Fails**: Ensure your Node.js version on Vercel matches the project requirements (Node 20+). You can set this in `package.json` under `engines` or in Vercel project settings.
- **Styles Missing**: Ensure `@import "tailwindcss";` is at the top of `src/index.css`.
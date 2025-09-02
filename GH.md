# Resume Master - GitHub Deployment Guide

## Overview
This guide provides comprehensive instructions for deploying Resume Master to GitHub Pages, setting up custom domains, and configuring CI/CD workflows for automated deployments.

## Prerequisites
- Node.js 18+ and npm/yarn/pnpm installed
- Git configured with your GitHub account
- GitHub account with repository access

## Quick Deployment Setup

### 1. Repository Setup
```bash
# Clone or fork the repository
git clone https://github.com/yourusername/resume-master.git
cd resume-master

# Install dependencies
npm install

# Build the project
npm run build
```

### 2. GitHub Pages Configuration

#### Option A: Automated GitHub Actions Deployment
Create `.github/workflows/deploy.yml`:\

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      pages: write
      id-token: write
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build project
      run: npm run build
      
    - name: Setup Pages
      uses: actions/configure-pages@v3
      
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v2
      with:
        path: ./dist
        
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v2
```

#### Option B: Manual Deployment
```bash
# Install gh-pages package
npm install --save-dev gh-pages

# Add deployment script to package.json
"scripts": {
  "deploy": "gh-pages -d dist",
  "predeploy": "npm run build"
}

# Deploy to GitHub Pages
npm run deploy
```

### 3. Repository Settings Configuration

1. Navigate to your GitHub repository
2. Go to **Settings** → **Pages**
3. Under **Source**, select:
   - **GitHub Actions** (for automated deployment)
   - **Deploy from a branch** → **gh-pages** (for manual deployment)
4. Save the configuration

## Advanced Configuration

### Custom Domain Setup

#### 1. Domain Configuration
Create `public/CNAME` file:
```
yourdomain.com
```

#### 2. DNS Configuration
Add DNS records with your domain provider:
```
# For root domain (yourdomain.com)
A Record: 185.199.108.153
A Record: 185.199.109.153  
A Record: 185.199.110.153
A Record: 185.199.111.153

# For subdomain (resume.yourdomain.com)  
CNAME Record: yourusername.github.io
```

#### 3. GitHub Pages Custom Domain
1. Go to repository **Settings** → **Pages**
2. Enter your custom domain in the **Custom domain** field
3. Check **Enforce HTTPS**
4. Wait for DNS propagation (may take up to 24 hours)

### Environment Configuration

#### Vite Configuration for GitHub Pages
Update `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: '/resume-master/', // Replace with your repository name
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select']
        }
      }
    }
  }
})
```

#### Package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "deploy": "gh-pages -d dist",
    "predeploy": "npm run build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  }
}
```

## Production Optimization

### Performance Enhancements
```typescript
// Add to vite.config.ts
export default defineConfig({
  // ... other config
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-toast'],
          editor: ['@tiptap/react', '@tiptap/starter-kit'],
          utils: ['date-fns', 'clsx', 'tailwind-merge']
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
```

### SEO and Meta Tags
Create `public/index.html` with proper meta tags:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Resume Master - Professional Resume Management</title>
    
    <!-- SEO Meta Tags -->
    <meta name="description" content="Create, manage, and track professional resume variants for job applications with Resume Master.">
    <meta name="keywords" content="resume, CV, job application, career, professional">
    <meta name="author" content="Resume Master">
    
    <!-- Open Graph -->
    <meta property="og:title" content="Resume Master - Professional Resume Management">
    <meta property="og:description" content="Create, manage, and track professional resume variants for job applications.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://yourdomain.com">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Resume Master">
    <meta name="twitter:description" content="Professional resume management platform">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## CI/CD Pipeline Setup

### Complete GitHub Actions Workflow
Create `.github/workflows/ci-cd.yml`:
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run linter
      run: npm run lint
      
    - name: Run tests
      run: npm run test
      
    - name: Build project
      run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    permissions:
      contents: read
      pages: write
      id-token: write
      
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build project
      run: npm run build
      
    - name: Setup Pages
      uses: actions/configure-pages@v3
      
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v2
      with:
        path: ./dist
        
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v2
```

## Installation Scripts

### Automated Setup Script
Create `setup.sh`:
```bash
#!/bin/bash

# Resume Master GitHub Deployment Setup Script
set -e

echo "🚀 Resume Master GitHub Deployment Setup"
echo "========================================"

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Please install Node.js 18+." >&2; exit 1; }
command -v git >/dev/null 2>&1 || { echo "❌ Git is required but not installed. Please install Git." >&2; exit 1; }

# Get repository information
read -p "📂 Enter your GitHub repository URL: " REPO_URL
read -p "🌐 Enter your custom domain (optional, press enter to skip): " CUSTOM_DOMAIN
read -p "📁 Enter repository name for base path (e.g., resume-master): " REPO_NAME

echo "⬇️  Cloning repository..."
git clone $REPO_URL
cd $(basename $REPO_URL .git)

echo "📦 Installing dependencies..."
npm install

# Configure Vite for GitHub Pages
echo "⚙️  Configuring Vite..."
cat > vite.config.ts << EOF
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: '/$REPO_NAME/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  }
})
EOF

# Add deployment scripts
echo "📝 Adding deployment scripts..."
npm install --save-dev gh-pages

# Create CNAME file if custom domain provided
if [ ! -z "$CUSTOM_DOMAIN" ]; then
  echo "🌐 Setting up custom domain..."
  echo $CUSTOM_DOMAIN > public/CNAME
fi

# Create GitHub Actions workflow
echo "🔧 Setting up GitHub Actions..."
mkdir -p .github/workflows
cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      pages: write
      id-token: write
    
    steps:
    - uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build project
      run: npm run build
      
    - name: Setup Pages
      uses: actions/configure-pages@v3
      
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v2
      with:
        path: ./dist
        
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v2
EOF

echo "🏗️  Building project..."
npm run build

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Commit and push changes: git add . && git commit -m 'Setup GitHub Pages deployment' && git push"
echo "2. Go to your GitHub repository Settings > Pages"
echo "3. Select 'GitHub Actions' as the source"
echo "4. Your app will be available at: https://yourusername.github.io/$REPO_NAME"
if [ ! -z "$CUSTOM_DOMAIN" ]; then
  echo "5. Configure DNS records for your custom domain: $CUSTOM_DOMAIN"
fi
```

### Windows PowerShell Setup Script
Create `setup.ps1`:
```powershell
# Resume Master GitHub Deployment Setup Script for Windows
param(
    [Parameter(Mandatory=$true)]
    [string]$RepoUrl,
    
    [Parameter(Mandatory=$false)]
    [string]$CustomDomain = "",
    
    [Parameter(Mandatory=$true)]
    [string]$RepoName
)

Write-Host "🚀 Resume Master GitHub Deployment Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check prerequisites
try {
    node --version | Out-Null
    Write-Host "✅ Node.js found" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is required but not installed. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

try {
    git --version | Out-Null
    Write-Host "✅ Git found" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is required but not installed. Please install Git" -ForegroundColor Red
    exit 1
}

# Clone repository
Write-Host "⬇️  Cloning repository..." -ForegroundColor Yellow
git clone $RepoUrl
$repoDir = (Split-Path $RepoUrl -Leaf) -replace '\\.git$', ''
Set-Location $repoDir

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Configure Vite
Write-Host "⚙️  Configuring Vite..." -ForegroundColor Yellow
$viteConfig = @"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: '/$RepoName/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  }
})

"@

$viteConfig | Out-File -FilePath "vite.config.ts" -Encoding UTF8

# Add deployment dependencies
Write-Host "📝 Adding deployment dependencies..." -ForegroundColor Yellow
npm install --save-dev gh-pages

# Create CNAME file if custom domain provided
if ($CustomDomain -ne "") {
    Write-Host "🌐 Setting up custom domain..." -ForegroundColor Yellow
    $CustomDomain | Out-File -FilePath "public/CNAME" -Encoding ASCII
}

# Create GitHub Actions workflow
Write-Host "🔧 Setting up GitHub Actions..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path ".github/workflows"

$workflow = @"
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      pages: write
      id-token: write
    
    steps:
    - uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build project
      run: npm run build
      
    - name: Setup Pages
      uses: actions/configure-pages@v3
      
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v2
      with:
        path: ./dist
        
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v2
"@

$workflow | Out-File -FilePath ".github/workflows/deploy.yml" -Encoding UTF8

# Build project
Write-Host "🏗️  Building project..." -ForegroundColor Yellow
npm run build

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Commit and push changes: git add . && git commit -m 'Setup GitHub Pages deployment' && git push"
Write-Host "2. Go to your GitHub repository Settings > Pages"
Write-Host "3. Select 'GitHub Actions' as the source"
Write-Host "4. Your app will be available at: https://yourusername.github.io/$RepoName"
if ($CustomDomain -ne "") {
    Write-Host "5. Configure DNS records for your custom domain: $CustomDomain"
}
```

## Docker Deployment (Alternative)

### Dockerfile
```dockerfile
# Multi-stage build for production
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration
Create `nginx.conf`:
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    sendfile on;
    keepalive_timeout 65;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/x-javascript
        application/xml+rss
        application/javascript
        application/json;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
    }
}
```

### Docker Compose (Development)
Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  resume-master:
    build: .
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
```

## Troubleshooting

### Common Issues and Solutions

#### 1. GitHub Pages Not Updating
```bash
# Clear GitHub Actions cache
gh api repos/{owner}/{repo}/actions/caches --method DELETE

# Check workflow status
gh run list --limit 5

# Re-run failed workflow
gh run rerun {run-id}
```

#### 2. Custom Domain Issues
```bash
# Verify DNS configuration
nslookup yourdomain.com
dig yourdomain.com

# Check HTTPS certificate status
curl -I https://yourdomain.com
```

#### 3. Build Failures
```bash
# Local build test
npm run build

# Check for dependency issues
npm audit
npm update

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. Routing Issues with SPA
Ensure proper base configuration in `vite.config.ts` and add fallback routing in server configuration.

### Performance Monitoring
Add analytics and monitoring:
```html
<!-- Add to index.html head -->
<script>
  // Simple performance monitoring
  window.addEventListener('load', function() {
    if ('performance' in window) {
      console.log('Page load time:', performance.timing.loadEventEnd - performance.timing.navigationStart);
    }
  });
</script>
```

## Security Considerations

### Content Security Policy
Add CSP headers to `index.html`:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:;">
```

### Dependency Security
```bash
# Regular security audits
npm audit
npm audit fix

# Monitor for vulnerabilities
npm install -g npm-check-updates
ncu -u
```

This comprehensive GitHub deployment guide provides everything needed to successfully deploy Resume Master to GitHub Pages with professional production configurations, automated CI/CD, and custom domain support.

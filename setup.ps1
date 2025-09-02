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
$repoDir = (Split-Path $RepoUrl -Leaf) -replace '\.git$', ''
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
"@

$viteConfig | Out-File -FilePath "vite.config.ts" -Encoding UTF8

# Add deployment dependencies
Write-Host "📝 Adding deployment dependencies..." -ForegroundColor Yellow
npm install --save-dev gh-pages

# Update package.json
$packageJson = Get-Content "package.json" | ConvertFrom-Json
if (-not $packageJson.scripts) {
    $packageJson | Add-Member -Type NoteProperty -Name "scripts" -Value @{}
}
$packageJson.scripts | Add-Member -Type NoteProperty -Name "deploy" -Value "gh-pages -d dist" -Force
$packageJson.scripts | Add-Member -Type NoteProperty -Name "predeploy" -Value "npm run build" -Force
$packageJson | Add-Member -Type NoteProperty -Name "homepage" -Value "https://yourusername.github.io/$RepoName" -Force

$packageJson | ConvertTo-Json -Depth 10 | Out-File -FilePath "package.json" -Encoding UTF8

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
Write-Host ""
Write-Host "For more detailed setup instructions, see GH.md"
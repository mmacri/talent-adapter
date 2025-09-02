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
EOF

# Add deployment scripts to package.json
echo "📝 Adding deployment scripts..."
npm install --save-dev gh-pages

# Update package.json with deploy script
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts = pkg.scripts || {};
pkg.scripts.deploy = 'gh-pages -d dist';
pkg.scripts.predeploy = 'npm run build';
pkg.homepage = 'https://\$GITHUB_USERNAME.github.io/$REPO_NAME';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

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
echo ""
echo "For more detailed setup instructions, see GH.md"
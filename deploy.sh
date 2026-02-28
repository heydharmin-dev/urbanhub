#!/bin/bash
set -e

# ============================================
#  UrbanHire - One-Click Server Deploy Script
#  Run this on your Google Cloud instance
# ============================================

# --- Colors for output ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

print_step() { echo -e "\n${CYAN}[STEP]${NC} $1"; }
print_ok()   { echo -e "${GREEN}[OK]${NC} $1"; }
print_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
print_err()  { echo -e "${RED}[ERROR]${NC} $1"; }

# --- Configuration ---
APP_NAME="urbanhub"
REPO_URL="https://github.com/heydharmin-dev/urbanhub.git"
APP_DIR="/var/www/$APP_NAME"
DOMAIN="_"  # Change to your domain if you have one (e.g., "urbanhire.com")

SUPABASE_URL="https://caeawanqizissmeyjgcd.supabase.co"
SUPABASE_ANON_KEY="sb_publishable_F0cJGI9RDcqRxI0aGHcgNA_iMhEXxKF"

echo -e "${CYAN}"
echo "============================================"
echo "   UrbanHire - Server Deployment Script"
echo "============================================"
echo -e "${NC}"

# --- 1. Update system ---
print_step "Updating system packages..."
sudo apt update -y && sudo apt upgrade -y
print_ok "System updated"

# --- 2. Install Node.js 20 ---
print_step "Installing Node.js 20..."
if command -v node &> /dev/null; then
    NODE_VER=$(node -v)
    print_warn "Node.js already installed ($NODE_VER), skipping..."
else
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
    print_ok "Node.js $(node -v) installed"
fi

# --- 3. Install Nginx ---
print_step "Installing Nginx..."
if command -v nginx &> /dev/null; then
    print_warn "Nginx already installed, skipping..."
else
    sudo apt install -y nginx
    print_ok "Nginx installed"
fi

# --- 4. Clone the repo ---
print_step "Cloning project from GitHub..."
if [ -d "$APP_DIR" ]; then
    print_warn "Directory $APP_DIR exists. Pulling latest changes..."
    cd "$APP_DIR"
    sudo git pull origin main
else
    sudo git clone "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
fi
print_ok "Project cloned to $APP_DIR"

# --- 5. Create .env file ---
print_step "Creating environment file..."
sudo tee "$APP_DIR/.env" > /dev/null <<EOF
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
EOF
print_ok ".env file created"

# --- 6. Install dependencies ---
print_step "Installing npm dependencies..."
cd "$APP_DIR"
sudo npm install
print_ok "Dependencies installed"

# --- 7. Build the project ---
print_step "Building production bundle..."
sudo npm run build
print_ok "Build complete (dist/ folder created)"

# --- 8. Set correct permissions ---
print_step "Setting file permissions..."
sudo chown -R www-data:www-data "$APP_DIR/dist"
sudo chmod -R 755 "$APP_DIR/dist"
print_ok "Permissions set"

# --- 9. Configure Nginx ---
print_step "Configuring Nginx..."
sudo tee /etc/nginx/sites-available/$APP_NAME > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    root $APP_DIR/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing - serve index.html for all routes
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

# Enable site and remove default
sudo ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
print_ok "Nginx configured and running"

# --- 10. Open firewall (if ufw is active) ---
print_step "Configuring firewall..."
if command -v ufw &> /dev/null && sudo ufw status | grep -q "active"; then
    sudo ufw allow 'Nginx Full'
    print_ok "Firewall rules updated"
else
    print_warn "UFW not active, skipping. Make sure port 80/443 is open in GCP firewall."
fi

# --- Done! ---
echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}   Deployment Complete!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""

# Get server IP
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')
echo -e "  Your app is live at: ${CYAN}http://$SERVER_IP${NC}"
echo ""
echo -e "  Useful commands:"
echo -e "    sudo systemctl status nginx    ${YELLOW}# Check Nginx status${NC}"
echo -e "    sudo nginx -t                  ${YELLOW}# Test Nginx config${NC}"
echo -e "    sudo systemctl restart nginx   ${YELLOW}# Restart Nginx${NC}"
echo -e "    cd $APP_DIR && sudo git pull   ${YELLOW}# Pull latest code${NC}"
echo ""
echo -e "${YELLOW}  Next steps:${NC}"
echo -e "    1. Make sure GCP firewall allows HTTP (port 80)"
echo -e "    2. (Optional) Add a domain and set up SSL with:"
echo -e "       sudo apt install certbot python3-certbot-nginx"
echo -e "       sudo certbot --nginx -d yourdomain.com"
echo ""

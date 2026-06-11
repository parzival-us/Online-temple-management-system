# Production Deployment Guide

This guide outlines how to deploy the Temple Management System to a production environment. 

## 1. Environment Preparation
For a robust production setup, it is recommended to use a Linux VPS (e.g., Ubuntu 22.04 on AWS EC2, DigitalOcean, or Linode).

### Install System Dependencies
```bash
sudo apt update
sudo apt install python3-pip python3-venv mysql-server nginx curl
# Install Node.js (v18+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs
```

## 2. Database Setup
Secure your MySQL installation and create the production database.
```bash
sudo mysql_secure_installation
sudo mysql
```
Inside the MySQL prompt:
```sql
CREATE DATABASE temple_prod;
CREATE USER 'temple_admin'@'localhost' IDENTIFIED BY 'StrongPassword123!';
GRANT ALL PRIVILEGES ON temple_prod.* TO 'temple_admin'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 3. Backend Deployment (Flask + Gunicorn)
We will use Gunicorn as the WSGI HTTP Server to serve the Flask application.

```bash
cd /var/www/Online-Temple-Management-System/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn
```

**Set up Production `.env`**:
Create your `.env` file with secure keys and the production database URI:
`DATABASE_URL=mysql+pymysql://temple_admin:StrongPassword123!@localhost/temple_prod`

**Run Migrations**:
```bash
flask db upgrade
```

**Create a Systemd Service for Gunicorn**:
Create a file at `/etc/systemd/system/temple_backend.service`:
```ini
[Unit]
Description=Gunicorn instance to serve Temple Management Backend
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/var/www/Online-Temple-Management-System/backend
Environment="PATH=/var/www/Online-Temple-Management-System/backend/venv/bin"
ExecStart=/var/www/Online-Temple-Management-System/backend/venv/bin/gunicorn --workers 3 --bind 127.0.0.1:5000 run:app

[Install]
WantedBy=multi-user.target
```
Start and enable the service:
```bash
sudo systemctl start temple_backend
sudo systemctl enable temple_backend
```

## 4. Frontend Deployment (React + Vite)
We will build the static files using Vite and serve them directly via Nginx.

```bash
cd /var/www/Online-Temple-Management-System/frontend
npm install
npm run build
```
This generates a `dist` folder containing the compiled static assets.

## 5. Nginx Configuration
Configure Nginx to serve the frontend `dist` directory and reverse-proxy API requests to Gunicorn.

Create a file at `/etc/nginx/sites-available/temple`:
```nginx
server {
    listen 80;
    server_name your_domain.com;

    # Serve React Frontend
    location / {
        root /var/www/Online-Temple-Management-System/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to Flask Backend
    location /api {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/temple /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl restart nginx
```

## 6. SSL Configuration (HTTPS)
Use Let's Encrypt to secure your site with HTTPS.
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your_domain.com
```

Your Temple Management System is now live and secure!

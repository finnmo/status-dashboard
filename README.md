# Service Status Dashboard

A dashboard for monitoring the status of various services.

## Setup

1. Clone the repository
2. Copy `config.example.js` to `config.js`:
   ```bash
   cp config.example.js config.js
   ```
3. Edit `config.js` to add your services:
   ```javascript
   window.SERVICE_CONFIG = [
     {
       url: "https://your-service.com",
       name: "Service Name"
     }
   ];
   ```
4. Open `index.html` in a browser

## Configuration

The `config.js` file contains the list of services to monitor. Each service should have:
- `url`: The URL to check (can be HTTP/HTTPS or internal hostname)
- `name`: Display name for the service

## Security Note

The `config.js` file contains internal URLs and should not be committed to version control. It is already added to `.gitignore` to prevent accidental commits. 
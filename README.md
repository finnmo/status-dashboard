# Service Status Dashboard

A dashboard for monitoring the status of various services.

## Development Setup

1. Clone the repository
2. Create a `.env` file in the root directory with your service configurations:
   ```bash
   # Service URLs
   SERVICE_1_URL=https://example1.com
   SERVICE_2_URL=https://example2.com
   SERVICE_3_URL=internal-service.local
   
   # Service Names
   SERVICE_1_NAME="Example Service 1"
   SERVICE_2_NAME="Example Service 2"
   SERVICE_3_NAME="Internal Service"
   ```
3. Create a `config.js` file in the `src` directory:
   ```bash
   cp config.example.js src/config.js
   ```
4. Edit `src/config.js` to match your `.env` configuration
5. Start a local server (e.g., using Python or Node.js):
   ```bash
   # Using Python 3
   python -m http.server 3000
   
   # Or using Node.js
   npx serve src
   ```
6. Open `http://localhost:3000` in your browser

## Production Deployment

The dashboard is automatically deployed to GitHub Pages when changes are pushed to the main branch. The deployment uses GitHub Actions secrets for configuration:

1. Go to your repository settings
2. Navigate to "Secrets and variables" → "Actions"
3. Add your service configurations as secrets (URL and NAME pairs for each service)

## Configuration

Each service requires two pieces of information:
- `url`: The URL to check (can be HTTP/HTTPS or internal hostname)
- `name`: Display name for the service

## Security Note

The `config.js` file contains internal URLs and should not be committed to version control. It is already added to `.gitignore` to prevent accidental commits. 
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const services = [
  {
    url: process.env.CURTIN_WEBSITE_URL,
    name: process.env.CURTIN_WEBSITE_NAME
  },
  {
    url: process.env.SMART_CAMPUS_URL,
    name: process.env.SMART_CAMPUS_NAME
  },
  {
    url: process.env.TRAKKA_URL,
    name: process.env.TRAKKA_NAME
  },
  {
    url: process.env.POWER_MONITORING_EXPERT_URL,
    name: process.env.POWER_MONITORING_EXPERT_NAME
  },
  {
    url: process.env.PARKAID_OUTDOOR_URL,
    name: process.env.PARKAID_OUTDOOR_NAME
  },
  {
    url: process.env.PARKAID_UNDERGROUND_URL,
    name: process.env.PARKAID_UNDERGROUND_NAME
  },
  {
    url: process.env.PARKING_SIGNAGE_URL,
    name: process.env.PARKING_SIGNAGE_NAME
  }
].filter(service => service.url && service.name);

const configContent = `/* generated ${new Date().toISOString()} */
window.SERVICE_CONFIG = ${JSON.stringify(services, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/config.js'), configContent);
console.log('Generated config.js with', services.length, 'services'); 
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Parse the SERVICES environment variable
// Expected format: "name1|url1,name2|url2,name3|url3"
const parseServices = () => {
  const servicesEnv = process.env.SERVICES || '';
  return servicesEnv
    .split(',')
    .map(service => {
      const [name, url] = service.split('|');
      return { name: name?.trim(), url: url?.trim() };
    })
    .filter(service => service.name && service.url);
};

const services = parseServices();

const configContent = `/* generated ${new Date().toISOString()} */
window.SERVICE_CONFIG = ${JSON.stringify(services, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/config.js'), configContent);
console.log('Generated config.js with', services.length, 'services'); 
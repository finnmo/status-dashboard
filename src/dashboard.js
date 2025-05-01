// Debug logging
console.log('Dashboard.js loaded');
console.log('SERVICE_CONFIG:', window.SERVICE_CONFIG);

const config = window.SERVICE_CONFIG || [];
if (!config.length) {
  document.getElementById("gauges").innerHTML =
    '<p class="text-red-500 col-span-full">No targets configured.</p>';
  throw new Error("SERVICE_CONFIG is empty – check config.js");
}

const services = config.map(c => ({
  name: c.name,
  url: c.url.endsWith('/') ? c.url : c.url + '/',
}));

console.log('Services configured:', services);

// Create gauge elements and store their references
const gauges = services.map(service => {
  console.log('Creating gauge for:', service.name);
  
  const container = document.createElement('div');
  container.className = 'gauge-container';
  
  const nameDiv = document.createElement('div');
  nameDiv.className = 'service-name';
  nameDiv.textContent = service.name;
  
  const gaugeDiv = document.createElement('div');
  const gaugeId = `gauge-${service.name.replace(/[^a-z0-9]/gi, '-')}`;
  gaugeDiv.id = gaugeId;
  
  const statusDiv = document.createElement('div');
  statusDiv.className = 'status-text';
  statusDiv.textContent = 'Checking...';
  
  container.appendChild(nameDiv);
  container.appendChild(gaugeDiv);
  container.appendChild(statusDiv);
  
  // Add the container to the DOM first
  document.getElementById('gauges').appendChild(container);
  
  // Create the gauge with explicit options
  const gauge = new JustGage({
    id: gaugeId,
    value: 100,
    min: 0,
    max: 100,
    title: "",
    label: "",
    levelColors: ["#22c55e"],  // Start with green
    levelColorsGradient: false,
    gaugeWidthScale: 0.6,
    counter: false,
    decimals: 0,
    donut: true,
    gaugeColor: "#1e293b",
    valueFontColor: "#ffffff",
    valueFontSize: 0,
    symbol: "",
    textRenderer: function(value) {
      return "";
    }
  });
  
  return { service, gauge, statusDiv };
});

// Function to check a single service with multiple attempts
async function checkService(service) {
  const attempts = [
    { method: 'GET', timeout: 5000 },
    { method: 'HEAD', timeout: 5000 },
    { method: 'GET', timeout: 10000 }
  ];

  for (const attempt of attempts) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), attempt.timeout);

      const response = await fetch(service.url, {
        method: attempt.method,
        mode: 'no-cors',
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      clearTimeout(timeoutId);
      
      // For no-cors requests, we can't check the status
      // If we get here, the request completed
      return true;
    } catch (error) {
      console.log(`Attempt failed for ${service.name} (${attempt.method}):`, error.message);
      // Add a small delay between attempts
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  return false;
}

// Function to check all services with delays between each service
async function checkAllServices() {
  console.log('Starting service checks...');
  
  for (const service of services) {
    console.log(`Checking ${service.name}...`);
    const isUp = await checkService(service);
    updateGauge(service.name, isUp);
    // Add a delay between checking different services
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('All services checked');
}

// Function to show toast notifications
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `px-4 py-2 rounded-lg text-white ${
    type === 'error' ? 'bg-red-500' : 'bg-blue-500'
  }`;
  toast.textContent = message;
  
  const container = document.getElementById('toast-container');
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 5000);
}

// Update all gauges
async function updateGauges() {
  console.log('Updating gauges...');
  for (const { service, gauge, statusDiv } of gauges) {
    const isOnline = await checkService(service);
    
    // Update the gauge color based on status
    gauge.config.levelColors = [isOnline ? '#22c55e' : '#ef4444'];
    gauge.refresh(100);
    
    // Update status text
    statusDiv.textContent = isOnline ? 'Online' : 'Offline';
    statusDiv.className = `status-text ${isOnline ? 'online' : 'offline'}`;
    
    if (!isOnline) {
      showToast(`${service.name} is down`, 'error');
    }
  }
}

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
  console.log('Starting initial gauge update...');
  updateGauges();
  
  // Update every 30 seconds
  setInterval(updateGauges, 30000);
});
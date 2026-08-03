const https = require('https');

const req = https.get('https://vlog-portfoliya-wv41.vercel.app/api/config', (res) => {
  console.log(`statusCode: ${res.statusCode}`);
  
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (error) => {
  console.error(error);
});

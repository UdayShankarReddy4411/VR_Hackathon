const fs = require('fs');
const path = require('path');

const files = [
  'd:/Hackathon/frontend/src/pages/Home.jsx',
  'd:/Hackathon/frontend/src/pages/Donate.jsx',
  'd:/Hackathon/frontend/src/pages/Dashboard.jsx',
  'd:/Hackathon/frontend/src/pages/CauseDetail.jsx',
  'd:/Hackathon/frontend/src/pages/AdminDashboard.jsx',
  'd:/Hackathon/frontend/src/pages/LoginRegister.jsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Regex to match the conflict blocks and replace with the HEAD block
  // We use [\s\S]*? to match across newlines lazily.
  const regex = /<<<<<<< HEAD\n([\s\S]*?)=======\n[\s\S]*?>>>>>>> [a-f0-9]+\n/g;
  
  const newContent = content.replace(regex, '$1');
  
  fs.writeFileSync(file, newContent);
  console.log('Fixed', file);
}

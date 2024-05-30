let fs = require('fs');

let version = require('../package.json').version;
let today = new Date().toISOString().substring(0, 10);

let fileContent = `var build = {
  version: '${version}',
  date: '${today}',
};
`;

fs.writeFileSync('public/js/build.js', fileContent);

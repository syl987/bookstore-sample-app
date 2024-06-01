// @ts-check

import fs from 'fs';

import packageJson from '../package.json' assert { type: 'json' };

let today = new Date().toISOString().substring(0, 10);

let fileContent = `var build = {
  version: '${packageJson.version}',
  date: '${today}',
};
`;

fs.writeFileSync('public/build.js', fileContent);

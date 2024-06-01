// @ts-check
import fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const packageJson = require('../package.json');

let today = new Date().toISOString().substring(0, 10);

let fileContent = `var build = {
  version: '${packageJson.version}',
  date: '${today}',
};
`;

fs.writeFileSync('public/build.js', fileContent);

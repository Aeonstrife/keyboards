import * as stringify from 'json-stringify-pretty-compact';
import * as glob from 'glob';
import * as fs from 'fs';
import * as rimraf from 'rimraf';
import {promisify} from 'bluebird';
import {generateVIADefinitionLookupMap} from 'via-reader';

const viaAPIVersion = '0.0.1';

async function build() {
  await promisify(rimraf)('dist/*');

  const definitions = glob
    .sync('src/**/*.json', {absolute: true})
    .map(f => require(f));

  const res = {
    version: viaAPIVersion,
    generatedAt: Date.now(),
    definitions: generateVIADefinitionLookupMap(definitions)
  };

  try {
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist');
    }

    fs.writeFileSync('dist/keyboards.json', stringify(res));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

build();
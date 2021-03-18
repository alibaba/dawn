const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');

const getPkgJson = ({ name, description, typescript }) => {
  return {
    name,
    version: '0.0.0',
    description,
    keywords: ['dawn'],
    homepage: 'http://dawnjs.com/',
    license: 'MIT',
    main: 'lib/index.js',
    files: ['lib'],
    publishConfig: { registry: 'https://registry.npmjs.org', access: 'public' },
    repository: { type: 'git', url: 'git+https://github.com/alibaba/dawn.git' },
    scripts: typescript
      ? {
          clean: 'rimraf lib',
          prebuild: 'npm run clean',
          build: 'tsc',
          prepublishOnly: 'npm run build',
        }
      : {},
    bugs: { url: 'https://github.com/alibaba/dawn/issues' },
    dependencies: {},
  };
};

inquirer
  .prompt([
    {
      type: 'input',
      name: 'dir',
      message: 'Please enter package directory:',
      validate: input => {
        if (!input) {
          return 'Package directory name needed!';
        }
        if (fs.existsSync(path.resolve(__dirname, '../packages', input))) {
          return `Package directory ${input} already exists!`;
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'name',
      message: 'Please enter package name:',
      default: answers => {
        return `@dawnjs/${answers.dir}`;
      },
    },
    { type: 'input', name: 'description', message: 'Please enter package description:' },
    { type: 'confirm', name: 'typescript', message: 'Using typescript?', default: true },
  ])
  .then(answers => {
    fs.ensureDirSync(path.resolve(__dirname, '../packages', answers.dir));
    fs.writeFileSync(path.resolve(__dirname, '../packages', answers.dir, 'README.md'), `# ${answers.name}\n`);
    fs.writeFileSync(path.resolve(__dirname, '../packages', answers.dir, 'CHANGELOG.md'), '# Changelog\n');
    fs.writeJSONSync(path.resolve(__dirname, '../packages', answers.dir, 'package.json'), getPkgJson(answers), {
      spaces: 2,
    });
    if (answers.typescript) {
      fs.writeJSONSync(
        path.resolve(__dirname, '../packages', answers.dir, 'tsconfig.json'),
        {
          extends: '../../tsconfig.json',
          compilerOptions: {
            baseUrl: './',
            rootDir: 'src',
            outDir: 'lib',
          },
        },
        { spaces: 2 },
      );
      fs.ensureFileSync(path.resolve(__dirname, '../packages', answers.dir, 'src/index.ts'));
    } else {
      fs.ensureFileSync(path.resolve(__dirname, '../packages', answers.dir, 'lib/index.js'));
    }
  });

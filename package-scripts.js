const { resolve: resolvePath } = require("path");
const { includePackage } = require("nps-utils");
const { existsSync } = require("fs");

const commonScripts = require("./_shared/_package-scripts");

const packagesPath = resolvePath(__dirname, "packages");

const packagesScripts = [
  ["cra", "cra"],
  ["cy", "cy"],
  ["be", "be"],
  ["shared", "sh"],
].reduce((acc, [packagePath, alias]) => {
  const script = resolvePath(packagesPath, packagePath, "package-scripts");

  if (existsSync(`${script}.js`)) {
    const packageScript = includePackage({ path: script });
    acc[alias] = packageScript;
  }

  return acc;
}, {});

module.exports = {
  scripts: {
    ...packagesScripts,
    ...commonScripts.scripts,
    p: {
      script: `prettier --write .`,
      description: "prettify",
    },
    s: {
      script: `sort-package-json ./package.json \
          && sort-package-json ./packages/**/package.json`,
      description: `Sort package json`,
    },
  },
};

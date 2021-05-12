const { resolve: resolvePath } = require("path");
const { includePackage } = require("nps-utils");
const { existsSync } = require("fs");

const commonScripts = require("./_shared/_package-scripts");

const packagesPath = resolvePath(__dirname, "packages");

const packages = [
  ["cra", "cra"],
  ["cy", "cy"],
  ["be", "be"],
  ["shared", "sh"],
];

function runPerPackage(commandFn, condFn = () => true) {
  return packages.reduce((acc, [pkg, alias]) => {
    const path = resolvePath(packagesPath, pkg);
    if (condFn(path)) {
      const command = commandFn(path, pkg, alias);
      acc.push(command);
    }
    return acc;
  }, []);
}

const packagesScripts = packages.reduce((acc, [packagePath, alias]) => {
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
    tc: {
      script: runPerPackage(
        (path, pkg) => {
          return ` echo "type-checking package: ${pkg}" && \
            cd ${path} && \
            yarn start tc && \
            cd ../..`;
        },
        (path) => {
          const tsConfigPath = resolvePath(path, "tsconfig.json");
          return existsSync(tsConfigPath);
        }
      ).join(" && "),

      description: "type check project packages in turn",
    },
    lint: {
      script: runPerPackage(
        (path, pkg) => {
          return ` echo "lint package: ${pkg}" && \
            cd ${path} && \
            yarn start lint && \
            cd ../..`;
        },
        (path) => {
          const tsConfigPath = resolvePath(path, "tsconfig.json");
          return existsSync(tsConfigPath);
        }
      ).join(" && "),

      description: "type check project packages in turn",
    },
  },
};

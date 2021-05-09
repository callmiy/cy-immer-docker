const { resolve: pathResoleModule } = require("path");

const prettierIgnoreFile = pathResoleModule(__dirname, "../.prettierignore");
const envFile = pathResoleModule(__dirname, "../.env");

module.exports = {
  scripts: {
    tc: {
      default: "tsc --project .",
      description: `typecheck this project`,
    },
    lint: {
      script: `eslint . \
        --ext .js,.jsx,.ts,.tsx \
        --ignore-pattern **build** 
      `,
      description: "eslint lint this project",
    },
    p: {
      script: `prettier \
        --ignore-path ${prettierIgnoreFile} \
        --write \
        .`,
      description: "prettify",
    },
    s: {
      script: `sort-package-json package.json`,
      description: `Sort package json`,
    },
  },
  envFile,
};

const { resolve: resolvePath } = require("path");
const { scripts } = require("../../_shared/_package-scripts");

const genClientOutput = resolvePath(__dirname, "./src/schema.gen.ts");

module.exports = {
  scripts: {
    ...scripts,
    gs: {
      script: `graphql-codegen \
        --config codegen.yml && \
        prettier --write ${genClientOutput}`,
      description: `graphql-codegen server`,
    },
    gc: `apollo client:codegen \
      --target=typescript \
      --tagName=gql \
      --localSchemaFile=src/schema.gql \
      --includes=src/client.gql.ts \
      --outputFlat=src/client.qgl-gen.d.ts`,
  },
};

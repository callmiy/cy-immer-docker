import { GRAPHQL_PATH, NODE_ENV, PORT } from "@im/sh/src/env";
import { resolver, schemaString, checkDataFile } from "@im/sh/src/resolver";
import cors from "cors";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import logger from "morgan";

const schema = buildSchema(schemaString);

const app = express();
app.use(cors());
app.use(logger("dev"));
// app.use(express.json());

app.use(
  `/${GRAPHQL_PATH}`,
  graphqlHTTP({
    schema,
    rootValue: resolver,
    graphiql: true,
  })
);

app.use("/reset", (_req, res) => {
  checkDataFile("reset");
  res.status(200).send("ok");
});

const webServer = app.listen(PORT, () => {
  console.log(`
    Running GraphQL server at http://localhost:${PORT}/${GRAPHQL_PATH}
  `);
});

if (NODE_ENV !== "production") {
  const signals: NodeJS.Signals[] = ["SIGTERM", "SIGINT", "SIGHUP", "SIGUSR2"];

  signals.forEach((signal) => {
    process.once(signal, () => {
      console.log("\n\nreceived exit signal:", signal);
      shutdown();
    });
  });

  process.on("uncaughtException", function (err) {
    console.error(err.stack);
    shutdown();
  });
}

function shutdown() {
  console.info("Shutting down server\n\n");
  webServer.close((e) => {
    console.error(e);
  });

  process.exit(0);
}

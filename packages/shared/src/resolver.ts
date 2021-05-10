import { MutationCreateParentsArgs, Parent } from "./schema.gen";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve as resolvePath } from "path";
import { getDataFile } from "./env";

const schemaPath = resolvePath(__dirname, "./schema.gql");
export const schemaString = readFileSync(schemaPath, "utf-8");

const dataFile = resolvePath(__dirname, getDataFile());
checkDataFile();

export const resolver: Resolvers = {
  createParents({ input }) {
    try {
      const newParents: Parent[] = [];

      input.forEach(({ text }) => {
        const id = "" + new Date().getTime();
        const p = { id, text };
        newParents.push(p);
      });

      storeParents(newParents);
      return newParents;
    } catch (error) {
      return [];
    }
  },
  listParents() {
    const parents = getParents();
    return parents;
  },
};

export function checkDataFile(reset?: "reset") {
  if (reset || !existsSync(dataFile)) {
    writeFileSync(dataFile, "[]", { encoding: "utf-8" });
  }
}

export function getParents() {
  const string = readFileSync(dataFile, "utf-8") || "[]";
  const parents = JSON.parse(string) as Parent[];
  return parents;
}

function storeParents(newParents: Parent[]): [Parent[], Parent[]] {
  const oldParents = getParents();
  const allParents = newParents.concat(oldParents);
  const string = JSON.stringify(allParents);
  writeFileSync(dataFile, string, { encoding: "utf-8" });
  return [allParents, newParents];
}

type Resolvers = {
  createParents: (args: MutationCreateParentsArgs) => Parent[];
  listParents: () => Parent[];
};

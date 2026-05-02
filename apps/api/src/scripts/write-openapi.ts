import { writeFile } from "node:fs/promises";

import { openApiDocument } from "../openapi";

const outputFile = new URL("../../openapi.json", import.meta.url);

await writeFile(outputFile, `${JSON.stringify(openApiDocument, null, 2)}\n`);

console.log(`OpenAPI document written to ${outputFile.pathname}`);

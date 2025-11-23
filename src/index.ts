import { promisify } from "util";
import * as fs from "fs";
import list from "./list";
import install from "./install";

// A function having an async high-order function as argument
(async () => {
  // Return a promisified? function
  const root = JSON.parse(await Bun.file("./package.json").text());

  const info = await list(root);

  // Resolve when all provided Promises resolve
  await Promise.all(
    // Go through all K-V pairs as package-version and install it while returning a promise
    Array.from(info.topLevel.entries()).map((pair) => install(...pair)),
  );

  await Promise.all(
    info.unsatisfied.map((item) =>
      install(item.name, item.version, `/node_modules/${item.parent}`),
    ),
  );
})();

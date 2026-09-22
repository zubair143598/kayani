const ts = require("typescript");
const fs = require("node:fs");
const Module = require("node:module");
const path = require("node:path");
const original = Module._resolveFilename;
Module._resolveFilename = function (name, parent, ...rest) {
  return original.call(
    this,
    name.startsWith("@/")
      ? path.join(process.cwd(), "src", name.slice(2))
      : name,
    parent,
    ...rest,
  );
};
require.extensions[".ts"] = (mod, filename) =>
  mod._compile(
    ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
    }).outputText,
    filename,
  );
require("../tests/contact.test.ts");
require("../tests/route.test.ts");

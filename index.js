#!/usr/bin/env node
import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";
import pluralize from "pluralize";
import ora from "ora";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = process.cwd();

/* -------------------------------- helpers -------------------------------- */

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const lowerFirst = (s) => s.charAt(0).toLowerCase() + s.slice(1);

const toKebabCase = (str) =>
  str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();

const processTemplate = (content, r) =>
  content
    .replace(/__PascalName__/g, r.pascalName)
    .replace(/__PluralPascal__/g, r.pluralPascalName)
    .replace(/__camelName__/g, r.camelName)
    .replace(/__plural__/g, r.pluralName)
    .replace(/__kebabName__/g, r.kebabName)
    .replace(/__formFields__/g, r.formFields || "")
    .replace(/__schemaFields__/g, r.schemaFields || "");

async function generate(template, dest, replacements) {
  const tpl = await fs.readFile(template, "utf8");
  await fs.outputFile(dest, processTemplate(tpl, replacements));
}

/* ------------------------------ field input ------------------------------- */

async function collectFields() {
  const fields = [];
  let addMore = true;

  while (addMore) {
    const { name, type } = await inquirer.prompt([
      { type: "input", name: "name", message: "Field name:" },
      {
        type: "list",
        name: "type",
        choices: ["string", "number", "boolean"],
      },
    ]);

    fields.push({ name, type });

    const { cont } = await inquirer.prompt([
      { type: "confirm", name: "cont", message: "Add another field?" },
    ]);
    addMore = cont;
  }

  return fields;
}

/* ---------------------------------- main ---------------------------------- */

async function main() {
  const { name, addFields } = await inquirer.prompt([
    { type: "input", name: "name", message: "Feature name (singular):" },
    {
      type: "confirm",
      name: "addFields",
      message: "Add extra fields?",
      default: false,
    },
  ]);

  const fields = addFields ? await collectFields() : [];

  /* ---------------------------- naming strategy ---------------------------- */

  const pascalName = capitalize(name);
  const camelName = lowerFirst(name);
  const pluralName = pluralize(name);
  const pluralPascalName = capitalize(pluralName);
  const kebabName = toKebabCase(pluralName);

  /* -------------------------- template replacements ------------------------ */

  const schemaFields = fields
    .map((f) => `  ${f.name}: z.${f.type}(),`)
    .join("\n");

  const formFields = fields.map((f) => `  ${f.name}: "",`).join("\n");

  const replacements = {
    pascalName,
    pluralPascalName,
    camelName,
    pluralName,
    kebabName,
    schemaFields,
    formFields,
  };

  /* ----------------------------- feature paths ----------------------------- */

  const featureDir = path.join(projectRoot, "src", "features", pluralName);
  const templatesDir = path.join(__dirname, "templates");

  if (await fs.pathExists(featureDir)) {
    const { overwrite } = await inquirer.prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: "Feature exists. Overwrite?",
      },
    ]);
    if (!overwrite) return;
    await fs.remove(featureDir);
  }

  const spinner = ora(`Generating ${pascalName} feature`).start();

  try {
    await fs.ensureDir(featureDir);

    const files = [
      // components
      ["components/Form.tsx", `components/${pascalName}Form.tsx`],
      ["components/Table.tsx", `components/${pascalName}Table.tsx`],

      // api
      ["api/api.ts", `api/${pluralName}.api.ts`],

      // queries
      ["queries/list.ts", `queries/use${pluralPascalName}List.ts`],
      ["queries/detail.ts", `queries/use${pascalName}Detail.ts`],
      ["queries/keys.ts", "queries/association.keys.ts"],

      // mutations
      ["mutations/mutations.ts", `mutations/use${pascalName}Mutations.ts`],

      // schema
      ["schema/schema.ts", `schema/${camelName}.schema.ts`],

      // index
      ["index.ts", "index.ts"],
    ];

    for (const [tpl, out] of files) {
      await generate(
        path.join(templatesDir, tpl),
        path.join(featureDir, out),
        replacements
      );
      spinner.text = `Created ${out}`;
    }

    spinner.succeed(`Feature "${pascalName}" generated`);
  } catch (e) {
    spinner.fail("Generation failed");
    console.error(e);
  }
}

main();

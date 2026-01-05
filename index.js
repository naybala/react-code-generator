#!/usr/bin/env node
import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";
import pluralize from "pluralize";
import ora from "ora";
import chalk from "chalk";

/* ------------------ setup ------------------ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = process.cwd();

/* ------------------ helpers ------------------ */
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const lowerFirst = (s) => s.charAt(0).toLowerCase() + s.slice(1);

/* ------------------ field collection ------------------ */
async function collectFields() {
  const fields = [];
  let more = true;

  while (more) {
    const { name, type } = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Field name:",
        validate: (v) => !!v || "Field name is required",
      },
      {
        type: "list",
        name: "type",
        message: "Field type:",
        choices: ["string", "number", "boolean", "text"],
      },
    ]);

    fields.push({ name, type });

    const { again } = await inquirer.prompt([
      {
        type: "confirm",
        name: "again",
        message: "Add another field?",
        default: false,
      },
    ]);

    more = again;
  }

  return fields;
}

/* ------------------ template helpers ------------------ */
function buildFormFields(fields) {
  return fields
    .map((f) => {
      if (f.type === "number") return `${f.name}: 0,`;
      if (f.type === "boolean") return `${f.name}: false,`;
      return `${f.name}: "",`;
    })
    .join("\n    ");
}

function buildEditFormFields(fields) {
  return fields
    .map((f) => `${f.name}: data.${f.name} ?? "",`)
    .join("\n        ");
}

function buildSchemaFields(fields) {
  return fields
    .map((f) => {
      if (f.type === "number") return `${f.name}: z.number(),`;
      if (f.type === "boolean") return `${f.name}: z.boolean(),`;
      return `${f.name}: z.string().min(1),`;
    })
    .join("\n  ");
}

function buildFormInputs(fields) {
  return fields
    .map(
      (f) => `
<div className="flex flex-col gap-2">
  <label htmlFor="${f.name}">${capitalize(f.name)}</label>
  <InputText
    id="${f.name}"
    name="${f.name}"
    value={form.${f.name}}
    onChange={handleChange}
    className={classNames({ "p-invalid": errors.${f.name} })}
  />
  {errors.${f.name} && <small className="p-error">{errors.${f.name}}</small>}
</div>`
    )
    .join("\n");
}

function toKebabCase(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function buildTableColumns(fields) {
  return fields
    .map(
      (f) => `{
    label: t("${f.name}") || "${capitalize(f.name)}",
    field: "${f.name}",
    isHeaderStart: true,
    isTextStart: true,
  },`
    )
    .join("\n  ");
}

function processTemplate(content, r) {
  return content
    .replace(/__PascalName__/g, r.pascalName)
    .replace(/__camelName__/g, r.camelName)
    .replace(/__plural__/g, r.pluralName)
    .replace(/__PluralPascal__/g, r.pluralPascalName)
    .replace(/__formFields__/g, r.formFields)
    .replace(/__editFormFields__/g, r.editFormFields)
    .replace(/__schemaFields__/g, r.schemaFields)
    .replace(/__formInputs__/g, r.formInputs)
    .replace(/__tableColumns__/g, r.tableColumns)
    .replace(/__kebabName__/g, r.kebabName);
}

async function generate(template, dest, replacements) {
  const content = await fs.readFile(template, "utf8");
  await fs.outputFile(dest, processTemplate(content, replacements));
}

/* ------------------ CLI ------------------ */
async function main() {
  const { name, addFields } = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Feature name (singular):",
      validate: (v) => !!v || "Required",
    },
    {
      type: "confirm",
      name: "addFields",
      message: "Add fields?",
      default: true,
    },
  ]);

  const fields = addFields ? await collectFields() : [];

  const pascalName = capitalize(name);
  const camelName = lowerFirst(name);
  const pluralName = pluralize(camelName);
  const pluralPascalName = capitalize(pluralize(name));
  const kebabName = toKebabCase(pluralName);
  console.log(pascalName);
  console.log(camelName);
  console.log(pluralName);
  console.log(pluralPascalName);
  console.log(kebabName);

  const replacements = {
    pascalName,
    camelName,
    pluralName,
    pluralPascalName,
    kebabName,
    formFields: buildFormFields(fields),
    editFormFields: buildEditFormFields(fields),
    schemaFields: buildSchemaFields(fields),
    formInputs: buildFormInputs(fields),
    tableColumns: buildTableColumns(fields),
  };

  const featureDir = path.join(projectRoot, "src", "features", pluralName);
  const templatesDir = path.join(__dirname, "templates");

  if (await fs.pathExists(featureDir)) {
    console.log(chalk.red(`Feature "${pluralName}" already exists.`));
    return;
  }

  const spinner = ora(`Generating ${pascalName} feature...`).start();

  try {
    await fs.ensureDir(featureDir);

    const files = [
      { t: "api/api.ts", d: `api/${pluralName}.api.ts` },
      { t: "hooks/useForm.ts", d: `hooks/use${pascalName}Form.ts` },
      { t: "hooks/useTable.ts", d: `hooks/use${pascalName}Table.ts` },
      { t: "components/Form.tsx", d: `components/${pascalName}Form.tsx` },
      { t: "components/Table.tsx", d: `components/${pascalName}Table.tsx` },
      { t: "queries/keys.ts", d: `queries/${camelName}.keys.ts` },
      { t: "queries/list.ts", d: `queries/use${pluralPascalName}List.ts` },
      { t: "queries/detail.ts", d: `queries/use${pascalName}Detail.ts` },
      {
        t: "mutations/mutations.ts",
        d: `mutations/use${pascalName}Mutations.ts`,
      },
      { t: "schema/schema.ts", d: `schema/${camelName}.schema.ts` },
      { t: "index.ts", d: "index.ts" },
    ];

    for (const f of files) {
      await generate(
        path.join(templatesDir, f.t),
        path.join(featureDir, f.d),
        replacements
      );
      console.log(chalk.green(`✓ ${f.d}`));
    }

    spinner.succeed("Feature generated successfully 🎉");
  } catch (e) {
    spinner.fail("Generation failed");
    console.error(e);
  }
}

main();

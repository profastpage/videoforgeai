import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "AGENTS.md",
  "README.md",
  "docs/context.md",
  "docs/contract.md",
  "docs/PROJECT_CONTEXT.md",
  "docs/design_system.md",
  "docs/AI_ROUTING.md",
  "start-videoAI.cmd",
];

const errors = [];

for (const relativePath of requiredFiles) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    errors.push(`Missing required file: ${relativePath}`);
  }
}

const launcherPath = path.join(root, "start-videoAI.cmd");
const launcher = fs.readFileSync(launcherPath, "utf8");
for (const marker of [
  "CODEX_AUTO_SKILLS=1",
  "CODEX_PRIMARY_SKILL=master-fullstack",
  "CODEX_AI_ROUTING_DOC=%cd%\\docs\\AI_ROUTING.md",
]) {
  if (!launcher.includes(marker)) {
    errors.push(`start-videoAI.cmd is missing marker: ${marker}`);
  }
}

if (errors.length > 0) {
  console.error("Project QA failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Project QA passed.");

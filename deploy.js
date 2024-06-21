import { exec } from "child_process";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildDir = path.join(__dirname, "dist");
const targetDir = path.join(__dirname, "../easyassetz-api/public");

exec("npm run build", (error, stdout, stderr) => {
  if (error) {
    console.error(`Build error: ${error.message}`);
    console.error(stderr);
    return;
  }
  console.log(stdout);

  fs.copySync(buildDir, targetDir);

  console.log("Build files copied to Laravel public directory");
});

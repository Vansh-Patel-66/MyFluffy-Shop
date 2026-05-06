import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import archiver from "archiver";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const backupCode = () => {
  // Define where the backup will be saved
  const backupsDir = path.join(__dirname, "../../backups");
  
  // Create the backups folder if it doesn't exist
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir);
  }

  // Name the file based on the current date and time
  const dateStr = new Date().toISOString().replace(/[:.]/g, "-");
  const outputFilePath = path.join(backupsDir, `backup-${dateStr}.zip`);

  const output = fs.createWriteStream(outputFilePath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  output.on("close", () => {
    console.log(`✅ Backup successfully created: ${archive.pointer()} total bytes at ${outputFilePath}`);
  });

  archive.on("error", (err) => {
    console.error("Backup failed:", err);
  });

  archive.pipe(output);

  // Backup the "src" folder
  const srcDirectory = path.join(__dirname, "../../src");
  archive.directory(srcDirectory, "src");

  // Also backup package.json and other important root files if desired
  const packageJsonPath = path.join(__dirname, "../../package.json");
  if (fs.existsSync(packageJsonPath)) {
    archive.file(packageJsonPath, { name: "package.json" });
  }

  // Finalize the zip file
  archive.finalize();
};

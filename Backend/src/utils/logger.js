import winston from "winston";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure logs directory exists
const logDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Create a custom log format
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf((info) => {
    return `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`;
  })
);

// Create the logger
const logger = winston.createLogger({
  level: "info",
  format: customFormat,
  transports: [
    // 1. Log all levels to console with colors
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        customFormat
      ),
    }),
    // 2. Log errors to a specific file
    new winston.transports.File({ 
      filename: path.join(logDir, "error.log"), 
      level: "error" 
    }),
    // 3. Log everything to a combined file
    new winston.transports.File({ 
      filename: path.join(logDir, "app.log") 
    }),
  ],
});

export default logger;

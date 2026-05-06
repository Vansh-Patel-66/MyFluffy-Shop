import cron from "node-cron";
import { backupCode } from "./backup.js";

const cronJobs = {
  createBackUpFile: () => {
    // Runs daily at midnight
    cron.schedule("0 0 * * *", () => {
      console.log("Running daily code backup cron job...");
      backupCode();
    });
  },
};

export default cronJobs;

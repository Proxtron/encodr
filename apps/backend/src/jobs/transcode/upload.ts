import util from "node:util";
import { exec } from "node:child_process";
import { env } from "../../config/env.js";
import { uploadDuration } from "../../services/metrics.js";
const execAsync = util.promisify(exec);

export const syncOutputToS3 = async (uuid: string) => {
    const end = uploadDuration.startTimer();
    await execAsync(`aws s3 sync tmp/output/${uuid} s3://${env.S3_BUCKET_NAME}/output/${uuid}`);
    end();
}


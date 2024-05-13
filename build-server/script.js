const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const Redis = require("ioredis");

const publisher = new Redis(process.env.REDIS_URL);

const mime = require("mime-types");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
});

const PROJECT_ID = process.env.PROJECT_ID;
const DEPLOYEMENT_ID = process.env.DEPLOYEMENT_ID


function publishLog(log) {
  publisher.publish(`logs:${PROJECT_ID}:${DEPLOYEMENT_ID}`, JSON.stringify({ log, timestamp: Date.now(), deployementId: DEPLOYEMENT_ID, projectId: PROJECT_ID}));
}


async function init() {
  console.log("starting build...");
  publishLog("Build Started...");

  const outDirpath = path.join(__dirname, "output");
  const p = exec(`cd ${outDirpath} && npm ci && npm run build`);

  p.stdout.on("data", (data) => {
    console.log(data.toString());
    publishLog(data.toString());
  });

  p.stdout.on("error", (data) => {
    console.log(data.toString());
    publishLog(`error:${data.toString()}`);
  });
  p.on("close", async (code) => {
    console.log(`Build completed  with code ${code}`);
    publishLog(`Build completed  with code ${code}`);
    const possibleFolders = ["dist", "build"];
    let distFolderPath = null;
    for (const folder of possibleFolders) {
      const possibleFolderPath = path.join(__dirname, "output", folder);
      if (fs.existsSync(possibleFolderPath)) {
        distFolderPath = possibleFolderPath;
        break;
      }
    }
    if (!distFolderPath) {
      console.error("Neither 'dist' nor 'build' folder found!");
      publishLog("Neither 'dist' nor 'build' folder found!");
      return;
    }
    const distFolderContents = fs.readdirSync(distFolderPath, {
      recursive: true,
    });
    publishLog("Uploading files...");
    for (const file of distFolderContents) {
      const filePath = path.join(distFolderPath, file);
      if (fs.lstatSync(filePath).isDirectory()) continue;
      console.log("Uploading", filePath);
      publishLog(`Uploading ${filePath}`);

      const command = new PutObjectCommand({
        Bucket: "justdeployit",
        Key: `__output/${PROJECT_ID}/${file}`,
        Body: fs.createReadStream(filePath),
        ContentType: mime.lookup(filePath),
      });
      await s3Client.send(command);
    }
    console.log("Upload completed");
    publishLog("Upload completed");
    publisher.quit();

    
   //safety exit -- to avoid tasks running forever
    process.exit(0);
  });
}
init();



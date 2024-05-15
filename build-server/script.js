const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const Redis = require("ioredis");
const mime = require("mime-types");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");


const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
});
const publisher = new Redis(process.env.REDIS_URL)
const PROJECT_ID = process.env.PROJECT_ID;
const DEPLOYEMENT_ID = process.env.DEPLOYEMENT_ID;

 async function publishLog(log) {
   await publisher.publish(
    `logs:${PROJECT_ID}:${DEPLOYEMENT_ID}`,
    JSON.stringify({
      log,
      timestamp: Date.now(),
      deployementId: DEPLOYEMENT_ID,
      projectId: PROJECT_ID,
    })
  );
}

async function init() {
  console.log("starting build...");
 await publishLog("Build Started...");

  const outDirpath = path.join(__dirname, "output");
  const p = exec(`cd ${outDirpath} && npm ci && npm run build`);

  p.stdout.on("data", async(data) => {
    console.log(data.toString());
   await publishLog(data.toString());
  });

  p.stdout.on("error", async(data) => {
    console.log(data.toString());
    await publishLog(`error:${data.toString()}`);
  });
  p.on("close", async (code) => {
    console.log(`Build completed  with code ${code}`);
   await publishLog(`Build completed  with code ${code}`);
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
    await  publishLog("Neither 'dist' nor 'build' folder found!");
      return;
    }
    const distFolderContents = fs.readdirSync(distFolderPath, {
      recursive: true,
    });
   await  publishLog("Uploading files...");
   const uploadPromises = [];
    for (const file of distFolderContents) {
      const filePath = path.join(distFolderPath, file);
      if (fs.lstatSync(filePath).isDirectory()) continue;
      console.log("Uploading", filePath);
     await publishLog(`Uploading ${filePath}`);

      const command = new PutObjectCommand({
        Bucket: "justdeployit",
        Key: `__output/${PROJECT_ID}/${file}`,
        Body: fs.createReadStream(filePath),
        ContentType: mime.lookup(filePath),
      });
      uploadPromises.push( s3Client.send(command));
    }
    await Promise.all(uploadPromises);
    console.log("Upload completed");
    await publishLog("Upload completed");

    publisher.quit();
    process.exit(0);
   

    //safety exit -- to avoid tasks running forever
    
  });

 

}
init();

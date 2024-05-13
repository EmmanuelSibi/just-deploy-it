const express = require("express");
const { generateSlug } = require("random-word-slugs");
const { ECSClient, RunTaskCommand } = require("@aws-sdk/client-ecs");
require("dotenv").config();
const app = express();
const { PrismaClient } = require("@prisma/client");
const { z } = require("zod");
const Redis = require("ioredis");

const PORT = process.env.PORT || 8000;
const ecsClient = new ECSClient({
  region: process.env.AWS_REGION,
});

const subscriber = new Redis(process.env.REDIS_URL);

const prisma = new PrismaClient();

const config = {
  cluster: process.env.CLUSTER_NAME,
  taskDefinition: process.env.TASK_DEFINITION,
};
app.use(express.json());

app.post("/project", async (req, res) => {
  const schema = z.object({
    name: z.string(),
    gitURL: z.string(),
  });
  const parseResult = schema.safeParse(req.body);

  if (parseResult.error)
    return res.status(400).json({ error: parseResult.error });

  const { name, gitURL } = parseResult.data;

  const project = await prisma.project.create({
    data: {
      name,
      gitURL,
      subDomain: generateSlug(),
    },
  });

  return res.json({ status: "success", data: { project } });
});

app.post("/deploy", async (req, res) => {
  const { projectId } = req.body;

  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!project) return res.status(404).json({ error: "Project not found" });

  // Check if there is no running deployement
  const runningDeployement = await prisma.deployement.findFirst({
    where: {
      projectId,
      status: "IN_PROGRESS",
    },
  });
  if (runningDeployement) {
    await prisma.deployement.update({
        where: { id: runningDeployement.id },
        data: { status: "FAIL" },
    })
    return res.status(400).json({
        

      error: "Another deployement is already running for this project",
    });
  }
  const deployment = await prisma.deployement.create({
    data: {
      project: { connect: { id: projectId } },
      status: "QUEUED",
    },
  });

  const command = new RunTaskCommand({
    cluster: config.cluster,
    taskDefinition: config.taskDefinition,
    launchType: "FARGATE",
    count: 1,
    networkConfiguration: {
      awsvpcConfiguration: {
        subnets: [
          "subnet-01d442c460ce931b8",
          "subnet-056852d39c140f1b0",
          "subnet-0542383a38f412be2",
        ],
        securityGroups: ["sg-08845d92fbfb545ee"],

        assignPublicIp: "ENABLED",
      },
    },
    overrides: {
      containerOverrides: [
        {
          name: "builder-image-container",
          environment: [
            { name: "GIT_REPOSITORY__URL", value: project.gitURL },
            { name: "PROJECT_ID", value: projectId },
            { name: "DEPLOYEMENT_ID", value: deployment.id },
          ],
        },
      ],
    },
  });
  console.log("Starting task");
  try {
    await ecsClient.send(command);
    //task is running -- not actual representation of task
    await prisma.deployement.update({
      where: { id: deployment.id },
      data: { status: "IN_PROGRESS" },
    });
  } catch (error) {
    console.error(error.message);
  }

  console.log("Task finished");
  //task is finished  -- not actual representation of task
  await prisma.deployement.update({
    where: { id: deployment.id },
    data: { status: "READY" },
  });

  return res.status(200).json({
    data: {
      deploymentId: deployment.id,
      url: `http://${projectId}.localhost:3000`,
    },
  });
});

async function initRedisSubscribe() {
  console.log("Subscribed to logs....");
  subscriber.psubscribe("logs:*");
  subscriber.on("pmessage", (pattern, channel, message) => {
    console.log(
      "Received message in channel: ",
      channel,
      " with message: ",
      message
    );
    //store in Clickhouse DB
  });
}

initRedisSubscribe();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

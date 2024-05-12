const express = require("express");
const { generateSlug } = require("random-word-slugs");
const { ECSClient, RunTaskCommand } = require("@aws-sdk/client-ecs");
require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 8000;

const ecsClient = new ECSClient({
  region: process.env.AWS_REGION,
});

const config = {
  cluster: process.env.CLUSTER_NAME,
  taskDefinition: process.env.TASK_DEFINITION,
};
app.use(express.json());
app.post("/project", async (req, res) => {
  const projectId = generateSlug();
  const gitUrl = req.body.gitUrl;
  console.log("url", gitUrl);

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
        securityGroups:['sg-08845d92fbfb545ee'],
        
        assignPublicIp: "ENABLED",
      },
    },
    overrides: {
      containerOverrides: [
        {
          name: "builder-image-container",
          environment: [
            {
              name: "GIT_REPOSITORY_URL",
              value: gitUrl,
            },
            {
              name: "PROJECT_ID",
              value: projectId,
            },
          ],
        },
      ],
    },
  });
  console.log("Starting task");
  try {
    console.log("Starting task 2");
    await ecsClient.send(command);
  } catch (error) {
    console.error(error.message);
  }
  console.log("Task finished");
  return res.status(200).json({
    data: {
      projectId,
      url: `http://${projectId}.localhost:3000`,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

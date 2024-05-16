
# Just Deploy It

Just Deploy It is a basic implementation showcasing how Vercel-like deployment processes can be achieved. It automates the deployment process by taking a git URL and project name, storing them in a database, and initiating deployment tasks on AWS ECS. The deployment involves cloning the repository, building it within a container, and uploading it to an AWS S3 bucket. During this process, logs from the ECS tasks are captured and stored in ClickHouse for monitoring purposes.

 # System Architecture
 ![diagram-export-16-5-2024-2_36_39-PM](https://github.com/EmmanuelSibi/just-deploy-it/assets/115890805/97eae94e-1010-4931-abed-c4f3ec90e7fe)


## Features

- **Automated Deployment:** Submit a git URL and project name to initiate deployment.
- **Containerized Deployment:** All components are containerized using Docker Compose.
- **Log Monitoring:** Logs from deployment tasks are stored in ClickHouse for easy monitoring.
- **Dynamic Subdomain:** Users receive a subdomain link after deployment for accessing their project.

## Components

- **API Server:** Node.js server built with Prisma for storing deployment details.
- **Frontend:** Next.js application for managing project submissions and displaying logs.
- **Database:** PostgreSQL for storing deployment details and ClickHouse for log storage.
- **Reverse Proxy:** Node.js server for mapping requests to files in the S3 bucket.
- **Builder Server:** Docker task responsible for building and packaging deployment artifacts. Must be pushed to Amazon Elastic Container Registry (ECR) and configured in AWS ECS.

## Setup Instructions

### Prerequisites
- Docker and Docker Compose installed on your system.

### Setup
1. Clone the repository:
    ```bash
    git clone https://github.com/EmmanuelSibi/just-deploy-it.git
    cd just-deploy-it
    ```

2. Create environment variable files for each service:
    - For the API server, create a `.env` file in the `api-server` directory with the following variables:
        ```
        # .env file for API Server
        PORT=
        AWS_REGION=
        CLUSTER_NAME=
        TASK_DEFINITION=
        REDIS_URL=
        CLICKHOUSE_URL=
        DATABASE_URL=
        ```

    - For the Builder Server, create a `.env` file in the `builder-server` directory with the following variables:
        ```
        # .env file for Builder Server
        REDIS_URL=
        ```

    - For the Frontend, create a `.env` file in the `frontend` directory with the following variables:
        ```
        # .env file for Frontend
        NEXT_PUBLIC_REVERSE_PROXY_DOMAIN=
        NEXT_PUBLIC_BACKEND_URL=
        ```

    - For the Reverse Proxy, create a `.env` file in the `reverse-proxy` directory with the following variables:
        ```
        # .env file for Reverse Proxy
        PORT=
        BASE_PATH=
        DATABASE_URL=
        ```

3. Modify the `docker-compose.yml` file to set up PostgreSQL, ClickHouse, and Redis credentials:
    - In the base directory `.env`, set up PostgreSQL credentials:
        ```
        # Example .env file for base directory
        POSTGRES_DB=
        POSTGRES_USER=
        POSTGRES_PASSWORD=
        CLICKHOUSE_DB=
        CLICKHOUSE_USER=
        CLICKHOUSE_PASSWORD=
        ```

4. Start all services using Docker Compose:
    ```bash
    docker-compose up -d
    ```

5. Access the frontend application in your browser at `http://localhost:3000`.

6. You're now ready to use Just Deploy It! Submit a git URL and project name to initiate deployment and monitor deployment logs via the frontend.

This setup allows you to run the entire project locally using Docker containers. You can customize configurations further according to your requirements.

If you encounter any issues during setup, feel free to reach out for assistance!

## Demo

Watch the demo video below

https://github.com/EmmanuelSibi/just-deploy-it/assets/115890805/652c4698-8ce6-4ba5-91be-94d220d23546



## Note

This project is not currently deployed and is  intended for demonstration purposes only, due to security concerns. As user authentication has not been implemented, there's a risk of misuse or unauthorized deployment. However, you can deploy it on your own infrastructure following the provided instructions.


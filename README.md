# Chat Application Frontend

This is the frontend of the chat application, built with Vite, which connects to a FastAPI backend. You can either run the frontend using Docker for deployment or use npm for local development.

## Prerequisites

Before proceeding, make sure you have the following installed on your system:

- [Docker](https://www.docker.com/get-started) (for the Docker setup)
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) (for local development)

## Setup Instructions

### 1. Clone the Repository

Start by cloning the repository to your local machine:

```bash
git clone https://github.com/sourabh-klizos/chat_application_frontend.git

cd chat_application_frontend
cd chat_application_frontend # need to do it twice
```

Build docker image

```bash
docker build --build-arg VITE_API_BASE_URL=http://localhost:8000 \
             --build-arg VITE_API_BASE_URL_WS=ws://localhost:8000/ws \
             -t my-vite-app .

```
Run image on port 8080
```bash
docker run -d -p 8080:80 --name vite-container my-vite-app

```
You can now access the frontend by visiting ``http://localhost:8080`` in your browser



If you prefer to run the frontend locally without Docker, follow these steps:
``
create a .env file in root dir copy content from .env_example file and paste it in .env file
``

```
npm install
npm run dev
```

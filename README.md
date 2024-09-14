# TODO-DEVOPS

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher) or yarn
- Docker (if using Docker Compose)
- Docker Compose (if using Docker Compose)

## Getting Started

### Running Locally

1. **Clone the repository:**

   ```sh
   git clone https://github.com/ambesh333/Todo-Devops
   cd Todo-Devops
   ```

2. **Install dependencies:**

   Using npm:

   ```sh
   npm install
   ```

   Using yarn:

   ```sh
   yarn install
   ```

3. **Set up environment variables:**

   Copy the .env.example file to .env and fill in the necessary variables

4. **Run the development server:**

   Using npm:

   ```sh
   npm run dev
   ```

   Using yarn:

   ```sh
   yarn dev
   ```

5. **Open your browser:**

   Navigate to `http://localhost:3000` to see the application running.

### Running with Docker Compose

1. **Clone the repository:**

   ```sh
   git clone https://github.com/ambesh333/Todo-Devops
   cd Todo-Devops
   ```

2. **Set up environment variables:**

   Copy the .env.example file to .env and fill in the necessary variables

3. **Build and run the containers:**

   ```sh
   docker-compose up --build
   ```

4. **Open your browser:**

   Navigate to `http://localhost:3000` to see the application running.

**Access Prometheus and Grafana:**

    - Prometheus: Navigate to `http://localhost:9090`
    - Grafana: Navigate to `http://localhost:3003`
    log in with the credentials `username:admin,password:admin`

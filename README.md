# TODO List Backend Setup

## 1. Setup Environment

### Step 1: Create `.env` file

```bash
cd backend
cp .env.example .env
```

### Step 2: Edit .env with the following values:
```env
DB_HOST=mysql
DB_USER=todo_user
DB_PASSWORD=todopassword
DB_NAME=todo_app
PORT=8080
```

## 2. Run with Docker

### Step 1: Build and start containers

```bash
docker compose build --no-cache
docker compose up
```

### Step 2: Stop the environment
```bash
docker compose down
```

- If you want to re-run the init script (e.g., reset the DB), you must remove the volume:
```bash
docker compose down -v
docker compose up --build
```


## 3. Verify Database Connection via Postman:

### Step 1: Open **Postman**

### Step 2: Send a **GET** request to : 
```bash
curl.exe -i http://localhost:8080/db-check
```

**Expected results:**
```json
{ "dbConnection": true, "result": 2 }
```

## 4. API Endpoints Testing (Postman or cURL):

### GET /api/todos - Get all todos
```bash
curl.exe -X GET http://localhost:8080/api/todos
```

### POST /api/todos – Create new todo
```powershell
$body = @{
    title = "Learn Docker"
    completed = $false
}

Invoke-RestMethod -Uri "http://localhost:8080/api/todos" `
  -Method Post `
  -ContentType "application/json" `
  -Body ($body | ConvertTo-Json)
```

### PUT /api/todos/:id – Update a todo
```powershell
$updateBody = @{
    title = "Learn Docker (updated)"
    completed = $true
}

Invoke-RestMethod -Uri "http://localhost:8080/api/todos/1" `
  -Method Put `
  -ContentType "application/json" `
  -Body ($updateBody | ConvertTo-Json)

```

### DELETE /api/todos/:id – Delete a todo
```bash
curl.exe -X DELETE http://localhost:8080/api/todos/1
```

## 5. Common Issues

- MySQL connection refused (ECONNREFUSED)<br>
  1. Check your `.env` file and make sure the `DB_HOST` value matches the service name defined in `docker-compose.yml`:
  ```.env
  DB_HOST=mysql
  ```

  2. Ensure the MySQL container is running:
  ```bash
  docker ps
  ```
- API returns 500 Internal Server Error <br>
  1. Check the backend logs to identify the issue:
  ```bash
  docker compose logs backend
  ```

# TODO List Frontend Setup

## Create `.env` file

```bash
cd frontend
cp .env.example .env
```

## First:
- Removed old `node_modules` directory
- Removed `package-lock.json`
- Ran `npm install` to get fresh dependencies

## Add to package.json and rebuild the Docker image

### Step 1: Open `frontend/package.json` and make sure it include:
```json
"dependencies": {
  "framer-motion": "^X.X.X"
}
```

### Step 2: If not, install it properly inside the `frontend/` folder on your host:
```bash
cd frontend
npm install framer-motion --save
```

### Step 3: Then rebuild the Docker image:
```bash
docker compose build frontend
```

### Step 4: And start the container again:
```bash
docker compose up
```

**Fix: framer-motion not found inside Docker container**
- If you see this error when running the frontend:
```vbnet
Module not found: Error: Can't resolve 'framer-motion'
```

**Ensure `react-scripts` is in your `package.json`**
- In `frontend/package.json`, make sure you have:
```json
"dependencies": {
  "react-scripts": "^5.0.1",
  ...
}
```

- If it's missing, add it and run:
```bash 
npm install
```

**Solution: Force Docker to rebuild `node_modules`**
- Run the following commands from the project root:
```bash
docker compose down --volumes --remove-orphans
docker compose build --no-cache
docker compose up
```

**Verify inside the container**
- You can also manually check if framer-motion is correctly installed inside the frontend container:
```bash
docker compose exec frontend bash
npm list framer-motion
```

- You should see something like:
```graphql
frontend@0.1.0 /app
`-- framer-motion@12.23.6
```

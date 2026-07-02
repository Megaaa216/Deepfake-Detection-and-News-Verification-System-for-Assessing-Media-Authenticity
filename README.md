<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/c07c22ec-9150-4862-ad3c-6d23d5570b90

## Run Locally

**Prerequisites:**  Node.js


1. **React Frontend (Port 5173 / Default Dev Port)**:
   - Navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the Vite development server:
     ```bash
     npm run dev
     ```

2. **Express Backend Server (Port 5000)**:
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the backend server with hot-reload enabled:
     ```bash
     npm run dev
     ```

3. **Python AI Microservice (Port 8000)**:
   - Navigate to the python service directory:
     ```bash
     cd ai_service
     ```
   - Activate the virtual environment:
     - **Windows (PowerShell)**:
       ```powershell
       .\venv\Scripts\Activate.ps1
       ```
     - **Windows (CMD)**:
       ```cmd
       .\venv\Scripts\activate.bat
       ```
     - **macOS/Linux**:
       ```bash
       source venv/bin/activate
       ```
   - Start the FastAPI application via Uvicorn with hot-reload enabled:
     ```bash
     python -m uvicorn app.main:app --port 8000 --reload
     ```


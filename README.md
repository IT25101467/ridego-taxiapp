Since your group members are still getting comfortable with the command line and cloud setups, this README is designed to be a **"copy-paste" manual**. It covers everything from cloning the repo to setting up the API keys so they don't get stuck.

-----

# 🚖 RideGo - Taxi Booking System

Welcome to the **RideGo** project\! This is a full-stack taxi booking application built with **Next.js 15 (Frontend)** and **Spring Boot (Backend)**.

Follow this guide carefully to get the project running on your local machine.

-----

## 📋 Prerequisites

Before you start, make sure you have these installed:

  * **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
  * **Java JDK 17** - [Download here](https://www.oracle.com/java/technologies/downloads/)
  * **Maven** - (Usually comes with IntelliJ, but check `mvn -v` in terminal)
  * **Git** - [Download here](https://git-scm.com/)
  * **Google Cloud Console Account** (For Maps API Key)

-----

## 🚀 1. Setup the Frontend (Next.js)

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/your-username/ridego-taxiapp.git
    cd ridego-taxiapp/frontend
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a file named `.env.local` in the `frontend` folder and paste this:

    ```text
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_API_KEY_HERE
    NEXT_PUBLIC_API_URL=http://localhost:8080
    ```

    > **Note:** Get your API Key from the [Google Cloud Console](https://console.cloud.google.com/). Ensure **Maps JavaScript API**, **Places API**, and **Directions API** are enabled.

4.  **Run the Development Server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser.

-----

## ☕ 2. Setup the Backend (Spring Boot)

1.  **Navigate to the Backend Folder:**

    ```bash
    cd ../backend
    ```

2.  **Build the Project:**

    ```bash
    mvn clean install
    ```

3.  **Check the CORS Config:**
    Make sure `src/main/java/com/taxi/taxiapp/WebConfig.java` exists. It should allow `http://localhost:3000` to talk to the server.

4.  **Run the Application:**
    You can run it via IntelliJ (click the "Play" button on `TaxiappApplication.java`) or via terminal:

    ```bash
    mvn spring-boot:run
    ```

    The backend will be live at [http://localhost:8080](https://www.google.com/search?q=http://localhost:8080).

-----

## 🛠️ Project Structure

```text
ridego-taxiapp/
├── frontend/           # Next.js App
│   ├── app/            # Pages and Layouts
│   ├── components/     # UI Components (Map, BookingView)
│   └── lib/            # Context and Mock Data
└── backend/            # Spring Boot App
    ├── src/main/java/  # Java Logic (Controllers, Models)
    └── src/main/resources/ # Configuration (application.properties)
```

-----

## 🛡️ Common Issues & Fixes

### 1\. "Mixed Content" or "CORS Error"

If the login button doesn't work and you see a red error in the F12 Console:

  * **Check:** Is the backend actually running?
  * **Check:** Does your `WebConfig.java` in the backend allow `http://localhost:3000`?

### 2\. "Map is Black" or "ApiNotActivated"

If the map doesn't show up:

  * **Check:** Did you enable **Maps JavaScript API** in Google Cloud?
  * **Check:** Did you link a **Billing Account**? (Google gives $200 free credit, but needs a card on file).

### 3\. "Port already in use"

If you see an error about Port 3000 or 8080:

  * **Fix:** Close any other terminals or IDEs running the app, or run:
    ```bash
    npx kill-port 3000
    npx kill-port 8080
    ```

-----

## 🤝 How to Contribute (For Group Members)

1.  **Always Pull First:** Before you start working, get the latest code from the group.
    ```bash
    git pull origin main
    ```
2.  **Create a Branch:** Don't work directly on `main`.
    ```bash
    git checkout -b feature/your-name-task
    ```
3.  **Commit & Push:**
    ```bash
    git add .
    git commit -m "Added new feature for X"
    git push origin feature/your-name-task
    ```

-----

## 🏁 Final Demo Checklist

  * [ ] Frontend is running on port 3000.
  * [ ] Backend is running on port 8080.
  * [ ] Google Maps shows the route clearly (No black boxes).
  * [ ] "Login Successful" message appears after signing in.

**Need help?** Ask in the group chat or check the `pm2 logs` if you are working on the server\! 🚀

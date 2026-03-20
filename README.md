Here is the complete, comprehensive **README.md** file in raw Markdown format. You can copy this entire block, create a file named `README.md` in your project's root directory, and paste it in.

````markdown
# 🚖 RideGo - Full-Stack Taxi Booking System

Welcome to the **RideGo** project! This repository contains both the frontend (Next.js) and the backend (Spring Boot) for our taxi booking application.

---

## 📋 Table of Contents
1. [Prerequisites](#-prerequisites)
2. [Project Structure](#-project-structure)
3. [Setup: Frontend (Next.js)](#-1-setup-the-frontend-nextjs)
4. [Setup: Backend (Spring Boot)](#-2-setup-the-backend-spring-boot)
5. [Connecting Frontend to Backend](#-3-connecting-frontend-to-backend)
6. [Common Issues & Fixes](#-common-issues--fixes)
7. [Git Workflow for the Group](#-git-workflow-for-the-group)

---

## 📋 Prerequisites
Before you start, ensure you have the following installed on your computer:
* **Node.js (v18+)**: [Download here](https://nodejs.org/)
* **Java JDK 17**: [Download here](https://www.oracle.com/java/technologies/downloads/)
* **Maven**: Usually bundled with IntelliJ, but check with `mvn -v`.
* **Git**: [Download here](https://git-scm.com/)
* **IDE**: [IntelliJ IDEA](https://www.jetbrains.com/idea/) (Recommended for Java) and [VS Code](https://code.visualstudio.com/) (Recommended for Frontend).

---

## 📁 Project Structure
The project is split into two main folders:
```text
ridego-taxiapp/
├── frontend/           # Next.js 15, React, Tailwind CSS
│   ├── app/            # Main pages and layouts
│   ├── components/     # UI components (Map, Booking Form, etc.)
│   └── .env.local      # Local environment variables (API Keys)
└── backend/            # Spring Boot (Java)
    ├── src/main/java/  # Java Source Code
    └── pom.xml         # Maven dependencies
````

-----

## 🚀 1. Setup the Frontend (Next.js)

1.  **Navigate to the frontend folder:**

    ```bash
    cd frontend
    ```

2.  **Install the packages:**

    ```bash
    npm install
    ```

3.  **Configure your API Key:**
    Create a file named `.env.local` inside the `frontend` folder and paste the following:

    ```text
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_GOOGLE_MAPS_KEY
    NEXT_PUBLIC_API_URL=http://localhost:8080
    ```

    *Note: Ensure your Google Maps key has **Maps JavaScript API**, **Places API**, and **Directions API** enabled.*

4.  **Start the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) to view the site.

-----

## ☕ 2. Setup the Backend (Spring Boot)

1.  **Navigate to the backend folder:**

    ```bash
    cd ../backend
    ```

2.  **Build and Install dependencies:**

    ```bash
    mvn clean install
    ```

3.  **Run the application:**

      * **Using IntelliJ:** Open the `backend` folder, wait for Maven to load, and click the **Run** button on `TaxiappApplication.java`.
      * **Using Terminal:**
        ```bash
        mvn spring-boot:run
        ```

    The backend will run on [http://localhost:8080](https://www.google.com/search?q=http://localhost:8080).

-----

## 🔗 3. Connecting Frontend to Backend

To ensure the Frontend can talk to the Backend without being blocked, check the `WebConfig.java` file in the backend. It should look like this:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000") // Trust our frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowCredentials(true);
    }
}
```

-----

## 🛠️ Common Issues & Fixes

### ❌ "CORS Blocked" / Login not working

  * **Fix:** Make sure the Backend is actually running. If the backend is off, the login will fail with a "Network Error".

### ❌ "Map is Black" / "Development Purposes Only"

  * **Fix:** Check your `.env.local` file. Make sure the API key is correct and that you have enabled **Billing** on your Google Cloud project (even the free tier requires a card).

### ❌ Port 3000 or 8080 already in use

  * **Fix:** A previous session didn't close properly. Run this command to kill the stuck process:
    ```bash
    # Windows (Command Prompt)
    netstat -ano | findstr :3000
    taskkill /PID <PID_NUMBER> /F
    ```

-----

## 🤝 Git Workflow for the Group

To keep our code clean and avoid overwriting each other's work:

1.  **Pull latest changes** before you start working:
    ```bash
    git pull origin main
    ```
2.  **Create a branch** for your specific task:
    ```bash
    git checkout -b feature/your-name-task
    ```
3.  **Commit your work** with a clear message:
    ```bash
    git add .
    git commit -m "Added the driver rating component"
    ```
4.  **Push your branch** and let the group know:
    ```bash
    git push origin feature/your-name-task
    ```

-----

## 🏁 Final Demo Checklist

  * [ ] Frontend is live at localhost:3000.
  * [ ] Backend is live at localhost:8080.
  * [ ] Can log in as "Sarah Johnson" (Mock data).
  * [ ] Selecting a location draws a **Blue Route** on the map.

<!-- end list -->

```
```

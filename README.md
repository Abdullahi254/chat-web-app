**Project Repository README**

---

### Project Overview

This repository houses our project, which integrates MongoDB and follows a specific structure for ease of development and maintenance.

### Getting Started

1. **Cloning the Repository**:
   - Clone this repository to your local machine using the following command:
     ```
     git clone https://github.com/Abdullahi254/chat-web-app.git
     ```

2. **Install Dependencies**:
   - After cloning the repository, navigate to the project directory:
     ```
     cd chat-web-app
     ```
   - Run the following command to install project dependencies:
     ```
     npm install
     ```

3. **MongoDB Integration**:
   - Ensure you have MongoDB installed and running.
   - In the root directory of the project, create a file named `.env`.
    3.a **Setting up the .env file**:
        - In the `.env` file, provide the MongoDB connection string in the following format:
        ```env
        REACT_APP_MONGO_URL="mongodb://localhost:27017/chatDB"
        NEXT_PUBLIC_BASE_URL='http://localhost:8000'
        ```
        - The above connection string is for your local instance of mongodb. If you havent installed it,
            you can find it [here]('https://www.mongodb.com/try/download/community').
        - You also need to set the base URL for the backend. In the above example its set to `http://localhost:8000`. 

4. **Project Structure**:
   - `src/app`: This directory contains the core frontend application code.
   - `src/app/lib`: This folder has a server actions file that is used for the frontend.
   - `src/app/components`: This folder has all the UI components for the frontend.
   - `src/server`: The backend folder for the application.
   - `src/server/controllers`: The folder has controllers specific for the user and web sockets.
   - `src/server/routes`: The `routes` folder has ExpressJS routes needed for the frontend.
   - `src/server/utils`: Common utilities for the backend.

5. **Running the project**:
   - You need to run the backend & the server:
     - Run `npm run dev` this will start the NextJS app.
     - Run `npm run xp` in another terminal, this will start the backend.
   - Then head to `http://localhost:3000/register`, register then login & start chatting. 

---

### Runnning Tests

When running tests you need to have your environment variables setup like in the above setup.
Then when running them: `mocha src/server/tests/**/**.js -r dotenv/config`.
This way when calling the test that requires a environment variable it will run without any issues.


### Next.js Route Handlers

For information on Next.js route handlers, please refer to the [Next.js documentation](https://nextjs.org/docs/app/building-your-application/routing/route-handlers).

---

This README provides an overview of the project repository, including instructions on cloning the repository, installing dependencies, MongoDB integration, the project structure, and where to find additional information on Next.js route handlers. If you have any questions or need further assistance, feel free to reach out to the project team. Happy coding!

Modern Maestro

Project Overview:
- Modern Maestro is a web application that allows users to explore, manage, and contribute to a comprehensive database of new classical music compositions -within the last   five years- and active composers. Users can search for composers, view their compositions, add new compositions, and interact with an API to fetch music data. Designed to explore and discover classical music, Modern Maestro provides users with a comprehensive database, enables them to contribute new data, and integrates with external APIs to enrich the musical experience. Whether you're a music enthusiast, student, or professional, Modern Maestro offers a rich and engaging way to interact with the world of classical music.

Technology Stack:
- Frontend: React, React Router, Bootstrap, Framer Motion, Axios
- Backend: Node.js, Express.js, Sequelize, PostgreSQL, Axios, Cheerio
- Authentication: JWT (JSON Web Tokens)
- APIs: Spotify API
  
Installation
    Prerequisites:
        Node.js
        PostgreSQL
    Steps:
        1. Clone the repository:
            git clone https://github.com/jdoerr13/modern-maestro-frontend.git
            cd modern-maestro-frontend

        2. Install dependencies for both frontend and backend:
            npm install
            cd ../modern-maestro-backend
            npm install

        3. Set up environment variables in a .env file in the backend directory:
            SPOTIFY_CLIENT_ID=your_spotify_client_id
            SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
            SECRET_KEY=your_jwt_secret_key

        4. Set up the PostgreSQL database and run the SQL commands in the Database Schema section to create the required tables.

        5. Start the backend server:
            npm start

        6.Start the frontend development server:
            cd ../modern-maestro-frontend
            npm start

Usage
    - Register a new account or log in if you already have an account.
    - Explore composers and their compositions.
    - Add new composers and compositions.
    - Search for tracks by composer name on Spotify and add them to the database.
    - Update your profile and manage your contributions.
    - 
Features
    User Authentication
        - User login and signup.
        - Secure authentication using JWT tokens.
    Composers
       - View a list of composers.
       - Search for composers by name.
       - Add new composers.
       - View detailed composer information.
       - Edit composer details.
    Compositions
        - View a list of compositions.
        - Search for compositions by title.
        - Add new compositions.
        - View detailed composition information.
        - Edit composition details.
    Additional Features
        - Search for tracks by composer name on Spotify.
        - Add tracks to the database.
        - Fetch a list of instruments.

Deployment
    [Deployed Site URL]

Tests
    Tests are located in the tests directory for both frontend and backend. To run the tests, use the following commands:
        For frontend: 
            - First go to the frontend directory 
            - then src folder
            - then api folder- click on the api.js
            - once there comment out: const BASE_URL = import.meta.env.VITE_APP_BASE_URL || "http://localhost:3000"; and make line 7 active: const BASE_URL = process.env.VITE_APP_BASE_URL || "http://localhost:3000";
            - then run: npm test
        or backend:
            - npm run test

User Flow
    1. Registration/Login: Users can create a new account or log in to an existing account. 
    2. Explore: Users can browse through a list of composers and their compositions.
    3. Search: Users can search for specific composers or compositions using the search functionality.
    4. Add Data: Authenticated users can add new composers and compositions to the database.
    5. Profile Management: Users can update their profile information and manage their contributions.

Spotify Integration: Users can search for tracks by composer name on Spotify and add them to the database.



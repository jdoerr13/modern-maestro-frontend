                                                                        Modern Maestro

Modern Maestro is a web application that allows users to explore, manage, and contribute to a comprehensive database of classical music compositions and composers. Users can search for composers, view their compositions, add new compositions, and interact with an API to fetch music data.

Project Overview:
Modern Maestro is a platform designed to explore and discover classical music compositions and composers. It provides users with a comprehensive database, allows them to contribute new data, and integrates with external APIs to enrich the musical experience.


Technologies Used:
    Frontend: React, React Router, Bootstrap, Framer Motion, Axios
    Backend: Node.js, Express.js, Sequelize, PostgreSQL, Axios, Cheerio
    Authentication: JWT (JSON Web Tokens)
    APIs: Spotify API

Installation: 
    Prerequisites:
        Node.js
        PostgreSQL

Steps:
1. Clone the repository:
git clone https://github.com/jdoerr13/modern-maestro-frontend.git
cd modern-maestro-frontend

2. Install dependencies for both frontend and backend:
   
3. cd ../modern-maestro-backend
npm install

4. Set up environment variables in a .env file in the backend directory:
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SECRET_KEY=your_jwt_secret_key

5. Set up the PostgreSQL database and run the SQL commands in the Database Schema section to create the required tables.

6. Start the backend server:
cd ../modern-maestro-frontend
npm start

7. Start the frontend development server:
cd ../modern-maestro-frontend
npm start

Usage: 
 - Register a new account or log in if you already have an account.
 - Explore composers and their compositions.
 - Add new composers and compositions.
 - Search for tracks by composer name on Spotify and add them to the database.
 - Update your profile and manage your contributions.
  

Features
    User Authentication
        User login and signup.
        Secure authentication using JWT tokens.
    Composers
        View a list of composers.
        Search for composers by name.
        Add new composers.
        View detailed composer information.
        Edit composer details.
    Compositions
        View a list of compositions.
        Search for compositions by title.
        Add new compositions.
        View detailed composition information.
        Edit composition details.
    Additional Features
        Search for tracks by composer name on Spotify.
        Add tracks to the database.
        Fetch a list of instruments.
import React, { useContext, useEffect, useState } from "react";
import { motion } from 'framer-motion';
import UserContext from "./auth/UserContext";
import LoginForm from './auth/LoginForm'; // Adjust the import path if necessary
import SignupForm from './auth/SignupForm'; // Adjust the import path if necessary

function WaveText({ text }) {
  return (
    <div className="description">
      {text.split('').map((char, index) => (
        <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
          {char}
        </span>
      ))}
    </div>
  );
}
// Prepare audio
const audio = new Audio('/sounds/orchestra-tuning.wav');


function Home() {
  const { user } = useContext(UserContext);
  const [greeting, setGreeting] = useState("");
  const [isPlaying, setIsPlaying] = useState(false); // State to manage if audio is playing
  const [showForm, setShowForm] = useState(null); // State to manage which form to show

  useEffect(() => {
    if (user) {
      const hour = new Date().getHours();
      const welcomeText = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
      setGreeting(`${welcomeText}, ${user.username}!`);
    }
  }, [user]);

  // Function to toggle sound play and pause
  const toggleSound = () => {
    if (!isPlaying) {
      audio.play().catch(error => console.error("Error playing the sound:", error));
    } else {
      audio.pause();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="Homepage" onClick={() => { if (!isPlaying) toggleSound(); }}>
      {user ? (
        <>
          <motion.h2
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="greeting"
          >
            {greeting}
          </motion.h2>
          <motion.p
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="description"
          >
          <WaveText text="Explore&nbsp;the&nbsp;new&nbsp;world&nbsp;of&nbsp;classical&nbsp;music" />
          </motion.p>
          <button onClick={toggleSound} style={{ marginTop: "20px" }}>
            {isPlaying ? "Stop Sound" : "Start your experience"}
          </button>
            <div class="music-notes-container">
              <div class="music-note">&#9835;</div>
              <div class="music-note">&#9833;</div>
              <div class="music-note">&#9834;</div>
            </div>
        </>
      ) : (
        <>
        <h1 className="greeting">Welcome to Modern Maestro!</h1>
        <div className="description">
          <WaveText text="Explore&nbsp;the&nbsp;new&nbsp;world&nbsp;of&nbsp;classical&nbsp;music" />
        </div>
        <br></br>
        {/* Render buttons only if showForm is not set */}
        {!showForm && (
          <div>
            <button onClick={() => setShowForm('login')} className="link-button">Log in</button>
            <button onClick={() => setShowForm('signup')} className="link-button">Sign up</button>
          </div>
        )}
      <div className="form-wrapper">
          {showForm === 'login' && <LoginForm />}
          {showForm === 'signup' && <SignupForm />}
        </div>
      </>
      )}
    </div>
  );
}

export default Home;

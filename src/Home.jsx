import React, { useContext, useEffect, useState, useRef } from "react";
import { motion } from 'framer-motion';
import UserContext from "./auth/UserContext";
import LoginForm from './auth/LoginForm';
import SignupForm from './auth/SignupForm';

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

function Home() {
  const audioRef = useRef(null);
  const { user, setUser } = useContext(UserContext);
  const [greeting, setGreeting] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showForm, setShowForm] = useState(null);

  useEffect(() => {
    audioRef.current = new Audio('/sounds/orchestra-tuning.wav');
  }, []);

  useEffect(() => {
    if (user) {
      const hour = new Date().getHours();
      const welcomeText = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
      setGreeting(`${welcomeText}, ${user.username}!`);
    }
  }, [user]);

  const toggleSound = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isPlaying) {
      audio.play().catch(error => console.error("Error playing the sound:", error));
    } else {
      audio.pause();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="Homepage">
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
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="description"
          >
            <WaveText text="Explore&nbsp;the&nbsp;new&nbsp;world&nbsp;of&nbsp;classical&nbsp;music" />
          </motion.div>
          <button onClick={toggleSound} style={{ marginTop: "20px" }}>
            {isPlaying ? "Stop Sound" : "Start your experience"}
          </button>
          <div className="music-notes-container">
            <div className="music-note">&#9835;</div>
            <div className="music-note">&#9833;</div>
            <div className="music-note">&#9834;</div>
          </div>
        </>
      ) : (
        <>
          <h1 className="greeting">Welcome to Modern Maestro!</h1>
          <div style={{ fontSize: '1.7em', color: '#333', marginTop: '20px', textAlign: 'center', display: 'inline-block', whiteSpace: 'nowrap' }}>
            <WaveText text="Explore&nbsp;the&nbsp;new&nbsp;world&nbsp;of&nbsp;classical&nbsp;music" />
          </div>
          <br />
          {!showForm && (
            <div>
              <button onClick={() => setShowForm('login')} className="link-button">Log in</button>
              <button onClick={() => setShowForm('signup')} className="link-button">Sign up</button>
              <div style={{ marginTop: "1rem" }}>
              <button
                onClick={() => setUser({ username: "DemoUser", email: "demo@user.com" })}
                className="link-button zoom-animation"
              >
                Bypass Login (Demo)
              </button>
              </div>
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

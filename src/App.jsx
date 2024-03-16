import React from 'react';
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from './auth/UserContext'; 
import Navigation from "./routes-nav/Navigation"; // Correct the paths as necessary
import CustomRoutes from "./routes-nav/Routes"; // Correct the paths as necessary

function App() {
  return (
    <BrowserRouter>
      <UserProvider> {/* This ensures all child components have access to the context */}
        <div className="App">
          <Navigation />
          <CustomRoutes />
        </div>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
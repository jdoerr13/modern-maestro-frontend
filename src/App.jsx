import React from 'react';
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from './auth/UserContext'; // Ensure path is correct
import Navigation from "./routes-nav/Navigation";
import CustomRoutes from "./routes-nav/Routes";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <div className="App">
          <Navigation />
          <CustomRoutes />
        </div>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;

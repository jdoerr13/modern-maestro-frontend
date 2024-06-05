import React from 'react';
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from './auth/UserContext'; 
import Navigation from "./routes-nav/Navigation"; 
import CustomRoutes from "./routes-nav/Routes"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Assuming the CSS file is in the src folder


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
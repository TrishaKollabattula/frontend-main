// src/App.js - UPDATED
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import ContentCreation from "./components/ContentCreation";
import Register from "./components/Register";
import Survey from "./components/Survey";
import UserProfile from "./components/UserProfile";
import Connect from "./Connect";
import Protected from "./routes/Protected";
import PrivacyPolicy from "./components/PrivacyPolicy";
import ContactUs from "./components/ContactUs";
import About from "./components/About";

// Helper
const hasToken = () => !!localStorage.getItem("token");

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes: if already authed, bounce to /connect */}
        <Route
          path="/login"
          element={hasToken() ? <Navigate to="/connect" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={hasToken() ? <Navigate to="/connect" replace /> : <Register />}
        />
        <Route path="/survey" element={<Survey />} />
        
        {/* New public pages */}
        <Route path="/about" element={<About />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/contact-us" element={<ContactUs />} />

        {/* Protected routes (single definition each) */}
        <Route
          path="/connect"
          element={
            <Protected>
              <Connect />
            </Protected>
          }
        />
        <Route
          path="/content-creation"
          element={
            <Protected>
              <ContentCreation />
            </Protected>
          }
        />
        <Route
          path="/schedule"
          element={
            <Protected>
              <div style={{ padding: "2rem" }}>Schedule Page - Coming Soon</div>
            </Protected>
          }
        />
        <Route
          path="/analytics"
          element={
            <Protected>
              <div style={{ padding: "2rem" }}>Analytics Page - Coming Soon</div>
            </Protected>
          }
        />
        <Route
          path="/my-posts"
          element={
            <Protected>
              <div style={{ padding: "2rem" }}>My Posts Page - Coming Soon</div>
            </Protected>
          }
        />
        <Route
          path="/profile"
          element={
            <Protected>
              <UserProfile />
            </Protected>
          }
        />
        <Route
          path="/settings"
          element={
            <Protected>
              <div style={{ padding: "2rem" }}>Settings Page - Coming Soon</div>
            </Protected>
          }
        />

        {/* Default - Redirect to login for now, but you might want a landing page */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
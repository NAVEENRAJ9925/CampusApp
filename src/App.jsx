import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import TopNavbar from "./components/TopNavbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Announcements from "./pages/Announcements.jsx";
import LostFound from "./pages/LostFound.jsx";
import Timetable from "./pages/Timetable.jsx";
import Complaints from "./pages/Complaints.jsx";
import SkillExchange from "./pages/SkillExchange.jsx";
import TechNews from "./pages/TechNews.jsx";
import Polls from "./pages/Polls.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import "./App.css";

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState("light");
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="app">
      {!isAuthPage && isAuthenticated && <Sidebar isCollapsed={isSidebarCollapsed} />}
      <div
        className={`main-content ${
          isSidebarCollapsed ? "sidebar-collapsed" : ""
        }${isAuthPage ? " auth-fullscreen" : ""}`}
      >
        {!isAuthPage && isAuthenticated && (
          <TopNavbar
            onToggleSidebar={toggleSidebar}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        )}
        <main className="content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard key="dashboard" />
                </PrivateRoute>
              }
            />
            <Route
              path="/announcements"
              element={
                <PrivateRoute>
                  <Announcements key="announcements" />
                </PrivateRoute>
              }
            />
            <Route
              path="/lost-found"
              element={
                <PrivateRoute>
                  <LostFound key="lost-found" />
                </PrivateRoute>
              }
            />
            <Route
              path="/timetable"
              element={
                <PrivateRoute>
                  <Timetable key="timetable" />
                </PrivateRoute>
              }
            />
            <Route
              path="/complaints"
              element={
                <PrivateRoute>
                  <Complaints key="complaints" />
                </PrivateRoute>
              }
            />
            <Route
              path="/skill-exchange"
              element={
                <PrivateRoute>
                  <SkillExchange key="skill-exchange" />
                </PrivateRoute>
              }
            />
            <Route
              path="/tech-news"
              element={
                <PrivateRoute>
                  <TechNews key="tech-news" />
                </PrivateRoute>
              }
            />
            <Route
              path="/polls"
              element={
                <PrivateRoute>
                  <Polls key="polls" />
                </PrivateRoute>
              }
            />
            
            {/* Catch all route - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;

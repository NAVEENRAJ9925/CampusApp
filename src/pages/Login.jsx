import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Paper,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import ParticlesBackground from "../components/ParticlesBackground";
import logo from "../images/logo.png"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // First authenticate with Firebase
      const firebaseUser = await signInWithEmailAndPassword(auth, email, password);
      console.log("Firebase auth successful:", firebaseUser.user.email);

      // Then get JWT token from our backend
      const res = await fetch("https://backend-bcex.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: firebaseUser.user.email }),
      });

      const data = await res.json();
      console.log("Backend response:", data);
      
      if (res.ok && data.token) {
        // Store user data and token
        const userData = {
          id: data.id || firebaseUser.user.uid,
          email: firebaseUser.user.email,
          name: data.name || firebaseUser.user.displayName || "User",
          role: data.role || "student"
        };
        
        login(userData, data.token);
        console.log("Login successful, navigating to dashboard");
        
        // Redirect to the intended page or dashboard
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      } else {
        setError(data.message || "Login failed - no token received");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box position="relative" minHeight="100vh" overflow="hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -2,
        }}
      >
        <source src="/videos/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          zIndex: -1,
        }}
      />

      {/* Particle Animation */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      >
        <ParticlesBackground />
      </Box>

      {/* Login Card */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        width="100vw"
        position="relative"
        zIndex={1}
        sx={{
          position: "relative",
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          padding: 0,
          margin: 0,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            borderRadius: 4,
            width: 400,
            background: "rgba(255, 255, 255, 0.12)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#fff",
          }}
        >
          {/* College Logo */}
          <Box display="flex" justifyContent="center" mb={2}>
            <img
              src={logo}
              alt="Sri Eshwar Logo"
              style={{ height: 60 }}
            />
          </Box>

          {/* Title & Form */}
          <Typography variant="h5" align="center" mb={2} fontWeight="bold">
            Welcome Back
          </Typography>
          <Typography variant="subtitle2" align="center" color="#ddd" mb={3}>
            Login to your account
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ style: { color: "#ddd", shrink: true } }}
              InputProps={{ style: { color: "#fff", background: "rgba(30,30,30,0.7)" } }}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ style: { color: "#ddd", shrink: true } }}
              InputProps={{ style: { color: "#fff", background: "rgba(30,30,30,0.7)" } }}
              sx={{ mb: 2 }}
            />
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              startIcon={<LoginIcon />}
              disabled={loading}
              sx={{
                mt: 3,
                bgcolor: "#FF6B6B",
                borderRadius: 3,
                "&:hover": { bgcolor: "#ff5252" },
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <Typography variant="body2" align="center" mt={3} color="#ddd">
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "#fff" }}>
              Sign Up
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;

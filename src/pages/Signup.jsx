import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { useNavigate, Link } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import logo from "../images/logo.png"
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Paper,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ParticlesBackground from "../components/ParticlesBackground";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Step 1: Create user in Firebase
      console.log("Creating user in Firebase...");
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Firebase user created:", userCredential.user.email);

      // Step 2: Store user data in Firestore
      console.log("Storing user data in Firestore...");
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        role,
      });
      console.log("User data stored in Firestore");

      // Step 3: Create user in backend database
      console.log("Creating user in backend database...");
      const backendResponse = await fetch("https://backend-bcex.onrender.com/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          role,
        }),
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json();
        throw new Error(errorData.message || "Failed to create user in backend");
      }

      const backendData = await backendResponse.json();
      console.log("Backend user created:", backendData);

      // Step 4: Login the user with backend token
      const userData = {
        id: backendData.id,
        email: backendData.email,
        name: backendData.name,
        role: backendData.role,
      };

      login(userData, backendData.token);
      console.log("User logged in successfully");

      // Step 5: Navigate to dashboard
      navigate("/");
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box position="relative" minHeight="100vh" overflow="hidden">
      {/* 🎬 Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          zIndex: -2,
        }}
      >
        <source src="/videos/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🌓 Dark Overlay */}
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

      {/* ✨ Particle Animation */}
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

      {/* 📋 Signup Form Card */}
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

          <Typography variant="h5" align="center" mb={2} fontWeight="bold">
            Create an Account
          </Typography>
          <Typography variant="subtitle2" align="center" color="#ddd" mb={3}>
            Join our platform
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ style: { color: "#ddd", shrink: true } }}
              InputProps={{ style: { color: "#fff", background: "rgba(30,30,30,0.7)" } }}
              sx={{ mb: 2 }}
            />
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
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label" sx={{ color: "#ddd" }}>
                Role
              </InputLabel>
              <Select
                labelId="role-label"
                value={role}
                label="Role"
                onChange={(e) => setRole(e.target.value)}
                sx={{ color: "#fff" }}
              >
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              startIcon={<PersonAddIcon />}
              disabled={loading}
              sx={{
                mt: 3,
                bgcolor: "#4ECDC4",
                borderRadius: 3,
                "&:hover": { bgcolor: "#38bfb2" },
                "&:disabled": { bgcolor: "#666" },
              }}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
          <Typography variant="body2" align="center" mt={3} color="#ddd">
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#fff" }}>
              Login
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Signup;

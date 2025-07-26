// Utility functions for error handling and API calls

export const handleApiError = (error, setError) => {
  console.error("API Error:", error);
  
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const message = error.response.data?.message;
    
    switch (status) {
      case 401:
        setError("Session expired. Please login again.");
        // Clear invalid token
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.reload();
        break;
      case 400:
        setError(message || "Invalid data provided");
        break;
      case 403:
        setError("You don't have permission to perform this action");
        break;
      case 404:
        setError("Service not found. Please contact administrator.");
        break;
      case 500:
        setError("Server error. Please try again later.");
        break;
      default:
        setError(message || "An error occurred");
    }
  } else if (error.request) {
    // Network error - no response received
    setError("Cannot connect to server. Please check your internet connection.");
  } else {
    // Other error
    setError("An unexpected error occurred. Please try again.");
  }
};

export const handleFetchSuccess = (data, setData, setError, dataName = "data") => {
  if (Array.isArray(data)) {
    setData(data);
    if (data.length === 0) {
      setError(`No ${dataName} found. Be the first to add one!`);
    } else {
      setError(""); // Clear any previous errors
    }
  } else {
    setData([]);
    setError("Invalid data format received");
  }
};

export const validateToken = (token) => {
  if (!token) {
    return { valid: false, message: "Please login to continue" };
  }
  
  // Basic token format validation
  if (typeof token !== 'string' || token.length < 10) {
    return { valid: false, message: "Invalid token format" };
  }
  
  return { valid: true, message: "" };
};

export const createAuthHeaders = (token) => {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}; 
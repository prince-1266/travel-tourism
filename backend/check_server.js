import axios from "axios";

console.log("Checking if backend server is running on port 5001...");
axios.get("http://localhost:5001/api/auth/diag")
  .then(res => {
    console.log("Backend server is ONLINE!");
    console.log("Response:", res.data);
  })
  .catch(err => {
    console.error("Backend server is OFFLINE or threw an error!");
    console.error("Error message:", err.message);
  });

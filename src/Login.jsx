import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductsTable from './ProductsTable'; // Assuming this is the correct path

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const    [isLoggedIn, setIsLoggedIn] = useState(false);
    const    [jwtToken, setJwtToken] = useState(null);
    const [products, setProducts] = useState([]);
    const [errorMessage, setErrorMessage] = useState(""); // State for error message

    const fetchProducts = async () => {
      const token = localStorage.getItem("jwtToken");
      console.log("Token sent to backend:", token); // Debugging line
      try {
        const response = await axios.get("http://127.0.0.1:5000/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching products:", error);
        return [];
      }
    };

    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post("http://127.0.0.1:5000/login", {
          username,
          password,
        });
        if (response.data.success) {
          console.log("Token received:", response.data.token); // Debugging line
          localStorage.setItem("jwtToken", response.data.token);
          setIsLoggedIn(true);
          setErrorMessage("");
        } else {
          setErrorMessage("Invalid username or password.");
        }
      } catch (error) {
        console.error("Login error:", error);
        setErrorMessage("An error occurred during login. Please try again.");
      }
    };
    
    useEffect(() => {
      if (isLoggedIn) {
        fetchProducts().then((data) => {
          console.log('Fetched products:', data); // Debugging line
          setProducts(data);
        });
      }
    }, [isLoggedIn]); // Runs whenever isLoggedIn changes
  
    return (
      <div>
      {isLoggedIn ? (
        <div>
          <h1>Welcome, {username}!</h1>
          <p>You are now logged in.</p>
          <ProductsTable products={products} />

        </div>
      ) : (
        <form onSubmit={handleLogin}>
          <h1>Login</h1>
          <div>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <button type="submit">Login</button>
        </form>
      )}
    </div>
  );
    }
    export default Login;
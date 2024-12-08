import React, { useState } from "react";
import styles from "../styles/login.module.css";
import { useRouter } from "next/router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in both fields.");
      return;
    }
    setError("");

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem('token', data.token);
        console.log('Login successful');
        router.push(`/adminboard`);
      } else {
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <div className={styles.contact}>
        </div>

        <div className={styles.submitForm}>
          <form onSubmit={handleLogin}>
            <h3 style={{fontSize: '24px',textAlign: 'center',marginBottom: '20px'}}>Login</h3>
            <div className={styles.inputt}>
              <label>Username</label>
              <input
                type="string"
                name="username"
                placeholder="Enter your username"
                className={styles.username}
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="password"
                className={styles.password}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" className={styles.button}>
                LOG IN
              </button>
            </div>
            {error && <p className={styles.validationMessage}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

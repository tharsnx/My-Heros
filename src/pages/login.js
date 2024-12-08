import React, { useState } from "react";
import styles from "../styles/login.module.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in both fields.");
      return;
    }
    setError("");
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

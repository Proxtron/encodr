import { useState } from "react";
import styles from "./LoginPage.module.css"
import { apiRequest } from "../utils/client";
import { useNavigate } from "react-router";

interface LoginResponse {
    token: string;
}

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {

    try {
        await apiRequest<LoginResponse>("/user/login", {
            method: "POST",
            body: JSON.stringify({ username, password }),
        });
        navigate("/video")
    } catch (error) {
        if(error instanceof Error) setError(error.message);
    }

  }

  return (
    <form className={styles.loginContainer} >
      <h1 className={styles.title}>Encodr: a video transcoding platform</h1>
      <label className={styles.field}>
        Username
        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label className={styles.field}>
        Password
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <p>{error}</p>
      <button className={styles.loginButton} onClick={(e) => { e.preventDefault(); handleLogin() }}>Login</button>
    </form>
  )
}

export default LoginPage

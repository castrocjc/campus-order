import { useState } from "react";
import api from "../services/api";

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("demo@campus.com");
  const [password, setPassword] = useState("123456");

  const login = (e) => {
    e.preventDefault();

    api.post("/auth/login", { email, password })
      .then(res => {
        const loginData = res.data.data;
        localStorage.setItem("token", loginData.token);
        localStorage.setItem("user", JSON.stringify(loginData));
        onLogin(loginData);
      })
      .catch(() => {
        alert("Credenciales inválidas");
      });
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={login}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
        />

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
        />

        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}

export default LoginPage;
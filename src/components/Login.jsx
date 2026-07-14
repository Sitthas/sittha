import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import users from "../data/users.json";

const MAX_ATTEMPTS = 5;

// ปรับเวลาได้ (หน่วย นาที)
const LOCK_TIME = 5;

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [lockTime, setLockTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const until = Number(localStorage.getItem("lockUntil"));

      if (until) {
        const remain = until - Date.now();

        if (remain > 0) {
          setLockTime(Math.ceil(remain / 1000));
        } else {
          localStorage.removeItem("lockUntil");
          localStorage.removeItem("attempts");
          setLockTime(0);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const login = () => {
    if (lockTime > 0) return;

    const user = users.find(
      (u) =>
        u.username === username &&
        u.password === password
    );

    if (user) {
      // ล้างข้อมูลการล็อก
      localStorage.removeItem("attempts");
      localStorage.removeItem("lockUntil");

      // เก็บสถานะ Login
      localStorage.setItem("isLogin", "true");
      localStorage.setItem("user", JSON.stringify(user));

      // ไปหน้า Dashboard
      navigate("/dashboard");
    } else {
      let attempts =
        Number(localStorage.getItem("attempts")) || 0;

      attempts++;

      localStorage.setItem("attempts", attempts);

      if (attempts >= MAX_ATTEMPTS) {
        const until =
          Date.now() + LOCK_TIME * 60 * 1000;

        localStorage.setItem("lockUntil", until);

        setLockTime(LOCK_TIME * 60);

        setError(`ใส่ก็ไม่ถูกไปใส่ใหม่ ${LOCK_TIME} นาที รอไปนะ`);
      } else {
        setError(
          `ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (${attempts}/${MAX_ATTEMPTS})`
        );
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>ล็อกอิน</h1>

        <p>Login</p>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") login();
          }}
        />

        {lockTime > 0 ? (
          <button disabled>
            ล็อกอยู่ {Math.floor(lockTime / 60)}:
            {(lockTime % 60).toString().padStart(2, "0")}
          </button>
        ) : (
          <button onClick={login}>
            Login
          </button>
        )}

        <div className="error">
          {error}
        </div>
      </div>
    </div>
  );
}
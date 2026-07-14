import { Navigate, useNavigate } from "react-router-dom";

export default function Dashboard() {

  const navigate = useNavigate();

  const login = localStorage.getItem("isLogin");

  if (!login) {
    return <Navigate to="/" />;
  }

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("isLogin");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div style={{ padding: 30 }}>

      <h1 style={{color:"red"}}>
          อยากเห็นของลับแม่น้ำทักส่วนตัวมา
      </h1>

      <h2 style={{color:"white"}}>
          {user.name}
      </h2>

      <button onClick={logout}>
        Logout
      </button>

    </div>
  );
}

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [err, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  console.log(inputs);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/register", inputs);
      navigate("/login");
    } catch (err) {
      setError(err.response.data);
      // if (err.response) {
      //   // Запит виконався, але сервер повернув статус в межах 2xx
      //   setError(err.response.data);
      // } else if (err.request) {
      //   // Запит був відправлений, але отримання відповіді не відбулося
      //   setError("No response received from the server");
      // } else {
      //   // Виникла помилка при налаштуванні запиту
      //   setError("Request setup error");
      // }
    }
  };

  return (
    <div className="auth">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          required
          type="text"
          placeholder="username"
          name="username"
          onChange={handleChange}
        />
        <input
          required
          type="email"
          placeholder="email"
          name="email"
          onChange={handleChange}
        />
        <input
          required
          type="password"
          placeholder="password"
          name="password"
          onChange={handleChange}
        />
        {/* <button type="button" onClick={handleSubmit}>
          Register
        </button> */}
        {/* <button type="submit">Register</button> */}
        <button type="submit" onClick={handleSubmit}>
          Register
        </button>

        {err && <p>{err}</p>}
        <span>
          Do you have an account? <Link to="/login">Login</Link>
        </span>
      </form>
    </div>
  );
};

export default Register;

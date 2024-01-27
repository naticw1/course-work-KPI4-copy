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

  const [usernameValid, setUsernameValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);

  const [err, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    if (name === "email") {
      setEmailValid(validateEmail(value));
    } else if (name === "username") {
      setUsernameValid(validateUsername(value));
    } else if (name === "password") {
      setPasswordValid(validatePassword(value));
    }
  };
  console.log(inputs);

  const validateEmail = (email) => {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  const validateUsername = (username) => {
    return username.length >= 5 && username.length <= 25;
  };

  const validatePassword = (password) => {
    return password.length >= 5 && password.length <= 25;
  };

  const handleSubmit = async (e) => {
    const formValid = usernameValid && emailValid && passwordValid;
    if (!formValid) {
      console.log("Form is invalid!");
      return;
    }
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
          value={inputs.username}
          onChange={handleChange}
          className={!usernameValid ? "input-error" : ""}
        />
        {!usernameValid && (
          <p className="error-message">
            Username must be 5-25 characters long.
          </p>
        )}

        <input
          required
          type="email"
          placeholder="email"
          name="email"
          value={inputs.email}
          onChange={handleChange}
          className={!emailValid ? "input-error" : ""}
        />
        {!emailValid && (
          <p className="error-message">Please enter a valid email address.</p>
        )}

        <input
          required
          type="password"
          placeholder="password"
          name="password"
          value={inputs.password}
          onChange={handleChange}
          className={!passwordValid ? "input-error" : ""}
        />
        {!passwordValid && (
          <p className="error-message">
            Password must be 5-25 characters long.
          </p>
        )}

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

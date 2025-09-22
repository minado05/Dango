import NavBar from "../components/NavBar";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useState } from "react";
import {
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";

function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const name = e.target.name;
    // const value = e.target.value;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await setPersistence(auth, browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      alert("Welcome back, " + user.displayName + "!");
      setFormData({ email: "", password: "" });
      navigate("/");
    } catch {
      alert("Incorrect email or password");
    }
  };
  return (
    <>
      <NavBar />
      <form className="form" onSubmit={handleSubmit}>
        <h2>Sign In</h2>
        <input
          id="email"
          className="form-input"
          name="email"
          type="email"
          value={formData.email}
          placeholder="Enter Email"
          onChange={handleChange}
          required
        ></input>
        <input
          id="password"
          className="form-input"
          name="password"
          value={formData.password}
          type="password"
          placeholder="Enter Password"
          onChange={handleChange}
          required
        ></input>
        <input type="submit" value="Sign In"></input>
        <p>
          Not registered yet? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </>
  );
}

export default SignIn;

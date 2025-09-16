import NavBar from "../components/NavBar";
import { Link, useNavigate } from "react-router-dom";

function SignIn() {
  const navigate = useNavigate();
  function handleSubmit() {
    alert("Login successful!");
    navigate("/");
  }
  return (
    <>
      <NavBar />
      <form className="form" onSubmit={handleSubmit}>
        <h2>Sign In</h2>
        <input
          id="email"
          className="form-input"
          type="email"
          placeholder="Enter Email"
          required
        ></input>
        <input
          id="password"
          className="form-input"
          type="password"
          placeholder="Enter Password"
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

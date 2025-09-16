import NavBar from "../components/NavBar";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  function handleSubmit() {
    alert("Account created successfully!");
    navigate("/account");
  }
  return (
    <>
      <NavBar />
      <form className="form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <input className="form-input" type="text" placeholder="Name" required />
        <input className="form-input" type="email" placeholder="Enter email" required />
        <input className="form-input" type="password" placeholder="Enter password" required />
        <input className="form-input" type="password" placeholder="Confirm password" required />
        <input type="submit" value="Sign Up" />
        <p>
          Already a member? <Link to="/signin">Sign In</Link>
        </p>
      </form>
    </>
  );
}

export default SignUp;

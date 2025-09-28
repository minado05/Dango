import NavBar from "../components/NavBar";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { useState } from "react";
import { FirebaseError } from "firebase/app";

interface formData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<formData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<formData>>({});

  //update input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value })); //copies prev form data and change [name] to this value
  };

  //validate inputs
  const validate = () => {
    const newErrors: Partial<formData> = {};
    if (formData.password.length < 6) {
      newErrors.password = "Password should be at least 6 characters or longer";
    }
    if (formData.password != formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  //handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //prevent form reloads page when submitting
    const validationErrors = validate();
    //convert validationErrors obj to array of keys
    if (Object.keys(validationErrors).length === 0) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        await updateProfile(userCredential.user, { displayName: formData.name });
        navigate("/account");
        alert("Account created successfully!");
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
        setErrors({});
      } catch (error: unknown) {
        if (error instanceof FirebaseError) {
          // You can check error.code or show error.message
          if (error.code === "auth/email-already-in-use") {
            setErrors({ email: "This email is already in use" });
          } else if (error.code === "auth/invalid-email") {
            setErrors({ email: "Invalid email address" });
          } else {
            setErrors({ email: error.message }); // fallback
          }
        } else {
          setErrors({ confirmPassword: "An unexpected error occurred" });
        }
      }
    } else {
      setErrors(validationErrors);
    }
  };
  return (
    <>
      <NavBar />
      <form className="form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <input
          className="form-input"
          name="name"
          value={formData.name}
          type="text"
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          className="form-input"
          name="email"
          value={formData.email}
          type="email"
          onChange={handleChange}
          placeholder="Enter Email"
          required
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}

        <input
          className="form-input"
          name="password"
          value={formData.password}
          type="password"
          onChange={handleChange}
          placeholder="Enter Password"
          required
        />
        {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}

        <input
          className="form-input"
          name="confirmPassword"
          value={formData.confirmPassword}
          type="password"
          placeholder="Confirm Password"
          onChange={handleChange}
          required
        />

        {errors.confirmPassword && <p style={{ color: "red" }}>{errors.confirmPassword}</p>}

        <input type="submit" value="Sign Up" />
        <p>
          Already a member? <Link to="/signin">Sign In</Link>
        </p>
      </form>
    </>
  );
}

export default SignUp;

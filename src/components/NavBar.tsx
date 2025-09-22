import SearchBar from "./SearchBar.tsx";
import { Link } from "react-router-dom";
import { CiSquarePlus } from "react-icons/ci";
import { VscAccount } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

function NavBar() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  function addPost() {
    if (user) {
      alert("Start posting");
      return;
    }
    alert("Please sign in to start posting!");
    navigate("/signin");
  }
  return (
    <>
      <div className="nav top">
        <Link to="/">
          <h1 id="logo">Dango</h1>
        </Link>
        <SearchBar />
        <div className="nav-icons">
          <div className="icon-wrapper" id="add-post" onClick={addPost}>
            <CiSquarePlus id="add-icon" />
          </div>
          <Link className="icon-wrapper" to="/account">
            <VscAccount id="account-icon" />
          </Link>
        </div>
      </div>
    </>
  );
}

export default NavBar;

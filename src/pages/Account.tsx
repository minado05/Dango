import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

function Account() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  function handleSignOut() {
    signOut(auth);
    alert("Sign out successful!");
    navigate("/signin");
  }
  return (
    <>
      <div id="back-arrow">
        <Link to="/">
          <IoIosArrowBack />
          Home
        </Link>
        <div id="profile-banner">
          <div id="profile-wrap">
            <div className="profile-circle"></div>
            <div className="description">
              <div id="name">name: {user ? user.displayName : "error"}</div>
              <div id="uid">uid: {user ? user.uid : "error"}</div>
              <div id="bio">bio: </div>
            </div>
          </div>
          <button id="sign-out-button" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </div>
      <hr></hr>
      <div className="nav bot">
        <div id="my-posts">My Itineraries</div>
        <div id="saves">Saved</div>
      </div>
      <div className="grid">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </>
  );
}
export default Account;

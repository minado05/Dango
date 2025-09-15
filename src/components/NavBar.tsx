import SearchBar from "./SearchBar.tsx";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <>
      <div className="nav top">
        <h1>GoVacay</h1>
        <SearchBar />
        <div id="account">
          <Link to="/account">Account</Link>
        </div>
      </div>
      <div className="nav bot">
        <div>Following</div>
        <div>Explore</div>
      </div>
      <hr></hr>
    </>
  );
}

export default NavBar;

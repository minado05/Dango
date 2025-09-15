import { IoIosSearch, IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";

function Account() {
  return (
    <>
      <div className="nav">
        <h1>GoVacay</h1>
        <IoIosSearch />
      </div>
      <hr></hr>
      <div id="profile-banner">
        <div id="back-arrow">
          <Link to="/">
            <IoIosArrowBack />
            Home
          </Link>
        </div>
        <div className="profile-circle">Profile pic</div>
      </div>
      <hr></hr>
    </>
  );
}
export default Account;

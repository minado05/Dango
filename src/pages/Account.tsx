import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";

function Account() {
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
              <div id="name">name:</div>
              <div id="uid">uid:</div>
              <div id="bio">bio:</div>
            </div>
          </div>
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

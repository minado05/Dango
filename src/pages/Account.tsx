import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { getDoc, doc, setDoc } from "firebase/firestore";
import MyPosts from "../components/MyPosts";
import Saved from "../components/Saved";

function Account() {
  const [user, setUser] = useState<User | null>(null);

  //listen for user change
  useEffect(() => {
    //notifies if user changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // cleanup listener
  }, []);

  const params = useParams<{ profileId: string }>();
  const profileId = params.profileId;
  const [isUser, setIsUser] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileImage, setProfileImage] = useState<string>();
  const navigate = useNavigate();

  //get profile
  useEffect(() => {
    if (user == null || profileId == null) return;
    if (user.uid == profileId) setIsUser(true);
    const getProfile = async () => {
      const profileRef = doc(db, "users", profileId);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        const profile = profileSnap.data();
        setProfileName(profile.name);
        setProfileBio(profile.bio);
        setProfileImage(profile.image);
      }
    };
    getProfile();
  }, [profileId, user]);
  const handleSignOut = () => {
    signOut(auth);
    alert("Sign out successful!");
    navigate("/signin");
  };

  const handleFollow = async () => {
    if (user == null || profileId == null) return;
    const followingRef = doc(db, "users", user.uid, "following", profileId);
    await setDoc(followingRef, {});
    alert("Follow successful!");
  };

  const toggleSaved = () => {
    if (!isSaved) setIsSaved(true);
  };

  const toggleMyPosts = () => {
    if (isSaved) setIsSaved(false);
  };

  return (
    <>
      <div className="back-arrow">
        <Link to="/">
          <IoIosArrowBack />
          Home
        </Link>
      </div>
      <div id="profile-banner">
        <div id="profile-wrap">
          <img src={profileImage} className="profile-circle" />
          <div className="description">
            <div id="name">Name: {profileName}</div>
            <div id="userid">Dango ID: {profileId ? profileId : ""}</div>
            <div id="bio">Bio: {profileBio} </div>
            {isUser ? (
              <button onClick={() => navigate("/updateprofile")}>Update Profile</button>
            ) : (
              <button onClick={handleFollow}>Follow</button>
            )}
          </div>
        </div>
        <button id="sign-out-button" onClick={handleSignOut}>
          Sign out
        </button>
      </div>
      <hr></hr>
      <div className="nav bot">
        <button onClick={toggleMyPosts} className="feed-buttons">
          My Posts
        </button>
        <button onClick={toggleSaved} className="feed-buttons">
          Saved
        </button>
      </div>
      {isSaved ? <Saved profileId={profileId || ""} /> : <MyPosts profileId={profileId || ""} />}
    </>
  );
}
export default Account;

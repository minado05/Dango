import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { collection, getDocs, getDoc, doc, type Timestamp, setDoc } from "firebase/firestore";
import PostCard from "../components/PostCard";

interface PostDetails {
  name: string;
  images: string[];
  location: string;
  caption: string;
  date: Timestamp;
  likes: number;
  postId: string;
  postuid: string;
}

function Account() {
  const user = auth.currentUser;
  const params = useParams<{ profileId: string }>();
  const profileId = params.profileId;
  const [posts, setPosts] = useState<PostDetails[]>([]);
  const [isUser, setIsUser] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileImage, setProfileImage] = useState<string>();
  const navigate = useNavigate();
  useEffect(() => {
    if (user == null || profileId == null) return;
    if (user.uid == profileId) setIsUser(true);
    const getPosts = async () => {
      const profileRef = doc(db, "users", profileId);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        const profile = profileSnap.data();
        setProfileName(profile.name);
        setProfileBio(profile.bio);
        setProfileImage(profile.image);
      }
      const postIdsRef = collection(profileRef, "posts");
      const queryPostIdSnapshot = await getDocs(postIdsRef);
      const postIdArray: string[] = [];
      queryPostIdSnapshot.forEach((post) => {
        postIdArray.push(post.id);
      });
      const postArray: PostDetails[] = [];
      for (const id of postIdArray) {
        const postRef = doc(db, "posts", id);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
          const postData = postSnap.data();
          postArray.push({
            name: postData.name,
            images: postData.images,
            location: postData.location,
            caption: postData.caption,
            date: postData.date,
            likes: postData.likes,
            postId: id,
            postuid: postData.uid,
          });
        }
      }
      setPosts(postArray);
    };
    getPosts();
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
        <div id="my-posts">My Posts</div>
        <div id="saves">Saved</div>
      </div>
      <div className="post-grid">
        {posts.map((post) => (
          <PostCard key={post.postId} post={post} />
        ))}
      </div>
    </>
  );
}
export default Account;

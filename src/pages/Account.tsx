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
  const params = useParams<{ profileId: string }>();
  const profileId = params.profileId;
  const [posts, setPosts] = useState<PostDetails[]>([]);
  const navigate = useNavigate();
  const user = auth.currentUser;
  // TODO: fix name of profile user
  useEffect(() => {
    if (user == null || profileId == null) return;
    const getPosts = async () => {
      const postIdsRef = collection(db, "users", profileId, "posts");
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
  };

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
              <div id="userid">User Id: {profileId ? profileId : "error"}</div>
              <div id="bio">bio: </div>
              <button onClick={handleFollow}>Follow</button>
            </div>
          </div>
          <button id="sign-out-button" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </div>
      <hr></hr>
      <div className="nav bot">
        <div id="my-posts">My Posts</div>
        <div id="saves">Saved</div>
      </div>
      <div className="post-grid">
        {posts.map((post) => (
          <PostCard post={post} />
        ))}
      </div>
    </>
  );
}
export default Account;

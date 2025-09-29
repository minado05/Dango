import {
  deleteDoc,
  doc,
  getDoc,
  increment,
  setDoc,
  updateDoc,
  type Timestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";

// Define the interface first
export interface PostDetails {
  name: string;
  images: string[];
  location: string;
  caption: string;
  date: Timestamp;
  likes: number;
  postId: string;
  postuid: string;
  profilePic: string;
  coverPic: string;
}

// Define the props for your component
interface PostProps {
  post: PostDetails;
}

// Component
function PostCard({ post }: PostProps) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const user = auth.currentUser;
  const uid = user ? user.uid : null;
  //check if saved
  useEffect(() => {
    if (uid == null || !post) {
      return;
    }
    const checkSaved = async () => {
      const docSnap = await getDoc(doc(db, "users", uid, "saved", post.postId));
      setSaved(docSnap.exists());
    };
    checkSaved();
  }, [post, uid]);

  const toggleSaved = async (postId: string) => {
    if (uid == null) {
      alert("Please sign in to save!");
      return;
    }
    const postRef = doc(db, "posts", postId);

    if (!saved) {
      await updateDoc(postRef, {
        likes: increment(1),
      });
      await setDoc(doc(db, "users", uid, "saved", postId), {});
      setLikes(likes + 1);
    } else {
      await deleteDoc(doc(db, "users", uid, "saved", postId));
      await updateDoc(postRef, {
        likes: increment(-1),
      });
      setLikes(likes - 1);
    }
    setSaved(!saved);
  };
  return (
    <div className="post-container">
      <div className="post-top-bar">
        <div className="user-info">
          <img
            src={post.profilePic}
            className="post-profile-circle"
            onClick={() => navigate(`/account/${post.postuid}`)}
          />
          <div>{post.name}</div>
        </div>
        <div className="likes">
          <button className="like-button" onClick={() => toggleSaved(post.postId)}>
            {saved ? <FaHeart color="red" /> : <FiHeart />}
          </button>
          <div>{likes}</div>
        </div>
      </div>
      <div className="post-bottom-bar" onClick={() => navigate(`/post/${post.postId}`)}>
        <img className="post-image" src={post.coverPic} alt="cover picture" />
        <div>{post.caption}</div>
        <div>{post.date.toDate().toLocaleString()}</div>
        <div>{post.location}</div>
      </div>
    </div>
  );
}

export default PostCard;

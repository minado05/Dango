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

// Define the interface first
export interface PostDetails {
  name: string;
  images: string[];
  location: string;
  caption: string;
  date: Timestamp;
  likes: number;
  postId: string;
}

// Define the props for your component
interface PostProps {
  post: PostDetails;
}

// Component
function PostCard({ post }: PostProps) {
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const user = auth.currentUser;
  const uid = user ? user.uid : null;

  useEffect(() => {
    if (uid == null) {
      return;
    }
    const checkSaved = async () => {
      const docSnap = await getDoc(doc(db, "users", uid, "saved", post.postId));
      setSaved(docSnap.exists());
    };
    checkSaved();
  }, [post.postId, uid]);

  const toggleSaved = async (postId: string) => {
    if (uid == null) {
      alert("Please sign in to save!");
      return;
    }
    if (!saved) {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        likes: increment(1),
      });
      await setDoc(doc(db, "users", uid, "saved", postId), {});
      setLikes(likes + 1);
    } else {
      await deleteDoc(doc(db, "users", uid, "saved", postId));
      setLikes(likes - 1);
    }
    setSaved(!saved);
  };
  return (
    <div className="post-container">
      <div className="post-top-bar">
        <div className="user-info">
          <div className="post-profile-circle"></div>
          <div>{post.name}</div>
        </div>
        <div className="likes">
          <button className="like-button" onClick={() => toggleSaved(post.postId)}>
            {saved ? <FaHeart color="red" /> : <FiHeart />}
          </button>
          <div>{likes}</div>
        </div>
      </div>
      <img className="post-image" src={post.images[0]} alt={post.caption} />
      <div>{post.caption}</div>
      <div>{post.date.toDate().toLocaleString()}</div>
      <div>{post.location}</div>
    </div>
  );
}

export default PostCard;

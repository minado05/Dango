import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  deleteDoc,
  doc,
  getDoc,
  increment,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { onAuthStateChanged, type User } from "firebase/auth";

export interface PostDetails {
  name: string;
  images: string[];
  location: string;
  caption: string;
  date: Timestamp;
  likes: number;
  postId: string;
  postuid: string;
}

function Post() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // cleanup listener
  }, []);

  const [saved, setSaved] = useState(false);
  const params = useParams<{ postId: string }>();
  const [post, setPost] = useState<PostDetails>({
    likes: 0,
    name: "",
    images: [],
    location: "",
    caption: "",
    date: new Timestamp(0, 0), // example default
    postId: "",
    postuid: "",
  });
  const postId = params.postId;

  useEffect(() => {
    if (!postId) return;
    const getPost = async () => {
      const postRef = doc(db, "posts", postId);
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        const data = postSnap.data();
        setPost({
          name: data.name,
          images: data.images,
          location: data.location,
          caption: data.caption,
          date: data.date,
          likes: data.likes,
          postId: postId,
          postuid: data.uid,
        });
      }
    };
    getPost();
  }, [postId]);

  const toggleSaved = async () => {
    if (user == null) return;
    const postRef = doc(db, "posts", post.postId);
    if (!saved) {
      await updateDoc(postRef, {
        likes: increment(1),
      });
      await setDoc(doc(db, "users", user.uid, "saved", post.postId), {});
      setPost((prev) => ({ ...prev, likes: prev.likes + 1 }));
    } else {
      await deleteDoc(doc(db, "users", user.uid, "saved", post.postId));
      await updateDoc(postRef, {
        likes: increment(-1),
      });
      setPost((prev) => ({ ...prev, likes: prev.likes - 1 }));
      console.log("here");
    }
    setSaved(!saved);
  };

  return (
    <>
      <NavBar />
      <div>
        {post ? (
          <div className="post-page-container">
            <div className="post-side left">
              <img src={post.images[0]} alt={post.caption} />
            </div>
            <div className="post-side right">
              <div className="user-info">
                <img
                  src={post.images[0]}
                  className="post-profile-circle"
                  onClick={() => navigate(`/account/${post.postuid}`)}
                />
                <div>{post.name}</div>
              </div>
              <div>{post.caption}</div>
              <div>{post.date.toDate().toLocaleString()}</div>
              <div>{post.location}</div>
              <div className="likes">
                <button className="like-button" onClick={toggleSaved}>
                  {saved ? <FaHeart color="red" /> : <FiHeart />}
                </button>
                <div>{post.likes}</div>
              </div>
            </div>
          </div>
        ) : (
          <div>Error fetching post</div>
        )}
      </div>
    </>
  );
}

export default Post;

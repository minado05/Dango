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
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

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
  const [imageIndex, setImageIndex] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState<string>();
  //get profile pic of the post
  useEffect(() => {
    if (post == null) return;
    const getProfilePic = async () => {
      const profileSnap = await getDoc(doc(db, "users", post.postuid));
      if (profileSnap.exists()) {
        const profile = profileSnap.data();
        setProfilePic(profile.image);
      }
    };
    getProfilePic();
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // cleanup listener
  }, []);

  const [saved, setSaved] = useState(false);
  const params = useParams<{ postId: string }>();
  const [post, setPost] = useState<PostDetails | null>(null);
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

  //check if saved
  useEffect(() => {
    if (user == null || post === null) {
      return;
    }
    const checkSaved = async () => {
      const docSnap = await getDoc(doc(db, "users", user.uid, "saved", post.postId));
      setSaved(docSnap.exists());
    };
    checkSaved();
  }, [user, post]);

  const toggleSaved = async () => {
    if (post == null) return;
    if (user == null) {
      alert("Please sign in to save!");
      return;
    }
    const postRef = doc(db, "posts", post.postId);
    if (!saved) {
      await updateDoc(postRef, {
        likes: increment(1),
      });
      await setDoc(doc(db, "users", user.uid, "saved", post.postId), {});
      setPost((prev) => {
        if (!prev) return null;
        return { ...prev, likes: prev.likes + 1 };
      });
    } else {
      await deleteDoc(doc(db, "users", user.uid, "saved", post.postId));
      await updateDoc(postRef, {
        likes: increment(-1),
      });
      setPost((prev) => {
        if (!prev) return null;
        return { ...prev, likes: prev.likes - 1 };
      });
      console.log("here");
    }
    setSaved(!saved);
  };

  const forward = () => {
    if (post == null) return;
    if (imageIndex == post.images.length - 1) return;
    setImageIndex(imageIndex + 1);
  };

  const backward = () => {
    if (imageIndex == 0) return;
    setImageIndex(imageIndex - 1);
  };

  return (
    <>
      <NavBar />
      <div>
        {post ? (
          <div className="post-page-container">
            <div className="post-side left">
              <div id="image-index">
                {imageIndex + 1}/{post.images.length}
              </div>
              <div id="back-button" onClick={backward}>
                <IoIosArrowBack className="img-nav-icon" />
              </div>
              <div id="forward-button" onClick={forward}>
                <IoIosArrowForward className="img-nav-icon" />{" "}
              </div>
              <img src={post.images[imageIndex]} alt={post.caption} />
            </div>
            <div className="post-side right">
              <div className="user-info">
                <img
                  src={profilePic}
                  className="post-profile-circle"
                  onClick={() => navigate(`/account/${post.postuid}`)}
                />
                <div>{post.name}</div>
              </div>
              <div className="caption">{post.caption}</div>
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
          <div>Loading...</div>
        )}
      </div>
    </>
  );
}

export default Post;

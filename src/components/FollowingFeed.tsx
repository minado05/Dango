import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, doc, getDocs, getDoc, Timestamp } from "firebase/firestore";
import PostCard from "./PostCard";
import { onAuthStateChanged, type User } from "firebase/auth";

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

function FollowingFeed() {
  const [followingPosts, setFollowingPosts] = useState<PostDetails[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // cleanup listener
  }, []);

  useEffect(() => {
    if (user == null) return;
    const followingUsers: string[] = [];
    //for each user in the following list, get their posts
    const getFollowingPosts = async () => {
      const postArray: PostDetails[] = [];
      const followingRef = collection(db, "users", user.uid, "following");
      const snapshot = await getDocs(followingRef);
      snapshot.forEach((doc) => {
        followingUsers.push(doc.id);
      });
      for (const id of followingUsers) {
        const userRef = doc(db, "users", id);
        const postIdsRef = collection(userRef, "posts");
        const queryPostIdSnapshot = await getDocs(postIdsRef);
        const postIdArray: string[] = [];
        queryPostIdSnapshot.forEach((post) => {
          postIdArray.push(post.id);
        });
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
      }
      setFollowingPosts(postArray);
    };
    getFollowingPosts();
  }, [user]);

  return (
    <div className="post-grid">
      {followingPosts.map((post) => (
        <PostCard key={post.postId} post={post} />
      ))}
    </div>
  );
}

export default FollowingFeed;

import { db } from "../firebase";
import { useEffect, useState } from "react";
import { collection, getDocs, getDoc, doc, type Timestamp } from "firebase/firestore";
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
  profilePic: string;
  coverPic: string;
}

interface Props {
  profileId: string;
}

function MyPosts({ profileId }: Props) {
  const [posts, setPosts] = useState<PostDetails[]>([]);
  useEffect(() => {
    const getPosts = async () => {
      const profileRef = doc(db, "users", profileId);
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
            profilePic: postData.profilePic,
            coverPic: postData.coverPic,
          });
        }
      }
      setPosts(postArray);
    };
    getPosts();
  }, [profileId]);

  return (
    <>
      <div className="post-grid">
        {posts.map((post) => (
          <PostCard key={post.postId} post={post} />
        ))}
      </div>
    </>
  );
}

export default MyPosts;

import { collection, orderBy, query, limit, type Timestamp, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import PostCard from "./PostCard";

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

function TrendingFeed() {
  const [trendingList, setTrendingList] = useState<PostDetails[]>([]);
  useEffect(() => {
    const getTrendingList = async () => {
      const q = query(collection(db, "posts"), orderBy("likes", "desc"), limit(10));
      const qSnapshot = await getDocs(q);
      const trendArray: PostDetails[] = [];
      qSnapshot.forEach((doc) => {
        const post = doc.data();
        trendArray.push({
          name: post.name,
          images: post.images,
          location: post.location,
          caption: post.caption,
          date: post.date,
          likes: post.likes,
          postId: doc.id,
          postuid: post.uid,
        });
        setTrendingList(trendArray);
      });
    };
    getTrendingList();
  }, [trendingList]);

  return (
    <div className="post-grid">
      {trendingList.map((post) => (
        <PostCard post={post} />
      ))}
    </div>
  );
}

export default TrendingFeed;

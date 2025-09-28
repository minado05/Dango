import { useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import PostCard from "../components/PostCard";
const postRef = collection(db, "posts");

interface PostDetails {
  name: string;
  images: string[];
  location: string;
  caption: string;
  date: Timestamp;
  likes: number;
  postId: string;
}

function Search() {
  const [resultList, setResultList] = useState<PostDetails[]>([]);
  const params = new URLSearchParams(useLocation().search);
  const searchKeyword = params.get("query");

  useEffect(() => {
    const fetchData = async () => {
      const qPost = query(postRef, where("location", "==", searchKeyword));
      const querySnapshot = await getDocs(qPost);
      const postArray: PostDetails[] = [];
      querySnapshot.forEach((doc) => {
        const post = doc.data();
        postArray.push({
          name: post.name,
          images: post.images,
          location: post.location,
          caption: post.caption,
          date: post.date,
          likes: post.likes,
          postId: doc.id,
        });
      });
      setResultList(postArray);
    };
    fetchData();
  }, [searchKeyword]);

  return (
    <>
      <NavBar />
      <div id="search-results-container">
        {resultList.map((post) => (
          <PostCard post={post} />
        ))}
      </div>
    </>
  );
}

export default Search;

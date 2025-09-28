import { useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import Post from "../components/Post";
const postRef = collection(db, "posts");

interface PostDetails {
  username: string;
  images: string[];
  location: string;
  caption: string;
  date: Timestamp;
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
          username: doc.id,
          images: post.images,
          location: post.location,
          caption: post.caption,
          date: post.date,
        });
      });
      setResultList(postArray);
    };
    fetchData();
  }, [searchKeyword]);

  return (
    <>
      <NavBar />
      <div>
        {resultList.map((post) => (
          <Post post={post} />
        ))}
      </div>
    </>
  );
}

export default Search;

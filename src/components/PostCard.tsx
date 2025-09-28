import type { Timestamp } from "firebase/firestore";
import { FiHeart } from "react-icons/fi";

// Define the interface first
export interface PostDetails {
  name: string;
  images: string[];
  location: string;
  caption: string;
  date: Timestamp;
  likes: number;
}

// Define the props for your component
interface PostProps {
  post: PostDetails;
}

// Component
function PostCard({ post }: PostProps) {
  return (
    <div className="post-container">
      <div className="post-top-bar">
        <div className="user-info">
          <div className="post-profile-circle"></div>
          <div>{post.name}</div>
        </div>
        <div className="likes">
          <FiHeart />
          <div>{post.likes}</div>
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

import type { Timestamp } from "firebase/firestore";

// Define the interface first
export interface PostDetails {
  username: string;
  images: string[];
  location: string;
  caption: string;
  date: Timestamp;
}

// Define the props for your component
interface PostProps {
  post: PostDetails;
}

// Component
function Post({ post }: PostProps) {
  return (
    <div>
      <p>{post.username}</p>
      <p>{post.caption}</p>
      <p>{post.location}</p>
      <img src={post.images[0]} alt={post.caption} />
      <p>{post.date.toDate().toLocaleString()}</p>
    </div>
  );
}

export default Post;

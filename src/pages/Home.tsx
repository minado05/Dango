import NavBar from "../components/NavBar";
import ExploreFeed from "../components/ExploreFeed";
import FollowingFeed from "../components/FollowingFeed";
import { useState } from "react";
function Home() {
  const [followFeed, setFollowFeed] = useState(true);
  const [exploreFeed, setExploreFeed] = useState(false);

  function followFeedOn() {
    if (followFeed) return;
    setFollowFeed(true);
    setExploreFeed(false);
  }

  function exploreFeedOn() {
    if (exploreFeed) return;
    setExploreFeed(true);
    setFollowFeed(false);
  }

  return (
    <>
      <NavBar />
      <div className="nav bot">
        <button className="feed-buttons" onClick={followFeedOn}>
          Following
        </button>
        <button className="feed-buttons" onClick={exploreFeedOn}>
          Explore
        </button>
      </div>
      {exploreFeed ? <ExploreFeed /> : <FollowingFeed />}
    </>
  );
}

export default Home;

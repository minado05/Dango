import NavBar from "../components/NavBar";
import FollowingFeed from "../components/FollowingFeed";
import { useState } from "react";
import TrendingFeed from "../components/TrendingFeed";
function Home() {
  const [followFeed, setFollowFeed] = useState(true);
  const [trendingFeed, setExploreFeed] = useState(false);

  function followFeedOn() {
    if (followFeed) return;
    setFollowFeed(true);
    setExploreFeed(false);
  }

  function exploreFeedOn() {
    if (trendingFeed) return;
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
          Trending
        </button>
      </div>
      {trendingFeed ? <TrendingFeed /> : <FollowingFeed />}
    </>
  );
}

export default Home;

import "./App.css";
import Home from "./pages/Home";
import Account from "./pages/Account";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AddPost from "./pages/AddPost";
import Search from "./pages/Search";

import { Routes, Route } from "react-router-dom";
import UpdateProfile from "./pages/UpdateProfile";
import Post from "./pages/Post";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/account/:profileId" element={<Account />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/addpost" element={<AddPost />} />
      <Route path="/search" element={<Search />} />
      <Route path="/updateprofile" element={<UpdateProfile />} />
      <Route path="/post/:postId" element={<Post />} />
    </Routes>
  );
}

export default App;

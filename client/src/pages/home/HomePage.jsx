import { useState } from "react";
import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou");

  return (
    <div className="flex-[4_4_0] border-x border-gray-700 min-h-screen">
      {/* Header */}
      <div className="flex w-full border-b border-gray-700">
        <div className="flex justify-center flex-1 p-3 hover:bg-gray-800 transition duration-300 cursor-pointer relative"
          onClick={() => setFeedType("forYou")}>
          For you
          {feedType === "forYou" && <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>}
        </div>

        <div className="flex justify-center flex-1 p-3 hover:bg-gray-800 transition duration-300 cursor-pointer relative"
          onClick={() => setFeedType("following")}>
          Following
          {feedType === "following" && <div className="absolute bottom-0 h-1 rounded-full w-10 bg-primary"></div>}
        </div>
      </div>

      {/* Create post input */}
      <CreatePost />

      {/* Posts */}
      <Posts feedType={feedType} />
    </div>
  );
};

export default HomePage;
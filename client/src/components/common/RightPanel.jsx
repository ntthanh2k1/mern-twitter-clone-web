import {Link} from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { useQuery } from "@tanstack/react-query";
import useFollow from "../../hooks/useFollow";
import LoadingSpinner from "./LoadingSpinner";

const RightPanel = () => {
  const { data:suggestedUsers, isLoading} = useQuery({
    queryKey: ["suggestedUser"],
    queryFn: async () => {
      const res = await fetch("/api/users/suggested");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error fetching suggested users.")
      }

      return data;
    }
  });

  const { follow, isPending } = useFollow();

  if (suggestedUsers?.length === 0) {
    return (
      <div className="md:w-64 w-0"></div>
    );
  }

  return (
    <div className="hidden lg:block mx-2 my-4">
      <div className="sticky p-4 top-2 rounded-md">
        <p className="font-bold">Who to follow</p>

        <div className="flex flex-col gap-4">
          {/*item */}
          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          
          {!isLoading && (
            suggestedUsers?.map((user) => (
              <Link to={`/profile/${user.username}`}
                className="flex justify-between items-center gap-4"
                key={user._id}>
                <div className="flex items-center gap-2">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img src={user.profileImg || "/avatar-placeholder.png"} alt="profileImg" />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-28">{user.fullName}</span>

                    <span className="text-sm text-slate-500">{user.username}</span>
                  </div>
                </div>

                <div>
                  <button className="btn btn-sm bg-white text-black hover:bg-white hover:opacity-90 rounded-full"
                    onClick={(e) => {
                      e.preventDefault();
                      follow(user._id);
                    }}>
                    {isPending ? <LoadingSpinner size="sm" /> : "Follow"}
                  </button>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
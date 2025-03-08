import RightPanelSkeleton from "../skeletons/RightPanelSkeleton.jsx";
import {USERS_FOR_RIGHT_PANEL} from "../../utils/db/dummy.js";
import {Link} from "react-router-dom";

const RightPanel = () => {
  const isLoading = false;

  return (
    <div>
      <div>
        <p>Who to follow</p>

        <div>
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
            USERS_FOR_RIGHT_PANEL?.map((user) => (
              <Link to={`/profile/${user.username}`}
                className=""
                key={user._id}>
                <div>
                  <div>
                    <div>
                      <img src={user.profileImg || "/avatar-placeholder.png"} alt="profileImg" />
                    </div>
                  </div>

                  <div>
                    <span>
                      {user.fullName}
                    </span>

                    <span>{user.username}</span>
                  </div>
                </div>

                <div>
                  <button>
                    Follow
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
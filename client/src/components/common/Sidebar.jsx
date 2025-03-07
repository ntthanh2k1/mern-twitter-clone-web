import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import { Link } from "react-router-dom";
import XSvg from "../svgs/X";
import { FaUser } from "react-icons/fa";

const Sidebar = () => {
  const data = {
    fullName: "Tri Thanh Nguyen",
    username: "ntthanh2k1",
    profileImg: "/avatars/boy1.png"
  };

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52">
      <div>
        <Link to="/">
          <XSvg className="w-12 fill-white" />
        </Link>

        <ul>
          <li>
            <Link to="/">
              <MdHomeFilled />
              <span>Home</span>
            </Link>
          </li>
            
          <li>
            <Link to="/notifications">
              <IoNotifications />
              <span>Notifications</span>
            </Link>
          </li>

          <li>
            <Link to={`/profile/${data.username}`}>
              <FaUser />
              <span>Profile</span>
            </Link>
          </li>
        </ul>
        {data && (
          <Link to={`/profile/${data.username}`}
            className="">
            <div>
              <div className="w-8">
                <img className="rounded-full" src={data?.profileImg || "/avatar-placeholder.png"} />
              </div>
            </div>

            <div>
              <div>
                <p>{data?.fullName}</p>
                <p>{data?.username}</p>
              </div>
              <BiLogOut />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
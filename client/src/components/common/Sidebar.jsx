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
    <div className="md:flex-[2_2_0] max-w-52 border-l border-gray-700">
      <div className="sticky top-0 left-0 h-screen flex flex-col w-20 md:w-full">
        <Link to="/" className="flex justify-center md:justify-start px-4 py-2">
          <XSvg className="w-10 h-10 rounded-full fill-white hover:bg-stone-900" />
        </Link>

        <ul className="flex flex-col gap-3 mt-4">
          <li className="flex justify-center md:justify-start">
            <Link to="/" className="flex items-center px-4 py-2 gap-3 hover:bg-stone-900 transition-all duration-300 rounded-full cursor-pointer">
              <MdHomeFilled className="w-8 h-8" />
              <span className="text-lg hidden md:block">Home</span>
            </Link>
          </li>
            
          <li className="flex justify-center md:justify-start">
            <Link to="/notifications" className="flex items-center px-4 py-2 gap-3 hover:bg-stone-900 transition-all duration-300 rounded-full cursor-pointer">
              <IoNotifications className="w-8 h-8" />
              <span className="text-lg hidden md:block">Notifications</span>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start">
            <Link to={`/profile/${data.username}`} className="flex items-center px-4 py-2 gap-3 hover:bg-stone-900 transition-all duration-300 rounded-full cursor-pointer">
              <FaUser className="w-8 h-8" />
              <span className="text-lg hidden md:block">Profile</span>
            </Link>
          </li>
        </ul>
        {data && (
          <Link to={`/profile/${data.username}`}
            className="flex mx-auto items-center mt-auto mb-10 px-4 py-2 gap-3 hover:bg-stone-900 transition-all duration-300 rounded-full cursor-pointer">
            <div className="avatar hidden md:inline-flex">
              <div className="w-10">
                <img className="rounded-full" src={data?.profileImg || "/avatar-placeholder.png"}  alt="profileImg"/>
              </div>
            </div>

            <div className="flex justify-between items-center flex-1 gap-3">
              <div className="hidden md:block">
                <p className="text-white font-bold text-sm w-20 truncate">{data?.fullName}</p>
                <p className="text-slate-500 text-sm">{data?.username}</p>
              </div>
              <BiLogOut className="w-8 h-8 cursor-pointer" />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
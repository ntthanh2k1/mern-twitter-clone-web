import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import { Link } from "react-router-dom";
import XSvg from "../svgs/X";
import { FaUser } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Sidebar = () => {
  const { data:authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const { mutate:signOutMutation } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/signout", {
        method: "POST"
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Sign out failed.");
      }
    },
    onSuccess: () => {
      // refresh the authUser
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Signed out successfully.");
    },
    onError: () => {
      toast.error("Sign out failed.");
    }
  });

  return (
    <div className="md:flex-[2_2_0] max-w-52 border-l border-gray-700">
      <div className="sticky top-0 left-0 h-screen flex flex-col w-20 md:w-full">
        <Link to="/" className="flex justify-center md:justify-start px-4 py-2">
          <XSvg className="w-10 h-10 fill-white hover:bg-gray-900" />
        </Link>

        <ul className="flex flex-col gap-3 mt-4">
          <li className="flex justify-center md:justify-start">
            <Link to="/" className="flex items-center px-4 py-2 gap-3 md:w-full hover:bg-gray-800 transition-all duration-300 rounded-full cursor-pointer">
              <MdHomeFilled className="w-6 h-6" />
              <span className="text-lg hidden md:block">Home</span>
            </Link>
          </li>
            
          <li className="flex justify-center md:justify-start">
            <Link to="/notifications" className="flex items-center px-4 py-2 gap-3 md:w-full hover:bg-gray-800 transition-all duration-300 rounded-full cursor-pointer">
              <IoNotifications className="w-6 h-6" />
              <span className="text-lg hidden md:block">Notifications</span>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start">
            <Link to={`/profile/${authUser.username}`} className="flex items-center px-4 py-2 gap-3 md:w-full hover:bg-gray-800 transition-all duration-300 rounded-full cursor-pointer">
              <FaUser className="w-6 h-6" />
              <span className="text-lg hidden md:block">Profile</span>
            </Link>
          </li>
        </ul>

        {authUser && (
          <Link to={`/profile/${authUser.username}`}
            className="flex mx-auto items-center mt-auto mb-10 px-4 py-2 gap-3 md:w-full hover:bg-gray-800 transition-all duration-300 rounded-full cursor-pointer">
            <div className="avatar hidden md:inline-flex">
              <div className="w-10">
                <img className="rounded-full" src={authUser?.profileImg || "/avatar-placeholder.png"}  alt="profileImg"/>
              </div>
            </div>

            <div className="flex justify-between items-center flex-1 gap-3">
              <div className="hidden md:block">
                <p className="text-white font-bold text-sm w-20 truncate">{authUser?.fullName}</p>
                
                <p className="text-slate-500 text-sm">{authUser?.username}</p>
              </div>
              <BiLogOut className="w-6 h-6 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  signOutMutation();
                }}
                />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
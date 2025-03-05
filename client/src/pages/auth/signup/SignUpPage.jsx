import XSvg from "../../../components/svgs/X";
import { MdDriveFileRenameOutline, MdOutlineMail, MdPassword } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: ""
  });

  const submitHandler = (e) => {
    e.preventDefault(); // Page will not reload
    console.log(formData);
  };

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  };

  const isError = false;
  
  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 hidden lg:flex justify-center items-center">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="lg:w-2/3 mx-auto md:mx-20 flex flex-col gap-4" onSubmit={submitHandler}>
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">Join today.</h1>
          <label className="input input-bordered rounded-lg flex items-center gap-2">
            <MdDriveFileRenameOutline />
            <input type="text" className="grow" placeholder="Full name"
              name="fullName" value={formData.fullName} onChange={changeHandler} />
          </label>

          <label className="input input-bordered rounded-lg flex items-center gap-2">
            <MdOutlineMail />
            <input type="email" className="grow" placeholder="Email"
              name="email" value={formData.email} onChange={changeHandler} />
          </label>
          
          <label className="input input-bordered rounded-lg flex items-center gap-2">
            <FaUser />
            <input type="text" className="grow" placeholder="Username"
              name="username" value={formData.username} onChange={changeHandler} />
          </label>

          <label className="input input-bordered rounded-lg flex items-center gap-2">
            <MdPassword />
            <input type="password" className="grow" placeholder="Password"
              name="password" value={formData.password} onChange={changeHandler} />
          </label>

          {isError && <p className="text-red-500">Something went wrong!</p>}
          <button className="btn btn-primary rounded-lg text-white">Sign up</button>
        </form>

        <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
          <p className="text-lg text-white">Already have an account?</p>
          <Link to="/signin">
            <button className="btn btn-outline btn-primary rounded-lg text-white w-full">Sign in</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
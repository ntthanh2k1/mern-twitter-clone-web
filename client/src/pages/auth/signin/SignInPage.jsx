import XSvg from "../../../components/svgs/X";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { Link } from "react-router-dom";
import { useState } from "react";

const SignInPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
          <h1 className="text-4xl font-extrabold text-white">{"Let's"} go.</h1>
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
          <button className="btn btn-primary rounded-lg text-white">Sign in</button>
        </form>

        <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
          <p className="text-lg text-white">{"Don't"} have an account?</p>
          <Link to="/signup">
            <button className="btn btn-outline btn-primary rounded-lg text-white w-full">Sign up</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
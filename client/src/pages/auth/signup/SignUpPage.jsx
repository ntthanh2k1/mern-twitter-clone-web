import { Link } from "react-router-dom";
import XSvg from "../../../components/svgs/X";

const SignUpPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  
  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 hidden lg:flex justify-center items-center">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="lg:w-2/3 mx-auto md:mx-20 flex flex-col gap-4" onSubmit={handleSubmit}>
          <XSvg className='w-24 lg:hidden fill-white' />

          <h1 className="text-4xl font-extrabold text-white">Join today.</h1>

          {/* Sign up form here */}
        </form>

        <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
          <p className="text-white text-lg">Already have an account?</p>

          <Link to="/signin">
            <button className="btn btn-primary btn-outline rounded-full w-full text-white">Sign in</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
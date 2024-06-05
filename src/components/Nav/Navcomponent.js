import React from "react";
import Logo from "../image/Logo.png";
import { Link } from "react-router-dom";

const Navcomponent = () => {
  return (
    <div className="flex sticky backdrop-blur-md top-0 justify-between item-center gap-10 max-h-[100px] mt-2  py-2 max-md:hidden">
      <div>
        <img
          className="ml-[70px] w-[180px] max-h-[180px]"
          src={Logo}
          alt="Logo"
        />
      </div>
      <div className="flex self-center gap-8 mr-[50px]">
        <Link className="text-md font-medium" to="/">
          Home
        </Link>

        <Link className="text-md font-medium" to="/">
          My Will
        </Link>
        <Link className="text-md font-medium" to="/">
          Blog
        </Link>
        <Link className="text-md font-medium" to="/">
          FAQs
        </Link>

        <Link className="text-md font-medium" to="/">
          Logout
        </Link>
      </div>
    </div>
  );
};

export default Navcomponent;

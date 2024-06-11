import React from "react";
import Logo from "../image/Logo.png";
import Avtar from "../image/background.jpg";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@com/ui/dropdown-menu";
import { Button } from "@com/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@com/ui/avatar";
const Navcomponent = () => {
  const getItem = localStorage.getItem("user");
  const user = JSON.parse(getItem);

  return (
    <div className="z-50 flex sticky backdrop-blur-md top-0 justify-between item-center gap-10 max-h-[300px] mt-2  py-2 max-md:hidden border-b border-gray-200 shadow-md">
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <img src={Avtar} />
                <AvatarFallback>
                  <img
                    src={Avtar}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-medium p-2">
              {user.data.user.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOutIcon className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navcomponent;

function LogOutIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

function UserIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

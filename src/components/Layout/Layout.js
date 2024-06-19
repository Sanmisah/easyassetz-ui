import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import PersonalDetails from "@/components/Personaldetail/PersonalDetail";
import BeneficiaryDetails from "@/components/Beneficiarydetails/Benificiarydetails";
import Logo from "../image/Logo.png";
import Hamburger from "../image/hamburger.svg";
import Insurance from "@/components/Insurance/Lifeinsurance/LifeInsurance";
import InsuranceMainForm from "@/components/Insurance/InsuranceMainForm";
import InsuranceForm from "@/components/Insurance/Lifeinsurance/InsuranceForm";
import EditInsuranceForm from "@/components/Insurance/Lifeinsurance/EditInsuranceForm";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@com/ui/sheet";
import MotorForm from "@/components/Insurance/MotorInsurance/MotorForm";
import EditMotorForm from "@/components/Insurance/MotorInsurance/EditMotorForm";
import MotorInsurance from "@/components/Insurance/MotorInsurance/MotorInsurance";
import OtherInsurance from "@/components/Insurance/Otherinsurance/OtherInsurance";
import OtherForm from "@/components/Insurance/Otherinsurance/OtherForm";
import EditOtherForm from "@/components/Insurance/Otherinsurance/EditOtherForm";

const Layout = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col md:grid md:grid-cols-[300px_1fr] gap-8 p-2 sm:p-8 md:p-12 lg:p-16">
      <div className="flex flex-col">
        <div className="flex item-center space-x-[40%] justify-center max-h-[100px] mr-6 ml-8">
          <img
            src={Logo}
            alt="Logo"
            className="w-[200px] max-h-[100px] max-md:block hidden"
          />
          <img
            className="max-md:block hidden self-center ml-[10%] mr-2 w-[30px] h-[30px] cursor-pointer align-self-center justify-self-end"
            src={Hamburger}
            alt="Hamburger"
            onClick={toggle}
          />
        </div>
        <nav id="layout" className="space-y-4 ml-2 mt-4 max-md:hidden">
          <NavLink
            prefetch="true"
            activeClassName="active"
            className="flex items-center gap-2 rounded-md  px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200 focus:bg-gray-200 focus:outline-none dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:bg-gray-700 aria-[current=page]:bg-[#069bb3] aria-[current=page]:text-white"
            to="/personal"
          >
            <UserIcon className="h-5 w-5" />
            Personal Details
          </NavLink>
          <NavLink
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:hover:bg-gray-800 dark:focus:bg-gray-800 aria-[current=page]:bg-[#069bb3] aria-[current=page]:text-white"
            to="/benificiary"
          >
            <HandHelpingIcon className="h-5 w-5" />
            Beneficiary Details
          </NavLink>

          <NavLink
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:hover:bg-gray-800 dark:focus:bg-gray-800 aria-[current=page]:bg-[#069bb3] aria-[current=page]:text-white"
            to="/insurance"
          >
            <UserIcon className="h-5 w-5" />
            Insurance
          </NavLink>
        </nav>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle></SheetTitle>
              <SheetDescription>
                <nav className="space-y-4">
                  <img src={Logo} alt="Logo" width="190" height="100" />
                  <NavLink
                    className="flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200 focus:bg-gray-200 focus:outline-none dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                    to="/personal"
                  >
                    <UserIcon className="h-5 w-5" />
                    Personal Details
                  </NavLink>
                  <NavLink
                    className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:hover:bg-gray-800 dark:focus:bg-gray-800"
                    to="/benificiary"
                  >
                    <HandHelpingIcon className="h-5 w-5" />
                    Beneficiary Details
                  </NavLink>
                  <NavLink
                    className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:hover:bg-gray-800 dark:focus:bg-gray-800"
                    to="/nomination"
                  >
                    <UserIcon className="h-5 w-5" />
                    Nomination Module
                  </NavLink>
                  <NavLink
                    className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:hover:bg-gray-800 dark:focus:bg-gray-800"
                    to="#"
                  >
                    <HomeIcon className="h-5 w-5" />
                    Financial assets
                  </NavLink>
                </nav>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>

      {/* Conditionally render content based on location */}
      {location.pathname === "/personal" && <PersonalDetails />}
      {location.pathname === "/benificiary" && <BeneficiaryDetails />}
      {location.pathname === "/insurance" && <InsuranceMainForm />}
      {location.pathname === "/lifeinsurance" && <Insurance />}
      {location.pathname === "/lifeinsurance/add" && <InsuranceForm />}
      {location.pathname === "/lifeinsurance/edit" && <EditInsuranceForm />}
      {location.pathname === "/motorinsurance" && <MotorInsurance />}
      {location.pathname === "/motorinsurance/add" && <MotorForm />}
      {location.pathname === "/motorinsurance/edit" && <EditMotorForm />}
      {location.pathname === "/otherinsurance" && <OtherInsurance />}
      {location.pathname === "/otherinsurance/add" && <OtherForm />}
      {location.pathname === "/otherinsurance/edit" && <EditOtherForm />}
    </div>
  );
};

export default Layout;

function HandHelpingIcon(props) {
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
      <path d="M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14" />
      <path d="m7 18 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
      <path d="m2 13 6 6" />
    </svg>
  );
}

function HomeIcon(props) {
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
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function SettingsIcon(props) {
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
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
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

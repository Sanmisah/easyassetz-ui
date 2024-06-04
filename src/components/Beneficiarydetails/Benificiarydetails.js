import React from "react";
import { Button } from "@/shadcncomponents/ui/button";
import Sheetbenificiary from "./Sheetbenificiary";
import Benificairyform from "./Benificiaryform";
import Charitysheet from "./Charitysheet";
const Benificiarydetails = () => {
  const [Sheetopen, setsheetopen] = React.useState(false);
  const [benficiaryopen, setbenficiaryopen] = React.useState(false);
  const [charityopen, setcharityopen] = React.useState(false);
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold">Benificiary Details</h1>
      <p>
        Add your family members or friends who may have a role to play in your
        Will.PS: Don't worry about filling in all the details if you are at the
        start of your Will journey. You can always come back and add more people
        or edit and add any information.
      </p>
      <div>
        <div className="mt-4 ml-2 flex items-center">
          <Button
            onClick={() => setbenficiaryopen(true)}
            className=" flex gap-4"
            variant="ghost"
          >
            <UserIcon className="w-5 h-5" />
            Add Benificiary
          </Button>
        </div>
        <div className="mt-2 ml-2 flex items-center">
          <Button
            onClick={() => setcharityopen(true)}
            className="flex gap-4"
            variant="ghost"
          >
            <HomeIcon className="w-5 h-5" />
            Add Charity
          </Button>
        </div>
      </div>
      {Sheetopen && (
        <Sheetbenificiary
          setbenficiaryopen={setbenficiaryopen}
          setcharityopen={setcharityopen}
          Sheetopen={Sheetopen}
          setsheetopen={setsheetopen}
        />
      )}
      {benficiaryopen && (
        <Benificairyform
          benficiaryopen={benficiaryopen}
          setbenficiaryopen={setbenficiaryopen}
        />
      )}
      {charityopen && (
        <Charitysheet
          charityopen={charityopen}
          setcharityopen={setcharityopen}
        />
      )}
    </div>
  );
};

export default Benificiarydetails;

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

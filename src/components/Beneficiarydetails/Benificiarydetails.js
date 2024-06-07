import React, { useState } from "react";
import { Button } from "@/shadcncomponents/ui/button";
import Sheetbenificiary from "./Sheetbenificiary";
import Benificairyform from "./Benificiaryform";
import { MoreHorizontal } from "lucide-react";
import Charitysheet from "./Charitysheet";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@com/ui/dropdown-menu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const Benificiarydetails = () => {
  const [Sheetopen, setsheetopen] = useState(false);
  const [benficiaryopen, setbenficiaryopen] = useState(false);
  const [charityopen, setcharityopen] = useState(false);
  const [benificiaryData, setBenificiaryData] = useState([]);
  const queryClient = useQueryClient();

  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);

  const getBenificiaryData = async () => {
    if (!user) return;
    const response = await axios.get(
      `http://127.0.0.1:8000/api/beneficiaries`,
      {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      }
    );
    setBenificiaryData(response.data.data.Beneficiary);

    return response.data.data.Beneficiary;
  };
  const query = useQuery({
    queryKey: ["benificiaryData"],
    queryFn: getBenificiaryData,
    onSuccess: () => {},
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile");
    },
  });
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold">Benificiary Details</h1>
      <p>
        Add your family members or friends who may have a role to play in your
        Will.PS: Don't worry about filling in all the details if you are at the
        start of your Will journey. You can always come back and add more people
        or edit and add any information.
      </p>
      {benificiaryData.map((data) => (
        <div className="flex border border-input p-4 justify-between pl-2 pr-2 items-center rounded-md drop-shadow-md">
          <div className="flex flex-col items-center ml-8">
            <h1 className="font-bold">{data?.fullLegalName}</h1>
            <p className="text-sm">{data?.relationship}</p>
          </div>
          <div className="flex items-center mr-8">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-haspopup="true" size="icon" variant="ghost">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
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

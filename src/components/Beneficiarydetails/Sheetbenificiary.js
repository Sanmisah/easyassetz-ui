import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@com/ui/sheet";
import { Button } from "@/shadcncomponents/ui/button";

const Sheetbenificiary = ({
  setcharityopen,
  setbenficiaryopen,
  Sheetopen,
  setsheetopen,
}) => {
  return (
    <div>
      <Sheet open={Sheetopen} onOpenChange={setsheetopen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add a person or charity</SheetTitle>
            <SheetDescription className="flex flex-col justify-center ">
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
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Sheetbenificiary;

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

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
      <Button variant="outline" onClick={() => setsheetopen(!Sheetopen)}>
        Open
      </Button>
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

import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@com/ui/sheet";
import { Button } from "@com/ui/button";
import { Label } from "@com/ui/label";
import { Checkbox } from "@com/ui/checkbox";
import axios from "axios";

const AddNominee = ({ setSelectedNommie }) => {
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const [nominees, setNominees] = useState([]);
  const [selectedNominees, setSelectedNominees] = useState([]);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/beneficiaries`, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setNominees(res?.data?.Beneficiaries);
      });
  }, []);

  const handleCheckboxChange = (id) => {
    setSelectedNominees((prevSelectedNominees) =>
      prevSelectedNominees.includes(id)
        ? prevSelectedNominees.filter((nomineeId) => nomineeId !== id)
        : [...prevSelectedNominees, id]
    );
  };

  const handlesubmit = () => {
    setSelectedNommie(selectedNominees);
    console.log(selectedNominees);
  };
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <div className="cursor-pointer flex border border-input bg-background p-4 justify-between pl-2 pr-2 items-center rounded-lg">
            <h1 className="ml-2 font-bold">Add Nominee</h1>
          </div>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add Nominee</SheetTitle>
            <SheetDescription>
              <p>Select nominee to add to your insurance policy</p>
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            {nominees &&
              nominees?.map((nominee) => (
                <div
                  key={nominee.id}
                  className="flex space-y-2 border border-input p-4 justify-between pl-4 pr-4 items-center rounded-lg"
                >
                  <Label htmlFor={`nominee-${nominee?.id}`}>
                    {nominee?.name}
                  </Label>
                  <Checkbox
                    id={`nominee-${nominee?.id}`}
                    checked={selectedNominees.includes(nominee?.id)}
                    onCheckedChange={() => handleCheckboxChange(nominee?.id)}
                  />
                </div>
              ))}
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button onClick={handlesubmit} type="submit">
                Save changes
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AddNominee;

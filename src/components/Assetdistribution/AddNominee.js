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
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AddNominee = ({
  setSelectedNommie,
  setDisplaynominie,
  displaynominie,
}) => {
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const [nominees, setNominees] = useState([]);
  const [selectedNominees, setSelectedNominees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/beneficiaries`, {
        headers: {
          Authorization: `Bearer ${user?.data?.token}`,
        },
      })
      .then((res) => {
        console.log(res?.data);
        if (res?.data?.data?.Beneficiaries?.length < 1) {
          toast.warning("please add beneficiary first");
          return;
        }
        setNominees({
          Beneficiaries: res?.data?.data?.Beneficiaries,
          Charities: res?.data?.data?.Charities,
        });
      });
  }, []);

  const addNominee = () => {
    navigate("/benificiary");
  };

  useEffect(() => {
    // Sync state with displaynominie when it changes
    const selectedIds = displaynominie.map((nominee) => nominee.id);
    setSelectedNominees(selectedIds);
  }, [displaynominie]);

  const handleCheckboxChange = (
    id,
    fullLegalName,
    charityName,
    relationship
  ) => {
    setSelectedNominees((prevSelectedNominees) =>
      prevSelectedNominees.includes(id)
        ? prevSelectedNominees.filter((nomineeId) => nomineeId !== id)
        : [...prevSelectedNominees, id]
    );

    if (fullLegalName) {
      setDisplaynominie((prevDisplayNominees) =>
        prevDisplayNominees.some((nominee) => nominee.id === id)
          ? prevDisplayNominees.filter((nominee) => nominee.id !== id)
          : [...prevDisplayNominees, { id, fullLegalName, relationship }]
      );
    } else if (charityName) {
      setDisplaynominie((prevDisplayNominees) =>
        prevDisplayNominees.some((nominee) => nominee.id === id)
          ? prevDisplayNominees.filter((nominee) => nominee.id !== id)
          : [...prevDisplayNominees, { id, charityName }]
      );
    }
  };

  const handleSubmit = () => {
    setSelectedNommie(selectedNominees);
    console.log(selectedNominees);
  };

  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <div className="cursor-pointer flex border border-input bg-background p-4 justify-between pl-2 pr-2 items-center rounded-lg">
            <h1 className="ml-2 font-bold underline">Add More People</h1>
          </div>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>My People</SheetTitle>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            {nominees.Beneficiaries?.map((nominee) => (
              <div
                key={nominee.id}
                className="flex space-y-2 border border-input p-4 justify-between pl-4 pr-4 items-center rounded-lg"
              >
                <Label htmlFor={`nominee-${nominee.id}`}>
                  {nominee.fullLegalName}
                </Label>
                <Checkbox
                  id={`nominee-${nominee.id}`}
                  checked={selectedNominees.includes(nominee.id)}
                  onCheckedChange={() =>
                    handleCheckboxChange(
                      nominee.id,
                      nominee.fullLegalName,
                      null,
                      nominee.relationship
                    )
                  }
                />
              </div>
            ))}

            {nominees.Charities?.map((nominee) => (
              <div
                key={nominee.id}
                className="flex space-y-2 border border-input p-4 justify-between pl-4 pr-4 items-center rounded-lg"
              >
                <Label htmlFor={`nominee-${nominee.id}`}>
                  {nominee.charityName}
                </Label>
                <Checkbox
                  id={`nominee-${nominee.id}`}
                  checked={selectedNominees.includes(nominee.id)}
                  onCheckedChange={() =>
                    handleCheckboxChange(nominee.id, null, nominee.charityName)
                  }
                />
              </div>
            ))}
          </div>
          <SheetFooter>
            <Button onClick={addNominee}>Add Nominee</Button>
            <SheetClose asChild>
              <Button
                onClick={handleSubmit}
                type="submit"
                className="bg-green-500 text-white hover:bg-green-600"
              >
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

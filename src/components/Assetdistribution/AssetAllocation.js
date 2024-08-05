import React, { useState, useEffect, useRef } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@com/ui/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@com/ui/accordion";
import { Button } from "@com/ui/button";
import axios from "axios";
import cross from "@/components/image/close.png";
import lifeInsurance from "@/components/image/LifeInsurance.png";
import { Label } from "@com/ui/label";
import { Switch } from "@com/ui/switch";
import { Input } from "@/shadcncomponents/ui/input";
import AddNominee from "./AddNominee";
import { toast } from "sonner";

const AssetAllocation = () => {
  const [displaynominie, setDisplaynominie] = useState([]);
  const [selectedNommie, setSelectedNommie] = useState([]);
  const [totalsplit, setTotalsplit] = useState([]);
  const [Selectedsplit, setSelectedsplit] = useState(false);
  const inputRefs = useRef([]);
  let totalPercentage = 100;

  useEffect(() => {
    const response = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);
      try {
        const response = await axios.get(`/api/beneficiaries`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        // setDisplaynominie(response?.data?.data?.Beneficiaries);
      } catch (error) {
        console.error("Error fetching nominees:", error);
      }
    };
    response();
  }, []);

  function splitPercentage() {
    const numberOfPeople = selectedNommie.length;
    if (numberOfPeople <= 0) {
      return;
    }

    let share = totalPercentage / numberOfPeople;
    let result = Array(numberOfPeople).fill(share);

    // Adjust the last person's share to ensure the total percentage is accurate
    let sum = result.reduce((acc, val) => acc + val, 0);
    result[numberOfPeople - 1] += totalPercentage - sum;

    return result.map((v) => parseFloat(v).toFixed(2));
  }

  useEffect(() => {
    if (Selectedsplit) {
      const result = splitPercentage();
      selectedNommie.forEach((_, index) => {
        if (inputRefs.current[index]) {
          inputRefs.current[index].value = result[index];
        }
      });
      setTotalsplit(result);
    } else {
      setTotalsplit([]);
      selectedNommie.forEach((_, index) => {
        if (inputRefs.current[index]) {
          inputRefs.current[index].value = "";
        }
      });
    }
  }, [Selectedsplit, selectedNommie]);

  const handleInputChange = (index, value) => {
    const newTotalsplit = [...totalsplit];
    newTotalsplit[index] = value;
    setTotalsplit(newTotalsplit);
  };

  const handleSubmit = async () => {
    const sumOfPercentages = totalsplit.reduce(
      (acc, value) => acc + parseFloat(value),
      0
    );

    if (sumOfPercentages > 100) {
      toast.error("Sum of percentages must be less than or equal to 100");
      return;
    }
    totalsplit.forEach((value, index) => {
      if (value === "") {
        toast.error("Please fill in all fields");
        return;
      }
    });

    const data = displaynominie.map((nominee, index) => ({
      nomineeId: nominee.id,
      percentage: totalsplit[index] || 0,
    }));
    // Send data to backend
    try {
      await axios.post("/api/submit", data);
      console.log("Data submitted successfully");
    } catch (error) {
      console.error("Error submitting data", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2 rounded-md  px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200 focus:bg-gray-200 focus:outline-none dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:bg-gray-700 h-10 w-full">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/assetdistribution">
                Asset Distribution
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Selected Distribution</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div>
        <Accordion
          type="single"
          collapsible
          className="w-full mt-4 border border-input bg-background p-4 justify-between pl-4 pr-4 items-center rounded-md drop-shadow-md"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className="p-2   p-4 justify-between pl-4 pr-4 items-center rounded-md ">
              <div className="flex items-center gap-2 rounded-md    text-sm font-medium           h-10 w-full">
                <img src={lifeInsurance} className="w-6 ml-2" />
                <h1 className="text-xl font-bold ml-2">Other asset</h1>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2  mt-8">
                <div className="flex flex-col gap-4 col-span-full border-b-2 border-input min-h-[150px] ">
                  <div className="flex  p-4 gap-4   pl-2 pr-2 items-center rounded-lg col-span-full">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <h1 className="font-bold  text-lg ">Firt Asset</h1>
                  </div>
                  <div className="flex flex-col   pl-2 pr-2 items-start rounded-lg col-span-full mb-2">
                    <div className="flex gap-2 ml-6 ">
                      <h1 className="font-semibold text-[1rem]">1.</h1>
                      <h1 className="font-semibold text-[1rem]">Abdc23a</h1>
                    </div>{" "}
                    <div>
                      <p className="ml-2 text-md ml-10">Asda</p>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <h1 className="text-2xl font-bold">
          Select the asset you want to distribute
        </h1>
        <div>
          <div className="flex flex-col gap-4 mt-4  p-4 ">
            {selectedNommie.length > 1 && (
              <div className="flex items-center space-x-2  justify-end ">
                <Label htmlFor="airplane-mode">Split Equally</Label>
                <Button onClick={setSelectedsplit}>Split Equally</Button>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between gap-2 mt-2 mb-4">
                <Label>My people</Label>
                <Label>Will Recieve</Label>
              </div>

              {displaynominie && displaynominie.length > 0 && (
                <div className="space-y-2">
                  <div className="grid gap-4 py-4">
                    {displaynominie.map((nominee, index) => (
                      <div
                        className="flex items-center justify-between gap-2 mt-2 border-b-2 border-input pb-4"
                        key={nominee.id}
                      >
                        <div className="flex flex-col ">
                          <Label className="text-md font-bold">
                            {nominee?.fullLegalName || nominee?.charityName}
                          </Label>
                          <Label className="text-sm font-medium text-gray-500">
                            {nominee?.relationship}
                          </Label>
                        </div>
                        <div className="flex items-center gap-2 ">
                          <Input
                            ref={(el) => (inputRefs.current[index] = el)}
                            className="w-[5rem] placeholder:align-right"
                            placeholder="%"
                            onChange={(e) =>
                              handleInputChange(index, e.target.value)
                            }
                          />
                          <Button
                            onClick={() => {
                              setDisplaynominie(
                                displaynominie.filter(
                                  (item) => item.id !== nominee.id
                                )
                              );
                              setSelectedNommie(
                                selectedNommie.filter(
                                  (item) => item.id !== nominee.id
                                )
                              );
                              inputRefs.current.splice(index, 1);
                              setTotalsplit((prev) =>
                                prev.filter((_, i) => i !== index)
                              );
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4">
            <AddNominee
              setDisplaynominie={setDisplaynominie}
              setSelectedNommie={setSelectedNommie}
              displaynominie={displaynominie}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  );
};

export default AssetAllocation;

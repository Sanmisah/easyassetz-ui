import React from "react";
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
import { Label } from "@com/ui/label";
import { Button } from "@com/ui/button";
import lifeInsurance from "@/components/image/LifeInsurance.png";
import { useSelector } from "react-redux";
import axios from "axios";
import { setLevel } from "@/Redux/sessionSlice";
const Summery = () => {
  const { level } = useSelector((state) => state.counterSlice);
  const User = localStorage.getItem("user");
  const user = JSON.parse(User);
  const { BenificiaryAllocation } = useSelector((state) => state.counterSlice);
  const ArrayToSubmit = BenificiaryAllocation.Benificiaries.map((data) => ({
    beneficiary_id: data.nomineeId,
    asset_id: BenificiaryAllocation.SelectedAsset.assets[0].totalAssets[0].id,
    asset_type: BenificiaryAllocation.SelectedAsset.assetName,
    level: level,
    allocation: data.percentage,
  }));
  const handleSubmit = async () => {
    const response = await axios.post(`/api/will/allocate`, ArrayToSubmit, {
      headers: {
        Authorization: `Bearer ${user.data.token}`,
      },
    });
    console.log("Response:", response.data);
  };
  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/assetdistribution">
                Asset Distribution
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/assetdistribution">
                Selected Distribution
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>Confirmation</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <h1 className="text-xl font-bold">Your Beneficiaries</h1>
        <div className="flex flex-col gap-4 mt-4 p-4 border-2 border-gray-100">
          {BenificiaryAllocation.Benificiaries &&
            BenificiaryAllocation.Benificiaries.map((data, index) => (
              <div className="flex items-center justify-between gap-2 rounded-md  px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200 focus:bg-gray-200 focus:outline-none dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:bg-gray-700 min-h-10 w-full pb-6 border-b-2">
                <div className="flex items-center gap-2 ">
                  <div className="w-8 h-8 rounded-full bg-[#0097b0]"></div>
                  <div className="flex flex-col">
                    <Label>{data.fullLegalName}</Label>
                    <Label>{data.relationship}</Label>
                  </div>
                </div>
                <div>
                  <p>Recieves</p>
                  <h1 className="self-right text-right ">{data.percentage}%</h1>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div>
        <h1 className="text-xl font-bold">Will Recieve Following Assets</h1>
        <div>
          <Accordion
            type="single"
            collapsible
            className="w-full mt-4 border border-input bg-background p-4 justify-between pl-4 pr-4 items-center rounded-md drop-shadow-md"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="p-2   p-4 justify-between pl-4 pr-4 items-center rounded-md ">
                <div className="flex items-center gap-2 rounded-md    text-sm font-medium           h-10 w-full">
                  <h1 className="text-xl font-bold ml-2">
                    {BenificiaryAllocation.SelectedAsset.assetName}
                  </h1>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4">
                {BenificiaryAllocation.SelectedAsset.assets &&
                  BenificiaryAllocation.SelectedAsset.assets.map(
                    (data, index) => (
                      <div className="grid grid-cols-1 md:grid-cols-2 ">
                        <div className="flex flex-col gap-4 col-span-full border-b-2 border-input min-h-[150px] ">
                          <div className="flex  p-4 gap-4   pl-2 pr-2 items-center rounded-lg col-span-full">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <h1 className="font-bold  text-lg ">{data.name}</h1>
                          </div>
                          {data.totalAssets.map((asset, index) => (
                            <div className="flex flex justify-between  pl-2 pr-2 items-center rounded-lg col-span-full mb-2">
                              <div className="flex flex-col">
                                <div className="flex gap-2  ">
                                  <h1 className="font-medium text-[1rem]">
                                    {index + 1}.
                                  </h1>
                                  <h1 className="font-semibold text-[1rem]">
                                    {asset.var1}
                                  </h1>
                                </div>{" "}
                                <div>
                                  <p className="ml-2 text-md ml-[1rem] text-light-gray">
                                    {asset?.var2}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  );
};

export default Summery;

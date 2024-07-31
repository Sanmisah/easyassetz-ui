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

const Summery = () => {
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
          <div className="flex items-center justify-between gap-2 rounded-md  px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200 focus:bg-gray-200 focus:outline-none dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:bg-gray-700 min-h-10 w-full pb-6 border-b-2">
            <div className="flex items-center gap-2 ">
              <div className="w-8 h-8 rounded-full bg-[#0097b0]"></div>
              <div className="flex flex-col">
                <Label>Vishal</Label>
                <Label>Spose</Label>
              </div>
            </div>
            <div>
              <p>Recieves</p>
              <h1 className="self-right text-right ">40%</h1>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 rounded-md  px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200 focus:bg-gray-200 focus:outline-none dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:bg-gray-700 min-h-10 w-full pb-6 border-b-2">
            <div className="flex items-center gap-2 ">
              <div className="w-8 h-8 rounded-full bg-[#0097b0]"></div>
              <div className="flex flex-col">
                <Label>Vishal</Label>
                <Label>Spose</Label>
              </div>
            </div>
            <div>
              <p>Recieves</p>
              <h1 className="self-right text-right ">40%</h1>
            </div>
          </div>
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
                  <h1 className="text-xl font-bold ml-2">Other asset</h1>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 ">
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
      </div>
    </div>
  );
};

export default Summery;

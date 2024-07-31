import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@com/ui/accordion";

const Accordation = () => {
  return (
    <div>
      {Allassets.map((data, index) => (
        <Accordion
          type="single"
          collapsible
          className="w-full mt-4 border border-input bg-background p-4 justify-between pl-4 pr-4 items-center rounded-md drop-shadow-md"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className="p-2   p-4 justify-between pl-4 pr-4 items-center rounded-md ">
              <div className="flex items-center gap-2 rounded-md    text-sm font-medium           h-10 w-full">
                <img src={lifeInsurance} className="w-6 ml-2" />
                <h1 className="text-xl font-bold ml-2">{data.assetName}</h1>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2  mt-4">
                {data.assets.map((asset, index) => (
                  <div className="flex flex-col gap-4 col-span-full border-b-2 border-input min-h-[150px]">
                    <div className="flex  p-4 gap-4   pl-2 pr-2 items-center rounded-lg col-span-full">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <h1 className="font-bold  text-lg ">{asset.name}</h1>
                    </div>
                    {asset?.totalAssets?.map((asset, index) => (
                      <div className="flex flex-col   pl-2 pr-2 items-start rounded-lg col-span-full mb-2">
                        <div className="flex gap-2 ml-6 ">
                          <h1 className="font-semibold text-[1rem]">
                            {index + 1}.
                          </h1>
                          <h1 className="font-semibold text-[1rem]">
                            {console.log(asset)}
                            {asset.registrationNumber}
                          </h1>
                        </div>{" "}
                        <div>
                          <p className="ml-2 text-md ml-10">
                            {asset?.vehicleType}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
};

export default Accordation;

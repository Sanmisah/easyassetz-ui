import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@com/ui/accordion";
import axios from "axios";
import cross from "@/components/image/close.png";
import lifeInsurance from "@/components/image/LifeInsurance.png";

const AssetDistribution = () => {
  const [otherassets, setOtherassets] = useState([]);
  useEffect(() => {
    const fetchDataVehicle = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/other-assets`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setOtherassets(response?.data?.data);
      } catch (error) {
        console.error("Error fetching  data", error);
      }
    };
    fetchDataVehicle();
  }, []);

  useEffect(() => {
    console.log(otherassets);
  }, [otherassets]);

  const Allassets = [
    {
      assetName: "Other Assets",
      assets: [
        {
          name: "vehicles",
          totalAssets: otherassets?.Vehicle?.map((vehicle) => ({
            var1: vehicle.registrationNumber,
            var2: vehicle.vehicleType,
            data: vehicle,
          })),
        },
        {
          name: "jewellery",
          totalAssets: otherassets?.Jewellery?.map((jewellery) => ({
            var1: jewellery.registrationNumber,
            var2: jewellery.jewelleryType,
            data: jewellery,
          })),
        },
        {
          name: "watches",
          totalAssets: otherassets?.Watch?.map((watch) => ({
            var1: watch.registrationNumber,
            var2: watch.watchType,
            data: watch,
          })),
        },
        {
          name: "artifacts",
          totalAssets: otherassets?.Artifacts?.map((artifact) => ({
            var1: artifact.registrationNumber,
            var2: artifact.artifactType,
            data: artifact,
          })),
        },
        {
          name: "huf",
          totalAssets: otherassets?.HUF?.map((huf) => ({
            var1: huf.hufName,
            var2: huf.hufType,
            data: huf,
          })),
        },
        {
          name: "recoverable",
          totalAssets: otherassets?.Recoverable?.map((recoverable) => ({
            var1: recoverable.registrationNumber,
            var2: recoverable.recoverableType,
            data: recoverable,
          })),
        },
        {
          name: "otherAssets",
          totalAssets: otherassets?.OtherAsset?.map((otherAsset) => ({
            var1: otherAsset.registrationNumber,
            var2: otherAsset.otherAssetType,
            data: otherAsset,
          })),
        },
        {
          name: "watch",
          totalAssets: otherassets?.Watch?.map((watch) => ({
            var1: watch.registrationNumber,
            var2: watch.watchType,
            data: watch,
          })),
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200 focus:bg-gray-200 focus:outline-none dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:bg-gray-700 h-10 w-full">
        <h1 className="text-2xl font-bold ">Asset Distribution</h1>
      </div>
      <div className="flex items-center gap-4 py-2   ">
        <div className="min-w-[100px] min-h-[70px] flex flex-col items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:border-input dark:bg-background dark:hover:bg-gray-800 dark:focus:bg-gray-800 h-10 w-full">
          <h1>Asset Distribution</h1>
          <p className="text-green-500">Complete</p>
        </div>
        <div className="min-w-[100px] min-h-[70px] flex flex-col items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:border-input dark:bg-background dark:hover:bg-gray-800 dark:focus:bg-gray-800 h-10 w-full">
          <h1>Asset Distribution</h1>
          <p className="text-green-500">Complete</p>
        </div>
        <div className="min-w-[100px] min-h-[70px] flex flex-col items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:border-input dark:bg-background dark:hover:bg-gray-800 dark:focus:bg-gray-800 h-10 w-full">
          <h1>Asset Distribution</h1>
          <p className="text-green-500">Complete</p>
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold">
          Select the asset you want to distribute
        </h1>
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
                                {asset.var1}
                              </h1>
                            </div>{" "}
                            <div>
                              <p className="ml-2 text-md ml-10">
                                {asset?.var2}
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
      </div>
    </div>
  );
};

export default AssetDistribution;

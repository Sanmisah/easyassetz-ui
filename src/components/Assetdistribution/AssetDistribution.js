import React, { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedAsset,
  setLevel,
  setSubSelectedAsset,
} from "@/Redux/sessionSlice";
import { useLocation } from "react-router-dom";

const AssetDistribution = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { level } = useSelector((state) => state.counterSlice);
  const { SelectedAsset } = useSelector((state) => state.counterSlice);
  const location = useLocation();
  const [otherassets, setOtherassets] = useState([]);
  const [CurrentAsset, setCurrentAsset] = useState([]);
  useEffect(() => {
    const fetchDataVehicle = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/assets`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        console.log("data", response?.data);
        setOtherassets(response?.data);
      } catch (error) {
        console.error("Error fetching  data", error);
      }
    };
    fetchDataVehicle();
  }, []);
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  useEffect(() => {
    console.log(otherassets);
  }, [otherassets]);

  useEffect(() => {
    if (otherassets) {
      setOtherassets(otherassets);
    }
  }, [otherassets]);

  // useEffect(() => {
  //   if (location.pathname === "/assetdistribution/Primary") {
  //     dispatch(setLevel("Primary"));
  //   }
  //   if (location.pathname === "/assetdistribution/Secondary") {
  //     dispatch(setLevel("Secondary"));
  //   }
  //   if (location.pathname === "/assetdistribution/Tertiary") {
  //     dispatch(setLevel("Tertiary"));
  //   }
  // }, [location.pathname]);

  // const handleSelect = (asset) => {
  //   dispatch(setSubSelectedAsset(asset));
  //   console.log(asset);
  //   if (asset.primary === false) {
  //     dispatch(setLevel("Primary"));
  //   }
  //   if (asset.primary === true && asset.secondary === false) {
  //     dispatch(setLevel("Secondary"));
  //   }
  //   if (
  //     asset.primary === true &&
  //     asset.secondary === true &&
  //     asset.tertiary === false
  //   ) {
  //     dispatch(setLevel("Tertiary"));
  //   }
  //   navigate("/assetallocation");
  // };
  return (
    <div className="flex flex-col gap-4 space-y-4">
      <div className="flex items-center gap-2 rounded-md  px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200 focus:bg-gray-200 focus:outline-none dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:bg-gray-700 h-10 w-full">
        <h1 className="text-2xl font-bold ">Asset Distribution</h1>
      </div>

      <div>
        <h1 className="text-2xl font-bold">
          Select the asset you want to distribute
        </h1>
        <div>
          {otherassets &&
            otherassets?.map((data, index) => (
              <Accordion
                type="single"
                collapsible
                className="w-full mt-4  bg-background p-4 justify-between pl-4 pr-4 items-center rounded-md drop-shadow-md"
                onClick={() => {
                  dispatch(setSelectedAsset(data));
                }}
              >
                <AccordionItem value="item-1">
                  <AccordionTrigger className="p-2   p-4 justify-between pl-4 pr-4 items-center rounded-md ">
                    <div className="flex items-center gap-2 rounded-md    text-sm font-medium           h-10 w-full">
                      <img src={lifeInsurance} className="w-6 ml-2" />
                      <h1 className="text-xl font-bold ml-2">
                        {capitalizeFirstLetter(data.assetName)}
                      </h1>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2  mt-4">
                      {data?.assets &&
                        data?.assets?.map((asset, index) => (
                          <div className="flex flex-col gap-4 col-span-full border-b-2 border-input min-h-[150px]">
                            <div className="flex  p-4 gap-4   pl-2 pr-2 items-center rounded-lg col-span-full">
                              <div className="w-2 h-2 bg-[#0097b0] "></div>
                              <h1 className="font-bold  text-lg ">
                                {capitalizeFirstLetter(asset.name)}
                              </h1>
                            </div>
                            {asset &&
                              asset?.totalAssets?.map((asset, index) => (
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
                                  <div className="flex items-center justify-center gap-2 ">
                                    {/* <Button onClick={() => handleSelect(asset)}>
                                      Distribute
                                    </Button> */}
                                    <Button
                                      onClick={() => {
                                        dispatch(setLevel("Primary"));
                                        navigate("/assetallocation");
                                      }}
                                    >
                                      Primary
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        dispatch(setLevel("Secondary"));

                                        navigate("/assetallocation");
                                      }}
                                    >
                                      Secondary
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        dispatch(setLevel("Tertiary"));
                                        navigate("/assetallocation");
                                      }}
                                    >
                                      Tertiary
                                    </Button>
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

import React, { useEffect, useState } from "react";
import lifeInsurance from "../image/LifeInsurance.png";
import { useNavigate } from "react-router-dom";
import { Button } from "@com/ui/button";
import axios from "axios";
import cross from "@/components/image/close.png";

const OtherAssetsMainForm = () => {
  const [VehicleDetails, setVehicleDetails] = useState([]);
  const [HUF, setHUF] = useState([]);
  const [IntellectualProperty, setIntellectualProperty] = useState([]);
  const [Jewellery, setJewellery] = useState([]);
  const [Artifacts, setArtifacts] = useState([]);
  const [Watch, setWatch] = useState([]);
  const [DigitalAssets, setDigitalAssets] = useState([]);
  const [OtherAssets, setOtherAssets] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataVehicheDetails = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/other-assets`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setVehicleDetails(response?.data?.data?.Vehicle);
      } catch (error) {
        console.error("Error fetching the Vehicle details data", error);
      }
    };
    const fetchDataHUF = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/other-assets`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setHUF(response?.data?.data?.HUF);
      } catch (error) {
        console.error("Error fetching the HUF data", error);
      }
    };
    const fetchDataJewellery = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/other-assets`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setJewellery(response?.data?.data?.Jewellery);
      } catch (error) {
        console.error("Error fetching the Jewellery data", error);
      }
    };
    const fetchDataWatch = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/other-assets`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setWatch(response?.data?.data?.Watch);
      } catch (error) {
        console.error("Error fetching the Watch data", error);
      }
    };
    const fetchDataArtifacts = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/other-assets`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setArtifacts(response?.data?.data?.Artifacts);
      } catch (error) {
        console.error("Error fetching the Artifacts data", error);
      }
    };

    const fetchDataDigitalAssets = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);
      try {
        const response = await axios.get(`/api/other-assets`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setDigitalAssets(response?.data?.data?.DigitalAssets);
      } catch (error) {
        console.error("Error fetching the Digital Assets data", error);
      }
    };
    

    const fetchDataOtherAssets = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);
    try {
      const response = await axios.get(`/api/other-assets`, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });
      setOtherAssets(response?.data?.data?.OtherAssets);
    } catch (error) {
      console.error("Error fetching the Other Assets data", error);
    };
  };

    fetchDataWatch();
    fetchDataHUF();
    fetchDataJewellery();
    fetchDataVehicheDetails();
    fetchDataArtifacts();
    fetchDataDigitalAssets();
    fetchDataOtherAssets();
  }, []);

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">Other Assets</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Fill out the form to add a new Other Asset.
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-4">
        <div
          onClick={() => navigate("/vehicle")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Vehicle Details </h1>
            {VehicleDetails && VehicleDetails?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {VehicleDetails && VehicleDetails?.length} Vehicle Details
                </p>
              </div>
            )}
          </div>
        </div>

        <div
          onMouseDown={() => navigate("/huf")}
          className=" cursor-pointer flex items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold"> HUF Details </h1>
            {HUF && HUF?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {HUF?.length} HUF Details
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onMouseDown={() => navigate("/jewellery")}
          className="flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold"> Jewellery</h1>
            {Jewellery && Jewellery?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {Jewellery && Jewellery?.length} Jewellery
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onClick={() => navigate("/watch")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Watch</h1>
            {Watch && Watch?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {Watch && Watch?.length}{" "}
                  Watch
                </p>
              </div>
            )}
          </div>
        </div>

        <div
          onClick={() => navigate("/artifacts")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Artifacts</h1>
            {Artifacts && Artifacts?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {Artifacts && Artifacts?.length}{" "}
                  Artifacts
                </p>
              </div>
            )}
          </div>
        </div>

        <div
          onClick={() => navigate("/digital-assets")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Digital Assets</h1>
            {DigitalAssets && DigitalAssets?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {DigitalAssets && DigitalAssets?.length}{" "}
                  Digital Assets
                </p>
              </div>
            )}
         </div>
        </div>

        <div
          onClick={() => navigate("/other-asset")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold"> Other Assets</h1>
            {OtherAssets && OtherAssets?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {OtherAssets && OtherAssets?.length}{" "}
                  Other Assets
                </p>
              </div>
            )}
         </div>
        </div>

        <div
          onClick={() => navigate("/recoverable")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold"> Recoverable</h1>
            {Artifacts && Artifacts?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {Artifacts && Artifacts?.length}{" "}
                  Recoverable
                </p>
              </div>
            )}
         </div>
        </div>


        </div>
        </div>
  );
};

export default OtherAssetsMainForm;
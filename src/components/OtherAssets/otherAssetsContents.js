import React, { useEffect, useState } from "react";
import lifeInsurance from "../image/LifeInsurance.png";
import { useNavigate } from "react-router-dom";
import { Button } from "@com/ui/button";
import axios from "axios";

const OtherAssetsContentForm = () => {
  const [vehicleData, setVehicleData] = useState([]);
  const [hufData, setHufData] = useState([]);
  const [jewelleryData, setJewelleryData] = useState([]);
  const [watchData, setWatchData] = useState([]);
  const [artifactsData, setArtifactsData] = useState([]);
  const [otherAssetData, setOtherAssetData] = useState([]);
  const [recoverableData, setRecoverableData] = useState([]);

  const navigate = useNavigate();

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
        setVehicleData(response?.data?.data?.Vehicle);
      } catch (error) {
        console.error("Error fetching  data", error);
      }
    };
    const fetchDataHuf = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/other-assets`, {
          headers: {
            Authorization: `Bearer ${user?.data?.token}`,
          },
        });
        setHufData(response?.data?.data?.HUF);
      } catch (error) {
        console.error("Error fetching  data", error);
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
        setJewelleryData(response?.data?.data?.Jewellery);
      } catch (error) {
        console.error("Error fetching data", error);
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
        setWatchData(response?.data?.data?.Watch);
      } catch (error) {
        console.error("Error fetching data", error);
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
        setArtifactsData(response?.data?.data?.Artifacts);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    const fetchDataOtherAsset = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/other-assets`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setOtherAssetData(response?.data?.data?.OtherAsset);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    const fetchDataRecoverable = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/other-assets`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setRecoverableData(response?.data?.data?.Recoverable);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchDataVehicle();
    fetchDataHuf();
    fetchDataJewellery();
    fetchDataWatch();
    fetchDataArtifacts();
    fetchDataOtherAsset();
    fetchDataRecoverable();
  }, []);

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">Other Assets Form</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Fill out the form to add a new Other Assets Form.
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-4">
        <div
          onClick={() => navigate("/vehicle")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Vehicle</h1>
            {vehicleData && vehicleData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {vehicleData?.length && vehicleData?.length} Vehicle
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onClick={() => navigate("/huf")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">HUF</h1>
            {hufData && hufData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {hufData?.length && hufData?.length} HUF
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onMouseDown={() => navigate("/jwellery")}
          className=" cursor-pointer flex items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Jewellery</h1>
            {jewelleryData && jewelleryData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {jewelleryData && jewelleryData?.length} Jewellery
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onMouseDown={() => navigate("/watch")}
          className="flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Watch</h1>
            {watchData && watchData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {watchData && watchData?.length} Watch
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onMouseDown={() => navigate("/artifacts")}
          className="flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Artifacts</h1>
            {artifactsData && artifactsData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {artifactsData && artifactsData?.length} Artifacts
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
            <h1 className="text-xl font-bold">Other Asset</h1>
            {otherAssetData && otherAssetData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {otherAssetData && otherAssetData?.length} Other Asset
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
            <h1 className="text-xl font-bold">Recoverable</h1>
            {recoverableData && recoverableData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {recoverableData && recoverableData?.length} Recoverable
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherAssetsContentForm;

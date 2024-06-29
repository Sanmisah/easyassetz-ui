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
  const [Jewellery, setGeneralInsuranceData] = useState([]);
  const [HealthInsurance, setHealthInsuranceData] = useState([]);
  const [Artifacts, setArtifacts] = useState([]);

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
        VehicleDetails(response?.data?.data?.Vehicle);
      } catch (error) {
        console.error("Error fetching the Business Asset data", error);
      }
    };
    const fetchDataMotorinsurance = async () => {
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
        console.error("Error fetching the Business Asset data", error);
      }
    };
    const fetchDataOtherinsurance = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/other-insurances`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setIntellectualProperty(response?.data?.data?.MotorInsurances);
      } catch (error) {
        console.error("Error fetching the Business Asset data", error);
      }
    };
    const fetchDataGeneralinsurance = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/general-insurances`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setIntellectualProperty(response?.data?.data?.MotorInsurances);
      } catch (error) {
        console.error("Error fetching the Business Asset data", error);
      }
    };
    const fetchDataHealthinsurance = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/health-insurances`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setHealthInsuranceData(response?.data?.data?.HealthInsurances);
      } catch (error) {
        console.error("Error fetching the Business Asset data", error);
      }
    };
    fetchDataGeneralinsurance();
    fetchDataHealthinsurance();
    fetchDataOtherinsurance();
    fetchDataVehicheDetails();
    fetchDataMotorinsurance();
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
          onMouseDown={() => navigate("/company")}
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
          onClick={() => navigate("/intellectualproperty")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Watch</h1>
            {IntellectualProperty && IntellectualProperty?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {IntellectualProperty && IntellectualProperty?.length}{" "}
                  Watch
                </p>
              </div>
            )}
          </div>
        </div>

        <div
          onClick={() => navigate("/intellectualproperty")}
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
      </div>
    </div>
  );
};

export default OtherAssetsMainForm;

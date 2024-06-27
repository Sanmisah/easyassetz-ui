import React, { useEffect, useState } from "react";
import lifeInsurance from "../image/LifeInsurance.png";
import { useNavigate } from "react-router-dom";
import { Button } from "@com/ui/button";
import axios from "axios";
import cross from "@/components/image/close.png";

const BusinessAssetsMainForm = () => {
  const [lifeInsuranceData, setLifeInsuranceData] = useState([]);
  const [Propritorship, setPropritorship] = useState([]);
  const [IntellectualProperty, setIntellectualProperty] = useState([]);
  const [GeneralInsurance, setGeneralInsuranceData] = useState([]);
  const [HealthInsurance, setHealthInsuranceData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataLifeinsurance = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/life-insurances`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setLifeInsuranceData(response?.data?.data?.LifeInsurances);
      } catch (error) {
        console.error("Error fetching the Business Asset data", error);
      }
    };
    const fetchDataMotorinsurance = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/motor-insurances`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setPropritorship(response?.data?.data?.OtherInsurance);
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
    fetchDataLifeinsurance();
    fetchDataMotorinsurance();
  }, []);

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">Business Asset</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Fill out the form to add a new Business Asset.
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-4">
        <div
          onClick={() => navigate("/propritership")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Propritorship </h1>
            {Propritorship && Propritorship?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {Propritorship && Propritorship?.length} Propritorship
                </p>
              </div>
            )}
          </div>
        </div>

        <div
          onMouseDown={() => navigate("/partnershipfirm")}
          className=" cursor-pointer flex items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold"> Partnership Firm</h1>
            {lifeInsuranceData && lifeInsuranceData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {lifeInsuranceData?.length} Partnership Firm
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
            <h1 className="text-xl font-bold"> Company</h1>
            {GeneralInsurance && GeneralInsurance?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {GeneralInsurance && GeneralInsurance?.length} Company
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
            <h1 className="text-xl font-bold"> Intellectual Property (IP)</h1>
            {IntellectualProperty && IntellectualProperty?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {IntellectualProperty && IntellectualProperty?.length}{" "}
                  Intellectual Property
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessAssetsMainForm;

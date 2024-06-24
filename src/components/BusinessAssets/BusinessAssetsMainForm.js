import React, { useEffect, useState } from "react";
import lifeInsurance from "../image/LifeInsurance.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BusinessAssetsMainForm = () => {
  const [lifeInsuranceData, setLifeInsuranceData] = useState([]);
  const [motorInsuranceData, setMotorInsuranceData] = useState([]);
  const [otherInsuranceData, setOtherInsuranceData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataLifeinsurance = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/lifeinsurances`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setLifeInsuranceData(response?.data?.data?.LifeInsurances);
      } catch (error) {
        console.error("Error fetching life insurance data", error);
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
        setMotorInsuranceData(response?.data?.data?.MotorInsurances);
      } catch (error) {
        console.error("Error fetching motor insurance data", error);
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
        setOtherInsuranceData(response?.data?.data?.OtherInsurances);
      } catch (error) {
        console.error("Error fetching other insurance data", error);
      }
    };

    fetchDataLifeinsurance();
    fetchDataMotorinsurance();
    fetchDataOtherinsurance();
  }, []);

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">Business Assets</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Fill out the form to add a new Business Assets.
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-4">
        {/* Business Investment Section */}
        <div
          onClick={() => navigate("/businessinvestment")}
          className="flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" alt="icon" />
          <div className="flex items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Business Investments</h1>
            <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
              <p className="text-green-500 self-center dark:text-green-800">
                {motorInsuranceData.length} Business Investments
              </p>
            </div>
          </div>
        </div>

        {/* Company Section */}
        <div
          onClick={() => navigate("/healthinsurance")}
          className="flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" alt="icon" />
          <h1 className="text-xl font-bold">Company</h1>
          <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
              <p className="text-green-500 self-center dark:text-green-800">
                {lifeInsuranceData.length} Company
              </p>
            </div>
        </div>
      

        {/* Intellectual Property Section */}
        <div
          onClick={() => navigate("/lifeinsurance")}
          className="cursor-pointer flex items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" alt="icon" />
          <div className="flex items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Intellectual Property (IP)</h1>
            <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
              <p className="text-green-500 self-center dark:text-green-800">
                {lifeInsuranceData.length} Intellectual Property (IP)
              </p>
            </div>
          </div>
        </div>

        {/* Partnership Firm Section */}
        <div
          onClick={() => navigate("/otherinsurance")}
          className="flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" alt="icon" />
          <div className="flex items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Partnership Firm</h1>
            <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
              <p className="text-green-500 self-center dark:text-green-800">
                {otherInsuranceData.length} Partnership Firm
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessAssetsMainForm;
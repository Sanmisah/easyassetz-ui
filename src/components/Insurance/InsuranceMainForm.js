import React, { useEffect, useState } from "react";
import lifeInsurance from "../image/LifeInsurance.png";
import { useNavigate } from "react-router-dom";
import { Button } from "@com/ui/button";
import axios from "axios";

const InsuranceMainForm = () => {
  const [lifeInsuranceData, setLifeInsuranceData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/lifeinsurances`,
          {
            headers: {
              Authorization: `Bearer ${user.data.token}`,
            },
          }
        );
        setLifeInsuranceData(response?.data?.data?.LifeInsurances);
      } catch (error) {
        console.error("Error fetching life insurance data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">Insurance Main Form</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Fill out the form to add a new insurance policy.
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-4">
        <div className="w-[70%] flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg">
          <img src={lifeInsurance} className="w-6 ml-2" />
          <h1 className="text-xl font-bold">Motor Insurance</h1>
        </div>
        <div className="w-[70%] flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg">
          <img src={lifeInsurance} className="w-6 ml-2" />
          <h1 className="text-xl font-bold">Health Insurance</h1>
        </div>
        <div
          onMouseDown={() => navigate("/lifeinsurance")}
          className="w-[70%] cursor-pointer flex items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Life Insurance</h1>
            <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
              <p className="text-green-500 self-center dark:text-green-800 ">
                {lifeInsuranceData?.length} Insurance Policies
              </p>
            </div>
          </div>
        </div>
        <div className="w-[70%] flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg">
          <img src={lifeInsurance} className="w-6 ml-2" />
          <h1 className="text-xl font-bold">General Insurance</h1>
        </div>
        <div className="w-[70%] flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg">
          <img src={lifeInsurance} className="w-6 ml-2" />
          <h1 className="text-xl font-bold">Other Insurance</h1>
        </div>
      </div>
    </div>
  );
};

export default InsuranceMainForm;

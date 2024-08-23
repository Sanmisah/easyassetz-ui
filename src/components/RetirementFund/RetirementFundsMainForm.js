import React, { useEffect, useState } from "react";
import lifeInsurance from "../image/LifeInsurance.png";
import { useNavigate } from "react-router-dom";
import { Button } from "@com/ui/button";
import axios from "axios";

const RetirementFundMainForm = () => {
  const [publicProvidendFundData, setPublicProvidendFundData] = useState([]);
  const [providendFundData, setProvidendFundData] = useState([]);
  const [NPSData, setNPSData] = useState([]);
  const [GratuityData, setGratuityData] = useState([]);
  const [superAnnuation, setSuperAnnuation] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataPublicProvidendFund = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/public-provident-funds`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setPublicProvidendFundData(response?.data?.data?.PublicProvidentFund);
      } catch (error) {
        console.error("Error fetching Public Providend Fund data", error);
      }
    };
    const fetchDataProvidendFund = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/provident-funds`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setProvidendFundData(response?.data?.data?.ProvidentFund);
      } catch (error) {
        console.error("Error fetching Providend Fund data", error);
      }
    };
    const fetchDataNPS = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/nps`, {
          headers: {
            Authorization: `Bearer ${user?.data?.token}`,
          },
        });
        setNPSData(response?.data?.data?.NPS);
      } catch (error) {
        console.error("Error fetching NPS data", error);
      }
    };
    const fetchDataGratuity = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/gratuities`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setGratuityData(response?.data?.data?.Gratuity);
      } catch (error) {
        console.error("Error fetching Gratuity data", error);
      }
    };

    const fetchDataSuperAnnuation = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/super-annuations`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setSuperAnnuation(response?.data?.data?.SuperAnnuation);
      } catch (error) {
        console.error("Error fetching Super Annuation data", error);
      }
    };
    fetchDataPublicProvidendFund();
    fetchDataProvidendFund();
    fetchDataNPS();
    fetchDataGratuity();
    fetchDataSuperAnnuation();
  }, []);

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">Retirement Fund Main Form</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Fill out the forms to add a new Retirement Fund.
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-4">
        <div
          onClick={() => navigate("/ppf")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Public Providend Fund</h1>
            {publicProvidendFundData && publicProvidendFundData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {publicProvidendFundData?.length &&
                    publicProvidendFundData?.length}{" "}
                  Public Providend Funds
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onClick={() => navigate("/providentfund")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Providend Fund</h1>
            {providendFundData && providendFundData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {providendFundData?.length && providendFundData?.length}{" "}
                  Providend Funds
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onMouseDown={() => navigate("/nps")}
          className=" cursor-pointer flex items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">NPS</h1>
            {NPSData && NPSData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {NPSData?.length && NPSData?.length} NPS
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onMouseDown={() => navigate("/gratuity")}
          className="flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Gratuity</h1>
            {GratuityData && GratuityData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {GratuityData && GratuityData?.length} Gratuity
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onClick={() => navigate("/superannuation")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Super Annuation</h1>
            {superAnnuation && superAnnuation?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {superAnnuation && superAnnuation?.length} Super Annuation
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetirementFundMainForm;

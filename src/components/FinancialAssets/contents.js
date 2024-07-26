import React, { useEffect, useState } from "react";
import lifeInsurance from "../image/LifeInsurance.png";
import { useNavigate } from "react-router-dom";
import { Button } from "@com/ui/button";
import axios from "axios";

const FinancialAssetsContentForm = () => {
  const [shareDetailsData, setShareDetailsData] = useState([]);
  const [mutualFundsData, setMutualFundsData] = useState([]);
  const [debenturesData, setDebenturesData] = useState([]);
  const [bondData, setBondData] = useState([]);
  const [ESOPData, setESOPData] = useState([]);
  const [otherDematAccountData, setOtherDematAccountData] = useState([]);
  const [otherWealthAccountData, setOtherWealthAccountData] = useState([]);
  const [otherBrokingAccountData, setOtherBrokingAccountData] = useState([]);
  const [otherAIFData, setOtherAIFData] = useState([]);
  const [otherPMSData, setOtherPMSData] = useState([]);
  const [otherOFAData, setOtherOFAData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataShareDetails = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/share-details`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setShareDetailsData(response?.data?.data?.ShareDetail);
      } catch (error) {
        console.error("Error fetching share details data", error);
      }
    };
    const fetchDataMutualFunds = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/mutual-funds`, {
          headers: {
            Authorization: `Bearer ${user?.data?.token}`,
          },
        });
        setMutualFundsData(response?.data?.data?.MutualFund);
      } catch (error) {
        console.error("Error fetching Mutual Fund data", error);
      }
    };
    const fetchDataDebentures = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/debentures`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setDebenturesData(response?.data?.data?.Debenture);
      } catch (error) {
        console.error("Error fetching Debenture data", error);
      }
    };
    const fetchDataBond = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/bonds`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setBondData(response?.data?.data?.Bond);
      } catch (error) {
        console.error("Error fetching Bond data", error);
      }
    };
    const fetchDataESOP = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/esops`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setESOPData(response?.data?.data?.ESOP);
      } catch (error) {
        console.error("Error fetching ESOP data", error);
      }
    };
    const fetchDataDematAccount = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/demat-accounts`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setOtherDematAccountData(response?.data?.data?.DematAccount);
      } catch (error) {
        console.error("Error fetching Demat Account data", error);
      }
    };
    const fetchDataWealthAccount = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/wealth-management-accounts`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setOtherWealthAccountData(
          response?.data?.data?.WealthManagementAccount
        );
      } catch (error) {
        console.error("Error fetching Demat Account data", error);
      }
    };
    const fetchDataBrokingAccount = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/broking-accounts`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setOtherBrokingAccountData(response?.data?.data?.BrokingAccount);
      } catch (error) {
        console.error("Error fetching Broking Account data", error);
      }
    };
    const fetchDataAIF = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/alternate-investment-funds`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setOtherAIFData(response?.data?.data?.InvestmentFund);
      } catch (error) {
        console.error("Error fetching Alternate Investment Fund data", error);
      }
    };
    const fetchDataPMS = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/portfolio-managements`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setOtherPMSData(response?.data?.data?.PortfolioManagement);
      } catch (error) {
        console.error("Error fetching Alternate Investment Fund data", error);
      }
    };
    const fetchDataOFA = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/other-financial-assets`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setOtherOFAData(response?.data?.data?.OtherFinancialAsset);
      } catch (error) {
        console.error("Error fetching Other Financial Asset data", error);
      }
    };
    fetchDataShareDetails();
    fetchDataMutualFunds();
    fetchDataDebentures();
    fetchDataBond();
    fetchDataESOP();
    fetchDataDematAccount();
    fetchDataWealthAccount();
    fetchDataBrokingAccount();
    fetchDataAIF();
    fetchDataPMS();
    fetchDataOFA();
  }, []);

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">Financial Assets Form</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Fill out the form to add a new Financial Assets Form.
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-4">
        <div
          onClick={() => navigate("/share-details")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Share Details</h1>
            {shareDetailsData && shareDetailsData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {shareDetailsData?.length && shareDetailsData?.length} Shares
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onClick={() => navigate("/mutualfunds")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Mutual Funds</h1>
            {mutualFundsData && mutualFundsData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {mutualFundsData?.length && mutualFundsData?.length} Mutual
                  Funds
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onMouseDown={() => navigate("/debentures")}
          className=" cursor-pointer flex items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Debentures</h1>
            {debenturesData && debenturesData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {debenturesData && debenturesData?.length} Debentures
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onMouseDown={() => navigate("/bond")}
          className="flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Bond</h1>
            {bondData && bondData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {bondData && bondData?.length} Bond
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onMouseDown={() => navigate("/esop")}
          className="flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">ESOP</h1>
            {ESOPData && ESOPData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {ESOPData && ESOPData?.length} ESOP
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onClick={() => navigate("/demataccounts")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Demat Account</h1>
            {otherDematAccountData && otherDematAccountData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {otherDematAccountData && otherDematAccountData?.length} Demat
                  Account
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onClick={() => navigate("/wealth-account")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Wealth Management Account</h1>
            {otherWealthAccountData && otherWealthAccountData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {otherWealthAccountData && otherWealthAccountData?.length}{" "}
                  Wealth Management Account
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onClick={() => navigate("/broking-account")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Broking Account</h1>
            {otherBrokingAccountData && otherBrokingAccountData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {otherBrokingAccountData && otherBrokingAccountData?.length}{" "}
                  Broking Account
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onClick={() => navigate("/aif")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Alternate Investment Fund</h1>
            {otherAIFData && otherAIFData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {otherAIFData && otherAIFData?.length} Alternate Investment
                  Fund
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onClick={() => navigate("/pms")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Portfolio Management Services</h1>
            {otherPMSData && otherPMSData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {otherPMSData && otherPMSData?.length} Portfolio Management
                  Services
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onClick={() => navigate("/ofa")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Other Financial Asset</h1>
            {otherOFAData && otherOFAData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {otherOFAData && otherOFAData?.length} Other Financial Asset
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialAssetsContentForm;

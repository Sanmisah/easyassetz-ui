import React, { useEffect, useState } from "react";
import lifeInsurance from "../image/LifeInsurance.png";
import { useNavigate } from "react-router-dom";
import { Button } from "@com/ui/button";
import axios from "axios";

const FinancialAssetsContentForm = () => {
  const [shareDetailsData, setShareDetailsData] = useState([]);
  const [fixDepositData, setFixDepositData] = useState([]);
  const [bankLockerData, setBankLockerData] = useState([]);
  const [psadData, setPsadData] = useState([]);
  const [pssData, setPssData] = useState([]);
  const [otherDepositData, setOtherDepositData] = useState([]);

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
    const fetchDataFixDeposit = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/fix-deposits`, {
          headers: {
            Authorization: `Bearer ${user?.data?.token}`,
          },
        });
        setFixDepositData(response?.data?.data?.FixDeposite);
      } catch (error) {
        console.error("Error fetching fix deposit data", error);
      }
    };
    const fetchDataBankLocker = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/bank-lockers`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setBankLockerData(response?.data?.data?.BankLocker);
      } catch (error) {
        console.error("Error fetching Bank Locker data", error);
      }
    };
    const fetchDataPsad = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/post-saving-account-details`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setPsadData(response?.data?.data?.PostalSavingAccount);
      } catch (error) {
        console.error("Error fetching Post Saving Account Details data", error);
      }
    };
    const fetchDataPss = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/post-saving-schemes`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setPssData(response?.data?.data?.PostSavingScheme);
      } catch (error) {
        console.error("Error fetching Post Saving Scheme data", error);
      }
    };
    const fetchDataOtherDeposit = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/other-deposites`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setOtherDepositData(response?.data?.data?.OtherDeposite);
      } catch (error) {
        console.error("Error fetching Other Deposit data", error);
      }
    };
    fetchDataFixDeposit();
    fetchDataBankLocker();
    fetchDataPsad();
    fetchDataPss();
    fetchDataOtherDeposit();
    fetchDataShareDetails();
  }, []);

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">Bank & Post Form</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Fill out the form to add a new Bank & Post Form.
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
          onClick={() => navigate("/#")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Mutual Funds</h1>
            {fixDepositData && fixDepositData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {fixDepositData?.length && fixDepositData?.length} Mutual
                  Funds
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onMouseDown={() => navigate("/#")}
          className=" cursor-pointer flex items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Debentures</h1>
            {bankLockerData && bankLockerData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {bankLockerData && bankLockerData?.length} Debentures
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onMouseDown={() => navigate("/#")}
          className="flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Bond</h1>
            {psadData && psadData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {psadData && psadData?.length} Bond
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onMouseDown={() => navigate("/#")}
          className="flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">ESOP</h1>
            {pssData && pssData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {pssData && pssData?.length} ESOP
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onClick={() => navigate("/#")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Demant Account</h1>
            {otherDepositData && otherDepositData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {otherDepositData && otherDepositData?.length} Demant Account
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onClick={() => navigate("/#")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Wealth Management Account</h1>
            {otherDepositData && otherDepositData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {otherDepositData && otherDepositData?.length} Wealth
                  Management Account
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onClick={() => navigate("/#")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Broking Account</h1>
            {otherDepositData && otherDepositData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {otherDepositData && otherDepositData?.length} Broking Account
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onClick={() => navigate("/#")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Alternate Investment Fund</h1>
            {otherDepositData && otherDepositData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {otherDepositData && otherDepositData?.length} Alternate
                  Investment Fund
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onClick={() => navigate("/#")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Portfolio Management Services</h1>
            {otherDepositData && otherDepositData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {otherDepositData && otherDepositData?.length} Portfolio
                  Management Services
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onClick={() => navigate("/#")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Other Financial Asset</h1>
            {otherDepositData && otherDepositData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {otherDepositData && otherDepositData?.length} Other Financial
                  Asset
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

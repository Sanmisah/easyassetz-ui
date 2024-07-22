import React, { useEffect, useState } from "react";
import lifeInsurance from "../image/LifeInsurance.png";
import { useNavigate } from "react-router-dom";
import { Button } from "@com/ui/button";
import axios from "axios";

const BankContentForm = () => {
  const [bankAccountData, setBankAccountData] = useState([]);
  const [fixDepositData, setFixDepositData] = useState([]);
  const [bankLockerData, setBankLockerData] = useState([]);
  const [psadData, setPsadData] = useState([]);
  const [pssData, setPssData] = useState([]);
  const [otherDepositData, setOtherDepositData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataBankAccount = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/bank-accounts`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setBankAccountData(response?.data?.data?.BankAccount);
      } catch (error) {
        console.error("Error fetching bank account data", error);
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
    fetchDataBankAccount();
    fetchDataFixDeposit();
    fetchDataBankLocker();
    fetchDataPsad();
    fetchDataPss();
    fetchDataOtherDeposit();
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
          onClick={() => navigate("/bankaccount")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Bank Account</h1>
            {bankAccountData && bankAccountData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {bankAccountData?.length && bankAccountData?.length} Bank
                  Accounts
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onClick={() => navigate("/fixdeposit")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Fix Deposit</h1>
            {fixDepositData && fixDepositData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {fixDepositData?.length && fixDepositData?.length} Fix
                  Deposits
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onMouseDown={() => navigate("/banklocker")}
          className=" cursor-pointer flex items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Bank Locker</h1>
            {bankLockerData && bankLockerData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {bankLockerData && bankLockerData?.length} Bank Lockers
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onMouseDown={() => navigate("/psad")}
          className="flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Postal Saving Account Details</h1>
            {psadData && psadData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {psadData && psadData?.length} Post Saving Account Details
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onMouseDown={() => navigate("/pss")}
          className="flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Post Saving Scheme</h1>
            {pssData && pssData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {pssData && pssData?.length} Post Saving Schemes
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          onClick={() => navigate("/other-deposits")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Other Deposit</h1>
            {otherDepositData && otherDepositData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {otherDepositData && otherDepositData?.length} Other Deposits
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankContentForm;

import React, { useEffect, useState } from "react";
import lifeInsurance from "../image/LifeInsurance.png";
import { useNavigate } from "react-router-dom";
import { Button } from "@com/ui/button";
import axios from "axios";

const DigitalAssetsMainForm = () => {
  const [lifeInsuranceData, setLifeInsuranceData] = useState([]);
  const [cryptoData, setCryptoData] = useState([]);
  const [digitalAsset, setDigitalAsset] = useState([]);
  const [motorInsuranceData, setMotorInsuranceData] = useState([]);
  const [otherInsuranceData, setOtherInsuranceData] = useState([]);
  const [GeneralInsurance, setGeneralInsuranceData] = useState([]);
  const [HealthInsurance, setHealthInsuranceData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataCrypto = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/cryptos`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setCryptoData(response?.data?.data?.Crypto);
      } catch (error) {
        console.error("Error fetching Crypto data", error);
      }
    };

    const fetchDigitalAsset = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);
      try {
        const response = await axios.get(`/api/digital-assets`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setDigitalAsset(response?.data?.data?.DigitalAsset);
      } catch (error) {
        console.error("Error fetching Digital Asset data", error);
      }
    };

    fetchDataCrypto();
    fetchDigitalAsset();
  }, []);

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">Digital Assets Main Form</h1>
        {/* <p className="text-gray-500 dark:text-gray-400">
          Fill out the form to add a new Digital Assets.
        </p> */}
      </div>
      <div className="mt-8 flex flex-col gap-4">
        <div
          onClick={() => navigate("/crypto")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Crypto</h1>
            {cryptoData && cryptoData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {cryptoData && cryptoData?.length} Crypto
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-4">
        <div
          onClick={() => navigate("/digital-assets")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Digital Assets</h1>
            {digitalAsset && digitalAsset?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {digitalAsset && digitalAsset?.length} Crypto
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalAssetsMainForm;

import React, { useEffect, useState } from "react";
import lifeInsurance from "../image/LifeInsurance.png";
import { useNavigate } from "react-router-dom";
import { Button } from "@com/ui/button";
import axios from "axios";

const BusinessAssetsMainForm = () => {
  const [PropritorshipData, setPropritorship] = useState([]);
  const [Partnership, setPartnership] = useState([]);
  const [Company, setCompany] = useState([]);
  const [IntellectualProperty, setIntellectualProperty] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPropritorship = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/business-assets`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setPropritorship(response?.data?.data?.Propritership);
      } catch (error) {
        console.error("Error fetching the Business Asset data", error);
      }
    };
    const fetchDataPartnership = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/business-assets`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setPartnership(response?.data?.data?.PartnershipFirm);
      } catch (error) {
        console.error("Error fetching the Business Asset data", error);
      }
    };
    const fetchDataCompany = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/business-assets`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setCompany(response?.data?.data?.Company);
      } catch (error) {
        console.error("Error fetching the Business Asset data", error);
      }
    };
    const fetchDataIntellectualProperty = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/business-assets`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setIntellectualProperty(response?.data?.data?.IntellectualProperty);
      } catch (error) {
        console.error("Error fetching the Business Asset data", error);
      }
    };
    fetchPropritorship();
    fetchDataPartnership();
    fetchDataCompany();
    fetchDataIntellectualProperty();
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
            {PropritorshipData && PropritorshipData?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {PropritorshipData && PropritorshipData?.length} Propritorship
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
            {Partnership && Partnership?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {Partnership && Partnership?.length} Partnership Firm
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
            {Company && Company?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {Company && Company?.length} Company
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

import React, { useEffect, useState } from "react";
import lifeInsurance from "../image/LifeInsurance.png";
import { useNavigate } from "react-router-dom";
import { Button } from "@com/ui/button";
import axios from "axios";

const ImmovableAssetsMainForm = () => {
  const [land, setLand] = useState([]);
  const [residentialProperty, setResidentialProperty] = useState([]);
  const [commercialProperty, setCommercialProperty] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataLand = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/lands`, {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        });
        setLand(response?.data?.data?.Land);
      } catch (error) {
        console.error("Error fetching Land data", error);
      }
    };
    const fetchDataResidentialProperty = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/residential-properties`, {
          headers: {
            Authorization: `Bearer ${user?.data?.token}`,
          },
        });
        setResidentialProperty(response?.data?.data?.ResidentialProperty);
      } catch (error) {
        console.error("Error fetching Residential Property data", error);
      }
    };
    const fetchDataCommercialProperty = async () => {
      const getitem = localStorage.getItem("user");
      const user = JSON.parse(getitem);

      try {
        const response = await axios.get(`/api/commercial-properties`, {
          headers: {
            Authorization: `Bearer ${user?.data?.token}`,
          },
        });
        setCommercialProperty(response?.data?.data?.CommercialProperty);
      } catch (error) {
        console.error("Error fetching Commercial Property data", error);
      }
    };

    fetchDataLand();
    fetchDataResidentialProperty();
    fetchDataCommercialProperty();
  }, []);

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">Immovable Assets Form</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Fill out the form to add a new Immovable Assets Form.
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-4">
        <div
          onClick={() => navigate("/land")}
          className=" flex cursor-pointer items-center gap-8 bg-gray-100 p-4 rounded-lg"
        >
          <img src={lifeInsurance} className="w-6 ml-2" />
          <div className="flex  items-center gap-2 justify-center">
            <h1 className="text-xl font-bold">Land</h1>
            {land && land?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {land?.length && land?.length} Land
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
            <h1 className="text-xl font-bold">Residential Property</h1>
            {residentialProperty && residentialProperty?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {residentialProperty?.length && residentialProperty?.length}{" "}
                  Fix Residential Property
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
            <h1 className="text-xl font-bold">Commercial Property </h1>
            {commercialProperty && commercialProperty?.length > 0 && (
              <div className="flex items-center gap-2 bg-green-200 p-2 rounded-[50px] ml-2 pl-4 pr-4">
                <p className="text-green-500 self-center dark:text-green-800 ">
                  {commercialProperty?.length && commercialProperty?.length}{" "}
                  Commercial Property
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImmovableAssetsMainForm;

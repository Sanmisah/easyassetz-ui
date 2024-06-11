import React from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@com/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@com/ui/dropdown-menu";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import Datepicker from "./../Beneficiarydetails/Datepicker";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  setlifeInsuranceEditId,
  setlifeInsuranceDeleteId,
} from "@/Redux/sessionSlice";
import { useDispatch } from "react-redux";

const LifeInsurance = () => {
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const getPersonalData = async () => {
    if (!user) return;
    const response = await axios.get(
      `http://127.0.0.1:8000/api/lifeinsurances`,
      {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      }
    );

    return response.data.data.LifeInsurance;
  };

  const {
    data: Benifyciary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["LifeInsuranceData"],
    queryFn: getPersonalData,

    onSuccess: (data) => {
      console.log("Data:", data);
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile", error.message);
    },
  });

  return (
    <div className="w-[100%] ">
      <div className="flex flex-col w-[100%] ">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Life Insurance</h1>
          <Button onMouseDown={() => navigate("/lifeinsurance/add")}>
            Add Life Insurance
          </Button>
        </div>
        <div className="w-[100%] grid grid-cols-1 md:grid-cols-1 gap-4 mt-8 ">
          {Benifyciary &&
            Benifyciary.map((data) => (
              <div
                key={data.id}
                className="flex border border-input p-4 justify-between pl-2 pr-2 items-center rounded-md drop-shadow-md"
              >
                <div className="flex flex-col  ml-8">
                  <h1 className="font-bold">{data.companyName}</h1>
                  <p className="text-sm">{data.insuranceSubType}</p>
                </div>
                <div className="flex items-center mr-8">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          console.log("data.id:", data.id);
                          dispatch(setlifeInsuranceEditId(data.id));
                          navigate("/lifeinsurance/edit");
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setlifeInsuranceDeleteId(data.id);
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LifeInsurance;

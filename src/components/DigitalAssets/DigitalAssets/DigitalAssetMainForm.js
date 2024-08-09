import React, { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@com/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@com/ui/dropdown-menu";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  setlifeInsuranceEditId,
  setlifeInsuranceDeleteId,
} from "@/Redux/sessionSlice";
import { useDispatch, useSelector } from "react-redux";
import DeleteAlert from "./ConfirmDelete";

const DigitalAssetsMainForm = () => {
  const [alertDialog, setAlertDialog] = useState(false);
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { lifeInsuranceDeleteId } = useSelector((state) => state.counterSlice);

  const getPersonalData = async () => {
    if (!user) return;
    const response = await axios.get(`/api/digital-assets`, {
      headers: {
        Authorization: `Bearer ${user.data.token}`,
      },
    });

    return response.data.data.DigitalAsset;
  };

  const {
    data: Benifyciary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["HeathinsuranceData"],
    queryFn: getPersonalData,

    onSuccess: (data) => {
      console.log("Data:", data);
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile", error.message);
    },
  });

  const confirmDelete = async (id) => {
    const response = await axios.delete(
      `/api/digital-assets/${lifeInsuranceDeleteId}`,
      {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      }
    );
    queryClient.invalidateQueries("LifeInsuranceData");
    toast.success("Digital Assets deleted successfully!");
  };

  return (
    <div className="w-[100%] bg-white">
      <div className="flex flex-col w-[100%] ">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Digital Assets</h1>
          <Button onMouseDown={() => navigate("/digitalassets/add")}>
            Add Digital Assets
          </Button>
          {alertDialog && (
            <DeleteAlert
              alertDialog={alertDialog}
              setAlertDialog={setAlertDialog}
              onConfirm={confirmDelete}
              onCancel={() => setAlertDialog(false)}
            />
          )}
        </div>
        <div className="w-[100%] grid grid-cols-1 md:grid-cols-1 gap-4 mt-8 ">
          {Benifyciary &&
            Benifyciary.map((data) => (
              <div
                key={data.id}
                className="flex border border-input p-4 justify-between pl-2 pr-2 items-center rounded-md drop-shadow-md"
              >
                <div className="flex flex-col  ml-8">
                  <h1 className="font-bold">{data.account}</h1>
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
                          navigate("/digitalassets/edit");
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setAlertDialog(true);
                          dispatch(setlifeInsuranceDeleteId(data.id));
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

export default DigitalAssetsMainForm;

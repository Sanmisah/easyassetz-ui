import React, { useEffect, useState, forwardRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@com/ui/card";
import { Label } from "@com/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@com/ui/select";
import { Button } from "@com/ui/button";
import { Input } from "@com/ui/input";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { PhoneInput } from "react-international-phone";
import Datepicker from "../../Beneficiarydetails/Datepicker";
import { RadioGroup, RadioGroupItem } from "@com/ui/radio-group";

const FocusableSelectTrigger = forwardRef((props, ref) => (
  <SelectTrigger ref={ref} {...props} />
));

const schema = z.object({
  jewelleryType: z.string().optional(),
  metal: z.string().optional(),
  otherMetal: z.string().optional(),
  preciousStone: z.string().optional(),
  otherPreciousStone: z.string().optional(),
  weightPerJewellery: z.string().optional(),
  quantity: z.string().optional(),
  additionalInformation: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  mobile: z.string().optional(),
});

const RecoverableOtherForm = () => {
  const navigate = useNavigate();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const queryClient = useQueryClient();
  const [fourWheelerStatus, setfourWheelerStatus] = useState(false);
  const [showOtherMetalType, setShowOtherMetalType] = useState(false);
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      vehicleType: "",
      fourWheeler: "",
      company: "",
      model: "",
      duration: "",
      yearOfManufacture: "",
      location: "",
    },
  });

  const loanMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(`/api/other-assets`, data, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });
      return response.data.data.Recoverable;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("LoanData");
      toast.success("Recoverable added successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error submitting loan:", error);
      toast.error("Failed to submit loan");
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    const date = new Date(data.yearOfManufacture);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    const newdate = `${month}/${day}/${year}`;
    data.yearOfManufacture = newdate;
    if (data.vehicleType === "other") {
      data.vehicleType = data.otherVehicleType;
    }
    if (data.fourWheeler === "other") {
      data.fourWheeler = data.otherFourWheeler;
    }
    data.type = "vehicle";
    loanMutate.mutate(data);
  };

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-2xl font-bold">Recoverable</CardTitle>
              <CardDescription>
                Fill out the form to add a new Recoverable.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <form
            className="space-y-6 flex flex-col"
            onSubmit={handleSubmit(onSubmit)}
          >
            <CardFooter className="flex justify-end gap-2 mt-8">
              <Button type="submit">Submit</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecoverableOtherForm;

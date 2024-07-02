import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { PhoneInput } from "react-international-phone";
import cross from "@/components/image/close.png";

const schema = z.object({
  firmName: z.string().nonempty({ message: "Firm Name is required" }),
  registeredAddress: z
    .string()
    .nonempty({ message: "Registration Address is required" }),
  firmRegistrationNumber: z.string().optional(),

  additionalInformation: z
    .string()
    .min(1, { message: "Additional Information is Required" }),
});

const PropritorshipEdit = ({ benificiaryId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const [showOtherMetalType, setShowOtherMetalType] = useState(false);
  const [showOtherArticleDetails, setShowOtherArticleDetails] = useState(false);
  const { lifeInsuranceEditId } = useSelector((state) => state.counterSlice);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setmobile] = useState();
  console.log(lifeInsuranceEditId);

  const [showOtherBullion, setShowOtherBullion] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {},
  });

  const getPersonalData = async () => {
    if (!user) return;
    const response = await axios.get(
      `/api/business-assets/${lifeInsuranceEditId}`,
      {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      }
    );
    let othertype = response.data.data.BusinessAsset?.firmName;
    let otherarticle = response.data.data.BusinessAsset?.registeredAddress;
    reset(data);

    return response.data.data.BusinessAsset;
  };

  const {
    data: Benifyciary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bullionDataUpdate", lifeInsuranceEditId],
    queryFn: getPersonalData,
    onSuccess: (data) => {
      if (data) {
        setDefaultValues(data);
        reset(data);
        setValue(data);

        console.log(data);
      }
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile", error.message);
    },
  });

  const bullionMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(
        `/api/business-assets/${lifeInsuranceEditId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      return response.data.data.BusinessAsset;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("BullionDataUpdate", lifeInsuranceEditId);
      toast.success("BusinessAsset added successfully!");
      navigate("/propritership");
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile");
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    data.type = "propritership";
    // if (!name && name !== "") {
    //   data.name = name;
    // }
    // if (!email && email !== "") {
    //   data.email = email;
    // }
    // if (!mobile && mobile !== "") {
    //   data.mobile = mobile;
    // }

    data.name = name;
    data.email = email;
    data.mobile = mobile;

    console.log("bullion:", data.bullion);
    if (data.firmName === "other") {
      data.firmName = data.otherFirmType;
    }

    bullionMutate.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading bullion data</div>;

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-2xl font-bold">
                Propritership Details
              </CardTitle>
              <CardDescription>
                Edit the form to update the propritorship details.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <form
            className="space-y-6 flex flex-col"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firmName"> Firm Name</Label>
                <Controller
                  name="firmName"
                  defaultValue={Benifyciary?.firmName}
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="firmName"
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherMetalType(value === "other");
                      }}
                      className={errors.firmName ? "border-red-500" : ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Firm Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="company1">company1</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.firmName && (
                  <span className="text-red-500">
                    {errors.firmName.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="registeredAddress">
                  {" "}
                  Registration Address{" "}
                </Label>
                <Controller
                  name="registeredAddress"
                  control={control}
                  defaultValue={Benifyciary?.registeredAddress || ""}
                  render={({ field }) => (
                    <Input
                      id="registeredAddress"
                      placeholder="Enter Address"
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                      className={
                        errors.registeredAddress ? "border-red-500" : ""
                      }
                      defaultValue={Benifyciary?.registeredAddress || ""}
                    />
                  )}
                />

                {errors.registeredAddress && (
                  <span className="text-red-500">
                    {errors.registeredAddress.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firmRegistrationNumber">
                  Firm Registration Number
                </Label>
                <Controller
                  name="firmRegistrationNumber"
                  control={control}
                  defaultValue={Benifyciary?.firmRegistrationNumber || ""}
                  render={({ field }) => (
                    <Select
                      id="firmRegistrationNumber"
                      value={field.value}
                      defaultValue={Benifyciary?.firmRegistrationNumber || ""}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherFirmsRegistrationNumber(value);
                      }}
                      className={
                        errors.firmRegistrationNumber ? "border-red-500" : ""
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Firm's Registration Number" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CIN">CIN</SelectItem>
                        <SelectItem value="PAN">PAN</SelectItem>
                        <SelectItem value="FIRM NO">FIRM NO</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.firmRegistrationNumber && (
                  <span className="text-red-500">
                    {errors.firmRegistrationNumber.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalInformation">
                  {" "}
                  Additional Information
                </Label>
                <Controller
                  name="additionalInformation"
                  control={control}
                  defaultValue={Benifyciary?.additionalInformation || ""}
                  render={({ field }) => (
                    <Input
                      id="additionalInformation"
                      placeholder="Enter Addtional Information"
                      {...field}
                      className={
                        errors.additionalInformation ? "border-red-500" : ""
                      }
                      defaultValue={Benifyciary?.additionalInformation || ""}
                    />
                  )}
                />
                {errors.additionalInformation && (
                  <span className="text-red-500">
                    {errors.additionalInformation.message}
                  </span>
                )}
              </div>
            </div>
            <div className="w-full grid grid-cols-1 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>

                <Input
                  id="name"
                  placeholder="Enter Name"
                  defaultValue={Benifyciary?.name || ""}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                {errors.name && (
                  <span className="text-red-500">{errors.name.message}</span>
                )}
              </div>
              <div className="w-[40%] space-y-2">
                <Label htmlFor="email">Email</Label>
                <Controller
                  name="email"
                  control={control}
                  defaultValue={Benifyciary?.email || ""}
                  render={({ field }) => (
                    <Input
                      id="email"
                      placeholder="Enter Email"
                      {...field}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={errors.email ? "border-red-500" : ""}
                      defaultValue={Benifyciary?.email || ""}
                    />
                  )}
                />
                {errors.email && (
                  <span className="text-red-500">{errors.email.message}</span>
                )}
              </div>
              <div className="w-[40%] space-y-2">
                <Label htmlFor="mobile">mobile</Label>
                <Controller
                  name="mobile"
                  control={control}
                  defaultValue={Benifyciary?.mobile || ""}
                  render={({ field }) => (
                    <PhoneInput
                      id="mobile"
                      type="tel"
                      placeholder="Enter mobile number"
                      defaultCountry="in"
                      inputStyle={{ minWidth: "15.5rem" }}
                      value={mobile}
                      onChange={(e) => setmobile(e.target)}
                      defaultValue={Benifyciary?.mobile || ""}
                    />
                  )}
                />
                {errors.mobile && (
                  <span className="text-red-500">{errors.mobile.message}</span>
                )}
              </div>
            </div>
            <CardFooter className="flex justify-end gap-2 mt-8">
              <Button type="submit">Submit</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropritorshipEdit;

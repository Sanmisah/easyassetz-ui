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
import EditNominiee from "./EditNominee";
import { PhoneInput } from "react-international-phone";

const schema = z.object({
  firmName: z.string().nonempty({ message: "Firm Name is required" }),
  otherFirmType: z.string().optional(),
  registeredAddress: z
    .string()
    .nonempty({ message: "Registration Address is required" }),
  firmRegistrationNumber: z
    .string()
    .nonempty({ message: "Registration Number is required" }),
  otherRegistrationNumber: z.string().optional(),
  holdingPercentage: z
    .string()
    .nonempty({ message: "Holding Percentage is required" }),
  nomination: z.boolean(),
  additionalInformation: z
    .string()
    .min(1, { message: "Additional Information is Required" }),
});

const PartnershipEdit = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const { lifeInsuranceEditId } = useSelector((state) => state.counterSlice);

  const [showOtherFirmType, setShowOtherFirmType] = useState(false);
  const [showOtherRegistrationNumber, setShowOtherRegistrationNumber] =
    useState(false);
  const [selectedNommie, setSelectedNommie] = useState([]);
  const [displaynominie, setDisplaynominie] = useState([]);

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {},
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
    return response.data.data.BusinessAsset;
  };

  const {
    data: Data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["partnershipDataUpdate", lifeInsuranceEditId],
    queryFn: getPersonalData,
    onSuccess: (data) => {
      reset(data);
      setValue(data);

      if (data.firmName === "other") {
        setShowOtherFirmType(true);
      }
      if (["CIN", "PAN", "FIRM NO"].includes(data.firmRegistrationNumber)) {
        setShowOtherRegistrationNumber(true);
      }
    },
    onError: (error) => {
      toast.error("Failed to fetch data", error.message);
    },
  });

  const mutateData = useMutation({
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
      queryClient.invalidateQueries(
        "partnershipDataUpdate",
        lifeInsuranceEditId
      );
      toast.success("Partnership details updated successfully!");
      navigate("/partnership");
    },
    onError: (error) => {
      toast.error("Failed to update data");
    },
  });

  const onSubmit = (data) => {
    data.nominee = selectedNommie;
    if (data.firmName === "other") {
      data.firmName = data.otherFirmType;
    }
    if (["CIN", "PAN", "FIRM NO"].includes(data.firmRegistrationNumber)) {
      data.firmRegistrationNumber = data.otherRegistrationNumber;
    }
    mutateData.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading partnership data</div>;

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-2xl font-bold">
                Partnership Details
              </CardTitle>
              <CardDescription>
                Edit the form to update the partnership details.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firmName">Firm Name</Label>
                <Controller
                  name="firmName"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="firmName"
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherFirmType(value === "other");
                      }}
                      className={errors.firmName ? "border-red-500" : ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Firm Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="company one">company one</SelectItem>
                        <SelectItem value="other">other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {showOtherFirmType && (
                  <Controller
                    name="otherFirmType"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Firm Type"
                        className="mt-2"
                      />
                    )}
                  />
                )}
                {errors.firmName && (
                  <span className="text-red-500">
                    {errors.firmName.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="registeredAddress">Registered Address</Label>
                <Controller
                  name="registeredAddress"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter Registered Address"
                      className={
                        errors.registeredAddress ? "border-red-500" : ""
                      }
                    />
                  )}
                />
                {errors.registeredAddress && (
                  <span className="text-red-500">
                    {errors.registeredAddress.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="firmRegistrationNumber">
                  Firm Registration Number
                </Label>
                <Controller
                  name="firmRegistrationNumber"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="firmRegistrationNumber"
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherRegistrationNumber(true);
                      }}
                      className={
                        errors.firmRegistrationNumber ? "border-red-500" : ""
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Registration Number" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CIN">CIN</SelectItem>
                        <SelectItem value="PAN">PAN</SelectItem>
                        <SelectItem value="FIRM NO">FIRM NO</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {showOtherRegistrationNumber && (
                  <Controller
                    name="otherRegistrationNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Registration Number"
                        className="mt-2"
                      />
                    )}
                  />
                )}
                {errors.firmRegistrationNumber && (
                  <span className="text-red-500">
                    {errors.firmRegistrationNumber.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="holdingPercentage">Holding Percentage</Label>
                <Controller
                  name="holdingPercentage"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter Holding Percentage"
                      className={
                        errors.holdingPercentage ? "border-red-500" : ""
                      }
                    />
                  )}
                />
                {errors.holdingPercentage && (
                  <span className="text-red-500">
                    {errors.holdingPercentage.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="registered-mobile">Add nominee</Label>
                <EditNominiee
                  setSelectedNommie={setSelectedNommie}
                  selectedNommie={selectedNommie}
                  displaynominie={displaynominie}
                  setDisplaynominie={setDisplaynominie}
                />{" "}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalInformation">
                Additional Information
              </Label>
              <Controller
                name="additionalInformation"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter Additional Information"
                    className={
                      errors.additionalInformation ? "border-red-500" : ""
                    }
                  />
                )}
              />
              {errors.additionalInformation && (
                <span className="text-red-500">
                  {errors.additionalInformation.message}
                </span>
              )}
            </div>
            <div className="w-full grid grid-cols-1 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="name"
                      placeholder="Enter Name"
                      {...field}
                      className={errors.name ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.name && (
                  <span className="text-red-500">{errors.name.message}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter Email"
                      {...field}
                      className={errors.email ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.email && (
                  <span className="text-red-500">{errors.email.message}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile</Label>
                <Controller
                  name="mobile"
                  control={control}
                  render={({ field }) => (
                    <PhoneInput
                      id="mobile"
                      type="tel"
                      placeholder="Enter mobile number"
                      defaultCountry="in"
                      inputStyle={{ minWidth: "15.5rem" }}
                      {...field}
                      className={errors.mobile ? "border-red-500" : ""}
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

export default PartnershipEdit;

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
  registrationAddress: z
    .string()
    .nonempty({ message: "Registration Address is required" }),
  firmRegistrationNumber: z.string().optional(),

  additionalInformation: z
    .string()
    .min(1, { message: "Additional Information is Required" }),
});

const PropritorshipEdit = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const [showOtherMetalType, setShowOtherMetalType] = useState(false);
  const [showOtherArticleDetails, setShowOtherArticleDetails] = useState(false);
  const { lifeInsuranceEditId } = useSelector((state) => state.counterSlice);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  console.log(lifeInsuranceEditId);
  useEffect(() => {
    if (lifeInsuranceEditId) {
      console.log("lifeInsuranceEditId:", lifeInsuranceEditId);
    }
  }, [lifeInsuranceEditId]);
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
    let othertype = response.data.data.Propritership?.firmName;
    let otherarticle = response.data.data.Propritership?.registrationAddress;
    if (
      othertype === "gold" ||
      othertype === "silver" ||
      othertype === "copper"
    ) {
      setShowOtherMetalType(false);
      setValue("firmName", othertype);
    } else {
      setShowOtherMetalType(true);
      setValue("otherMetalType", othertype);
    }

    if (
      otherarticle === "plates" ||
      otherarticle === "glass" ||
      otherarticle === "bowl" ||
      otherarticle === "bar" ||
      otherarticle === "utensils"
    ) {
      setShowOtherArticleDetails(false);
      setValue("registrationAddress", otherarticle);
    } else {
      setShowOtherArticleDetails(true);
      setValue("otherArticleDetails", otherarticle);
    }
    console.log(typeof response.data.data.Propritership?.premium);
    return response.data.data.Propritership;
  };

  const {
    data: Benifyciary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bullionDataUpdate", lifeInsuranceEditId],
    queryFn: getPersonalData,

    onSuccess: (data) => {
      if (data.modeOfPurchase === "broker") {
        setBrokerSelected(true);
        setHideRegisteredFields(false);
      }
      if (data.modeOfPurchase === "e-insurance") {
        setBrokerSelected(false);
        setHideRegisteredFields(true);
      }
      setDefaultValues(data);
      reset(data);
      setValue(data);
      setValue("metaltype", data.metaltype);
      setValue("otherInsuranceCompany", data.otherInsuranceCompany);
      setValue("firmRegistrationNumber", data.firmRegistrationNumber);
      setValue("additionalInformation", data.additionalInformation);
      setValue("pointOfContact", data.pointOfContact);

      // Set fetched values to the form
      for (const key in data) {
        setValue(key, data[key]);
      }

      setShowOtherBullion(data.Propritership === "other");

      console.log(data);
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
      return response.data.data.Propritership;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("BullionDataUpdate", lifeInsuranceEditId);
      toast.success("Propritership added successfully!");
      navigate("/propritership");
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile");
    },
  });
  useEffect(() => {
    console.log("Form values:", control._formValues);
  }, [control._formValues]);

  useEffect(() => {
    if (Benifyciary?.nominees) {
      setDisplaynominie(Benifyciary?.nominees);
    }
  }, [Benifyciary?.nominees]);

  const onSubmit = (data) => {
    console.log(data);
    data.type = "propritorship";
    data.name = name;
    data.email = email;
    data.phone = phone;
    console.log("bullion:", data.bullion);
    if (data.firmName === "other") {
      data.firmName = data.otherMetalType;
    }

    bullionMutate.mutate(data);
  };

  useEffect(() => {
    console.log(Benifyciary);
  }, [Benifyciary]);
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
                  control={control}
                  defaultValue={Benifyciary?.firmName}
                  render={({ field }) => (
                    <Select
                      id="firmName"
                      value={field.value}
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherMetalType(value === "other");
                      }}
                      className={errors.firmName ? "border-red-500" : ""}
                      defaultValue={Benifyciary?.firmName || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Metal Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gold">Gold</SelectItem>
                        <SelectItem value="silver">Silver</SelectItem>
                        <SelectItem value="copper">Copper</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {showOtherMetalType && (
                  <Controller
                    name="otherMetalType"
                    control={control}
                    defaultValue={Benifyciary?.otherMetalType || ""}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Firm Name"
                        className="mt-2"
                        defaultValue={Benifyciary?.otherMetalType || ""}
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
                <Label htmlFor="registrationAddress">
                  {" "}
                  Registration Address{" "}
                </Label>
                <Controller
                  name="registrationAddress"
                  control={control}
                  defaultValue={Benifyciary?.registrationAddress || ""}
                  render={({ field }) => (
                    <Select
                      id="registrationAddress"
                      value={field.value}
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherArticleDetails(value === "other");
                      }}
                      className={
                        errors.registrationAddress ? "border-red-500" : ""
                      }
                      defaultValue={Benifyciary?.registrationAddress || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select  Registration Address" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plates">Plates</SelectItem>
                        <SelectItem value="glass">Glass</SelectItem>
                        <SelectItem value="bowl">Bowl</SelectItem>
                        <SelectItem value="bar">Bar</SelectItem>
                        <SelectItem value="utensils">Utensils</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {showOtherArticleDetails && (
                  <Controller
                    name="otherArticleDetails"
                    control={control}
                    defaultValue={Benifyciary?.otherArticleDetails || ""}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Article Type"
                        className="mt-2"
                        defaultValue={Benifyciary?.otherArticleDetails || ""}
                      />
                    )}
                  />
                )}

                {errors.registrationAddress && (
                  <span className="text-red-500">
                    {errors.registrationAddress.message}
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
                    <Input
                      id="firmRegistrationNumber"
                      type="number"
                      {...field}
                      placeholder="Enter Number Of Article"
                      value={parseInt(field.value)}
                      className={
                        errors.firmRegistrationNumber ? "border-red-500" : ""
                      }
                      defaultValue={Benifyciary?.firmRegistrationNumber || ""}
                    />
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
                <Controller
                  name="name"
                  control={control}
                  defaultValue={Benifyciary?.name || ""}
                  render={({ field }) => (
                    <Input
                      id="name"
                      placeholder="Enter Name"
                      value={field.value}
                      onChange={(e) => setName(e.target.value)}
                      {...field}
                      className={errors.name ? "border-red-500" : ""}
                      defaultValue={Benifyciary?.name || ""}
                    />
                  )}
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
                <Label htmlFor="phone">Phone</Label>
                <Controller
                  name="phone"
                  control={control}
                  defaultValue={Benifyciary?.phone || ""}
                  render={({ field }) => (
                    <PhoneInput
                      id="phone"
                      type="tel"
                      placeholder="Enter mobile number"
                      defaultCountry="in"
                      inputStyle={{ minWidth: "15.5rem" }}
                      value={field.value}
                      onChange={(e) => setPhone(e.target)}
                      defaultValue={Benifyciary?.phone || ""}
                    />
                  )}
                />
                {errors.phone && (
                  <span className="text-red-500">{errors.phone.message}</span>
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

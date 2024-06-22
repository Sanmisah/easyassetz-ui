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

const schema = z.object({
  metalType: z.string().nonempty({ message: "Metal Name is required" }),
  articleDetails: z
    .string()
    .nonempty({ message: "Article Detail is required" }),
  WeightPerArticle: z
    .string()
    .min(1, { message: " Weight Per Article is Required" }),
  numberOfArticle: z.date().optional(),
  additionalInformation: z
    .string()
    .min(1, { message: "Additional Information is Required" }),

  pointOfContact: z
    .string()
    .min(1, { message: "Point Of Contact is Required" }),
});

const BullionEdit = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const { lifeInsuranceEditId } = useSelector((state) => state.counterSlice);

  console.log(lifeInsuranceEditId);
  useEffect(() => {
    if (lifeInsuranceEditId) {
      console.log("lifeInsuranceEditId:", lifeInsuranceEditId);
    }
  }, [lifeInsuranceEditId]);
  const [showOtherInsuranceCompany, setShowOtherInsuranceCompany] =
    useState(false);
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
    const response = await axios.get(`/api/bullions/${lifeInsuranceEditId}`, {
      headers: {
        Authorization: `Bearer ${user.data.token}`,
      },
    });
    if (response.data.data.OtherInsurance?.modeOfPurchase === "broker") {
      setBrokerSelected(true);
      setHideRegisteredFields(false);
    }
    if (response.data.data.OtherInsurance?.modeOfPurchase === "e-insurance") {
      setBrokerSelected(false);
      setHideRegisteredFields(true);
    }
    console.log(typeof response.data.data.OtherInsurance?.premium);
    return response.data.data.OtherInsurance;
  };

  const {
    data: Benifyciary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lifeInsuranceDataUpdate", lifeInsuranceEditId],
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
      setValue("specificVehicalType", data.specificVehicalType);
      setValue("registeredMobile", data.registeredMobile);
      setValue("registeredEmail", data.registeredEmail);
      setValue("additionalDetails", data.additionalDetails);
      setValue("previousPolicyNumber", data.previousPolicyNumber);
      setValue("policyNumber", data.policyNumber);
      setValue("expiryDate", data.expiryDate);
      setValue("premium", data.premium);
      setValue("sumInsured", data.sumInsured);
      setValue("policyHolderName", data.policyHolderName);
      setValue("modeOfPurchase", data.modeOfPurchase);
      setValue("contactPerson", data.contactPerson);
      setValue("contactNumber", data.contactNumber);
      setValue("email", data.email);
      setValue("registeredMobile", data.registeredMobile);
      setValue("registeredEmail", data.registeredEmail);
      setValue("additionalDetails", data.additionalDetails);
      setValue("previousPolicyNumber", data.previousPolicyNumber);
      setValue("brokerName", data.brokerName);
      setValue("contactPerson", data.contactPerson);
      setValue("contactNumber", data.contactNumber);
      setValue("metaltype", data.metaltype);
      setValue("otherInsuranceCompany", data.otherInsuranceCompany);
      setValue("WeightPerArticle", data.WeightPerArticle);
      setValue("numberOfArticle", data.numberOfArticle);
      setValue("additionalInformation", data.additionalInformation);
      setValue("pointOfContact", data.pointOfContact);

      // Set fetched values to the form
      for (const key in data) {
        setValue(key, data[key]);
      }

      setShowOtherInsuranceCompany(data.companyName === "other");

      console.log(data);
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile", error.message);
    },
  });

  const lifeInsuranceMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(`/api//${lifeInsuranceEditId}`, data, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });
      return response.data.data.OtherInsurance;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("BullionDataUpdate", lifeInsuranceEditId);
      toast.success("Bullion added successfully!");
      navigate("/lifeinsurance");
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
    console.log("brokerName:", data.brokerName);
    if (data.metalType === "other") {
      data.metalType = data.otherMetalType;
    }

    lifeInsuranceMutate.mutate(data);
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
                Bullion Details
              </CardTitle>
              <CardDescription>
                Edit the form to update the bullion details.
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
                <Label htmlFor="metalType">Metal Type</Label>
                <Controller
                  name="metalType"
                  control={control}
                  defaultValue={Benifyciary?.metalType}
                  render={({ field }) => (
                    <Select
                      id="metalType"
                      value={field.value}
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherInsuranceCompany(value === "other");
                      }}
                      className={errors.metalType ? "border-red-500" : ""}
                      defaultValue={Benifyciary?.metalType || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Metal Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="company1">Gold</SelectItem>
                        <SelectItem value="company2">Silver</SelectItem>
                        <SelectItem value="company3">Copper</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {showOtherInsuranceCompany && (
                  <Controller
                    name="otherMetalType"
                    control={control}
                    defaultValue={Benifyciary?.otherMetalType || ""}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Metal Type"
                        className="mt-2"
                        defaultValue={Benifyciary?.otherMetalType || ""}
                      />
                    )}
                  />
                )}
                {errors.metalType && (
                  <span className="text-red-500">
                    {errors.metalType.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="articleDetails">Ariticle Details </Label>
                <Controller
                  name="articleDetails"
                  control={control}
                  defaultValue={Benifyciary?.articleDetails || ""}
                  render={({ field }) => (
                    <Select
                      id="articleDetails"
                      value={field.value}
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherInsuranceCompany(value === "other");
                      }}
                      className={errors.articleDetails ? "border-red-500" : ""}
                      defaultValue={Benifyciary?.articleDetails || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Article Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="article1">Plates</SelectItem>
                        <SelectItem value="article2">Glass</SelectItem>
                        <SelectItem value="article3">Bowl</SelectItem>
                        <SelectItem value="article4">Bar</SelectItem>
                        <SelectItem value="article5">Utensils</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {showOtherInsuranceCompany && (
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

                {errors.articleDetails && (
                  <span className="text-red-500">
                    {errors.articleDetails.message}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weightPerArticle">Weight Per Article</Label>
              <Controller
                name="weightPerArticle"
                defaultValue={new Date(Benifyciary?.expiryDate) || ""}
                control={control}
                render={({ field }) => (
                  <Input
                    id="weightPerArticle"
                    placeholder="Weight Per Aricle"
                    {...field}
                    className={errors.weightPerArticle ? "border-red-500" : ""}
                    defaultValue={Benifyciary?.weightPerArticle || ""}
                  />
                )}
              />
              {errors.weightPerArticle && (
                <span className="text-red-500">
                  {errors.weightPerArticle.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numberOfArticle">Number Of Article</Label>
                <Controller
                  name="numberOfArticle"
                  control={control}
                  defaultValue={Benifyciary?.numberOfArticle || ""}
                  render={({ field }) => (
                    <Input
                      id="numberOfArticle"
                      placeholder="Enter Number Of Article"
                      {...field}
                      className={errors.numberOfArticle ? "border-red-500" : ""}
                      defaultValue={Benifyciary?.numberOfArticle || ""}
                    />
                  )}
                />
                {errors.numberOfArticle && (
                  <span className="text-red-500">
                    {errors.numberOfArticle.message}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pointOfContact">Point Of Contact</Label>
                <Controller
                  name="pointOfContact"
                  control={control}
                  defaultValue={Benifyciary?.pointOfContact || ""}
                  render={({ field }) => (
                    <Input
                      id="pointOfContact"
                      pointOfContact="Enter policy holder name"
                      {...field}
                      className={errors.pointOfContact ? "border-red-500" : ""}
                      defaultValue={Benifyciary?.pointOfContact || ""}
                    />
                  )}
                />
                {errors.pointOfContact && (
                  <span className="text-red-500">
                    {errors.pointOfContact.message}
                  </span>
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

export default BullionEdit;

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

const schema = z.object({
  digitalAssets: z.string().nonempty({ message: "Digital Asset is required" }),
  account: z.string().nonempty({ message: "Account is required" }),
  linkedMobileNumber: z
    .string()
    .min(2, { message: "Mobile Number is required" }),
  description: z.string().nonempty({ message: "Description is required" }),
  additionalInformation: z
    .string()
    .min(3, { message: "Additional Information is required" })
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .transform((value) => (value === null ? null : Number(value))),
});

const DigitalAssetEditForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const [showOtherdigitalAssets, setShowOtherdigitalAssets] = useState(false);
  const [showOtherArticleDetails, setShowOtherArticleDetails] = useState(false);
  const { lifeInsuranceEditId } = useSelector((state) => state.counterSlice);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setPhone] = useState("");
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
    const response = await axios.get(`/api/bullions/${lifeInsuranceEditId}`, {
      headers: {
        Authorization: `Bearer ${user.data.token}`,
      },
    });
    let othertype = response.data.data.Bullion?.metalType;
    let otherarticle = response.data.data.Bullion?.articleDetails;
    if (
      othertype === "gold" ||
      othertype === "silver" ||
      othertype === "copper"
    ) {
      setShowOtherMetalType(false);
      setValue("metalType", othertype);
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
      setValue("articleDetails", otherarticle);
    } else {
      setShowOtherArticleDetails(true);
      setValue("otherArticleDetails", otherarticle);
    }
    console.log(typeof response.data.data.Bullion?.premium);
    return response.data.data.Bullion;
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
      setValue("WeightPerArticle", data.WeightPerArticle);
      setValue("numberOfArticles", data.numberOfArticles);
      setValue("additionalInformation", data.additionalInformation);
      setValue("pointOfContact", data.pointOfContact);

      // Set fetched values to the form
      for (const key in data) {
        setValue(key, data[key]);
      }

      setShowOtherBullion(data.Bullion === "other");

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
        `/api/bullions/${lifeInsuranceEditId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      return response.data.data.Bullion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("BullionDataUpdate", lifeInsuranceEditId);
      toast.success("Digital Asset added successfully!");
      navigate("/dashboard");
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
    if (name) {
      data.name = name;
    }
    if (email) {
      data.email = email;
    }
    if (mobile) {
      data.mobile = mobile;
    }
    console.log(
      // "bullion:",
      data.mobile,
      data.name,
      data.email,
      mobile,
      name,
      email
    );
    if (data.metalType === "other") {
      data.metalType = data.otherMetalType;
    }

    bullionMutate.mutate(data);
  };

  useEffect(() => {
    console.log(Benifyciary);
  }, [Benifyciary]);
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading Digital Asset data</div>;
  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-2xl font-bold">
                Digital Asset Details
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <form
            className="space-y-6 flex flex-col"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-2">
              <Label htmlFor="digitalAssets">Digital Assets</Label>
              <Controller
                name="digitalAssets"
                control={control}
                defaultValue={Benifyciary?.digitalAssets}
                render={({ field }) => (
                  <Select
                    id="digitalAssets"
                    value={field.value}
                    {...field}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setShowOtherdigitalAssets(value === "other");
                    }}
                    className={errors.digitalAssets ? "border-red-500" : ""}
                    defaultValue={Benifyciary?.digitalAssets || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Digital Assets" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="socialMedia">Social Media</SelectItem>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {showOtherdigitalAssets && (
                <Controller
                  name="otherdigitalAssets"
                  control={control}
                  defaultValue={Benifyciary?.otherdigitalAssets || ""}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Specify Digital Assets"
                      className="mt-2"
                      defaultValue={Benifyciary?.otherdigitalAssets || ""}
                    />
                  )}
                />
              )}
              {errors.digitalAssets && (
                <span className="text-red-500">
                  {errors.digitalAssets.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="account">Account/ID</Label>
              <Controller
                name="account"
                defaultValue={Benifyciary?.account || ""}
                control={control}
                render={({ field }) => (
                  <Input
                    id="account"
                    placeholder="Enter Account/ID"
                    {...field}
                    className={errors.account ? "border-red-500" : ""}
                    defaultValue={Benifyciary?.account || ""}
                  />
                )}
              />
              {errors.account && (
                <span className="text-red-500">{errors.account.message}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedMobileNumber">Mobile Number</Label>
              <Controller
                name="linkedMobileNumber"
                defaultValue={Benifyciary?.linkedMobileNumber || ""}
                control={control}
                render={({ field }) => (
                  <Input
                    id="linkedMobileNumber"
                    placeholder="Weight Per Aricle"
                    {...field}
                    className={
                      errors.linkedMobileNumber ? "border-red-500" : ""
                    }
                    defaultValue={Benifyciary?.linkedMobileNumber || ""}
                  />
                )}
              />
              {errors.linkedMobileNumber && (
                <span className="text-red-500">
                  {errors.linkedMobileNumber.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Controller
                  name="description"
                  control={control}
                  defaultValue={Benifyciary?.description || ""}
                  render={({ field }) => (
                    <Input
                      id="description"
                      type="number"
                      {...field}
                      placeholder="Enter Description"
                      value={parseInt(field.value)}
                      className={errors.description ? "border-red-500" : ""}
                      defaultValue={Benifyciary?.description || ""}
                    />
                  )}
                />
                {errors.description && (
                  <span className="text-red-500">
                    {errors.description.message}
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                  defaultValue={Benifyciary?.name || ""}
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
                <Label htmlFor="mobile">Mobile</Label>
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
                      value={field.value}
                      onChange={(e) => setPhone(e.target)}
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

export default DigitalAssetEditForm;

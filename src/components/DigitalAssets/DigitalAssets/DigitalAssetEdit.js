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
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { PhoneInput } from "react-international-phone";

const FocusableSelectTrigger = forwardRef((props, ref) => (
  <SelectTrigger ref={ref} {...props} />
));

const schema = z.object({
  digitalAsset: z.any().optional(),
  otherDigitalAsset: z.any().optional(),
  account: z.string().nonempty({ message: "Account is required" }),
  linkedMobileNumber: z
    .string()
    .min(2, { message: "Mobile Number is required" }),
  description: z.any().optional(),
  additionalInformation: z.any().optional(),
  name: z.any().optional(),
  email: z.any().optional(),
  phone: z.any().optional(),
});

const DigitalAssetEditForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const [showOtherDigitalAsset, setShowOtherDigitalAsset] = useState(false);

  const [showOtherArticleDetails, setShowOtherArticleDetails] = useState(false);
  const { lifeInsuranceEditId } = useSelector((state) => state.counterSlice);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setPhone] = useState("");
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
      `/api/digital-assets/${lifeInsuranceEditId}`,
      {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      }
    );
    if (
      response.data.data.DigitalAsset.digitalAsset !== "website" &&
      response.data.data.DigitalAsset.digitalAsset !== "socialMedia" &&
      response.data.data.DigitalAsset.digitalAsset !== "email"
    ) {
      setShowOtherDigitalAsset(true);
      setValue("digitalAsset", "other");
      setValue(
        "otherDigitalAsset",
        response.data.data.DigitalAsset.digitalAsset
      );
    }
    setValue("digitalAsset", response.data.data.DigitalAsset.digitalAsset);
    setValue("account", response.data.data.DigitalAsset?.account);
    setValue(
      "linkedMobileNumber",
      response.data.data.DigitalAsset?.linkedMobileNumber
    );
    setValue("description", response.data.data.DigitalAsset?.description);
    setValue(
      "additionalInformation",
      response.data.data.DigitalAsset?.additionalInformation
    );
    setValue("name", response.data.data.DigitalAsset?.name);
    setValue("email", response.data.data.DigitalAsset?.email);
    setValue("mobile", response.data.data.DigitalAsset?.mobile);
    return response.data.data.DigitalAsset;
  };

  const {
    data: Benifyciary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["DigitalAssetDataUpdate", lifeInsuranceEditId],
    queryFn: getPersonalData,

    onSuccess: (data) => {
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

      setShowOtherDigitalAsset(data.digitalAsset === "other");

      console.log(data);
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile", error.message);
    },
  });

  const DigitalAssetMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(
        `/api/digital-assets/${lifeInsuranceEditId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      return response.data.data.digitalAsset;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(
        "DigitalAssetDataUpdate",
        lifeInsuranceEditId
      );
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
    if (data.digitalAsset === "other") {
      data.digitalAsset = data.otherDigitalAsset;
    }
    DigitalAssetMutate.mutate(data);
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
            <div className="flex items-center gap-2">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Edit Digital Asset Details
                </CardTitle>
              </div>
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
                <Label htmlFor="digitalAsset">Digital Asset</Label>
                <Controller
                  name="digitalAsset"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="digitalAsset"
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherDigitalAsset(value === "other");
                      }}
                      className={errors.digitalAsset ? "border-red-500" : ""}
                    >
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select Digital Asset Type" />
                      </FocusableSelectTrigger>
                      <SelectContent>
                        <SelectItem value="socialMedia">
                          Social Media
                        </SelectItem>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {showOtherDigitalAsset && (
                  <Controller
                    name="otherDigitalAsset"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Digital Asset Type"
                        className="mt-2"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    )}
                  />
                )}
                {errors.digitalAsset && (
                  <span className="text-red-500">
                    {errors.digitalAsset.message}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="account">Account/ID</Label>
              <Label style={{ color: "red" }}>*</Label>
              <Controller
                name="account"
                control={control}
                render={({ field }) => (
                  <Input
                    id="account"
                    placeholder="Enter Account/ID"
                    {...field}
                    value={field.value || ""}
                    onChange={field.onChange}
                    className={errors.account ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.account && (
                <span className="text-red-500">{errors.account.message}</span>
              )}
            </div>
            <div className="space-y-2  ">
              <Label htmlFor="linkedMobileNumber"> Mobile Number</Label>
              <Label style={{ color: "red" }}>*</Label>
              <Controller
                name="linkedMobileNumber"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    inputStyle={{ minWidth: "22rem" }}
                    id="linkedMobileNumber"
                    type="tel"
                    placeholder="Enter Linked Mobile Number"
                    defaultCountry="in"
                    value={field.value || ""}
                    onChange={field.onChange}
                    className={
                      errors.linkedMobileNumber ? "border-red-500" : ""
                    }
                  />
                )}
              />
              {errors.linkedMobileNumber && (
                <span className="text-red-500">
                  {errors.linkedMobileNumber.message}
                </span>
              )}
            </div>
            <div className="space-y-2 col-span-full">
              <Label htmlFor="description">Description</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Input
                    id="description"
                    placeholder="Enter Description"
                    {...field}
                    value={field.value || ""}
                    onChange={field.onChange}
                    className={errors.description ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.description && (
                <span className="text-red-500">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div className="space-y-2 col-span-full">
              <Label htmlFor="additionalInformation">
                Additional Information
              </Label>
              <Controller
                name="additionalInformation"
                control={control}
                render={({ field }) => (
                  <Input
                    id="additionalInformation"
                    placeholder="Enter Additional Information"
                    {...field}
                    value={field.value || ""}
                    onChange={field.onChange}
                    className={
                      errors.additionalInformation
                        ? "border-red-500 w-full"
                        : "w-full"
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
              <div className="w-[40%] space-y-2">
                <Label htmlFor="email">Email</Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="email"
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
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.mobile && (
                  <span className="text-red-500">{errors.mobile.message}</span>
                )}
              </div>
            </div>
            <CardFooter className="flex justify-end gap-2 mt-8">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.history.back();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DigitalAssetEditForm;

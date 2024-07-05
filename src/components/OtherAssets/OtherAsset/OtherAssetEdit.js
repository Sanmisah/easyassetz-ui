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
  nameOfAsset: z.string().min(2, { message: "Name of Asset is required" }),
  assetDescription: z
    .string()
    .min(1, { message: "Asset Description is required" }),
  additionalInformation: z
    .string()
    .min(1, { message: "Additional Information is required" }),
  name: z.string().nonempty({ message: "Name is required" }),
  email: z.string().email({ message: "Invalid email" }),
  mobile: z.string().nonempty({ message: "Mobile number is required" }),
});

const OtherAssetEditForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const [showOtherMetalType, setShowOtherMetalType] = useState(false);
  const [showOtherArticleDetails, setShowOtherArticleDetails] = useState(false);
  const { lifeInsuranceEditId } = useSelector((state) => state.counterSlice);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState(null);
  const [defaultValues, setDefaultValues] = useState(null);
  // const [numberOfArticles, setNumberOfArticles] = useState(null);

  useEffect(() => {
    if (lifeInsuranceEditId) {
      console.log("lifeInsuranceEditId:", lifeInsuranceEditId);
    }
  }, [lifeInsuranceEditId]);

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
    const response = await axios.get(`/api/other-assets/${lifeInsuranceEditId}`, {
      headers: {
        Authorization: `Bearer ${user.data.token}`,
      },
    });
    const bullion = response.data.data.Bullion;
    const metalType = bullion.metalType;
    const articleDetails = bullion.articleDetails;
    setValue("name", bullion.name);
    setValue("email", bullion.email);
    setValue("mobile", bullion.mobile);
    if (["gold", "silver", "copper"].includes(metalType)) {
      setShowOtherMetalType(false);
      setValue("metalType", metalType);
    } else {
      setShowOtherMetalType(true);
      setValue("metalType", "other");
      setValue("otherMetalType", metalType);
    }

    if (
      ["plates", "glass", "bowl", "bar", "utensils"].includes(articleDetails)
    ) {
      setShowOtherArticleDetails(false);
      setValue("articleDetails", articleDetails);
    } else {
      setShowOtherArticleDetails(true);
      setValue("articleDetails", "other");
      setValue("otherArticleDetails", articleDetails);
    }

    setName(bullion.name);
    setEmail(bullion.email);
    setMobile(bullion?.mobile);

    return bullion;
  };

  const {
    data: Benifyciary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bullionDataUpdate", lifeInsuranceEditId],
    queryFn: getPersonalData,
    onSuccess: (data) => {
      reset(data);
      setDefaultValues(data);
      setValue("otherInsuranceCompany", data.otherInsuranceCompany);
      setValue("nameOfAsset", data.nameOfAsset);
      setValue("assetDescription", data.assetDescription);
      setValue("additionalInformation", data.additionalInformation);
      setValue("pointOfContact", data.pointOfContact);
      setValue("name", data.name);
      setValue("email", data.email);
      setValue("mobile", data.mobile);

      // Set fetched values to the form
      for (const key in data) {
        setValue(key, data[key]);
      }
    },
    onError: (error) => {
      console.error("Error fetching profile:", error);
      toast.error("Failed to fetch profile");
    },
  });

  const bullionMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(
        `/api/other-assets/${lifeInsuranceEditId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      return response.data.data.OtherAsset;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("bullionDataUpdate", lifeInsuranceEditId);
      toast.success("Other Asset updated successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile");
    },
  });

  const onSubmit = (data) => {
    console.log("data:", data);
    // if (data.metalType === "other") {
    //   data.metalType = data.otherMetalType;
    // }
    // if (data.articleDetails === "other") {
    //   data.articleDetails = data.otherArticleDetails;
    // }
    if (name) {
      data.name = name;
    }
    if (email) {
      data.email = email;
    }
    if (mobile) {
      data.mobile = mobile;
    }
    // console.log("NumberOFarticles:", data.numberOfArticles);

    bullionMutate.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading other asset data</div>;

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-2xl font-bold">
                Other Asset Details
              </CardTitle>
              <CardDescription>
                Edit the form to update the other asset details.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <form
            className="space-y-6 flex flex-col"
            onSubmit={handleSubmit(onSubmit)}
          >
        

            <div className="space-y-2">
              <Label htmlFor="nameOfAsset">Name Of Asset</Label>
              <Controller
                name="nameOfAsset"
                defaultValue={Benifyciary?.nameOfAsset || ""}
                control={control}
                render={({ field }) => (
                  <Input
                    id="nameOfAsset"
                    defaultValue={Benifyciary?.nameOfAsset || ""}
                    placeholder="Enter Name Of Asset"
                    {...field}
                    className={errors.nameOfAsset ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.nameOfAsset && (
                <span className="text-red-500">
                  {errors.nameOfAsset.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assetDescription">Asset Description</Label>
                <Controller
                  name="assetDescription"
                  control={control}
                  defaultValue={Benifyciary?.assetDescription || ""}
                  render={({ field }) => (
                    <Input
                      id="assetDescription"
                      defaultValue={Benifyciary?.assetDescription || ""}
                      placeholder="Enter Asset Description"
                      {...field}
                      className={
                        errors.assetDescription ? "border-red-500" : ""
                      }
                    />
                  )}
                />
                {errors.assetDescription && (
                  <span className="text-red-500">
                    {errors.assetDescription.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalInformation">
                  Additional Information
                </Label>
                <Controller
                  name="additionalInformation"
                  defaultValue={Benifyciary?.additionalInformation || ""}
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="additionalInformation"
                      defaultValue={Benifyciary?.additionalInformation || ""}
                      placeholder="Enter Additional Information"
                      {...field}
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
            </div>
            <div className="w-full grid grid-cols-1 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Controller
                  name="name"
                  defaultValue={Benifyciary?.name || ""}
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="name"
                      placeholder="Enter Name"
                      value={field.value}
                      onChange={field.onChange}
                      defaultValue={Benifyciary?.name || ""}
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
                      placeholder="Enter Email"
                      defaultValue={Benifyciary?.email || ""}
                      value={field.value}
                      onChange={field.onChange}
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
                      defaultValue={Benifyciary?.mobile || ""}
                      value={field.value || Benifyciary?.mobile || ""}
                      inputStyle={{ minWidth: "15.5rem" }}
                      onChange={field.onChange}
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

export default OtherAssetEditForm;

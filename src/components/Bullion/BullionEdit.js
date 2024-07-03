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
  metalType: z.string().nonempty({ message: "Metal Name is required" }),
  otherMetalType: z.string().optional(),
  articleDetails: z
    .string()
    .nonempty({ message: "Article Detail is required" }),
  otherArticleDetails: z.string().optional(),
  numberOfArticles: z.string().optional(),
  weightPerArticle: z
    .string()
    .min(1, { message: "Weight Per Article is required" }),
  additionalInformation: z
    .string()
    .min(1, { message: "Additional Information is required" }),
  name: z.string().nonempty({ message: "Name is required" }),
  email: z.string().email({ message: "Invalid email" }),
  mobile: z.string().nonempty({ message: "Mobile number is required" }),
});

const BullionEdit = () => {
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
  const [numberOfArticles, setNumberOfArticles] = useState(null);

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
    const response = await axios.get(`/api/bullions/${lifeInsuranceEditId}`, {
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
      setValue("metaltype", data.metaltype);
      setValue("otherInsuranceCompany", data.otherInsuranceCompany);
      setValue("weightPerArticle", data.weightPerArticle);
      setValue("numberOfArticles", data.numberOfArticles);
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
      queryClient.invalidateQueries("bullionDataUpdate", lifeInsuranceEditId);
      toast.success("Bullion updated successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile");
    },
  });

  const onSubmit = (data) => {
    console.log("data:", data);
    if (data.metalType === "other") {
      data.metalType = data.otherMetalType;
    }
    if (data.articleDetails === "other") {
      data.articleDetails = data.otherArticleDetails;
    }
    if (name) {
      data.name = name;
    }
    if (email) {
      data.email = email;
    }
    if (mobile) {
      data.mobile = mobile;
    }
    console.log("NumberOFarticles:", data.numberOfArticles);

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
                  render={({ field }) => (
                    <Select
                      id="metalType"
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherMetalType(value === "other");
                      }}
                      className={errors.metalType ? "border-red-500" : ""}
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
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Metal Type"
                        className="mt-2"
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
                <Label htmlFor="articleDetails">Article Details</Label>
                <Controller
                  name="articleDetails"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="articleDetails"
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherArticleDetails(value === "other");
                      }}
                      className={errors.articleDetails ? "border-red-500" : ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Article Type" />
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
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Article Type"
                        className="mt-2"
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
                defaultValue={Benifyciary?.weightPerArticle || ""}
                control={control}
                render={({ field }) => (
                  <Input
                    id="weightPerArticle"
                    defaultValue={Benifyciary?.weightPerArticle || ""}
                    placeholder="Weight Per Article"
                    {...field}
                    className={errors.weightPerArticle ? "border-red-500" : ""}
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
                <Label htmlFor="numberOfArticles">Number Of Articles</Label>
                <Controller
                  name="numberOfArticles"
                  control={control}
                  defaultValue={Benifyciary?.numberOfArticles || ""}
                  render={({ field }) => (
                    <Input
                      id="numberOfArticles"
                      defaultValue={Benifyciary?.numberOfArticles || ""}
                      placeholder="Enter Number Of Articles"
                      {...field}
                      className={
                        errors.numberOfArticles ? "border-red-500" : ""
                      }
                    />
                  )}
                />
                {errors.numberOfArticles && (
                  <span className="text-red-500">
                    {errors.numberOfArticles.message}
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

export default BullionEdit;

import React, { useState, forwardRef, useEffect } from "react";
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
import { Textarea } from "@com/ui/textarea";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { PhoneInput } from "react-international-phone";

const schema = z.object({
  metalType: z.any().optional(),
  otherMetalType: z.any().optional(),
  articleDetails: z.any().optional(),
  otherArticleDetails: z.any().optional(),
  numberOfArticles: z.any().optional(),
  weightPerArticle: z.any().optional(),
  additionalInformation: z.any().optional(),
  name: z.any().optional(),
  email: z.any().optional(),
  mobile: z.any().optional(),
  bullionFile: z.any().optional(),
});

const FocusableSelectTrigger = forwardRef((props, ref) => (
  <SelectTrigger ref={ref} {...props} />
));

FocusableSelectTrigger.displayName = "FocusableSelectTrigger";

const BullionForm = () => {
  const navigate = useNavigate();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const queryClient = useQueryClient();
  const [showOtherMetalType, setShowOtherMetalType] = useState(false);
  const [showOtherArticleDetails, setShowOtherArticleDetails] = useState(false);
  const [selectedNommie, setSelectedNommie] = useState([]);
  const [nomineeerror, setNomineeError] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setPhone] = useState("");
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      metalType: "",
      otherMetalType: "",
      articleDetails: "",
      otherArticleDetails: "",
      weightPerArticle: "",
      numberOfArticles: "",
      additionalInformation: "",
      name: "",
      email: "",
      mobile: "",
    },
  });

  const lifeInsuranceMutate = useMutation({
    mutationFn: async (data) => {
      const Formdata = new FormData();
      Formdata.append("bullionFile", data.bullionFile);

      for (const [key, value] of Object.entries(data)) {
        Formdata.append(key, value);
      }

      const response = await axios.post(
        `/api/bullions`,

        Formdata,

        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );

      return response.data.data.Bullion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("LifeInsuranceData");
      toast.success("Bullion added successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile");
    },
  });

  useEffect(() => {
    if (selectedNommie.length > 0) {
      setNomineeError(false);
    }
  }, [selectedNommie]);

  const onSubmit = (data) => {
    console.log(data);
    if (data.metalType === "other") {
      data.metalType = data.otherMetalType;
    }
    if (data.articleDetails === "other") {
      data.articleDetails = data.otherArticleDetails;
    }
    // data.name = name;
    // data.email = email;
    // data.mobile = mobile;
    delete data.otherMetalType;
    delete data.otherArticleDetails;

    lifeInsuranceMutate.mutate(data);
  };

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-2xl font-bold">
                Bullion Details
              </CardTitle>
              <CardDescription>
                Fill out the form to add a new Bullion.
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
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select Metal Type" />
                      </FocusableSelectTrigger>
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
                        value={field.value || ""}
                        onChange={field.onChange}
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
                    <FocusableSelectTrigger>
                      <SelectValue placeholder="Select Article Type" />
                    </FocusableSelectTrigger>
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
                      value={field.value || ""}
                      onChange={field.onChange}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weightPerArticle">
                  Weight Per Article (gms)
                </Label>
                <Controller
                  name="weightPerArticle"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="weightPerArticle"
                      placeholder="Enter Weight Per Article amount"
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                      className={
                        errors.weightPerArticle ? "border-red-500" : ""
                      }
                    />
                  )}
                />
                {errors.weightPerArticle && (
                  <span className="text-red-500">
                    {errors.weightPerArticle.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="numberOfArticles">Number Of Article</Label>
                <Controller
                  name="numberOfArticles"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="numberOfArticles"
                      placeholder="Enter Number Of Article"
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
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
            <div className="w-full grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="additionalInformation">Point Of Contact</Label>
                <div className="mt-2  flex item-center  gap-2 justify-between">
                  <div className="w-[40%] space-y-2 item-center">
                    <Label htmlFor="name">Name</Label>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="name"
                          placeholder="Enter Name"
                          {...field}
                          onChange={field.onChange}
                          className={errors.name ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.name && (
                      <span className="text-red-500">
                        {errors.name.message}
                      </span>
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
                          onChange={field.onChange}
                          className={errors.email ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.email && (
                      <span className="text-red-500">
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                  <div className="w-[40%] space-y-2">
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
                          onChange={field.onChange}
                        />
                      )}
                    />
                    {errors.mobile && (
                      <span className="text-red-500">
                        {errors.mobile.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bullionFile">Upload Image</Label>
              <Controller
                name="bullionFile"
                control={control}
                render={({ field }) => (
                  <Input
                    id="bullionFile"
                    placeholder="Full Name - Name as per Adhar"
                    type="file"
                    onChange={(event) => {
                      field.onChange(
                        event.target.files && event.target.files[0]
                      );
                    }}
                    className={errors.bullionFile ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.bullionFile && (
                <span className="text-red-500">
                  {errors.bullionFile.message}
                </span>
              )}
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

export default BullionForm;

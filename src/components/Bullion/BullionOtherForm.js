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

const schema = z.object({
  metalType: z.string().nonempty({ message: "Metal Name is required" }),
  articleDetails: z
    .string()
    .nonempty({ message: "Article Details is required" }),
  weightPerArticle: z
    .string()
    .min(2, { message: "Weight Per Article is required" }),
  numberOfArticle: z
    .string()
    .nonempty({ message: "Number of Article Details is required" }),
  additionalInformation: z
    .string()
    .min(3, { message: "Additional Information is required" })
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .transform((value) => (value === null ? null : Number(value))),
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
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      metalType: "",
      articleDetails: "",
      weightPerArticle: "",
      numberOfArticle: "",
      additionalInformation: "",
    },
  });

  const lifeInsuranceMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(`/api/bullions`, data, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });

      return response.data.data.Bullion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("LifeInsuranceData");
      toast.success("Other Insurance added successfully!");
      navigate("/otherinsurance");
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
                        <SelectItem value="Metal1">Gold</SelectItem>
                        <SelectItem value="Metal2">Silver</SelectItem>
                        <SelectItem value="Metal3">Copper</SelectItem>
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
                <Label htmlFor="weightPerArticle">Weight Per Article</Label>
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
                <Label htmlFor="numberOfArticle">Number Of Article</Label>
                <Controller
                  name="numberOfArticle"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="numberOfArticle"
                      placeholder="Enter Number Of Article"
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                      className={errors.numberOfArticle ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.numberOfArticle && (
                  <span className="text-red-500">
                    {errors.numberOfArticle.message}
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

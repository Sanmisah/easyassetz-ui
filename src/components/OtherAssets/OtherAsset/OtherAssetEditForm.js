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
import { Button } from "@com/ui/button";
import { Input } from "@com/ui/input";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { PhoneInput } from "react-international-phone";
import Datepicker from "../../Beneficiarydetails/Datepicker";

const schema = z.object({
  nameOfAsset: z
    .string()
    .nonempty({ message: "Bank/Institution Name is required" }),
  assetDescription: z
    .string()
    .nonempty({ message: "Loan Account Number is required" }),
  additionalInformation: z
    .string()
    .nonempty({ message: "Guarantor Name is required" }),
  name: z.any().optional(),
  mobile: z.any().optional(),
  email: z.any().optional(),
});

const RecoverableEditForm = () => {
  const navigate = useNavigate();
  const { lifeInsuranceEditId } = useSelector((state) => state.counterSlice);
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nameOfAsset: "",
      assetDescription: "",
      additionalInformation: "",
      name: "",
      mobile: "",
      email: "",
    },
  });

  const {
    data: loanData,
    isLoading,
    isError,
  } = useQuery(
    ["loanData", id],
    async () => {
      const response = await axios.get(
        `/api/other-assets/${lifeInsuranceEditId}`,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      return response.data.data.OtherAsset;
    },
    {
      onSuccess: (data) => {
        Object.keys(data).forEach((key) => {
          if (schema.shape[key]) {
            setValue(key, data[key]);
          }
        });
      },
      onError: (error) => {
        console.error("Error fetching loan data:", error);
        toast.error("Failed to fetch loan data");
      },
    }
  );

  const loanMutate = useMutation({
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
      queryClient.invalidateQueries("loanData");
      toast.success("Loan updated successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error updating loan:", error);
      toast.error("Failed to update loan");
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    // const formatDate = (date) => {
    //   const d = new Date(date);
    //   const month = String(d.getMonth() + 1).padStart(2, "0");
    //   const day = String(d.getDate()).padStart(2, "0");
    //   const year = d.getFullYear();
    //   return `${month}/${day}/${year}`;
    // };

    // data.dueDate = formatDate(data.dueDate);

    loanMutate.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-2xl font-bold">
                Edit Other Asset Details
              </CardTitle>
              <CardDescription>
                Update the form to edit the Other Asset details.
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
                <Label htmlFor="nameOfAsset">Name of Assets</Label>
                <Controller
                  name="nameOfAsset"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="nameOfAsset"
                      placeholder="Enter Name of Assets"
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
              <div className="space-y-2">
                <Label htmlFor="assetDescription">Asset Description</Label>
                <Controller
                  name="assetDescription"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="assetDescription"
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
                    id="additionalInformation"
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
              <Label htmlFor="mobile">Mobile</Label>
              <Controller
                name="mobile"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    id="mobile"
                    type="tel"
                    placeholder="Enter Mobile"
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
            <div className="space-y-2">
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

            <CardFooter className="flex justify-end gap-2 mt-8">
              <Button type="submit">Submit</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecoverableEditForm;

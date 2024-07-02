import React, { useState } from "react";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { PhoneInput } from "react-international-phone";

const schema = z.object({
  employerName: z.string().nonempty({ message: "Employer Name is required" }),
  uanNumber: z.string().nonempty({ message: "UAN Number is required" }),
  bankName: z.string().nonempty({ message: "Bank Name is required" }),
  branch: z.string().optional(),
  bankAccountNumber: z
    .string()
    .nonempty({ message: "Bank Account Number is required" }),
  additionalDetails: z.string().optional(),
  pointOfContactName: z
    .string()
    .nonempty({ message: "Point of Contact Name is required" }),
  pointOfContactMobile: z
    .string()
    .nonempty({ message: "Point of Contact Mobile is required" }),
  pointOfContactEmail: z
    .string()
    .email({ message: "Invalid Email" })
    .nonempty({ message: "Point of Contact Email is required" }),
});

const EmployeeDetailsForm = () => {
  const navigate = useNavigate();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      employerName: "",
      uanNumber: "",
      bankName: "",
      branch: "",
      bankAccountNumber: "",
      additionalDetails: "",
      pointOfContactName: "",
      pointOfContactMobile: "",
      pointOfContactEmail: "",
    },
  });

  const employeeMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(`/api/employee`, data, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });
      return response.data.data.Employee;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("employeeData");
      toast.success("Employee details added successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error submitting employee details:", error);
      toast.error("Failed to submit employee details");
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    employeeMutate.mutate(data);
  };

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-2xl font-bold">
                Employee Details
              </CardTitle>
              <CardDescription>
                Fill out the form to add new employee details.
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
              <Label htmlFor="employerName">Employer Name</Label>
              <Controller
                name="employerName"
                control={control}
                render={({ field }) => (
                  <Input
                    id="employerName"
                    placeholder="Enter Employer Name"
                    {...field}
                    className={errors.employerName ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.employerName && (
                <span className="text-red-500">
                  {errors.employerName.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="uanNumber">UAN Number</Label>
              <Controller
                name="uanNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    id="uanNumber"
                    placeholder="Enter UAN Number"
                    {...field}
                    className={errors.uanNumber ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.uanNumber && (
                <span className="text-red-500">{errors.uanNumber.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Controller
                name="bankName"
                control={control}
                render={({ field }) => (
                  <Input
                    id="bankName"
                    placeholder="Enter Bank Name"
                    {...field}
                    className={errors.bankName ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.bankName && (
                <span className="text-red-500">{errors.bankName.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Controller
                name="branch"
                control={control}
                render={({ field }) => (
                  <Input
                    id="branch"
                    placeholder="Enter Branch"
                    {...field}
                    className={errors.branch ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.branch && (
                <span className="text-red-500">{errors.branch.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
              <Controller
                name="bankAccountNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    id="bankAccountNumber"
                    placeholder="Enter Bank Account Number"
                    {...field}
                    className={errors.bankAccountNumber ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.bankAccountNumber && (
                <span className="text-red-500">
                  {errors.bankAccountNumber.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalDetails">Additional Details</Label>
              <Controller
                name="additionalDetails"
                control={control}
                render={({ field }) => (
                  <Input
                    id="additionalDetails"
                    placeholder="Enter Additional Details"
                    {...field}
                    className={errors.additionalDetails ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.additionalDetails && (
                <span className="text-red-500">
                  {errors.additionalDetails.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUpload">Image Upload</Label>
              <Controller
                name="imageUpload"
                control={control}
                render={({ field }) => (
                  <Input
                    type="file"
                    id="imageUpload"
                    {...field}
                    className={errors.imageUpload ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.imageUpload && (
                <span className="text-red-500">
                  {errors.imageUpload.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pointOfContactName">Point of Contact Name</Label>
              <Controller
                name="pointOfContactName"
                control={control}
                render={({ field }) => (
                  <Input
                    id="pointOfContactName"
                    placeholder="Enter Point of Contact Name"
                    {...field}
                    className={
                      errors.pointOfContactName ? "border-red-500" : ""
                    }
                  />
                )}
              />
              {errors.pointOfContactName && (
                <span className="text-red-500">
                  {errors.pointOfContactName.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pointOfContactMobile">
                Point of Contact Mobile
              </Label>
              <Controller
                name="pointOfContactMobile"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    id="pointOfContactMobile"
                    type="tel"
                    placeholder="Enter Point of Contact Mobile"
                    defaultCountry="in"
                    inputStyle={{ minWidth: "15.5rem" }}
                    {...field}
                    className={
                      errors.pointOfContactMobile ? "border-red-500" : ""
                    }
                  />
                )}
              />
              {errors.pointOfContactMobile && (
                <span className="text-red-500">
                  {errors.pointOfContactMobile.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pointOfContactEmail">
                Point of Contact Email
              </Label>
              <Controller
                name="pointOfContactEmail"
                control={control}
                render={({ field }) => (
                  <Input
                    id="pointOfContactEmail"
                    placeholder="Enter Point of Contact Email"
                    {...field}
                    className={
                      errors.pointOfContactEmail ? "border-red-500" : ""
                    }
                  />
                )}
              />
              {errors.pointOfContactEmail && (
                <span className="text-red-500">
                  {errors.pointOfContactEmail.message}
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

export default EmployeeDetailsForm;

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

const schema = z.object({
  companyName: z.string().nonempty({ message: "Company Name is required" }),
  masterPolicyNumber: z
    .string()
    .nonempty({ message: "Master Policy Number is required" }),
  empNo: z.string().nonempty({ message: "Emp No/LIC ID No is required" }),
  address: z.string().optional(),
  annuityAmount: z.string().optional(),
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

const SuperAnnuationEditForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
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
      companyName: "",
      masterPolicyNumber: "",
      empNo: "",
      address: "",
      annuityAmount: "",
      additionalDetails: "",
      pointOfContactName: "",
      pointOfContactMobile: "",
      pointOfContactEmail: "",
    },
  });

  const {
    data: companyData,
    isLoading,
    isError,
  } = useQuery(
    ["companyData", id],
    async () => {
      const response = await axios.get(`/api/company/${id}`, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });
      return response.data.data.Company;
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
        console.error("Error fetching company data:", error);
        toast.error("Failed to fetch company data");
      },
    }
  );

  const companyMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(`/api/company/${id}`, data, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });
      return response.data.data.Company;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("companyData");
      toast.success("Company details updated successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error updating company details:", error);
      toast.error("Failed to update company details");
    },
  });

  const onSubmit = (data) => {
    companyMutate.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading company data</div>;

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-2xl font-bold">
                Edit Company Details
              </CardTitle>
              <CardDescription>
                Update the form to edit the company details.
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
              <Label htmlFor="companyName">Company Name</Label>
              <Controller
                name="companyName"
                control={control}
                render={({ field }) => (
                  <Input
                    id="companyName"
                    placeholder="Enter Company Name"
                    {...field}
                    className={errors.companyName ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.companyName && (
                <span className="text-red-500">
                  {errors.companyName.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="masterPolicyNumber">Master Policy Number</Label>
              <Controller
                name="masterPolicyNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    id="masterPolicyNumber"
                    placeholder="Enter Master Policy Number"
                    {...field}
                    className={
                      errors.masterPolicyNumber ? "border-red-500" : ""
                    }
                  />
                )}
              />
              {errors.masterPolicyNumber && (
                <span className="text-red-500">
                  {errors.masterPolicyNumber.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="empNo">Emp No/LIC ID No</Label>
              <Controller
                name="empNo"
                control={control}
                render={({ field }) => (
                  <Input
                    id="empNo"
                    placeholder="Enter Emp No/LIC ID No"
                    {...field}
                    className={errors.empNo ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.empNo && (
                <span className="text-red-500">{errors.empNo.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Input
                    id="address"
                    placeholder="Enter Address"
                    {...field}
                    className={errors.address ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.address && (
                <span className="text-red-500">{errors.address.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="annuityAmount">Annuity Amount</Label>
              <Controller
                name="annuityAmount"
                control={control}
                render={({ field }) => (
                  <Input
                    id="annuityAmount"
                    placeholder="Enter Annuity Amount"
                    {...field}
                    className={errors.annuityAmount ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.annuityAmount && (
                <span className="text-red-500">
                  {errors.annuityAmount.message}
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

export default SuperAnnuationEditForm;

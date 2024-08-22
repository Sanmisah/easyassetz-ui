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
import { useSelector } from "react-redux";

const schema = z.object({
  bankName: z
    .string()
    .nonempty({ message: "Bank/Institution Name is required" }),
  loanAccountNo: z
    .string()
    .nonempty({ message: "Loan Account Number is required" }),
  branch: z.any().optional(),
  emiDate: z.any().optional(),
  startDate: z.any().optional(),
  duration: z.any().optional(),
  guarantorName: z.any().optional(),
  guarantorMobile: z.any().optional(),

  guarantorEmail: z.any().optional(),
});

const PersonalLoanEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
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
      bankName: "",
      loanAccountNo: "",
      branch: "",
      emiDate: "",
      startDate: "",
      duration: "",
      guarantorName: "",
      guarantorMobile: "",
      guarantorEmail: "",
    },
  });

  const getPersonalData = async () => {
    if (!user) return;
    const response = await axios.get(
      `/api/personal-loans/${lifeInsuranceEditId}`,
      {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      }
    );
    setValue("bankName", response.data.data.PersonalLoan?.bankName);
    setValue("loanAccountNo", response.data.data.PersonalLoan?.loanAccountNo);
    setValue("branch", response.data.data.PersonalLoan?.branch);
    setValue("emiDate", response.data.data.PersonalLoan?.emiDate);
    setValue("startDate", response.data.data.PersonalLoan?.startDate);
    setValue("duration", response.data.data.PersonalLoan?.duration);
    setValue("guarantorName", response.data.data.PersonalLoan?.guarantorName);
    setValue(
      "guarantorMobile",
      response.data.data.PersonalLoan?.guarantorMobile
    );
    setValue("guarantorEmail", response.data.data.PersonalLoan?.guarantorEmail);
    return response.data.data.PersonalLoan;
  };

  const {
    data: loanData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["loanData", lifeInsuranceEditId],
    queryFn: getPersonalData,
    onSuccess: (data) => {
      console.log("Data:", data);
      setDefaultData(data);
      reset(data);
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile", error.message);
    },
  });

  const loanMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(
        `/api/personal-loans/${lifeInsuranceEditId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      return response.data.data.Loan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("loanData");
      toast.success("Personal Loan updated successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error updating loan:", error);
      toast.error("Failed to update loan");
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    const formatDate = (date) => {
      const d = new Date(date);
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const year = d.getFullYear();
      return `${month}/${day}/${year}`;
    };

    if (data.emiDate) {
      data.emiDate = formatDate(data.emiDate);
    }
    if (data.startDate) {
      data.startDate = formatDate(data.startDate);
    }

    loanMutate.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading loan data</div>;

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
               <div>
                <CardTitle className="text-2xl font-bold">
                  Edit Personal Loan Details
                </CardTitle>
                <CardDescription>
                  Update the form to edit the personal loan details.
                </CardDescription>
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
                <Label htmlFor="bankName">Name of Bank/Institution</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="bankName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="bankName"
                      placeholder="Enter Bank/Institution Name"
                      {...field}
                      className={errors.bankName ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.bankName && (
                  <span className="text-red-500">
                    {errors.bankName.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="loanAccountNo">Loan Account Number</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="loanAccountNo"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="loanAccountNo"
                      placeholder="Enter Loan Account Number"
                      {...field}
                      className={errors.loanAccountNo ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.loanAccountNo && (
                  <span className="text-red-500">
                    {errors.loanAccountNo.message}
                  </span>
                )}
              </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emiDate">EMI Date</Label>
                <Controller
                  name="emiDate"
                  control={control}
                  render={({ field }) => (
                    <Datepicker value={field.value} onChange={field.onChange} />
                  )}
                />
                {errors.emiDate && (
                  <span className="text-red-500">{errors.emiDate.message}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <Datepicker value={field.value} onChange={field.onChange} />
                  )}
                />
                {errors.startDate && (
                  <span className="text-red-500">
                    {errors.startDate.message}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Controller
                name="duration"
                control={control}
                render={({ field }) => (
                  <Input
                    id="duration"
                    placeholder="Enter Duration"
                    {...field}
                    className={errors.duration ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.duration && (
                <span className="text-red-500">{errors.duration.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="guarantorName">Guarantor Name</Label>
              <Controller
                name="guarantorName"
                control={control}
                render={({ field }) => (
                  <Input
                    id="guarantorName"
                    placeholder="Enter Guarantor Name"
                    {...field}
                    className={errors.guarantorName ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.guarantorName && (
                <span className="text-red-500">
                  {errors.guarantorName.message}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="guarantorMobile">Guarantor Mobile</Label>
              <Controller
                name="guarantorMobile"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    id="guarantorMobile"
                    type="tel"
                    placeholder="Enter Guarantor Mobile"
                    defaultCountry="in"
                    inputStyle={{ minWidth: "15.5rem" }}
                    {...field}
                    className={errors.guarantorMobile ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.guarantorMobile && (
                <span className="text-red-500">
                  {errors.guarantorMobile.message}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="guarantorEmail">Guarantor Email</Label>
              <Controller
                name="guarantorEmail"
                control={control}
                render={({ field }) => (
                  <Input
                    id="guarantorEmail"
                    placeholder="Enter Guarantor Email"
                    {...field}
                    className={errors.guarantorEmail ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.guarantorEmail && (
                <span className="text-red-500">
                  {errors.guarantorEmail.message}
                </span>
              )}
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

export default PersonalLoanEdit;

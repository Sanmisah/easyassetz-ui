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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { PhoneInput } from "react-international-phone";
import Datepicker from "../../Beneficiarydetails/Datepicker";

const schema = z.object({
  bankName: z
    .string()
    .nonempty({ message: "Bank/Institution Name is required" }),
  loanAccountNo: z
    .string()
    .nonempty({ message: "Loan Account Number is required" }),
  branch: z.any().optional(),
  emiDate: z.any({ message: "EMI Date is required" }),
  startDate: z.any({ message: "Start Date is required" }),
  duration: z.any().optional(),
  guarantorName: z.any().optional(),
  guarantorMobile: z.any().optional(),
  guarantorEmail: z.any().optional(),
});

const PersonalLoanOtherForm = () => {
  const navigate = useNavigate();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    control,
    register,
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

  const loanMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(`/api/personal-loans`, data, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });
      return response.data.data.PersonalLoan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("LoanData");
      toast.success("Personal Loan added successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error submitting loan:", error);
      toast.error("Failed to submit loan");
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    if (data.emiDate) {
      const date = new Date(data.emiDate);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();
      const newdate = `${month}/${day}/${year}`;
      data.emiDate = newdate;
    }
    if (data.startDate) {
      const date1 = new Date(data.startDate);
      const month1 = String(date1.getMonth() + 1).padStart(2, "0");
      const day1 = String(date1.getDate()).padStart(2, "0");
      const year1 = date1.getFullYear();
      const newdate1 = `${month1}/${day1}/${year1}`;
      data.startDate = newdate1;
    }
    loanMutate.mutate(data);
  };

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button onClick={() => navigate("/personalloan")}>Back</Button>
              <div>
                <CardTitle className="text-2xl font-bold">
                  Personal Loan Details
                </CardTitle>
                <CardDescription>
                  Fill out the form to add a new Personal Loan.
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
              <Label htmlFor="guaraHomentorName">Guarantor Name</Label>
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
              <Button type="submit">Submit</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalLoanOtherForm;

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
import { RadioGroup, RadioGroupItem } from "@com/ui/radio-group";

const schema = z.object({
  nameOfBorrower: z
    .string()
    .nonempty({ message: "Bank/Institution Name is required" }),
  address: z.string().nonempty({ message: "Loan Account Number is required" }),
  contactNumber: z.string().min(1, { message: "Contact Number is required" }),
  modeOfLoan: z.any().optional(),
  amount: z.any().optional(),
  dueDate: z.any().optional(),
  additionalInformation: z.any().optional(),
  type: z.any().optional(),
  chequeNumber: z.any().optional(),
  chequeIssuingBank: z.any().optional(),
});

const RecoverableOtherForm = () => {
  const navigate = useNavigate();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const [contactNumber, setContactNumber] = useState("");
  const [ShowCheckfields, setShowCheckfields] = useState(false);
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nameOfBorrower: "",
      address: "",
      contactNumber: "",
      modeOfLoan: "",
      duration: "",
      dueDate: "",
      additionalInformation: "",
      type: "recoverable",
    },
  });

  const loanMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(`/api/other-assets`, data, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });
      return response.data.data.Recoverable;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("LoanData");
      toast.success("Recoverable added successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error submitting loan:", error);
      toast.error("Failed to submit loan");
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    if (data.dueDate) {
      const date = new Date(data.dueDate);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();
      const newdate = `${month}/${day}/${year}`;
      data.dueDate = newdate;
    }
    data.type = "recoverable";
    loanMutate.mutate(data);
  };

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Recoverable
                </CardTitle>
                <CardDescription>
                  Fill out the form to add a new Recoverable.
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
                <Label htmlFor="nameOfBorrower">Name of Borrower</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="nameOfBorrower"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="nameOfBorrower"
                      placeholder="Enter Name of Borrower"
                      {...field}
                      className={errors.nameOfBorrower ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.nameOfBorrower && (
                  <span className="text-red-500">
                    {errors.nameOfBorrower.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Label style={{ color: "red" }}>*</Label>
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Label style={{ color: "red" }}>*</Label>
              <Controller
                name="contactNumber"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    id="contactNumber"
                    type="tel"
                    placeholder="Enter Contact Number"
                    defaultCountry="in"
                    inputStyle={{ minWidth: "15.5rem" }}
                    {...field}
                    className={errors.contactNumber ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.contactNumber && (
                <span className="text-red-500">
                  {errors.contactNumber.message}
                </span>
              )}
            </div>
            <div className="space-y-4 flex flex-col">
              <Label className="text-lg font-bold">Mode of Loan</Label>
              <Controller
                name="modeOfLoan"
                defaultValues="cash"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    defaultValue="cash"
                    onValueChange={(value) => {
                      field.onChange(value);
                      // setShowOtherJointName(value === "joint");
                      setShowCheckfields(value === "cheque");
                    }}
                    className="flex items-center gap-2"
                  >
                    <div className="flex items-center gap-2 text-center">
                      <RadioGroupItem id="cash" value="cash" />
                      <Label htmlFor="cash">Cash</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id="cheque" value="cheque" />
                      <Label htmlFor="cheque">Cheque</Label>
                    </div>
                  </RadioGroup>
                )}
              />
              {errors.modeOfLoan && (
                <span className="text-red-500">
                  {errors.modeOfLoan.message}
                </span>
              )}
            </div>
            {ShowCheckfields && (
              <>
                <div className="space-y-2">
                  <Label>Cheque Number</Label>
                  <Controller
                    name="chequeNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="chequeNumber"
                        placeholder="Enter cheque number"
                        {...field}
                        className={errors.chequeNumber ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors.chequeNumber && (
                    <span className="text-red-500">
                      {errors.chequeNumber.message}
                    </span>
                  )}
                </div>
                <div>
                  <Label>Cheque issuing Bank</Label>
                  <Controller
                    name="chequeIssuingBank"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="chequeIssuingBank"
                        placeholder="Enter cheque issuing bank"
                        {...field}
                        className={
                          errors.chequeIssuingBank ? "border-red-500" : ""
                        }
                      />
                    )}
                  />
                  {errors.chequeIssuingBank && (
                    <span className="text-red-500">
                      {errors.chequeIssuingBank.message}
                    </span>
                  )}
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <Input
                    id="amount"
                    placeholder="Enter Address"
                    {...field}
                    className={errors.amount ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.amount && (
                <span className="text-red-500">{errors.amount.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <Datepicker value={field.value} onChange={field.onChange} />
                )}
              />
              {errors.dueDate && (
                <span className="text-red-500">{errors.dueDate.message}</span>
              )}
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

export default RecoverableOtherForm;

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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { PhoneInput } from "react-international-phone";
import { RadioGroup, RadioGroupItem } from "@com/ui/radio-group";
import Datepicker from "../../Beneficiarydetails/Datepicker";

const schema = z.object({
  fdNumber: z.string().nonempty({ message: "Bank/Post Name is required" }),
  nameOfBank: z.string().optional(),
  branchName: z.string().optional(),
  maturityDate: z.any().optional(),
  maturityAmount: z.any().optional(),
  natureOfHolding: z.string().optional(),
  jointHolderName: z.any().optional(),
  jointHolderPan: z.any().optional(),
});
// additionalDetails: z.string().optional(),
const FocusableSelectTrigger = forwardRef((props, ref) => (
  <SelectTrigger ref={ref} {...props} />
));

FocusableSelectTrigger.displayName = "FocusableSelectTrigger";

const BankAccountForm = () => {
  const navigate = useNavigate();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const queryClient = useQueryClient();
  const [showJointHolderName, setShowJointHolderName] = useState(false);
  const [showOtherAccountType, setShowOtherAccountType] = useState(false);
  const [nomineeDetails, setNomineeDetails] = useState([]);
  const [nomineeError, setNomineeError] = useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fdNumber: "",
      ppfAccountNumber: "",
      branch: "",
      holdingNature: "",
      jointHolderName: "",
      additionalDetails: "",
      pointOfContactName: "",
      pointOfContactMobile: "",
      pointOfContactEmail: "",
    },
  });

  const ppfMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(`/api/ppf`, data, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });
      return response.data.data.PPF;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("PpfData");
      toast.success("PPF details added successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error submitting PPF details:", error);
      toast.error("Failed to submit PPF details");
    },
  });

  const onSubmit = (data) => {
    console.log(data);

    ppfMutate.mutate(data);
  };

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-2xl font-bold">
                Bank Account Details
              </CardTitle>
              <CardDescription>
                Fill out the form to add new Bank Account Details.
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
                <Label htmlFor="fdNumber">FD Number</Label>
                <Controller
                  name="fdNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="fdNumber"
                      placeholder="Enter Bank Name"
                      {...field}
                      className={errors.fdNumber ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.fdNumber && (
                  <span className="text-red-500">
                    {errors.fdNumber.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameOfBank">Name of Bank</Label>
                <Controller
                  name="nameOfBank"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="nameOfBank"
                      placeholder="Enter Name of Bank"
                      {...field}
                      className={errors.nameOfBank ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.nameOfBank && (
                  <span className="text-red-500">
                    {errors.nameOfBank.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="branchName">Branch Name</Label>
                <Controller
                  name="branchName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="branchName"
                      placeholder="Enter Branch Name"
                      {...field}
                      className={errors.branchName ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.branchName && (
                  <span className="text-red-500">
                    {errors.branchName.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="maturityDate">Maturity Date</Label>
                <Controller
                  name="maturityDate"
                  control={control}
                  render={({ field }) => (
                    <Datepicker
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      className={errors.maturityDate ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.maturityDate && (
                  <span className="text-red-500">
                    {errors.maturityDate.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="maturityAmount">Maturity Amount</Label>
                <Controller
                  name="maturityAmount"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="maturityAmount"
                      placeholder="Enter Maturity Amount"
                      {...field}
                      className={errors.maturityAmount ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.maturityAmount && (
                  <span className="text-red-500">
                    {errors.maturityAmount.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="natureOfHolding">Nature of Holding</Label>
                <Controller
                  name="natureOfHolding"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowJointHolderName(value === "joint");
                      }}
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2 text-center">
                        <RadioGroupItem id="single" value="single" />
                        <Label htmlFor="single">Single</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem id="joint" value="joint" />
                        <Label htmlFor="joint">Joint</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
                {errors.natureOfHolding && (
                  <span className="text-red-500">
                    {errors.natureOfHolding.message}
                  </span>
                )}
              </div>
            </div>

            {showJointHolderName && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jointHolderName">Joint Holder Name</Label>
                  <Controller
                    name="jointHolderName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="jointHolderName"
                        placeholder="Enter Joint Holder Name"
                        {...field}
                        className={
                          errors.jointHolderName ? "border-red-500" : ""
                        }
                      />
                    )}
                  />
                  {errors.jointHolderName && (
                    <span className="text-red-500">
                      {errors.jointHolderName.message}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jointHolderPan">Joint Holder PAN</Label>
                  <Controller
                    name="jointHolderPan"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="jointHolderPan"
                        placeholder="Enter Joint Holder PAN"
                        {...field}
                        className={
                          errors.jointHolderPan ? "border-red-500" : ""
                        }
                      />
                    )}
                  />
                  {errors.jointHolderPan && (
                    <span className="text-red-500">
                      {errors.jointHolderPan.message}
                    </span>
                  )}
                </div>
              </div>
            )}

            <CardFooter className="flex justify-end gap-2 mt-8">
              <Button type="submit">Submit</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankAccountForm;

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
import Addnominee from "@/components/Nominee/addNominee";
import cross from "@/components/image/close.png";

const schema = z.object({
  fixDepositeNumber: z
    .string()
    .nonempty({ message: "Bank/Post Name is required" }),
  bankName: z.string().nonempty({ message: "Bank Name is required" }),
  branchName: z.string().optional(),
  maturityDate: z.any().optional(),
  maturityAmount: z.any().optional(),
  holdingType: z.string().optional(),
  jointHolderName: z.any().optional(),
  jointHolderPan: z.any().optional(),
  additionalDetails: z.string().optional(),
  image: z.any().optional(),
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
  const [displaynominie, setDisplaynominie] = useState([]);
  const [selectedNommie, setSelectedNommie] = useState([]);
  const [nomineeError, setNomineeError] = useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fixDepositeNumber: "",
      bankName: "",
      branchName: "",
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
      const formData = new FormData();
      for (const [key, value] of Object.entries(data)) {
        formData.append(key, value);
      }
      const response = await axios.post(`/api/fix-deposits`, formData, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });
      return response.data.data.FixDeposite;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("PpfData");
      toast.success("Fix Deposit added successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error submitting PPF details:", error);
      toast.error("Failed to submit PPF details");
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    if (data.maturityDate) {
      const date = new Date(data.maturityDate);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();
      const newdate = `${month}/${day}/${year}`;
      data.maturityDate = newdate;
    }
    ppfMutate.mutate(data);
  };

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button onClick={() => navigate("/fixdeposit")}>Back</Button>
              <div>
                <CardTitle className="text-2xl font-bold">
                  Fix Deposit Details
                </CardTitle>
                <CardDescription>
                  Fill out the form to add new Fix Deposit Details.
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
                <Label htmlFor="fixDepositeNumber">FD Number</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="fixDepositeNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="fixDepositeNumber"
                      placeholder="Enter Bank Name"
                      {...field}
                      className={
                        errors.fixDepositeNumber ? "border-red-500" : ""
                      }
                    />
                  )}
                />
                {errors.fixDepositeNumber && (
                  <span className="text-red-500">
                    {errors.fixDepositeNumber.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankName">Name of Bank</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="bankName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="bankName"
                      placeholder="Enter Name of Bank"
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
                <Label style={{ color: "red" }}>*</Label>
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
                <Label htmlFor="additionalDetails">Additional Details</Label>
                <Controller
                  name="additionalDetails"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="additionalDetails"
                      placeholder="Enter Additional Details"
                      {...field}
                      className={
                        errors.additionalDetails ? "border-red-500" : ""
                      }
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
                <Label htmlFor="holdingType">Nature of Holding</Label>
                <Controller
                  name="holdingType"
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
                {errors.holdingType && (
                  <span className="text-red-500">
                    {errors.holdingType.message}
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
            {displaynominie && displaynominie.length > 0 && (
              <div className="space-y-2">
                <div className="grid gap-4 py-4">
                  {console.log(displaynominie)}
                  <Label className="text-lg font-bold">Selected Nominees</Label>
                  {displaynominie &&
                    displaynominie.map((nominee) => (
                      <div className="flex space-y-2 border border-input p-4 justify-between pl-4 pr-4 items-center rounded-lg">
                        <Label htmlFor={`nominee-${nominee?.id}`}>
                          {nominee?.fullLegalName || nominee?.charityName}
                        </Label>
                        <img
                          className="w-4 h-4 cursor-pointer"
                          onClick={() => {
                            setDisplaynominie(
                              displaynominie.filter(
                                (item) => item.id !== nominee.id
                              )
                            );
                            setSelectedNommie(
                              selectedNommie.filter(
                                (item) => item.id !== nominee.id
                              )
                            );
                          }}
                          src={cross}
                          alt=""
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="registered-mobile" className="text-lg font-bold">
                Add nominee
              </Label>
              <Addnominee
                setDisplaynominie={setDisplaynominie}
                setSelectedNommie={setSelectedNommie}
                displaynominie={displaynominie}
              />
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

export default BankAccountForm;

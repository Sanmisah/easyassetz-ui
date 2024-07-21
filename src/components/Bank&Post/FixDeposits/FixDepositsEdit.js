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
import { RadioGroup, RadioGroupItem } from "@com/ui/radio-group";
import Datepicker from "../../Beneficiarydetails/Datepicker";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { setlifeInsuranceEditId } from "@/Redux/sessionSlice";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import cross from "@/components/image/close.png";
import { PhoneInput } from "react-international-phone";

const schema = z.object({
  fixDepositeNumber: z
    .string()
    .nonempty({ message: "Bank/Post Name is required" }),
  bankName: z.string().optional(),
  branchName: z.string().optional(),
  maturityDate: z.any().optional(),
  maturityAmount: z.any().optional(),
  holdingType: z.string().optional(),
  jointHolderName: z.any().optional(),
  jointHolderPan: z.any().optional(),
  additionalDetails: z.string().optional(),
});

const BankEditForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const { lifeInsuranceEditId } = useSelector((state) => state.counterSlice);

  console.log(lifeInsuranceEditId);
  useEffect(() => {
    if (lifeInsuranceEditId) {
      console.log("lifeInsuranceEditId:", lifeInsuranceEditId);
    }
  }, [lifeInsuranceEditId]);
  const [showOtherInsuranceCompany, setShowOtherInsuranceCompany] =
    useState(false);
  const [showOtherRelationship, setShowOtherRelationship] = useState(false);
  const [showJointHolderName, setShowJointHolderName] = useState(false);
  const [hideRegisteredFields, setHideRegisteredFields] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);
  const [brokerSelected, setBrokerSelected] = useState(false);
  const [selectedNommie, setSelectedNommie] = useState([]);
  const [displaynominie, setDisplaynominie] = useState([]);

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {},
  });

  const getPersonalData = async () => {
    if (!user) return;
    const response = await axios.get(
      `/api/fix-deposits/${lifeInsuranceEditId}`,
      {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      }
    );
    console.log(typeof response.data.data.MotorInsurance?.premium);
    let data = response.data.data.MotorInsurance;
    if (data.holdingType === "joint") {
      setShowJointHolderName(true);
      setValue("jointHolderName", data.jointHolderName);
      setValue("jointHolderPan", data.jointHolderPan);
    }

    return response.data.data.FixDeposite;
  };

  const {
    data: Benifyciary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lifeInsuranceDataUpdate", lifeInsuranceEditId],
    queryFn: getPersonalData,

    onSuccess: (data) => {
      if (data.modeOfPurchase === "broker") {
        setBrokerSelected(true);
        setHideRegisteredFields(false);
      }
      if (data.modeOfPurchase === "e-insurance") {
        setBrokerSelected(false);
        setHideRegisteredFields(true);
      }
      setDefaultValues(data);
      reset(data);
      setValue(data);
      setValue("fixDepositeNumber", data.fixDepositeNumber);
      setValue("bankName", data.bankName);
      setValue("branchName", data.branchName);
      setValue("maturityDate", data.maturityDate);
      setValue("maturityAmount", data.maturityAmount);
      setValue("holdingType", data.holdingType);
      setValue("jointHolderName", data.jointHolderName);
      setValue("jointHolderPan", data.jointHolderPan);

      // Set fetched values to the form
      for (const key in data) {
        setValue(key, data[key]);
      }

      setShowOtherInsuranceCompany(data.companyName === "other");
      setShowOtherRelationship(data.vehicleType === "other");

      console.log(data);
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile", error.message);
    },
  });

  const lifeInsuranceMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(
        `/api/fix-deposits/${lifeInsuranceEditId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      return response.data.data.FixDeposite;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(
        "lifeInsuranceDataUpdate",
        lifeInsuranceEditId
      );
      toast.success("motorinsurance added successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile");
    },
  });
  useEffect(() => {
    console.log("Form values:", control._formValues);
  }, [control._formValues]);

  useEffect(() => {
    if (Benifyciary?.nominees) {
      setDisplaynominie(Benifyciary?.nominees);
    }
  }, [Benifyciary?.nominees]);
  const onSubmit = (data) => {
    if (data.holdingType === "single") {
      data.jointHolderName = null;
      data.jointHolderPan = null;
    }

    console.log(data);
    const date = new Date(data.maturityDate);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    const newdate = `${month}/${day}/${year}`;
    data.maturityDate = newdate;
    if (data.vehicleType === "other") {
      data.vehicleType = data.specificVehicalType;
    }
    console.log("brokerName:", data.brokerName);
    if (selectedNommie.length > 0) {
      data.nominees = selectedNommie;
    }
    lifeInsuranceMutate.mutate(data);
  };

  useEffect(() => {
    console.log(Benifyciary);
  }, [Benifyciary]);
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading insurance data</div>;
  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-2xl font-bold">
                Insurance Policy Details
              </CardTitle>
              <CardDescription>
                Edit the form to update the insurance policy details.
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
                <Label htmlFor="fixDepositeNumber">FD Number</Label>
                <Controller
                  name="fixDepositeNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="fixDepositeNumber"
                      placeholder="Enter Bank/Post Name"
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

export default BankEditForm;

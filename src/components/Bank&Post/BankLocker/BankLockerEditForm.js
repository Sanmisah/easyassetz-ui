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
import Addnominee from "@/components/Nominee/EditNominee";
import cross from "@/components/image/close.png";
import { PhoneInput } from "react-international-phone";
import AddNominee from "@/components/Nominee/EditNominee";

const schema = z
  .object({
    bankName: z.string().nonempty({ message: "Insurance Company is required" }),
    accountType: z.string().optional(),
    lockerNumber: z
      .string()
      .nonempty({ message: "Insurance Sub Type is required" }),

    jointHolderName: z.any().optional(),
    jointHolderPan: z.any().optional(),
    rentDue: z.any().optional(),
    annualRent: z.any().optional(),
    additionalDetails: z.any().optional(),
    branch: z.string().min(2, { message: "Policy Number is required" }),
    natureOfHolding: z.any().optional(),
  })
  .refine(
    (data) => {
      if (data.modeOfPurchase === "broker") {
        return (
          !!data.brokerName &&
          !!data.contactPerson &&
          !!data.contactNumber &&
          !!data.email
        );
      }
      if (data.modeOfPurchase === "e-insurance") {
        return !!data.registeredMobile && !!data.registeredEmail;
      }
      return true;
    },
    {
      message: "Required fields are missing",
      path: ["modeOfPurchase"],
    }
  );

const EditMotorForm = () => {
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
  const [hideRegisteredFields, setHideRegisteredFields] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);
  const [brokerSelected, setBrokerSelected] = useState(false);
  const [selectedNommie, setSelectedNommie] = useState([]);
  const [displaynominie, setDisplaynominie] = useState([]);
  const [showJointHolderName, setShowJointHolderName] = useState(false);

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
      `/api/bank-lockers/${lifeInsuranceEditId}`,
      {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      }
    );
    let data = response.data.data.BankLocker;
    setValue("bankName", data.bankName);
    setValue("branch", data.branch);
    setValue("lockerNumber", data.lockerNumber);
    setValue("rentDue", data.rentDue);
    setValue("annualRent", data.annualRent);
    setValue("additionalDetails", data.additionalDetails);
    setValue("natureOfHolding", data.natureOfHolding);
    setValue("jointHolderName", data.jointHolderName);
    setValue("jointHolderPan", data.jointHolderPan);

    return response.data.data.BankLocker;
  };

  const {
    data: Benifyciary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lifeInsuranceDataUpdate", lifeInsuranceEditId],
    queryFn: getPersonalData,

    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile", error.message);
    },
  });

  const lifeInsuranceMutate = useMutation({
    mutationFn: async (data) => {
      console.log("data:", data);
      const formData = new FormData();
      for (const [key, value] of Object.entries(data)) {
        formData.append(key, value);
      }
      formData.append("_method", "put");

      const response = await axios.post(
        `/api/motor-insurances/${lifeInsuranceEditId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      return response.data.data.MotorInsurances;
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

  const onSubmit = (data) => {
    if (data.companyName === "other") {
      data.companyName = data.otherInsuranceCompany;
    }
    if (data.modeOfPurchase === "broker") {
      data.registeredMobile = null;
      data.registeredEmail = null;
    }
    if (data.modeOfPurchase === "e-insurance") {
      data.brokerName = null;
      data.contactPerson = null;
      data.contactNumber = null;
      data.email = null;
    }
    const date = new Date(data.expiryDate);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    const newdate = `${month}/${day}/${year}`;
    data.expiryDate = newdate;
    if (data.vehicleType === "other") {
      data.vehicleType = data.specificVehicalType;
    }
    if (selectedNommie.length > 0) {
      data.nominees = selectedNommie;
    }
    lifeInsuranceMutate.mutate(data);
  };

  const handleUploadFile = () => {
    window.open(
      `/storage/motorinsurance/aadharFile/${Benifyciary?.aadharFile}`
    );
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
                Motor Insurance Policy Details
              </CardTitle>
              <CardDescription>
                Edit the form to update the Motor Insurance policy details.
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
                <Label>Bank Name</Label>
                <Controller
                  name="bankName"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="bankName"
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherCompanyRegistration(true);
                      }}
                      className={errors.bankName ? "border-red-500" : ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select bank name" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="company1">Company 1</SelectItem>
                        <SelectItem value="company2">Company 2</SelectItem>
                        <SelectItem value="company3">Company 3</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.bankName && (
                  <span className="text-red-500">
                    {errors.bankName.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Branch</Label>
                <Controller
                  name="branch"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="branch"
                      placeholder="Enter Branch Name"
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
                <Label>Locker Number</Label>
                <Controller
                  name="lockerNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="lockerNumber"
                      placeholder="Enter Locker Number"
                      {...field}
                      className={errors.lockerNumber ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.lockerNumber && (
                  <span className="text-red-500">
                    {errors.lockerNumber.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Rent Due</Label>
                <Controller
                  name="rentDue"
                  control={control}
                  render={({ field }) => (
                    <Datepicker
                      value={field.value}
                      onChange={field.onChange}
                      className="min-w-[190rem]"
                    />
                  )}
                />
                {errors.rentDue && (
                  <span className="text-red-500">{errors.rentDue.message}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Annual Rent</Label>
                <Controller
                  name="annualRent"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="annualRent"
                      placeholder="Enter Annual Rent"
                      {...field}
                      className={errors.annualRent ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.annualRent && (
                  <span className="text-red-500">
                    {errors.annualRent.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Additional Details</Label>
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
                <Label>Nature of Holding</Label>
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
                <div className="space-y-2   col-span-full">
                  <div className="grid gap-4 py-4">
                    {console.log(displaynominie)}
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

              <div className="space-y-2 col-span-full">
                <Label htmlFor="registered-mobile">Add nominee</Label>
                {console.log(Benifyciary?.nominees)}
                <Addnominee
                  setSelectedNommie={setSelectedNommie}
                  AllNominees={Benifyciary?.nominees}
                  selectedNommie={selectedNommie}
                  displaynominie={displaynominie}
                  setDisplaynominie={setDisplaynominie}
                />{" "}
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

export default EditMotorForm;

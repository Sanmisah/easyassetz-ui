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

const schema = z
  .object({
    bankName: z.string().nonempty({ message: "Insurance Company is required" }),
    accountType: z.string().optional(),
    accountNumber: z
      .string()
      .nonempty({ message: "Insurance Sub Type is required" }),
    branchName: z.string().min(2, { message: "Policy Number is required" }),
    city: z.any().optional(),
    holdingType: z.any().optional(),
    jointHolderName: z.any().optional(),
    jointHolderPan: z.any().optional(),
    additionalDetails: z.any().optional(),
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
      `/api/motor-insurances/${lifeInsuranceEditId}`,
      {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      }
    );
    let data = response.data.data.MotorInsurance;
    if (data.modeOfPurchase === "e-insurance") {
      setValue("modeOfPurchase", data.e - insurance);
    }
    if (data.modeOfPurchase === "broker") {
      setValue("modeOfPurchase", data.broker);
    }
    if (
      data.companyName !== "company1" &&
      data.companyName !== "company2" &&
      data.companyName !== "company3"
    ) {
      setShowOtherInsuranceCompany(true);
      setValue("companyName", "other");
      setValue("otherInsuranceCompany", data.companyName);
    }
    if (response.data.data.MotorInsurance?.modeOfPurchase === "broker") {
      setBrokerSelected(true);
      setHideRegisteredFields(false);
    }
    if (response.data.data.MotorInsurance?.modeOfPurchase === "e-insurance") {
      setBrokerSelected(false);
      setHideRegisteredFields(true);
    }
    setValue(
      "registeredEmail",
      response.data.data.MotorInsurance?.registeredEmail
    );
    if (
      response.data.data.MotorInsurance?.vehicleType !== "twowheeler" ||
      response.data.data.MotorInsurance?.vehicleType !== "threewheeler" ||
      response.data.data.MotorInsurance?.vehicleType !== "fourwheeler"
    ) {
      setShowOtherRelationship(true);
      setValue("vehicleType", "other");
    }
    setValue(
      "expiryDate",
      new Date(response.data.data.MotorInsurance?.expiryDate)
    );
    setSelectedNommie(
      response.data.data.MotorInsurance?.nominees?.map((nominee) => nominee.id)
    );
    console.log(typeof response.data.data.MotorInsurance?.premium);
    return response.data.data.MotorInsurance;
  };

  const {
    data: Benifyciary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lifeInsuranceDataUpdate", lifeInsuranceEditId],
    queryFn: getPersonalData,

    onSuccess: (data) => {
      if (
        data.vehicleType !== "twowheeler" ||
        data.vehicleType !== "threewheeler" ||
        data.vehicleType !== "fourwheeler"
      ) {
        console.log("SP SASA");
        setShowOtherRelationship(true);
        setValue("vehicleType", "other");
      }
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
      setValue("vehicleType", data.vehicleType);
      setValue("specificVehicalType", data.specificVehicalType);
      setValue("registeredMobile", data.registeredMobile);
      setValue("additionalDetails", data.additionalDetails);
      setValue("previousPolicyNumber", data.previousPolicyNumber);
      setValue("policyNumber", data.policyNumber);
      setValue("expiryDate", new Date(data.expiryDate));
      setValue("premium", data.premium);
      // setValue("sumInsured", data.sumInsured);
      setValue("insurerName", data.insurerName);
      setValue("modeOfPurchase", data.modeOfPurchase);
      setValue("contactPerson", data.contactPerson);
      setValue("contactNumber", data.contactNumber);
      setValue("email", data.email);
      setValue("registeredMobile", data.registeredMobile);
      setValue("additionalDetails", data.additionalDetails);
      setValue("previousPolicyNumber", data.previousPolicyNumber);
      setValue("brokerName", data.brokerName);
      setValue("contactPerson", data.contactPerson);
      setValue("contactNumber", data.contactNumber);

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

  // useEffect(() => {
  //   if (Benifyciary) {
  //     const defaultValues = {
  //       ...Benifyciary,
  //       expiryDate: new Date(Benifyciary.expiryDate)
  //     };
  //     reset(defaultValues);
  //     setShowOtherInsuranceCompany(Benifyciary.companyName === "other");
  //     setShowOtherRelationship(Benifyciary.vehicleType === "other");
  //   }
  // }, [Benifyciary, reset]);

  const onSubmit = async (data) => {
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
    await lifeInsuranceMutate.mutateAsync(data);
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
                <Label htmlFor="bankName">Name of Bank/Institution</Label>
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
                <Label htmlFor="accountType">Account Type</Label>
                <Controller
                  name="accountType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="accountType"
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherAccountType(value === "other");
                      }}
                      className={errors.accountType ? "border-red-500" : ""}
                    >
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </FocusableSelectTrigger>
                      <SelectContent>
                        <SelectItem value="saving">Saving</SelectItem>
                        <SelectItem value="current">Current</SelectItem>
                        <SelectItem value="recurring">Recurring</SelectItem>
                        <SelectItem value="nri">NRI</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {showOtherAccountType && (
                  <Controller
                    name="otherAccountType"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Account Type"
                        className="mt-2"
                      />
                    )}
                  />
                )}
                {errors.accountType && (
                  <span className="text-red-500">
                    {errors.accountType.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Controller
                  name="accountNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="accountNumber"
                      placeholder="Enter Account Number"
                      {...field}
                      className={errors.accountNumber ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.accountNumber && (
                  <span className="text-red-500">
                    {errors.accountNumber.message}
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
                <Label htmlFor="city">City</Label>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="city"
                      placeholder="Enter Branch Name"
                      {...field}
                      className={errors.city ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.city && (
                  <span className="text-red-500">{errors.city.message}</span>
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
                <Controller
                  name="jointHolderName"
                  control={control}
                  defaultValue={Benifyciary?.jointHolderName || ""}
                  render={({ field }) => (
                    <Input
                      id="jointHolderName"
                      placeholder="Enter Joint Holder Name"
                      {...field}
                      className={errors.jointHolderName ? "border-red-500" : ""}
                    />
                  )}
                />
              )}
              {errors.jointHolderName && (
                <span className="text-red-500">
                  {errors.jointHolderName.message}
                </span>
              )}
              {showJointHolderName && (
                <div className="space-y-2">
                  <Label htmlFor="jointHolderPan">Joint Holder PAN</Label>
                  <Controller
                    name="jointHolderPan"
                    control={control}
                    defaultValue={Benifyciary?.jointHolderPan || ""}
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
              )}
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
              <Button id="submitButton" type="submit">
                Submit
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditMotorForm;

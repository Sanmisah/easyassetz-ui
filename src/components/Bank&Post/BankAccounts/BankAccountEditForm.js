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
import Editnominee from "@/components/Nominee/EditNominee";

const FocusableSelectTrigger = forwardRef((props, ref) => (
  <SelectTrigger ref={ref} {...props} />
));

const schema = z.object({
  bankName: z.string().nonempty({ message: "Insurance Company is required" }),
  accountType: z
    .string()
    .nonempty({ message: "Insurance Sub Type is required" }),
  accountNumber: z.string().nonempty({ message: "Policy Number is required" }),
  branchName: z.any().optional(),
  otherAccountType: z.any().optional(),
  otherBankName: z.any().optional(),
  city: z.any().optional(),
  holdingType: z.any().optional(),
  jointHolderName: z.any().optional(),
  jointHolderPan: z.any().optional(),
  image: z.any().optional(),
});

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
  const [showOtherBankName, setShowOtherBankName] = useState(false);
  const [showOtherAccountType, setShowOtherAccountType] = useState(false);
  const [showJointHolderName, setShowJointHolderName] = useState(false);
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
      `/api/bank-accounts/${lifeInsuranceEditId}`,
      {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      }
    );

    let data = response.data.data.BankAccount;
    setValue("bankName", data.bankName);
    setValue("accountType", data.accountType);
    if (data.holdingType === "joint") {
      setShowJointHolderName(true);
      setValue("holdingType", data.holdingType);
      setValue("jointHolderName", data.jointHolderName);
      setValue("jointHolderPan", data.jointHolderPan);
    }
    if (
      data.accountType === "saving" ||
      data.accountType === "current" ||
      data.accountType === "recurring" ||
      data.accountType === "nri"
    ) {
      setShowOtherAccountType(false);
      setValue("accountType", data.accountType);
    } else {
      setShowOtherAccountType(true);
      setValue("accountType", "other");
      setValue("otherAccountType", data.accountType);
    }
    // if (
    //   data.accountType !== "saving" ||
    //   data.accountType !== "current" ||
    //   data.accountType !== "recurring" ||
    //   data.accountType !== "nri"
    // ) {
    //   setShowOtherAccountType(true);
    //   setValue("accountType", "other");
    //   setValue("otherAccountType", data.accountType);
    // }
    // if (
    //   data.bankName !== "company1" ||
    //   data.bankName !== "company2" ||
    //   data.bankName !== "company3"
    // ) {
    //   setShowOtherBankName(true);
    //   setValue("bankName", "other");
    //   setValue("otherBankName", data.bankName);
    // }

    if (
      data.bankName === "company1" ||
      data.bankName === "company2" ||
      data.bankName === "company3"
    ) {
      setShowOtherBankName(false);
      setValue("bankName", data.bankName);
    } else {
      setShowOtherBankName(true);
      setValue("bankName", "other");
      setValue("otherBankName", data.bankName);
    }
    setValue("accountNumber", data.accountNumber);
    setValue("branchName", data.branchName);
    setValue("city", data.city);
    setValue("holdingType", data.holdingType);
    setValue("jointHolderName", data.jointHolderName);
    setValue("jointHolderPan", data.jointHolderPan);
    setSelectedNommie(data.nominees.map((nominee) => nominee.id));

    return response.data.data.BankAccount;
  };

  const {
    data: Benifyciary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lifeInsuranceDataUpdate", lifeInsuranceEditId],
    queryFn: getPersonalData,

    onSuccess: (data) => {
      console.log("Data:", data);
      setDefaultValues(data);
      reset(data);
      setValue(bankName, data.bankName);
      setValue("accountType", data.accountType);
      setValue("accountNumber", data.accountNumber);
      setValue("branchName", data.branchName);
      setValue("city", data.city);
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
      console.log("data:", data);
      const formData = new FormData();
      for (const [key, value] of Object.entries(data)) {
        formData.append(key, value);
      }
      formData.append("_method", "put");

      const response = await axios.post(
        `/api/bank-accounts/${lifeInsuranceEditId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      return response.data.data.BankAccount;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(
        "lifeInsuranceDataUpdate",
        lifeInsuranceEditId
      );
      toast.success("Bank Account updated successfully!");
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

  const onSubmit = (data) => {
    if (data.bankName === "other") {
      data.bankName = data.otherBankName;
    }
    if (data.accountType === "other") {
      data.accountType = data.otherAccountType;
    }
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
  if (isError) return <div>Error loading Bank Account data</div>;
  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
               <div>
                <CardTitle className="text-2xl font-bold">
                  Edit Bank Account Details
                </CardTitle>
                <CardDescription>
                  Fill out the form to edit new bank account details.
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
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Controller
                name="bankName"
                control={control}
                render={({ field }) => (
                  <Select
                    id="bankName"
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setShowOtherBankName(value === "other");
                    }}
                    className={errors.bankName ? "border-red-500" : ""}
                  >
                    <FocusableSelectTrigger>
                      <SelectValue placeholder="Select Bank Name" />
                    </FocusableSelectTrigger>
                    <SelectContent>
                      <SelectItem value="company1">Company 1</SelectItem>
                      <SelectItem value="company2">Company 2</SelectItem>
                      <SelectItem value="company3">Company 3</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {showOtherBankName && (
                <Controller
                  name="otherBankName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Specify Bank Name"
                      className="mt-2"
                    />
                  )}
                />
              )}
              {errors.bankName && (
                <span className="text-red-500">{errors.bankName.message}</span>
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
                      <SelectValue placeholder="Select Account Type" />
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
              <Label style={{ color: "red" }}>*</Label>
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
                        value={field.value?.toUpperCase() || ""}
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
                                (item) => item !== nominee.id
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
              <Label htmlFor="registered-mobile">Add nominee</Label>
              {console.log(Benifyciary?.nominees)}
              <Editnominee
                setSelectedNommie={setSelectedNommie}
                AllNominees={Benifyciary?.nominees}
                selectedNommie={selectedNommie}
                displaynominie={displaynominie}
                setDisplaynominie={setDisplaynominie}
              />{" "}
            </div>
            <div className="space-y-2">
              <Label>Upload File</Label>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <Input
                    id="file"
                    type="file"
                    onChange={(event) => {
                      field.onChange(
                        event.target.files && event.target.files[0]
                      );
                    }}
                    className={errors.file ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.file && (
                <span className="text-red-500">{errors.file.message}</span>
              )}
            </div>
            <div>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(`/api/file/${Benifyciary?.image}`);
                }}
              >
                View Attachment
              </Button>
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

export default EditMotorForm;

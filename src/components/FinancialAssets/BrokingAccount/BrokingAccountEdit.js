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
  // bankServiceProvider: z
  //   .string()
  //   .nonempty({ message: "Bank Service Provider is required" }),
  brokerName: z.string().nonempty({ message: "Broker Name is required" }),
  brokingAccountNumber: z
    .string()
    .nonempty({ message: "Broking Account Number is required" }),
  // numberOfDebentures: z
  //   .string()
  //   .nonempty({ message: "No of Debentures is required" }),
  // certificateNumber: z.any().optional(),
  // distinguishNoFrom: z.any().optional(),
  // distinguishNoTo: z.any().optional(),
  // faceValue: z.any().optional(),
  // myStatus: z.string().nonempty({ message: "My Status is required" }),
  natureOfHolding: z
    .string()
    .nonempty({ message: "Nature of Holding is required" }),
  jointHolderName: z.any().optional(),
  jointHolderPan: z.any().optional(),
  // documentAvailability: z
  //   .string()
  //   .nonempty({ message: "Document Availability is required" }),
  additionalDetails: z.string().optional(),
  // typeOfInvestment: z
  //   .string()
  //   .nonempty({ message: "Type of Investment is required" }),
  name: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().optional(),
  image: z.any().optional(),
});

const PSSEditForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const getitem = localStorage.getItem("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
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
  // const [showOtherBankName, setShowOtherBankName] = useState(false);
  // const [showOtherAccountType, setShowOtherAccountType] = useState(false);
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
      `/api/broking-accounts/${lifeInsuranceEditId}`,
      {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      }
    );

    let data = response.data.data.BrokingAccount;
    // setValue("bankServiceProvider", data.bankServiceProvider);
    setValue("brokerName", data.brokerName);
    setValue("brokingAccountNumber", data.brokingAccountNumber);
    // setValue("numberOfDebentures", data.numberOfDebentures);
    // setValue("certificateNumber", data.certificateNumber);
    // setValue("distinguishNoFrom", data.distinguishNoFrom);
    // setValue("distinguishNoTo", data.distinguishNoTo);
    // setValue("faceValue", data.faceValue);
    setValue("natureOfHolding", data.natureOfHolding);
    setValue("jointHolderName", data.jointHolderName);
    setValue("jointHolderPan", data.jointHolderPan);
    if (data.natureOfHolding === "joint") {
      setShowJointHolderName(true);
      setValue("natureOfHolding", data.natureOfHolding);
      setValue("jointHolderName", data.jointHolderName);
      setValue("jointHolderPan", data.jointHolderPan);
      setValue("name", data.name);
      setValue("email", data.email);
      setValue("mobile", data.mobile);
    }
    setSelectedNommie(data.nominees.map((nominee) => nominee.id));

    return response.data.data.BrokingAccount;
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
      // setValue("bankServiceProvider", data.bankServiceProvider);
      setValue("brokerName", data.brokerName);
      setValue("brokingAccountNumber", data.brokingAccountNumber);
      // setValue("numberOfDebentures", data.numberOfDebentures);
      // setValue("certificateNumber", data.certificateNumber);
      // setValue("distinguishNoFrom", data.distinguishNoFrom);
      // setValue("distinguishNoTo", data.distinguishNoTo);
      // setValue("faceValue", data.faceValue);
      setValue("natureOfHolding", data.natureOfHolding);
      setValue("jointHolderName", data.jointHolderName);
      setValue("jointHolderPan", data.jointHolderPan);
      setValue("name", data.name);
      setValue("mobile", data.mobile);
      setValue("email", data.email);

      // Set fetched values to the form
      for (const key in data) {
        setValue(key, data[key]);
      }

      // setShowOtherRelationship(data.type === "other");

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
        `/api/broking-accounts/${lifeInsuranceEditId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      return response.data.data.BrokingAccount;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(
        "lifeInsuranceDataUpdate",
        lifeInsuranceEditId
      );
      toast.success("Broking Account details added successfully!");
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
  //     setShowOtherInsuranceCompany(Benifyciary.brokerName === "other");
  //     setShowOtherRelationship(Benifyciary.vehicleType === "other");
  //   }
  // }, [Benifyciary, reset]);

  const onSubmit = (data) => {
    // if (data.type === "other") {
    //   data.type = data.otherType;
    // }

    if (selectedNommie.length > 0) {
      data.nominees = selectedNommie;
    }
    lifeInsuranceMutate.mutate(data);
  };

  useEffect(() => {
    console.log(Benifyciary);
  }, [Benifyciary]);
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading Broking Account Details data</div>;
  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <Button onClick={() => navigate("/broking-account")}>Back</Button>
              <div>
                <CardTitle className="text-2xl font-bold">
                  Broking Account Details
                </CardTitle>
                <CardDescription>
                  Edit the form to update the Broking Account Details.
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
            {/* <div className="space-y-2">
              <Label htmlFor="bankServiceProvider">Bank Service Provider</Label>
              <Controller
                name="bankServiceProvider"
                control={control}
                render={({ field }) => (
                  <Input
                    id="bankServiceProvider"
                    placeholder="Enter Bank Service Provider"
                    {...field}
                    className={
                      errors.bankServiceProvider ? "border-red-500" : ""
                    }
                  />
                )}
              />
              {errors.bankServiceProvider && (
                <span className="text-red-500">
                  {errors.bankServiceProvider.message}
                </span>
              )}
            </div> */}
            <div className="space-y-2">
              <Label htmlFor="brokerName">Broker Name</Label>
              <Label style={{ color: "red" }}>*</Label>
              <Controller
                name="brokerName"
                control={control}
                render={({ field }) => (
                  <Input
                    id="brokerName"
                    placeholder="Enter Broker Name"
                    {...field}
                    className={errors.brokerName ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.brokerName && (
                <span className="text-red-500">
                  {errors.brokerName.message}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="brokingAccountNumber">
                Broking Account Number
              </Label>
              <Label style={{ color: "red" }}>*</Label>
              <Controller
                name="brokingAccountNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    id="brokingAccountNumber"
                    placeholder="Enter Broking Account Number"
                    {...field}
                    className={
                      errors.brokingAccountNumber ? "border-red-500" : ""
                    }
                  />
                )}
              />
              {errors.brokingAccountNumber && (
                <span className="text-red-500">
                  {errors.brokingAccountNumber.message}
                </span>
              )}
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="numberOfDebentures">Number of Debentures</Label>
              <Controller
                name="numberOfDebentures"
                control={control}
                render={({ field }) => (
                  <Input
                    id="numberOfDebentures"
                    placeholder="Enter Number of Debentures"
                    {...field}
                    className={
                      errors.numberOfDebentures ? "border-red-500" : ""
                    }
                  />
                )}
              />
              {errors.numberOfDebentures && (
                <span className="text-red-500">
                  {errors.numberOfDebentures.message}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="certificateNumber">Certificate Number</Label>
              <Controller
                name="certificateNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    id="certificateNumber"
                    placeholder="Enter Certificate Number"
                    {...field}
                    className={errors.certificateNumber ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.certificateNumber && (
                <span className="text-red-500">
                  {errors.certificateNumber.message}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="distinguishNoFrom">Distinguish Number From</Label>
              <Controller
                name="distinguishNoFrom"
                control={control}
                render={({ field }) => (
                  <Input
                    id="distinguishNoFrom"
                    placeholder="Enter Distinguish Number From"
                    {...field}
                    className={errors.distinguishNoFrom ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.distinguishNoFrom && (
                <span className="text-red-500">
                  {errors.distinguishNoFrom.message}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="distinguishNoTo">Distinguish Number To</Label>
              <Controller
                name="distinguishNoTo"
                control={control}
                render={({ field }) => (
                  <Input
                    id="distinguishNoTo"
                    placeholder="Enter Distinguish Number To"
                    {...field}
                    className={errors.distinguishNoTo ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.distinguishNoTo && (
                <span className="text-red-500">
                  {errors.distinguishNoTo.message}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="faceValue">Face Value</Label>
              <Controller
                name="faceValue"
                control={control}
                render={({ field }) => (
                  <Input
                    id="faceValue"
                    placeholder="Enter Face Value"
                    {...field}
                    className={errors.faceValue ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.faceValue && (
                <span className="text-red-500">{errors.faceValue.message}</span>
              )}
            </div> */}

            <div className="space-y-2">
              <Label htmlFor="natureOfHolding">Nature of Holding</Label>
              <Label style={{ color: "red" }}>*</Label>
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
            <div className="w-full grid grid-cols-1 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Controller
                  name="name"
                  control={control}
                  defaultValue={Benifyciary?.name || ""}
                  render={({ field }) => (
                    <Input
                      id="name"
                      placeholder="Enter Name"
                      {...field}
                      className={errors.name ? "border-red-500" : ""}
                      defaultValue={Benifyciary?.name || ""}
                    />
                  )}
                />
                {errors.name && (
                  <span className="text-red-500">{errors.name.message}</span>
                )}
              </div>

              <div className="w-[40%] space-y-2">
                <Label htmlFor="email">Email</Label>
                <Controller
                  name="email"
                  control={control}
                  defaultValue={Benifyciary?.email || ""}
                  render={({ field }) => (
                    <Input
                      id="email"
                      placeholder="Enter Email"
                      {...field}
                      className={errors.email ? "border-red-500" : ""}
                      defaultValue={Benifyciary?.email || ""}
                    />
                  )}
                />
                {errors.email && (
                  <span className="text-red-500">{errors.email.message}</span>
                )}
              </div>
              <div className="w-[40%] space-y-2">
                <Label htmlFor="mobile">Phone</Label>
                <Controller
                  name="mobile"
                  control={control}
                  defaultValue={Benifyciary?.mobile || ""}
                  render={({ field }) => (
                    <PhoneInput
                      id="mobile"
                      type="tel"
                      {...field}
                      placeholder="Enter mobile number"
                      defaultCountry="in"
                      inputStyle={{ minWidth: "15.5rem" }}
                      defaultValue={Benifyciary?.mobile || ""}
                    />
                  )}
                />
                {errors.mobile && (
                  <span className="text-red-500">{errors.mobile.message}</span>
                )}
              </div>
            </div>
            <div className="space-y-2 col-span-full">
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

export default PSSEditForm;

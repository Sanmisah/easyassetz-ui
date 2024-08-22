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
import Editnominee from "@/components/Nominee/EditNominee";
import cross from "@/components/image/close.png";
import { Checkbox } from "@/shadcncomponents/ui/checkbox";
import { PhoneInput } from "react-international-phone";

const schema = z.object({
  companyName: z
    .string()
    .nonempty({ message: "Insurance Company is required" }),
  otherInsuranceCompany: z.string().optional(),
  insuranceType: z.any().optional(),
  policyNumber: z.string().min(2, { message: "Policy Number is required" }),
  expiryDate: z.date().optional(),
  premium: z.string().min(3, { message: "Premium is required" }),
  // sumInsured: z.string().min(3, { message: "Sum Insured is required" }),
  insurerName: z
    .string()
    .nonempty({ message: "Policy Holder Name is required" }),
  vehicleType: z.string().nonempty({ message: "Vehical Type is required" }),
  specificVehicalType: z.string().optional(),
  modeOfPurchase: z.string().optional(),
  contactPerson: z.string().optional(),
  contactNumber: z.string().optional(),
  email: z.string().optional(),
  registeredMobile: z.string().optional(),
  registeredEmail: z.any().optional(),
  additionalDetails: z.string().optional(),
  brokerName: z.string().optional(),
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
      setValue("modeOfPurchase", data.modeOfPurchase);
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
      response.data.data.MotorInsurance?.vehicleType !== "twowheeler" &&
      response.data.data.MotorInsurance?.vehicleType !== "threewheeler" &&
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
      // if (
      //   data.vehicleType !== "twowheeler" ||
      //   data.vehicleType !== "threewheeler" ||
      //   data.vehicleType !== "fourwheeler"
      // ) {
      //   console.log("SP SASA");
      //   setShowOtherRelationship(true);
      //   setValue("vehicleType", "other");
      // }
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
  useEffect(() => {
    console.log("nominees:", selectedNommie);
    console.log("displaynominie:", displaynominie);
  }, [selectedNommie, displaynominie]);

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
      toast.success("Motor Insurance added successfully!");
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
    if (data.expiryDate) {
      const date = new Date(data.expiryDate);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();
      const newdate = `${month}/${day}/${year}`;
      data.expiryDate = newdate;
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
  if (isError) return <div>Error loading insurance data</div>;
  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Motor Insurance Policy Details
                </CardTitle>
                <CardDescription>
                  Fill out the form to add a new Motor Insurance Policy.
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
                <Label htmlFor="insurance-company">Insurance Company</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="companyName"
                  control={control}
                  defaultValue={Benifyciary?.companyName}
                  render={({ field }) => (
                    <Select
                      id="insurance-company"
                      value={field.value}
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherInsuranceCompany(value === "other");
                      }}
                      className={errors.companyName ? "border-red-500" : ""}
                      defaultValue={Benifyciary?.companyName || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select insurance company" />
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
                {showOtherInsuranceCompany && (
                  <Controller
                    name="otherInsuranceCompany"
                    control={control}
                    defaultValue={Benifyciary?.otherInsuranceCompany || ""}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Insurance Company"
                        className="mt-2"
                        defaultValue={Benifyciary?.otherInsuranceCompany || ""}
                      />
                    )}
                  />
                )}
                {errors.companyName && (
                  <span className="text-red-500">
                    {errors.companyName.message}
                  </span>
                )}
              </div>
              {console.log(Benifyciary)}
              <div className="space-y-2">
                <Label htmlFor="insuranceType">Insurance Type</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="insuranceType"
                  control={control}
                  defaultValue={Benifyciary?.insuranceType || ""}
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="comprehensive"
                        defaultChecked={Benifyciary?.insuranceType}
                        // checked={field.value === "comprehensive"}
                        value="comprehensive"
                        onCheckedChange={() => field.onChange("comprehensive")}
                      />
                      <Label htmlFor="comprehensive">Comprehensive</Label>
                    </div>
                  )}
                />
                {errors.insuranceType && (
                  <span className="text-red-500">
                    {errors.insuranceType.message}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="policy-number">Policy Number</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="policyNumber"
                  control={control}
                  defaultValue={Benifyciary?.policyNumber || ""}
                  render={({ field }) => (
                    <Input
                      id="policy-number"
                      placeholder="Enter policy number"
                      value={field.value}
                      {...field}
                      className={errors.policyNumber ? "border-red-500" : ""}
                      defaultValue={Benifyciary?.policyNumber || ""}
                    />
                  )}
                />
                {errors.policyNumber && (
                  <span className="text-red-500">
                    {errors.policyNumber.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="expiryDate"
                  defaultValues={new Date(Benifyciary?.expiryDate) || ""}
                  control={control}
                  render={({ field }) => (
                    <Datepicker
                      {...field}
                      defaultValues={new Date(Benifyciary?.expiryDate) || ""}
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                    />
                  )}
                />
                {errors.expiryDate && (
                  <span className="text-red-500">
                    {errors.expiryDate.message}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="premium">Premium</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="premium"
                  control={control}
                  defaultValue={Benifyciary?.premium || ""}
                  render={({ field }) => (
                    <Input
                      id="premium"
                      placeholder="Enter premium amount"
                      {...field}
                      className={errors.premium ? "border-red-500" : ""}
                      defaultValue={Benifyciary?.premium || ""}
                    />
                  )}
                />
                {errors.premium && (
                  <span className="text-red-500">{errors.premium.message}</span>
                )}
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="sum-insured">Sum Insured</Label>
                <Controller
                  name="sumInsured"
                  control={control}
                  defaultValue={Benifyciary?.sumInsured || ""}
                  render={({ field }) => (
                    <Input
                      id="sum-insured"
                      placeholder="Enter sum insured"
                      {...field}
                      className={errors.sumInsured ? "border-red-500" : ""}
                      defaultValue={Benifyciary?.sumInsured || ""}
                    />
                  )}
                />
                {errors.sumInsured && (
                  <span className="text-red-500">
                    {errors.sumInsured.message}
                  </span>
                )}
              </div> */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="policy-holder">Insurer Name</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="insurerName"
                  control={control}
                  defaultValue={Benifyciary?.insurerName || ""}
                  render={({ field }) => (
                    <Input
                      id="policy-holder"
                      placeholder="Enter policy holder name"
                      {...field}
                      className={errors.insurerName ? "border-red-500" : ""}
                      defaultValue={Benifyciary?.insurerName || ""}
                    />
                  )}
                />
                {errors.insurerName && (
                  <span className="text-red-500">
                    {errors.insurerName.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Vehical Type</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="vehicleType"
                  defaultValue={Benifyciary?.vehicleType || ""}
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="vehicleType"
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherRelationship(value === "other");
                      }}
                      className={errors.vehicleType ? "border-red-500" : ""}
                      defaultValue={Benifyciary?.vehicleType || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicleType" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="twowheeler">Two Wheeler</SelectItem>
                        <SelectItem value="threewheeler">
                          Three Wheeler
                        </SelectItem>
                        <SelectItem value="fourwheeler">
                          Four Wheeler
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {showOtherRelationship && (
                  <Controller
                    name="specificVehicalType"
                    control={control}
                    defaultValue={Benifyciary?.vehicleType || ""}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Vehical Type"
                        className="mt-2"
                        defaultValue={Benifyciary?.vehicleType || ""}
                      />
                    )}
                  />
                )}
                {errors.vehicleType && (
                  <span className="text-red-500">
                    {errors.vehicleType.message}
                  </span>
                )}
              </div>
            </div>

            {displaynominie && displaynominie.length > 0 && (
              <div className="space-y-2">
                <div className="grid gap-4 py-4">
                  {console.log(displaynominie)}
                  {displaynominie &&
                    displaynominie.map((nominee) => (
                      <div
                        key={nominee.id} // Add a key for better performance
                        className="flex space-y-2 border border-input p-4 justify-between pl-4 pr-4 items-center rounded-lg"
                      >
                        <Label htmlFor={`nominee-${nominee?.id}`}>
                          {nominee?.fullLegalName || nominee?.charityName}
                        </Label>
                        <img
                          className="w-4 h-4 cursor-pointer"
                          onClick={() => {
                            setSelectedNommie(
                              selectedNommie.filter(
                                (item) => item !== nominee.id
                              )
                            );

                            setDisplaynominie(
                              displaynominie.filter(
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
              <Label>Mode of Purchase</Label>
              <Controller
                name="modeOfPurchase"
                control={control}
                defaultValue={Benifyciary?.modeOfPurchase || ""}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    defaultValue={Benifyciary?.modeOfPurchase || ""}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setHideRegisteredFields(value === "e-insurance");
                      setBrokerSelected(value === "broker");
                      if (value === "e-insurance") {
                        setValue("brokerName", "");
                        setValue("contactPerson", "");
                        setValue("contactNumber", "");
                        setValue("email", "");
                      } else if (value === "broker") {
                        setValue("registeredMobile", "");
                        setValue("registeredEmail", "");
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <div className="flex items-center gap-2 text-center">
                      <RadioGroupItem id="broker" value="broker" />
                      <Label htmlFor="broker">Broker</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id="e-insurance" value="e-insurance" />
                      <Label htmlFor="e-insurance">E-Insurance</Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>

            {hideRegisteredFields && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="registered-mobile">Registered Mobile</Label>
                  <Controller
                    name="registeredMobile"
                    control={control}
                    defaultValue={Benifyciary?.registeredMobile || ""}
                    render={({ field }) => (
                      <Input
                        id="registered-mobile"
                        placeholder="Enter registered mobile"
                        {...field}
                        defaultValue={Benifyciary?.registeredMobile || ""}
                      />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registeredEmail">Registered Email ID</Label>
                  <Controller
                    name="registeredEmail"
                    defaultValue={Benifyciary?.registeredEmail || ""}
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="registeredEmail"
                        placeholder="Enter registered email"
                        type="email"
                        {...field}
                        value={field.value}
                        onChange={field.onChange}
                        defaultValue={Benifyciary?.registeredEmail || ""}
                      />
                    )}
                  />
                  {errors.registeredEmail && (
                    <span className="text-red-500">
                      {errors.registeredEmail.message}
                    </span>
                  )}
                </div>
              </div>
            )}

            {brokerSelected && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-person">Broker Name</Label>
                    <Controller
                      name="brokerName"
                      control={control}
                      defaultValue={Benifyciary?.brokerName || ""}
                      render={({ field }) => (
                        <Input
                          id="brokerName"
                          placeholder="Enter broker name"
                          {...field}
                          defaultValue={Benifyciary?.brokerName || ""}
                          value={field.value}
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
                    <Label htmlFor="contact-person">Contact Person</Label>
                    <Controller
                      name="contactPerson"
                      control={control}
                      defaultValue={Benifyciary?.contactPerson || ""}
                      render={({ field }) => (
                        <Input
                          id="contact-person"
                          placeholder="Enter contact person name"
                          {...field}
                          className={
                            errors.contactPerson ? "border-red-500" : ""
                          }
                          defaultValue={Benifyciary?.contactPerson || ""}
                        />
                      )}
                    />
                    {errors.contactPerson && (
                      <span className="text-red-500">
                        {errors.contactPerson.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-number">Contact Number</Label>
                    <Controller
                      name="contactNumber"
                      defaultValue={Benifyciary?.contactNumber || ""}
                      control={control}
                      render={({ field }) => (
                        <PhoneInput
                          defaultValue={Benifyciary?.contactNumber || ""}
                          id="guardian-mobile"
                          type="tel"
                          placeholder="Enter contact number"
                          defaultCountry="in"
                          value={field.value}
                          inputStyle={{ minWidth: "30.5rem" }}
                          onChange={field.onChange}
                          className={
                            errors.contactNumber ? "border-red-500" : ""
                          }
                        />
                      )}
                    />
                    {errors.contactNumber && (
                      <span className="text-red-500">
                        {errors.contactNumber.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Controller
                      name="email"
                      control={control}
                      defaultValue={Benifyciary?.email || ""}
                      render={({ field }) => (
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter email"
                          {...field}
                          className={errors.email ? "border-red-500" : ""}
                          defaultValue={Benifyciary?.email || ""}
                        />
                      )}
                    />
                    {errors.email && (
                      <span className="text-red-500">
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="aadharFile">Upload Your image File</Label>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <Input
                    id="image"
                    type="file"
                    onChange={(event) => {
                      field.onChange(
                        event.target.files && event.target.files[0]
                      );
                      console.log("sadsA", event.target.files);
                    }}
                    className={errors.panFile ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.image && (
                <span className="text-red-500">{errors.image.message}</span>
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

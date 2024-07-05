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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { setlifeInsuranceEditId } from "@/Redux/sessionSlice";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Addnominee from "./EditNominee";
import cross from "@/components/image/close.png";
import { PhoneInput } from "react-international-phone";

const schema = z.object({
  companyName: z
    .string()
    .nonempty({ message: "Insurance Company is required" }),
  otherInsuranceCompany: z.string().optional(),
  companyAddress: z
    .string()
    .nonempty({ message: "Insurance Sub Type is required" }),
  companyRegistration: z
    .string()
    .min(2, { message: "Company Registration is required" }),

  myStatus: z.string().optional(),
  typeOfInvestment: z.string().min(3, { message: "Premium is required" }),
  holdingType: z.string().min(3, { message: "Sum Insured is required" }),
  jointHolderName: z
    .string()
    .nonempty({ message: "Policy Holder Name is required" }),
  documentAvailability: z
    .string()
    .nonempty({ message: "Mode of Purchase is required" }),
  additionalInformation: z.string().optional(),
  name: z.string().nonempty({ message: "Name is required" }),
  mobile: z.string().nonempty({ message: "mobile is required" }),
  email: z.string().optional(),
});

const FocusableSelectTrigger = forwardRef((props, ref) => (
  <SelectTrigger ref={ref} {...props} />
));

const EditFormHealth = () => {
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
  const [showOthercompanyAddress, setShowOthercompanyAddress] = useState(false);
  const [FamilyMembersCovered, setFamilyMembersCovered] = useState([]);
  const [showOtherFamilyMembersCovered, setShowOtherFamilyMembersCovered] =
    useState(false);
  const [defaultValues, setDefaultValues] = useState(null);
  const [brokerSelected, setBrokerSelected] = useState(false);
  const [selectedNommie, setSelectedNommie] = useState([]);
  const [displaynominie, setDisplaynominie] = useState([]);
  const [jointHolderName, setJointHolderName] = useState(false);
  const [showOtherCompanyRegistration, setShowOtherCompanyRegistration] =
    useState(false);

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
      `/api/business-assets/${lifeInsuranceEditId}`,
      {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      }
    );
    if (response.data.data.BusinessAsset?.documentAvailability === "broker") {
      setBrokerSelected(true);
      setHideRegisteredFields(false);
    }
    if (
      response.data.data.BusinessAsset?.documentAvailability === "e-insurance"
    ) {
      setBrokerSelected(false);
      setHideRegisteredFields(true);
    }
    console.log(typeof response.data.data.BusinessAsset?.typeOfInvestment);
    return response.data.data.BusinessAsset;
  };

  const {
    data: Benifyciary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lifeInsuranceDataUpdate", lifeInsuranceEditId],
    queryFn: getPersonalData,

    onSuccess: (data) => {
      if (data.documentAvailability === "broker") {
        setBrokerSelected(true);
        setHideRegisteredFields(false);
      }
      if (data.documentAvailability === "e-insurance") {
        setBrokerSelected(false);
        setHideRegisteredFields(true);
      }
      setDefaultValues(data);
      reset(data);
      setValue(data);
      setValue("specificVehicalType", data.specificVehicalType);
      setValue("registeredMobile", data.registeredMobile);
      setValue("registeredEmail", data.registeredEmail);
      setValue("additionalDetails", data.additionalDetails);
      setValue("previousPolicymobile", data.previousPolicymobile);
      setValue("companyRegistration", data.companyRegistration);
      setValue("myStatus", data.myStatus);
      setValue("typeOfInvestment", data.typeOfInvestment);
      setValue("holdingType", data.holdingType);
      setValue("jointHolderName", data.jointHolderName);
      setValue("documentAvailability", data.documentAvailability);
      setValue("contactmobile", data.contactmobile);
      setValue("email", data.email);
      setValue("registeredMobile", data.registeredMobile);
      setValue("registeredEmail", data.registeredEmail);
      setValue("additionalDetails", data.additionalDetails);
      setValue("previousPolicymobile", data.previousPolicymobile);
      setValue("brokerName", data.brokerName);
      setValue("additionalInformation", data.additionalInformation);
      setValue("contactmobile", data.contactmobile);
      setValue("companyRegistrationNumber", data.companyRegistrationNumber);

      // Set fetched values to the form
      for (const key in data) {
        setValue(key, data[key]);
      }

      setShowOtherInsuranceCompany(data.companyName === "other");
      if (
        data.companyRegistration !== "CIN" &&
        data.companyRegistration !== "PAN" &&
        data.companyRegistration !== "FIRM NO"
      ) {
        setShowOtherCompanyRegistration(true);
      }

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
        `/api/business-assets/${lifeInsuranceEditId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      return response.data.data.BusinessAsset;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(
        "healthInsuranceDataUpdate",
        lifeInsuranceEditId
      );
      toast.success("Health Insurance added successfully!");
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
    if (selectedNommie.length > 0) {
      data.nominees = selectedNommie;
    }

    if (data.FamilyMembersCovered === "other") {
      data.FamilyMembersCovered = data.specifyFamilyMembersCovered;
    }
    if (data.companyAddress === "other") {
      data.companyAddress = data.specifycompanyAddress;
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
                <Label htmlFor="insurance-company">Insurance Company</Label>
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
                <Label htmlFor="companyAddress">Insurance Type</Label>
                <Controller
                  name="companyAddress"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        id="companyAddress"
                        placeholder="Enter company address"
                        {...field}
                        className={
                          errors.companyAddress ? "border-red-500" : ""
                        }
                        defaultValue={Benifyciary?.companyAddress || ""}
                      />
                    </div>
                  )}
                />
                {showOthercompanyAddress && (
                  <Controller
                    name="specifycompanyAddress"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Vehical Type"
                        className="mt-2"
                      />
                    )}
                  />
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 col-span-full">
                <Label>Company Registration</Label>
                <Controller
                  name="companyRegistration"
                  control={control}
                  defaultValue={Benifyciary?.companyRegistration || ""}
                  render={({ field }) => (
                    <Select
                      id="companyRegistration"
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherCompanyRegistration(true);
                      }}
                      className={
                        errors.companyRegistration ? "border-red-500" : ""
                      }
                    >
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select Company Registration">
                          {field.value || "Select Company Registration"}
                        </SelectValue>
                      </FocusableSelectTrigger>
                      <SelectContent>
                        <SelectItem value="CIN">CIN</SelectItem>
                        <SelectItem value="PAN">PAN</SelectItem>
                        <SelectItem value="FIRM NO">FIRM NO</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {showOtherCompanyRegistration && (
                  <Controller
                    name="otherCompanyRegistration"
                    control={control}
                    defaultValue={Benifyciary?.otherCompanyRegistration || ""}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Company Registration"
                        className="mt-2"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    )}
                  />
                )}
                {errors.companyRegistration && (
                  <span className="text-red-500">
                    {errors.companyRegistration.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="maturity-date">Maturity Date</Label>
                <Controller
                  name="myStatus"
                  defaultValue={new Date(Benifyciary?.myStatus) || ""}
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="documentAvailability"
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOthertypeOfInvestment(value === "other");
                      }}
                      className={
                        errors.documentAvailability ? "border-red-500" : ""
                      }
                    >
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select Type Of Investment">
                          {field.value || "Select Type Of Investment"}
                        </SelectValue>
                      </FocusableSelectTrigger>
                      <SelectContent>
                        <SelectItem value="shares">Shares</SelectItem>
                        <SelectItem value="profit">Profit</SelectItem>
                        <SelectItem value="loan">Loan</SelectItem>
                        <SelectItem value="deposit">Deposit</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.myStatus && (
                  <span className="text-red-500">
                    {errors.myStatus.message}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="typeOfInvestment">Type Of Investment</Label>
                <Controller
                  name="typeOfInvestment"
                  control={control}
                  defaultValue={Benifyciary?.typeOfInvestment || ""}
                  render={({ field }) => (
                    <Select
                      id="typeOfInvestment"
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOthertypeOfInvestment(value === "other");
                      }}
                      className={
                        errors.typeOfInvestment ? "border-red-500" : ""
                      }
                    >
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select Type Of Investment">
                          {field.value || "Select Type Of Investment"}
                        </SelectValue>
                      </FocusableSelectTrigger>
                      <SelectContent>
                        <SelectItem value="shares">Shares</SelectItem>
                        <SelectItem value="profit">Profit</SelectItem>
                        <SelectItem value="loan">Loan</SelectItem>
                        <SelectItem value="deposit">Deposit</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.typeOfInvestment && (
                  <span className="text-red-500">
                    {errors.typeOfInvestment.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="holdingType">Holding Type</Label>
                <Controller
                  name="holdingType"
                  control={control}
                  defaultValue={Benifyciary?.holdingType || ""}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setJointHolderName(value === "other");
                      }}
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2 text-center">
                        <RadioGroupItem id="single" value="single" />
                        <Label htmlFor="single">Single</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem id="jointName" value="jointName" />
                        <Label htmlFor="jointName">Joint Name</Label>
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
            {jointHolderName && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="policy-holder">Joint Holder Name</Label>
                  <Controller
                    name="jointHolderName"
                    control={control}
                    defaultValue={Benifyciary?.jointHolderName || ""}
                    render={({ field }) => (
                      <Input
                        id="policy-holder"
                        placeholder="Enter policy holder name"
                        {...field}
                        className={
                          errors.jointHolderName ? "border-red-500" : ""
                        }
                        defaultValue={Benifyciary?.jointHolderName || ""}
                      />
                    )}
                  />
                  {errors.jointHolderName && (
                    <span className="text-red-500">
                      {errors.jointHolderName.message}
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
                    displaynominie.length > 0 &&
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
            {/* <div className="space-y-2">
              <Label>Document Availability</Label>
              <Controller
                name="documentAvailability"
                defaultValue={Benifyciary?.documentAvailability || ""}
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="documentAvailability"
                    checked={field.value === "e-insurance"}
                    onCheckedChange={() => {
                      field.onChange("e-insurance");
                      setHideRegisteredFields(true);
                      setBrokerSelected(false);
                    }}
                  />
                )}
              />
            </div> */}

            <div>
              <div className="space-y-2">
                <Label>additional information</Label>
                <Controller
                  name="additionalInformation"
                  control={control}
                  defaultValue={Benifyciary?.additionalInformation || ""}
                  render={({ field }) => (
                    <Input
                      id="additionalInformation"
                      placeholder="Enter registered mobile"
                      {...field}
                      defaultValue={Benifyciary?.additionalInformation || ""}
                    />
                  )}
                />
              </div>
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
                  <Label htmlFor="registered-email">Registered Email ID</Label>
                  <Controller
                    name="registeredEmail"
                    defaultValue={Benifyciary?.registeredEmail || ""}
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="registered-email"
                        placeholder="Enter registered email"
                        type="email"
                        {...field}
                        defaultValue={Benifyciary?.registeredEmail || ""}
                      />
                    )}
                  />
                </div>
              </div>
            )}

            {brokerSelected && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Controller
                      name="name"
                      control={control}
                      defaultValue={Benifyciary?.name || ""}
                      render={({ field }) => (
                        <Input
                          id="contact-person"
                          placeholder="Enter name"
                          {...field}
                          className={errors.name ? "border-red-500" : ""}
                          defaultValue={Benifyciary?.name || ""}
                        />
                      )}
                    />
                    {errors.name && (
                      <span className="text-red-500">
                        {errors.name.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">mobile</Label>
                    <Controller
                      name="mobile"
                      defaultValue={Benifyciary?.mobile || ""}
                      control={control}
                      render={({ field }) => (
                        <PhoneInput
                          defaultValue={Benifyciary?.mobile || ""}
                          id="guardian-mobile"
                          type="tel"
                          placeholder="Enter mobile"
                          defaultCountry="in"
                          value={field.value}
                          inputStyle={{ minWidth: "30.5rem" }}
                          onChange={field.onChange}
                          className={errors.mobile ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.mobile && (
                      <span className="text-red-500">
                        {errors.mobile.message}
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
            <CardFooter className="flex justify-end gap-2 mt-8">
              <Button type="submit">Submit</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditFormHealth;

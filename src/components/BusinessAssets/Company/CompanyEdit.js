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
import Addnominee from "@/components/Nominee/EditNominee";
import cross from "@/components/image/close.png";
import { PhoneInput } from "react-international-phone";

const schema = z.object({
  companyName: z
    .string()
    .nonempty({ message: "Insurance Company is required" }),
  companyAddress: z.string().optional(),
  firmsRegistrationNumber: z
    .string()
    .nonempty({ message: "Insurance Sub Type is required" }),
  myStatus: z.string().optional(),
  // holdingType: z.string().nonempty({ message: "Holding Type is required" }),
  jointHolderName: z.string().optional(),
  jointHolderPan: z.string().optional(),
  typeOfInvestment: z.string().optional(),
  additionalInformation: z.string().optional(),
  name: z.string().nonempty({ message: "Name is required" }),
  // mobile: z.string().nonempty({ message: "mobile is required" }),
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

  const [showOtherInsuranceCompany, setShowOtherInsuranceCompany] =
    useState(false);
  const [showOtherRelationship, setShowOtherRelationship] = useState(false);
  const [hideRegisteredFields, setHideRegisteredFields] = useState(false);
  const [showOthercompanyAddress, setShowOthercompanyAddress] = useState(false);
  const [FamilyMembersCovered, setFamilyMembersCovered] = useState([]);
  const [showOtherFamilyMembersCovered, setShowOtherFamilyMembersCovered] =
    useState(false);
  const [defaultValues, setDefaultValues] = useState({});
  const [showOtherCompanyName, setshowOtherCompanyName] = useState(false);
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
    defaultValues: {},
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
    const data = response.data.data.BusinessAsset;

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
    setShowOtherInsuranceCompany(data.companyName === "other");
    setShowOtherCompanyRegistration(
      !["CIN", "PAN", "FIRM NO"].includes(data.companyRegistration)
    );
    setJointHolderName(data.holdingType === "jointName");

    return data;
  };

  const {
    data: Benifyciary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lifeInsuranceDataUpdate", lifeInsuranceEditId],
    queryFn: getPersonalData,
    onSuccess: (data) => {
      setDisplaynominie(data.nominees || []);
    },
    onError: (error) => {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
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
        "lifeInsuranceDataUpdate",
        lifeInsuranceEditId
      );
      toast.success("Health Insurance updated successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile");
    },
  });

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

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading insurance data</div>;

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-2xl font-bold">
                Company Details
              </CardTitle>
              <CardDescription>
                Edit the form to update the Company Details.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <form
            className="space-y-6 flex flex-col"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Controller
                name="companyName"
                control={control}
                defaultValue={defaultValues.companyName}
                render={({ field }) => (
                  <Input
                    id="companyName"
                    placeholder="Enter Company Name"
                    {...field}
                    className={errors.companyName ? "border-red-500" : ""}
                  />
                )}
              />
              {showOtherCompanyName && (
                <Controller
                  name="specifyCompanyName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Specify Company Name"
                      className="mt-2"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="insurance-company">Insurance Company</Label>
                <Controller
                  name="companyName"
                  control={control}
                  defaultValue={defaultValues.companyName}
                  render={({ field }) => (
                    <Select
                      id="insurance-company"
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherInsuranceCompany(value === "other");
                      }}
                      className={errors.companyName ? "border-red-500" : ""}
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
                    defaultValue={defaultValues.otherInsuranceCompany}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Insurance Company"
                        className="mt-2"
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
              <div className="space-y-2">
                <Label htmlFor="companyAddress">Insurance Type</Label>
                <Controller
                  name="companyAddress"
                  control={control}
                  defaultValue={defaultValues.companyAddress}
                  render={({ field }) => (
                    <Input
                      id="companyAddress"
                      placeholder="Enter company address"
                      {...field}
                      className={errors.companyAddress ? "border-red-500" : ""}
                    />
                  )}
                />
                {showOthercompanyAddress && (
                  <Controller
                    name="specifycompanyAddress"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify company address"
                        className="mt-2"
                      />
                    )}
                  />
                )}
                {errors.companyAddress && (
                  <span className="text-red-500">
                    {errors.companyAddress.message}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 col-span-full">
                <Label>Company Registration</Label>
                <Controller
                  name="companyRegistration"
                  control={control}
                  defaultValue={defaultValues.companyRegistration}
                  render={({ field }) => (
                    <Select
                      id="companyRegistration"
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherCompanyRegistration(
                          !["CIN", "PAN", "FIRM NO"].includes(value)
                        );
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
                    defaultValue={defaultValues.otherCompanyRegistration}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Company Registration"
                        className="mt-2"
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
                <Label htmlFor="myStatus">Maturity Date</Label>
                <Controller
                  name="myStatus"
                  control={control}
                  defaultValue={defaultValues.myStatus}
                  render={({ field }) => (
                    <Select
                      id="myStatus"
                      value={field.value}
                      onValueChange={field.onChange}
                      className={errors.myStatus ? "border-red-500" : ""}
                    >
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select Maturity Date">
                          {field.value || "Select Maturity Date"}
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
                  defaultValue={defaultValues.typeOfInvestment}
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
                  defaultValue={defaultValues.holdingType}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setJointHolderName(value === "jointName");
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
                  <Label htmlFor="jointHolderName">Joint Holder Name</Label>
                  <Controller
                    name="jointHolderName"
                    control={control}
                    defaultValue={defaultValues.jointHolderName}
                    render={({ field }) => (
                      <Input
                        id="jointHolderName"
                        placeholder="Enter joint holder name"
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
              </div>
            )}
            {displaynominie.length > 0 && (
              <div className="space-y-2">
                <div className="grid gap-4 py-4">
                  <Label className="text-lg font-bold">Selected Nominees</Label>
                  {displaynominie.map((nominee) => (
                    <div
                      key={nominee.id}
                      className="flex space-y-2 border border-input p-4 justify-between pl-4 pr-4 items-center rounded-lg"
                    >
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
              <Addnominee
                setSelectedNommie={setSelectedNommie}
                AllNominees={Benifyciary?.nominees}
                selectedNommie={selectedNommie}
                displaynominie={displaynominie}
                setDisplaynominie={setDisplaynominie}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="additionalInformation">
                Additional Information
              </Label>
              <Controller
                name="additionalInformation"
                control={control}
                defaultValue={defaultValues.additionalInformation}
                render={({ field }) => (
                  <Input
                    id="additionalInformation"
                    placeholder="Enter additional information"
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
            {hideRegisteredFields && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="registeredMobile">Registered Mobile</Label>
                  <Controller
                    name="registeredMobile"
                    control={control}
                    defaultValue={defaultValues.registeredMobile}
                    render={({ field }) => (
                      <Input
                        id="registeredMobile"
                        placeholder="Enter registered mobile"
                        {...field}
                        className={
                          errors.registeredMobile ? "border-red-500" : ""
                        }
                      />
                    )}
                  />
                  {errors.registeredMobile && (
                    <span className="text-red-500">
                      {errors.registeredMobile.message}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registeredEmail">Registered Email</Label>
                  <Controller
                    name="registeredEmail"
                    control={control}
                    defaultValue={defaultValues.registeredEmail}
                    render={({ field }) => (
                      <Input
                        id="registeredEmail"
                        placeholder="Enter registered email"
                        type="email"
                        {...field}
                        className={
                          errors.registeredEmail ? "border-red-500" : ""
                        }
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
                    <Label htmlFor="name">Name</Label>
                    <Controller
                      name="name"
                      control={control}
                      defaultValue={defaultValues.name}
                      render={({ field }) => (
                        <Input
                          id="name"
                          placeholder="Enter name"
                          {...field}
                          className={errors.name ? "border-red-500" : ""}
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
                    <Label htmlFor="mobile">Mobile</Label>
                    <Controller
                      name="mobile"
                      control={control}
                      defaultValue={defaultValues.mobile}
                      render={({ field }) => (
                        <PhoneInput
                          id="mobile"
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
                      defaultValue={defaultValues.email}
                      render={({ field }) => (
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter email"
                          {...field}
                          className={errors.email ? "border-red-500" : ""}
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

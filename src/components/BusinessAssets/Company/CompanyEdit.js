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
  companyName: z.string().nonempty({ message: "Company Name is required" }),
  companyAddress: z.string().optional(),
  firmsRegistrationNumberType: z
    .string()
    .nonempty({ message: "Firm Registration Number is required" }),
  firmsRegistrationNumber: z
    .string()
    .nonempty({ message: "Firm Registration Number is required" }),
  myStatus: z.any().optional(),
  holdingType: z.any().optional(),
  jointHolderName: z.any().optional(),
  jointHolderPan: z.any().optional(),
  additionalInformation: z.any().optional(),
  typeOfInvestment: z.any().optional(),
  name: z.string().optional(),

  mobile: z.string().optional(),
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
    setValue("firmsRegistrationNumberType", data.firmsRegistrationNumberType);
    setValue("firmsRegistrationNumber", data.firmsRegistrationNumber);
    setValue("typeOfInvestment", data.typeOfInvestment);
    setValue("holdingType", data.holdingType);
    setValue("jointHolderName", data.jointHolderName);
    setValue("jointHolderPan", data.jointHolderPan);
    setValue("additionalInformation", data.additionalInformation);
    setValue("typeOfInvestment", data.typeOfInvestment);
    setValue("name", data.name);
    setValue("mobile", data.mobile);
    setValue("email", data.email);

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
    setJointHolderName(data.holdingType === "joint");

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
      toast.success("Company updated successfully!");
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
    data.type = "company";
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
              <Label style={{ color: "red" }}>*</Label>
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
                <Label htmlFor="companyAddress">Company Address</Label>
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
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="firmsRegistrationNumberType"
                  control={control}
                  defaultValue={defaultValues.firmsRegistrationNumberType}
                  render={({ field }) => (
                    <Select
                      id="firmsRegistrationNumberType"
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherCompanyRegistration(
                          !["CIN", "PAN", "FIRM NO"].includes(value)
                        );
                      }}
                      className={
                        errors.firmsRegistrationNumberType
                          ? "border-red-500"
                          : ""
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
                    name="firmsRegistrationNumber"
                    control={control}
                    defaultValue={defaultValues.firmsRegistrationNumber}
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={field.value?.toUpperCase() || ""}
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
                <Label htmlFor="myStatus">My Status</Label>
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
                        <SelectItem value="shareholder">Shareholder</SelectItem>
                        <SelectItem value="partnerBO">Partner BO</SelectItem>
                        <SelectItem value="nominee">Nominee</SelectItem>
                        <SelectItem value="lender">Lender</SelectItem>
                        <SelectItem value="depositor">Depositor</SelectItem>
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
                    className={errors.typeOfInvestment ? "border-red-500" : ""}
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
                      setJointHolderName(value === "joint");
                    }}
                    className="flex items-center gap-2"
                  >
                    <div className="flex items-center gap-2 text-center">
                      <RadioGroupItem id="single" value="single" />
                      <Label htmlFor="single">Single</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id="joint" value="joint" />
                      <Label htmlFor="joint">Joint Name</Label>
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
            {jointHolderName && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jointHolderPan">Joint Holder Pan</Label>
                  <Controller
                    name="jointHolderPan"
                    control={control}
                    defaultValue={defaultValues.jointHolderPan}
                    render={({ field }) => (
                      <Input
                        id="jointHolderPan"
                        placeholder="Enter joint holder name"
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
            <div className="space-y-4 flex flex-col col-span-full">
              <h1>Point Of Contact</h1>
            </div>
            <div className="space-y-2">
              <Label>Name</Label>
              <Controller
                name="name"
                control={control}
                defaultValue={defaultValues.name}
                render={({ field }) => (
                  <Input
                    id="name"
                    placeholder="Enter Name"
                    {...field}
                    className={errors.name ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.name && (
                <span className="text-red-500">{errors.name.message}</span>
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
                    placeholder="Enter mobile number"
                    defaultCountry="in"
                    inputStyle={{ minWidth: "15.5rem" }}
                    value={field.value || ""}
                    onChange={field.onChange}
                    className={errors.mobile ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.mobile && (
                <span className="text-red-500">{errors.mobile.message}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Controller
                name="email"
                control={control}
                defaultValue={defaultValues.email}
                render={({ field }) => (
                  <Input
                    id="email"
                    placeholder="Enter email"
                    {...field}
                    className={errors.email ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.email && (
                <span className="text-red-500">{errors.email.message}</span>
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

export default EditFormHealth;

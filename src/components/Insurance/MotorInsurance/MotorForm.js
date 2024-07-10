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
import { Textarea } from "@com/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@com/ui/radio-group";
import Datepicker from "../../Beneficiarydetails/Datepicker";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Addnominee from "./addNominee";
import cross from "@/components/image/close.png";
import { PhoneInput } from "react-international-phone";

const schema = z
  .object({
    companyName: z
      .string()
      .nonempty({ message: "Insurance Company is required" }),
    othercompanyName: z.string().optional(),
    insuranceType: z
      .string()
      .nonempty({ message: "Insurance Sub Type is required" }),
    policyNumber: z.string().min(2, { message: "Policy Number is required" }),
    expiryDate: z.date().optional(),
    premium: z.string().min(3, { message: "Premium is required" }),
    sumInsured: z.string().min(3, { message: "Sum Insured is required" }),
    insurerName: z
      .string()
      .nonempty({ message: "Policy Holder Name is required" }),
    vehicleType: z.string().nonempty({ message: "Vehical Type is required" }),
    specificVehicalType: z.string().optional(),
    modeOfPurchase: z
      .string()
      .nonempty({ message: "Mode of Purchase is required" }),
    contactPerson: z.string().optional(),
    contactNumber: z.string().optional(),
    email: z.string().email({ message: "Invalid email address" }).optional(),
    registeredMobile: z.string().optional(),
    registeredEmail: z.string().optional(),
    additionalDetails: z.string().optional(),
    previousPolicyNumber: z.string().optional(),
    brokerName: z.string().optional(),
    image: z.any().optional(),
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

const FocusableSelectTrigger = forwardRef((props, ref) => (
  <SelectTrigger ref={ref} {...props} />
));

FocusableSelectTrigger.displayName = "FocusableSelectTrigger";

const MotorForm = () => {
  const navigate = useNavigate();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const queryClient = useQueryClient();
  const [showOtherInsuranceCompany, setShowOtherInsuranceCompany] =
    useState(false);
  const [showOtherRelationship, setShowOtherRelationship] = useState(false);
  const [hideRegisteredFields, setHideRegisteredFields] = useState(false);
  const [selectedNommie, setSelectedNommie] = useState([]);
  const [displaynominie, setDisplaynominie] = useState([]);
  const [brokerSelected, setBrokerSelected] = useState(true);
  const [nomineeerror, setnomineeerror] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: "",
      otherInsuranceCompany: "",
      insuranceType: "",
      policyNumber: "",
      expiryDate: "",
      premium: "",
      sumInsured: "",
      insurerName: "",
      vehicleType: "",
      otherRelationship: "",
      modeOfPurchase: "broker",
      contactPerson: "",
      contactNumber: "",
      email: "",
      registeredMobile: "",
      registeredEmail: "",
      additionalDetails: "",
      previousPolicyNumber: "",
      brokerName: "",
    },
  });

  const lifeInsuranceMutate = useMutation({
    mutationFn: async (data) => {
      console.log("data:", data);
      const formData = new FormData();
      for (const [key, value] of Object.entries(data)) {
        formData.append(key, value);
      }
      const response = await axios.post(`/api/motor-insurances`, formData, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });

      return response.data.data.MotorInsurances;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("LifeInsuranceData");
      toast.success("Motor Insurance added successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile");
    },
  });
  useEffect(() => {
    if (selectedNommie.length > 0) {
      setnomineeerror(false);
    }
  }, [selectedNommie, nomineeerror]);

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
    if (selectedNommie.length < 1) {
      setnomineeerror(true);
      return;
    }
    if (selectedNommie.length > 1) {
      setnomineeerror(false);
    }
    data.nominees = selectedNommie;
    lifeInsuranceMutate.mutate(data);
  };

  useEffect(() => {
    console.log("displaynominie:", displaynominie);
  }, [displaynominie]);

  return (
    <div className="w-full">
      <Card className="w-full ">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-2xl font-bold">
                Insurance Policy Details
              </CardTitle>
              <CardDescription>
                Fill out the form to add a new insurance policy.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 ">
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
                  render={({ field }) => (
                    <Select
                      id="insurance-company"
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherInsuranceCompany(value === "other");
                      }}
                      className={errors.companyName ? "border-red-500" : ""}
                    >
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select insurance company" />
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
                {showOtherInsuranceCompany && (
                  <Controller
                    name="otherInsuranceCompany"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Insurance Company"
                        className="mt-2"
                      />
                    )}
                  />
                )}
                {errors.insuranceCompany && (
                  <span className="text-red-500">
                    {errors.companyName.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="insurance-subtype">Insurance Type</Label>
                <Controller
                  name="insuranceType"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <RadioGroup
                        {...field}
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        defaultValue="thirdparty"
                        className="flex items-center gap-2"
                      >
                        <div className="flex items-center gap-2 text-center">
                          <RadioGroupItem id="thirdparty" value="thirdparty" />
                          <Label htmlFor="thirdparty">Third Party</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem id="" value="comprehensive" />
                          <Label htmlFor="comprehensive">Comprehensive</Label>
                        </div>
                      </RadioGroup>
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
                <Controller
                  name="policyNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="policy-number"
                      placeholder="Enter policy number"
                      {...field}
                      className={errors.policyNumber ? "border-red-500" : ""}
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
                <Label htmlFor="maturity-date">Maturity Date</Label>
                <Controller
                  name="expiryDate"
                  control={control}
                  render={({ field }) => (
                    <Datepicker
                      {...field}
                      onChange={(date) => field.onChange(date)}
                      selected={field.value}
                    />
                  )}
                />
                {errors.expiryDate && (
                  <span className="text-red-500 mt-5">
                    {errors.expiryDate.message}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="premium">Premium</Label>
                <Controller
                  name="premium"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="premium"
                      placeholder="Enter premium amount"
                      {...field}
                      className={errors.premium ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.premium && (
                  <span className="text-red-500">{errors.premium.message}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sum-insured">Sum Insured</Label>
                <Controller
                  name="sumInsured"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="sum-insured"
                      placeholder="Enter sum insured"
                      {...field}
                      className={errors.sumInsured ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.sumInsured && (
                  <span className="text-red-500">
                    {errors.sumInsured.message}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="policy-holder">Policy Holder Name</Label>
                <Controller
                  name="insurerName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="policy-holder"
                      placeholder="Enter policy holder name"
                      {...field}
                      className={errors.insurerName ? "border-red-500" : ""}
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
                <Controller
                  name="vehicleType"
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
                    >
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select vehicleType" />
                      </FocusableSelectTrigger>
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
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Vehical Type"
                        className="mt-2"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="previous-policy">Previous Policy Number</Label>
                <Controller
                  name="previousPolicyNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="previous-policy"
                      placeholder="Enter previous policy number"
                      {...field}
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="additional-details">Additional Details</Label>
                <Controller
                  name="additionalDetails"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      value={field.value}
                      id="additional-details"
                      placeholder="Enter additional details"
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
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
              {nomineeerror && (
                <span className="text-red-500">
                  Please select atleast one nominee
                </span>
              )}
            </div>

            <div className="space-y-4 flex flex-col">
              <Label className="text-lg font-bold">Mode of Purchase</Label>
              <Controller
                name="modeOfPurchase"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
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
                    render={({ field }) => (
                      <Input
                        id="registered-mobile"
                        placeholder="Enter registered mobile"
                        {...field}
                      />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registered-email">Registered Email ID</Label>
                  <Controller
                    name="registeredEmail"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="registered-email"
                        placeholder="Enter registered email"
                        type="email"
                        {...field}
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
                    <Label htmlFor="contact-person">Broker Name</Label>
                    <Controller
                      name="brokerName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="brokerName"
                          placeholder="Enter broker name"
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
                    <Label htmlFor="contact-person">Contact Person</Label>
                    <Controller
                      name="contactPerson"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="contact-person"
                          placeholder="Enter contact person name"
                          {...field}
                          className={
                            errors.contactPerson ? "border-red-500" : ""
                          }
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
                      control={control}
                      render={({ field }) => (
                        <PhoneInput
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
            <div className="space-y-2">
              <Label htmlFor="bullionFile">Upload Image</Label>
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
                    }}
                    className={errors.image ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.image && (
                <span className="text-red-500">{errors.image.message}</span>
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

export default MotorForm;

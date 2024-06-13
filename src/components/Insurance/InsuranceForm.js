import React, { useState, forwardRef } from "react";
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
import Datepicker from "./../Beneficiarydetails/Datepicker";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Addnominee from "./addNominee";
import cross from "../image/close.png";

const schema = z.object({
  companyName: z
    .string()
    .nonempty({ message: "Insurance Company is required" }),
  othercompanyName: z.string().optional(),
  insuranceType: z
    .string()
    .nonempty({ message: "Insurance Sub Type is required" }),
  policyNumber: z.string().nonempty({ message: "Policy Number is required" }),
  maturityDate: z.date().optional(),
  premium: z.string().nonempty({ message: "Premium is required" }),
  sumInsured: z.string().nonempty({ message: "Sum Insured is required" }),
  policyHolderName: z
    .string()
    .nonempty({ message: "Policy Holder Name is required" }),
  relationship: z.string().nonempty({ message: "Relationship is required" }),
  otherRelationship: z.string().optional(),
  modeOfPurchase: z
    .string()
    .nonempty({ message: "Mode of Purchase is required" }),
  contactPerson: z.string().nonempty({ message: "Contact Person is required" }),
  contactNumber: z.string().nonempty({ message: "Contact Number is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  registeredMobile: z.string().optional(),
  registeredEmail: z.string().optional(),
  additionalDetails: z.string().optional(),
  previousPolicyNumber: z.string().optional(),
  brokerName: z.string().nonempty({ message: "Broker Name is required" }),
});

const FocusableSelectTrigger = forwardRef((props, ref) => (
  <SelectTrigger ref={ref} {...props} />
));

FocusableSelectTrigger.displayName = "FocusableSelectTrigger";

const InsuranceForm = () => {
  const navigate = useNavigate();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const queryClient = useQueryClient();
  const [showOtherInsuranceCompany, setShowOtherInsuranceCompany] =
    useState(false);
  const [showOtherRelationship, setShowOtherRelationship] = useState(false);
  const [hideRegisteredFields, setHideRegisteredFields] = useState(false);
  const [selectedNommie, setSelectedNommie] = useState(null);
  const [displaynominie, setDisplaynominie] = useState(null);

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
      maturityDate: "",
      premium: "",
      sumInsured: "",
      policyHolderName: "",
      relationship: "",
      otherRelationship: "",
      modeOfPurchase: "",
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
      const response = await axios.post(
        `http://127.0.0.1:8000/api/lifeinsurances`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      return response.data.data.LifeInsurance;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("LifeInsuranceData");
      toast.success("Beneficiary added successfully!");
      navigate("/lifeinsurance");
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile");
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    data.nominees = selectedNommie;
    lifeInsuranceMutate.mutate(data);
  };

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
                <Label htmlFor="insurance-subtype">Insurance Sub Type</Label>
                <Controller
                  name="insuranceType"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="insurance-subtype"
                      placeholder="Enter sub type"
                      {...field}
                      className={errors.insuranceType ? "border-red-500" : ""}
                    />
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
                  name="maturityDate"
                  control={control}
                  render={({ field }) => (
                    <Datepicker
                      {...field}
                      onChange={(date) => field.onChange(date)}
                      selected={field.value}
                    />
                  )}
                />
                {errors.maturityDate && (
                  <span className="text-red-500">
                    {errors.maturityDate.message}
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
                  name="policyHolderName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="policy-holder"
                      placeholder="Enter policy holder name"
                      {...field}
                      className={
                        errors.policyHolderName ? "border-red-500" : ""
                      }
                    />
                  )}
                />
                {errors.policyHolderName && (
                  <span className="text-red-500">
                    {errors.policyHolderName.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship</Label>
                <Controller
                  name="relationship"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="relationship"
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherRelationship(value === "other");
                      }}
                      className={errors.relationship ? "border-red-500" : ""}
                    >
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </FocusableSelectTrigger>
                      <SelectContent>
                        <SelectItem value="self">Self</SelectItem>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {showOtherRelationship && (
                  <Controller
                    name="otherRelationship"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Relationship"
                        className="mt-2"
                      />
                    )}
                  />
                )}
                {errors.relationship && (
                  <span className="text-red-500">
                    {errors.relationship.message}
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
                      id="additional-details"
                      placeholder="Enter additional details"
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="registered-mobile">All nominee Selected</Label>
              <div className="grid gap-4 py-4">
                {displaynominie &&
                  displaynominie.map((nominee) => (
                    <div className="flex space-y-2 border border-input p-4 justify-between pl-4 pr-4 items-center rounded-lg">
                      <Label htmlFor={`nominee-${nominee?.id}`}>
                        {nominee?.fullLegalName}
                      </Label>
                      <img
                        onClick={() => {
                          setDisplaynominie(
                            filter(
                              displaynominie,
                              (item) => item.id !== nominee.id
                            )
                          );
                          setSelectedNommie(
                            filter(
                              selectedNommie,
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
            <div className="space-y-2">
              <Label htmlFor="registered-mobile">Add nominee</Label>
              <Addnominee
                setDisplaynominie={setDisplaynominie}
                setSelectedNommie={setSelectedNommie}
              />{" "}
            </div>

            <div className="space-y-4 flex flex-col">
              <Label>Mode of Purchase</Label>
              <Controller
                name="modeOfPurchase"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setHideRegisteredFields(value === "e-insurance");
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-person">Broker Name</Label>
                <Controller
                  name="brokerName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="contact-person"
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
                      className={errors.contactPerson ? "border-red-500" : ""}
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
                    <Input
                      id="contact-number"
                      placeholder="Enter contact number"
                      {...field}
                      className={errors.contactNumber ? "border-red-500" : ""}
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
                  <span className="text-red-500">{errors.email.message}</span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image-upload">Image Upload</Label>
              <Controller
                name="imageUpload"
                control={control}
                render={({ field }) => (
                  <Input id="image-upload" type="file" {...field} />
                )}
              />
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

export default InsuranceForm;

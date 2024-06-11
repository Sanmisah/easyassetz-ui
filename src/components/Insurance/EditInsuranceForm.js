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
import Datepicker from "./../Beneficiarydetails/Datepicker";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

const schema = z.object({
  insuranceCompany: z
    .string()
    .nonempty({ message: "Insurance Company is required" }),
  otherInsuranceCompany: z.string().optional(),
  insuranceSubtype: z
    .string()
    .nonempty({ message: "Insurance Sub Type is required" }),
  policyNumber: z.string().nonempty({ message: "Policy Number is required" }),
  maturityDate: z.string().nonempty({ message: "Maturity Date is required" }),
  premium: z.string().nonempty({ message: "Premium is required" }),
  sumInsured: z.string().nonempty({ message: "Sum Insured is required" }),
  policyHolder: z
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
  previousPolicy: z.string().optional(),
});

const InsuranceForm = () => {
  const [showOtherInsuranceCompany, setShowOtherInsuranceCompany] =
    useState(false);
  const [showOtherRelationship, setShowOtherRelationship] = useState(false);
  const [hideRegisteredFields, setHideRegisteredFields] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {},
  });

  useEffect(() => {
    // Fetch default values from API
    axios
      .get("/api/insurance/details")
      .then((response) => {
        const data = response.data;
        setDefaultValues(data);

        // Set fetched values to the form
        for (const key in data) {
          setValue(key, data[key]);
        }

        // Handle conditional fields based on fetched data
        setShowOtherInsuranceCompany(data.insuranceCompany === "other");
        setShowOtherRelationship(data.relationship === "other");
        setHideRegisteredFields(data.modeOfPurchase === "e-insurance");
      })
      .catch((error) => {
        console.error("Error fetching insurance details:", error);
      });
  }, [setValue]);

  const getPersonalData = async () => {
    if (!user) return;
    const response = await axios.get(
      `http://127.0.0.1:8000/api/beneficiaries/${benificiaryId}`,
      {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      }
    );

    return response.data.data.Beneficiary;
  };

  const {
    data: Benifyciary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["beneficiaryDataUpdate", benificiaryId],
    queryFn: getPersonalData,
    enabled: !!benificiaryId,

    onSuccess: (data) => {
      const data = response.data;
      setDefaultValues(data);

      // Set fetched values to the form
      for (const key in data) {
        setValue(key, data[key]);
      }

      // Handle conditional fields based on fetched data
      setShowOtherInsuranceCompany(data.insuranceCompany === "other");
      setShowOtherRelationship(data.relationship === "other");
      setHideRegisteredFields(data.modeOfPurchase === "e-insurance");

      // setValue("fullLegalName", data.fullLegalName);
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile", error.message);
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="insurance-company">Insurance Company</Label>
                <Controller
                  name="insuranceCompany"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="insurance-company"
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherInsuranceCompany(value === "other");
                      }}
                      className={
                        errors.insuranceCompany ? "border-red-500" : ""
                      }
                      defaultValue={defaultValues?.insuranceCompany || ""}
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
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Insurance Company"
                        className="mt-2"
                        defaultValue={
                          defaultValues?.otherInsuranceCompany || ""
                        }
                      />
                    )}
                  />
                )}
                {errors.insuranceCompany && (
                  <span className="text-red-500">
                    {errors.insuranceCompany.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="insurance-subtype">Insurance Sub Type</Label>
                <Controller
                  name="insuranceSubtype"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="insurance-subtype"
                      placeholder="Enter sub type"
                      {...field}
                      className={
                        errors.insuranceSubtype ? "border-red-500" : ""
                      }
                      defaultValue={defaultValues?.insuranceSubtype || ""}
                    />
                  )}
                />
                {errors.insuranceSubtype && (
                  <span className="text-red-500">
                    {errors.insuranceSubtype.message}
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
                      defaultValue={defaultValues?.policyNumber || ""}
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
                      defaultValue={defaultValues?.maturityDate || ""}
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
                      defaultValue={defaultValues?.premium || ""}
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
                      defaultValue={defaultValues?.sumInsured || ""}
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
                  name="policyHolder"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="policy-holder"
                      placeholder="Enter policy holder name"
                      {...field}
                      className={errors.policyHolder ? "border-red-500" : ""}
                      defaultValue={defaultValues?.policyHolder || ""}
                    />
                  )}
                />
                {errors.policyHolder && (
                  <span className="text-red-500">
                    {errors.policyHolder.message}
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
                      defaultValue={defaultValues?.relationship || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
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
                        defaultValue={defaultValues?.otherRelationship || ""}
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
                  name="previousPolicy"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="previous-policy"
                      placeholder="Enter previous policy number"
                      {...field}
                      defaultValue={defaultValues?.previousPolicy || ""}
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
                      defaultValue={defaultValues?.additionalDetails || ""}
                    />
                  )}
                />
              </div>
            </div>
            <div className="space-y-2">
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
                    defaultValue={defaultValues?.modeOfPurchase || ""}
                  >
                    <div className="flex items-center gap-2">
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
            {!hideRegisteredFields && (
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
                        defaultValue={defaultValues?.registeredMobile || ""}
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
                        defaultValue={defaultValues?.registeredEmail || ""}
                      />
                    )}
                  />
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      defaultValue={defaultValues?.contactPerson || ""}
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
                      defaultValue={defaultValues?.contactNumber || ""}
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
                      defaultValue={defaultValues?.email || ""}
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

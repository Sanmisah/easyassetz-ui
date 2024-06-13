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
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { setlifeInsuranceEditId } from "@/Redux/sessionSlice";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  companyName: z
    .string()
    .nonempty({ message: "Insurance Company is required" }),
  otherInsuranceCompany: z.string().optional(),
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
  previousPolicy: z.string().optional(),
});

const InsuranceForm = () => {
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
      `http://127.0.0.1:8000/api/lifeinsurances/${lifeInsuranceEditId}`,
      {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      }
    );

    return response.data.data.LifeInsurance;
  };

  const {
    data: Benifyciary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lifeInsuranceDataUpdate", lifeInsuranceEditId],
    queryFn: getPersonalData,

    onSuccess: (data) => {
      setDefaultValues(data);
      reset(data);
      setValue(data);
      setValue("relationship", data.relationship);
      setValue("otherRelationship", data.otherRelationship);
      setValue("registeredMobile", data.registeredMobile);
      setValue("registeredEmail", data.registeredEmail);
      setValue("additionalDetails", data.additionalDetails);
      setValue("previousPolicyNumber", data.previousPolicyNumber);
      setValue("brokerName", data.brokerName);
      setValue("policyNumber", data.policyNumber);
      setValue("maturityDate", data.maturityDate);
      setValue("premium", data.premium);
      setValue("sumInsured", data.sumInsured);
      setValue("policyHolderName", data.policyHolderName);
      setValue("policyHolderName", data.policyHolderName);
      setValue("modeOfPurchase", data.modeOfPurchase);
      setValue("contactPerson", data.contactPerson);
      setValue("contactNumber", data.contactNumber);
      setValue("email", data.email);
      setValue("registeredMobile", data.registeredMobile);
      setValue("registeredEmail", data.registeredEmail);
      setValue("additionalDetails", data.additionalDetails);
      setValue("previousPolicyNumber", data.previousPolicyNumber);
      setValue("brokerName", data.brokerName);

      console.log(data);
      if (data.modeOfPurchase === "e-insurance") {
        setBrokerSelected(false);
      } else {
        setBrokerSelected(true);
      }
      if (data.modeOfPurchase === "e-insurance") {
        setEInsuranceSelected(true);
      } else {
        setEInsuranceSelected(false);
      }

      // Set fetched values to the form
      for (const key in data) {
        setValue(key, data[key]);
      }

      setShowOtherInsuranceCompany(data.companyName === "other");
      setShowOtherRelationship(data.relationship === "other");
      setHideRegisteredFields(data.modeOfPurchase === "e-insurance");

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
        `http://127.0.0.1:8000/api/lifeinsurances/${lifeInsuranceEditId}`,
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
      queryClient.invalidateQueries(
        "lifeInsuranceDataUpdate",
        lifeInsuranceEditId
      );
      toast.success("Beneficiary added successfully!");
      navigate("/lifeinsurance");
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile");
    },
  });
  useEffect(() => {
    console.log("Form values:", control._formValues);
  }, [control._formValues]);

  const onSubmit = (data) => {
    console.log(data);
    reset(Benifyciary);
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
                <Label htmlFor="insuranceType">Insurance Sub Type</Label>
                <Controller
                  name="insuranceType"
                  control={control}
                  defaultValue={Benifyciary?.insuranceType || ""}
                  render={({ field }) => (
                    <Input
                      id="insuranceType"
                      placeholder="Enter sub type"
                      value={field.value}
                      {...field}
                      className={errors.insuranceType ? "border-red-500" : ""}
                      defaultValue={Benifyciary?.insuranceType || ""}
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
                <Label htmlFor="maturity-date">Maturity Date</Label>
                <Controller
                  name="maturityDate"
                  defaultValue={new Date(Benifyciary?.maturityDate) || ""}
                  control={control}
                  render={({ field }) => (
                    <Datepicker
                      {...field}
                      onChange={(date) => field.onChange(date)}
                      selected={field.value}
                      defaultValue={new Date(Benifyciary?.maturityDate) || ""}
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
              <div className="space-y-2">
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
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="policy-holder">Policy Holder Name</Label>
                <Controller
                  name="policyHolderName"
                  control={control}
                  defaultValue={Benifyciary?.policyHolderName || ""}
                  render={({ field }) => (
                    <Input
                      id="policy-holder"
                      placeholder="Enter policy holder name"
                      {...field}
                      className={
                        errors.policyHolderName ? "border-red-500" : ""
                      }
                      defaultValue={Benifyciary?.policyHolderName || ""}
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
                  defaultValue={Benifyciary?.relationship || ""}
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
                      defaultValue={Benifyciary?.relationship || ""}
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
                    defaultValue={Benifyciary?.otherRelationship || ""}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Relationship"
                        className="mt-2"
                        defaultValue={Benifyciary?.otherRelationship || ""}
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
                  defaultValue={Benifyciary?.previousPolicy || ""}
                  render={({ field }) => (
                    <Input
                      id="previous-policy"
                      placeholder="Enter previous policy number"
                      {...field}
                      defaultValue={Benifyciary?.previousPolicyNumber || ""}
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="additional-details">Additional Details</Label>
                <Controller
                  name="additionalDetails"
                  control={control}
                  defaultValue={Benifyciary?.additionalDetails || ""}
                  render={({ field }) => (
                    <Textarea
                      id="additional-details"
                      placeholder="Enter additional details"
                      {...field}
                      defaultValue={Benifyciary?.additionalDetails || ""}
                    />
                  )}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Mode of Purchase</Label>
              <Controller
                name="modeOfPurchase"
                defaultValue={Benifyciary?.modeOfPurchase || ""}
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setHideRegisteredFields(value === "e-insurance");
                      setBrokerSelected(value === "broker");
                    }}
                    defaultValue={Benifyciary?.modeOfPurchase || ""}
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
                    <Label htmlFor="contact-person">Broker Name</Label>
                    <Controller
                      name="brokerName"
                      control={control}
                      defaultValue={Benifyciary?.brokerName || ""}
                      render={({ field }) => (
                        <Input
                          id="contact-person"
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
                        <Input
                          id="contact-number"
                          placeholder="Enter contact number"
                          {...field}
                          className={
                            errors.contactNumber ? "border-red-500" : ""
                          }
                          defaultValue={Benifyciary?.contactNumber || ""}
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
              <Label htmlFor="image-upload">Image Upload</Label>
              <Controller
                name="imageUpload"
                control={control}
                defaultValue={Benifyciary?.imageUpload || ""}
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

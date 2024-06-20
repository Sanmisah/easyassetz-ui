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
import Addnominee from "./EditNominee";
import cross from "@/components/image/close.png";
import { PhoneInput } from "react-international-phone";

const schema = z.object({
  metalType: z
    .string()
    .nonempty({ message: "Insurance Company is required" }),
  otherInsuranceCompany: z.string().optional(),
  articleDetails: z
    .string()
    .nonempty({ message: "Insurance Sub Type is required" }),
  WeightPerArticle: z
    .string().min(1,{message:" Weight Per Article is Required"})
   ,
  numberOfArticle: z.date().optional(),
  additionalInformation: z
    .string().min(1,{message:"Additional Information is Required"}),
    
  pointOfContact: z
    .string().min(1,{message:"Point Of Conact is Required"}),
});

const BullionEdit = () => {
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
      `/api/other-insurances/${lifeInsuranceEditId}`,
      {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      }
    );
    if (response.data.data.OtherInsurance?.modeOfPurchase === "broker") {
      setBrokerSelected(true);
      setHideRegisteredFields(false);
    }
    if (response.data.data.OtherInsurance?.modeOfPurchase === "e-insurance") {
      setBrokerSelected(false);
      setHideRegisteredFields(true);
    }
    console.log(typeof response.data.data.OtherInsurance?.premium);
    return response.data.data.OtherInsurance;
  };

  const {
    data: Benifyciary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lifeInsuranceDataUpdate", lifeInsuranceEditId],
    queryFn: getPersonalData,

    onSuccess: (data) => {
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
      setValue("specificVehicalType", data.specificVehicalType);
      setValue("registeredMobile", data.registeredMobile);
      setValue("registeredEmail", data.registeredEmail);
      setValue("additionalDetails", data.additionalDetails);
      setValue("previousPolicyNumber", data.previousPolicyNumber);
      setValue("policyNumber", data.policyNumber);
      setValue("expiryDate", data.expiryDate);
      setValue("premium", data.premium);
      setValue("sumInsured", data.sumInsured);
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
      setValue("contactPerson", data.contactPerson);
      setValue("contactNumber", data.contactNumber);

      // Set fetched values to the form
      for (const key in data) {
        setValue(key, data[key]);
      }

      setShowOtherInsuranceCompany(data.companyName === "other");

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
        `/api/other-insurances/${lifeInsuranceEditId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      return response.data.data.OtherInsurance;
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

  useEffect(() => {
    if (Benifyciary?.nominees) {
      setDisplaynominie(Benifyciary?.nominees);
    }
  }, [Benifyciary?.nominees]);


  const onSubmit = (data) => {
    console.log(data);
    console.log("brokerName:", data.brokerName);
   if(data.metalType==="other"){
    data.metalType=data.otherMetalType
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
                <Label htmlFor="insurance-company">Metal Type</Label>
                <Controller
                  name="metalType"
                  control={control}
                  defaultValue={Benifyciary?.metalType}
                  render={({ field }) => (
                    <Select
                      id="insurance-company"
                      value={field.value}
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherInsuranceCompany(value === "other");
                      }}
                      className={errors.metalType ? "border-red-500" : ""}
                      defaultValue={Benifyciary?.metalType || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Metal Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="company1">Gold</SelectItem>
                        <SelectItem value="company2">Silver</SelectItem>
                        <SelectItem value="company3">Copper</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {showOtherInsuranceCompany && (
                  <Controller
                    name="otherMetalType"
                    control={control}
                    defaultValue={Benifyciary?.otherMetalType || ""}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Metal Type"
                        className="mt-2"
                        defaultValue={Benifyciary?.otherMetalType || ""}
                      />
                    )}
                  />
                )}
                {errors.metalType && (
                  <span className="text-red-500">
                    {errors.metalType.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="articleDetails">Ariticle Details </Label>
                <Controller
                  name="articleDetails"
                  control={control}
                  defaultValue={Benifyciary?.articleDetails || ""}
                  render={({ field }) => (
                      <Select
                      id="insurance-company"
                      value={field.value}
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherInsuranceCompany(value === "other");
                      }}
                      className={errors.articleDetails ? "border-red-500" : ""}
                      defaultValue={Benifyciary?.articleDetails || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Article Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="company1">Plates</SelectItem>
                        <SelectItem value="company2">Glass</SelectItem>
                        <SelectItem value="company3">Bowl</SelectItem>
                        <SelectItem value="company3">Bar</SelectItem>
                        <SelectItem value="company3">Utensils</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {showOtherInsuranceCompany && (
                  <Controller
                    name="otherArticleDetails"
                    control={control}
                    defaultValue={Benifyciary?.otherArticleDetails || ""}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Metal Type"
                        className="mt-2"
                        defaultValue={Benifyciary?.otherArticleDetails || ""}
                      />
                    )}
                  />
                
                  )}
                
                {errors.articleDetails && (
                  <span className="text-red-500">
                    {errors.articleDetails.message}
                  </span>
                )}
              </div>
            </div>
            
              <div className="space-y-2">
                <Label htmlFor="weightPerArticle">Weight Per Article</Label>
                <Controller
                  name="weightPerArticle"
                  defaultValue={new Date(Benifyciary?.expiryDate) || ""}
                  control={control}
                  render={({ field }) => (
                    <Input
                    id="weightPerArticle"
                    placeholder="Weight Per Aricle"
                    {...field}
                    className={errors.weightPerArticle ? "border-red-500" : ""}
                    defaultValue={Benifyciary?.weightPerArticle || ""}
                  />
                  )}
                />
                {errors.weightPerArticle && (
                  <span className="text-red-500">{errors.weightPerArticle.message}</span>
                )}
              </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numberOfArticle">Number Of Article</Label>
                <Controller
                  name="numberOfArticle"
                  control={control}
                  defaultValue={Benifyciary?.numberOfArticle || ""}
                  render={({ field }) => (
                    <Input
                      id="numberOfArticle"
                      placeholder="Enter Number Of Article"
                      {...field}
                      className={errors.numberOfArticle ? "border-red-500" : ""}
                      defaultValue={Benifyciary?.numberOfArticle || ""}
                    />
                  )}
                />
                {errors.premium && (
                  <span className="text-red-500">{errors.numberOfArticle.message}</span>
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
            </div>

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
            <div>
              <div className="space-y-2">
                <Label>additional details</Label>
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
            </div>

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
            <div className="space-y-2">
              <Label>Mode of Purchase</Label>
              <Controller
                name="modeOfPurchase"
                defaultValue={Benifyciary?.modeOfPurchase || ""}
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    defaultValue={Benifyciary?.modeOfPurchase || ""}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setHideRegisteredFields(value === "e-insurance");
                      setBrokerSelected(value === "broker");
                    }}
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

export default BullionEdit;

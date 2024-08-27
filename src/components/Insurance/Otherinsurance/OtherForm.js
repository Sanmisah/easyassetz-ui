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
import Addnominee from "@/components/Nominee/addNominee";
import cross from "@/components/image/close.png";
import { PhoneInput } from "react-international-phone";
import { AutoComplete } from "@com/ui/autocomplete";
import { Autocompeleteadd } from "../../Reuseablecomponent/Autocompeleteadd";
const schema = z.object({
  companyName: z
    .string()
    .nonempty({ message: "Insurance Company is required" }),
  otherInsuranceCompany: z.string().optional(),
  insuranceType: z
    .string()
    .nonempty({ message: "Insurance Sub Type is required" }),
  policyNumber: z.string().min(2, { message: "Policy Number is required" }),
  maturityDate: z.any().optional(),
  premium: z.string().optional(),
  sumInsured: z.string().optional(),
  policyHolderName: z
    .string()
    .nonempty({ message: "Policy Holder Name is required" }),
  modeOfPurchase: z.string().optional(),
  contactPerson: z.string().optional(),
  contactNumber: z.string().optional(),
  email: z.string().optional(),
  registeredMobile: z.string().optional(),
  registeredEmail: z.any().optional(),
  additionalDetails: z.string().optional(),
  brokerName: z.string().optional(),
});

const FocusableSelectTrigger = forwardRef((props, ref) => (
  <SelectTrigger ref={ref} {...props} />
));

FocusableSelectTrigger.displayName = "FocusableSelectTrigger";

const OtherForm = () => {
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
  const [takeinput, setTakeinput] = useState();
  const [inputvaluearray, setInputvaluearray] = useState({});
  const frameworks = {
    companyName: [
      { value: "company1", label: "Company1" },
      { value: "company2", label: "Company2" },
      { value: "company3", label: "Company3" },
    ],
    relationship: [
      { value: "self", label: "Self" },
      { value: "spouse", label: "Spouse" },
      { value: "child", label: "Child" },
      { value: "parent", label: "Parent" },
      { value: "sibling", label: "Sibling" },
      { value: "other", label: "Other" },
    ],
  };
  useEffect(() => {
    console.log("Values:", values?.value);
    if (takeinput !== values?.value) {
      setValues(takeinput);
      setValue("companyName", takeinput);
    }
  }, [takeinput]);
  const [values, setValues] = useState("");
  const {
    handleSubmit,
    control,
    setValue,
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
      console.log("data:", process.env.API_URL);
      const response = await axios.post(`/api/other-insurances`, data, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });

      return response.data.data.OtherInsurance;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("LifeInsuranceData");
      toast.success("Other Insurance added successfully!");
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
    console.log(data);
    if (data.maturityDate) {
      const date = new Date(data.maturityDate);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();
      const newdate = `${month}/${day}/${year}`;
      data.maturityDate = newdate;
    }
    console.log("Nomiee:", selectedNommie.length < 1);

    if (selectedNommie.length > 1) {
      setnomineeerror(false);
    }
    if (data.vehicleType === "other") {
      data.vehicleType = data.specificVehicalType;
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
            <div className="flex items-center gap-2">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Other Insurance Policy Details
                </CardTitle>
                <CardDescription>
                  Fill out the form to add a new Other Insurance Policy Details.
                </CardDescription>
              </div>
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
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="companyName"
                  control={control}
                  render={({ field }) => (
                    <Autocompeleteadd
                      options={frameworks.companyName}
                      placeholder="Select Comapany Name..."
                      emptyMessage="No Company Name Found."
                      value={values}
                      array={inputvaluearray}
                      setarray={setInputvaluearray}
                      variable="companyName"
                      onValueChange={(value) => {
                        setValues(value);
                        console.log(value);
                        setValue("companyName", value?.value);
                      }}
                    />
                  )}
                />

                {errors.insuranceCompany && (
                  <span className="text-red-500">
                    {errors.companyName.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="insurance-subtype">Insurance Type</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="insuranceType"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        {...field}
                        placeholder="Select Insurance Type"
                        className={errors.policyNumber ? "border-red-500" : ""}
                      />
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
                  render={({ field }) => (
                    <Input
                      id="policy-number"
                      placeholder="Enter Policy Number"
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
                <Label style={{ color: "red" }}>*</Label>
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
                  <span className="text-red-500 mt-5">
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
                      placeholder="Enter Premium Amount"
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
                      placeholder="Enter Sum Insured"
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
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="policyHolderName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="policy-holder"
                      placeholder="Enter Policy Holder Name"
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="additional-details">Additional Details</Label>
                <Controller
                  name="additionalDetails"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      value={field.value}
                      id="additional-details"
                      placeholder="Enter Additional Details"
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
                        placeholder="Enter Registered Mobile"
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
                        placeholder="Enter Registered Email"
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
                    <Label htmlFor="contact-person">Contact Person</Label>
                    <Controller
                      name="contactPerson"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="contact-person"
                          placeholder="Enter Contact Person Name"
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
                          placeholder="Enter Contact Number"
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
                          placeholder="Enter Email"
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
              <Label htmlFor="image-upload">Image Upload</Label>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <Input id="image-upload" type="file" {...field} />
                )}
              />
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

export default OtherForm;

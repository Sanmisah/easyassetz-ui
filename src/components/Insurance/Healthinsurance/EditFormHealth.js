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
import Addnominee from "@/components/Nominee/EditNominee";
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
  specifyInsuranceType: z.string().optional(),
  policyNumber: z.string().min(1, { message: "Policy Number is required" }),
  maturityDate: z.any().optional(),
  premium: z.string().min(1, { message: "Premium is required" }),
  sumInsured: z.string().min(1, { message: "Sum Insured is required" }),
  policyHolderName: z
    .string()
    .nonempty({ message: "Policy Holder Name is required" }),
  additionalDetails: z.string().optional(),
  modeOfPurchase: z
    .string()
    .nonempty({ message: "Mode of Purchase is required" }),
  contactPerson: z.string().optional(),
  contactNumber: z.string().optional(),
  email: z.string().optional(),
  registeredMobile: z.string().optional(),
  registeredEmail: z.string().optional(),
  brokerName: z.string().optional(),
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
  const [showOtherInsuranceType, setShowOtherInsuranceType] = useState(false);
  const [FamilyMembersCovered, setFamilyMembersCovered] = useState([]);
  const [showOtherFamilyMembersCovered, setShowOtherFamilyMembersCovered] =
    useState(false);
  const [defaultValues, setDefaultValues] = useState(null);
  const [brokerSelected, setBrokerSelected] = useState(false);
  const [selectedNommie, setSelectedNommie] = useState([]);
  const [displaynominie, setDisplaynominie] = useState([]);
  const [familymemberNominee, setFamilymemberNominee] = useState([]);
  const [inputvaluearray, setInputvaluearray] = useState({});
  const [displayfamilymemberNominee, setDisplayfamilymemberNominee] = useState(
    []
  );
  const [takeinput, setTakeinput] = useState();
  const frameworks = {
    companyName: [
      { value: "company1", label: "Company1" },
      { value: "company2", label: "Company2" },
      { value: "company3", label: "Company3" },
    ],
    insuranceType: [
      { value: "healthInsurance", label: "Health Insurance" },
      { value: "medicalInsurance", label: "Medical Insurance" },
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
  const [defautValue, setdefaultValue] = useState("");
  const [values, setValues] = useState("");
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
      `/api/health-insurances/${lifeInsuranceEditId}`,
      {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      }
    );
    let data = response.data.data.HealthInsurance;
    setValue("maturityDate", data.maturityDate);
    setdefaultValue({
      companyName: data.companyName,
      insuranceType: data.insuranceType,
    });
    if (
      data.companyName !== "company1" &&
      data.companyName !== "company2" &&
      data.companyName !== "company3"
    ) {
      setShowOtherInsuranceCompany(true);
      setValue("companyName", "other");
      setValue("otherInsuranceCompany", data.companyName);
    }
    if (
      data.insuranceType !== "mediclaim" &&
      data.insuranceType !== "criticalIllness" &&
      data.insuranceType !== "familyHealthPlan"
    ) {
      setShowOtherInsuranceType(true);
      setValue("insuranceType", "other");
      setValue("specifyInsuranceType", data.insuranceType);
    }
    if (response.data.data.HealthInsurance?.modeOfPurchase === "broker") {
      setBrokerSelected(true);
      setHideRegisteredFields(false);
    }
    if (response.data.data.HealthInsurance?.modeOfPurchase === "e-insurance") {
      setBrokerSelected(false);
      setHideRegisteredFields(true);
    }
    setSelectedNommie(data.nominees.map((nominee) => nominee.id));
    setFamilymemberNominee(data.familyMembers.map((nominee) => nominee.id));
    console.log(typeof response.data.data.HealthInsurance?.premium);
    return response.data.data.HealthInsurance;
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
      reset({
        ...data,
        maturityDate: data.maturityDate ? new Date(data.maturityDate) : null,
      });
      setValue("specificVehicalType", data.specificVehicalType);
      setValue("registeredMobile", data.registeredMobile);
      setValue("registeredEmail", data.registeredEmail);
      setValue("additionalDetails", data.additionalDetails);
      setValue("previousPolicyNumber", data.previousPolicyNumber);
      setValue("policyNumber", data.policyNumber);
      setValue(
        "maturityDate",
        data.maturityDate ? new Date(data.maturityDate) : null
      );
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
        `/api/health-insurances/${lifeInsuranceEditId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      return response.data.data.HealthInsurance;
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
    if (Benifyciary?.familyMembers) {
      setDisplayfamilymemberNominee(Benifyciary?.familyMembers);
    }
  }, [Benifyciary?.nominees, Benifyciary?.familyMembers]);

  useEffect(() => {
    console.log("familymemberNominee:", familymemberNominee);
    console.log("displayfamilymemberNominee:", displayfamilymemberNominee);
  }, [familymemberNominee, displayfamilymemberNominee]);
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
    if (data.maturityDate !== null) {
      const date = new Date(data.maturityDate);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();
      const newdate = `${month}/${day}/${year}`;
      data.maturityDate = newdate;
    }

    if (selectedNommie.length > 0) {
      data.nominees = selectedNommie;
    }

    if (familymemberNominee.length > 0) {
      data.familyMembers = familymemberNominee;
    }

    if (data.FamilyMembersCovered === "other") {
      data.FamilyMembersCovered = data.specifyFamilyMembersCovered;
    }
    if (data.insuranceType === "other") {
      data.insuranceType = data.specifyInsuranceType;
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
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Edit Health Insurance Policy Details
                </CardTitle>
                <CardDescription>
                  Fill out the form to update the Health Insurance Policy
                  Details.
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
                    <Autocompeleteadd
                      options={frameworks.companyName}
                      placeholder="Select Comapany Name..."
                      emptyMessage="No Company Name Found."
                      value={values}
                      array={inputvaluearray}
                      setarray={setInputvaluearray}
                      defautValues={defautValue?.companyName}
                      variable="companyName"
                      onValueChange={(value) => {
                        setValues(value);
                        console.log(value);
                        setValue("companyName", value?.value);
                      }}
                    />
                  )}
                />

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
                  defaultValue={Benifyciary?.insuranceType}
                  render={({ field }) => (
                    <div className="flex items-center gap-2 mt-2">
                      <Autocompeleteadd
                        options={frameworks.insuranceType}
                        placeholder="Select Insurance Type..."
                        emptyMessage="No Insurance Type Found."
                        value={values}
                        defautValues={defautValue?.insuranceType}
                        array={inputvaluearray}
                        setarray={setInputvaluearray}
                        variable="insuranceType"
                        onValueChange={(value) => {
                          setValues(value);
                          console.log(value);
                          setValue("insuranceType", value?.value);
                        }}
                      />
                    </div>
                  )}
                />
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
                <Label htmlFor="maturity-date">Maturity Date</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="maturityDate"
                  control={control}
                  render={({ field }) => (
                    <Datepicker
                      {...field}
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
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
              <div className="space-y-2">
                <Label htmlFor="sum-insured">Sum Insured</Label>
                <Label style={{ color: "red" }}>*</Label>
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
                <Label style={{ color: "red" }}>*</Label>
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
            <div>
              <div className="space-y-2 col-span-full">
                <Label htmlFor="FamilyMembersCovered">
                  Family Members Covered
                </Label>
                {displayfamilymemberNominee &&
                  displayfamilymemberNominee.length > 0 && (
                    <div className="space-y-2">
                      <div className="grid gap-4 py-4">
                        {console.log(displayfamilymemberNominee)}
                        {displayfamilymemberNominee &&
                          displayfamilymemberNominee.map((nominee) => (
                            <div className="flex space-y-2 border border-input p-4 justify-between pl-4 pr-4 items-center rounded-lg">
                              <Label htmlFor={`nominee-${nominee?.id}`}>
                                {nominee?.fullLegalName || nominee?.charityName}
                              </Label>
                              <img
                                className="w-4 h-4 cursor-pointer"
                                onClick={() => {
                                  setDisplayfamilymemberNominee(
                                    displayfamilymemberNominee.filter(
                                      (item) => item.id !== nominee.id
                                    )
                                  );
                                  setFamilymemberNominee(
                                    familymemberNominee.filter(
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
                <div className="space-y-2 col-span-full">
                  <Label htmlFor="registered-mobile">Add family members</Label>
                  <Addnominee
                    setDisplaynominie={setDisplayfamilymemberNominee}
                    setSelectedNommie={setFamilymemberNominee}
                    displaynominie={displayfamilymemberNominee}
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="space-y-2">
                <Label>additional details</Label>
                <Controller
                  name="additionalDetails"
                  control={control}
                  defaultValue={Benifyciary?.additionalDetails || ""}
                  render={({ field }) => (
                    <Input
                      id="additionalDetails"
                      placeholder="Enter registered mobile"
                      {...field}
                      defaultValue={Benifyciary?.additionalDetails || ""}
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
                name="image"
                control={control}
                defaultValue={Benifyciary?.image || ""}
                render={({ field }) => (
                  <Input id="image-upload" type="file" {...field} />
                )}
              />
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

export default EditFormHealth;

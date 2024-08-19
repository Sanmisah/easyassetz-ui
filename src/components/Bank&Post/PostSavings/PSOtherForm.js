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
// import Datepicker from "../../Beneficiarydetails/Datepicker";
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

const schema = z.object({
  bankName: z.string().nonempty({ message: "Insurance Company is required" }),
  accountType: z.string().optional(),
  accountNumber: z
    .string()
    .nonempty({ message: "Insurance Sub Type is required" }),
  branchName: z.string().min(2, { message: "Policy Number is required" }),
  city: z.any().optional(),
  holdingType: z.any().optional(),
  jointHolderName: z.any().optional(),
  jointHolderPan: z.any().optional(),
  additionalDetails: z.any().optional(),
});
// .refine(
//   (data) => {
//     if (data.modeOfPurchase === "single") {
//       return (
//         !!data.brokerName &&
//         !!data.contactPerson &&
//         !!data.contactNumber &&
//         !!data.email
//       );
//     }
//     if (data.modeOfPurchase === "joint") {
//       return !!data.jointHolderName && !!data.jointHolderPan;
//     }
//     return true;
//   },
//   {
//     message: "Required fields are missing",
//     path: ["holdingType"],
//   }
// );

const FocusableSelectTrigger = forwardRef((props, ref) => (
  <SelectTrigger ref={ref} {...props} />
));

FocusableSelectTrigger.displayName = "FocusableSelectTrigger";

const BankLockerForm = () => {
  const navigate = useNavigate();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const queryClient = useQueryClient();
  const [showOtherBankName, setShowOtherBankName] = useState(false);
  const [showOtherAccountType, setShowOtherAccountType] = useState(false);
  const [showOtherRelationship, setShowOtherRelationship] = useState(false);
  const [hideRegisteredFields, setHideRegisteredFields] = useState(false);
  const [selectedNommie, setSelectedNommie] = useState([]);
  const [showJointHolderName, setShowJointHolderName] = useState(false);
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
      bankName: "",
      accountType: "",
      accountNumber: "",
      branchName: "",
      city: "",
      holdingType: "",
      jointHolderName: "",
    },
  });

  const bankAccountMutate = useMutation({
    mutationFn: async (data) => {
      console.log("data:", data);
      const formData = new FormData();
      for (const [key, value] of Object.entries(data)) {
        formData.append(key, value);
      }
      const response = await axios.post(`/api/bank-accounts`, formData, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });

      return response.data.data.BankAccount;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("LifeInsuranceData");
      toast.success("Bank Account added successfully!");
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
    if (data.bankName === "other") {
      data.bankName = data.otherBankName;
    }
    // if (data.modeOfPurchase === "single") {
    //   data.jointHolderName = null;
    //   data.jointHolderPan = null;
    // }
    // if (data.modeOfPurchase === "joint") {
    //   data.brokerName = null;
    //   data.contactPerson = null;
    //   data.contactNumber = null;
    //   data.email = null;
    // }
    // const date = new Date(data.expiryDate);
    // const month = String(date.getMonth() + 1).padStart(2, "0");
    // const day = String(date.getDate()).padStart(2, "0");
    // const year = date.getFullYear();
    // const newdate = `${month}/${day}/${year}`;
    // data.expiryDate = newdate;
    if (data.accountType === "other") {
      data.accountType = data.otherAccountType;
    }

    if (selectedNommie.length > 1) {
      setnomineeerror(false);
    }
    data.nominees = selectedNommie;
    bankAccountMutate.mutate(data);
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
                Bank Account Details
              </CardTitle>
              <CardDescription>
                Fill out the form to add a new Bank Account.
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
                <Label htmlFor="bankName">Bank Name</Label>
                <Controller
                  name="bankName"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="bankName"
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherBankName(value === "other");
                      }}
                      className={errors.companyName ? "border-red-500" : ""}
                    >
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select Bank Name" />
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
                {showOtherBankName && (
                  <Controller
                    name="otherBankName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Bank Name"
                        className="mt-2"
                      />
                    )}
                  />
                )}
                {errors.bankName && (
                  <span className="text-red-500">
                    {errors.bankName.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountType">Account Type</Label>
                <Controller
                  name="accountType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="accountType"
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherAccountType(value === "other");
                      }}
                      className={errors.accountType ? "border-red-500" : ""}
                    >
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select Account Type" />
                      </FocusableSelectTrigger>
                      <SelectContent>
                        <SelectItem value="saving">Saving</SelectItem>
                        <SelectItem value="current">Current</SelectItem>
                        <SelectItem value="recurring">Recurring</SelectItem>
                        <SelectItem value="nri">NRI</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {showOtherAccountType && (
                  <Controller
                    name="otherAccountType"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Account Type"
                        className="mt-2"
                      />
                    )}
                  />
                )}
                {errors.bankName && (
                  <span className="text-red-500">
                    {errors.bankName.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Controller
                  name="accountNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="accountNumber"
                      placeholder="Enter Account Number"
                      {...field}
                      className={errors.accountNumber ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.accountNumber && (
                  <span className="text-red-500">
                    {errors.accountNumber.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="branchName">Branch Name</Label>
                <Controller
                  name="branchName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="branchName"
                      placeholder="Enter Branch Name"
                      {...field}
                      className={errors.branchName ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.branchName && (
                  <span className="text-red-500">
                    {errors.branchName.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="city"
                      placeholder="Enter Branch Name"
                      {...field}
                      className={errors.city ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.city && (
                  <span className="text-red-500">{errors.city.message}</span>
                )}
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="natureOfHolding">Nature of Holding</Label>
                <Controller
                  name="natureOfHolding"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowJointHolderName(value === "joint");
                      }}
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2 text-center">
                        <RadioGroupItem id="single" value="single" />
                        <Label htmlFor="single">Single</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem id="joint" value="joint" />
                        <Label htmlFor="joint">Joint</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
                {errors.natureOfHolding && (
                  <span className="text-red-500">
                    {errors.natureOfHolding.message}
                  </span>
                )}
              </div>
              {showJointHolderName && (
                <Controller
                  name="jointHolderName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="jointHolderName"
                      placeholder="Enter Joint Holder Name"
                      {...field}
                      className={errors.jointHolderName ? "border-red-500" : ""}
                    />
                  )}
                />
              )}
              {showJointHolderName && (
                <Controller
                  name="jointHolderPan"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="jointHolderPan"
                      placeholder="Enter Joint Holder PAN"
                      {...field}
                      className={errors.jointHolderPan ? "border-red-500" : ""}
                    />
                  )}
                />
              )}
            </div>
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div> */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div> */}
            {/* <div className="space-y-2">
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
              </div> */}
            {/* <div className="space-y-2">
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
              </div> */}
            {/* <div className="space-y-2">
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
            </div> */}
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

            {/* <div className="space-y-4 flex flex-col">
              <Label className="text-lg font-bold">Mode of Purchase</Label>
              <Controller
                name="modeOfPurchase"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setHideRegisteredFields(value === "joint");
                      setBrokerSelected(value === "single");
                      if (value === "joint") {
                        setValue("brokerName", "");
                        setValue("contactPerson", "");
                        setValue("contactNumber", "");
                        setValue("email", "");
                      } else if (value === "single") {
                        setValue("jointHolderName", "");
                        setValue("jointHolderPan", "");
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <div className="flex items-center gap-2 text-center">
                      <RadioGroupItem id="single" value="single" />
                      <Label htmlFor="single">Broker</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id="joint" value="joint" />
                      <Label htmlFor="joint">E-Insurance</Label>
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
                    name="jointHolderName"
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
                    name="jointHolderPan"
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
                          placeholder="Enter single name"
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
            </div> */}

            <CardFooter className="flex justify-end gap-2 mt-8">
              <Button type="submit">Submit</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankLockerForm;

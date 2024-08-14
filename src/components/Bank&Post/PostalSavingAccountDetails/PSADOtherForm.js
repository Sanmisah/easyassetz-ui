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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { PhoneInput } from "react-international-phone";
import Addnominee from "@/components/Nominee/addNominee";
import { RadioGroup, RadioGroupItem } from "@com/ui/radio-group";
import cross from "@/components/image/close.png";
// import Datepicker from "../../Beneficiarydetails/Datepicker";

const schema = z.object({
  accountNumber: z.string().nonempty({ message: "Account Number is required" }),
  postOfficeBranch: z.string().optional(),
  // maturityDate: z.any().optional(),
  city: z.any().optional(),
  // myStatus: z.string().nonempty({ message: "My Status is required" }),
  holdingType: z.string().nonempty({ message: "Holding Type is required" }),
  jointHolderName: z.string().optional(),
  jointHolderPan: z.string().optional(),
  // documentAvailability: z
  //   .string()
  //   .nonempty({ message: "Document Availability is required" }),
  additionalDetails: z.string().optional(),
  // typeOfInvestment: z
  //   .string()
  image: z.any().optional(),
});

const FocusableSelectTrigger = forwardRef((props, ref) => (
  <SelectTrigger ref={ref} {...props} />
));

FocusableSelectTrigger.displayName = "FocusableSelectTrigger";

const PSADOtherForm = () => {
  const navigate = useNavigate();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const queryClient = useQueryClient();
  const [showOtherCompanyRegistration, setShowOtherCompanyRegistration] =
    useState(true);
  const [showOtherMyStatus, setShowOthermyStatus] = useState(false);
  const [showOtherArticleDetails, setShowOtherArticleDetails] = useState(false);
  const [showOthertypeOfInvestment, setShowOthertypeOfInvestment] =
    useState(false);
  const [showOtherPPFAccountNo, setShowOtherPPFAccountNo] = useState(false);
  const [showOtherCompanyName, setshowOtherCompanyName] = useState(false);
  const [selectedNommie, setSelectedNommie] = useState([]);
  const [showOtherAccountNumber, setShowOtherAccountNumber] = useState(false);
  const [nomineeerror, setNomineeError] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState(null);
  const [displaynominie, setDisplaynominie] = useState([]);
  const [showOtherRegistrationNumber, setShowOtherRegistrationNumber] =
    useState(false);
  const [showOtherType, setShowOtherType] = useState(false);
  const [otherFirmRegistrationNumber, setOtherFirmRegistrationNumber] =
    useState("");
  const [otherFirmName, setOtherFirmName] = useState("");
  const [showOtherJointHolderName, setShowOtherJointHolderName] =
    useState(false);

  const [showOtherJointName, setShowOtherJointName] = useState(false);
  const {
    handleSubmit,
    control,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      accountNumber: "",
      postOfficeBranch: "",
      city: "",
      // maturityDate: "",
      holdingType: "",
      jointHolderName: "",
      jointHolderPan: "",
      additionalDetails: "",
    },
  });

  const lifeInsuranceMutate = useMutation({
    mutationFn: async (data) => {
      const Formdata = new FormData();
      Formdata.append("image", data.image);

      for (const [key, value] of Object.entries(data)) {
        Formdata.append(key, value);
      }
      const response = await axios.post(
        `/api/post-saving-account-details`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );

      return response.data.data.PostalSavingAccount;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("LifeInsuranceData");
      toast.success("Post Saving Account details added successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile");
    },
  });

  useEffect(() => {
    if (selectedNommie.length > 0) {
      setNomineeError(false);
    }
  }, [selectedNommie]);

  const onSubmit = (data) => {
    console.log(data);
    // const date = new Date(data.maturityDate);
    // const month = String(date.getMonth() + 1).padStart(2, "0");
    // const day = String(date.getDate()).padStart(2, "0");
    // const year = date.getFullYear();
    // const newdate = `${month}/${day}/${year}`;
    // data.maturityDate = newdate;

    // data.firmsRegistrationNumberType = showOtherCompanyRegistration;
    // if (selectedNommie.length < 1) {
    //   toast.error("Please select atleast one nominee");
    //   setNomineeError(true);
    //   return;
    // }
    if (selectedNommie.length > 0) {
      data.nominees = selectedNommie;
    }

    if (data.accountNumber === "other") {
      data.accountNumber = data.otherAccountNumber;
    }
    delete data.otherAccountNumber;

    // data.type = "company";
    // data.mobile = phone;
    // if (data) {
    //   data.firmName = data.otherFirmName;
    // }

    lifeInsuranceMutate.mutate(data);
  };

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button onClick={() => navigate("/psad")}>Back</Button>
              <div>
                <CardTitle className="text-2xl font-bold">
                  Postal Saving Account Details
                </CardTitle>
                <CardDescription>
                  Fill out the form to add the Postal Saving Account Details.
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
                <Label htmlFor="accountNumber">Account Type</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="accountNumber"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="accountNumber"
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherAccountNumber(value === "other");
                      }}
                      className={errors.accountNumber ? "border-red-500" : ""}
                    >
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select Account Type" />
                      </FocusableSelectTrigger>
                      <SelectContent>
                        <SelectItem value="nsc">NSC</SelectItem>
                        <SelectItem value="kvp">KVP</SelectItem>
                        <SelectItem value="ivp">IVP</SelectItem>
                        <SelectItem value="savingsAccount">
                          Savings Account
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {showOtherAccountNumber && (
                  <Controller
                    name="otherAccountNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Account Type"
                        className="mt-2"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    )}
                  />
                )}
                {errors.accountNumber && (
                  <span className="text-red-500">
                    {errors.accountNumber.message}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="postOfficeBranch">Post Office Branch</Label>
              <Controller
                name="postOfficeBranch"
                control={control}
                render={({ field }) => (
                  <Input
                    id="postOfficeBranch"
                    placeholder="Enter Post Office Branch"
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className={errors.postOfficeBranch ? "border-red-500" : ""}
                  />
                )}
              />

              {errors.postOfficeBranch && (
                <span className="text-red-500">
                  {errors.postOfficeBranch.message}
                </span>
              )}
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="maturityDate">Maturity Date</Label>
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
            </div> */}

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Input
                    id="city"
                    placeholder="Enter City"
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className={errors.city ? "border-red-500" : ""}
                  />
                )}
              />
              {showOtherPPFAccountNo && (
                <Controller
                  name="otherPPFAccountNo"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Specify Amount"
                      className="mt-2"
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  )}
                />
              )}
              {errors.amount && (
                <span className="text-red-500">{errors.amount.message}</span>
              )}
            </div>

            <div className="space-y-4 flex flex-col">
              <Label className="text-lg font-bold">Holding Type</Label>
              <Label style={{ color: "red" }}>*</Label>
              <Controller
                name="holdingType"
                defaultValues="single"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    defaultValue="single"
                    onValueChange={(value) => {
                      field.onChange(value);
                      setShowOtherJointName(value === "joint");
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

            {showOtherJointName && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jointHolderName">Joint Holder Name</Label>
                  <Input
                    id="jointHolderName"
                    placeholder="Enter Joint Holder Name"
                    {...register("jointHolderName")}
                    className={errors.jointHolderName ? "border-red-500" : ""}
                  />
                  {errors.jointHolderName && (
                    <span className="text-red-500">
                      {errors.jointHolderName.message}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jointHolderPan">Joint Holder PAN</Label>
                  <Input
                    id="jointHolderPan"
                    placeholder="Enter Joint Holder PAN"
                    {...register("jointHolderPan")}
                    className={errors.jointHolderPan ? "border-red-500" : ""}
                  />
                  {errors.jointHolderPan && (
                    <span className="text-red-500">
                      {errors.jointHolderPan.message}
                    </span>
                  )}
                </div>
              </div>
            )}
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
              <Label htmlFor="registered-phone">Add nominee</Label>
              <Addnominee
                setSelectedNommie={setSelectedNommie}
                selectedNommie={selectedNommie}
                displaynominie={displaynominie}
                setDisplaynominie={setDisplaynominie}
              />{" "}
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalDetails">Additional Information</Label>
              <Controller
                name="additionalDetails"
                control={control}
                render={({ field }) => (
                  <Input
                    id="additionalDetails"
                    placeholder="Enter Additional Information"
                    {...field}
                    value={field.value || ""}
                    onChange={field.onChange}
                    className={errors.additionalDetails ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.additionalDetails && (
                <span className="text-red-500">
                  {errors.additionalDetails.message}
                </span>
              )}
            </div>
            <div className="space-y-2 col-span-full">
              <Label>Upload File</Label>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <Input
                    id="file"
                    type="file"
                    onChange={(event) => {
                      field.onChange(
                        event.target.files && event.target.files[0]
                      );
                    }}
                    className={errors.file ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.file && (
                <span className="text-red-500">{errors.file.message}</span>
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

export default PSADOtherForm;

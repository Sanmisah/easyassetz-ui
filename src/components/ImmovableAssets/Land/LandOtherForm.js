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
import { RadioGroup, RadioGroupItem } from "@com/ui/radio-group";
import Addnominee from "@/components/Nominee/addNominee";
import cross from "@/components/image/close.png";
import { Checkbox } from "@/shadcncomponents/ui/checkbox";
const schema = z.object({
  propertyType: z.any().optional(),
  surveyNumber: z.any().optional(),
  address: z.any().optional(),
  villageName: z.string().nonempty({ message: "Village Name is required" }),
  district: z.string().nonempty({ message: "District is required" }),
  taluka: z.any().optional(),
  ownershipByVirtueOf: z
    .string()
    .nonempty({ message: "Ownership By Virtue Of is required" }),
  ownershipType: z.string().nonempty({ message: "Ownership Type is required" }),

  firstHoldersName: z.string().optional(),
  firstHoldersRelation: z.string().optional(),
  firstHoldersPan: z.string().optional(),
  firstHoldersAadhar: z.string().optional(),
  jointHoldersName: z.string().optional(),
  jointHoldersRelation: z.string().optional(),
  jointHoldersPan: z.string().optional(),
  jointHoldersAadhar: z.string().optional(),
  anyLoanLitigation: z.any().optional(),
  anyMortgage: z.string().optional(),

  name: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().optional(),
});

const FocusableSelectTrigger = forwardRef((props, ref) => (
  <SelectTrigger ref={ref} {...props} />
));

FocusableSelectTrigger.displayName = "FocusableSelectTrigger";

const LandOtherform = () => {
  const navigate = useNavigate();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const queryClient = useQueryClient();
  const [showOtherMetalType, setShowOtherMetalType] = useState(false);
  const [showOtherArticleDetails, setShowOtherArticleDetails] = useState(false);
  const [selectedNommie, setSelectedNommie] = useState([]);
  const [displaynominie, setDisplaynominie] = useState([]);
  const [Joinholder, setJoinholder] = useState(false);
  const [nomineeerror, setNomineeError] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setPhone] = useState("");
  const {
    handleSubmit,
    control,
    setValue,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      metalType: "",
      otherMetalType: "",
      articleDetails: "",
      otherArticleDetails: "",
      ownershipByVirtueOf: "selfpurchase",
      weightPerArticle: "",
      ownershipType: "single",
      anyLoanLitigation: "no",
      numberOfArticles: "",
      additionalInformation: "",
      name: "",
      email: "",
      mobile: "",
    },
  });
  useEffect(() => {
    setValue("anyLoanLitigation", "no");
  }, []);
  const handlePincodeChange = async (pincode) => {
    try {
      setValue("pincode", pincode);
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const { Block, State, Country } = response.data[0].PostOffice[0];
      setValue("city", Block);
      setValue("state", State);
      setValue("country", Country);
    } catch (error) {
      console.error("Failed to fetch pincode details:", error);
    }
  };

  const lifeInsuranceMutate = useMutation({
    mutationFn: async (data) => {
      const Formdata = new FormData();
      Formdata.append("bullionFile", data.bullionFile);

      for (const [key, value] of Object.entries(data)) {
        Formdata.append(key, value);
      }

      const response = await axios.post(
        `/api/lands`,

        Formdata,

        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );

      return response.data.data.Bullion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("LifeInsuranceData");
      toast.success("Land added successfully!");
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
    if (data.metalType === "other") {
      data.metalType = data.otherMetalType;
    }
    if (data.articleDetails === "other") {
      data.articleDetails = data.otherArticleDetails;
    }
    // data.name = name;
    // data.email = email;
    // data.mobile = mobile;
    delete data.otherMetalType;
    delete data.otherArticleDetails;

    lifeInsuranceMutate.mutate(data);
  };

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex md:flex-row items-start md:items-center justify-between gap-2">
            <div className="flex md:flex-row items-start md:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Land Details
                </CardTitle>
                <CardDescription>
                  Fill out the form to add a new Land.
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
                <Label htmlFor="propertyType">Property Type</Label>
                <Controller
                  name="propertyType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="propertyType"
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherMetalType(value === "other");
                      }}
                      className={errors.propertyType ? "border-red-500" : ""}
                    >
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select Property Type" />
                      </FocusableSelectTrigger>
                      <SelectContent>
                        <SelectItem value="agriculturalLand">
                          Agricultural Land
                        </SelectItem>
                        <SelectItem value="nonAgriculturalLand">
                          Non-Agricultural Land
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.propertyType && (
                  <span className="text-red-500">
                    {errors.propertyType.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="surveyNumber">Survey Number</Label>
                <Controller
                  name="surveyNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="surveyNumber"
                      placeholder="Enter Survey Number"
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                      className={errors.surveyNumber ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.surveyNumber && (
                  <span className="text-red-500">
                    {errors.surveyNumber.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address Line</Label>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="address"
                      placeholder="Enter Address"
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                      className={errors.address ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.address && (
                  <span className="text-red-500">{errors.address.message}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="villageName">Village Name</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="villageName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="villageName"
                      placeholder="Enter Village Name"
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                      className={errors.villageName ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.villageName && (
                  <span className="text-red-500">
                    {errors.villageName.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="district"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="district"
                      placeholder="Enter District"
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                      className={errors.district ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.district && (
                  <span className="text-red-500">
                    {errors.district.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="taluka">Taluka</Label>
                <Controller
                  name="taluka"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="taluka"
                      placeholder="Enter Taluka"
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                      className={errors.taluka ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.taluka && (
                  <span className="text-red-500">{errors.taluka.message}</span>
                )}
              </div>

              <div className="space-y-2 col-span-full">
                <Label className="text-lg font-bold mt-8">
                  Ownership Details
                </Label>
              </div>

              <div className="space-y-2 wrap ">
                <Label htmlFor="ownershipByVirtueOf">
                  Ownership By Virtue Of
                </Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="ownershipByVirtueOf"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      <div className="flex items-center gap-4 flex-wrap">
                        <Label
                          className="flex items-center gap-2"
                          htmlFor="pan-yes"
                        >
                          <RadioGroupItem id="pan-yes" value="selfpurchase" />
                          Self Purchase
                        </Label>
                        <Label
                          className="flex items-center gap-2"
                          htmlFor="pan-no"
                        >
                          <RadioGroupItem id="pan-no" value="asagift" />
                          As a gift
                        </Label>
                        <Label
                          className="flex items-center gap-2"
                          htmlFor="pan-no"
                        >
                          <RadioGroupItem id="pan-no" value="ancestralland" />
                          Ancestral Land
                        </Label>
                      </div>
                    </RadioGroup>
                  )}
                />
                {errors.ownershipByVirtueOf && (
                  <span className="text-red-500">
                    {errors.ownershipByVirtueOf.message}
                  </span>
                )}
              </div>
              <div className="space-y-2 wrap col-span-full">
                <Label htmlFor="ownershipByVirtueOf">Ownership Type</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="ownershipType"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setJoinholder(value === "joint");
                      }}
                    >
                      <div className="flex items-center gap-4 flex-wrap">
                        <Label
                          className="flex items-center gap-2"
                          htmlFor="pan-yes"
                        >
                          <RadioGroupItem id="pan-yes" value="single" />
                          Single
                        </Label>
                        <Label
                          className="flex items-center gap-2"
                          htmlFor="pan-no"
                        >
                          <RadioGroupItem id="pan-no" value="joint" />
                          Joint
                        </Label>
                      </div>
                    </RadioGroup>
                  )}
                />
                {errors.ownershipByVirtueOf && (
                  <span className="text-red-500">
                    {errors.ownershipByVirtueOf.message}
                  </span>
                )}
              </div>
              <div>
                {Joinholder && (
                  <div className="space-y-2 wrap col-span-full">
                    <Label> First Joint Holder Name</Label>
                    <Controller
                      name="firstHoldersName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="firstHoldersName"
                          placeholder="Enter Joint Holder Name"
                          {...field}
                          value={field.value || ""}
                          onChange={field.onChange}
                          className={
                            errors.firstHoldersName ? "border-red-500" : ""
                          }
                        />
                      )}
                    />
                    {errors.firstHoldersRelation && (
                      <span className="text-red-500">
                        {errors.firstHoldersRelation.message}
                      </span>
                    )}
                  </div>
                )}
                {Joinholder && (
                  <div className="space-y-2 wrap col-span-full">
                    <Label> First Joint Holder Relation</Label>
                    <Controller
                      name="firstHoldersRelation"
                      control={control}
                      render={({ field }) => (
                        <Select
                          id="firstHoldersRelation"
                          value={field.value}
                          onValueChange={field.onChange}
                          className={
                            errors.firstHoldersRelation ? "border-red-500" : ""
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Relationship" />
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
                    {errors.firstHoldersRelation && (
                      <span className="text-red-500">
                        {errors.firstHoldersRelation.message}
                      </span>
                    )}
                  </div>
                )}
                {Joinholder && (
                  <div className="space-y-2 wrap col-span-full">
                    <Label>First Joint Holder PAN</Label>
                    <Controller
                      name="firstHoldersPan"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="joinHoldersName"
                          placeholder="Enter Joint Holder Name"
                          {...field}
                          value={field.value?.toUpperCase() || ""}
                          onChange={field.onChange}
                          className={
                            errors.joinHoldersName ? "border-red-500" : ""
                          }
                        />
                      )}
                    />
                    {errors.joinHoldersName && (
                      <span className="text-red-500">
                        {errors.joinHoldersName.message}
                      </span>
                    )}
                  </div>
                )}
                {Joinholder && (
                  <div className="space-y-2 wrap col-span-full">
                    <Label>First Joint Holder Aadhar</Label>
                    <Controller
                      name="firstHoldersAadhar"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="firstHoldersAadhar"
                          placeholder="Enter Joint Holder Name"
                          {...field}
                          value={field.value || ""}
                          onChange={field.onChange}
                          className={
                            errors.joinHoldersName ? "border-red-500" : ""
                          }
                        />
                      )}
                    />
                    {errors.joinHoldersName && (
                      <span className="text-red-500">
                        {errors.joinHoldersName.message}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div>
                {Joinholder && (
                  <div className="space-y-2 wrap col-span-full">
                    <Label> Second Joint Holder Name</Label>
                    <Controller
                      name="jointHoldersName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="joinHoldersName"
                          placeholder="Enter Joint Holder Name"
                          {...field}
                          value={field.value || ""}
                          onChange={field.onChange}
                          className={
                            errors.joinHoldersName ? "border-red-500" : ""
                          }
                        />
                      )}
                    />
                    {errors.joinHoldersName && (
                      <span className="text-red-500">
                        {errors.joinHoldersName.message}
                      </span>
                    )}
                  </div>
                )}
                {Joinholder && (
                  <div className="space-y-2 wrap col-span-full">
                    <Label> Second Joint Holder Relation</Label>
                    <Controller
                      name="jointHoldersRelation"
                      control={control}
                      render={({ field }) => (
                        <Select
                          id="jointHoldersRelation"
                          value={field.value}
                          onValueChange={field.onChange}
                          className={
                            errors.joinHoldersRelation ? "border-red-500" : ""
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Relationship" />
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
                    {errors.joinHoldersName && (
                      <span className="text-red-500">
                        {errors.joinHoldersName.message}
                      </span>
                    )}
                  </div>
                )}
                {Joinholder && (
                  <div className="space-y-2 wrap col-span-full">
                    <Label> Second Joint Holder Pan</Label>
                    <Controller
                      name="jointHoldersPan"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="joinHoldersName"
                          placeholder="Enter Joint Holder Name"
                          {...field}
                          value={field.value?.toUpperCase() || ""}
                          onChange={field.onChange}
                          className={
                            errors.joinHoldersName ? "border-red-500" : ""
                          }
                        />
                      )}
                    />
                    {errors.joinHoldersName && (
                      <span className="text-red-500">
                        {errors.joinHoldersName.message}
                      </span>
                    )}
                  </div>
                )}
                {Joinholder && (
                  <div className="space-y-2 wrap col-span-full">
                    <Label> Second Joint Holder Aadhar</Label>
                    <Controller
                      name="jointHoldersAadhar"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="joinHoldersName"
                          placeholder="Enter Joint Holder Name"
                          {...field}
                          value={field.value || ""}
                          onChange={field.onChange}
                          className={
                            errors.joinHoldersName ? "border-red-500" : ""
                          }
                        />
                      )}
                    />
                    {errors.joinHoldersName && (
                      <span className="text-red-500">
                        {errors.joinHoldersName.message}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-2 space-x-2">
                <Label>Any Loan or Litigation</Label>
                <Controller
                  name="anyLoanLitigation"
                  defaultValue="no"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      defaultValue="no"
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2 text-center">
                        <RadioGroupItem id="cash" value="yes" />
                        <Label htmlFor="yes">Yes</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem id="cheque" value="no" />
                        <Label htmlFor="no">No</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
                {errors.anyLoanLitigation && (
                  <span className="text-red-500">
                    {errors.anyLoanLitigation.message}
                  </span>
                )}
              </div>
              <div className="space-y-2 col-span-full">
                <Label>Point Of Contact</Label>
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Controller
                  name="name"
                  control={control}
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
                  render={({ field }) => (
                    <PhoneInput
                      id="mobile"
                      type="tel"
                      placeholder="Enter mobile number"
                      defaultCountry="in"
                      inputStyle={{ minWidth: "15.5rem" }}
                      {...field}
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
                  <span className="text-red-500">{errors.email.message}</span>
                )}
              </div>
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

export default LandOtherform;

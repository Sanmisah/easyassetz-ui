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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Addnominee from "@/components/Nominee/addNominee";
import cross from "@/components/image/close.png";
import { RadioGroup, RadioGroupItem } from "@com/ui/radio-group";
import { PhoneInput } from "react-international-phone";
import { Checkbox } from "@com/ui/checkbox";

const FocusableSelectTrigger = forwardRef((props, ref) => (
  <SelectTrigger ref={ref} {...props} />
));
const schema = z.object({
  propertyType: z.any().optional(),
  houseNumber: z.string().nonempty({ message: "House Number is required" }),
  address1: z.string().nonempty({ message: "Address Line 1 is required" }),
  pincode: z.string().nonempty({ message: "Pincode is required" }),
  area: z.string().nonempty({ message: "Area is required" }),
  city: z.string().optional(),
  state: z.string().nonempty({ message: "State is required" }),
  propertyStatus: z
    .string()
    .nonempty({ message: "Property Status is required" }),
  ownershipByVirtueOf: z
    .string()
    .nonempty({ message: "Ownership By Virtue Of is required" }),
  ownershipType: z.string().nonempty({ message: "Ownership Type is required" }),
  firstHoldersName: z.any().optional(),
  firstHoldersRelation: z.any().optional(),
  firstHoldersAadhar: z.any().optional(),
  firstHoldersPan: z.any().optional(),
  jointHoldersName: z.any().optional(),
  jointHoldersRelation: z.any().optional(),
  jointHoldersPan: z.any().optional(),
  anyLoanLitigation: z.any().optional(),
});

const ResidentialEditForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const [showOtherMetalType, setShowOtherMetalType] = useState(false);
  const [showOtherArticleDetails, setShowOtherArticleDetails] = useState(false);
  const { lifeInsuranceEditId } = useSelector((state) => state.counterSlice);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState(null);
  const [defaultValues, setDefaultValues] = useState(null);
  const [jointHolderName, setJointHolderName] = useState(false);
  const [Joinholder, setJoinholder] = useState(false);
  const [displaynominie, setDisplaynominie] = useState([]);
  const [selectedNommie, setSelectedNommie] = useState([]);
  const [numberOfArticles, setNumberOfArticles] = useState(null);

  useEffect(() => {
    if (lifeInsuranceEditId) {
      console.log("lifeInsuranceEditId:", lifeInsuranceEditId);
    }
  }, [lifeInsuranceEditId]);

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
      `/api/residential-properties/${lifeInsuranceEditId}`,
      {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      }
    );
    const data = response.data.data.ResidentialProperty;
    // console.log("bullion:", bullion);
    if (data.ownershipType === "joint") {
      setJoinholder(true);
    }
    setValue("propertyType", data.propertyType);
    setValue("houseNumber", data.houseNumber);
    setValue("address1", data.address1);
    setValue("pincode", data.pincode);
    setValue("area", data.area);
    setValue("city", data.city);
    setValue("state", data.state);
    setValue("propertyStatus", data.propertyStatus);
    setValue("ownershipByVirtueOf", data.ownershipByVirtueOf);
    setValue("ownershipType", data.ownershipType);
    setValue("firstHoldersName", data.firstHoldersName);
    setValue("firstHoldersRelation", data.firstHoldersRelation);
    setValue("firstHoldersAadhar", data.firstHoldersAadhar);
    setValue("firstHoldersPan", data.firstHoldersPan);
    setValue("jointHoldersName", data.jointHoldersName);
    setValue("jointHoldersRelation", data.jointHoldersRelation);
    setValue("jointHoldersPan", data.jointHoldersPan);
    setValue("anyLoanLitigation", data.anyLoanLitigation);
    return response.data.data.ResidentialProperty;
  };

  const {
    data: Benifyciary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bullionDataUpdate", lifeInsuranceEditId],
    queryFn: getPersonalData,
    onSuccess: (data) => {
      reset(data);
      setDefaultValues(data);
      setValue("propertyType", data.propertyType);
      setValue("houseNumber", data.houseNumber);
      setValue("address1", data.address1);
      setValue("pincode", data.pincode);
      setValue("area", data.area);
      setValue("city", data.city);
      setValue("state", data.state);
      setValue("propertyStatus", data.propertyStatus);
      setValue("ownershipByVirtueOf", data.ownershipByVirtueOf);
      setValue("ownershipType", data.ownershipType);
      setValue("firstHoldersName", data.firstHoldersName);
      setValue("firstHoldersRelation", data.firstHoldersRelation);
      setValue("firstHoldersAadhar", data.firstHoldersAadhar);
      setValue("firstHoldersPan", data.firstHoldersPan);
      setValue("jointHoldersName", data.jointHoldersName);
      setValue("jointHoldersRelation", data.jointHoldersRelation);
      setValue("jointHoldersPan", data.jointHoldersPan);
      setValue("anyLoanLitigation", data.anyLoanLitigation);
      setValue("litigationFile", data.litigationFile);
      // Set fetched values to the form
      for (const key in data) {
        setValue(key, data[key]);
      }
    },
    onError: (error) => {
      console.error("Error fetching profile:", error);
      toast.error("Failed to fetch profile");
    },
  });
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

  const bullionMutate = useMutation({
    mutationFn: async (data) => {
      const Formdata = new FormData();
      Formdata.append("bullionFile", data.bullionFile);

      for (const [key, value] of Object.entries(data)) {
        Formdata.append(key, value);
      }
      Formdata.append("_method", "put");
      const response = await axios.post(
        `/api/residential-properties/${lifeInsuranceEditId}`,
        Formdata,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      return response.data.data.ResidentialProperty;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("bullionDataUpdate", lifeInsuranceEditId);
      toast.success("ResidentialProperty updated successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile");
    },
  });

  const onSubmit = (data) => {
    console.log("data:", data);

    bullionMutate.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading bullion data</div>;

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <div className="flex md:flex-row items-start md:items-center justify-between gap-2">
            <div className="flex md:flex-row items-start md:items-center justify-between gap-2">
              <Button
                onClick={() => {
                  navigate("/residentialproperty");
                }}
                className="text-sm"
              >
                Back
              </Button>
              <div>
                <CardTitle className="text-2xl font-bold">
                  Residential Property Details
                </CardTitle>
                <CardDescription>
                  Fill out the form to add a new Residential Property Details.
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
                        <SelectItem value="residentialApartment">
                          Residential Apartment/Flat
                        </SelectItem>
                        <SelectItem value="residentialVilla">
                          Residential Villa
                        </SelectItem>
                        <SelectItem value="residentialPlot">
                          Residential Plot
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
                <Label htmlFor="houseNumber">House Number</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="houseNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="houseNumber"
                      placeholder="Enter House Number"
                      {...field}
                      className={errors.houseNumber ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.houseNumber && (
                  <span className="text-red-500">
                    {errors.houseNumber.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address1">Address Line 1</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="address1"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="address1"
                      placeholder="Enter Address Line 1"
                      {...field}
                      className={errors.address1 ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.address1 && (
                  <span className="text-red-500">
                    {errors.address1.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="pincode"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="pincode"
                      placeholder="Enter Pincode"
                      value={field.value || ""}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      className={errors.pincode ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.pincode && (
                  <span className="text-red-500">{errors.pincode.message}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Area</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="area"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="area"
                      placeholder="Enter Area"
                      {...field}
                      className={errors.area ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.area && (
                  <span className="text-red-500">{errors.area.message}</span>
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
                      placeholder="Enter City"
                      {...field}
                      className={errors.city ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.city && (
                  <span className="text-red-500">{errors.city.message}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="state"
                      placeholder="Enter State"
                      {...field}
                      className={errors.state ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.state && (
                  <span className="text-red-500">{errors.state.message}</span>
                )}
              </div>
              <div className="space-y-2 col-span-full">
                <Label className="text-lg font-bold mt-8">
                  Ownership Details
                </Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="propertyStatus">Property Status</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="propertyStatus"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-4">
                        <Label
                          className="flex items-center gap-2"
                          htmlFor="pan-yes"
                        >
                          <RadioGroupItem id="pan-yes" value="leased" />
                          Leased
                        </Label>
                        <Label
                          className="flex items-center gap-2"
                          htmlFor="pan-no"
                        >
                          <RadioGroupItem id="pan-no" value="freehold" />
                          Freehold
                        </Label>
                      </div>
                    </RadioGroup>
                  )}
                />
                {errors.propertyStatus && (
                  <span className="text-red-500">
                    {errors.propertyStatus.message}
                  </span>
                )}
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
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2 text-center flex-wrap">
                        <div className="flex items-center gap-2 text-center flex-wrap">
                          <RadioGroupItem
                            id="selfpurchase"
                            value="selfpurchase"
                          />
                          <Label htmlFor="selfpurchase">Selfpurchase</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem id="asagift" value="asagift" />
                          <Label htmlFor="asagift">As a gift</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem
                            id="ancestralland"
                            value="ancestralland"
                          />
                          <Label htmlFor="ancestralland">Ancestral Land</Label>
                        </div>
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
                {errors.ownershipType && (
                  <span className="text-red-500">
                    {errors.ownershipType.message}
                  </span>
                )}
              </div>

              <div className="space-y-2 wrap col-span-full">
                <Label>Any Loan Litigation</Label>
                <Controller
                  name="anyLoanLitigation"
                  defaultValue={Benifyciary?.anyLoanLitigation}
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="anyLoanLitigation-yes"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                {errors.anyLoanLitigation && (
                  <span className="text-red-500">
                    {errors.anyLoanLitigation.message}
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
                      // rules={{
                      //   required:
                      //     Joinholder && "First Joint Holder Name is required",
                      // }}
                      render={({ field }) => (
                        <Input
                          placeholder="Enter Joint Holder Name"
                          {...field}
                          className={
                            errors.firstHoldersName ? "border-red-500" : ""
                          }
                        />
                      )}
                    />
                    {errors.firstHoldersName && (
                      <span className="text-red-500">
                        {errors.firstHoldersName.message}
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
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
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
                          id="firstHoldersPan"
                          placeholder="Enter Joint Holder Name"
                          {...field}
                          value={field.value?.toUpperCase() || ""}
                          className={
                            errors.firstHoldersPan ? "border-red-500" : ""
                          }
                        />
                      )}
                    />
                    {errors.jointHoldersName && (
                      <span className="text-red-500">
                        {errors.jointHoldersName.message}
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
                          placeholder="Enter Joint Holder Aadhar"
                          {...field}
                          className={
                            errors.jointHoldersName ? "border-red-500" : ""
                          }
                        />
                      )}
                    />
                    {errors.jointHoldersName && (
                      <span className="text-red-500">
                        {errors.jointHoldersName.message}
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
                          id="jointHoldersName"
                          placeholder="Enter Joint Holder Name"
                          {...field}
                          value={field.value || ""}
                          className={
                            errors.jointHoldersName ? "border-red-500" : ""
                          }
                        />
                      )}
                    />
                    {errors.jointHoldersName && (
                      <span className="text-red-500">
                        {errors.jointHoldersName.message}
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
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          className={
                            errors.jointHoldersRelation ? "border-red-500" : ""
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
                    {errors.jointHoldersRelation && (
                      <span className="text-red-500">
                        {errors.jointHoldersRelation.message}
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
                          id="jointHoldersName"
                          placeholder="Enter Joint Holder Aadhar"
                          {...field}
                          value={field.value?.toUpperCase() || ""}
                          className={
                            errors.jointHoldersName ? "border-red-500" : ""
                          }
                        />
                      )}
                    />
                    {errors.jointHoldersName && (
                      <span className="text-red-500">
                        {errors.jointHoldersName.message}
                      </span>
                    )}
                  </div>
                )}
              </div>
              {displaynominie && displaynominie.length > 0 && (
                <div className="space-y-2 col-span-full">
                  <div className="grid gap-4 py-4">
                    {console.log(displaynominie)}
                    <Label className="text-lg font-bold">
                      Selected Nominees
                    </Label>
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
              <div className="space-y-2 col-span-full">
                <Label htmlFor="registered-mobile">Add nominee</Label>
                <Addnominee
                  setDisplaynominie={setDisplaynominie}
                  setSelectedNommie={setSelectedNommie}
                  displaynominie={displaynominie}
                />
              </div>
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

export default ResidentialEditForm;

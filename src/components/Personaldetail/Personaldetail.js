import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm, Controller, useWatch } from "react-hook-form";
import axios from "axios";
import { Label } from "@com/ui/label";
import { Input } from "@com/ui/input";

import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@com/ui/select";
import { Button } from "@com/ui/button";
import { PopoverTrigger, PopoverContent, Popover } from "@com/ui/popover";
import { Calendar } from "@com/ui/calendar";
import { RadioGroupItem, RadioGroup } from "@com/ui/radio-group";
import { Checkbox } from "@com/ui/checkbox";
import Datepicker from "./Datepicker";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const Personaldetail = () => {
  const [showAdharFields, setShowAdharFields] = useState(false);
  const [showPANFields, setShowPANFields] = useState(false);
  const [showDLFields, setShowDLFields] = useState(false);
  const [showPassportFields, setShowPassportFields] = useState(false);
  const [isForeign, setIsForeign] = useState(false);
  const [sameAsLoginEmail, setSameAsLoginEmail] = useState(true);
  const [sameAsPermanentAddress, setSameAsPermanentAddress] = useState(false);
  const [marriedUnderAct, setMarriedUnderAct] = useState(true);
  const [defaultData, setDefaultData] = useState([]);
  const queryClient = useQueryClient();

  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  console.log(user);
  const getPersonalData = async () => {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/profiles/${data.user.id}`,
      {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      }
    );
    setDefaultData(response.data);
    console.log(response.data);
    return response.data;
  };
  const query = useQuery({ queryKey: ["todos"], queryFn: getPersonalData });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      adhar: "no",
      pan: "no",
      drivingLicense: "no",
      passport: "no",
      dob: null,
      drivingLicenseExpiry: null,
      passportExpiry: null,
    },
  });

  const onSubmit = async (data) => {
    console.log(data);

    await axios
      .post(`http://127.0.0.1:8000/api/profiles/1`, { ...data, user_id: 1 })
      .then((res) => {
        console.log(res);
      });
    // Handle form submission
  };

  const permanentAddress = watch([
    "permanentHouseFlatNo",
    "permanentAddressLine1",
    "permanentAddressLine2",
    "permanentPincode",
    "permanentCity",
    "permanentState",
    "permanentCountry",
  ]);

  useEffect(() => {
    if (sameAsPermanentAddress) {
      setValue("currentHouseFlatNo", permanentAddress[0]);
      setValue("currentAddressLine1", permanentAddress[1]);
      setValue("currentAddressLine2", permanentAddress[2]);
      setValue("currentPincode", permanentAddress[3]);
      setValue("currentCity", permanentAddress[4]);
      setValue("currentState", permanentAddress[5]);
      setValue("currentCountry", permanentAddress[6]);
    }
  }, [sameAsPermanentAddress, permanentAddress, setValue]);

  const handlePincodeChange = async (pincode) => {
    try {
      const response = await axios.get(
        `https://api.example.com/pincode/${pincode}`
      );
      const { city, state, country } = response.data;

      setValue("permanentCity", city);
      setValue("permanentState", state);
      setValue("permanentCountry", country);
    } catch (error) {
      console.error("Failed to fetch pincode details:", error);
    }
  };

  return (
    <div className="space-y-4 min-w-[300px]">
      <h2 className="text-2xl font-bold">Personal Details</h2>
      <h3 className="text-lg font-medium">Basic Details</h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-[300px]"
      >
        <div className="space-y-2 col-span-2 min-w-[300px]">
          <Label htmlFor="full-name">Full Legal Name</Label>
          <Input
            id="full-name"
            placeholder="John Doe"
            type="text"
            value={defaultData.fullLegalName}
            {...register("fullLegalName", {
              required: "Full Legal Name is required",
            })}
          />
          {errors.fullLegalName && (
            <span className="text-red-500">{errors.fullLegalName.message}</span>
          )}
        </div>
        <div className="space-y-2 max-md:col-span-2 min-w-[300px]">
          <Label htmlFor="gender">Gender</Label>
          <Controller
            name="gender"
            control={control}
            rules={{ required: "Gender is required" }}
            defaultValue={defaultData.gender}
            render={({ field }) => (
              <Select
                {...field}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.gender && (
            <span className="text-red-500">{errors.gender.message}</span>
          )}
        </div>
        <div className="space-y-2 mb-2 min-w-[300px]">
          <Label htmlFor="dob">Date of Birth</Label>
          <Controller
            name="dob"
            defaultValue={defaultData.dob}
            control={control}
            render={({ field }) => (
              <Datepicker value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.dob && (
            <span className="text-red-500">{errors.dob.message}</span>
          )}
        </div>
        <div className="space-y-2 max-md:col-span-2">
          <Label htmlFor="nationality">Nationality</Label>
          <div className="flex flex-col  gap-4">
            <Controller
              name="nationality"
              control={control}
              defaultValue={defaultData.nationality}
              rules={{ required: "Nationality is required" }}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  className="flex"
                  onValueChange={(value) => {
                    field.onChange(value);
                    setIsForeign(value === "foreign");
                  }}
                >
                  <Label
                    className="flex items-center gap-2"
                    htmlFor="nationality-indian"
                  >
                    <RadioGroupItem id="nationality-indian" value="indian" />
                    Indian
                  </Label>
                  <Label
                    className="flex items-center gap-2"
                    htmlFor="nationality-foreign"
                  >
                    <RadioGroupItem id="nationality-foreign" value="foreign" />
                    Foreign
                  </Label>
                </RadioGroup>
              )}
            />
            {errors.nationality && (
              <span className="text-red-500">{errors.nationality.message}</span>
            )}
            {isForeign && (
              <Controller
                name="specificNationality"
                control={control}
                defaultValue={defaultData.specificNationality}
                rules={{ required: isForeign }}
                render={({ field }) => (
                  <Select
                    {...field}
                    onValueChange={(value) => field.onChange(value)}
                    className="ml-4"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="afghan">Afghan</SelectItem>
                      <SelectItem value="argentine">Argentine</SelectItem>
                      <SelectItem value="australian">Australian</SelectItem>
                      <SelectItem value="austrian">Austrian</SelectItem>
                      <SelectItem value="bangladeshi">Bangladeshi</SelectItem>
                      <SelectItem value="belgian">Belgian</SelectItem>
                      <SelectItem value="brazilian">Brazilian</SelectItem>
                      <SelectItem value="british">British</SelectItem>
                      <SelectItem value="canadian">Canadian</SelectItem>
                      <SelectItem value="chilean">Chilean</SelectItem>
                      <SelectItem value="colombian">Colombian</SelectItem>
                      <SelectItem value="costa-rican">Costa Rican</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            )}
          </div>
        </div>
        <div className="space-y-2 min-w-[300px] max-md:col-span-2">
          <Label htmlFor="country">Country of Residence</Label>
          <Controller
            name="countryOfResidence"
            control={control}
            defaultValue={defaultData.countryOfResidence}
            rules={{ required: "Country of Residence is required" }}
            render={({ field }) => (
              <Select
                {...field}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.country && (
            <span className="text-red-500">{errors.country.message}</span>
          )}
        </div>
        <div className="space-y-2 max-md:col-span-2">
          <Label htmlFor="religion">Religion</Label>
          <Controller
            name="religion"
            control={control}
            defaultValue={defaultData.religion}
            rules={{ required: "Religion is required" }}
            render={({ field }) => (
              <Select
                {...field}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select religion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="christian">Christianity</SelectItem>
                  <SelectItem value="islam">Islam</SelectItem>
                  <SelectItem value="muslim">Muslim</SelectItem>
                  <SelectItem value="jain">Jain</SelectItem>
                  <SelectItem value="sikh">Sikh</SelectItem>
                  <SelectItem value="hinduism">Hinduism</SelectItem>
                  <SelectItem value="buddhism">Buddhism</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.religion && (
            <span className="text-red-500">{errors.religion.message}</span>
          )}
        </div>
        <div className="space-y-2 min-w-[300px] max-md:col-span-2">
          <Label htmlFor="marital-status">Marital Status</Label>
          <Controller
            name="maritalStatus"
            control={control}
            defaultValue={defaultData.maritalStatus}
            rules={{ required: "Marital Status is required" }}
            render={({ field }) => (
              <Select
                {...field}
                onValueChange={(value) => {
                  if (value === "single") {
                    setMarriedUnderAct(false);
                  }
                  if (
                    value === "married" ||
                    value === "widowed" ||
                    value === "divorced" ||
                    value === "other"
                  ) {
                    setMarriedUnderAct(true);
                  }

                  field.onChange(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select marital status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.maritalStatus && (
            <span className="text-red-500">{errors.maritalStatus.message}</span>
          )}
        </div>
        {marriedUnderAct && (
          <div className="space-y-2 mt-6 gap-2 flex items-center">
            <Checkbox
              className="mt-2"
              id="married-under-act"
              defaultChecked={defaultData.marriedUnderSpecialAct}
              {...register("marriedUnderSpecialAct")}
            />
            <Label
              className="flex items-center gap-2 mt-2"
              htmlFor="married-under-act"
            >
              Married under Special Marriage Act
            </Label>
          </div>
        )}

        <div className="space-y-4 col-span-full mt-6 min-w-[300px]">
          <h2 className="text-2xl font-bold">Contact Details</h2>
          <div className="space-y-2">
            <Label htmlFor="correspondence-email">Correspondence Email</Label>
            <Controller
              name="cuscorrespondenceEmail"
              control={control}
              defaultValue={defaultData.correspondenceEmail}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSameAsLoginEmail(value === "same");
                  }}
                >
                  <div className="flex items-center gap-4">
                    <Label
                      className="flex items-center gap-2"
                      htmlFor="email-same"
                    >
                      Same as your login ID
                    </Label>
                    <Label
                      className="flex items-center gap-2"
                      htmlFor="email-same"
                    >
                      Yes
                      <RadioGroupItem id="email-same" value="same" />
                    </Label>
                    <Label
                      className="flex items-center gap-2"
                      htmlFor="email-different"
                    >
                      No
                      <RadioGroupItem id="email-different" value="different" />
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
            {!sameAsLoginEmail && (
              <div className="space-y-2 mt-2">
                <Label htmlFor="custom-email">correspondence Email</Label>
                <Input
                  id="custom-email"
                  value={defaultData.customEmail}
                  placeholder="example@email.com"
                  type="email"
                  {...register("correspondenceEmail", {
                    required: !sameAsLoginEmail && "Custom Email is required",
                  })}
                />
                {errors.customEmail && (
                  <span className="text-red-500">
                    {errors.customEmail.message}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Permanent Address Section */}
        <div className="col-span-full space-y-4 min-w-[300px]">
          <h2 className="text-2xl font-bold mt-4">Address Details</h2>
          <h2 className="text-lg font-medium">Permanent Address</h2>
          <div className="space-y-2 min-w-[300px]">
            <Label htmlFor="permanent-house-flat-no">House / Flat No.</Label>
            <Input
              id="permanent-house-flat-no"
              placeholder="House / Flat No."
              value={defaultData.permanentHouseFlatNo}
              type="text"
              className="min-w-[300px]"
              {...register("permanentHouseFlatNo", {
                required: "House / Flat No. is required",
              })}
            />
            {errors.permanentHouseFlatNo && (
              <span className="text-red-500">
                {errors.permanentHouseFlatNo.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="permanent-address-line-1">Address Line 1</Label>
            <Input
              id="permanent-address-line-1"
              placeholder="Address Line 1"
              value={defaultData.permanentAddressLine1}
              type="text"
              {...register("permanentAddressLine1", {
                required: "Address Line 1 is required",
              })}
            />
            {errors.permanentAddressLine1 && (
              <span className="text-red-500">
                {errors.permanentAddressLine1.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="permanent-address-line-2">Address Line 2</Label>
            <Input
              id="permanent-address-line-2"
              placeholder="Address Line 2"
              value={defaultData.permanentAddressLine2}
              type="text"
              {...register("permanentAddressLine2", {
                required: "Address Line 2 is required",
              })}
            />
            {errors.permanentAddressLine2 && (
              <span className="text-red-500">
                {errors.permanentAddressLine2.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="permanent-pincode">Pincode</Label>
            <Input
              id="permanent-pincode"
              placeholder="Pincode"
              value={defaultData.permanentPincode}
              type="text"
              {...register("permanentPincode", {
                required: "Pincode is required",
                onChange: (e) => handlePincodeChange(e.target.value),
              })}
            />
            {errors.permanentPincode && (
              <span className="text-red-500">
                {errors.permanentPincode.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="permanent-city">City</Label>
            <Input
              id="permanent-city"
              value={defaultData.permanentCity}
              placeholder="City"
              type="text"
              {...register("permanentCity", { required: "City is required" })}
            />
            {errors.permanentCity && (
              <span className="text-red-500">
                {errors.permanentCity.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="permanent-state">State</Label>
            <Input
              id="permanent-state"
              placeholder="State"
              value={defaultData.permanentState}
              type="text"
              {...register("permanentState", {
                required: "State is required",
              })}
            />
            {errors.permanentState && (
              <span className="text-red-500">
                {errors.permanentState.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="permanent-country">Country</Label>
            <Input
              id="permanent-country"
              placeholder="Country"
              value={defaultData.permanentCountry}
              type="text"
              {...register("permanentCountry", {
                required: "Country is required",
              })}
            />
            {errors.permanentCountry && (
              <span className="text-red-500">
                {errors.permanentCountry.message}
              </span>
            )}
          </div>
        </div>

        {/* Current Address Section */}
        <div className="col-span-full space-y-4 min-w-[300px]">
          <h2 className="text-2xl font-medium mt-4">Current Address</h2>
          <Label
            className="flex items-center gap-2 mt-2"
            htmlFor="same-as-permanent"
          >
            Same as Permanent Address
          </Label>

          <Checkbox
            id="same-as-permanent"
            defaultChecked={defaultData.sameAsPermanentAddress}
            checked={sameAsPermanentAddress}
            onCheckedChange={() =>
              setSameAsPermanentAddress(!sameAsPermanentAddress)
            }
            {...register("sameAsPermanentAddress")}
          />

          {!sameAsPermanentAddress && (
            <>
              <div className="space-y-2">
                <Label htmlFor="current-house-flat-no">House / Flat No.</Label>
                <Input
                  id="current-house-flat-no"
                  placeholder="House / Flat No."
                  value={defaultData.currentHouseFlatNo}
                  type="text"
                  {...register("currentHouseFlatNo", {
                    required: "House / Flat No. is required",
                  })}
                />
                {errors.currentHouseFlatNo && (
                  <span className="text-red-500">
                    {errors.currentHouseFlatNo.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-address-line-1">Address Line 1</Label>
                <Input
                  id="current-address-line-1"
                  placeholder="Address Line 1"
                  value={defaultData.currentAddressLine1}
                  type="text"
                  {...register("currentAddressLine1", {
                    required: "Address Line 1 is required",
                  })}
                />
                {errors.currentAddressLine1 && (
                  <span className="text-red-500">
                    {errors.currentAddressLine1.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-address-line-2">Address Line 2</Label>
                <Input
                  id="current-address-line-2"
                  placeholder="Address Line 2"
                  value={defaultData.currentAddressLine2}
                  type="text"
                  {...register("currentAddressLine2", {
                    required: "Address Line 2 is required",
                  })}
                />
                {errors.currentAddressLine2 && (
                  <span className="text-red-500">
                    {errors.currentAddressLine2.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-pincode">Pincode</Label>
                <Input
                  id="current-pincode"
                  placeholder="Pincode"
                  value={defaultData.currentPincode}
                  type="text"
                  {...register("currentPincode", {
                    required: "Pincode is required",
                    onChange: (e) => handlePincodeChange(e.target.value),
                  })}
                />
                {errors.currentPincode && (
                  <span className="text-red-500">
                    {errors.currentPincode.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-city">City</Label>
                <Input
                  id="current-city"
                  placeholder="City"
                  type="text"
                  value={defaultData.currentCity}
                  {...register("currentCity", {
                    required: "City is required",
                  })}
                />
                {errors.currentCity && (
                  <span className="text-red-500">
                    {errors.currentCity.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-state">State</Label>
                <Input
                  id="current-state"
                  placeholder="State"
                  type="text"
                  value={defaultData.currentState}
                  {...register("currentState", {
                    required: "State is required",
                  })}
                />
                {errors.currentState && (
                  <span className="text-red-500">
                    {errors.currentState.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-country">Country</Label>
                <Input
                  id="current-country"
                  placeholder="Country"
                  defaultValue={defaultData.currentCountry}
                  type="text"
                  value={defaultData.currentCountry}
                  {...register("currentCountry", {
                    required: "Country is required",
                  })}
                />
                {errors.currentCountry && (
                  <span className="text-red-500">
                    {errors.currentCountry.message}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Adhar Section */}
        <div className="col-span-full space-y-4 min-w-[300px]">
          <h2 className="text-2xl font-bold mt-4">Optional Documents</h2>
          <h2 className="text-2xl font-medium">Aadhar</h2>
          <div className="space-y-2">
            <Label htmlFor="adhar">Do you have an Adhar?</Label>
            <Controller
              name="adhar"
              control={control}
              defaultChecked={defaultData.adhar}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  value={field.value}
                  defaultValue={defaultData.adhar}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setShowAdharFields(value === "yes");
                  }}
                >
                  <div className="flex items-center gap-4">
                    <Label
                      className="flex items-center gap-2"
                      htmlFor="adhar-yes"
                    >
                      <RadioGroupItem
                        defaultChecked={defaultData.adhar}
                        defaultValue="no"
                        id="adhar-yes"
                        value="yes"
                      />
                      Yes
                    </Label>
                    <Label
                      className="flex items-center gap-2"
                      htmlFor="adhar-no"
                    >
                      <RadioGroupItem
                        checked={showAdharFields === false}
                        id="adhar-no"
                        defaultValue="no"
                        value="no"
                      />
                      No
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.adhar && (
              <span className="text-red-500">{errors.adhar.message}</span>
            )}
          </div>
          {showAdharFields && (
            <>
              <div className="space-y-2">
                <Label htmlFor="adhar-number">Adhar Number</Label>
                <Input
                  id="adhar-number"
                  defaultValue={defaultData.adharNumber}
                  placeholder="Adhar Number"
                  value={defaultData.adharNumber}
                  type="text"
                  {...register("adharNumber", {
                    required: "Adhar Number is required",
                  })}
                />
                {errors.adharNumber && (
                  <span className="text-red-500">
                    {errors.adharNumber.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="adhar-name">
                  Full Name - Name as per Adhar
                </Label>
                <Input
                  id="adhar-name"
                  placeholder="Full Name - Name as per Adhar"
                  type="text"
                  defaultValue={defaultData.adharName}
                  value={defaultData.adharName}
                  {...register("adharName", {
                    required: "Full Name is required",
                  })}
                />
                {errors.adharName && (
                  <span className="text-red-500">
                    {errors.adharName.message}
                  </span>
                )}
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="adhar-file">Upload File</Label>
                <Input
                  id="adhar-file"
                  type="file"
                  {...register("adharFile", {
                    required: "File upload is required",
                  })}
                />
                {errors.adharFile && (
                  <span className="text-red-500">
                    {errors.adharFile.message}
                  </span>
                )}
              </div> */}
            </>
          )}
        </div>

        {/* PAN Section */}
        <div className="col-span-full space-y-4 min-w-[300px]">
          <h2 className="text-2xl font-medium">PAN</h2>
          <div className="space-y-2">
            <Label htmlFor="pan">Do you have a PAN?</Label>
            <Controller
              name="pan"
              control={control}
              defaultChecked={defaultData.pan}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setShowPANFields(value === "yes");
                  }}
                >
                  <div className="flex items-center gap-4">
                    <Label
                      className="flex items-center gap-2"
                      htmlFor="pan-yes"
                    >
                      <RadioGroupItem id="pan-yes" value="yes" />
                      Yes
                    </Label>
                    <Label className="flex items-center gap-2" htmlFor="pan-no">
                      <RadioGroupItem
                        checked={showPANFields === false}
                        id="pan-no"
                        value="no"
                      />
                      No
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.pan && (
              <span className="text-red-500">{errors.pan.message}</span>
            )}
          </div>
          {showPANFields && (
            <>
              <div className="space-y-2">
                <Label htmlFor="pan-number">PAN Number</Label>
                <Input
                  id="pan-number"
                  defaultValue={defaultData.panNumber}
                  placeholder="PAN Number"
                  type="text"
                  {...register("panNumber", {
                    required: "PAN Number is required",
                  })}
                />
                {errors.panNumber && (
                  <span className="text-red-500">
                    {errors.panNumber.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="pan-name">Full Name - Name as per PAN</Label>
                <Input
                  id="pan-name"
                  defaultValue={defaultData.panName}
                  placeholder="Full Name - Name as per PAN"
                  type="text"
                  {...register("panName", {
                    required: "Full Name is required",
                  })}
                />
                {errors.panName && (
                  <span className="text-red-500">{errors.panName.message}</span>
                )}
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="pan-file">Upload File</Label>
                <Input
                  id="pan-file"
                  type="file"
                  {...register("panFile", {
                    required: "File upload is required",
                  })}
                />
                {errors.panFile && (
                  <span className="text-red-500">{errors.panFile.message}</span>
                )}
              </div> */}
            </>
          )}
        </div>

        {/* Driving License Section */}
        <div className="col-span-full space-y-4 min-w-[300px]">
          <h2 className="text-2xl font-medium">Driving License</h2>
          <div className="space-y-2">
            <Label htmlFor="driving-license">
              Do you have a Driving License?
            </Label>
            <Controller
              name="drivingLicense"
              control={control}
              defaultChecked={defaultData.drivingLicense}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setShowDLFields(value === "yes");
                  }}
                >
                  <div className="flex items-center gap-4">
                    <Label
                      className="flex items-center gap-2"
                      htmlFor="driving-license-yes"
                    >
                      <RadioGroupItem id="driving-license-yes" value="yes" />
                      Yes
                    </Label>
                    <Label
                      className="flex items-center gap-2"
                      htmlFor="driving-license-no"
                    >
                      <RadioGroupItem
                        checked={showDLFields === false}
                        id="driving-license-no"
                        value="no"
                      />
                      No
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.drivingLicense && (
              <span className="text-red-500">
                {errors.drivingLicense.message}
              </span>
            )}
          </div>
          {showDLFields && (
            <>
              <div className="space-y-2">
                <Label htmlFor="driving-license-number">DL Number</Label>
                <Input
                  id="driving-license-number"
                  placeholder="DL Number"
                  defaultValue={defaultData.drivingLicenseNumber}
                  type="text"
                  {...register("drivingLicenseNumber", {
                    required: "DL Number is required",
                  })}
                />
                {errors.drivingLicenseNumber && (
                  <span className="text-red-500">
                    {errors.drivingLicenseNumber.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="driving-license-name">Name as per DL</Label>
                <Input
                  id="driving-license-name"
                  placeholder="Name as per DL"
                  defaultValue={defaultData.drivingLicenseName}
                  type="text"
                  {...register("drivingLicenseName", {
                    required: "Name as per DL is required",
                  })}
                />
                {errors.drivingLicenseName && (
                  <span className="text-red-500">
                    {errors.drivingLicenseName.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="driving-license-expiry">Expiry Date</Label>
                <Controller
                  name="drivingLicenseExpiry"
                  control={control}
                  defaultValue={defaultData.drivingLicenseExpiry}
                  render={({ field }) => (
                    <Datepicker value={field.value} onChange={field.onChange} />
                  )}
                />
                {errors.drivingLicenseExpiry && (
                  <span className="text-red-500">
                    {errors.drivingLicenseExpiry.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="driving-license-place">Place of issue</Label>
                <Input
                  id="driving-license-place"
                  placeholder="Place of issue"
                  defaultValue={defaultData.drivingLicensePlace}
                  type="text"
                  {...register("drivingLicensePlace", {
                    required: "Place of issue is required",
                  })}
                />
                {errors.drivingLicensePlace && (
                  <span className="text-red-500">
                    {errors.drivingLicensePlace.message}
                  </span>
                )}
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="driving-license-file">Upload File</Label>
                <Input
                  id="driving-license-file"
                  type="file"
                  {...register("drivingLicenseFile", {
                    required: "File upload is required",
                  })}
                />
                {errors.drivingLicenseFile && (
                  <span className="text-red-500">
                    {errors.drivingLicenseFile.message}
                  </span>
                )}
              </div> */}
            </>
          )}
        </div>

        {/* Passport Section */}
        <div className="col-span-full space-y-4 min-w-[300px]">
          <h2 className="text-2xl font-medium">Passport</h2>
          <div className="space-y-2">
            <Label htmlFor="passport">Do you have a Passport?</Label>
            <Controller
              name="passport"
              defaultChecked={defaultData.passport}
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setShowPassportFields(value === "yes");
                  }}
                >
                  <div className="flex items-center gap-4">
                    <Label
                      className="flex items-center gap-2"
                      htmlFor="passport-yes"
                    >
                      <RadioGroupItem id="passport-yes" value="yes" />
                      Yes
                    </Label>
                    <Label
                      className="flex items-center gap-2"
                      htmlFor="passport-no"
                    >
                      <RadioGroupItem
                        checked={showPassportFields === false}
                        id="passport-no"
                        value="no"
                      />
                      No
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.passport && (
              <span className="text-red-500">{errors.passport.message}</span>
            )}
          </div>
          {showPassportFields && (
            <>
              <div className="space-y-2">
                <Label htmlFor="pp-number">PP Number</Label>
                <Input
                  id="pp-number"
                  placeholder="PP Number"
                  type="text"
                  defaultValue={defaultData.passportNumber}
                  {...register("passportNumber", {
                    required: "Passport Number is required",
                  })}
                />
                {errors.passportNumber && (
                  <span className="text-red-500">
                    {errors.passportNumber.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="pp-name">Name as per PP</Label>
                <Input
                  id="pp-name"
                  placeholder="Name as per PP"
                  type="text"
                  defaultValue={defaultData.passportName}
                  {...register("passportName", {
                    required: "Name as per Passport is required",
                  })}
                />
                {errors.passportName && (
                  <span className="text-red-500">
                    {errors.passportName.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="pp-expiry">Expiry Date</Label>
                <Controller
                  name="passportExpiry"
                  control={control}
                  defaultValue={defaultData.passportExpiry}
                  render={({ field }) => (
                    <Datepicker value={field.value} onChange={field.onChange} />
                  )}
                />
                {errors.passportExpiry && (
                  <span className="text-red-500">
                    {errors.passportExpiry.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="pp-place">Place of issue</Label>
                <Input
                  id="pp-place"
                  placeholder="Place of issue"
                  defaultValue={defaultData.passportPlace}
                  type="text"
                  {...register("passportPlace", {
                    required: "Place of issue is required",
                  })}
                />
                {errors.passportPlace && (
                  <span className="text-red-500">
                    {errors.passportPlace.message}
                  </span>
                )}
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="pp-file">Upload File</Label>
                <Input
                  id="pp-file"
                  type="file"
                  {...register("passportFile", {
                    required: "File upload is required",
                  })}
                />
                {errors.passportFile && (
                  <span className="text-red-500">
                    {errors.passportFile.message}
                  </span>
                )}
              </div> */}
            </>
          )}
        </div>

        <div className="col-span-full flex justify-end min-w-[200px] max-md:mt-2">
          <Button className="w-full max-w-[200px]" type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Personaldetail;

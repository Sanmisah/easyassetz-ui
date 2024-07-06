import React, { useState, useEffect, lazy, Suspense } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import InputMask from "react-input-mask";
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
import { Checkbox } from "@com/ui/checkbox";
import { RadioGroupItem, RadioGroup } from "@com/ui/radio-group";
import Datepicker from "./Datepicker";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Skletonpersonal from "./Skletonpersonal";
import { toast } from "sonner";
import dropdownData from "./value.json";
import { format, parse } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { PhoneInput } from "react-international-phone";

const Personaldetail = () => {
  const [showAdharFields, setShowAdharFields] = useState(false);
  const [showPANFields, setShowPANFields] = useState(false);
  const [showDLFields, setShowDLFields] = useState(false);
  const [showPassportFields, setShowPassportFields] = useState(false);
  const [isForeign, setIsForeign] = useState(false);
  const [sameAsLoginEmail, setSameAsLoginEmail] = useState(true);
  const [sameAsPermanentAddress, setSameAsPermanentAddress] = useState(false);
  const [marriedUnderAct, setMarriedUnderAct] = useState(true);
  const [defaultData, setDefaultData] = useState({});
  const [defaultDate, setdefaultDate] = useState(null);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [specialactundermarriange, setSpecialactundermarriange] =
    useState(false);

  const queryClient = useQueryClient();

  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);

  const getPersonalData = async () => {
    if (!user) return;

    const response = await axios.get(
      `/api/profiles/${user.data.user.profile.id}`,
      {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      }
    );
    console.log(response.data.data.profile);
    setDefaultData(response.data.data.profile);
    if (
      response.data.data.profile?.nationality === "" ||
      response.data.data.profile?.nationality === null
    ) {
      response.data.data.profile.nationality = "Indian";
      setIsForeign(false);
    }
    if (response.data.data.profile?.nationality === "Indian")
      setIsForeign(false);
    if (response.data.data.profile?.nationality !== "Indian")
      setIsForeign(true);
    if (response.data.data.profile?.dob) {
      setdefaultDate(new Date(response.data.data.profile.dob));
    }

    if (response.data.data.profile?.drivingLicenceNumber) {
      setShowDLFields(true);
    }
    if (response.data.data.profile?.passportNumber) {
      setShowPassportFields(true);
    }
    if (response.data.data.profile?.panNumber) {
      setShowPANFields(true);
    }
    if (response.data.data.profile?.aadharNumber) {
      setShowAdharFields(true);
    }

    return response.data.data.profile || {};
  };

  const { isLoading, isError } = useQuery({
    queryKey: ["personalData"],
    queryFn: getPersonalData,
    onSuccess: (data) => {
      console.log("Data:", data);

      if (data.nationality === "") {
        data.nationality = "Indian";
        setIsForeign(false);
      }
      if (data.nationality === "Indian") setIsForeign(false);
      if (data.nationality !== null) {
        data.nationality = "Indian";
        setIsForeign(false);
      }
      if (data.nationality !== null && data.nationality !== "Indian")
        setIsForeign(true);
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile");
    },
  });

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
      drivingLicence: "no",
      passport: "no",
      dob: null,
      drivingLicenceExpiryDate: null,
      passportExpiryDate: null,
    },
  });

  useEffect(() => {
    if (defaultData) {
      for (const [key, value] of Object.entries(defaultData)) {
        setValue(key, value);
      }
    }
  }, [defaultData, setValue]);

  const Profilemutate = useMutation({
    mutationFn: async (data) => {
      console.log("Mydata:", data);
      const mergedData = { ...defaultData, ...data };

      const formData = new FormData();

      for (const [key, value] of Object.entries(mergedData)) {
        formData.append(key, value);
      }
      if (sameAsPermanentAddress) {
        formData.set(
          "currentHouseFlatNo",
          formData.get("permanentHouseFlatNo")
        );
        formData.set(
          "currentAddressLine1",
          formData.get("permanentAddressLine1")
        );
        formData.set(
          "currentAddressLine2",
          formData.get("permanentAddressLine2")
        );
        formData.set("currentPincode", formData.get("permanentPincode"));
        formData.set("currentCity", formData.get("permanentCity"));
        formData.set("currentState", formData.get("permanentState"));
        formData.set("currentCountry", formData.get("permanentCountry"));
      }

      formData.append("_method", "put");

      const response = await axios.post(
        `/api/profiles/${user.data.user.profile.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data.profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("personalData");
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile");
    },
  });
  const ConverDate = (date) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const onSubmit = async (data) => {
    console.log(data);
    if (data.maritalStatus === "Bachelor") {
      data.marriedUnderSpecialAct = false;
    }
    data.dob = ConverDate(data.dob);

    data.passportExpiryDate = ConverDate(data.passportExpiryDate);
    data.drivingLicenceExpiryDate = ConverDate(data.drivingLicenceExpiryDate);

    data.pan;
    console.log(data.dob);

    if (data.maritalStatus === "Bachelor") {
      data.marriedUnderSpecialAct = false;
    }

    if (isForeign && data.specificNationality) {
      data.nationality = data.specificNationality;
    }
    if (marriedUnderAct && data.maritalStatus === "Bachelor") {
      data.maritalStatus = "Bachelor";
      data.marriedUnderSpecialAct = "false";
    }
    delete data.specificNationality;
    data.marriedUnderSpecialAct = specialactundermarriange;
    console.log("FIAL", data);
    Profilemutate.mutate(data);
  };

  const permanentAddress = watch([
    "PermanentHouseFlatNo",
    "PermanentAddressLine1",
    "PermanentAddressLine2",
    "PermanentPincode",
    "PermanentCity",
    "PermanentState",
    "PermanentCountry",
  ]);

  useEffect(() => {
    console.log("date", new Date());
  }, []);
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
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const { Block, State, Country } = response.data[0].PostOffice[0];
      setValue("permanentCity", Block);
      setValue("permanentState", State);
      setValue("permanentCountry", Country);
    } catch (error) {
      console.error("Failed to fetch pincode details:", error);
    }
  };

  const handleFileUpload = () => {
    window.open(`/storage/profiles/aadharFile/${defaultData?.aadharFile}`);
  };
  const handleFileUploadPan = () => {
    window.open(`/storage/profiles/panFile/${defaultData?.panFile}`);
  };
  const handleFileUploadDriving = () => {
    window.open(`/storage/profiles/drivingFile/${defaultData?.drivingFile}`);
  };
  const handleFileUploadPassport = () => {
    window.open(`/storage/profiles/passportFile/${defaultData?.passportFile}`);
  };
  return (
    <Suspense fallback={<Skletonpersonal />}>
      {isLoading ? (
        <Skletonpersonal />
      ) : (
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
                defaultValue={defaultData?.fullLegalName}
                type="text"
                {...register("fullLegalName", {
                  required:
                    !defaultData?.fullLegalName &&
                    "Full Legal Name is required",
                })}
              />
              {errors.fullLegalName && !defaultData?.fullLegalName && (
                <span className="text-red-500">
                  {errors.fullLegalName.message}
                </span>
              )}
            </div>
            <div className="space-y-2 max-md:col-span-2 min-w-[300px]">
              <Label htmlFor="gender">Gender</Label>
              <Controller
                name="gender"
                control={control}
                rules={{
                  required: !defaultData?.gender && "Gender is required",
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    onValueChange={(value) => field.onChange(value)}
                    defaultValue={defaultData?.gender}
                    value={defaultData?.gender || field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender">
                        {field.value || "Select gender"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {dropdownData.genders?.map((gender) => (
                        <SelectItem key={gender} value={gender}>
                          {gender.charAt(0) + gender.slice(1)}
                        </SelectItem>
                      ))}
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
                defaultValue={defaultDate}
                control={control}
                render={({ field }) => (
                  <Datepicker
                    defaultValue={defaultDate}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.dob && (
                <span className="text-red-500">{errors.dob.message}</span>
              )}
            </div>
            <div className="space-y-2 max-md:col-span-2 col-span-full">
              <Label htmlFor="nationality">Nationality</Label>
              <div className="flex flex-col gap-4">
                <Controller
                  name="nationality"
                  defaultValue={
                    defaultData?.nationality !== "Inidan" ? "Foreign" : "Indian"
                  }
                  control={control}
                  rules={{
                    required:
                      !defaultData?.nationality && "Nationality is required",
                  }}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      className="flex"
                      defaultValue={defaultData?.nationality}
                      defaultChecked={defaultData?.nationality}
                      value={field.value} // Use the field's value
                      onValueChange={(value) => {
                        field.onChange(value);
                        setIsForeign(value === "Foreign");
                      }}
                    >
                      {dropdownData.nationalities?.map((nationality) => (
                        <Label
                          key={nationality}
                          className="flex items-center gap-2"
                          htmlFor={`nationality-${nationality}`}
                        >
                          <RadioGroupItem
                            id={`nationality-${nationality}`}
                            value={nationality}
                            checked={field.value === nationality}
                          />
                          {nationality.charAt(0).toUpperCase() +
                            nationality.slice(1)}
                        </Label>
                      ))}
                    </RadioGroup>
                  )}
                />
                {errors.nationality && (
                  <span className="text-red-500">
                    {errors.nationality.message}
                  </span>
                )}
                {isForeign && (
                  <Controller
                    name="specificNationality"
                    control={control}
                    defaultValue={defaultData?.nationality}
                    rules={{
                      required: !defaultData?.specificNationality && isForeign,
                    }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        onValueChange={(value) => field.onChange(value)}
                        className="ml-4"
                        defaultValue={defaultData?.specificNationality}
                      >
                        <SelectTrigger>
                          <SelectValue>
                            {field.value || "Select nationality"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {dropdownData.specificNationalities?.map(
                            (specificNationality, index) => (
                              <SelectItem
                                key={index}
                                value={specificNationality}
                              >
                                {specificNationality.charAt(0).toUpperCase() +
                                  specificNationality.slice(1)}
                              </SelectItem>
                            )
                          )}
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
                rules={{
                  required:
                    !defaultData?.countryOfResidence &&
                    "Country of Residence is required",
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    onValueChange={(value) => field.onChange(value)}
                    value={defaultData?.countryOfResidence}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country of residence">
                        {field.value || "Select country of residence"}
                      </SelectValue>{" "}
                    </SelectTrigger>
                    <SelectContent>
                      {dropdownData.countries?.map((country, index) => (
                        <SelectItem key={index} value={country}>
                          {country
                            .split("-")
                            .map((word) => word.charAt(0) + word.slice(1))
                            .join(" ")}
                        </SelectItem>
                      ))}
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
                rules={{
                  required: !defaultData?.religion && "Religion is required",
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    onValueChange={(value) => field.onChange(value)}
                    value={defaultData?.religion}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select religion">
                        {field.value || "Select religion"}
                      </SelectValue>{" "}
                    </SelectTrigger>
                    <SelectContent>
                      {dropdownData.religions?.map((religion, index) => (
                        <SelectItem key={index} value={religion}>
                          {religion.charAt(0) + religion.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.religion && (
                <span className="text-red-500">{errors.religion.message}</span>
              )}
            </div>
            <div className="space-y-2 min-w-[300px] max-md:col-span-2">
              <Label htmlFor="<Marital-status">Marital Status</Label>
              <Controller
                name="maritalStatus"
                control={control}
                rules={{
                  required:
                    !defaultData?.maritalStatus && "Marital Status is required",
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={defaultData?.maritalStatus}
                    onValueChange={(value) => {
                      if (value === "Bachelor") {
                        setMarriedUnderAct(false);
                      }
                      if (
                        value === "Married" ||
                        value === "Widowed" ||
                        value === "Divorced" ||
                        value === "Other"
                      ) {
                        setMarriedUnderAct(true);
                      }
                      field.onChange(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Marital status">
                        {field.value || "Select Marital status"}
                      </SelectValue>{" "}
                    </SelectTrigger>
                    <SelectContent>
                      {dropdownData.maritalStatuses?.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0) + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.maritalStatus && (
                <span className="text-red-500">
                  {errors.maritalStatus.message}
                </span>
              )}
            </div>
            {marriedUnderAct && defaultData?.maritalStatus !== "Bachelor" && (
              <div className="space-y-2 mt-6 gap-2 flex  flex-col col-span-full">
                <div div className="flex justify-start item-center  gap-2">
                  <Checkbox
                    className="mt-2"
                    id="married-under-act"
                    onCheckedChange={() => setSpecialactundermarriange(true)}
                    defaultChecked={defaultData?.marriedUnderSpecialAct}
                    {...register("marriedUnderSpecialAct")}
                  />
                  <Label
                    className="flex items-center gap-2 mt-2 mb-2"
                    htmlFor="married-under-act"
                  >
                    Married under Special Marriage Act
                  </Label>
                  <button
                    type="button"
                    className="text-blue-500 hover:text-blue-700 focus:text-blue-700 self-center  px-4 rounded-md"
                    onClick={() => setShowMoreInfo(!showMoreInfo)}
                  >
                    {showMoreInfo ? "Read Less" : "Read More"}
                  </button>
                </div>
                {showMoreInfo && (
                  <div className="min-w-[60vw] max-md:min-w-[90%] mt-2 bg-gray-100 p-4 rounded-md">
                    <p>
                      A brief overview of the Special Marriage Act, 1954 As one
                      of independent India’s most significant secular
                      initiatives, the Special Marriage Act, 1954 was brought
                      into the Indian legal system in 1954. The Act was intended
                      to be a piece of legislation that controls weddings that
                      could not be solemnised due to religious traditions. The
                      Act applies to all Indian nationals, whether they live in
                      India or outside. The State of Jammu and Kashmir is not
                      included in the scope of this Act, although persons
                      domiciled in other states but residing in Jammu and
                      Kashmir would be eligible for these provisions. It is a
                      piece of law that establishes a special type of marriage
                      by registration. Marriage is unique in that there is no
                      requirement to convert or reject one’s religion. Unlike
                      conventional arranged weddings, which include two families
                      from the same caste or community, the Act aspires to
                      legalise interreligious or inter-caste marriages. The
                      Act’s Certificate of Registration has been regarded as
                      universal evidence of marriage. As stated in the Preamble,
                      the Act allows for a special form of marriage in specific
                      circumstances, registration of such and other marriages,
                      and divorce. Objectives of the Special Marriage Act, 1954
                    </p>
                  </div>
                )}
              </div>
            )}
            <div className="col-span-full space-y-4 min-w-[300px]">
              <h2 className="text-2xl font-bold mt-4">Address Details</h2>
              <h2 className="text-lg font-medium">Permanent Address</h2>
              <div className="space-y-2 min-w-[300px]">
                <Label htmlFor="permanent-house-flat-no">
                  House / Flat No.
                </Label>
                <Input
                  id="permanent-house-flat-no"
                  placeholder="House / Flat No."
                  defaultValue={defaultData?.permanentHouseFlatNo}
                  type="text"
                  className="min-w-[300px]"
                  {...register("permanentHouseFlatNo", {
                    required:
                      !defaultData?.permanentHouseFlatNo &&
                      "House / Flat No. is required",
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
                  defaultValue={defaultData?.permanentAddressLine1}
                  type="text"
                  {...register("permanentAddressLine1", {
                    required:
                      !defaultData?.permanentAddressLine1 &&
                      "Address Line 1 is required",
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
                  defaultValue={defaultData?.permanentAddressLine2}
                  type="text"
                  {...register("permanentAddressLine2", {
                    required:
                      !defaultData?.permanentAddressLine2 &&
                      "Address Line 2 is required",
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
                  defaultValue={defaultData?.permanentPincode}
                  type="text"
                  {...register("permanentPincode", {
                    required:
                      !defaultData?.permanentPincode && "Pincode is required",
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
                  defaultValue={defaultData?.permanentCity}
                  placeholder="City"
                  type="text"
                  {...register("permanentCity", {
                    required: !defaultData?.permanentCity && "City is required",
                  })}
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
                  defaultValue={defaultData?.permanentState}
                  type="text"
                  {...register("permanentState", {
                    required:
                      !defaultData?.permanentState && "State is required",
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
                  defaultValue={defaultData?.permanentCountry}
                  type="text"
                  {...register("permanentCountry", {
                    required:
                      !defaultData?.permanentCountry && "Country is required",
                  })}
                />
                {errors.permanentCountry && (
                  <span className="text-red-500">
                    {errors.permanentCountry.message}
                  </span>
                )}
              </div>
            </div>
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
                defaultChecked={defaultData?.sameAsPermanentAddress}
                checked={sameAsPermanentAddress}
                onCheckedChange={() =>
                  setSameAsPermanentAddress(!sameAsPermanentAddress)
                }
                {...register("sameAsPermanentAddress")}
              />
              {!sameAsPermanentAddress && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="current-house-flat-no">
                      House / Flat No.
                    </Label>
                    <Input
                      id="currentHouseFlatNo"
                      placeholder="House / Flat No."
                      defaultValue={defaultData?.currentHouseFlatNo}
                      type="text"
                      {...register("currentHouseFlatNo", {
                        required:
                          !defaultData?.currentHouseFlatNo &&
                          "House / Flat No. is required",
                      })}
                    />
                    {errors.currentHouseFlatNo && (
                      <span className="text-red-500">
                        {errors.currentHouseFlatNo.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="current-address-line-1">
                      Address Line 1
                    </Label>
                    <Input
                      id="currentAddressLine1"
                      placeholder="Address Line 1"
                      defaultValue={defaultData?.currentAddressLine1}
                      type="text"
                      {...register("currentAddressLine1", {
                        required:
                          !defaultData?.currentAddressLine1 &&
                          "Address Line 1 is required",
                      })}
                    />
                    {errors.currentAddressLine1 && (
                      <span className="text-red-500">
                        {errors.currentAddressLine1.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="current-address-line-2">
                      Address Line 2
                    </Label>
                    <Input
                      id="currentAddressLine2"
                      placeholder="Address Line 2"
                      defaultValue={defaultData?.currentAddressLine2}
                      type="text"
                      {...register("currentAddressLine2", {
                        required:
                          !defaultData?.currentAddressLine2 &&
                          "Address Line 2 is required",
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
                      id="currentPincode"
                      placeholder="Pincode"
                      defaultValue={defaultData?.currentPincode}
                      type="text"
                      {...register("currentPincode", {
                        required:
                          !defaultData?.currentPincode && "Pincode is required",
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
                      id="currentCity"
                      placeholder="City"
                      type="text"
                      defaultValue={defaultData?.currentCity}
                      {...register("currentCity", {
                        required:
                          !defaultData?.currentCity && "City is required",
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
                      id="currentState"
                      placeholder="State"
                      type="text"
                      defaultValue={defaultData?.currentState}
                      {...register("currentState", {
                        required:
                          !defaultData?.currentState && "State is required",
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
                      id="currentCountry"
                      placeholder="Country"
                      defaultValue={defaultData?.currentCountry}
                      type="text"
                      {...register("currentCountry", {
                        required:
                          !defaultData?.currentCountry && "Country is required",
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
            <div className="relative col-span-full space-y-4 mt-6 min-w-full md:min-w-[300px]">
              <h2 className="text-2xl font-bold mt-4">
                Identification(KYC) Details
              </h2>
              <h2 className="text-2xl font-medium">Aadhar</h2>
              <div className="col-span-full space-y-4 min-w-[300px]">
                <Label htmlFor="adhar">Do you have an Adhar?</Label>
                <Controller
                  name="adhar"
                  control={control}
                  defaultChecked={defaultData?.adhar}
                  rules={{
                    required: !defaultData?.adhar && "This field is required",
                  }}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      value={field.value}
                      defaultValue={defaultData?.adhar}
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
                            defaultChecked={defaultData?.adhar}
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
                    <Label htmlFor="aadhar-number">Aadhar Number</Label>
                    <Controller
                      name="aadharNumber"
                      control={control}
                      defaultValue={defaultData?.aadharNumber || ""}
                      render={({ field }) => (
                        <InputMask
                          mask="9999 9999 9999"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value.replace(/\s/g, ""));
                          }}
                          onBlur={field.onBlur}
                        >
                          {(inputProps) => (
                            <Input
                              id="aadhar-number"
                              placeholder="1234 5678 9012"
                              {...inputProps}
                              type="text"
                            />
                          )}
                        </InputMask>
                      )}
                      rules={{
                        required: "Aadhar Number is required",
                        pattern: {
                          value: /^[2-9]{1}[0-9]{11}$/,
                          message: "Invalid Aadhar Number",
                        },
                      }}
                    />
                    {errors.aadharNumber && (
                      <span className="text-red-500">
                        {errors.aadharNumber.message}
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
                      defaultValue={defaultData?.adharName}
                      {...register("aadharName", {
                        required:
                          !defaultData?.aadharName && "Full Name is required",
                      })}
                    />
                    {errors.aadharName && (
                      <span className="text-red-500">
                        {errors.aadharName.message}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aadharFile">Upload Your Aadhar File</Label>
                    <Controller
                      name="aadharFile"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="aadharFile"
                          placeholder="Full Name - Name as per Adhar"
                          type="file"
                          onChange={(event) => {
                            field.onChange(
                              event.target.files && event.target.files[0]
                            );
                            console.log("sadsA", event.target.files);
                          }}
                          className={errors.aadharFile ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.aadharFile && (
                      <span className="text-red-500">
                        {errors.aadharFile.message}
                      </span>
                    )}
                  </div>
                  {defaultData?.aadharFile && (
                    <div className="space-y-2 mt-[50px] flex items-center gap-2 justify-between color-green-500">
                      <Button
                        variant="ghost"
                        onClick={handleFileUpload}
                        className="color-green-500"
                      >
                        View Uploaded Aadhar File
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="col-span-full space-y-4 min-w-[300px]">
              <h2 className="text-2xl font-medium">PAN</h2>
              <div className="space-y-2">
                <Label htmlFor="pan">Do you have a PAN?</Label>
                <Controller
                  name="pan"
                  control={control}
                  defaultChecked={defaultData?.pan}
                  rules={{
                    required: !defaultData?.pan && "This field is required",
                  }}
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
                        <Label
                          className="flex items-center gap-2"
                          htmlFor="pan-no"
                        >
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
                    <Controller
                      name="panNumber"
                      control={control}
                      defaultValue={defaultData?.panNumber}
                      render={({ field }) => (
                        <InputMask
                          id="pan-number"
                          placeholder="ABCDE1234F"
                          mask="aaaaa9999a"
                          className="text-transform: uppercase;"
                          maskChar={null}
                          {...field}
                        >
                          {(inputProps) => (
                            <Input
                              {...inputProps}
                              className="uppercase"
                              type="text"
                            />
                          )}
                        </InputMask>
                      )}
                      rules={{
                        required:
                          !defaultData?.panNumber && "PAN Number is required",
                        // pattern: {
                        //   value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                        //   message: "Invalid PAN Number",
                        // },
                      }}
                    />
                    {errors.panNumber && (
                      <span className="text-red-500">
                        {errors.panNumber.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pan-name">Full Name as per PAN</Label>
                    <Input
                      id="pan-name"
                      defaultValue={defaultData?.panName}
                      placeholder="Full Name as per PAN"
                      type="text"
                      {...register("panName", {
                        required:
                          !defaultData?.panName && "Full Name is required",
                      })}
                    />
                    {errors.panName && (
                      <span className="text-red-500">
                        {errors.panName.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aadharFile">Upload Your Pan File</Label>
                    <Controller
                      name="panFile"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="panFile"
                          type="file"
                          onChange={(event) => {
                            field.onChange(
                              event.target.files && event.target.files[0]
                            );
                            console.log("sadsA", event.target.files);
                          }}
                          className={errors.panFile ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.panFile && (
                      <span className="text-red-500">
                        {errors.panFile.message}
                      </span>
                    )}
                  </div>
                  {defaultData?.panFile && (
                    <div className="space-y-2 mt-[50px] flex items-center gap-2 justify-between color-green-500">
                      <Button
                        variant="ghost"
                        onClick={handleFileUploadPan}
                        className="color-green-500"
                      >
                        View Uploaded Pan File
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="col-span-full space-y-4 min-w-[300px]">
              <h2 className="text-2xl font-medium">Driving License</h2>
              <div className="space-y-2">
                <Label htmlFor="driving-license">
                  Do you have a Driving License?
                </Label>
                <Controller
                  name="drivingLicence"
                  control={control}
                  defaultChecked={defaultData?.drivingLicence}
                  rules={{
                    required:
                      !defaultData?.drivingLicence && "This field is required",
                  }}
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
                          <RadioGroupItem
                            id="driving-license-yes"
                            value="yes"
                          />
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
                {errors.drivingLicence && (
                  <span className="text-red-500">
                    {errors.drivingLicence.message}
                  </span>
                )}
              </div>
              {showDLFields && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="driving-license-number">
                      Driving License Number
                    </Label>
                    <Controller
                      name="drivingLicenceNumber"
                      control={control}
                      defaultValue={defaultData?.drivingLicenceNumber}
                      render={({ field }) => (
                        <InputMask
                          id="driving-license-number"
                          placeholder="Driving License Number"
                          mask="aa99-99999999999"
                          maskChar={null}
                          {...field}
                        >
                          {(inputProps) => (
                            <Input
                              {...inputProps}
                              className="uppercase"
                              type="text"
                            />
                          )}
                        </InputMask>
                      )}
                      rules={{
                        required:
                          !defaultData?.drivingLicenceNumber &&
                          "Driving License Number is required",
                        pattern: {
                          //  value: /^[A-Z]{1}[0-9]{15}$/,
                          message: "Invalid Driving License Number",
                        },
                      }}
                    />
                    {errors.drivingLicenceNumber && (
                      <span className="text-red-500">
                        {errors.drivingLicenceNumber.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driving-license-name">
                      Name as per Driving License
                    </Label>
                    <Input
                      id="driving-license-name"
                      placeholder="Name as per Driving License"
                      defaultValue={defaultData?.drivingLicenceName}
                      type="text"
                      {...register("drivingLicenceName", {
                        required:
                          !defaultData?.drivingLicenceName &&
                          "Name as per Driving License is required",
                      })}
                    />
                    {errors.drivingLicenceName && (
                      <span className="text-red-500">
                        {errors.drivingLicenceName.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driving-license-expiry">Expiry Date</Label>
                    <Controller
                      name="drivingLicenceExpiryDate"
                      control={control}
                      defaultValue={defaultData?.drivingLicenceExpiryDate}
                      render={({ field }) => (
                        <Datepicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    {errors.drivingLicenceExpiryDate && (
                      <span className="text-red-500">
                        {errors.drivingLicenceExpiryDate.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driving-license-place">
                      Place of issue
                    </Label>
                    <Input
                      id="driving-license-place"
                      placeholder="Place of issue"
                      defaultValue={defaultData?.drivingLicencePlace}
                      type="text"
                      {...register("drivingLicencePlace", {
                        required:
                          !defaultData?.drivingLicencePlace &&
                          "Place of issue is required",
                      })}
                    />
                    {errors.drivingLicencePlace && (
                      <span className="text-red-500">
                        {errors.drivingLicencePlace.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="drivingFile">
                      Upload Your Driving File
                    </Label>
                    <Controller
                      name="drivingFile"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="drivingFile"
                          type="file"
                          onChange={(event) => {
                            field.onChange(
                              event.target.files && event.target.files[0]
                            );
                            console.log("sadsA", event.target.files);
                          }}
                          className={errors.drivingFile ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.drivingFile && (
                      <span className="text-red-500">
                        {errors.drivingFile.message}
                      </span>
                    )}
                  </div>
                  {defaultData?.drivingFile && (
                    <div className="space-y-2 mt-[50px] flex items-center gap-2 justify-between color-green-500">
                      <Button
                        variant="ghost"
                        onClick={handleFileUploadDriving}
                        className="color-green-500"
                      >
                        View Uploaded Driving File
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="col-span-full space-y-4 min-w-[300px]">
              <h2 className="text-2xl font-medium">Passport</h2>
              <div className="space-y-2">
                <Label htmlFor="passport">Do you have a Passport?</Label>
                <Controller
                  name="passport"
                  defaultChecked={defaultData?.passport}
                  control={control}
                  rules={{
                    required:
                      !defaultData?.passport && "This field is required",
                  }}
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
                  <span className="text-red-500">
                    {errors.passport.message}
                  </span>
                )}
              </div>
              {showPassportFields && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="pp-number">Passport Number</Label>
                    <Controller
                      name="passportNumber"
                      control={control}
                      defaultValue={defaultData?.passportNumber}
                      render={({ field }) => (
                        <InputMask
                          id="pp-number"
                          placeholder="A1234567"
                          mask="a9999999"
                          maskChar={null}
                          {...field}
                        >
                          {(inputProps) => (
                            <Input {...inputProps} type="text" />
                          )}
                        </InputMask>
                      )}
                      rules={{
                        required:
                          !defaultData?.passportNumber &&
                          "Passport Number is required",
                        pattern: {
                          // value: /^[A-Z][0-9]{7}$/,
                          message: "Invalid Passport Number",
                        },
                      }}
                    />
                    {errors.passportNumber && (
                      <span className="text-red-500">
                        {errors.passportNumber.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pp-name">Name as per Passport</Label>
                    <Input
                      id="pp-name"
                      placeholder="Name as per Passport"
                      type="text"
                      defaultValue={defaultData?.passportName}
                      {...register("passportName", {
                        required:
                          !defaultData?.passportName &&
                          "Name as per Passport is required",
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
                      name="passportExpiryDate"
                      control={control}
                      defaultValue={defaultData?.passportExpiryDate}
                      render={({ field }) => (
                        <Datepicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    {errors.passportExpiryDate && (
                      <span className="text-red-500">
                        {errors.passportExpiryDate.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pp-place">Place of issue</Label>
                    <Input
                      id="passportPlaceOfIssue"
                      placeholder="Place of issue"
                      defaultValue={defaultData?.passportPlaceOfIssue}
                      type="text"
                      {...register("passportPlaceOfIssue", {
                        required:
                          !defaultData?.passportPlaceOfIssue &&
                          "Place of issue is required",
                      })}
                    />
                    {errors.passportPlaceOfIssue && (
                      <span className="text-red-500">
                        {errors.passportPlaceOfIssue.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passportFile">
                      Upload Your Passport File
                    </Label>
                    <Controller
                      name="passportFile"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="passportFile"
                          type="file"
                          onChange={(event) => {
                            field.onChange(
                              event.target.files && event.target.files[0]
                            );
                            console.log("sadsA", event.target.files);
                          }}
                          className={
                            errors.passportFile ? "border-red-500" : ""
                          }
                        />
                      )}
                    />
                    {errors.passportFile && (
                      <span className="text-red-500">
                        {errors.passportFile.message}
                      </span>
                    )}
                  </div>
                  {defaultData?.passportFile && (
                    <div className="space-y-2 mt-[50px] flex items-center gap-2 justify-between color-green-500">
                      <Button
                        variant="ghost"
                        onClick={handleFileUploadPassport}
                        className="color-green-500"
                      >
                        View Uploaded Passport File
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="col-span-full flex justify-end min-w-[200px] max-md:mt-2">
              <Button
                className="w-full max-w-[200px] min-h-[50px] rounded-[2rem] mt-6"
                type="submit"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      )}
    </Suspense>
  );
};

export default Personaldetail;

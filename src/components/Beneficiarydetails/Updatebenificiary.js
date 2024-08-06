import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@com/ui/card";
import { Label } from "@com/ui/label";
import { Input } from "@com/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@com/ui/select";
import "react-international-phone/style.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@com/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@com/ui/sheet";
import DropdownData from "../Personaldetail/value.json";
import { ScrollArea } from "@com/ui/scroll-area";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import Datepicker from "./Datepicker";
import { PhoneInput } from "react-international-phone";
import { toast } from "sonner";

const beneficiarySchema = z.object({
  fullLegalName: z.string().nonempty("Full Legal Name is required"),
  relationship: z.string().nonempty("Relationship is required"),
  specificRelationship: z.string().optional(),
  gender: z.string().nonempty("Gender is required"),
  dob: z.any().optional(),
  guardianName: z.string().optional(),
  guardianMobile: z.string().optional(),
  guardianEmail: z.string().optional(),
  guardianCity: z.string().optional(),
  guardianState: z.string().optional(),
  document: z.string().optional(),
  documentData: z.string().optional(),
  guardianReligion: z.string().optional(),
  guardianNationality: z.string().optional(),
  addressLine1: z.string().nonempty("Address Line 1 is required"),
  addressLine2: z.any().optional(),
  pincode: z.any().optional(),
  country: z.any().optional(),
  mobile: z.string().nonempty("Mobile is required"),
  email: z.string().email("Invalid email").nonempty("Email is required"),
  city: z.string().nonempty("City is required"),
  state: z.any().optional(),
  houseNo: z.string().nonempty("House No is required"),
  religion: z.string().nonempty("Religion is required"),
  nationality: z.string().nonempty("Nationality is required"),
});

const BeneficiaryForm = ({
  updateBenificiaryOpen,
  setUpdateBenificiaryOpen,
  benificiaryId,
}) => {
  const [defaultData, setDefaultData] = useState({});
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(beneficiarySchema),
    defaultValues: {},
  });

  const [selectedDocument, setSelectedDocument] = useState("");
  const [relationship, setRelationship] = useState("");
  const [isMinor, setIsMinor] = useState(true);

  const watchDOB = watch("dob", null);
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);

  useEffect(() => {
    if (watchDOB) {
      const age = calculateAge(watchDOB);
      if (age >= 18) {
        clearGuardianFields();
      }
    }
  }, [watchDOB]);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const ageDiff = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

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

  const getPersonalData = async () => {
    if (!user) return;
    const response = await axios.get(`/api/beneficiaries/${benificiaryId}`, {
      headers: {
        Authorization: `Bearer ${user?.data?.token}`,
      },
    });
    const beneficiaryData = response.data.data.Beneficiary;
    setDefaultData(beneficiaryData);
    reset(beneficiaryData);
    if (beneficiaryData?.relationship === "other") {
      setRelationship(beneficiaryData?.specificRelationship);
    }
    if (calculateAge(beneficiaryData?.dob) < 18) {
      setIsMinor(true);
    }
    setValue("document", beneficiaryData.document);
    setSelectedDocument(beneficiaryData.document);

    if (
      ["child", "spouse", "self", "parent", "sibling"].includes(
        beneficiaryData?.relationship
      )
    ) {
      setValue("relationship", beneficiaryData?.relationship);
      return;
    } else {
      setRelationship("other");
      setValue("relationship", beneficiaryData?.relationship);
    }
  };

  const {
    data: Beneficiary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["beneficiaryData", benificiaryId],
    queryFn: getPersonalData,
    enabled: !!benificiaryId,

    onSuccess: (data) => {
      reset(data);
      setSelectedDocument(data?.document);
      setValue("document", data?.document);
      setValue("documentData", data?.documentData);
    },

    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile", error.message);
    },
  });

  useEffect(() => {
    setSelectedDocument(Beneficiary?.document);
  }, [Beneficiary]);
  const clearGuardianFields = () => {
    setValue("guardianName", "");
    setValue("guardianMobile", "");
    setValue("guardianEmail", "");
    setValue("guardianCity", "");
    setValue("guardianState", "");
    setValue("guardianReligion", "");
    setValue("guardianNationality", "");
  };

  const beneficiaryMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(
        `/api/beneficiaries/${benificiaryId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      return response.data.data.profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("beneficiaryData");
      toast.success("Beneficiary added successfully!");
      setUpdateBenificiaryOpen(false);
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile");
    },
  });

  const onSubmit = async (data) => {
    const date = new Date(data.dob);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    const newdate = `${month}/${day}/${year}`;
    data.dob = newdate;
    data.type = "beneficiary";
    if (relationship === "other") {
      data.relationship = data.specificRelationship;
    }
    delete data.specificRelationship;

    if (calculateAge(data.dob) >= 18) {
      delete data.guardianCity;
      delete data.guardianState;
      delete data.guardianReligion;
      delete data.guardianNationality;
    }
    try {
      beneficiaryMutate.mutate(data);
    } catch (error) {
      toast.error("Failed to add beneficiary");
      console.error("Error adding beneficiary:", error);
    }
  };

  useEffect(() => {
    if (watchDOB) {
      setIsMinor(calculateAge(watchDOB) < 18);
    }
  }, [watchDOB]);

  return (
    <div>
      <Sheet
        className="w-[800px]"
        open={updateBenificiaryOpen}
        onOpenChange={setUpdateBenificiaryOpen}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Beneficiary</SheetTitle>
            <SheetDescription className="flex flex-col justify-center">
              <ScrollArea className="w-full h-[85vh] rounded-md">
                <form onSubmit={handleSubmit(onSubmit)} className="scrollable">
                  <Card className="w-full max-w-3xl">
                    <CardHeader>
                      <CardTitle>Beneficiary Form</CardTitle>
                      <CardDescription>
                        Please fill out the following details.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      <div>
                        <h3 className="text-lg font-medium">Basic Details</h3>
                        <div className="grid grid-cols-1 gap-6 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="full-name">Full Legal Name</Label>
                            <Input
                              id="full-name"
                              placeholder="Enter your full legal name"
                              defaultValue={defaultData?.fullLegalName}
                              {...register("fullLegalName")}
                            />
                            {errors.fullLegalName && (
                              <p className="text-red-500">
                                {errors.fullLegalName.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="relationship">Relationship</Label>
                            <Controller
                              name="relationship"
                              control={control}
                              defaultValues={defaultData?.relationship}
                              render={({ field }) => (
                                <Select
                                  value={field.value}
                                  defaultValue={defaultData?.relationship}
                                  onValueChange={(value) => {
                                    field.onChange(value);

                                    setRelationship(value);
                                  }}
                                >
                                  <SelectTrigger
                                    id="relationship"
                                    aria-label="Relationship"
                                  >
                                    <SelectValue placeholder="Select relationship" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="self">Self</SelectItem>
                                    <SelectItem value="spouse">
                                      Spouse
                                    </SelectItem>
                                    <SelectItem value="child">Child</SelectItem>
                                    <SelectItem value="parent">
                                      Parent
                                    </SelectItem>
                                    <SelectItem value="sibling">
                                      Sibling
                                    </SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {errors.relationship && (
                              <p className="text-red-500">
                                {errors.relationship.message}
                              </p>
                            )}
                          </div>
                          {relationship === "other" && (
                            <div className="space-y-2">
                              <Label htmlFor="specific-relationship">
                                Specific Relationship
                              </Label>
                              <Input
                                id="specificRelationship"
                                defaultValue={defaultData?.relationship}
                                placeholder="Enter specific relationship"
                                {...register("specificRelationship", {
                                  required: relationship === "other",
                                })}
                              />
                              {errors.specificRelationship && (
                                <p className="text-red-500">
                                  {errors.specificRelationship.message}
                                </p>
                              )}
                            </div>
                          )}
                          <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Controller
                              name="gender"
                              defaultValue={defaultData?.gender}
                              control={control}
                              render={({ field }) => (
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  defaultValue={defaultData?.gender}
                                >
                                  <SelectTrigger
                                    id="gender"
                                    aria-label="Gender"
                                  >
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">
                                      Female
                                    </SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {errors.gender && (
                              <p className="text-red-500">
                                {errors.gender.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2 min-w-[22.5rem]">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Controller
                              name="dob"
                              control={control}
                              defaultValue={defaultData?.dob}
                              render={({ field }) => (
                                <Datepicker
                                  value={field.value}
                                  onChange={field.onChange}
                                  defaultValues={defaultData?.dob}
                                  className="min-w-[190rem]"
                                />
                              )}
                            />
                            {errors.dob && (
                              <p className="text-red-500">
                                {errors.dob.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2 min-w-[22.5rem]">
                            <Label htmlFor="mobile">Mobile Number</Label>
                            <Controller
                              name="mobile"
                              defaultValue={defaultData?.mobile}
                              control={control}
                              render={({ field }) => (
                                <PhoneInput
                                  id="mobile"
                                  type="tel"
                                  placeholder="Enter mobile number"
                                  defaultCountry="in"
                                  value={
                                    field.value || defaultData?.mobile || ""
                                  }
                                  defaultValue={defaultData?.mobile}
                                  inputStyle={{ minWidth: "15.5rem" }}
                                  onChange={field.onChange}
                                />
                              )}
                            />
                            {errors.mobile && (
                              <p className="text-red-500">
                                {errors.mobile.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              defaultValue={defaultData?.email}
                              placeholder="Enter email"
                              {...register("email")}
                            />
                            {errors.email && (
                              <p className="text-red-500">
                                {errors.email.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      {isMinor && (
                        <div>
                          <h3 className="text-lg font-medium">
                            Guardian Details
                          </h3>
                          <div className="grid grid-cols-1 gap-6 mt-4">
                            <div className="space-y-2">
                              <Label htmlFor="guardian-name">
                                Full Legal Name
                              </Label>
                              <Input
                                id="guardian-name"
                                placeholder="Enter guardian's full legal name"
                                defaultValue={defaultData?.guardianName}
                                {...register("guardianName")}
                              />
                              {errors.guardianName && (
                                <p className="text-red-500">
                                  {errors.guardianName.message}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="guardian-mobile">
                                Mobile Number
                              </Label>
                              <Controller
                                name="guardianMobile"
                                defaultValue={defaultData?.guardianMobile}
                                control={control}
                                render={({ field }) => (
                                  <PhoneInput
                                    id="guardian-mobile"
                                    type="tel"
                                    placeholder="Enter guardian's mobile number"
                                    defaultCountry="in"
                                    defaultValue={defaultData?.guardianMobile}
                                    value={field.value || ""}
                                    inputStyle={{ minWidth: "15.5rem" }}
                                    onChange={field.onChange}
                                  />
                                )}
                              />
                              {errors.guardianMobile && (
                                <p className="text-red-500">
                                  {errors.guardianMobile.message}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="guardian-email">Email</Label>
                              <Input
                                id="guardian-email"
                                type="email"
                                defaultValue={defaultData?.guardianEmail}
                                placeholder="Enter guardian's email"
                                {...register("guardianEmail")}
                              />
                              {errors.guardianEmail && (
                                <p className="text-red-500">
                                  {errors.guardianEmail.message}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="guardian-city">City</Label>
                              <Input
                                id="guardian-city"
                                defaultValue={defaultData?.guardianCity}
                                placeholder="Enter guardian's city"
                                {...register("guardianCity")}
                              />
                              {errors.guardianCity && (
                                <p className="text-red-500">
                                  {errors.guardianCity.message}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="guardian-state">State</Label>
                              <Input
                                id="guardian-state"
                                defaultValue={defaultData?.guardianState}
                                placeholder="Enter guardian's state"
                                {...register("guardianState")}
                              />
                              {errors.guardianState && (
                                <p className="text-red-500">
                                  {errors.guardianState.message}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="document">
                          Identification Document
                        </Label>
                        <Controller
                          name="document"
                          control={control}
                          defaultValue={defaultData?.document}
                          render={({ field }) => (
                            <Select
                              name="document"
                              defaultValue={defaultData?.document}
                              onValueChange={(value) => {
                                setSelectedDocument(value);
                                field.onChange(value);
                              }}
                            >
                              <SelectTrigger
                                id="document"
                                aria-label="Identification Document"
                              >
                                <SelectValue placeholder="Select document" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem
                                  defaultValue={defaultData?.document}
                                  value="aadhar"
                                >
                                  Aadhaar
                                </SelectItem>
                                <SelectItem
                                  defaultValue={defaultData?.document}
                                  value="passport"
                                >
                                  Passport
                                </SelectItem>
                                <SelectItem value="driving-license">
                                  Driving License
                                </SelectItem>
                                <SelectItem value="voter-id">
                                  Voter ID
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.document && (
                          <p className="text-red-500">
                            {errors.document.message}
                          </p>
                        )}
                      </div>
                      {selectedDocument && (
                        <div className="space-y-2">
                          <Label htmlFor="document-data">
                            {selectedDocument} Number
                          </Label>
                          <Input
                            id="documentData"
                            placeholder={`Enter ${selectedDocument} number`}
                            defaultValue={defaultData?.documentData}
                            {...register("documentData")}
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="religion">Religion</Label>
                        <Controller
                          name="religion"
                          control={control}
                          defaultValue={defaultData?.religion}
                          render={({ field }) => (
                            <Select
                              id="religion"
                              value={field.value}
                              onValueChange={(value) => {
                                field.onChange(value);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select religion">
                                  {field.value || "Select religion"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {DropdownData.religions?.map((religion) => (
                                  <SelectItem key={religion} value={religion}>
                                    {religion.charAt(0) + religion.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.religion && (
                          <p className="text-red-500">
                            {errors.religion.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nationality">Nationality</Label>
                        <Controller
                          name="nationality"
                          control={control}
                          defaultValue={defaultData?.nationality}
                          render={({ field }) => (
                            <Select
                              id="nationality"
                              value={field.value}
                              onValueChange={(value) => {
                                field.onChange(value);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select nationality">
                                  {field.value || "Select nationality"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {DropdownData.specificNationalities?.map(
                                  (nationality) => (
                                    <SelectItem
                                      key={nationality}
                                      value={nationality}
                                    >
                                      {nationality
                                        .split("-")
                                        .map(
                                          (word) =>
                                            word.charAt(0) + word.slice(1)
                                        )
                                        .join(" ")}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.nationality && (
                          <p className="text-red-500">
                            {errors.nationality.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="house-no">House/Flat No.</Label>
                        <Input
                          id="house-no"
                          placeholder="Enter house/flat number"
                          defaultValue={defaultData?.houseNo}
                          {...register("houseNo")}
                        />
                        {errors.houseNo && (
                          <p className="text-red-500">
                            {errors.houseNo.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address-line1">Address Line 1</Label>
                        <Input
                          id="address-line1"
                          placeholder="Enter address line 1"
                          defaultValue={defaultData?.addressLine1}
                          {...register("addressLine1")}
                        />
                        {errors.addressLine1 && (
                          <p className="text-red-500">
                            {errors.addressLine1.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address-line2">Address Line 2</Label>
                        <Input
                          id="address-line2"
                          placeholder="Enter address line 2"
                          defaultValue={defaultData?.addressLine2}
                          {...register("addressLine2")}
                        />
                        {errors.addressLine2 && (
                          <p className="text-red-500">
                            {errors.addressLine2.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input
                          id="pincode"
                          placeholder="Enter pincode"
                          defaultValue={defaultData?.pincode}
                          // {...register("pincode")}
                          onChange={(e) => handlePincodeChange(e.target.value)}
                        />
                        {errors.pincode && (
                          <p className="text-red-500">
                            {errors.pincode.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          placeholder="Enter country"
                          defaultValue={defaultData?.country}
                          {...register("country")}
                        />
                        {errors.country && (
                          <p className="text-red-500">
                            {errors.country.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="Enter city"
                          defaultValue={defaultData?.city}
                          {...register("city", { required: true })}
                        />
                        {errors.city && (
                          <p className="text-red-500">{errors.city.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          placeholder="Enter state"
                          defaultValue={defaultData?.state}
                          {...register("state", { required: true })}
                        />
                        {errors.state && (
                          <p className="text-red-500">{errors.state.message}</p>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-4">
                      <Button type="submit">Submit</Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setUpdateBenificiaryOpen(false)}
                      >
                        Cancel
                      </Button>
                    </CardFooter>
                  </Card>
                </form>
              </ScrollArea>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default BeneficiaryForm;

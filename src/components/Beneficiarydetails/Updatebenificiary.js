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
import { ScrollArea } from "@com/ui/scroll-area";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import Datepicker from "./Datepicker";
import { PhoneInput } from "react-international-phone";
import { toast } from "sonner";

const beneficiarySchema = z
  .object({
    fullLegalName: z.string().nonempty("Full Legal Name is required"),
    relationship: z.string().nonempty("Relationship is required"),
    specificRelationship: z.string().optional(),
    gender: z.string().nonempty("Gender is required"),
    dob: z.date().optional(),
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
    addressLine2: z.string().nonempty("Address Line 2 is required"),
    pincode: z.string().nonempty("Pincode is required"),
    country: z.string().nonempty("Country is required"),
    mobile: z.string().nonempty("Mobile is required"),
    email: z.string().email("Invalid email").nonempty("Email is required"),
    city: z.string().nonempty("City is required"),
    state: z.string().nonempty("State is required"),
    houseNo: z.string().nonempty("House No is required"),
    religion: z.string().nonempty("Religion is required"),
    nationality: z.string().nonempty("Nationality is required"),
  })
  .refine(
    (data) => {
      if (data.dob) {
        const age = Math.abs(
          new Date(Date.now() - new Date(data.dob).getTime()).getUTCFullYear() -
            1970
        );
        if (age < 18) {
          return !!(
            data.guardianName &&
            data.guardianMobile &&
            data.guardianEmail
          );
        }
      }
      return true;
    },
    {
      message: "Guardian fields are required for minors.",
      path: ["guardianName"], // this will highlight the guardianName field in case of error
    }
  );

const BenificiaryForm = ({
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
  });

  const [selectedDocument, setSelectedDocument] = useState("");
  const [relationship, setRelationship] = useState("");

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

  const getPersonalData = async () => {
    if (!user) return;
    const response = await axios.get(`/api/beneficiaries/${benificiaryId}`, {
      headers: {
        Authorization: `Bearer ${user?.data?.token}`,
      },
    });
    console.log("MEsage", response.data.data.Beneficiary);
    setDefaultData(response.data.data.Beneficiary);
    if (response.data.data.Beneficiary?.relationship === "other") {
      setRelationship(response.data.data.Beneficiary?.specificRelationship);
    }
    if (calculateAge(response.data.data.Beneficiary?.dob) < 18) {
      setMarriedUnderAct(true);
    }

    return response?.data?.data?.Beneficiary;
  };

  const {
    data: Beneficiary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["benificiaryData", benificiaryId],
    queryFn: getPersonalData,
    enabled: !!benificiaryId,

    onSuccess: (data) => {
      reset(data);
    },

    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile", error.message);
    },
  });

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
      const response = await axios.post(`/api/beneficiaries`, data, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });
      return response.data.data.profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("beneficiaryData");
      toast.success("Beneficiary added successfully!");
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
      delete data.document;
      delete data.documentData;
      delete data.guardianReligion;
      delete data.guardianNationality;
      delete data.houseNo;
      delete data.addressLine1;
      delete data.addressLine2;
      delete data.pincode;
      delete data.country;
    }
    try {
      beneficiaryMutate.mutate(data);
    } catch (error) {
      toast.error("Failed to add beneficiary");
      console.error("Error adding beneficiary:", error);
    }
  };

  const isMinor = watchDOB ? calculateAge(watchDOB) < 18 : true;

  return (
    <div>
      <Sheet
        className="w-[800px]"
        open={updateBenificiaryOpen}
        onOpenChange={setUpdateBenificiaryOpen}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add Beneficiary</SheetTitle>
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
                                  defaultValue={defaultData?.dob}
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
                                  defaultValue={defaultData?.mobile}
                                  inputStyle={{ minWidth: "15.5rem" }}
                                  value={field.value}
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
                                    value={field.value}
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
                          render={({ field }) => (
                            <Select
                              value={field.value}
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
                                <SelectItem value="aadhar">Aadhaar</SelectItem>
                                <SelectItem value="passport">
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
                            id="document-data"
                            placeholder={`Enter ${selectedDocument} number`}
                            defaultValue={defaultData?.documentData}
                            {...register("documentData")}
                          />
                          {errors.documentData && (
                            <p className="text-red-500">
                              {errors.documentData.message}
                            </p>
                          )}
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="religion">Religion</Label>
                        <Input
                          id="religion"
                          placeholder="Enter religion"
                          {...register("religion")}
                          defaultValue={defaultData?.religion}
                        />
                        {errors.religion && (
                          <p className="text-red-500">
                            {errors.religion.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nationality">Nationality</Label>
                        <Input
                          id="nationality"
                          placeholder="Enter nationality"
                          defaultValue={defaultData?.nationality}
                          {...register("nationality")}
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
                          {...register("pincode")}
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

export default BenificiaryForm;

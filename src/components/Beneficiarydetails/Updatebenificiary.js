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
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    pincode: z.string().optional(),
    country: z.string().optional(),
    mobile: z.string().optional(),
    email: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    houseNo: z.string().optional(),
    address1: z.string().optional(),
    address2: z.string().optional(),
    pincode: z.string().optional(),
    country: z.string().optional(),
    religion: z.string().optional(),
    nationality: z.string().optional(),
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

const Benificiaryform = ({
  updateBenificiaryOpen,
  setUpdateBenificiaryOpen,
  benificiaryId,
}) => {
  console.log(benificiaryId);
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
  const [dateCountryCode, setDateCountryCode] = useState("+91");
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

    return response?.data?.data?.Beneficiary;
  };

  const {
    data: Benificiary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["charityData", benificiaryId],
    queryFn: getPersonalData,
    enabled: !!benificiaryId,

    onSuccess: (data) => {
      reset(data);
      console.log("Data:", data);
      // if (data.dob) {
      //   const age = calculateAge(data.dob);
      //   if (age >= 18) {
      //     clearGuardianFields();
      //   }
      // }

      // for (const [key, value] of Object.entries(data)) {
      //   setValue(key, value);
      // }
    },

    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile", error.message);
    },
  });
  useEffect(() => {
    console.log(Benificiary);
  }, [Benificiary]);


  const clearGuardianFields = () => {
    setValue("guardianName", "");
    setValue("guardianMobile", "");
    setValue("guardianEmail", "");
    setValue("guardianCity", "");
    setValue("guardianState", "");
    setValue("guardianReligion", "");
    setValue("guardianNationality", "");
  };

  const benificiaryMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(`/api/beneficiaries`, data, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });
      return response.data.data.profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("benificiaryData");
      toast.success("Beneficiary added successfully!");
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile");
    },
  });

  const onSubmit = async (data) => {

    console.log(data);
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

    if (data.dob > new Date() === 18) {
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
      benificiaryMutate.mutate(data);
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
                              defaultValue={Benificiary?.fullLegalName}
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
                              defaultValue={Benificiary?.relationship}
                              render={({ field }) => (
                                <Select
                                  value={field.value}
                                  defaultValue={Benificiary?.relationship}  
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
                                id="specifyRelationship"
                                placeholder="Enter specific relationship"
                                {...register("specificRelationship", {
                                  required: relationship === "other",
                                  defaultValue: Benificiary?.specificRelationship,
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
                              control={control}
                              render={({ field }) => (
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  defaultValue={Benificiary?.gender}
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
                              defaultValue={Benificiary?.dob}
                              render={({ field }) => (
                                <Datepicker
                                  value={field.value}
                                  onChange={field.onChange}
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
                              control={control}
                              render={({ field }) => (
                                <PhoneInput
                                  id="mobile"
                                  type="tel"
                                  placeholder="Enter mobile number"
                                  defaultValue={Benificiary?.mobile}
                                  defaultCountry="in"
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
                              placeholder="Enter email"
                              {...register("email")}
                              defaultValue={Benificiary?.email}
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
                                {...register("guardianName")}
                                defaultValue={Benificiary?.guardianName}
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
                                control={control}
                                render={({ field }) => (
                                  <PhoneInput
                                    id="guardian-mobile"
                                    type="tel"
                                    placeholder="Enter guardian's mobile number"
                                    defaultValue={Benificiary?.guardianMobile}
                                    defaultCountry="in"
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
                                placeholder="Enter guardian's email"
                                {...register("guardianEmail")}
                                defaultValue={Benificiary?.guardianEmail}
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
                                placeholder="Enter guardian's city"
                                {...register("guardianCity")}
                                defaultValue={Benificiary?.guardianCity}
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
                                placeholder="Enter guardian's state"
                                {...register("guardianState")}
                                defaultValue={Benificiary?.guardianState}
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
                        <Label htmlFor="guardian-document">
                          Identification Document
                        </Label>
                        <Controller
                          name="document"
                          control={control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              defaultValue={Benificiary?.document}
                              onValueChange={(value) => {
                                setSelectedDocument(value);
                                field.onChange(value);
                              }}
                            >
                              <SelectTrigger
                                id="guardian-document"
                                aria-label="Identification Document"
                              >
                                <SelectValue placeholder="Select document" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="adhar">Aadhaar</SelectItem>
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
                          <Label htmlFor="guardian-document-data">
                            {selectedDocument} Number
                          </Label>
                          <Input
                            id="guardian-document-data"
                            placeholder={`Enter guardian's ${selectedDocument} number`}
                            {...register("documentData")}
                            defaultValue={Benificiary?.documentData}
                          />
                          {errors.documentData && (
                            <p className="text-red-500">
                              {errors.documentData.message}
                            </p>
                          )}
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="guardian-religion">Religion</Label>
                        <Input
                          id="guardian-religion"
                          placeholder="Enter guardian's religion"
                          {...register("religion")}
                          defaultValue={Benificiary?.religion}
                        />
                        {errors.guardianReligion && (
                          <p className="text-red-500">
                            {errors.guardianReligion.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guardian-nationality">
                          Nationality
                        </Label>
                        <Input
                          id="guardian-nationality"
                          placeholder="Enter guardian's nationality"
                          {...register("nationality")}
                          defaultValue={Benificiary?.nationality}
                        />
                        {errors.guardianNationality && (
                          <p className="text-red-500">
                            {errors.guardianNationality.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guardian-house-no">
                          House/Flat No.
                        </Label>
                        <Input
                          id="guardian-house-no"
                          placeholder="Enter house/flat number"
                          {...register("houseNo")}
                          defaultValue={Benificiary?.houseNo}
                        />
                        {errors.houseNo && (
                          <p className="text-red-500">
                            {errors.houseNo.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guardian-address1">
                          Address Line 1
                        </Label>
                        <Input
                          id="guardian-address1"
                          placeholder="Enter address line 1"
                          {...register("addressLine1")}
                          defaultValue={Benificiary?.addressLine1}
                        />
                        {errors.addressLine1 && (
                          <p className="text-red-500">
                            {errors.addressLine1.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guardian-address2">
                          Address Line 2
                        </Label>
                        <Input
                          id="guardian-address2"
                          placeholder="Enter address line 2"
                          {...register("addressLine2")}
                          defaultValue={Benificiary?.addressLine2}
                        />
                        {errors.addressLine2 && (
                          <p className="text-red-500">
                            {errors.addressLine2.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guardian-pincode">Pincode</Label>
                        <Input
                          id="guardian-pincode"
                          placeholder="Enter pincode"
                          {...register("pincode")}
                          defaultValue={Benificiary?.pincode}
                        />
                        {errors.pincode && (
                          <p className="text-red-500">
                            {errors.pincode.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guardian-country">Country</Label>
                        <Input
                          id="guardian-country"
                          placeholder="Enter country"
                          {...register("country")}
                          defaultValue={Benificiary?.country}
                        />
                        {errors.country && (
                          <p className="text-red-500">
                            {errors.country.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="guardian-city">City</Label>
                        <Input
                          id="guardian-city"
                          placeholder="Enter guardian's city"
                          {...register("city", { required: true })}
                          defaultValue={Benificiary?.city}
                        />
                        {errors.city && (
                          <p className="text-red-500">{errors.city.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guardian-state">State</Label>
                        <Input
                          id="guardian-state"
                          placeholder="Enter guardian's state"
                          {...register("state", { required: true })}
                          defaultValue={Benificiary?.state}
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

export default Benificiaryform;

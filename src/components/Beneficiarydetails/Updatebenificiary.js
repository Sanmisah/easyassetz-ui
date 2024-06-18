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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const beneficiarySchema = z
  .object({
    fullLegalName: z.string().nonempty("Full Legal Name is required"),
    relationship: z.string().optional(),
    specificRelationship: z.string().optional(),
    gender: z.string().nonempty("Gender is required"),
    dob: z.date().optional(),
    guardianName: z.string().optional(),
    guardianMobile: z.string().optional(),
    guardianEmail: z.string().optional(),
    guardianCity: z.string().optional(),
    guardianState: z.string().optional(),
    guardianDocument: z.string().optional(),
    guardianDocumentData: z.string().optional(),
    guardianReligion: z.string().optional(),
    guardianNationality: z.string().optional(),
    guardianAddress1: z.string().optional(),
    guardianAddress2: z.string().optional(),
    guardianPincode: z.string().optional(),
    guardianCountry: z.string().optional(),
    mobile: z.string().optional(),
    email: z.string().optional(),
    documentData: z.string().optional(),
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
  const queryClient = useQueryClient();
  const [dummy, setdummy] = useState([]);
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
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

  const getPersonalData = async () => {
    if (!user) return;
    const response = await axios.get(`/api/beneficiaries/${benificiaryId}`, {
      headers: {
        Authorization: `Bearer ${user.data.token}`,
      },
    });

    return response.data.data.Beneficiary;
  };

  const {
    data: Benifyciary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["beneficiaryDataUpdate", benificiaryId],
    queryFn: getPersonalData,
    enabled: !!benificiaryId,

    onSuccess: (data) => {
      console.log("Data:", data);
      if (data.dob) {
        const age = calculateAge(data.dob);
        if (age >= 18) {
          clearGuardianFields();
        }
      }
      setdummy(data);
      setValue("dob", new Date(data.dob));
      setValue("gender", data.gender);
      setValue("relationship", data.relationship);
      setValue("specificRelationship", data.specificRelationship);
      setValue("mobile", data.mobile);
      setValue("email", data.email);
      setValue("documentData", data.documentData);
      setValue("houseNo", data.houseNo);
      setValue("addressLine1", data.addressLine1);
      setValue("addressLine2", data.addressLine2);
      setValue("pincode", data.pincode);
      setValue("country", data.country);
      setValue("city", data.city);
      setValue("state", data.state);
      setValue("religion", data.religion);
      setValue("nationality", data.nationality);
      setValue("fullLegalName", data.fullLegalName);
      // Prefill the form with the fetched data
      // for (const [key, value] of Object.entries(data)) {
      //   if (key === "dob") {
      //     setValue(key, new Date(value)); // Convert ISO string to Date object
      //   } else {
      //     setValue(key, value);
      //   }
      // }
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile", error.message);
    },
  });

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

  const clearGuardianFields = () => {};
  useEffect(() => {
    console.log("Beneficiary ID:", benificiaryId); // Add this line before useQuery to check the value of benificiaryId

    console.log(dummy);
  }, [dummy, benificiaryId]);

  const benificiaryMutate = useMutation({
    mutationFn: async (data) => {
      console.log("data:", data);
      const response = await axios.put(
        `/api/beneficiaries/${benificiaryId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      return response.data.data.Beneficiary;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["beneficiaryDataUpdate", benificiaryId]);
      toast.success("Beneficiary updated successfully!");
      setUpdateBenificiaryOpen(false);
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile ", error.message);
    },
  });

  const onSubmit = (data) => {
    data.type = "beneficiary";
    console.log(data);
    benificiaryMutate.mutate(data);
  };

  const isMinor = watchDOB
    ? calculateAge(watchDOB) < 18 || calculateAge(Benifyciary.dob) < 18
    : true;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading beneficiary data</div>;

  return (
    <div>
      <Sheet
        className="w-[800px]"
        open={updateBenificiaryOpen}
        onOpenChange={setUpdateBenificiaryOpen}
      >
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Update Beneficiary</SheetTitle>
            <SheetDescription className="flex flex-col justify-center">
              <ScrollArea className="w-full h-[85vh] rounded-md">
                <form onSubmit={handleSubmit(onSubmit)} className="scrollable">
                  <Card className="w-full max-w-3xl">
                    <CardHeader>
                      <CardTitle>Beneficiary Form</CardTitle>
                      <CardDescription>
                        Please update the necessary details.
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
                              defaultValue={Benifyciary.fullLegalName}
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
                              render={({ field }) => (
                                <Select
                                  value={field.value}
                                  defaultValue={Benifyciary.relationship}
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
                                id="specific-relationship"
                                defaultValue={Benifyciary.specificRelationship}
                                placeholder="Enter specific relationship"
                                {...register("specificRelationship")}
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
                              defaultValue={Benifyciary.gender}
                              render={({ field }) => (
                                <Select
                                  value={field.value}
                                  defaultValue={Benifyciary.gender}
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
                          <div className="space-y-2">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Controller
                              name="dob"
                              control={control}
                              render={({ field }) => (
                                <Datepicker
                                  selected={field.value}
                                  defaultValue={Benifyciary.dob}
                                  onChange={field.onChange}
                                  id="dob"
                                />
                              )}
                            />
                            {errors.dob && (
                              <p className="text-red-500">
                                {errors.dob.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="mobile">Mobile Number</Label>
                            <Controller
                              name="mobile"
                              control={control}
                              render={({ field }) => (
                                <PhoneInput
                                  international
                                  countryCallingCodeEditable={false}
                                  defaultCountry={dateCountryCode}
                                  value={field.value}
                                  defaultValue={Benifyciary.mobile}
                                  onChange={(value) => {
                                    field.onChange(value);
                                  }}
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
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              placeholder="Enter your email address"
                              {...register("email")}
                              defaultValue={Benifyciary.email}
                            />
                            {errors.email && (
                              <p className="text-red-500">
                                {errors.email.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="documentData">Document Data</Label>
                            <Input
                              id="documentData"
                              placeholder="Enter document data"
                              {...register("documentData")}
                              defaultValue={Benifyciary.documentData}
                            />
                            {errors.documentData && (
                              <p className="text-red-500">
                                {errors.documentData.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="houseNo">House Number</Label>
                            <Input
                              id="houseNo"
                              placeholder="Enter house number"
                              {...register("houseNo")}
                              defaultValue={Benifyciary.houseNo}
                            />
                            {errors.houseNo && (
                              <p className="text-red-500">
                                {errors.houseNo.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="address1">Address Line 1</Label>
                            <Input
                              id="address1"
                              placeholder="Enter address line 1"
                              {...register("addressLine1")}
                              defaultValue={Benifyciary.addressLine1}
                            />
                            {errors.addressLine1 && (
                              <p className="text-red-500">
                                {errors.addressLine1.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="address2">Address Line 2</Label>
                            <Input
                              id="address2"
                              placeholder="Enter address line 2"
                              defaultValue={Benifyciary.addressLine2}
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
                              defaultValue={Benifyciary.pincode}
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
                              defaultValue={Benifyciary.country}
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
                              defaultValue={Benifyciary.city}
                              {...register("city")}
                            />
                            {errors.city && (
                              <p className="text-red-500">
                                {errors.city.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input
                              id="state"
                              placeholder="Enter state"
                              defaultValue={Benifyciary.state}
                              {...register("state")}
                            />
                            {errors.state && (
                              <p className="text-red-500">
                                {errors.state.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="guardian-religion">Religion</Label>
                        <Input
                          id="guardian-religion"
                          defaultValue={Benifyciary.religion}
                          placeholder="Enter guardian's religion"
                          {...register("guardianReligion")}
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
                          defaultValue={Benifyciary.nationality}
                          placeholder="Enter guardian's nationality"
                          {...register("guardianNationality")}
                        />
                        {errors.guardianNationality && (
                          <p className="text-red-500">
                            {errors.guardianNationality.message}
                          </p>
                        )}
                      </div>
                      {isMinor ||
                        (calculateAge(Benifyciary.dob) < 18 && (
                          <div>
                            <h3 className="text-lg font-medium">
                              Guardian Details
                            </h3>
                            <div className="grid grid-cols-1 gap-6 mt-4">
                              <div className="space-y-2">
                                <Label htmlFor="guardian-name">
                                  Guardian's Full Name
                                </Label>
                                <Input
                                  id="guardian-name"
                                  placeholder="Enter guardian's full name"
                                  defaultValue={Benifyciary.guardianName}
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
                                  Guardian's Mobile Number
                                </Label>
                                <Controller
                                  name="guardianMobile"
                                  control={control}
                                  render={({ field }) => (
                                    <PhoneInput
                                      international
                                      countryCallingCodeEditable={false}
                                      defaultCountry="in"
                                      defaultValue={Benifyciary.guardianMobile}
                                      value={field.value}
                                      onChange={(value) => {
                                        field.onChange(value);
                                      }}
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
                                <Label htmlFor="guardian-email">
                                  Guardian's Email Address
                                </Label>
                                <Input
                                  id="guardian-email"
                                  placeholder="Enter guardian's email address"
                                  defaultValue={Benifyciary.guardianEmail}
                                  {...register("guardianEmail")}
                                />
                                {errors.guardianEmail && (
                                  <p className="text-red-500">
                                    {errors.guardianEmail.message}
                                  </p>
                                )}
                              </div>
                              {/* <div className="space-y-2">
                              <Label htmlFor="guardian-document">
                                Guardian's Document
                              </Label>
                              <Input
                                id="guardian-document"
                                defaultValue={Benifyciary.guardianDocument}
                                placeholder="Enter guardian's document"
                                {...register("guardianDocument")}
                              />
                              {errors.guardianDocument && (
                                <p className="text-red-500">
                                  {errors.guardianDocument.message}
                                </p>
                              )}
                            </div> */}
                              <div className="space-y-2">
                                <Label htmlFor="guardian-document-data">
                                  Guardian's Document Data
                                </Label>
                                <Input
                                  id="guardian-document-data"
                                  defaultValue={
                                    Benifyciary.guardianDocumentData
                                  }
                                  placeholder="Enter guardian's document data"
                                  {...register("guardianDocumentData")}
                                />
                                {errors.guardianDocumentData && (
                                  <p className="text-red-500">
                                    {errors.guardianDocumentData.message}
                                  </p>
                                )}
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="guardian-city">City</Label>
                                <Input
                                  id="guardian-city"
                                  defaultValue={Benifyciary.guardianCity}
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
                                <Label htmlFor="guardian-state">
                                  Guardian State
                                </Label>
                                <Input
                                  id="guardian-state"
                                  defaultValue={Benifyciary.state}
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
                        ))}
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

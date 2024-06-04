import React from "react";
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
import { Button } from "@com/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@com/ui/sheet";
import { ScrollArea } from "@com/ui/scroll-area";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

const beneficiarySchema = z.object({
  fullName: z.string().nonempty("Full Legal Name is required"),
  relationship: z.string().nonempty("Relationship is required"),
  gender: z.string().nonempty("Gender is required"),
  dob: z.string().nonempty("Date of Birth is required"),
  guardianName: z.string().nonempty("Guardian's Full Legal Name is required"),
  guardianMobile: z.string().regex(/^\d{10}$/, "Invalid Mobile Number"),
  guardianEmail: z.string().email("Invalid Email Address"),
  guardianCity: z.string().nonempty("Guardian's City is required"),
  guardianState: z.string().nonempty("Guardian's State is required"),
  guardianDocument: z.string().nonempty("Identification Document is required"),
  guardianReligion: z.string().nonempty("Religion is required"),
  guardianNationality: z.string().nonempty("Nationality is required"),
  guardianHouseNo: z.string().nonempty("House/Flat No. is required"),
  guardianAddress1: z.string().nonempty("Address Line 1 is required"),
  guardianAddress2: z.string().nonempty("Address Line 2 is required"),
  guardianPincode: z.string().regex(/^\d{6}$/, "Invalid Pincode"),
  guardianCountry: z.string().nonempty("Country is required"),
});

const Benificiaryform = ({ benficiaryopen, setbenficiaryopen }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(beneficiarySchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/api/beneficiary", data);
      if (response.status === 200) {
        alert("Beneficiary added successfully!");
        setbenficiaryopen(false);
      }
    } catch (error) {
      console.error("Error adding beneficiary:", error);
      alert("Failed to add beneficiary.");
    }
  };

  return (
    <div>
      <Sheet
        className="w-[800px]"
        open={benficiaryopen}
        onOpenChange={setbenficiaryopen}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add Beneficiary</SheetTitle>
            <SheetDescription className="flex flex-col justify-center">
              <form onSubmit={handleSubmit(onSubmit)} className="scrollable">
                <Card className="w-full max-w-3xl">
                  <CardHeader>
                    <CardTitle>Beneficiary Form</CardTitle>
                    <CardDescription>
                      Please fill out the following details.
                    </CardDescription>
                  </CardHeader>
                  <ScrollArea className="w-full h-[32rem] rounded-md">
                    <CardContent className="space-y-8">
                      <div>
                        <h3 className="text-lg font-medium">Basic Details</h3>
                        <div className="grid grid-cols-1 gap-6 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="full-name">Full Legal Name</Label>
                            <Input
                              id="full-name"
                              placeholder="Enter your full legal name"
                              {...register("fullName")}
                            />
                            {errors.fullName && (
                              <p className="text-red-500">
                                {errors.fullName.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="relationship">Relationship</Label>
                            <Select {...register("relationship")}>
                              <SelectTrigger
                                id="relationship"
                                aria-label="Relationship"
                              >
                                <SelectValue placeholder="Select relationship" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="self">Self</SelectItem>
                                <SelectItem value="spouse">Spouse</SelectItem>
                                <SelectItem value="child">Child</SelectItem>
                                <SelectItem value="parent">Parent</SelectItem>
                                <SelectItem value="sibling">Sibling</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.relationship && (
                              <p className="text-red-500">
                                {errors.relationship.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select {...register("gender")}>
                              <SelectTrigger id="gender" aria-label="Gender">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.gender && (
                              <p className="text-red-500">
                                {errors.gender.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Input id="dob" type="date" {...register("dob")} />
                            {errors.dob && (
                              <p className="text-red-500">
                                {errors.dob.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
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
                            <Input
                              id="guardian-mobile"
                              type="tel"
                              placeholder="Enter guardian's mobile number"
                              {...register("guardianMobile")}
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
                            />
                            {errors.guardianState && (
                              <p className="text-red-500">
                                {errors.guardianState.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="guardian-document">
                              Identification Document
                            </Label>
                            <Select {...register("guardianDocument")}>
                              <SelectTrigger
                                id="guardian-document"
                                aria-label="Identification Document"
                              >
                                <SelectValue placeholder="Select identification document" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="passport">
                                  Passport
                                </SelectItem>
                                <SelectItem value="driving-license">
                                  Driving License
                                </SelectItem>
                                <SelectItem value="national-id">
                                  National ID
                                </SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.guardianDocument && (
                              <p className="text-red-500">
                                {errors.guardianDocument.message}
                              </p>
                            )}
                          </div>
                          {passportopen && (
                            <div className="space-y-2">
                              <Label htmlFor="full-name">Full Legal Name</Label>
                              <Input
                                id="full-name"
                                placeholder="Enter your full legal name"
                                {...register("fullName")}
                              />
                              {errors.fullName && (
                                <p className="text-red-500">
                                  {errors.fullName.message}
                                </p>
                              )}
                            </div>
                          )}
                          <div className="space-y-2">
                            <Label htmlFor="guardian-religion">Religion</Label>
                            <Select {...register("guardianReligion")}>
                              <SelectTrigger
                                id="guardian-religion"
                                aria-label="Religion"
                              >
                                <SelectValue placeholder="Select religion" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="hinduism">
                                  Hinduism
                                </SelectItem>
                                <SelectItem value="islam">Islam</SelectItem>
                                <SelectItem value="christianity">
                                  Christianity
                                </SelectItem>
                                <SelectItem value="buddhism">
                                  Buddhism
                                </SelectItem>
                                <SelectItem value="sikhism">Sikhism</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
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
                            <Select {...register("guardianNationality")}>
                              <SelectTrigger
                                id="guardian-nationality"
                                aria-label="Nationality"
                              >
                                <SelectValue placeholder="Select nationality" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="indian">Indian</SelectItem>
                                <SelectItem value="american">
                                  American
                                </SelectItem>
                                <SelectItem value="british">British</SelectItem>
                                <SelectItem value="canadian">
                                  Canadian
                                </SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
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
                              {...register("guardianHouseNo")}
                            />
                            {errors.guardianHouseNo && (
                              <p className="text-red-500">
                                {errors.guardianHouseNo.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="guardian-address-1">
                              Address Line 1
                            </Label>
                            <Input
                              id="guardian-address-1"
                              placeholder="Enter address line 1"
                              {...register("guardianAddress1")}
                            />
                            {errors.guardianAddress1 && (
                              <p className="text-red-500">
                                {errors.guardianAddress1.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="guardian-address-2">
                              Address Line 2
                            </Label>
                            <Input
                              id="guardian-address-2"
                              placeholder="Enter address line 2"
                              {...register("guardianAddress2")}
                            />
                            {errors.guardianAddress2 && (
                              <p className="text-red-500">
                                {errors.guardianAddress2.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="guardian-pincode">Pincode</Label>
                            <Input
                              id="guardian-pincode"
                              type="number"
                              placeholder="Enter pincode"
                              {...register("guardianPincode")}
                            />
                            {errors.guardianPincode && (
                              <p className="text-red-500">
                                {errors.guardianPincode.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="guardian-city">City</Label>
                            <Input
                              id="guardian-city"
                              placeholder="Enter city"
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
                              placeholder="Enter state"
                              {...register("guardianState")}
                            />
                            {errors.guardianState && (
                              <p className="text-red-500">
                                {errors.guardianState.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="guardian-country">Country</Label>
                            <Input
                              id="guardian-country"
                              placeholder="Enter country"
                              {...register("guardianCountry")}
                            />
                            {errors.guardianCountry && (
                              <p className="text-red-500">
                                {errors.guardianCountry.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </ScrollArea>
                  <CardFooter className="flex items-center ">
                    <Button type="submit" className="ml-auto">
                      Submit
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Benificiaryform;

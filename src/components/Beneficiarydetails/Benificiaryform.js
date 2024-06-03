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

const Benificiaryform = ({ benficiaryopen, setbenficiaryopen }) => {
  return (
    <div>
      <Sheet
        className="w-[800px]"
        open={benficiaryopen}
        onOpenChange={setbenficiaryopen}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add Benificiary</SheetTitle>
            <SheetDescription className="flex flex-col justify-center ">
              <Card className="w-full max-w-3xl">
                <CardHeader>
                  <CardTitle>Benificiary Form</CardTitle>
                  <CardDescription>
                    Please fill out the following details.
                  </CardDescription>
                </CardHeader>
                <ScrollArea className="w-full h-[44rem] rounded-md ">
                  <CardContent className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium">Basic Details</h3>
                      <div className="grid grid-cols-1 gap-6 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="full-name">Full Legal Name</Label>
                          <Input
                            id="full-name"
                            placeholder="Enter your full legal name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="relationship">Relationship</Label>
                          <Select>
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
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <Select>
                            <SelectTrigger id="gender" aria-label="Gender">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dob">Date of Birth</Label>
                          <Input id="dob" type="date" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Guardian Details</h3>
                      <div className="grid grid-cols-1 gap-6 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="guardian-name">Full Legal Name</Label>
                          <Input
                            id="guardian-name"
                            placeholder="Enter guardian's full legal name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guardian-mobile">Mobile Number</Label>
                          <Input
                            id="guardian-mobile"
                            type="tel"
                            placeholder="Enter guardian's mobile number"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guardian-email">Email</Label>
                          <Input
                            id="guardian-email"
                            type="email"
                            placeholder="Enter guardian's email"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guardian-city">City</Label>
                          <Input
                            id="guardian-city"
                            placeholder="Enter guardian's city"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guardian-state">State</Label>
                          <Input
                            id="guardian-state"
                            placeholder="Enter guardian's state"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guardian-document">
                            Identification Document
                          </Label>
                          <Select>
                            <SelectTrigger
                              id="guardian-document"
                              aria-label="Identification Document"
                            >
                              <SelectValue placeholder="Select identification document" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="passport">Passport</SelectItem>
                              <SelectItem value="driving-license">
                                Driving License
                              </SelectItem>
                              <SelectItem value="national-id">
                                National ID
                              </SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guardian-religion">Religion</Label>
                          <Select>
                            <SelectTrigger
                              id="guardian-religion"
                              aria-label="Religion"
                            >
                              <SelectValue placeholder="Select religion" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hinduism">Hinduism</SelectItem>
                              <SelectItem value="islam">Islam</SelectItem>
                              <SelectItem value="christianity">
                                Christianity
                              </SelectItem>
                              <SelectItem value="buddhism">Buddhism</SelectItem>
                              <SelectItem value="sikhism">Sikhism</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guardian-nationality">
                            Nationality
                          </Label>
                          <Select>
                            <SelectTrigger
                              id="guardian-nationality"
                              aria-label="Nationality"
                            >
                              <SelectValue placeholder="Select nationality" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="indian">Indian</SelectItem>
                              <SelectItem value="american">American</SelectItem>
                              <SelectItem value="british">British</SelectItem>
                              <SelectItem value="canadian">Canadian</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guardian-house-no">
                            House/Flat No.
                          </Label>
                          <Input
                            id="guardian-house-no"
                            placeholder="Enter house/flat number"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guardian-address-1">
                            Address Line 1
                          </Label>
                          <Input
                            id="guardian-address-1"
                            placeholder="Enter address line 1"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guardian-address-2">
                            Address Line 2
                          </Label>
                          <Input
                            id="guardian-address-2"
                            placeholder="Enter address line 2"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guardian-pincode">Pincode</Label>
                          <Input
                            id="guardian-pincode"
                            type="number"
                            placeholder="Enter pincode"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guardian-city">City</Label>
                          <Input id="guardian-city" placeholder="Enter city" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guardian-state">State</Label>
                          <Input
                            id="guardian-state"
                            placeholder="Enter state"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guardian-country">Country</Label>
                          <Input
                            id="guardian-country"
                            placeholder="Enter country"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </ScrollArea>
                <CardFooter>
                  <Button className="ml-auto">Submit</Button>
                </CardFooter>
              </Card>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Benificiaryform;

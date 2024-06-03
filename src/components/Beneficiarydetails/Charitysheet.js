import React from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@com/ui/sheet";
import { Button } from "@com/ui/button";
import { Label } from "@com/ui/label";
import { Input } from "@com/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@com/ui/select";
import { Textarea } from "@com/ui/textarea";
import { ScrollArea } from "@com/ui/scroll-area";

const Charitysheet = ({ charityopen, setcharityopen }) => {
  return (
    <Sheet open={charityopen} onOpenChange={setcharityopen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Charity</SheetTitle>
          <SheetDescription className="text-gray-500 dark:text-gray-400">
            Fill Out Details for Charity
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="w-full h-[44rem] rounded-md ">
          <div className="grid gap-6 py-6 p-2 mr-2">
            <div className="space-y-2">
              <Label htmlFor="org-name" className="text-base font-medium">
                Name of Charitable Organization
              </Label>
              <Input
                id="org-name"
                placeholder="Enter organization name"
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address-1" className="text-base font-medium">
                Address 1
              </Label>
              <Input
                id="address-1"
                placeholder="Enter address"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address-2" className="text-base font-medium">
                Address 2
              </Label>
              <Input
                id="address-2"
                placeholder="Enter address"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className="text-base font-medium">
                City
              </Label>
              <Input
                id="city"
                placeholder="Enter city"
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-base font-medium">
                State
              </Label>
              <Select id="state" className="w-full">
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ca">California</SelectItem>
                  <SelectItem value="ny">New York</SelectItem>
                  <SelectItem value="tx">Texas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-base font-medium">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-name" className="text-base font-medium">
                Contact Person
              </Label>
              <Input
                id="contact-name"
                placeholder="Enter full legal name"
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website" className="text-base font-medium">
                Website
              </Label>
              <Input
                id="website"
                type="url"
                placeholder="Enter website"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructions" className="text-base font-medium">
                Specific Instructions
              </Label>
              <Textarea
                id="instructions"
                placeholder="Enter any specific instructions"
                className="w-full"
              />
            </div>
          </div>
        </ScrollArea>
        <SheetFooter className="flex justify-end gap-2">
          <Button type="submit" className="w-full sm:w-auto">
            Save And Continue
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Charitysheet;

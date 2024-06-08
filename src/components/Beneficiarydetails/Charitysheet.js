import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import axios from "axios";
import "react-international-phone/style.css";
import { PhoneInput } from "react-international-phone";
import { toast } from "sonner";

const charitySchema = z.object({
  charityName: z.string().nonempty("Organization name is required"),
  charityAddress1: z.string().nonempty("Address 1 is required"),
  charityAddress2: z.string().optional(),
  charityCity: z.string().nonempty("City is required"),
  charityState: z.string().nonempty("State is required"),
  charityNumber: z.string().optional(),
  charityEmail: z.string().email("Invalid charityEmail address"),
  contactName: z.string().nonempty("Contact person name is required"),
  charityWebsite: z.string().url("Invalid URL").optional(),
  charitySpecificInstruction: z.string().optional(),
});

const Charitysheet = ({ charityopen, setcharityopen }) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(charitySchema),
  });
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);

  const charityMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/beneficiaries`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      return response.data.data.Benificiary;
    },
    onSuccess: () => {
      setcharityopen(false);
      queryClient.invalidateQueries("charityData");
      toast.success("Beneficiary added successfully!");
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile");
    },
  });

  const onSubmit = async (data) => {
    try {
      data.type = "charity";
      charityMutate.mutate(data);
    } catch (error) {
      console.error("Error submitting charity details:", error);
      toast.error("Failed to submit charity details.");
    }
  };

  return (
    <Sheet open={charityopen} onOpenChange={setcharityopen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Charity</SheetTitle>
          <SheetDescription className="text-gray-500 dark:text-gray-400">
            Fill Out Details for Charity
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="w-full h-[76vh] rounded-md">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-6 py-6 p-6 mr-2"
          >
            <div className="space-y-2 p-2">
              <Label htmlFor="org-name" className="text-base font-medium">
                Name of Charitable Organization
              </Label>
              <Input
                id="org-name"
                placeholder="Enter organization name"
                {...register("charityName")}
                className="w-full"
              />
              {errors.charityName && (
                <p className="text-red-500">{errors.charityName.message}</p>
              )}
            </div>
            <div className="space-y-2 p-2">
              <Label htmlFor="address-1" className="text-base font-medium">
                Address 1
              </Label>
              <Input
                id="address-1"
                placeholder="Enter address"
                {...register("charityAddress1")}
                className="w-full"
              />
              {errors.charityAddress1 && (
                <p className="text-red-500">{errors.charityAddress1.message}</p>
              )}
            </div>
            <div className="space-y-2 p-2">
              <Label htmlFor="address-2" className="text-base font-medium">
                Address 2
              </Label>
              <Input
                id="address-2"
                placeholder="Enter address"
                {...register("charityAddress2")}
                className="w-full"
              />
            </div>
            <div className="space-y-2 p-2">
              <Label htmlFor="charityCity" className="text-base font-medium">
                City
              </Label>
              <Input
                id="charityCity"
                placeholder="Enter charityCity"
                {...register("charityCity")}
                className="w-full"
              />
              {errors.charityCity && (
                <p className="text-red-500">{errors.charityCity.message}</p>
              )}
            </div>
            <div className="space-y-2 p-2">
              <Label htmlFor="charityState" className="text-base font-medium">
                State
              </Label>
              <Controller
                name="charityState"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select charityState" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ca">California</SelectItem>
                      <SelectItem value="ny">New York</SelectItem>
                      <SelectItem value="tx">Texas</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.charityState && (
                <p className="text-red-500">{errors.charityState.message}</p>
              )}
            </div>
            <div className="space-y-2 p-2">
              <Label htmlFor="charityNumber" className="text-base font-medium">
                Phone Number
              </Label>
              <PhoneInput
                id="charityNumber"
                type="tel"
                defaultCountry="in"
                placeholder="Enter charityNumber number"
                {...register("charityNumber")}
                className="w-full"
              />
              {errors.charityNumber && (
                <p className="text-red-500">{errors.charityNumber.message}</p>
              )}
            </div>
            <div className="space-y-2 p-2">
              <Label htmlFor="charityEmail" className="text-base font-medium">
                Email
              </Label>
              <Input
                id="charityEmail"
                type="charityEmail"
                placeholder="Enter charityEmail"
                {...register("charityEmail")}
                className="w-full"
              />
              {errors.charityEmail && (
                <p className="text-red-500">{errors.charityEmail.message}</p>
              )}
            </div>
            <div className="space-y-2 p-2">
              <Label htmlFor="contact-name" className="text-base font-medium">
                Contact Person
              </Label>
              <Input
                id="contact-name"
                placeholder="Enter full legal name"
                {...register("contactName")}
                className="w-full"
              />
              {errors.contactName && (
                <p className="text-red-500">{errors.contactName.message}</p>
              )}
            </div>
            <div className="space-y-2 p-2">
              <Label htmlFor="charityWebsite" className="text-base font-medium">
                Website
              </Label>
              <Input
                id="charityWebsite"
                type="url"
                placeholder="Enter charityWebsite"
                {...register("charityWebsite")}
                className="w-full"
              />
              {errors.charityWebsite && (
                <p className="text-red-500">{errors.charityWebsite.message}</p>
              )}
            </div>
            <div className="space-y-2 p-2">
              <Label
                htmlFor="charitySpecificInstruction"
                className="text-base font-medium"
              >
                Specific Instructions
              </Label>
              <Textarea
                id="charitySpecificInstruction"
                placeholder="Enter any specific charitySpecificInstruction"
                {...register("charitySpecificInstruction")}
                className="w-full"
              />
            </div>

            <SheetFooter className="flex justify-end gap-2">
              <Button type="submit" className="w-full sm:w-auto">
                Save And Continue
              </Button>
            </SheetFooter>
          </form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default Charitysheet;

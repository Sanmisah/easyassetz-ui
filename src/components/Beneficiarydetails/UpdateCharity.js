import React, { useEffect } from "react";
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
import axios from "axios";
import "react-international-phone/style.css";
import { PhoneInput } from "react-international-phone";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const charitySchema = z.object({
  orgName: z.string().nonempty("Organization name is required"),
  address1: z.string().nonempty("Address 1 is required"),
  address2: z.string().optional(),
  city: z.string().nonempty("City is required"),
  state: z.string().nonempty("State is required"),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .nonempty("Phone number is required"),
  email: z.string().email("Invalid email address"),
  contactName: z.string().nonempty("Contact person name is required"),
  website: z.string().url("Invalid URL").optional(),
  instructions: z.string().optional(),
});

const Charitysheet = ({ charityopen, setcharityopen, charityId }) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(charitySchema),
  });

  const {
    data: charityData,
    isLoading,
    isError,
  } = useQuery(
    ["charity", charityId],
    async () => {
      const { data } = await axios.get(`/api/charity/${charityId}`);
      return data;
    },
    {
      enabled: !!charityId,
      onSuccess: (data) => {
        // Prefill the form with the fetched data
        for (const [key, value] of Object.entries(data)) {
          setValue(key, value);
        }
      },
    }
  );

  const mutation = useMutation(
    async (data) => {
      const response = await axios.put(`/api/charity/${charityId}`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["charity", charityId]);
        alert("Charity details updated successfully!");
        setcharityopen(false);
      },
      onError: (error) => {
        console.error("Error updating charity details:", error);
        alert("Failed to update charity details.");
      },
    }
  );

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading charity data</div>;

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
                {...register("orgName")}
                className="w-full"
              />
              {errors.orgName && (
                <p className="text-red-500">{errors.orgName.message}</p>
              )}
            </div>
            <div className="space-y-2 p-2">
              <Label htmlFor="address-1" className="text-base font-medium">
                Address 1
              </Label>
              <Input
                id="address-1"
                placeholder="Enter address"
                {...register("address1")}
                className="w-full"
              />
              {errors.address1 && (
                <p className="text-red-500">{errors.address1.message}</p>
              )}
            </div>
            <div className="space-y-2 p-2">
              <Label htmlFor="address-2" className="text-base font-medium">
                Address 2
              </Label>
              <Input
                id="address-2"
                placeholder="Enter address"
                {...register("address2")}
                className="w-full"
              />
            </div>
            <div className="space-y-2 p-2">
              <Label htmlFor="city" className="text-base font-medium">
                City
              </Label>
              <Input
                id="city"
                placeholder="Enter city"
                {...register("city")}
                className="w-full"
              />
              {errors.city && (
                <p className="text-red-500">{errors.city.message}</p>
              )}
            </div>
            <div className="space-y-2 p-2">
              <Label htmlFor="state" className="text-base font-medium">
                State
              </Label>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ca">California</SelectItem>
                      <SelectItem value="ny">New York</SelectItem>
                      <SelectItem value="tx">Texas</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.state && (
                <p className="text-red-500">{errors.state.message}</p>
              )}
            </div>
            <div className="space-y-2 p-2">
              <Label htmlFor="phone" className="text-base font-medium">
                Phone Number
              </Label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    id="phone"
                    international
                    countryCallingCodeEditable={false}
                    defaultCountry="US"
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full"
                  />
                )}
              />
              {errors.phone && (
                <p className="text-red-500">{errors.phone.message}</p>
              )}
            </div>
            <div className="space-y-2 p-2">
              <Label htmlFor="email" className="text-base font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email"
                {...register("email")}
                className="w-full"
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
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
              <Label htmlFor="website" className="text-base font-medium">
                Website
              </Label>
              <Input
                id="website"
                type="url"
                placeholder="Enter website"
                {...register("website")}
                className="w-full"
              />
              {errors.website && (
                <p className="text-red-500">{errors.website.message}</p>
              )}
            </div>
            <div className="space-y-2 p-2">
              <Label htmlFor="instructions" className="text-base font-medium">
                Specific Instructions
              </Label>
              <Textarea
                id="instructions"
                placeholder="Enter any specific instructions"
                {...register("instructions")}
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

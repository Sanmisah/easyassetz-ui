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
import { toast } from "sonner";

const charitySchema = z.object({
  charityName: z.string().nonempty("Organization name is required"),
  charityAddress1: z.string().nonempty("Address 1 is required"),
  charityAddress2: z.string().optional(),
  charityCity: z.string().nonempty("City is required"),
  charityState: z.string().nonempty("State is required"),
  charityNumber: z.string().optional(),
  charityEmail: z.string().email("Invalid charityEmail address"),
  charityContactPerson: z.string().nonempty("Contact person name is required"),
  charityWebsite: z.string().url("Invalid URL").optional(),
  charitySpecificInstrucion: z.string().optional(),
});

const Charitysheet = ({ charityopen, setcharityopen, charityId }) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(charitySchema),
  });
  const queryClient = useQueryClient();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);

  const getPersonalData = async () => {
    if (!user) return;
    const response = await axios.get(
      `http://127.0.0.1:8000/api/beneficiaries/${charityId}`,
      {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      }
    );

    return response.data.data.Beneficiary;
  };

  const {
    data: Charitydata,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["charityData", charityId],
    queryFn: getPersonalData,
    enabled: !!charityId,

    onSuccess: (data) => {
      queryClient.invalidateQueries(["charityData", charityId]);
      console.log("Data:", data);
      if (data.dob) {
        const age = calculateAge(data.dob);
        if (age >= 18) {
          clearGuardianFields();
        }
      }

      for (const [key, value] of Object.entries(data)) {
        setValue(key, value);
      }
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile", error.message);
    },
  });

  const benificiaryMutate = useMutation({
    mutationFn: async (data) => {
      console.log("data:", data);
      const response = await axios.put(
        `http://127.0.0.1:8000/api/beneficiaries/${charityId}`,
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
      toast.success("Charity details updated successfully!");
      setcharityopen(false);
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile ", error.message);
    },
  });

  const onSubmit = (data) => {
    data.type = "charity";
    benificiaryMutate.mutate(data);
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
                {...register("charityName")}
                defaultValue={Charitydata?.charityName}
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
                defaultValue={Charitydata?.charityAddress1}
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
                defaultValue={Charitydata?.charityAddress2}
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
                defaultValue={Charitydata?.charityCity}
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
                defaultValue={Charitydata?.charityState}
                render={({ field }) => (
                  <Select
                    {...field}
                    defaultValue={Charitydata?.charityState}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
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
              <Controller
                name="charityNumber"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    id="charityNumber"
                    international
                    countryCallingCodeEditable={false}
                    defaultCountry="in"
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full"
                  />
                )}
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
                defaultValue={Charitydata?.charityEmail}
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
                defaultValue={Charitydata?.charityContactPerson}
                {...register("charityContactPerson")}
                className="w-full"
              />
              {errors.charityContactPerson && (
                <p className="text-red-500">
                  {errors.charityContactPerson.message}
                </p>
              )}
            </div>
            <div className="space-y-2 p-2">
              <Label
                htmlFor="charitycontactperson"
                className="text-base font-medium"
              >
                Website
              </Label>
              <Input
                id="charitycontactperson"
                type="url"
                placeholder="Enter charityWebsite"
                defaultValue={Charitydata?.charityWebsite}
                {...register("charityWebsite")}
                className="w-full"
              />
              {errors.charityWebsite && (
                <p className="text-red-500">{errors.charityWebsite.message}</p>
              )}
            </div>
            <div className="space-y-2 p-2">
              <Label
                htmlFor="charityspecificInstrucion"
                className="text-base font-medium"
              >
                Specific Instructions
              </Label>
              <Textarea
                id="charityspecificInstrucion"
                placeholder="Enter any specific charityspecificInstrucion"
                defaultValue={Charitydata?.charitySpecificInstrucion}
                {...register("charitySpecificInstrucion")}
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

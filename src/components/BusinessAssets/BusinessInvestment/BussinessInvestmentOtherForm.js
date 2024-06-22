import React, { useState, forwardRef, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@com/ui/card";
import { Label } from "@com/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@com/ui/select";
import { Button } from "@com/ui/button";
import { Input } from "@com/ui/input";
import { Textarea } from "@com/ui/textarea";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { PhoneInput } from "react-international-phone";

const schema = z.object({
  businessInvestments: z
    .string()
    .nonempty({ message: "Business Investment is required" }),
  propritorship: z.string().nonempty({ message: "Propritorship is required" }),
  firmName: z.string().min(2, { message: "Firm Name is required" }),
  registeredAddress: z
    .string()
    .nonempty({ message: "Registered Address is required" }),
  firmsRegistrationNumber: z
    .string()
    .min(3, { message: "Firm's Registration number is required" })
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .transform((value) => (value === null ? null : Number(value))),
  additionalInformation: z
    .string()
    .min(3, { message: "Additional Information is required" })
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .transform((value) => (value === null ? null : Number(value))),
});

const FocusableSelectTrigger = forwardRef((props, ref) => (
  <SelectTrigger ref={ref} {...props} />
));

FocusableSelectTrigger.displayName = "FocusableSelectTrigger";

const BullionForm = () => {
  const navigate = useNavigate();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const queryClient = useQueryClient();
  const [showOtherBusinessInvestments, setShowOtherBusinessInvestments] =
    useState(false);
  const [showOtherArticleDetails, setShowOtherArticleDetails] = useState(false);
  const [
    showOtherFirmsRegistrationNumber,
    setShowOtherFirmsRegistrationNumber,
  ] = useState(false);
  const [selectedNommie, setSelectedNommie] = useState([]);
  const [nomineeerror, setNomineeError] = useState(false);
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      businessInvestments: "",
      propritorship: "",
      firmName: "",
      registeredAddress: "",
      firmsRegistrationNumber: "",
      additionalInformation: "",
    },
  });

  const lifeInsuranceMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(`/api/bullions`, data, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });

      return response.data.data.BusinessInvestment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("LifeInsuranceData");
      toast.success("Other Insurance added successfully!");
      navigate("/otherinsurance");
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile");
    },
  });

  useEffect(() => {
    if (selectedNommie.length > 0) {
      setNomineeError(false);
    }
  }, [selectedNommie]);

  const onSubmit = (data) => {
    lifeInsuranceMutate.mutate(data);
  };

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-2xl font-bold">
                Business Assets
              </CardTitle>
              <CardDescription>
                Fill out the form to add a new Business Assets.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <form
            className="space-y-6 flex flex-col"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessInvestments">
                  Business Investments
                </Label>
                <Controller
                  name="businessInvestments"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="businessInvestments"
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherBusinessInvestments(value === "other");
                      }}
                      className={
                        errors.businessInvestments ? "border-red-500" : ""
                      }
                    >
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select Business Investments" />
                      </FocusableSelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Individual</SelectItem>
                        <SelectItem value="2">Proprietorship</SelectItem>
                        <SelectItem value="3">Private Ltd.</SelectItem>
                        <SelectItem value="4">LLP</SelectItem>
                        <SelectItem value="5">Partnership</SelectItem>
                        <SelectItem value="6">LLP</SelectItem>
                        <SelectItem value="7">JV</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {showOtherBusinessInvestments && (
                  <Controller
                    name="otherBusinessInvestments"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Business Investments"
                        className="mt-2"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    )}
                  />
                )}
                {errors.businessInvestments && (
                  <span className="text-red-500">
                    {errors.businessInvestments.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="propritorship">Propritorship</Label>
                <Controller
                  name="propritorship"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="propritorship"
                      placeholder="Enter Propritorship"
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                      className={errors.propritorship ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.propritorship && (
                  <span className="text-red-500">
                    {errors.propritorship.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="registeredAddress"> Registered address </Label>
                <Controller
                  name="registeredAddress"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="registeredAddress"
                      placeholder="Enter Registered address"
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                      className={
                        errors.registeredAddress ? "border-red-500" : ""
                      }
                    />
                  )}
                />
                {errors.registeredAddress && (
                  <span className="text-red-500">
                    {errors.registeredAddress.message}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firmsRegistrationNumber">
                    {" "}
                    Firm's Registration Number
                  </Label>
                  <Controller
                    name="firmsRegistrationNumber"
                    control={control}
                    render={({ field }) => (
                      <Select
                        id="firmsRegistrationNumber"
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          setShowOtherFirmsRegistrationNumber(
                            value === "other"
                          );
                        }}
                        className={
                          errors.firmsRegistrationNumber ? "border-red-500" : ""
                        }
                      >
                        <FocusableSelectTrigger>
                          <SelectValue placeholder="Select Firm's Registration Number" />
                        </FocusableSelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">CIN</SelectItem>
                          <SelectItem value="2">PAN</SelectItem>
                          <SelectItem value="3">FIRM NO</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {showOtherFirmsRegistrationNumber && (
                    <Controller
                      name="otherFirmsRegistrationNumber"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Specify Firm's Registration Number"
                          className="mt-2"
                          value={field.value || ""}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  )}
                  {errors.firmsRegistrationNumber && (
                    <span className="text-red-500">
                      {errors.firmsRegistrationNumber.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="additionalInformation">
                  Additional Information
                </Label>
                <Controller
                  name="additionalInformation"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="additionalInformation"
                      placeholder="Enter Additional Information"
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                      className={
                        errors.additionalInformation ? "border-red-500" : ""
                      }
                    />
                  )}
                />
                {errors.additionalInformation && (
                  <span className="text-red-500">
                    {errors.additionalInformation.message}
                  </span>
                )}
              </div>
            </div>
            <div className="w-full grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="additionalInformation">Point Of Contact</Label>
                <div className="mt-2  flex item-center  gap-2 justify-between">
                  <div className="w-[40%] space-y-2 item-center">
                    <Label htmlFor="name">Name</Label>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="name"
                          placeholder="Enter Name"
                          {...field}
                          value={field.value || ""}
                          onChange={field.onChange}
                          className={errors.name ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.name && (
                      <span className="text-red-500">
                        {errors.name.message}
                      </span>
                    )}
                  </div>
                  <div className="w-[40%] space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="email"
                          placeholder="Enter Email"
                          {...field}
                          value={field.value || ""}
                          onChange={field.onChange}
                          className={errors.email ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.email && (
                      <span className="text-red-500">
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                  <div className="w-[40%] space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <PhoneInput
                          id="mobile"
                          type="tel"
                          placeholder="Enter mobile number"
                          defaultCountry="in"
                          inputStyle={{ minWidth: "15.5rem" }}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    {errors.phone && (
                      <span className="text-red-500">
                        {errors.phone.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <CardFooter className="flex justify-end gap-2 mt-8">
              <Button type="submit">Submit</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BullionForm;

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
  digitalAsset: z.any().optional(),
  otherDigitalAsset: z.any().optional(),
  account: z.string().nonempty({ message: "Account is required" }),
  linkedMobileNumber: z
    .string()
    .min(2, { message: "Mobile Number is required" }),
  description: z.any().optional(),
  additionalInformation: z.any().optional(),
  name: z.any().optional(),
  email: z.any().optional(),
  phone: z.any().optional(),
});

const FocusableSelectTrigger = forwardRef((props, ref) => (
  <SelectTrigger ref={ref} {...props} />
));

FocusableSelectTrigger.displayName = "FocusableSelectTrigger";

const DigitalAssetOtherForm = () => {
  const navigate = useNavigate();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const queryClient = useQueryClient();
  const [showOtherdigitalAssets, setShowOtherdigitalAssets] = useState(false);
  const [showOtherArticleDetails, setShowOtherArticleDetails] = useState(false);
  const [selectedNommie, setSelectedNommie] = useState([]);
  const [nomineeerror, setNomineeError] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      digitalAsset: "",
      linkedMobileNumber: "",
      description: "",
      additionalInformation: "",
      name: "",
      email: "",
      phone: "",
    },
  });

  const lifeInsuranceMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(`/api/digital-assets`, data, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });

      return response.data.data.DigitalAsset;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("LifeInsuranceData");
      toast.success("Digital Assets added successfully!");
      navigate("/dashboard");
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
    if (data.digitalAsset === "other") {
      data.digitalAsset = data.otherDigitalAsset;
    }
    lifeInsuranceMutate.mutate(data);
  };

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button onClick={() => navigate("/digitalassets")}>Back</Button>
              <div>
                <CardTitle className="text-2xl font-bold">
                  Digital Assets
                </CardTitle>
                <CardDescription>
                  Fill out the form to add a new Digital Assets.
                </CardDescription>
              </div>
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
                <Label htmlFor="digitalAsset">Digital Assets</Label>
                <Controller
                  name="digitalAsset"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="digitalAsset"
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherdigitalAssets(value === "other");
                      }}
                      className={errors.digitalAsset ? "border-red-500" : ""}
                    >
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select Digital Assets" />
                      </FocusableSelectTrigger>
                      <SelectContent>
                        <SelectItem value="socialMedia">
                          Social Media
                        </SelectItem>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {showOtherdigitalAssets && (
                  <Controller
                    name="otherDigitalAsset"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Digital Assets"
                        className="mt-2"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    )}
                  />
                )}
                {errors.digitalAsset && (
                  <span className="text-red-500">
                    {errors.digitalAsset.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="account">Account/ID</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="account"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="account"
                      placeholder="Enter Account/ID"
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                      className={errors.account ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.account && (
                  <span className="text-red-500">{errors.account.message}</span>
                )}
              </div>
              <div className="space-y-2  ">
                <Label htmlFor="linkedMobileNumber"> Mobile Number</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="linkedMobileNumber"
                  control={control}
                  render={({ field }) => (
                    <PhoneInput
                      inputStyle={{ minWidth: "22rem" }}
                      id="linkedMobileNumber"
                      type="tel"
                      placeholder="Enter Linked Mobile Number"
                      defaultCountry="in"
                      value={field.value || ""}
                      onChange={field.onChange}
                      className={
                        errors.linkedMobileNumber ? "border-red-500" : ""
                      }
                    />
                  )}
                />
                {errors.linkedMobileNumber && (
                  <span className="text-red-500">
                    {errors.linkedMobileNumber.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="description"
                      placeholder="Enter Description"
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                      className={errors.description ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.description && (
                  <span className="text-red-500">
                    {errors.description.message}
                  </span>
                )}
              </div>

              <div className="space-y-2 col-span-full">
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
                        errors.additionalInformation
                          ? "border-red-500 w-full"
                          : "w-full"
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
              <div className="w-full grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label className="text-lg font-bold mt-4 mb-4 ">
                    Point Of Contact
                  </Label>
                  <div className="w-full grid grid-cols-1 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="name"
                            placeholder="Enter Name"
                            {...field}
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
                    <div className="w-[80%] space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="email"
                            placeholder="Enter Email"
                            {...field}
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
                        name="mobile"
                        control={control}
                        render={({ field }) => (
                          <PhoneInput
                            id="mobile"
                            type="tel"
                            placeholder="Enter mobile number"
                            defaultCountry="in"
                            inputStyle={{ minWidth: "15.5rem" }}
                            value={field.value || ""}
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
            </div>
            <CardFooter className="flex justify-end gap-2 mt-8">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.history.back();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DigitalAssetOtherForm;

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
import Addnominee from "@/components/Nominee/addNominee";
import cross from "@/components/image/close.png";

const schema = z.object({
  firmName: z.string().nonempty({ message: "Firm Name is required" }),
  registeredAddress: z
    .string()
    .nonempty({ message: "Registration Address is required" }),

  firmsRegistrationNumber: z
    .string()
    .min(2, { message: "  Registration Number is required" }),
  otherRegistrationNumber: z.string().optional(),
  holdingPercentage: z
    .string()
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .refine((value) => value === null || !isNaN(Number(value)), {
      message: "Sum Insured must be a number",
    })
    .transform((value) => (value === null ? null : Number(value))),
  additionalInformation: z
    .string()
    .min(3, { message: "Additional Information is required" }),
  name: z.string().nonempty({ message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  mobile: z.string().nonempty({ message: "Mobile is required" }),
});

const FocusableSelectTrigger = forwardRef((props, ref) => (
  <SelectTrigger ref={ref} {...props} />
));

FocusableSelectTrigger.displayName = "FocusableSelectTrigger";

const PropritershipForm = () => {
  const navigate = useNavigate();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const queryClient = useQueryClient();
  const [showOtherMetalType, setShowOtherMetalType] = useState(false);
  const [showOtherArticleDetails, setShowOtherArticleDetails] = useState(false);
  const [selectedNommie, setSelectedNommie] = useState([]);
  const [nomineeerror, setNomineeError] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [displaynominie, setDisplaynominie] = useState([]);

  const [showOtherRegistrationNumber, setShowOtherRegistrationNumber] =
    useState(false);
  const [otherFirmRegistrationNumber, setOtherFirmRegistrationNumber] =
    useState("");
  const [otherFirmName, setOtherFirmName] = useState("");
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firmName: "",
      registeredAddress: "",
      firmsRegistrationNumber: "",
      additionalInformation: "",
      name: "",
      email: "",
      phone: "",
    },
  });

  const lifeInsuranceMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(`/api/business-assets`, data, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });

      return response.data.data.PartnershipFirm;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("LifeInsuranceData");
      toast.success("Partnership added successfully!");
      navigate("/partnershipfirm");
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
    data.firmsRegistrationNumberType = showOtherRegistrationNumber;
    data.firmsRegistrationNumber = data.otherRegistrationNumber;

    if (selectedNommie.length > 0) {
      data.nominees = selectedNommie;
    }

    data.type = "partnershipFirm";
    console.log(data.name, name);
    // data.name = name;
    // data.email = email;
    // data.mobile = phone;

    lifeInsuranceMutate.mutate(data);
  };

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-2xl font-bold">
                Partnership Firm Details
              </CardTitle>
              <CardDescription>
                Fill out the form to add a new Partnership Firm.
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
                <Label htmlFor="firmName">Firm Name</Label>
                <Controller
                  name="firmName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="firmName"
                      placeholder="Enter Firm Name"
                      {...field}
                      className={errors.firmName ? "border-red-500" : ""}
                    />
                  )}
                />
                {showOtherMetalType && (
                  <Controller
                    name="otherMetalType"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Metal Type"
                        className="mt-2"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    )}
                  />
                )}
                {errors.firmName && (
                  <span className="text-red-500">
                    {errors.firmName.message}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="registeredAddress">Regitration Address </Label>
              <Controller
                name="registeredAddress"
                control={control}
                render={({ field }) => (
                  <Input
                    id="registeredAddress"
                    placeholder="Enter Address"
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className={errors.registeredAddress ? "border-red-500" : ""}
                  />
                )}
              />
              {showOtherArticleDetails && (
                <Controller
                  name="otherRegistrationAddress"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Specify Registration Address"
                      className="mt-2"
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  )}
                />
              )}
              {errors.registeredAddress && (
                <span className="text-red-500">
                  {errors.registeredAddress.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firmsRegistrationNumber">
                  Registration Number
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
                        setShowOtherRegistrationNumber(value);
                      }}
                      className={
                        errors.firmsRegistrationNumber ? "border-red-500" : ""
                      }
                    >
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select  Registration Number" />
                      </FocusableSelectTrigger>
                      <SelectContent>
                        <SelectItem value="CIN">CIN</SelectItem>
                        <SelectItem value="PAN">PAN</SelectItem>
                        <SelectItem value="FIRM NO">FIRM NO</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {showOtherRegistrationNumber && (
                  <Controller
                    name="otherRegistrationNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="otherRegistrationNumber"
                        value={field.value}
                        onChange={field.onChange}
                        className={
                          errors.firmsRegistrationNumber
                            ? "border-red-500 mt-2"
                            : "mt-2"
                        }
                        {...field}
                        placeholder="Specify Registration Number"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="additionalInformation">
                  Holding Percentage
                </Label>
                <Controller
                  name="holdingPercentage"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="holdingPercentage"
                      placeholder="Enter Holding Percentage"
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                      className={
                        errors.holdingPercentage ? "border-red-500" : ""
                      }
                    />
                  )}
                />
                {errors.holdingPercentage && (
                  <span className="text-red-500">
                    {errors.holdingPercentage.message}
                  </span>
                )}
              </div>
            </div>

            {displaynominie && displaynominie.length > 0 && (
              <div className="space-y-2">
                <div className="grid gap-4 py-4">
                  {console.log(displaynominie)}
                  <Label className="text-lg font-bold">Selected Nominees</Label>
                  {displaynominie &&
                    displaynominie.map((nominee) => (
                      <div className="flex space-y-2 border border-input p-4 justify-between pl-4 pr-4 items-center rounded-lg">
                        <Label htmlFor={`nominee-${nominee?.id}`}>
                          {nominee?.fullLegalName || nominee?.charityName}
                        </Label>
                        <img
                          className="w-4 h-4 cursor-pointer"
                          onClick={() => {
                            setDisplaynominie(
                              displaynominie.filter(
                                (item) => item.id !== nominee.id
                              )
                            );
                            setSelectedNommie(
                              selectedNommie.filter(
                                (item) => item.id !== nominee.id
                              )
                            );
                          }}
                          src={cross}
                          alt=""
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="registered-mobile">Add nominee</Label>
              <Addnominee
                setSelectedNommie={setSelectedNommie}
                selectedNommie={selectedNommie}
                displaynominie={displaynominie}
                setDisplaynominie={setDisplaynominie}
              />{" "}
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
                    <Label htmlFor="mobile">Phone</Label>
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
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    {errors.mobile && (
                      <span className="text-red-500">
                        {errors.mobile.message}
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

export default PropritershipForm;

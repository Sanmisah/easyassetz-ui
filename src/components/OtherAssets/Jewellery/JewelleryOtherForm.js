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
  typeofJewellery: z
    .string()
    .nonempty({ message: "Type Of Jewellery is required" }),
  metalType: z.string().nonempty({ message: "Metal Type is required" }),
  preciousStone: z.string().min(2, { message: "Precious Stone is required" }),
  weightPerJewellery: z
    .string()
    .nonempty({ message: "Weight Per Jewellery is required" }),
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

const JewelleryOtherForm = () => {
  const navigate = useNavigate();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const queryClient = useQueryClient();
  const [showOthertypeofJewellery, setShowOthertypeofJewellery] =
    useState(false);
  const [showOtherpreciousStone, setShowOtherpreciousStone] = useState(false);
  const [showOthermetalType, setShowOthermetalType] = useState(false);
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
      typeofJewellery: "",
      metalType: "",
      preciousStone: "",
      weightPerJewellery: "",
      additionalInformation: "",
      name: "",
      email: "",
      phone: "",
    },
  });

  const lifeInsuranceMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(`/api/other-assets`, data, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });

      return response.data.data.Bullion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("LifeInsuranceData");
      toast.success("Jewellery added successfully!");
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
    data.name = name;
    data.email = email;
    data.mobile = phone;
    lifeInsuranceMutate.mutate(data);
  };

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-2xl font-bold">
                Jewellery Details
              </CardTitle>
              <CardDescription>
                Fill out the form to add a new Jewellery Details.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <form
            className="space-y-6 flex flex-col"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-2">
              <Label htmlFor="typeofJewellery">Type Of Jewellery</Label>
              <Controller
                name="typeofJewellery"
                control={control}
                render={({ field }) => (
                  <Select
                    id="typeofJewellery"
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setShowOthertypeofJewellery(value === "other");
                    }}
                    className={errors.typeofJewellery ? "border-red-500" : ""}
                  >
                    <FocusableSelectTrigger>
                      <SelectValue placeholder="Select Type Of Jewellery" />
                    </FocusableSelectTrigger>
                    <SelectContent>
                      <SelectItem value="necklace">Necklace</SelectItem>
                      <SelectItem value="earrings">Earrings</SelectItem>
                      <SelectItem value="bangles">Bangles</SelectItem>
                      <SelectItem value="bracelet">Bracelet</SelectItem>
                      <SelectItem value="rings">Rings</SelectItem>
                      <SelectItem value="clufLinks">Cluf Links</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {showOthertypeofJewellery && (
                <Controller
                  name="othertypeofJewellery"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Specify Type Of Jewellery"
                      className="mt-2"
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  )}
                />
              )}
              {errors.typeofJewellery && (
                <span className="text-red-500">
                  {errors.typeofJewellery.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="metalType">Metal Type</Label>
              <Controller
                name="metalType"
                control={control}
                render={({ field }) => (
                  <Select
                    id="metalType"
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setShowOthermetalType(value === "other");
                    }}
                    className={errors.metalType ? "border-red-500" : ""}
                  >
                    <FocusableSelectTrigger>
                      <SelectValue placeholder="Select Metal Type" />
                    </FocusableSelectTrigger>
                    <SelectContent>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="silver">Silver</SelectItem>
                      <SelectItem value="copper">Copper</SelectItem>
                      <SelectItem value="whiteGold">White Gold</SelectItem>
                      <SelectItem value="diamonds">Diamonds</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {showOthermetalType && (
                <Controller
                  name="othermetalType"
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
              {errors.metalType && (
                <span className="text-red-500">{errors.metalType.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="preciousStone">Precious Stone</Label>
              <Controller
                name="preciousStone"
                control={control}
                render={({ field }) => (
                  <Select
                    id="preciousStone"
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setShowOtherpreciousStone(value === "other");
                    }}
                    className={errors.preciousStone ? "border-red-500" : ""}
                  >
                    <FocusableSelectTrigger>
                      <SelectValue placeholder="Select Precious Stone" />
                    </FocusableSelectTrigger>
                    <SelectContent>
                      <SelectItem value="diamond">Diamond</SelectItem>
                      <SelectItem value="ruby">Ruby</SelectItem>
                      <SelectItem value="sapphire">Sapphire</SelectItem>
                      <SelectItem value="emerald">Emerald</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {showOtherpreciousStone && (
                <Controller
                  name="otherpreciousStone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Specify Precious Stone"
                      className="mt-2"
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  )}
                />
              )}
              {errors.preciousStone && (
                <span className="text-red-500">
                  {errors.preciousStone.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="weightPerJewellery">Weight Per Jewellery</Label>
              <Controller
                name="weightPerJewellery"
                control={control}
                render={({ field }) => (
                  <Input
                    id="weightPerJewellery"
                    placeholder="Enter Weight Per Jewellery(gms)"
                    {...field}
                    value={field.value || ""}
                    onChange={field.onChange}
                    className={
                      errors.weightPerJewellery ? "border-red-500" : ""
                    }
                  />
                )}
              />
              {errors.weightPerJewellery && (
                <span className="text-red-500">
                  {errors.weightPerJewellery.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantityOfJewellery">Quantity</Label>
              <Controller
                name="quantityOfJewellery"
                control={control}
                render={({ field }) => (
                  <Input
                    id="quantityOfJewellery"
                    placeholder="Enter Quantity (units)"
                    {...field}
                    value={field.value || ""}
                    onChange={field.onChange}
                    className={
                      errors.quantityOfJewellery ? "border-red-500" : ""
                    }
                  />
                )}
              />
              {errors.quantityOfJewellery && (
                <span className="text-red-500">
                  {errors.quantityOfJewellery.message}
                </span>
              )}
            </div>

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
                          value={name}
                          onChange={(e) => setName(e.target.value)}
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
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
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
                          value={field.value}
                          onChange={(value) => {
                            console.log(value);
                            setPhone(value);
                          }}
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

export default JewelleryOtherForm;

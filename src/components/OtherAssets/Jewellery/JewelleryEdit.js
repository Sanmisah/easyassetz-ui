import React, { useEffect, useState } from "react";
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

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { PhoneInput } from "react-international-phone";

const schema = z.object({
  typeofJewellery: z.string().nonempty({ message: "Type Of Jewellery is required" }),
  metalType: z
    .string()
    .nonempty({ message: "Precious Stone is required" }),
    preciousStone: z.string().optional(),
    weightPerJewellery: z
    .string()
    .min(1, { message: " Weight Per Jewellery is Required" }),
    additionalInformation: z
    .string()
    .min(1, { message: "Additional Information is Required" }),
});

const JewelleryEdit = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const [showOthertypeofJewellery, setShowOthertypeofJewellery] = useState(false);
  const [showOtherpreciousStone, setShowOtherpreciousStone] = useState(false);
  const [showOthermetalType, setShowOthermetalType] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setPhone] = useState("");
  console.log(lifeInsuranceEditId);
  useEffect(() => {
    if (lifeInsuranceEditId) {
      console.log("lifeInsuranceEditId:", lifeInsuranceEditId);
    }
  }, [lifeInsuranceEditId]);
  const [showOtherBullion, setShowOtherBullion] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {},
  });

  const getPersonalData = async () => {
    if (!user) return;
    const response = await axios.get(`/api/other-assets/${lifeInsuranceEditId}`, {
      headers: {
        Authorization: `Bearer ${user.data.token}`,
      },
    });
    let othertype = response.data.data.Bullion?.metalType;
    let otherarticle = response.data.data.Bullion?.articleDetails;
    if (
      othertype === "gold" ||
      othertype === "silver" ||
      othertype === "copper"
    ) {
      setShowOtherMetalType(false);
      setValue("metalType", othertype);
    } else {
      setShowOtherMetalType(true);
      setValue("otherMetalType", othertype);
    }

    if (
      otherarticle === "plates" ||
      otherarticle === "glass" ||
      otherarticle === "bowl" ||
      otherarticle === "bar" ||
      otherarticle === "utensils"
    ) {
      setShowOtherArticleDetails(false);
      setValue("articleDetails", otherarticle);
    } else {
      setShowOtherArticleDetails(true);
      setValue("otherArticleDetails", otherarticle);
    }
    console.log(typeof response.data.data.Bullion?.premium);
    return response.data.data.Bullion;
  };

  const {
    data: Benifyciary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bullionDataUpdate", lifeInsuranceEditId],
    queryFn: getPersonalData,

    onSuccess: (data) => {
      if (data.modeOfPurchase === "broker") {
        setBrokerSelected(true);
        setHideRegisteredFields(false);
      }
      if (data.modeOfPurchase === "e-insurance") {
        setBrokerSelected(false);
        setHideRegisteredFields(true);
      }
      setDefaultValues(data);
      reset(data);
      setValue(data);
      setValue("typeofJewellery", data.typeofJewellery);
      setValue("metalType", data.metalType);
      setValue("preciousStone", data.preciousStone);
      setValue("weightPerJewellery", data.weightPerJewellery);
      setValue("additionalInformation", data.additionalInformation);
      setValue("pointOfContact", data.pointOfContact);

      // Set fetched values to the form
      for (const key in data) {
        setValue(key, data[key]);
      }

      setShowOtherBullion(data.Bullion === "other");

      console.log(data);
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile", error.message);
    },
  });

  const bullionMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(
        `/api/other-assets/${lifeInsuranceEditId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      return response.data.data.Bullion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("BullionDataUpdate", lifeInsuranceEditId);
      toast.success("Jewellery added successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile");
    },
  });
  useEffect(() => {
    console.log("Form values:", control._formValues);
  }, [control._formValues]);

  useEffect(() => {
    if (Benifyciary?.nominees) {
      setDisplaynominie(Benifyciary?.nominees);
    }
  }, [Benifyciary?.nominees]);

  const onSubmit = (data) => {
    console.log(data);
    if (name) {
      data.name = name;
    }
    if (email) {
      data.email = email;
    }
    if (mobile) {
      data.mobile = mobile;
    }
    console.log(
      "bullion:",
      data.mobile,
      data.name,
      data.email,
      mobile,
      name,
      email
    );
    if (data.metalType === "other") {
      data.metalType = data.otherMetalType;
    }

    bullionMutate.mutate(data);
  };

  useEffect(() => {
    console.log(Benifyciary);
  }, [Benifyciary]);
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading jewellery data</div>;
  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-2xl font-bold">
                Jewellery Details
              </CardTitle>
              <CardDescription>
                Edit the form to update the jewellery details.
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
                <Label htmlFor="typeofJewellery">Type Of Jewellery</Label>
                <Controller
                  name="typeofJewellery"
                  control={control}
                  defaultValue={Benifyciary?.typeofJewellery}
                  render={({ field }) => (
                    <Select
                      id="typeofJewellery"
                      value={field.value}
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOthertypeofJewellery(value === "other");
                      }}
                      className={errors.typeofJewellery ? "border-red-500" : ""}
                      defaultValue={Benifyciary?.typeofJewellery || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type Of Jewellery" />
                      </SelectTrigger>
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
                    defaultValue={Benifyciary?.othertypeofJewellery || ""}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Type Of Jewellery"
                        className="mt-2"
                        defaultValue={Benifyciary?.othertypeofJewellery || ""}
                      />
                    )}
                  />
                )}
                {errors.metalType && (
                  <span className="text-red-500">
                    {errors.metalType.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="metalType">Metal Type</Label>
                <Controller
                  name="metalType"
                  control={control}
                  defaultValue={Benifyciary?.metalType || ""}
                  render={({ field }) => (
                    <Select
                      id="metalType"
                      value={field.value}
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOthermetalType(value === "other");
                      }}
                      className={errors.metalType ? "border-red-500" : ""}
                      defaultValue={Benifyciary?.metalType || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Metal Type" />
                      </SelectTrigger>
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
                    defaultValue={Benifyciary?.othermetalType || ""}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Metal Type"
                        className="mt-2"
                        defaultValue={Benifyciary?.othermetalType || ""}
                      />
                    )}
                  />
                )}
                {errors.metalType && (
                  <span className="text-red-500">
                    {errors.metalType.message}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="preciousStone">Precious Stone</Label>
                <Controller
                  name="preciousStone"
                  control={control}
                  defaultValue={Benifyciary?.preciousStone || ""}
                  render={({ field }) => (
                    <Select
                      id="preciousStone"
                      value={field.value}
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherpreciousStone(value === "other");
                      }}
                      className={errors.preciousStone ? "border-red-500" : ""}
                      defaultValue={Benifyciary?.preciousStone || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Precious Stone" />
                      </SelectTrigger>
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
                    defaultValue={Benifyciary?.otherpreciousStone || ""}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Precious Stone"
                        className="mt-2"
                        defaultValue={Benifyciary?.otherpreciousStone || ""}
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
              <Label htmlFor="weightPerJewellery">
                Weight Per Jewellery
              </Label>
              <Controller
                name="weightPerJewellery"
                defaultValue={Benifyciary?.weightPerJewellery || ""}
                control={control}
                render={({ field }) => (
                  <Input
                    id="weightPerJewellery"
                    placeholder="Weight Per Jewellery(gms)"
                    {...field}
                    className={errors.weightPerJewellery ? "border-red-500" : ""}
                    defaultValue={Benifyciary?.weightPerJewellery || ""}
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
                <Label htmlFor="additionalInformation">
                  {" "}
                  Additional Information
                </Label>
                <Controller
                  name="additionalInformation"
                  control={control}
                  defaultValue={Benifyciary?.additionalInformation || ""}
                  render={({ field }) => (
                    <Input
                      id="additionalInformation"
                      placeholder="Enter Addtional Information"
                      {...field}
                      className={
                        errors.additionalInformation ? "border-red-500" : ""
                      }
                      defaultValue={Benifyciary?.additionalInformation || ""}
                    />
                  )}
                />
                {errors.additionalInformation && (
                  <span className="text-red-500">
                    {errors.additionalInformation.message}
                  </span>
                )}
              </div>
            
            <div className="w-full grid grid-cols-1 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>

                <Input
                  id="name"
                  placeholder="Enter Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                  defaultValue={Benifyciary?.name || ""}
                />

                {errors.name && (
                  <span className="text-red-500">{errors.name.message}</span>
                )}
              </div>
              <div className="w-[40%] space-y-2">
                <Label htmlFor="email">Email</Label>
                <Controller
                  name="email"
                  control={control}
                  defaultValue={Benifyciary?.email || ""}
                  render={({ field }) => (
                    <Input
                      id="email"
                      placeholder="Enter Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={errors.email ? "border-red-500" : ""}
                      defaultValue={Benifyciary?.email || ""}
                    />
                  )}
                />
                {errors.email && (
                  <span className="text-red-500">{errors.email.message}</span>
                )}
              </div>
              <div className="w-[40%] space-y-2">
                <Label htmlFor="mobile">Mobile</Label>
                <Controller
                  name="mobile"
                  control={control}
                  defaultValue={Benifyciary?.mobile || ""}
                  render={({ field }) => (
                    <PhoneInput
                      id="mobile"
                      type="tel"
                      placeholder="Enter mobile number"
                      defaultCountry="in"
                      inputStyle={{ minWidth: "15.5rem" }}
                      value={field.value}
                      onChange={(e) => setPhone(e.target)}
                      defaultValue={Benifyciary?.mobile || ""}
                    />
                  )}
                />
                {errors.mobile && (
                  <span className="text-red-500">{errors.mobile.message}</span>
                )}
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

export default JewelleryEdit;

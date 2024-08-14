import React, { useEffect, useState, forwardRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@com/ui/card";
import { Label } from "@com/ui/label";
import { Button } from "@com/ui/button";
import { Input } from "@com/ui/input";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { PhoneInput } from "react-international-phone";
import { useSelector } from "react-redux";
import { RadioGroup, RadioGroupItem } from "@com/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@com/ui/select";
// import Datepicker from "../../Beneficiarydetails/Datepicker";

const FocusableSelectTrigger = forwardRef((props, ref) => (
  <SelectTrigger ref={ref} {...props} />
));

const schema = z.object({
  jewelleryType: z.string().optional(),
  otherJewellery: z.string().optional(),
  metal: z.string().optional(),
  otherMetal: z.string().optional(),
  preciousStone: z.string().optional(),
  otherPreciousStone: z.string().optional(),
  weightPerJewellery: z.string().optional(),
  quantity: z.string().optional(),
  additionalInformation: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  mobile: z.string().optional(),
  type: z.any().optional(),
});

const OtherLoansEditForm = () => {
  const navigate = useNavigate();
  const { lifeInsuranceEditId } = useSelector((state) => state.counterSlice);
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const queryClient = useQueryClient();
  const [showOtherMetalType, setShowOtherMetalType] = useState(false);
  const [fourWheelerStatus, setfourWheelerStatus] = useState(false);
  const [OtherJwelleryType, setOtherJwelleryType] = useState(false);
  const [OthermetalSelected, setOthermetalSelected] = useState(false);
  const [OtherPreciousStoneSelected, setOtherPreciousStoneSelected] =
    useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      jewelleryType: "",
      otherJewellery: "",
      metal: "",
      otherMetal: "",
      preciousStone: "",
      otherPreciousStone: "",
      weightPerJewellery: "",
      quantity: "",
      additionalInformation: "",
      name: "",
      email: "",
      mobile: "",
      type: "jewellery",
    },
  });
  const getPersonalData = async () => {
    if (!user) return;
    const response = await axios.get(
      `/api/other-assets/${lifeInsuranceEditId}`,
      {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      }
    );
    let data = response.data.data.OtherAsset;
    if (
      data.jewelleryType !== "necklace" &&
      data.jewelleryType !== "earrings" &&
      data.jewelleryType !== "bracelet" &&
      data.jewelleryType !== "bangles" &&
      data.jewelleryType !== "cuffLinks" &&
      data.jewelleryType !== "chain" &&
      data.jewelleryType !== "ring" &&
      data.jewelleryType !== "other"
    ) {
      setValue("otherJewellery", data.jewelleryType);
      setValue("jewelleryType", "other");
      setOtherJwelleryType(true);
    }
    if (
      data.metal !== "gold" &&
      data.metal !== "silver" &&
      data.metal !== "copper" &&
      data.metal !== "whiteGold" &&
      data.metal !== "diamond" &&
      data.metal !== "other"
    ) {
      setValue("otherMetal", data.metal);
      setValue("metal", "other");
      setOthermetalSelected(true);
    }
    if (
      data.preciousStone !== "diamond" &&
      data.preciousStone !== "ruby" &&
      data.preciousStone !== "saffron" &&
      data.preciousStone !== "other"
    ) {
      setValue("otherPreciousStone", data.preciousStone);
      setValue("preciousStone", "other");
      setOtherPreciousStoneSelected(true);
    }
    setValue("weightPerJewellery", data.weightPerJewellery);
    setValue("quantity", data.quantity);
    setValue("additionalInformation", data.additionalInformation);
    setValue("name", data.name);
    setValue("email", data.email);
    setValue("mobile", data.mobile);
    return response.data.data.OtherAsset;
  };

  const {
    data: Benifyciary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["vehicleData", lifeInsuranceEditId],
    queryFn: getPersonalData,
    onSuccess: (data) => {
      console.log("Data:", data);
      setInitialData(data);
      reset(data);
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile", error.message);
    },
  });

  const loanMutate = useMutation({
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
      return response.data.data.Jewellery;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("loanData");
      toast.success("Jewellery updated successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error updating loan:", error);
      toast.error("Failed to update loan");
    },
  });
  // const formatDate = (date) => {
  //   const d = new Date(date);
  //   const month = String(d.getMonth() + 1).padStart(2, "0");
  //   const day = String(d.getDate()).padStart(2, "0");
  //   const year = d.getFullYear();
  //   return `${month}/${day}/${year}`;
  // };

  const onSubmit = (data) => {
    console.log(data);
    data.type = "huf";
    // data.emiDate = formatDate(data.emiDate);
    // data.startDate = formatDate(data.startDate);
    data.type = "jewellery";
    if (data.jewelleryType === "other") {
      data.jewelleryType = data.otherJewellery;
    }
    if (data.preciousStone === "other") {
      data.preciousStone = data.otherPreciousStone;
    }
    if (data.metal === "other") {
      data.metal = data.otherMetal;
    }
    loanMutate.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading Jewellery data</div>;

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-2xl font-bold">
                Edit Jewellery Details
              </CardTitle>
              <CardDescription>
                Update the form to edit the Jewellery details.
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
                <Label htmlFor="jewelleryType">Type of Jewellery</Label>
                <Controller
                  name="jewelleryType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="jewelleryType"
                      placeholder="Enter Type of Jewellery"
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setOtherJwelleryType(value === "other");
                      }}
                      className={errors.jewelleryType ? "border-red-500" : ""}
                    >
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select insurance company" />
                      </FocusableSelectTrigger>
                      <SelectContent>
                        <SelectItem value="necklace">Necklace</SelectItem>
                        <SelectItem value="earrings">Earrings</SelectItem>
                        <SelectItem value="bracelet">Bracelet</SelectItem>
                        <SelectItem value="bangles">Bangles</SelectItem>
                        <SelectItem value="cuffLinks">Cuff Links</SelectItem>
                        <SelectItem value="chain">Chain</SelectItem>
                        <SelectItem value="ring">Ring</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {OtherJwelleryType && (
                  <div className="space-y-2">
                    <Controller
                      name="otherJewellery"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="otherJewellery"
                          placeholder="Enter Other Jewellery"
                          {...field}
                          className={
                            errors.otherJewellery ? "border-red-500" : ""
                          }
                        />
                      )}
                    />
                    {errors.otherJewellery && (
                      <span className="text-red-500">
                        {errors.otherJewellery.message}
                      </span>
                    )}
                  </div>
                )}
                {errors.jewelleryType && (
                  <span className="text-red-500">
                    {errors.jewelleryType.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="metal">Metal</Label>
                <Controller
                  name="metal"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="metal"
                      placeholder="Enter Metal"
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setOthermetalSelected(value === "other");
                      }}
                      className={errors.metal ? "border-red-500" : ""}
                    >
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select insurance company" />
                      </FocusableSelectTrigger>
                      <SelectContent>
                        <SelectItem value="gold">Gold</SelectItem>
                        <SelectItem value="silver">Silver</SelectItem>
                        <SelectItem value="copper">Copper</SelectItem>
                        <SelectItem value="whiteGold">White Gold</SelectItem>
                        <SelectItem value="diamond">Diamond</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {OthermetalSelected && (
                  <div className="space-y-2">
                    <Controller
                      name="otherMetal"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="otherMetal"
                          placeholder="Enter Other Metal"
                          {...field}
                          className={errors.otherMetal ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.otherMetal && (
                      <span className="text-red-500">
                        {errors.otherMetal.message}
                      </span>
                    )}
                  </div>
                )}
                {errors.metal && (
                  <span className="text-red-500">{errors.metal.message}</span>
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
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setOtherPreciousStoneSelected(value === "other");
                      }}
                      className={errors.preciousStone ? "border-red-500" : ""}
                    >
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select insurance company" />
                      </FocusableSelectTrigger>
                      <SelectContent>
                        <SelectItem value="diamond">Diamond</SelectItem>
                        <SelectItem value="ruby">Ruby</SelectItem>
                        <SelectItem value="saffron">Safron</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {OtherPreciousStoneSelected && (
                  <div className="space-y-2">
                    <Controller
                      name="otherPreciousStone"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="otherPreciousStone"
                          placeholder="Enter Other Precious Stone"
                          {...field}
                          className={
                            errors.otherPreciousStone ? "border-red-500" : ""
                          }
                        />
                      )}
                    />
                    {errors.otherPreciousStone && (
                      <span className="text-red-500">
                        {errors.otherPreciousStone.message}
                      </span>
                    )}
                  </div>
                )}
                {errors.preciousStone && (
                  <span className="text-red-500">
                    {errors.preciousStone.message}
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weightPerJewellery">Weight Per Jewellery</Label>
              <Controller
                name="weightPerJewellery"
                control={control}
                render={({ field }) => (
                  <Input
                    id="weightPerJewellery"
                    placeholder="Enter Weight Per Jewellery"
                    {...field}
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
              <Label htmlFor="quantity">Quantity</Label>
              <Controller
                name="quantity"
                control={control}
                render={({ field }) => (
                  <Input
                    id="quantity"
                    placeholder="Enter Quantity"
                    {...field}
                    className={errors.quantity ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.quantity && (
                <span className="text-red-500">{errors.quantity.message}</span>
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
                <span className="text-red-500">{errors.name.message}</span>
              )}
            </div>

            <div className="space-y-2">
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
                <span className="text-red-500">{errors.email.message}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile</Label>
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
              {errors.mobile && (
                <span className="text-red-500">{errors.mobile.message}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label>Upload File</Label>
              <Controller
                name="jewelleryImages"
                control={control}
                render={({ field }) => (
                  <Input
                    id="file"
                    type="file"
                    onChange={(event) => {
                      field.onChange(
                        event.target.files && event.target.files[0]
                      );
                    }}
                    className={errors.file ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.file && (
                <span className="text-red-500">{errors.file.message}</span>
              )}
            </div>
            <div>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(`/api/file/${Benifyciary?.jewelleryImages}`);
                }}
              >
                View Attachment
              </Button>
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

export default OtherLoansEditForm;

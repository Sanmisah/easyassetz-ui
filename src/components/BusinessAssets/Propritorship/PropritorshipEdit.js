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
import cross from "@/components/image/close.png";

const schema = z.object({
  firmName: z.string().nonempty({ message: "Firm Name is required" }),
  registeredAddress: z
    .string()
    .nonempty({ message: "Registration Address is required" }),
  firmsRegistrationNumber: z
    .string()
    .nonempty({ message: "Firm Registration Number is required" }),
  firmsRegistrationNumberType: z
    .string()
    .nonempty({ message: "Firm Registration Number Type is required" }),
  additionalInformation: z
    .string()
    .min(1, { message: "Additional Information is Required" }),
  name: z.any().optional(),
  email: z.any().optional(),
});

const FocusableSelectTrigger = forwardRef((props, ref) => (
  <SelectTrigger ref={ref} {...props} />
));

const PropritorshipEdit = ({ benificiaryId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const [showOtherMetalType, setShowOtherMetalType] = useState(false);
  const [showOtherArticleDetails, setShowOtherArticleDetails] = useState(false);
  const { lifeInsuranceEditId } = useSelector((state) => state.counterSlice);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [
    showOtherFirmsRegistrationNumber,
    setShowOtherFirmsRegistrationNumber,
  ] = useState(true);
  const [mobile, setmobile] = useState();
  console.log(lifeInsuranceEditId);

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
    const response = await axios.get(
      `/api/business-assets/${lifeInsuranceEditId}`,
      {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      }
    );
    let othertype = response.data.data.BusinessAsset?.firmName;
    let otherarticle = response.data.data.BusinessAsset?.registeredAddress;
    console.log(response.data.data.BusinessAsset);
    reset(response.data.data.BusinessAsset);
    setmobile(response.data.data.BusinessAsset?.mobile);

    return response.data.data.BusinessAsset;
  };

  const {
    data: Benifyciary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["businessAssetDataUpdate", lifeInsuranceEditId],
    queryFn: getPersonalData,
    onSuccess: (data) => {
      if (data) {
        setDefaultValues(data);
        reset(data);
        setValue(data);

        console.log(data);
      }
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile", error.message);
    },
  });

  const bullionMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(
        `/api/business-assets/${lifeInsuranceEditId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      return response.data.data.BusinessAsset;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("BullionDataUpdate", lifeInsuranceEditId);
      toast.success("Propritoriship added successfully!");
      navigate("/propritership");
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile");
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    data.type = "propritorship";
    // if (!name && name !== "") {
    //   data.name = name;
    // }
    // if (!email && email !== "") {
    //   data.email = email;
    // }
    data.mobile = mobile;

    if (data.firmName === "other") {
      data.firmName = data.otherFirmType;
    }

    bullionMutate.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading propritorship data</div>;

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button onClick={() => navigate("/propritership")}>Back</Button>
              <div>
                <CardTitle className="text-2xl font-bold">
                  Proprtieship Details
                </CardTitle>
                <CardDescription>
                  Edit the form to update the propritorship details.
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
                <Label htmlFor="firmName"> Firm Name</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="firmName"
                  defaultValue={Benifyciary?.firmName}
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="firmName"
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherMetalType(value === "other");
                      }}
                      className={errors.firmName ? "border-red-500" : ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Firm Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="company1">company1</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.firmName && (
                  <span className="text-red-500">
                    {errors.firmName.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="registeredAddress">
                  {" "}
                  Registration Address{" "}
                </Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="registeredAddress"
                  control={control}
                  defaultValue={Benifyciary?.registeredAddress || ""}
                  render={({ field }) => (
                    <Input
                      id="registeredAddress"
                      placeholder="Enter Address"
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                      className={
                        errors.registeredAddress ? "border-red-500" : ""
                      }
                      defaultValue={Benifyciary?.registeredAddress || ""}
                    />
                  )}
                />

                {errors.registeredAddress && (
                  <span className="text-red-500">
                    {errors.registeredAddress.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 col-span-full">
                <Label htmlFor="firmsRegistrationNumberType">
                  Firm Registration Number
                </Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="firmsRegistrationNumberType"
                  control={control}
                  defaultValue={Benifyciary?.firmsRegistrationNumberType || ""}
                  render={({ field }) => (
                    <Select
                      id="firmsRegistrationNumberType"
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherFirmsRegistrationNumber(true);
                      }}
                      className={
                        errors.firmsRegistrationNumberType
                          ? "border-red-500"
                          : ""
                      }
                    >
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select Registration Number" />
                      </FocusableSelectTrigger>
                      <SelectContent>
                        <SelectItem value="CIN">CIN</SelectItem>
                        <SelectItem value="PAN">PAN</SelectItem>
                        <SelectItem value="FIRM NO">FIRM NO</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {showOtherFirmsRegistrationNumber && (
                  <Controller
                    name="firmsRegistrationNumber"
                    control={control}
                    defaultValue={Benifyciary?.firmsRegistrationNumber || ""}
                    render={({ field }) => (
                      <Input
                        id="firmsRegistrationNumber"
                        className="mt-2"
                        value={field.value?.toUpperCase() || ""}
                        defaultValue={
                          Benifyciary?.firmsRegistrationNumber || ""
                        }
                        onChange={field.onChange}
                      />
                    )}
                  />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalInformation">
                  {" "}
                  Additional Information
                </Label>
                <Label style={{ color: "red" }}>*</Label>
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
            </div>
            <div className="w-full grid grid-cols-1 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Controller
                  name="name"
                  control={control}
                  defaultValue={Benifyciary?.name || ""}
                  render={({ field }) => (
                    <Input
                      id="name"
                      placeholder="Enter Name"
                      value={field.value || ""}
                      onChange={field.onChange}
                      defaultValue={Benifyciary?.name || ""}
                    />
                  )}
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
                      {...field}
                      defaultValue={Benifyciary?.email || ""}
                      onChange={field.onChange}
                      value={field.value || ""}
                      className={errors.email ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.email && (
                  <span className="text-red-500">{errors.email.message}</span>
                )}
              </div>
              <div className="w-[40%] space-y-2">
                <Label htmlFor="mobile">mobile</Label>

                <PhoneInput
                  id="mobile"
                  placeholder="Enter mobile number"
                  defaultCountry="in"
                  inputStyle={{ minWidth: "15.5rem" }}
                  value={mobile}
                  onChange={(value) => setmobile(value)}
                  defaultValues={Benifyciary?.mobile || ""}
                />
                {errors.mobile && (
                  <span className="text-red-500">{errors.mobile.message}</span>
                )}
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

export default PropritorshipEdit;

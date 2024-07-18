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
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { PhoneInput } from "react-international-phone";
import { useSelector } from "react-redux";
import { RadioGroup, RadioGroupItem } from "@com/ui/radio-group";

const schema = z.object({
  bankName: z.any().optional(),
  ppfAccountNo: z.any().optional(),
  branch: z.any().optional(),
  natureOfHolding: z.any().optional(),
  additionalDetails: z.any().optional(),
  name: z.any().optional(),
  mobile: z.any().optional(),
  email: z
    .any()
    // .email({ message: "Invalid Email" })
    .optional(),
});
// .refine((data) => {
//   if (data.natureOfHolding === "joint") {
//     return !!data.jointHolderName;
//   }

//   return true;
// });

const PpfEditForm = ({}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const queryClient = useQueryClient();
  const [showJointHolderName, setShowJointHolderName] = useState(false);
  const [nomineeDetails, setNomineeDetails] = useState([]);
  const [nomineeError, setNomineeError] = useState(false);
  const { lifeInsuranceEditId } = useSelector((state) => state.counterSlice);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      bankName: "",
      ppfAccountNo: "",
      branch: "",
      natureOfHolding: "",
      jointHolderName: "",
      additionalDetails: "",
      name: "",
      mobile: "",
      email: "",
    },
  });

  const getPersonalData = async () => {
    if (!user) return;
    const response = await axios.get(
      `/api/public-provident-funds/${lifeInsuranceEditId}`,
      {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      }
    );
    let data = response.data.data.PublicProvidentFund;
    console.log("Fetching Data:", data);
    setValue("bankName", data.bankName);
    setValue("ppfAccountNo", data.ppfAccountNo);
    setValue("branch", data.branch);
    setValue("natureOfHolding", data.natureOfHolding);
    setValue("jointHolderName", data.jointHolderName);
    setValue("additionalDetails", data.additionalDetails);
    setValue("name", data.name);
    setValue("mobile", data.mobile);
    setValue("email", data.email);
    if (data.natureOfHolding === "joint") {
      setShowJointHolderName(true);
    }
    // Assume nomineeDetails is an array of nominee objects
    setNomineeDetails(data.nomineeDetails || []);
    return response.data.data.PublicProvidentFund;
  };

  const {
    data: Benifyciary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lifeInsuranceDataUpdate", lifeInsuranceEditId],
    queryFn: getPersonalData,
    onSuccess: (data) => {
      Object.keys(data).forEach((key) => {
        if (schema.shape[key]) {
          setValue(key, data[key]);
          console.error("Error fetching data:", error);
          toast.error("Failed to fetch data");
        } // .email({ message: "Invalid Email" })
      });
      if (data.natureOfHolding === "joint") {
        setShowJointHolderName(true);
      }
      // Assume nomineeDetails is an array of nominee objects
      setNomineeDetails(data.nomineeDetails || []);
    },
    onError: (error) => {
      console.error("Error fetching PPF data:", error);
      toast.error("Failed to fetch PPF data");
    },
  });

  const ppfMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(
        `/api/public-provident-funds/${lifeInsuranceEditId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      return response.data.data.PublicProvidentFund;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("PublicProvidentFund");
      toast.success("Public Providend Fund details updated successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error updating Public Providend Fund details:", error);
      toast.error("Failed to update Public Providend Fund details");
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    ppfMutate.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading Public Providend Fund data</div>;

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-2xl font-bold">
                Edit Public Providend Fund Details
              </CardTitle>
              <CardDescription>
                Update the form to edit the Public Providend Fund details.
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
              <Label htmlFor="bankName">Post/Bank Name</Label>
              <Controller
                name="bankName"
                control={control}
                render={({ field }) => (
                  <Input
                    id="bankName"
                    placeholder="Enter Post/Bank Name"
                    {...field}
                    className={errors.bankName ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.bankName && (
                <span className="text-red-500">{errors.bankName.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ppfAccountNo">
                Public Providend Fund Account Number
              </Label>
              <Controller
                name="ppfAccountNo"
                control={control}
                render={({ field }) => (
                  <Input
                    id="ppfAccountNo"
                    placeholder="Enter Public Providend Fund Account Number"
                    {...field}
                    className={errors.ppfAccountNo ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.ppfAccountNo && (
                <span className="text-red-500">
                  {errors.ppfAccountNo.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Controller
                name="branch"
                control={control}
                render={({ field }) => (
                  <Input
                    id="branch"
                    placeholder="Enter Branch"
                    {...field}
                    className={errors.branch ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.branch && (
                <span className="text-red-500">{errors.branch.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="natureOfHolding">Nature of Holding</Label>
              <Controller
                name="natureOfHolding"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setShowJointHolderName(value === "joint");
                    }}
                    className="flex items-center gap-2"
                  >
                    <div className="flex items-center gap-2 text-center">
                      <RadioGroupItem id="single" value="single" />
                      <Label htmlFor="single">Single</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id="joint" value="joint" />
                      <Label htmlFor="joint">Joint</Label>
                    </div>
                  </RadioGroup>
                )}
              />
              {errors.natureOfHolding && (
                <span className="text-red-500">
                  {errors.natureOfHolding.message}
                </span>
              )}
            </div>

            {showJointHolderName && (
              <div className="space-y-2">
                <Label htmlFor="jointHolderName">Joint Holder Name</Label>
                <Controller
                  name="jointHolderName"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="jointHolderName"
                      value={field.value}
                      onValueChange={field.onChange}
                      className={errors.jointHolderName ? "border-red-500" : ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Joint Holder Name" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="family_member_1">
                          Family Member 1
                        </SelectItem>
                        <SelectItem value="family_member_2">
                          Family Member 2
                        </SelectItem>
                        <SelectItem value="other_contact_1">
                          Other Contact 1
                        </SelectItem>
                        <SelectItem value="other_contact_2">
                          Other Contact 2
                        </SelectItem>
                        {/* Add more options as needed */}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.jointHolderName && (
                  <span className="text-red-500">
                    {errors.jointHolderName.message}
                  </span>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="additionalDetails">Additional Details</Label>
              <Controller
                name="additionalDetails"
                control={control}
                render={({ field }) => (
                  <Input
                    id="additionalDetails"
                    placeholder="Enter Additional Details"
                    {...field}
                    className={errors.additionalDetails ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.additionalDetails && (
                <span className="text-red-500">
                  {errors.additionalDetails.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Point of Contact Name</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    id="name"
                    placeholder="Enter Point of Contact Name"
                    {...field}
                    className={errors.name ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.name && (
                <span className="text-red-500">{errors.name.message}</span>
              )}
            </div>
            {/* 
            <div className="space-y-2">
              <Label htmlFor="mobile">
                Point of Contact Mobile
              </Label>
              <Controller
                name="mobile"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    id="mobile"
                    type="tel"
                    placeholder="Enter Point of Contact Mobile"
                    defaultCountry="in"
                    inputStyle={{ minWidth: "15.5rem" }}
                    {...field}
                    className={
                      errors.mobile ? "border-red-500" : ""
                    }
                  />
                )}
              />
              {errors.mobile && (
                <span className="text-red-500">
                  {errors.mobile.message}
                </span>
              )}
            </div> */}

            <div className="space-y-2">
              <Label htmlFor="email">Point of Contact Email</Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    id="email"
                    placeholder="Enter Point of Contact Email"
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
              <Label htmlFor="imageUpload">Image Upload</Label>
              <Controller
                name="imageUpload"
                control={control}
                render={({ field }) => (
                  <Input
                    type="file"
                    id="imageUpload"
                    {...field}
                    className={errors.imageUpload ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.imageUpload && (
                <span className="text-red-500">
                  {errors.imageUpload.message}
                </span>
              )}
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

export default PpfEditForm;

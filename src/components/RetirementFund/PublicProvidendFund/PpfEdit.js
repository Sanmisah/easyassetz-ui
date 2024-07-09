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

const schema = z.object({
  bankName: z.string().nonempty({ message: "Bank/Post Name is required" }),
  ppfAccountNumber: z
    .string()
    .nonempty({ message: "PPF Account Number is required" }),
  branch: z.string().optional(),
  holdingNature: z
    .string()
    .nonempty({ message: "Nature of Holding is required" }),
  jointHolderName: z.string().optional(),
  additionalDetails: z.string().optional(),
  pointOfContactName: z
    .string()
    .nonempty({ message: "Point of Contact Name is required" }),
  pointOfContactMobile: z
    .string()
    .nonempty({ message: "Point of Contact Mobile is required" }),
  pointOfContactEmail: z
    .string()
    .email({ message: "Invalid Email" })
    .nonempty({ message: "Point of Contact Email is required" }),
});

const PpfEditForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const queryClient = useQueryClient();
  const [showJointHolderName, setShowJointHolderName] = useState(false);
  const [nomineeDetails, setNomineeDetails] = useState([]);
  const [nomineeError, setNomineeError] = useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      bankName: "",
      ppfAccountNumber: "",
      branch: "",
      holdingNature: "",
      jointHolderName: "",
      additionalDetails: "",
      pointOfContactName: "",
      pointOfContactMobile: "",
      pointOfContactEmail: "",
    },
  });

  const {
    data: ppfData,
    isLoading,
    isError,
  } = useQuery(
    ["ppfData", id],
    async () => {
      const response = await axios.get(`/api/public-provident-funds/${id}`, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });
      return response.data.data.PublicProvidentFund;
    },
    {
      onSuccess: (data) => {
        Object.keys(data).forEach((key) => {
          if (schema.shape[key]) {
            setValue(key, data[key]);
          }
        });
        if (data.holdingNature === "joint") {
          setShowJointHolderName(true);
        }
        // Assume nomineeDetails is an array of nominee objects
        setNomineeDetails(data.nomineeDetails || []);
      },
      onError: (error) => {
        console.error("Error fetching PPF data:", error);
        toast.error("Failed to fetch PPF data");
      },
    }
  );

  const ppfMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(
        `/api/public-provident-funds/${id}`,
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

      queryClient.invalidateQueries("PublicProvidentFundData");
      toast.success("Public Providend Fund details updated successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error updating Public Providend Fund details:", error);
      toast.error("Failed to update Public Providend Fund details");
    },
  });

  const onSubmit = (data) => {
    if (data.holdingNature === "joint" && !data.jointHolderName) {
      setNomineeError(true);
      return;
    }
    if (nomineeDetails.length === 0) {
      setNomineeError(true);
      return;
    }

    ppfMutate.mutate(data);
  };

  const addNominee = () => {
    const newNominee = { name: "", relation: "" }; // Replace with actual nominee fields
    setNomineeDetails([...nomineeDetails, newNominee]);
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
              <Label htmlFor="ppfAccountNumber">
                Public Providend Fund Account Number
              </Label>
              <Controller
                name="ppfAccountNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    id="ppfAccountNumber"
                    placeholder="Enter Public Providend Fund Account Number"
                    {...field}
                    className={errors.ppfAccountNumber ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.ppfAccountNumber && (
                <span className="text-red-500">
                  {errors.ppfAccountNumber.message}
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
              <Label htmlFor="holdingNature">Nature of Holding</Label>
              <Controller
                name="holdingNature"
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
              {errors.holdingNature && (
                <span className="text-red-500">
                  {errors.holdingNature.message}
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
              <Label htmlFor="nomineeDetails">Nominee Details</Label>
              <Button type="button" onClick={addNominee}>
                Add (+) Nominee
              </Button>
              {nomineeError && (
                <span className="text-red-500">
                  Please add nominee details.
                </span>
              )}
              {nomineeDetails.map((nominee, index) => (
                <div key={index} className="mt-2">
                  <Input
                    placeholder="Nominee Name"
                    value={nominee.name}
                    onChange={(e) => {
                      const updatedNominees = [...nomineeDetails];
                      updatedNominees[index].name = e.target.value;
                      setNomineeDetails(updatedNominees);
                    }}
                  />
                  <Input
                    placeholder="Nominee Relation"
                    value={nominee.relation}
                    onChange={(e) => {
                      const updatedNominees = [...nomineeDetails];
                      updatedNominees[index].relation = e.target.value;
                      setNomineeDetails(updatedNominees);
                    }}
                    className="mt-2"
                  />
                </div>
              ))}
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

            <div className="space-y-2">
              <Label htmlFor="pointOfContactName">Point of Contact Name</Label>
              <Controller
                name="pointOfContactName"
                control={control}
                render={({ field }) => (
                  <Input
                    id="pointOfContactName"
                    placeholder="Enter Point of Contact Name"
                    {...field}
                    className={
                      errors.pointOfContactName ? "border-red-500" : ""
                    }
                  />
                )}
              />
              {errors.pointOfContactName && (
                <span className="text-red-500">
                  {errors.pointOfContactName.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pointOfContactMobile">
                Point of Contact Mobile
              </Label>
              <Controller
                name="pointOfContactMobile"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    id="pointOfContactMobile"
                    type="tel"
                    placeholder="Enter Point of Contact Mobile"
                    defaultCountry="in"
                    inputStyle={{ minWidth: "15.5rem" }}
                    {...field}
                    className={
                      errors.pointOfContactMobile ? "border-red-500" : ""
                    }
                  />
                )}
              />
              {errors.pointOfContactMobile && (
                <span className="text-red-500">
                  {errors.pointOfContactMobile.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pointOfContactEmail">
                Point of Contact Email
              </Label>
              <Controller
                name="pointOfContactEmail"
                control={control}
                render={({ field }) => (
                  <Input
                    id="pointOfContactEmail"
                    placeholder="Enter Point of Contact Email"
                    {...field}
                    className={
                      errors.pointOfContactEmail ? "border-red-500" : ""
                    }
                  />
                )}
              />
              {errors.pointOfContactEmail && (
                <span className="text-red-500">
                  {errors.pointOfContactEmail.message}
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

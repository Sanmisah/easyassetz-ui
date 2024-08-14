import React, { useState } from "react";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { PhoneInput } from "react-international-phone";
import Datepicker from "../../Beneficiarydetails/Datepicker";

const schema = z.object({
  litigationType: z.any().optional(),

  otherLitigationType: z.any().optional(),
  courtName: z.string().nonempty({ message: "Court/Forum Name is required" }),
  city: z.string().nonempty({ message: "City is required" }),
  caseRegistrationNumber: z
    .string()
    .nonempty({ message: "Case Registration Number is required" }),
  myStatus: z.string().nonempty({ message: "My Status is required" }),
  otherPartyName: z
    .string()
    .nonempty({ message: "Other Party (Name & Address) is required" }),
  otherPartyAddress: z
    .string()
    .nonempty({ message: "Other Party (Name & Address) is required" }),
  lawyerName: z
    .string()
    .nonempty({ message: "Lawyer's Name on Record is required" }),
  lawyerContact: z
    .string()
    .nonempty({ message: "Lawyer's Contact Number is required" }),
  caseFillingDate: z.date({ message: "Date of Filing the Case is required" }),
  status: z.string().optional(),
  additionalInformation: z.string().optional(),
});

const LitigationForm = () => {
  const navigate = useNavigate();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const queryClient = useQueryClient();
  const [showOtherLitigationType, setShowOtherLitigationType] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      litigationType: "",
      otherLitigationType: "",
      courtName: "",
      city: "",
      caseRegistrationNumber: "",
      myStatus: "",
      otherPartyName: "",
      lawyerName: "",
      lawyerContact: "",
      caseFillingDate: "",
      status: "",
      additionalInformation: "",
    },
  });

  const litigationMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(`/api/litigations`, data, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });
      return response.data.data.Litigation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("LitigationData");
      toast.success("Litigation added successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error submitting litigation:", error);
      toast.error("Failed to submit litigation");
    },
  });

  const onSubmit = (data) => {
    if (data.litigationType === "other") {
      data.litigationType = data.otherLitigationType;
    }
    if (data.caseFillingDate) {
      const date = new Date(data.caseFillingDate);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();
      const newdate = `${month}/${day}/${year}`;
      data.caseFillingDate = newdate;
    }
    delete data.otherLitigationType;

    litigationMutate.mutate(data);
  };

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button onClick={() => navigate("/litigation")}>Back</Button>
              <div>
                <CardTitle className="text-2xl font-bold">
                  Litigation Details
                </CardTitle>
                <CardDescription>
                  Fill out the Form to Add new Litigation Details.
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
            <div className="space-y-2">
              <Label htmlFor="litigationType">Type of Litigation</Label>
              <Controller
                name="litigationType"
                control={control}
                render={({ field }) => (
                  <Select
                    id="litigationType"
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setShowOtherLitigationType(value === "other");
                    }}
                    className={errors.litigationType ? "border-red-500" : ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type of Litigation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="court">Court/Tribunal Case</SelectItem>
                      <SelectItem value="criminal">Criminal</SelectItem>
                      <SelectItem value="civilSuit">Civil Suit</SelectItem>

                      <SelectItem value="arbitration">Arbitration</SelectItem>
                      <SelectItem value="employment">
                        Employment Litigation
                      </SelectItem>
                      <SelectItem value="professional">
                        Professional Case
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {showOtherLitigationType && (
                <Controller
                  name="otherLitigationType"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Specify Type of Litigation"
                      className="mt-2"
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  )}
                />
              )}
              {errors.litigationType && (
                <span className="text-red-500">
                  {errors.litigationType.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="courtName">Court/Forum Name</Label>
              <Label style={{ color: "red" }}>*</Label>
              <Controller
                name="courtName"
                control={control}
                render={({ field }) => (
                  <Input
                    id="courtName"
                    placeholder="Enter Court/Forum Name"
                    {...field}
                    className={errors.courtName ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.courtName && (
                <span className="text-red-500">{errors.courtName.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Label style={{ color: "red" }}>*</Label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Input
                    id="city"
                    placeholder="Enter City"
                    {...field}
                    className={errors.city ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.city && (
                <span className="text-red-500">{errors.city.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="caseRegistrationNumber">
                Case Registration Number
              </Label>
              <Label style={{ color: "red" }}>*</Label>
              <Controller
                name="caseRegistrationNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    id="caseRegistrationNumber"
                    placeholder="Enter Case Registration Number"
                    {...field}
                    className={
                      errors.caseRegistrationNumber ? "border-red-500" : ""
                    }
                  />
                )}
              />
              {errors.caseRegistrationNumber && (
                <span className="text-red-500">
                  {errors.caseRegistrationNumber.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="myStatus">My Status</Label>
              <Label style={{ color: "red" }}>*</Label>
              <Controller
                name="myStatus"
                control={control}
                render={({ field }) => (
                  <Select
                    id="myStatus"
                    value={field.value}
                    onValueChange={field.onChange}
                    className={errors.myStatus ? "border-red-500" : ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select My Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plaintiff">Plaintiff</SelectItem>
                      <SelectItem value="applicant">Applicant</SelectItem>
                      <SelectItem value="respondent">Respondent</SelectItem>
                      <SelectItem value="defendant">Defendant</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.myStatus && (
                <span className="text-red-500">{errors.myStatus.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="otherPartyName">Other Party Name</Label>
              <Label style={{ color: "red" }}>*</Label>
              <Controller
                name="otherPartyName"
                control={control}
                render={({ field }) => (
                  <Input
                    id="otherPartyName"
                    placeholder="Enter Other Party (Name & Address)"
                    {...field}
                    className={errors.otherPartyName ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.otherPartyName && (
                <span className="text-red-500">
                  {errors.otherPartyName.message}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="otherPartyAddress">Other Party Address</Label>
              <Label style={{ color: "red" }}>*</Label>
              <Controller
                name="otherPartyAddress"
                control={control}
                render={({ field }) => (
                  <Input
                    id="otherPartyAddress"
                    placeholder="Enter Other Party (Name & Address)"
                    {...field}
                    className={errors.otherPartyAddress ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.otherPartyAddress && (
                <span className="text-red-500">
                  {errors.otherPartyAddress.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lawyerName">Lawyer's Name on Record</Label>
              <Label style={{ color: "red" }}>*</Label>
              <Controller
                name="lawyerName"
                control={control}
                render={({ field }) => (
                  <Input
                    id="lawyerName"
                    placeholder="Enter Lawyer's Name"
                    {...field}
                    className={errors.lawyerName ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.lawyerName && (
                <span className="text-red-500">
                  {errors.lawyerName.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lawyerContact">Lawyer's Contact Number</Label>
              <Label style={{ color: "red" }}>*</Label>
              <Controller
                name="lawyerContact"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    id="lawyerContact"
                    type="tel"
                    placeholder="Enter Lawyer's Contact Number"
                    defaultCountry="in"
                    inputStyle={{ minWidth: "15.5rem" }}
                    {...field}
                    className={errors.lawyerContact ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.lawyerContact && (
                <span className="text-red-500">
                  {errors.lawyerContact.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="caseFillingDate">Date of Filing the Case</Label>
              <Label style={{ color: "red" }}>*</Label>
              <Controller
                name="caseFillingDate"
                control={control}
                render={({ field }) => (
                  <Datepicker value={field.value} onChange={field.onChange} />
                )}
              />
              {errors.caseFillingDate && (
                <span className="text-red-500">
                  {errors.caseFillingDate.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Input
                    id="status"
                    placeholder="Enter Status"
                    {...field}
                    className={errors.status ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.status && (
                <span className="text-red-500">{errors.status.message}</span>
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

            <CardFooter className="flex justify-end gap-2 mt-8">
              <Button type="submit">Submit</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LitigationForm;

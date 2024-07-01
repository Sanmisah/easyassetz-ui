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
  litigationType: z
    .string()
    .nonempty({ message: "Type of Litigation is required" }),
  otherLitigationType: z.string().optional(),
  courtName: z.string().nonempty({ message: "Court/Forum Name is required" }),
  city: z.string().nonempty({ message: "City is required" }),
  caseNumber: z
    .string()
    .nonempty({ message: "Case Registration Number is required" }),
  status: z.string().nonempty({ message: "My Status is required" }),
  otherParty: z
    .string()
    .nonempty({ message: "Other Party (Name & Address) is required" }),
  lawyerName: z
    .string()
    .nonempty({ message: "Lawyer's Name on Record is required" }),
  lawyerContact: z
    .string()
    .nonempty({ message: "Lawyer's Contact Number is required" }),
  filingDate: z.date({ message: "Date of Filing the Case is required" }),
  caseStatus: z.string().optional(),
  additionalInfo: z.string().optional(),
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
      caseNumber: "",
      status: "",
      otherParty: "",
      lawyerName: "",
      lawyerContact: "",
      filingDate: "",
      caseStatus: "",
      additionalInfo: "",
    },
  });

  const litigationMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(`/api/litigation`, data, {
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
    delete data.otherLitigationType;

    litigationMutate.mutate(data);
  };

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-2xl font-bold">
                Litigation Details
              </CardTitle>
              <CardDescription>
                Fill out the form to add new litigation details.
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
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Select
                    id="city"
                    value={field.value}
                    onValueChange={field.onChange}
                    className={errors.city ? "border-red-500" : ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new_york">New York</SelectItem>
                      <SelectItem value="los_angeles">Los Angeles</SelectItem>
                      <SelectItem value="chicago">Chicago</SelectItem>
                      <SelectItem value="houston">Houston</SelectItem>
                      <SelectItem value="phoenix">Phoenix</SelectItem>
                      {/* Add more cities as needed */}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.city && (
                <span className="text-red-500">{errors.city.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="caseNumber">Case Registration Number</Label>
              <Controller
                name="caseNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    id="caseNumber"
                    placeholder="Enter Case Registration Number"
                    {...field}
                    className={errors.caseNumber ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.caseNumber && (
                <span className="text-red-500">
                  {errors.caseNumber.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">My Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    id="status"
                    value={field.value}
                    onValueChange={field.onChange}
                    className={errors.status ? "border-red-500" : ""}
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
              {errors.status && (
                <span className="text-red-500">{errors.status.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="otherParty">Other Party (Name & Address)</Label>
              <Controller
                name="otherParty"
                control={control}
                render={({ field }) => (
                  <Input
                    id="otherParty"
                    placeholder="Enter Other Party (Name & Address)"
                    {...field}
                    className={errors.otherParty ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.otherParty && (
                <span className="text-red-500">
                  {errors.otherParty.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lawyerName">Lawyer's Name on Record</Label>
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
              <Label htmlFor="filingDate">Date of Filing the Case</Label>
              <Controller
                name="filingDate"
                control={control}
                render={({ field }) => (
                  <Datepicker value={field.value} onChange={field.onChange} />
                )}
              />
              {errors.filingDate && (
                <span className="text-red-500">
                  {errors.filingDate.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="caseStatus">Status</Label>
              <Controller
                name="caseStatus"
                control={control}
                render={({ field }) => (
                  <Input
                    id="caseStatus"
                    placeholder="Enter Status"
                    {...field}
                    className={errors.caseStatus ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.caseStatus && (
                <span className="text-red-500">
                  {errors.caseStatus.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Controller
                name="additionalInfo"
                control={control}
                render={({ field }) => (
                  <Input
                    id="additionalInfo"
                    placeholder="Enter Additional Information"
                    {...field}
                    className={errors.additionalInfo ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.additionalInfo && (
                <span className="text-red-500">
                  {errors.additionalInfo.message}
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

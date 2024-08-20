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
import Datepicker from "../../Beneficiarydetails/Datepicker";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@com/ui/select";

const FocusableSelectTrigger = forwardRef((props, ref) => (
  <SelectTrigger ref={ref} {...props} />
));

const schema = z.object({
  nameOfBorrower: z
    .string()
    .nonempty({ message: "Bank/Institution Name is required" }),
  address: z.string().nonempty({ message: "Loan Account Number is required" }),
  contactNumber: z.string().min(1, { message: "Contact Number is required" }),
  modeOfLoan: z.any().optional(),
  amount: z.any().optional(),
  dueDate: z.any().optional(),
  additionalInformation: z.any().optional(),
  type: z.any().optional(),
  chequeNumber: z.any().optional(),
  chequeIssuingBank: z.any().optional(),
  // hufShare: z.string().optional(),
  // name: z.string().optional(),
  // email: z.string().optional(),
});

const RecoverableEditForm = () => {
  const navigate = useNavigate();
  const { lifeInsuranceEditId } = useSelector((state) => state.counterSlice);
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const [showChequefields, setShowChequefields] = useState(false);
  const queryClient = useQueryClient();
  const [showOtherMetalType, setShowOtherMetalType] = useState(false);
  const [fourWheelerStatus, setfourWheelerStatus] = useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nameOfBorrower: "",
      address: "",
      contactNumber: "",
      modeOfLoan: "",
      amount: "",
      dueDate: "",
      additionalInformation: "",
      type: "recoverable",
      // assetDescription: "",
      // hufShare: "",
      // name: "",
      // email: "",
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
    setValue("nameOfBorrower", data.nameOfBorrower);
    setValue("address", data.address);
    setValue("contactNumber", data.contactNumber);
    setValue("modeOfLoan", data.modeOfLoan);
    setValue("amount", data.amount);
    setValue("dueDate", new Date(data.dueDate));
    // setValue("hufShare", data.hufShare);
    setValue("additionalInformation", data.additionalInformation);
    // setValue("name", data.name);
    // setValue("email", data.email);
    setValue("contactNumber", data.contactNumber);
    setValue("chequeNumber", data.chequeNumber);
    setValue("chequeIssuingBank", data.chequeIssuingBank);
    if (data.modeOfLoan === "cheque") {
      setShowChequefields(true);
    }
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
      return response.data.data.OtherAsset;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("loanData");
      toast.success("Other Asset updated successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error updating loan:", error);
      toast.error("Failed to update loan");
    },
  });
  const formatDate = (date) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const onSubmit = (data) => {
    console.log(data);
    // data.type = "huf";
    if (data.dueDate) {
      data.dueDate = formatDate(data.dueDate);
    }
    // data.startDate = formatDate(data.startDate);
    // data.type = "vehicle";
    loanMutate.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading recoverable data</div>;

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button onClick={() => navigate("/recoverable")}>Back</Button>
              <div>
                <CardTitle className="text-2xl font-bold">
                  Edit Recoverable Details
                </CardTitle>
                <CardDescription>
                  Update the form to edit the Recoverable details.
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
                <Label htmlFor="nameOfBorrower">Name of Borrower</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="nameOfBorrower"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="nameOfBorrower"
                      placeholder="Enter Name of Borrower"
                      {...field}
                      className={errors.nameOfBorrower ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.nameOfBorrower && (
                  <span className="text-red-500">
                    {errors.nameOfBorrower.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="address"
                      placeholder="Enter Address"
                      {...field}
                      className={errors.address ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.address && (
                  <span className="text-red-500">{errors.address.message}</span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Label style={{ color: "red" }}>*</Label>
              <Controller
                name="contactNumber"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    id="contactNumber"
                    type="tel"
                    placeholder="Enter Contact Number"
                    defaultCountry="in"
                    inputStyle={{ minWidth: "15.5rem" }}
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.contactNumber && (
                <span className="text-red-500">
                  {errors.contactNumber.message}
                </span>
              )}
            </div>
            <div className="space-y-2 col-span-full">
              <Label>Mode of Loan </Label>
              <Controller
                name="modeOfLoan"
                control={control}
                defaultValue={Benifyciary?.modeOfLoan || ""}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    defaultValue={Benifyciary?.modeOfLoan || ""}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setShowChequefields(value === "cheque");
                    }}
                    className="flex items-center gap-2"
                  >
                    <div className="flex items-center gap-2 text-center">
                      <RadioGroupItem
                        defaultChecked={Benifyciary?.modeOfLoan === "cash"}
                        id="cash"
                        value="cash"
                      />
                      <Label htmlFor="cash">Cash</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        defaultChecked={Benifyciary?.modeOfLoan === "cheque"}
                        id="cheque"
                        value="cheque"
                      />
                      <Label htmlFor="cheque">Cheque</Label>
                    </div>
                  </RadioGroup>
                )}
              />
              {errors.modeOfLoan && (
                <span className="text-red-500">
                  {errors.modeOfLoan.message}
                </span>
              )}
            </div>
            {showChequefields && (
              <>
                <div className="space-y-2">
                  <Label>Cheque Number</Label>
                  <Controller
                    name="chequeNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="chequeNumber"
                        placeholder="Enter cheque number"
                        {...field}
                        className={errors.chequeNumber ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors.chequeNumber && (
                    <span className="text-red-500">
                      {errors.chequeNumber.message}
                    </span>
                  )}
                </div>
                <div>
                  <Label>Cheque issuing Bank</Label>
                  <Controller
                    name="chequeIssuingBank"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="chequeIssuingBank"
                        placeholder="Enter cheque issuing bank"
                        {...field}
                        className={
                          errors.chequeIssuingBank ? "border-red-500" : ""
                        }
                      />
                    )}
                  />
                  {errors.chequeIssuingBank && (
                    <span className="text-red-500">
                      {errors.chequeIssuingBank.message}
                    </span>
                  )}
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <Input
                    id="amount"
                    placeholder="Enter Amount"
                    {...field}
                    className={errors.amount ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.amount && (
                <span className="text-red-500">{errors.amount.message}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Controller
                name="dueDate"
                control={control}
                defaultValue={new Date(Benifyciary?.dueDate) || ""}
                render={({ field }) => (
                  <Datepicker
                    {...field}
                    onChange={(date) => field.onChange(date)}
                    selected={field.value}
                    value={field.value || Benifyciary?.dueDate || ""}
                  />
                )}
              />
              {errors.dueDate && (
                <span className="text-red-500">{errors.dueDate.message}</span>
              )}
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="hufShare">Share of Huf</Label>
              <Controller
                name="hufShare"
                control={control}
                render={({ field }) => (
                  <Input
                    id="hufShare"
                    placeholder="Enter Share of Huf"
                    {...field}
                    className={errors.hufShare ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.hufShare && (
                <span className="text-red-500">{errors.hufShare.message}</span>
              )}
            </div> */}
            <div className="space-y-2">
              <Label>Additional Information</Label>
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
            {/* <div className="space-y-2">
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
            </div> */}

            {/* <div className="space-y-2">
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
            </div> */}

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

export default RecoverableEditForm;

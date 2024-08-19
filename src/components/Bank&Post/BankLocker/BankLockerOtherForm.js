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
import { RadioGroup, RadioGroupItem } from "@com/ui/radio-group";
// import Datepicker from "../../Beneficiarydetails/Datepicker";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Addnominee from "@/components/Nominee/addNominee";
import cross from "@/components/image/close.png";
import { PhoneInput } from "react-international-phone";
import Datepicker from "../../Beneficiarydetails/Datepicker";

const schema = z.object({
  bankName: z.string().nonempty({ message: "Insurance Company is required" }),
  branch: z.string().optional(),
  otherBankName: z.any().optional(),

  lockerNumber: z
    .string()
    .nonempty({ message: "Insurance Sub Type is required" }),

  jointHolderName: z.any().optional(),
  jointHolderPan: z.any().optional(),
  rentDueDate: z.any().optional(),
  annualRent: z.any().optional(),
  additionalDetails: z.any().optional(),
  branch: z.string().min(2, { message: "Policy Number is required" }),
  holdingType: z.any().optional(),
  image: z.any().optional(),
});
// .refine(
//   (data) => {
//     if (data.modeOfPurchase === "single") {
//       return (
//         !!data.brokerName &&
//         !!data.contactPerson &&
//         !!data.contactNumber &&
//         !!data.email
//       );
//     }
//     if (data.modeOfPurchase === "joint") {
//       return !!data.jointHolderName && !!data.jointHolderPan;
//     }
//     return true;
//   },
//   {
//     message: "Required fields are missing",
//     path: ["holdingType"],
//   }
// );

const FocusableSelectTrigger = forwardRef((props, ref) => (
  <SelectTrigger ref={ref} {...props} />
));

FocusableSelectTrigger.displayName = "FocusableSelectTrigger";

const BankLockerForm = () => {
  const navigate = useNavigate();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const queryClient = useQueryClient();
  const [showOtherBankName, setShowOtherBankName] = useState(false);
  const [showOtherAccountType, setShowOtherAccountType] = useState(false);
  const [showOtherRelationship, setShowOtherRelationship] = useState(false);
  const [hideRegisteredFields, setHideRegisteredFields] = useState(false);
  const [selectedNommie, setSelectedNommie] = useState([]);
  const [showJointHolderName, setShowJointHolderName] = useState(false);
  const [displaynominie, setDisplaynominie] = useState([]);
  const [brokerSelected, setBrokerSelected] = useState(true);
  const [nomineeerror, setnomineeerror] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      bankName: "",
      accountType: "",
      accountNumber: "",
      branch: "",
      city: "",
      holdingType: "",
      jointHolderName: "",
    },
  });

  const bankAccountMutate = useMutation({
    mutationFn: async (data) => {
      console.log("data:", data);
      const formData = new FormData();
      for (const [key, value] of Object.entries(data)) {
        formData.append(key, value);
      }
      const response = await axios.post(`/api/bank-lockers`, formData, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });

      return response.data.data.BankLocker;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("LifeInsuranceData");
      toast.success("Bank Account added successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile");
    },
  });
  useEffect(() => {
    if (selectedNommie.length > 0) {
      setnomineeerror(false);
    }
  }, [selectedNommie, nomineeerror]);

  const onSubmit = (data) => {
    if (data.bankName === "other") {
      data.bankName = data.otherBankName;
    }
    if (data.rentDueDate) {
      const date = new Date(data.rentDueDate);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();
      const newdate = `${month}/${day}/${year}`;
      data.rentDueDate = newdate;
    }

    if (data.accountType === "other") {
      data.accountType = data.otherAccountType;
    }

    if (selectedNommie.length > 1) {
      setnomineeerror(false);
    }
    data.nominees = selectedNommie;
    bankAccountMutate.mutate(data);
  };

  useEffect(() => {
    console.log("displaynominie:", displaynominie);
  }, [displaynominie]);

  return (
    <div className="w-full">
      <Card className="w-full ">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button onClick={() => navigate("/banklocker")}>Back</Button>
            <div>
              <CardTitle className="text-2xl font-bold">
                Bank Locker Details
              </CardTitle>
              <CardDescription>
                Fill out the form to add new bank locker details.
              </CardDescription>
            </div>
          </div>
        </div>
        <CardContent className="grid gap-6 ">
          <form
            className="space-y-6 flex flex-col"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="bankName"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="bankName"
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherBankName(value === "other");
                      }}
                      className={errors.companyName ? "border-red-500" : ""}
                    >
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select Bank Name" />
                      </FocusableSelectTrigger>
                      <SelectContent>
                        <SelectItem value="company1">Company 1</SelectItem>
                        <SelectItem value="company2">Company 2</SelectItem>
                        <SelectItem value="company3">Company 3</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {showOtherBankName && (
                  <Controller
                    name="otherBankName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Bank Name"
                        className="mt-2"
                      />
                    )}
                  />
                )}
                {errors.bankName && (
                  <span className="text-red-500">
                    {errors.bankName.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch">Branch Name</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="branch"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="branch"
                      placeholder="Enter Branch Name"
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
                <Label>Locker Number</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="lockerNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="lockerNumber"
                      placeholder="Enter locker number"
                      {...field}
                      className={errors.lockerNumber ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.lockerNumber && (
                  <span className="text-red-500">
                    {errors.lockerNumber.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="rentDueDate">Rent Due</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="rentDueDate"
                  control={control}
                  render={({ field }) => (
                    <Datepicker
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      className={errors.rentDueDate ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.rentDueDate && (
                  <span className="text-red-500">
                    {errors.rentDueDate.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="annualRent">Annual Rent</Label>
                <Controller
                  name="annualRent"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="annualRent"
                      placeholder="Enter annual rent"
                      {...field}
                      className={errors.annualRent ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.annualRent && (
                  <span className="text-red-500">
                    {errors.annualRent.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalDetails">Additional Details</Label>
                <Controller
                  name="additionalDetails"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      value={field.value}
                      id="additionalDetails"
                      placeholder="Enter additional details"
                      {...field}
                    />
                  )}
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="holdingType">Nature of Holding</Label>
                <Controller
                  name="holdingType"
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
                {errors.holdingType && (
                  <span className="text-red-500">
                    {errors.holdingType.message}
                  </span>
                )}
              </div>
              {showJointHolderName && (
                <Controller
                  name="jointHolderName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="jointHolderName"
                      placeholder="Enter Joint Holder Name"
                      {...field}
                      className={errors.jointHolderName ? "border-red-500" : ""}
                    />
                  )}
                />
              )}
              {showJointHolderName && (
                <Controller
                  name="jointHolderPan"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="jointHolderPan"
                      placeholder="Enter Joint Holder PAN"
                      {...field}
                      className={errors.jointHolderPan ? "border-red-500" : ""}
                    />
                  )}
                />
              )}
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
                                (item) => item !== nominee.id
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
              <Label htmlFor="registered-mobile" className="text-lg font-bold">
                Add nominee
              </Label>
              <Addnominee
                setDisplaynominie={setDisplaynominie}
                setSelectedNommie={setSelectedNommie}
                displaynominie={displaynominie}
              />
              {nomineeerror && (
                <span className="text-red-500">
                  Please select atleast one nominee
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="image-upload">Image Upload</Label>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <Input
                    id="image-upload"
                    type="file"
                    onChange={(event) => {
                      field.onChange(
                        event.target.files && event.target.files[0]
                      );
                      console.log("sadsA", event.target.files);
                    }}
                    className={errors.image ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.image && (
                <span className="text-red-500">{errors.image.message}</span>
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

export default BankLockerForm;

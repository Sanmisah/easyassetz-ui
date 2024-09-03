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
import { Autocompeleteadd } from "../../Reuseablecomponent/Autocompeleteadd";

const schema = z.object({
  bankName: z
    .string()
    .nonempty({ message: "Bank/Institution Name is required" }),
  otherBankName: z.string().optional(),
  accountType: z.string().nonempty({ message: "Account Type is required" }),
  otherAccountType: z.string().optional(),
  accountNumber: z.string().nonempty({ message: "Account Number is required" }),
  branchName: z.string().optional(),
  city: z.any().optional(),
  holdingType: z.any().optional(),
  jointHolderName: z.any().optional(),
  jointHolderPan: z.any().optional(),
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

const BankAccountForm = () => {
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
  const [inputvaluearray, setInputvaluearray] = useState({});
  const [values, setValues] = useState("");
  const frameworks = {
    companyName: [
      { value: "company1", label: "Company1" },
      { value: "company2", label: "Company2" },
      { value: "company3", label: "Company3" },
    ],
    accountType: [
      { value: "savings", label: "Savings Account" },
      { value: "current", label: "Current Account" },
      { value: "recurring", label: "Recurring Account" },
      { value: "nri", label: "NRI Account" },
    ],
  };
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      bankName: "",
      accountType: "",
      accountNumber: "",
      branchName: "",
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
      const response = await axios.post(`/api/bank-accounts`, formData, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });

      return response.data.data.BankAccount;
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
    // Disable the submit button
    const submitButton = document.getElementById("submitButton");
    console.log(submitButton);
    submitButton.disabled = true;
    try {
      if (data.bankName === "other") {
        data.bankName = data.otherBankName;
      }
      if (data.accountType === "other") {
        data.accountType = data.otherAccountType;
      }
      // if (data.modeOfPurchase === "single") {
      //   data.jointHolderName = null;
      //   data.jointHolderPan = null;
      // }
      // if (data.modeOfPurchase === "joint") {
      //   data.brokerName = null;
      //   data.contactPerson = null;
      //   data.contactNumber = null;
      //   data.email = null;
      // }
      // const date = new Date(data.expiryDate);
      // const month = String(date.getMonth() + 1).padStart(2, "0");
      // const day = String(date.getDate()).padStart(2, "0");
      // const year = date.getFullYear();
      // const newdate = `${month}/${day}/${year}`;
      // data.expiryDate = newdate;
      data.nominees = selectedNommie;
      bankAccountMutate.mutate(data);
    } catch (error) {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile");
    } finally {
      // Re-enable the submit button after submission attempt
      submitButton.disabled = false;
    }
  };

  useEffect(() => {
    console.log("displaynominie:", displaynominie);
  }, [displaynominie]);

  return (
    <div className="w-full">
      <Card className="w-full ">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Bank Account Details
                </CardTitle>
                <CardDescription>
                  Fill out the form to add new bank account details.
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
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
                    <Autocompeleteadd
                      options={frameworks.companyName}
                      placeholder="Select Bank  Name..."
                      emptyMessage="No Bank Name Found."
                      value={values}
                      array={inputvaluearray}
                      setarray={setInputvaluearray}
                      variable="bankName"
                      onValueChange={(value) => {
                        setValues(value);
                        console.log(value);
                        setValue("bankName", value?.value);
                      }}
                    />
                  )}
                />

                {errors.bankName && (
                  <span className="text-red-500">
                    {errors.bankName.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountType">Account Type</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="accountType"
                  control={control}
                  render={({ field }) => (
                    <Autocompeleteadd
                      options={frameworks.accountType}
                      placeholder="Select Account Type..."
                      emptyMessage="No Account Type Found."
                      value={values}
                      array={inputvaluearray}
                      setarray={setInputvaluearray}
                      variable="accountType"
                      onValueChange={(value) => {
                        setValues(value);
                        console.log(value);
                        setValue("accountType", value?.value);
                      }}
                    />
                  )}
                />

                {errors.bankName && (
                  <span className="text-red-500">
                    {errors.bankName.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="accountNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="accountNumber"
                      placeholder="Enter Account Number"
                      {...field}
                      className={errors.accountNumber ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.accountNumber && (
                  <span className="text-red-500">
                    {errors.accountNumber.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="branchName">Branch Name</Label>
                <Controller
                  name="branchName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="branchName"
                      placeholder="Enter Branch Name"
                      {...field}
                      className={errors.branchName ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.branchName && (
                  <span className="text-red-500">
                    {errors.branchName.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="city"
                      placeholder="Enter Branch Name"
                      {...field}
                      className={errors.city ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.city && (
                  <span className="text-red-500">{errors.city.message}</span>
                )}
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
                      value={field.value?.toUpperCase() || ""}
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
              <Label>Upload File</Label>
              <Controller
                name="image"
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

export default BankAccountForm;

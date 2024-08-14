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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { PhoneInput } from "react-international-phone";
import Addnominee from "@/components/Nominee/addNominee";
import { RadioGroup, RadioGroupItem } from "@com/ui/radio-group";
import cross from "@/components/image/close.png";
import Nominee from "../Nominee";

const schema = z.object({
  bankName: z.string().nonempty({ message: "Bank Name is required" }),
  ppfAccountNo: z.string().nonempty({ message: "Company Address is required" }),
  branch: z.any().optional(),
  // myStatus: z.string().nonempty({ message: "My Status is required" }),
  natureOfHolding: z.any().optional(),
  jointHolderName: z.string().optional(),
  jointHolderPan: z.string().optional(),
  // documentAvailability: z
  //   .string()
  //   .nonempty({ message: "Document Availability is required" }),
  additionalDetails: z.string().optional(),
  // typeOfInvestment: z
  //   .string()
  //   .nonempty({ message: "Type of Investment is required" }),
  name: z.string().optional(),
  mobie: z.string().optional(),
  email: z.string().optional(),
  image: z.any().optional(),
});

const FocusableSelectTrigger = forwardRef((props, ref) => (
  <SelectTrigger ref={ref} {...props} />
));

FocusableSelectTrigger.displayName = "FocusableSelectTrigger";

const ppfForm = () => {
  const navigate = useNavigate();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const queryClient = useQueryClient();
  const [showOtherCompanyRegistration, setShowOtherCompanyRegistration] =
    useState(true);
  const [showOtherMyStatus, setShowOthermyStatus] = useState(false);
  const [showOtherArticleDetails, setShowOtherArticleDetails] = useState(false);
  const [showOthertypeOfInvestment, setShowOthertypeOfInvestment] =
    useState(false);
  const [showOtherPPFAccountNo, setShowOtherPPFAccountNo] = useState(false);
  const [showOtherCompanyName, setshowOtherCompanyName] = useState(false);
  const [selectedNommie, setSelectedNommie] = useState([]);
  const [nomineeerror, setNomineeError] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(null);
  const [displaynominie, setDisplaynominie] = useState([]);

  const [selectedFamilyMembers, setSelectedFamilyMembers] = useState([]);
  const [displayFamilyMembers, setDisplayFamilyMembers] = useState([]);

  const [showOtherJointName, setShowOtherJointName] = useState(false);
  const {
    handleSubmit,
    control,
    register,
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
      jointHolderPan: "",
      additionalDetails: "",
      name: "",
      email: "",
      phone: "",
    },
  });

  const lifeInsuranceMutate = useMutation({
    mutationFn: async (data) => {
      const Formdata = new FormData();
      Formdata.append("image", data.image);

      for (const [key, value] of Object.entries(data)) {
        Formdata.append(key, value);
      }
      const response = await axios.post(`/api/public-provident-funds`, data, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });

      return response.data.data.PublicProvidentFund;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("LifeInsuranceData");
      toast.success("Public Providend Fund details added successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile");
    },
  });

  useEffect(() => {
    if (selectedNommie.length > 0) {
      setNomineeError(false);
    }
  }, [selectedNommie]);

  const onSubmit = (data) => {
    console.log(data);
    // data.firmsRegistrationNumberType = showOtherCompanyRegistration;

    // if (selectedNommie.length < 1) {
    //   toast.error("Please select atleast one nominee");
    //   setNomineeError(true);
    //   return;
    // }
    // if (data.typeOfInvestment === "other") {
    //   data.typeOfInvestment = data.specifyInvestment;
    // }
    if (selectedNommie.length > 0) {
      data.nominees = selectedNommie;
    }
    data.type = "company";

    data.mobile = phone;
    // if (data) {
    //   data.firmName = data.otherFirmName;
    // }
    data.jointHoldersName = selectedFamilyMembers;

    lifeInsuranceMutate.mutate(data);
  };

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <Button onMouseDown={() => navigate("/ppf")}>Back</Button>
              <div>
                <CardTitle className="text-2xl font-bold">
                  Public Providend Fund
                </CardTitle>
                <CardDescription>
                  Fill out the form to add a new Public Providend Fund.
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
              <Label htmlFor="bankName">Post/Bank name</Label>
              <Label style={{ color: "red" }}>*</Label>
              <Controller
                name="bankName"
                control={control}
                render={({ field }) => (
                  <Input
                    id="bankName"
                    placeholder="Enter Post/Bank name"
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className={errors.bankName ? "border-red-500" : ""}
                  />
                )}
              />

              {errors.bankName && (
                <span className="text-red-500">{errors.bankName.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ppfAccountNo">PPF Account Number</Label>
              <Label style={{ color: "red" }}>*</Label>
              <Controller
                name="ppfAccountNo"
                control={control}
                render={({ field }) => (
                  <Input
                    id="ppfAccountNo"
                    placeholder="Enter Company Address"
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className={errors.ppfAccountNo ? "border-red-500" : ""}
                  />
                )}
              />
              {showOtherPPFAccountNo && (
                <Controller
                  name="otherPPFAccountNo"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Specify PPF Account Number"
                      className="mt-2"
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  )}
                />
              )}
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
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className={errors.branch ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.branch && (
                <span className="text-red-500">{errors.branch.message}</span>
              )}
            </div>

            <div className="space-y-4 flex flex-col">
              <Label className="text-lg font-bold">Holding Type</Label>
              <Controller
                name="natureOfHolding"
                defaultValues="single"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    defaultValue="single"
                    onValueChange={(value) => {
                      field.onChange(value);
                      setShowOtherJointName(value === "joint");
                    }}
                    className="flex items-center gap-2"
                  >
                    <div className="flex items-center gap-2 text-center">
                      <RadioGroupItem id="single" value="single" />
                      <Label htmlFor="single">Single</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id="joint" value="joint" />
                      <Label htmlFor="joint">Joint Name</Label>
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

            {showOtherJointName && (
              // <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              //   <div className="space-y-2">
              //     <Label htmlFor="jointHolderName">Joint Holder Name</Label>
              //     <Input
              //       id="jointHolderName"
              //       placeholder="Enter Joint Holder Name"
              //       {...register("jointHolderName")}
              //       className={errors.jointHolderName ? "border-red-500" : ""}
              //     />
              //     {errors.jointHolderName && (
              //       <span className="text-red-500">
              //         {errors.jointHolderName.message}
              //       </span>
              //     )}
              //   </div>
              //   <div className="space-y-2">
              //     <Label htmlFor="jointHolderPan">Joint Holder PAN</Label>
              //     <Input
              //       id="jointHolderPan"
              //       placeholder="Enter Joint Holder PAN"
              //       {...register("jointHolderPan")}
              //       className={errors.jointHolderPan ? "border-red-500" : ""}
              //     />
              //     {errors.jointHolderPan && (
              //       <span className="text-red-500">
              //         {errors.jointHolderPan.message}
              //       </span>
              //     )}
              //   </div>
              // </div>

              <>
                <div>
                  {displayFamilyMembers && displayFamilyMembers.length > 0 && (
                    <div className="space-y-2">
                      <div className="grid gap-4 py-4">
                        <Label className="text-lg font-bold">
                          Selected Nominees
                        </Label>
                        {displayFamilyMembers &&
                          displayFamilyMembers.map((nominee) => (
                            <div className="flex space-y-2 border border-input p-4 justify-between pl-4 pr-4 items-center rounded-lg">
                              <Label htmlFor={`nominee-${nominee?.id}`}>
                                {nominee?.fullLegalName || nominee?.charityName}
                              </Label>
                              <img
                                className="w-4 h-4 cursor-pointer"
                                onClick={() => {
                                  setDisplayFamilyMembers(
                                    displayFamilyMembers.filter(
                                      (item) => item.id !== nominee.id
                                    )
                                  );
                                  setSelectedFamilyMembers(
                                    selectedFamilyMembers.filter(
                                      (item) => item.id !== nominee.id
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registered-phone">Add Family Members</Label>
                  <Nominee
                    setSelectedNommie={setSelectedFamilyMembers}
                    selectedNommie={selectedFamilyMembers}
                    displaynominie={displayFamilyMembers}
                    setDisplaynominie={setDisplayFamilyMembers}
                  />{" "}
                </div>
              </>
            )}
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
                                (item) => item.id !== nominee.id
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
              <Label htmlFor="registered-phone">Add nominee</Label>
              <Addnominee
                setSelectedNommie={setSelectedNommie}
                selectedNommie={selectedNommie}
                displaynominie={displaynominie}
                setDisplaynominie={setDisplaynominie}
              />{" "}
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalDetails">Additional Information</Label>
              <Controller
                name="additionalDetails"
                control={control}
                render={({ field }) => (
                  <Input
                    id="additionalDetails"
                    placeholder="Enter Additional Information"
                    {...field}
                    value={field.value || ""}
                    onChange={field.onChange}
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
            <div className="w-full grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="additionalDetails">Point Of Contact</Label>
                <div className="mt-2  flex item-center  gap-2 justify-between">
                  <div className="w-[40%] space-y-2 item-center">
                    <Label htmlFor="name">Name</Label>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="name"
                          placeholder="Enter Name"
                          {...field}
                          value={field.value}
                          onChange={field.onChange}
                          className={errors.name ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.name && (
                      <span className="text-red-500">
                        {errors.name.message}
                      </span>
                    )}
                  </div>
                  <div className="w-[40%] space-y-2">
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
                      <span className="text-red-500">
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                  <div className="w-[40%] space-y-2">
                    <Label htmlFor="phone">Phone</Label>
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
                          value={field.value}
                          onChange={(value) => {
                            console.log(value);
                            setValue("mobile", value);
                            setPhone(value);
                          }}
                        />
                      )}
                    />
                    {errors.phone && (
                      <span className="text-red-500">
                        {errors.phone.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2 col-span-full">
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
              <Button type="submit">Submit</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ppfForm;

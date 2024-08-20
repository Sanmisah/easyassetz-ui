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
import Addnominee from "@/components/Nominee/addNominee";
import cross from "@/components/image/close.png";
import { RadioGroup, RadioGroupItem } from "@com/ui/radio-group";
import { PhoneInput } from "react-international-phone";
import { Checkbox } from "@/shadcncomponents/ui/checkbox";

const FocusableSelectTrigger = forwardRef((props, ref) => (
  <SelectTrigger ref={ref} {...props} />
));
const schema = z.object({
  propertyType: z.any().optional(),
  surveyNumber: z.string().nonempty({ message: "Survey Number is required" }),
  address: z.string().nonempty({ message: "Address is required" }),
  villageName: z.string().nonempty({ message: "Village Name is required" }),
  district: z.string().nonempty({ message: "District is required" }),
  taluka: z.string().nonempty({ message: "Taluka is required" }),
  ownershipByVirtueOf: z
    .string()
    .nonempty({ message: "Ownership By Virtue Of is required" }),
  ownershipType: z.string().nonempty({ message: "Ownership Type is required" }),
  firstHoldersName: z.any().optional(),
  firstHoldersRelation: z.any().optional(),
  firstHoldersPan: z.any().optional(),
  firstHoldersAadhar: z.any().optional(),
  jointHoldersName: z.any().optional(),
  jointHoldersRelation: z.any().optional(),
  jointHoldersPan: z.any().optional(),
  jointHoldersAadhar: z.any().optional(),
  anyLoanLitigation: z.any().optional(),
  name: z.any().optional(),
  mobile: z.any().optional(),
  email: z.any().optional(),
});

const ResidentialEditForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const [showOtherMetalType, setShowOtherMetalType] = useState(false);
  const [showOtherArticleDetails, setShowOtherArticleDetails] = useState(false);
  const { lifeInsuranceEditId } = useSelector((state) => state.counterSlice);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState(null);
  const [defaultValues, setDefaultValues] = useState(null);
  const [jointHolderName, setJointHolderName] = useState(false);
  const [Joinholder, setJoinholder] = useState(false);
  const [displaynominie, setDisplaynominie] = useState([]);
  const [selectedNommie, setSelectedNommie] = useState([]);
  const [numberOfArticles, setNumberOfArticles] = useState(null);
  const [Litigation, setLitigation] = useState(false);

  useEffect(() => {
    if (lifeInsuranceEditId) {
      console.log("lifeInsuranceEditId:", lifeInsuranceEditId);
    }
  }, [lifeInsuranceEditId]);

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
    const response = await axios.get(`/api/lands/${lifeInsuranceEditId}`, {
      headers: {
        Authorization: `Bearer ${user.data.token}`,
      },
    });
    const data = response.data.data.Land;
    // console.log("bullion:", bullion);
    setValue("propertyType", data.propertyType);
    setValue("surveyNumber", data.surveyNumber);
    setValue("address", data.address);
    setValue("villageName", data.villageName);
    setValue("district", data.district);
    setValue("taluka", data.taluka);
    setValue("state", data.state);
    setValue("propertyStatus", data.propertyStatus);
    setValue("ownershipByVirtueOf", data.ownershipByVirtueOf);
    setValue("ownershipType", data.ownershipType);
    setValue("firstHoldersName", data.firstHoldersName);
    setValue("firstHoldersRelation", data.firstHoldersRelation);
    setValue("firstHoldersAadhar", data.firstHoldersAadhar);
    setValue("firstHoldersPan", data.firstHoldersPan);
    setValue("jointHoldersName", data.jointHoldersName);
    setValue("joinHoldersRelation", data.joinHoldersRelation);
    setValue("jointHoldersPan", data.jointHoldersPan);
    setValue("jointHoldersAadhar", data.jointHoldersAadhar);
    setValue("anyLoanLitigation", data.anyLoanLitigation);
    setValue("name", data.name);
    setValue("mobile", data.mobile);
    setValue("email", data.email);
    setValue("anyLoanLitigation", data.anyLoanLitigation);
    if (data.ownershipType === "joint") {
      setJoinholder(true);
    }
    setSelectedNommie(data.nominees?.map((nominee) => nominee.id));
    return response.data.data.Land;
  };

  const {
    data: Benifyciary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bullionDataUpdate", lifeInsuranceEditId],
    queryFn: getPersonalData,
    onSuccess: (data) => {
      reset(data);
      setDefaultValues(data);
      setValue("propertyType", data.propertyType);
      setValue("surveyNumber", data.surveyNumber);
      setValue("address", data.address);
      setValue("villageName", data.villageName);
      setValue("district", data.district);
      setValue("taluka", data.taluka);
      setValue("state", data.state);
      setValue("propertyStatus", data.propertyStatus);
      setValue("ownershipByVirtueOf", data.ownershipByVirtueOf);
      setValue("ownershipType", data.ownershipType);
      setValue("firstHoldersName", data.firstHoldersName);
      setValue("firstHoldersRelation", data.firstHoldersRelation);
      setValue("firstHoldersAadhar", data.firstHoldersAadhar);
      setValue("firstHoldersPan", data.firstHoldersPan);
      setValue("jointHoldersName", data.jointHoldersName);
      setValue("jointHoldersRelation", data.jointHoldersRelation);
      setValue("jointHoldersPan", data.jointHoldersPan);
      setValue("jointHoldersAadhar", data.jointHoldersAadhar);
      setValue("anyLoanLitigation", data.anyLoanLitigation);
      setValue("litigationFile", data.litigationFile);
      setValue("name", data.name);
      setValue("mobile", data.mobile);
      setValue("email", data.email);

      // Set fetched values to the form
      for (const key in data) {
        setValue(key, data[key]);
      }
    },
    onError: (error) => {
      console.error("Error fetching profile:", error);
      toast.error("Failed to fetch profile");
    },
  });

  const bullionMutate = useMutation({
    mutationFn: async (data) => {
      const Formdata = new FormData();
      Formdata.append("bullionFile", data.bullionFile);

      for (const [key, value] of Object.entries(data)) {
        Formdata.append(key, value);
      }
      Formdata.append("_method", "put");
      const response = await axios.post(
        `/api/lands/${lifeInsuranceEditId}`,
        Formdata,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      return response.data.data.ResidentialProperty;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("bullionDataUpdate", lifeInsuranceEditId);
      toast.success("Land  updated successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile");
    },
  });

  const onSubmit = (data) => {
    console.log("data:", data);

    bullionMutate.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading Land data</div>;

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <div className="flex md:flex-row items-start md:items-center justify-between gap-2">
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  navigate("/land");
                }}
                className="text-sm"
              >
                Back
              </Button>
              <div>
                <CardTitle className="text-2xl font-bold">
                  Land Details
                </CardTitle>
                <CardDescription>
                  Fill out the form to add a new Land.
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
                <Label htmlFor="propertyType">Property Type</Label>
                <Controller
                  name="propertyType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="propertyType"
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherMetalType(value === "other");
                      }}
                      className={errors.propertyType ? "border-red-500" : ""}
                    >
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select Property Type" />
                      </FocusableSelectTrigger>
                      <SelectContent>
                        <SelectItem value="agriculturalLand">
                          Agricultural Land
                        </SelectItem>
                        <SelectItem value="nonAgriculturalLand">
                          Non-Agricultural Land
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.propertyType && (
                  <span className="text-red-500">
                    {errors.propertyType.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="surveyNumber">House Number</Label>
                <Controller
                  name="surveyNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="surveyNumber"
                      placeholder="Enter Survey Number"
                      {...field}
                      className={errors.surveyNumber ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.surveyNumber && (
                  <span className="text-red-500">
                    {errors.surveyNumber.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address Line</Label>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="address"
                      placeholder="Enter Address Line 1"
                      {...field}
                      className={errors.address ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.address && (
                  <span className="text-red-500">{errors.address.message}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="villageName">Village Name</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="villageName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="villageName"
                      placeholder="Enter Pincode"
                      {...field}
                      className={errors.villageName ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.villageName && (
                  <span className="text-red-500">
                    {errors.villageName.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="district"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="district"
                      placeholder="Enter Area"
                      {...field}
                      className={errors.district ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.district && (
                  <span className="text-red-500">
                    {errors.district.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="taluka">Taluka</Label>
                <Controller
                  name="taluka"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="taluka"
                      placeholder="Enter City"
                      {...field}
                      className={errors.taluka ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.taluka && (
                  <span className="text-red-500">{errors.taluka.message}</span>
                )}
              </div>

              <div className="space-y-2 col-span-full">
                <Label className="text-lg font-bold mt-8">
                  Ownership Details
                </Label>
              </div>

              <div className="space-y-2 ">
                <Label htmlFor="ownershipByVirtueOf">
                  Ownership By Virtue Of
                </Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="ownershipByVirtueOf"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2 text-center flex-wrap">
                        <div className="flex items-center gap-2 text-center flex-wrap">
                          <RadioGroupItem
                            id="selfpurchase"
                            value="selfpurchase"
                          />
                          <Label htmlFor="selfpurchase">Selfpurchase</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem id="asagift" value="asagift" />
                          <Label htmlFor="asagift">As a gift</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem
                            id="ancestralland"
                            value="ancestralland"
                          />
                          <Label htmlFor="ancestralland">Ancestral Land</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  )}
                />
                {errors.ownershipByVirtueOf && (
                  <span className="text-red-500">
                    {errors.ownershipByVirtueOf.message}
                  </span>
                )}
              </div>
              <div className="space-y-2 ">
                <Label htmlFor="ownershipByVirtueOf">Ownership Type</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="ownershipType"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setJoinholder(value === "joint");
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
                {errors.ownershipType && (
                  <span className="text-red-500">
                    {errors.ownershipType.message}
                  </span>
                )}
              </div>
              <div>
                {Joinholder && (
                  <div className="space-y-2 wrap col-span-full">
                    <Label> First Joint Holder Name</Label>
                    <Controller
                      name="firstHoldersName"
                      control={control}
                      // rules={{
                      //   required:
                      //     Joinholder && "First Joint Holder Name is required",
                      // }}
                      render={({ field }) => (
                        <Input
                          defaultValue={Benifyciary?.firstHoldersName || ""}
                          id="firstHoldersName"
                          placeholder="Enter Joint Holder Name"
                          {...field}
                          className={
                            errors.firstHoldersName ? "border-red-500" : ""
                          }
                        />
                      )}
                    />
                    {errors.firstHoldersName && (
                      <span className="text-red-500">
                        {errors.firstHoldersName.message}
                      </span>
                    )}
                  </div>
                )}
                {Joinholder && (
                  <div className="space-y-2 wrap col-span-full">
                    <Label> First Joint Holder Relation</Label>
                    <Controller
                      name="firstHoldersRelation"
                      control={control}
                      render={({ field }) => (
                        <Select
                          id="firstHoldersRelation"
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          className={
                            errors.firstHoldersRelation ? "border-red-500" : ""
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Relationship" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="self">Self</SelectItem>
                            <SelectItem value="spouse">Spouse</SelectItem>
                            <SelectItem value="parent">Parent</SelectItem>
                            <SelectItem value="child">Child</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.firstHoldersRelation && (
                      <span className="text-red-500">
                        {errors.firstHoldersRelation.message}
                      </span>
                    )}
                  </div>
                )}
                {Joinholder && (
                  <div className="space-y-2 wrap col-span-full">
                    <Label>First Joint Holder PAN</Label>
                    <Controller
                      name="firstHoldersPan"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="firstHoldersPan"
                          placeholder="Enter Joint Holder Name"
                          {...field}
                          value={field.value?.toUpperCase() || ""}
                          className={
                            errors.firstHoldersPan ? "border-red-500" : ""
                          }
                        />
                      )}
                    />
                    {errors.firstHoldersPan && (
                      <span className="text-red-500">
                        {errors.joinHoldersName.message}
                      </span>
                    )}
                  </div>
                )}
                {Joinholder && (
                  <div className="space-y-2 wrap col-span-full">
                    <Label>First Joint Holder Aadhar</Label>
                    <Controller
                      name="firstHoldersAadhar"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="firstHoldersAadhar"
                          placeholder="Enter Joint Holder Aadhar"
                          {...field}
                          className={
                            errors.joinHoldersName ? "border-red-500" : ""
                          }
                        />
                      )}
                    />
                    {errors.joinHoldersName && (
                      <span className="text-red-500">
                        {errors.joinHoldersName.message}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div>
                {Joinholder && (
                  <div className="space-y-2 wrap col-span-full">
                    <Label> Second Joint Holder Name</Label>
                    <Controller
                      name="jointHoldersName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="jointHoldersName"
                          placeholder="Enter Joint Holder Name"
                          {...field}
                          className={
                            errors.jointHoldersName ? "border-red-500" : ""
                          }
                        />
                      )}
                    />
                    {errors.jointHoldersName && (
                      <span className="text-red-500">
                        {errors.jointHoldersName.message}
                      </span>
                    )}
                  </div>
                )}
                {Joinholder && (
                  <div className="space-y-2 wrap col-span-full">
                    <Label> Second Joint Holder Relation</Label>
                    <Controller
                      name="jointHoldersRelation"
                      control={control}
                      render={({ field }) => (
                        <Select
                          id="jointHoldersRelation"
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          className={
                            errors.jointHoldersRelation ? "border-red-500" : ""
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Relationship" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="self">Self</SelectItem>
                            <SelectItem value="spouse">Spouse</SelectItem>
                            <SelectItem value="parent">Parent</SelectItem>
                            <SelectItem value="child">Child</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.jointHoldersRelation && (
                      <span className="text-red-500">
                        {errors.jointHoldersRelation.message}
                      </span>
                    )}
                  </div>
                )}
                {Joinholder && (
                  <>
                    <div className="space-y-2 wrap col-span-full">
                      <Label> Second Joint Holder Pan</Label>
                      <Controller
                        name="jointHoldersPan"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="joinHoldersName"
                            placeholder="Enter Joint Holder Aadhar"
                            {...field}
                            value={field.value?.toUpperCase() || ""}
                            className={
                              errors.joinHoldersName ? "border-red-500" : ""
                            }
                          />
                        )}
                      />
                      {errors.joinHoldersName && (
                        <span className="text-red-500">
                          {errors.joinHoldersName.message}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 wrap col-span-full">
                      <Label> Second Joint Holder Aadhar</Label>
                      <Controller
                        name="jointHoldersAadhar"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="jointHoldersAadhar"
                            placeholder="Enter Joint Holder Aadhar"
                            {...field}
                            className={
                              errors.jointHoldersAadhar ? "border-red-500" : ""
                            }
                          />
                        )}
                      />
                      {errors.jointHoldersAadhar && (
                        <span className="text-red-500">
                          {errors.jointHoldersAadhar.message}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-2 space-x-2 col-span-full">
                <Label>Any Loan Litigation</Label>
                <Controller
                  name="anyLoanLitigation"
                  defaultValue="no"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      defaultValue="no"
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2 text-center">
                        <RadioGroupItem id="cash" value="yes" />
                        <Label htmlFor="yes">Yes</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem id="cheque" value="no" />
                        <Label htmlFor="no">No</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
                {errors.anyLoanLitigation && (
                  <span className="text-red-500">
                    {errors.anyLoanLitigation.message}
                  </span>
                )}
              </div>
              <div className="space-y-2 space-x-2">
                <Label>Name</Label>
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
                      {...field}
                      className={errors.mobile ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.mobile && (
                  <span className="text-red-500">{errors.mobile.message}</span>
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
                      type="email"
                      placeholder="Enter email"
                      {...field}
                      className={errors.email ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.email && (
                  <span className="text-red-500">{errors.email.message}</span>
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

export default ResidentialEditForm;

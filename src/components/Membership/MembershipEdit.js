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
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { PhoneInput } from "react-international-phone";
import Datepicker from "../Beneficiarydetails/Datepicker";
import Addnominee from "@/components/Nominee/EditNominee";
import cross from "@/components/image/close.png";
import { Autocompeleteadd } from "../Reuseablecomponent/Autocompeleteadd";

const schema = z.object({
  organizationName: z
    .string()
    .nonempty({ message: "Organization Name is required" }),
  membershipId: z.string().nonempty({ message: "Membership id is required" }),
  membershipType: z.any().optional(),
  otherMembershipType: z.any().optional(),
  membershipPaymentDate: z.any().optional(),
  name: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().optional(),
});

const MembershipEdit = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const [showOtherMembershipType, setShowOtherMembershipType] = useState(false);
  const { lifeInsuranceEditId } = useSelector((state) => state.counterSlice);
  const [displaynominie, setDisplaynominie] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  console.log(lifeInsuranceEditId);
  useEffect(() => {
    if (lifeInsuranceEditId) {
      console.log("lifeInsuranceEditId:", lifeInsuranceEditId);
    }
  }, [lifeInsuranceEditId]);
  const [showOtherMembership, setShowOtherMembership] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);
  const [selectedNommie, setSelectedNommie] = useState([]);
  const frameworks = {
    membershipType: [
      { value: "annual", label: "Annual" },
      { value: "life", label: "Life" },
    ],
  };
  const [defautValue, setdefaultValue] = useState("");
  const [takeinput, setTakeinput] = useState();
  const [inputvaluearray, setInputvaluearray] = useState({});
  const [values, setValues] = useState("");
  const [type, setType] = useState(false);

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
      `/api/memberships/${lifeInsuranceEditId}`,
      {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      }
    );
    let othertype = response.data.data.Membership?.membershipType;
    setdefaultValue({
      membershipType: response.data.data.Membership?.membershipType,
    });

    if (othertype !== "annual" || othertype !== "life") {
      setShowOtherMembershipType(true);
      setValue("membershipType", "other");
      setValue("otherMembershipType", othertype);
    }

    // if (othertype === "annual" || othertype === "life") {
    //   setShowOtherMembershipType(false);
    //   setValue("membershipType", othertype);
    // } else {
    //   setShowOtherMembershipType(true);
    //   setValue("otherMembersipType", othertype);
    // }
    // setValue("membershipType", response.data.data.Membership?.membershipType);
    setValue(
      "membershipPaymentDate",
      response.data.data.Membership?.membershipPaymentDate
    );
    setSelectedNommie(
      response.data.data.Membership?.nominees?.map((nominee) => nominee.id)
    );
    console.log(typeof response.data.data.Membership?.premium);
    return response.data.data.Membership;
  };

  const {
    data: Benifyciary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["membershipDataUpdate", lifeInsuranceEditId],
    queryFn: getPersonalData,

    onSuccess: (data) => {
      if (data.modeOfPurchase === "broker") {
        setBrokerSelected(true);
        setHideRegisteredFields(false);
      }
      if (data.modeOfPurchase === "e-insurance") {
        setBrokerSelected(false);
        setHideRegisteredFields(true);
      }
      setDefaultValues(data);
      reset(data);
      setValue(data);
      setValue("organizationName", data.organizationName);
      setValue("membershipId", data.membershipId);
      setValue("membershiptype", data.metaltype);
      setValue("membershipPaymentDate", data.membershipPaymentDate);
      setValue("numberOfArticles", data.numberOfArticles);
      setValue("additionalInformation", data.additionalInformation);
      setValue("pointOfContact", data.pointOfContact);

      // Set fetched values to the form
      for (const key in data) {
        setValue(key, data[key]);
      }

      setShowOtherMembership(data.Membership === "other");

      console.log(data);
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile", error.message);
    },
  });

  const membershipMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(
        `/api/memberships/${lifeInsuranceEditId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      return response.data.data.Membership;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(
        "MembershipDataUpdate",
        lifeInsuranceEditId
      );
      toast.success("Membership added successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile");
    },
  });
  useEffect(() => {
    console.log("Form values:", control._formValues);
  }, [control._formValues]);

  useEffect(() => {
    if (Benifyciary?.nominees) {
      setDisplaynominie(Benifyciary?.nominees);
    }
  }, [Benifyciary?.nominees]);

  const onSubmit = (data) => {
    console.log(data);
    console.log("membership:", data.membership);
    if (data.membershipType === "other") {
      data.membersipType = data.otherMembershipType;
    }
    if (data.membershipType === "other") {
      data.membershipType = data.otherMembershipType;
    }
    console.log(data);
    if (data.membershipPaymentDate) {
      const date = new Date(data.membershipPaymentDate);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();
      const newdate = `${month}/${day}/${year}`;
      data.membershipPaymentDate = newdate;
    }
    console.log("brokerName:", data.brokerName);
    data.nominees = selectedNommie;

    membershipMutate.mutate(data);
  };

  useEffect(() => {
    console.log(Benifyciary);
  }, [Benifyciary]);
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading Membership data</div>;
  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-2xl font-bold">
                Membership Details
              </CardTitle>
              <CardDescription>
                Edit the form to update the membership details.
              </CardDescription>
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
                <Label htmlFor="organizationName">Organization Name</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="organizationName"
                  defaultValue={Benifyciary?.organizationName || ""}
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="organizationName"
                      placeholder="Organization Name"
                      {...field}
                      className={
                        errors.organizationName ? "border-red-500" : ""
                      }
                      defaultValue={Benifyciary?.organizationName || ""}
                    />
                  )}
                />
                {errors.organizationName && (
                  <span className="text-red-500">
                    {errors.organizationName.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="membershipId">Membership ID </Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="membershipId"
                  defaultValue={Benifyciary?.membershipId || ""}
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="membershipId"
                      placeholder="Membership Id"
                      {...field}
                      className={errors.membershipId ? "border-red-500" : ""}
                      defaultValue={Benifyciary?.membershipId || ""}
                    />
                  )}
                />
                {errors.membershipId && (
                  <span className="text-red-500">
                    {errors.membershipId.message}
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="membershipType">Membership Type</Label>
              <Controller
                name="membershipType"
                control={control}
                defaultValue={Benifyciary?.membershipType}
                render={({ field }) => (
                  // <Select
                  //   id="membershipType"
                  //   value={field.value}
                  //   {...field}
                  //   onValueChange={(value) => {
                  //     field.onChange(value);
                  //     setShowOtherMembershipType(value === "other");
                  //   }}
                  //   className={errors.membershipType ? "border-red-500" : ""}
                  //   defaultValue={Benifyciary?.membershipType || ""}
                  // >
                  //   <SelectTrigger>
                  //     <SelectValue placeholder="Select Membership Type" />
                  //   </SelectTrigger>
                  //   <SelectContent>
                  //     <SelectItem value="annual">Annual</SelectItem>
                  //     <SelectItem value="life">Life</SelectItem>
                  //     <SelectItem value="other">Other</SelectItem>
                  //   </SelectContent>
                  // </Select>
                  <Autocompeleteadd
                    options={frameworks.membershipType}
                    placeholder="Select Membership Type..."
                    emptyMessage="No Membership Type Found."
                    value={values}
                    array={inputvaluearray}
                    setarray={setInputvaluearray}
                    defautValues={defautValue?.membershipType}
                    variable="membershipType"
                    onValueChange={(value) => {
                      setValues(value);
                      console.log(value);
                      setValue("membershipType", value?.value);
                    }}
                  />
                )}
              />
              {/* {showOtherMembershipType && (
                <Controller
                  name="otherMembershipType"
                  control={control}
                  defaultValue={Benifyciary?.otherMembershipType || ""}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Specify Membership Type"
                      className="mt-2"
                      defaultValue={Benifyciary?.otherMembershipType || ""}
                    />
                  )}
                />
              )} */}
              {errors.membershipType && (
                <span className="text-red-500">
                  {errors.membershipType.message}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="membershipPaymentDate">
                  Membership Payment Date
                </Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="membershipPaymentDate"
                  defaultValue={
                    new Date(Benifyciary?.membershipPaymentDate) || ""
                  }
                  control={control}
                  render={({ field }) => (
                    <Datepicker
                      {...field}
                      onChange={(date) => field.onChange(date)}
                      selected={field.value}
                    />
                  )}
                />
                {errors.membershipPaymentDate && (
                  <span className="text-red-500">
                    {errors.membershipPaymentDate.message}
                  </span>
                )}
              </div>
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
              <Label htmlFor="registered-mobile">Add nominee</Label>
              {console.log(Benifyciary?.nominees)}
              <Addnominee
                setSelectedNommie={setSelectedNommie}
                AllNominees={Benifyciary?.nominees}
                selectedNommie={selectedNommie}
                displaynominie={displaynominie}
                setDisplaynominie={setDisplaynominie}
              />{" "}
            </div>
            <div className="space-y-4 flex flex-col col-span-full">
              <h1>Point Of Contact</h1>
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
                      {...field}
                      className={errors.name ? "border-red-500" : ""}
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
                      className={errors.email ? "border-red-500" : ""}
                      defaultValue={Benifyciary?.email || ""}
                    />
                  )}
                />
                {errors.email && (
                  <span className="text-red-500">{errors.email.message}</span>
                )}
              </div>
              <div className="w-[40%] space-y-2">
                <Label htmlFor="mobile">Phone</Label>
                <Controller
                  name="mobile"
                  control={control}
                  defaultValue={Benifyciary?.mobile || ""}
                  render={({ field }) => (
                    <PhoneInput
                      id="mobile"
                      type="tel"
                      placeholder="Enter mobile number"
                      defaultCountry="in"
                      inputStyle={{ minWidth: "15.5rem" }}
                      {...field}
                      defaultValue={Benifyciary?.mobile || ""}
                    />
                  )}
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

export default MembershipEdit;

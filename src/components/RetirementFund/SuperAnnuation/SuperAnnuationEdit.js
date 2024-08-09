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
import Addnominee from "@/components/Nominee/EditNominee";
import cross from "@/components/image/close.png";

const schema = z.object({
  companyName: z
    .string()
    .nonempty({ message: "Organization Name is required" }),
  masterPolicyNumber: z.string().optional(),
  empNo: z.string().optional(),
  address: z.string().optional(),
  annuityAmount: z.string().optional(),
  additionalDetails: z.string().optional(),
  name: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().optional(),
});

const SuperAnnuationEditForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
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
      `/api/super-annuations/${lifeInsuranceEditId}`,
      {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      }
    );

    console.log(typeof response.data.data.SuperAnnuation?.annuityAmount);
    return response.data.data.SuperAnnuation;
  };

  const {
    data: Benifyciary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["membershipDataUpdate", lifeInsuranceEditId],
    queryFn: getPersonalData,

    onSuccess: (data) => {
      // if (data.modeOfPurchase === "broker") {
      //   setBrokerSelected(true);
      //   setHideRegisteredFields(false);
      // }
      // if (data.modeOfPurchase === "e-insurance") {
      //   setBrokerSelected(false);
      //   setHideRegisteredFields(true);
      // }
      setDefaultValues(data);
      reset(data);
      setValue(data);
      setValue("companyName", data.companyName);
      setValue("masterPolicyNumber", data.masterPolicyNumber);
      setValue("empNo", data.empNo);
      setValue("address", data.address);
      setValue("annuityAmount", data.annuityAmount);
      setValue("additionalDetails", data.additionalDetails);
      setValue("name", data.name);
      setValue("mobile", data.mobile);
      setValue("email", data.email);

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

  const superannuationMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(
        `/api/super-annuations/${lifeInsuranceEditId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      return response.data.data.SuperAnnuation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(
        "MembershipDataUpdate",
        lifeInsuranceEditId
      );
      toast.success("Super Annuations added successfully!");
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
    data.name = name;
    data.email = email;
    data.mobile = mobile;

    console.log(data);
    // const date = new Date(data.membershipPaymentDate);
    // const month = String(date.getMonth() + 1).padStart(2, "0");
    // const day = String(date.getDate()).padStart(2, "0");
    // const year = date.getFullYear();
    // const newdate = `${month}/${day}/${year}`;
    // data.membershipPaymentDate = newdate;
    console.log("brokerName:", data.brokerName);
    data.nominees = selectedNommie;

    superannuationMutate.mutate(data);
  };

  useEffect(() => {
    console.log(Benifyciary);
  }, [Benifyciary]);
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading Super Annuation data</div>;
  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button onClick={() => navigate("/superannuation")}>Back</Button>
              <div>
                <CardTitle className="text-2xl font-bold">
                  Super Annuation Details
                </CardTitle>
                <CardDescription>
                  Edit the form to update the Super Annuation Details.
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
                <Label htmlFor="companyName">Company Name</Label>
                <Controller
                  name="companyName"
                  defaultValue={Benifyciary?.companyName || ""}
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="companyName"
                      placeholder="Employer Name"
                      {...field}
                      className={errors.companyName ? "border-red-500" : ""}
                      defaultValue={Benifyciary?.companyName || ""}
                    />
                  )}
                />
                {errors.companyName && (
                  <span className="text-red-500">
                    {errors.companyName.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="masterPolicyNumber">Master Policy Number</Label>
                <Controller
                  name="masterPolicyNumber"
                  defaultValue={Benifyciary?.masterPolicyNumber || ""}
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="masterPolicyNumber"
                      placeholder="Employee Id"
                      {...field}
                      className={
                        errors.masterPolicyNumber ? "border-red-500" : ""
                      }
                      defaultValue={Benifyciary?.masterPolicyNumber || ""}
                    />
                  )}
                />
                {errors.masterPolicyNumber && (
                  <span className="text-red-500">
                    {errors.masterPolicyNumber.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="empNo">Employee ID</Label>
                <Controller
                  name="empNo"
                  defaultValue={Benifyciary?.empNo || ""}
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="empNo"
                      placeholder="Employee Id"
                      {...field}
                      className={errors.empNo ? "border-red-500" : ""}
                      defaultValue={Benifyciary?.empNo || ""}
                    />
                  )}
                />
                {errors.empNo && (
                  <span className="text-red-500">{errors.empNo.message}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Controller
                  name="address"
                  defaultValue={Benifyciary?.address || ""}
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="address"
                      placeholder="Enter Address"
                      {...field}
                      className={errors.address ? "border-red-500" : ""}
                      defaultValue={Benifyciary?.address || ""}
                    />
                  )}
                />
                {errors.address && (
                  <span className="text-red-500">{errors.address.message}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="annuityAmount">Annuity Amount</Label>
                <Controller
                  name="annuityAmount"
                  defaultValue={Benifyciary?.annuityAmount || ""}
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="annuityAmount"
                      placeholder="Enter Annuity Amount"
                      {...field}
                      className={errors.annuityAmount ? "border-red-500" : ""}
                      defaultValue={Benifyciary?.annuityAmount || ""}
                    />
                  )}
                />
                {errors.annuityAmount && (
                  <span className="text-red-500">
                    {errors.annuityAmount.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalDetails">Additional Details</Label>
                <Controller
                  name="additionalDetails"
                  defaultValue={Benifyciary?.additionalDetails || ""}
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="additionalDetails"
                      placeholder="Enter Additional Details"
                      {...field}
                      className={
                        errors.additionalDetails ? "border-red-500" : ""
                      }
                      defaultValue={Benifyciary?.additionalDetails || ""}
                    />
                  )}
                />
                {errors.additionalDetails && (
                  <span className="text-red-500">
                    {errors.additionalDetails.message}
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
                      {...field}
                      placeholder="Enter mobile number"
                      defaultCountry="in"
                      inputStyle={{ minWidth: "15.5rem" }}
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
              <Button type="submit">Submit</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAnnuationEditForm;

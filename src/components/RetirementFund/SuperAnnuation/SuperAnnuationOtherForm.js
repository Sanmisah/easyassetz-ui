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
import cross from "@/components/image/close.png";

const schema = z.object({
  companyName: z.string().nonempty({ message: "Company Name is required" }),
  masterPolicyNumber: z
    .string()
    .nonempty({ message: "Master Policy Number is required" }),
  empNo: z.string().optional(),
  address: z.string().optional(),
  annuityAmount: z.string().optional(),
  additionalDetails: z.string().optional(),
  // image: z.string().optional(),
  name: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().optional(),
});

const FocusableSelectTrigger = forwardRef((props, ref) => (
  <SelectTrigger ref={ref} {...props} />
));

FocusableSelectTrigger.displayName = "FocusableSelectTrigger";

const SuperAnnuationOtherForm = () => {
  const navigate = useNavigate();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const queryClient = useQueryClient();
  const [showOtherMembershipType, setShowOtherMembershipType] = useState(false);
  const [displaynominie, setDisplaynominie] = useState([]);
  const [selectedNommie, setSelectedNommie] = useState([]);
  const [nomineeerror, setnomineeerror] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const {
    handleSubmit,
    control,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: "",
      masterPolicyNumber: "",
      empNo: "",
      address: "",
      annuityAmount: "",
      additionalDetails: "",
      name: "",
      email: "",
      phone: "",
    },
  });

  const lifeInsuranceMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(`/api/super-annuations`, data, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });

      return response.data.data.SuperAnnuation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("LifeInsuranceData");
      toast.success("Super Annuation Details added successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error submitting Super Annuation Details:", error);
      toast.error("Failed to submit Super Annuation Details");
    },
  });

  useEffect(
    () => {
      if (selectedNommie.length > 0) {
        setnomineeerror(false);
      }
    },
    [selectedNommie],
    [nomineeerror]
  );

  const onSubmit = (data) => {
    // data.name = name;
    // data.email = email;
    data.mobile = phone;
    // const date = new Date(data.membershipPaymentDate);
    // const month = String(date.getMonth() + 1).padStart(2, "0");
    // const day = String(date.getDate()).padStart(2, "0");
    // const year = date.getFullYear();
    // const newdate = `${month}/${day}/${year}`;
    // data.membershipPaymentDate = newdate;
    console.log("Nomiee:", selectedNommie.length < 1);

    if (selectedNommie.length > 1) {
      setnomineeerror(false);
    }

    data.nominees = selectedNommie;
    lifeInsuranceMutate.mutate(data);
  };

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-2xl font-bold">
                Super Annuation Details
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <form
            className="space-y-6 flex flex-col"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Controller
                name="companyName"
                control={control}
                render={({ field }) => (
                  <Input
                    id="companyName"
                    placeholder="Enter Company Name"
                    {...field}
                    value={field.value || ""}
                    onChange={field.onChange}
                    className={errors.companyName ? "border-red-500" : ""}
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
                control={control}
                render={({ field }) => (
                  <Input
                    id="masterPolicyNumber"
                    placeholder="Enter Master Policy Number"
                    {...field}
                    value={field.value || ""}
                    onChange={field.onChange}
                    className={
                      errors.masterPolicyNumber ? "border-red-500" : ""
                    }
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
                control={control}
                render={({ field }) => (
                  <Input
                    id="empNo"
                    placeholder="Enter Employee ID"
                    {...field}
                    value={field.value || ""}
                    onChange={field.onChange}
                    className={errors.empNo ? "border-red-500" : ""}
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
                control={control}
                render={({ field }) => (
                  <Input
                    id="address"
                    placeholder="Enter Address"
                    {...field}
                    value={field.value || ""}
                    onChange={field.onChange}
                    className={errors.address ? "border-red-500" : ""}
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
                control={control}
                render={({ field }) => (
                  <Input
                    id="annuityAmount"
                    placeholder="Enter Annuity Amount"
                    {...field}
                    value={field.value || ""}
                    onChange={field.onChange}
                    className={errors.annuityAmount ? "border-red-500" : ""}
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
                    <Label htmlFor="mobile">mobile</Label>
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
                    {errors.mobile && (
                      <span className="text-red-500">
                        {errors.mobile.message}
                      </span>
                    )}
                  </div>
                </div>
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

export default SuperAnnuationOtherForm;

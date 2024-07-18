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
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { PhoneInput } from "react-international-phone";
import { useSelector } from "react-redux";
import { RadioGroup, RadioGroupItem } from "@com/ui/radio-group";
import Editnominee from "@/components/Nominee/EditNominee";
import cross from "@/components/image/close.png";

const schema = z.object({
  employerName: z.string().optional(),
  uanNumber: z.string().optional(),
  branch: z.string().optional(),
  bankName: z.string().optional(),
  branch: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  additionalDetails: z.string().optional(),
  name: z.any().optional(),
  mobile: z.any().optional(),
  email: z
    .any()
    // .email({ message: "Invalid Email" })
    .optional(),
});
// .refine((data) => {
//   if (data.natureOfHolding === "joint") {
//     return !!data.jointHolderName;
//   }

//   return true;
// });

const ProvidentFundEditForm = ({}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const queryClient = useQueryClient();
  const [showJointHolderName, setShowJointHolderName] = useState(false);
  const [nomineeDetails, setNomineeDetails] = useState([]);
  const [nomineeError, setNomineeError] = useState(false);
  const [displaynominie, setDisplaynominie] = useState([]);
  const [selectedNommie, setSelectedNommie] = useState([]);
  const { lifeInsuranceEditId } = useSelector((state) => state.counterSlice);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      employerName: "",
      uanNumber: "",
      bankName: "",
      branch: "",
      bankAccountNumber: "",
      additionalDetails: "",
      name: "",
      email: "",
      mobile: "",
    },
  });

  const getPersonalData = async () => {
    if (!user) return;
    const response = await axios.get(
      `/api/provident-funds/${lifeInsuranceEditId}`,
      {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      }
    );
    let data = response.data.data.ProvidentFund;
    console.log("Fetching Data:", data);
    setValue("employerName", data.bankName);
    setValue("uanNumber", data.uanNumber);
    setValue("branch", data.branch);
    setValue("bankName", data.bankName);
    setValue("bankAccountNumber", data.bankAccountNumber);
    setValue("additionalDetails", data.additionalDetails);
    setValue("name", data.name);
    setValue("mobile", data.mobile);
    setValue("email", data.email);
    if (data.natureOfHolding === "joint") {
      setShowJointHolderName(true);
    }
    // Assume nomineeDetails is an array of nominee objects
    setNomineeDetails(data.nomineeDetails || []);
    setSelectedNommie(data?.nominees?.map((nominee) => nominee.id));
    return response.data.data.ProvidentFund;
  };

  const {
    data: Benifyciary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lifeInsuranceDataUpdate", lifeInsuranceEditId],
    queryFn: getPersonalData,
    onSuccess: (data) => {
      Object.keys(data).forEach((key) => {
        if (schema.shape[key]) {
          setValue(key, data[key]);
          console.error("Error fetching data:", error);
          toast.error("Failed to fetch data");
        } // .email({ message: "Invalid Email" })
      });
      if (data.natureOfHolding === "joint") {
        setShowJointHolderName(true);
      }
      // Assume nomineeDetails is an array of nominee objects
      setNomineeDetails(data.nomineeDetails || []);
    },
    onError: (error) => {
      console.error("Error fetching Providend data:", error);
      toast.error("Failed to fetch Providend data data");
    },
  });

  const pfMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(
        `/api/provident-funds/${lifeInsuranceEditId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      return response.data.data.ProvidentFund;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("ProvidentFund");
      toast.success("Providend Fund details updated successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error updating  Providend Fund details:", error);
      toast.error("Failed to update  Providend Fund details");
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    pfMutate.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading Providend Fund data</div>;

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-2xl font-bold">
                Edit Providend Fund Details
              </CardTitle>
              <CardDescription>
                Update the form to edit the Providend Fund details.
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
              <Label htmlFor="employerName">Employer Name</Label>
              <Controller
                name="employerName"
                control={control}
                render={({ field }) => (
                  <Input
                    id="employerName"
                    placeholder="Enter Employer Name"
                    {...field}
                    className={errors.employerName ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.employerName && (
                <span className="text-red-500">
                  {errors.employerName.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="uanNumber">UAN Number</Label>
              <Controller
                name="uanNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    id="uanNumber"
                    placeholder="Enter UAN Number"
                    defaultValue={Benifyciary?.uanNumber}
                    {...field}
                    className={errors.uanNumber ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.uanNumber && (
                <span className="text-red-500">{errors.uanNumber.message}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Controller
                name="bankName"
                control={control}
                render={({ field }) => (
                  <Input
                    id="bankName"
                    defaultValue={Benifyciary?.bankName}
                    placeholder="Enter Bank Name"
                    {...field}
                    className={errors.bankName ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.bankName && (
                <span className="text-red-500">{errors.bankName.message}</span>
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
                    className={errors.branch ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.branch && (
                <span className="text-red-500">{errors.branch.message}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
              <Controller
                name="bankAccountNumber"
                control={control}
                defaultValue={Benifyciary?.bankAccountNumber}
                render={({ field }) => (
                  <Input
                    id="bankAccountNumber"
                    defaultValue={Benifyciary?.bankAccountNumber}
                    placeholder="Enter Bank Account Number"
                    {...field}
                    className={errors.bankAccountNumber ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.bankAccountNumber && (
                <span className="text-red-500">
                  {errors.bankAccountNumber.message}
                </span>
              )}
            </div>
            {displaynominie && displaynominie.length > 0 && (
              <div className="space-y-2">
                <div className="grid gap-4 py-4">
                  {console.log(displaynominie)}
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
              <Editnominee
                setSelectedNommie={setSelectedNommie}
                AllNominees={Benifyciary?.nominees}
                selectedNommie={selectedNommie}
                displaynominie={displaynominie}
                setDisplaynominie={setDisplaynominie}
              />{" "}
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalDetails">Additional Details</Label>
              <Controller
                name="additionalDetails"
                defaultValue={Benifyciary?.additionalDetails}
                control={control}
                render={({ field }) => (
                  <Input
                    id="additionalDetails"
                    defaultValue={Benifyciary?.additionalDetails}
                    placeholder="Enter Additional Details"
                    {...field}
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

            <div className="space-y-2">
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
                    placeholder="Enter Mobile"
                    defaultCountry="in"
                    inputStyle={{ minWidth: "30.5rem" }}
                    value={field.value || ""}
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
                    placeholder="Enter Email"
                    {...field}
                    className={errors.email ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.email && (
                <span className="text-red-500">{errors.email.message}</span>
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

export default ProvidentFundEditForm;

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
import Editnominee from "@/components/Nominee/EditNominee";
import { RadioGroup, RadioGroupItem } from "@com/ui/radio-group";
import cross from "@/components/image/close.png";
import Datepicker from "../../Beneficiarydetails/Datepicker";

const schema = z.object({
  fdNumber: z.any().optional(),
  company: z.any().optional(),
  maturityDate: z.any().optional(),
  branchName: z.any().optional(),
  maturityAmount: z.any().optional(),
  jointHolderName: z.any().optional(),
  jointHolderPan: z.any().optional(),
  holdingType: z.any().optional(),
  additionalDetails: z.any().optional(),
  name: z.any().optional(),
  mobile: z.any().optional(),
  email: z
    .any()
    // .email({ message: "Invalid Email" })
    .optional(),
});
// .refine((data) => {
//   if (data.holdingType === "joint") {
//     return !!data.jointHolderName;
//   }

//   return true;
// });

const PpfEditForm = ({}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const queryClient = useQueryClient();
  const [showJointHolderName, setShowJointHolderName] = useState(false);
  const [nomineeDetails, setNomineeDetails] = useState([]);
  const [displaynominie, setDisplaynominie] = useState([]);
  const [selectedNommie, setSelectedNommie] = useState([]);
  const [phone, setPhone] = useState("");
  const [nomineeError, setNomineeError] = useState(false);
  const { lifeInsuranceEditId } = useSelector((state) => state.counterSlice);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fdNumber: "",
      company: "",
      branchName: "",
      maturityDate: "",
      maturityAmount: "",
      holdingType: "",
      additionalDetails: "",
      name: "",
      email: "",
      phone: "",
    },
  });

  const getPersonalData = async () => {
    if (!user) return;
    const response = await axios.get(
      `/api/other-deposites/${lifeInsuranceEditId}`,
      {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      }
    );
    let data = response.data.data.OtherDeposite;
    console.log("Fetching Data:", data);
    setValue("fdNumber", data.fdNumber);
    setValue("company", data.company);
    setValue("maturityDate", data.maturityDate);
    setValue("maturityAmount", data.maturityAmount);
    setValue("branchName", data.branchName);
    setValue("holdingType", data.holdingType);
    setValue("jointHolderName", data.jointHolderName);
    setValue("jointHolderPan", data.jointHolderPan);
    setValue("additionalDetails", data.additionalDetails);
    setValue("name", data.name);
    setValue("mobile", data.mobile);
    setValue("email", data.email);
    if (data.holdingType === "joint") {
      setShowJointHolderName(true);
    }
    // Assume nomineeDetails is an array of nominee objects
    setNomineeDetails(data.nomineeDetails || []);
    setSelectedNommie(data.nominees?.map((nominee) => nominee.id));
    return response.data.data.OtherDeposite;
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
      if (data.holdingType === "joint") {
        setShowJointHolderName(true);
      }
      // Assume nomineeDetails is an array of nominee objects
      setNomineeDetails(data.nomineeDetails || []);
    },
    onError: (error) => {
      console.error("Error fetching PPF data:", error);
      toast.error("Failed to fetch PPF data");
    },
  });

  const ppfMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(
        `/api/other-deposites/${lifeInsuranceEditId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      return response.data.data.OtherDeposite;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("PublicProvidentFund");
      toast.success("Other Deposit details updated successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error updating Public Providend Fund details:", error);
      toast.error("Failed to update Public Providend Fund details");
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
    data.mobile = phone;
    if (data.maturityDate) {
      const date = new Date(data.maturityDate);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();
      const newdate = `${month}/${day}/${year}`;
      data.maturityDate = newdate;
    }
    if (selectedNommie.length > 0) {
      data.nominees = selectedNommie;
    }
    await ppfMutate.mutateAsync(data);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading Public Providend Fund data</div>;

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Edit Other Deposits Details
                </CardTitle>
                <CardDescription>
                  Fill out the form to update the Other Deposits Details.
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
              <Label htmlFor="fdNumber">FD Number</Label>
              <Label style={{ color: "red" }}>*</Label>
              <Controller
                name="fdNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    id="fdNumber"
                    placeholder="Enter FD Number"
                    {...field}
                    className={errors.fdNumber ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.fdNumber && (
                <span className="text-red-500">{errors.fdNumber.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Label style={{ color: "red" }}>*</Label>
              <Controller
                name="company"
                control={control}
                render={({ field }) => (
                  <Input
                    id="company"
                    placeholder="Enter Company"
                    {...field}
                    className={errors.company ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.company && (
                <span className="text-red-500">{errors.company.message}</span>
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
                    placeholder="Enter Branch Name</Label>"
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
              <Label>Maturity Date</Label>
              <Controller
                name="maturityDate"
                control={control}
                render={({ field }) => (
                  <Datepicker
                    {...field}
                    onChange={(date) => field.onChange(date)}
                  />
                )}
              />
              {errors.maturityDate && (
                <span className="text-red-500">
                  {errors.maturityDate.message}
                </span>
              )}
            </div>
            <div>
              <Label>Maturity Amount</Label>
              <Controller
                name="maturityAmount"
                control={control}
                render={({ field }) => (
                  <Input
                    id="maturityAmount"
                    placeholder="Enter Maturity Amount"
                    {...field}
                    className={errors.maturityAmount ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.maturityAmount && (
                <span className="text-red-500">
                  {errors.maturityAmount.message}
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
              <Editnominee
                setSelectedNommie={setSelectedNommie}
                AllNominees={Benifyciary?.nominees}
                selectedNommie={selectedNommie}
                displaynominie={displaynominie}
                setDisplaynominie={setDisplaynominie}
              />{" "}
            </div>

            <div className="space-y-2">
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
              <div className="space-y-2">
                <Label htmlFor="jointHolderName">Joint Holder Name</Label>
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
                {errors.jointHolderName && (
                  <span className="text-red-500">
                    {errors.jointHolderName.message}
                  </span>
                )}
              </div>
            )}
            {showJointHolderName && (
              <div className="space-y-2">
                <Label>jointHolderPan</Label>
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
                {errors.jointHolderPan && (
                  <span className="text-red-500">
                    {errors.jointHolderPan.message}
                  </span>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="additionalDetails">Additional Details</Label>
              <Controller
                name="additionalDetails"
                control={control}
                render={({ field }) => (
                  <Input
                    id="additionalDetails"
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
              <Label htmlFor="image">Image Upload</Label>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <Input
                    type="file"
                    id="image"
                    {...field}
                    className={errors.image ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.image && (
                <span className="text-red-500">{errors.image.message}</span>
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
              <Button id="submitButton" type="submit">
                Submit
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PpfEditForm;

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
import Nominee from "../Nominee";

const schema = z.object({
  bankName: z.any().optional(),
  ppfAccountNo: z.any().optional(),
  branch: z.any().optional(),
  natureOfHolding: z.any().optional(),
  additionalDetails: z.any().optional(),
  name: z.any().optional(),
  mobile: z.any().optional(),
  email: z
    .any()
    // .email({ message: "Invalid Email" })
    .optional(),
  image: z.any().optional(),
});
// .refine((data) => {
//   if (data.natureOfHolding === "joint") {
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
  const [selectedFamilyMembers, setSelectedFamilyMembers] = useState([]);
  const [displayFamilyMembers, setDisplayFamilyMembers] = useState([]);
  const {
    handleSubmit,
    control,
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
      additionalDetails: "",
      name: "",
      mobile: "",
      email: "",
    },
  });

  const getPersonalData = async () => {
    if (!user) return;
    const response = await axios.get(
      `/api/public-provident-funds/${lifeInsuranceEditId}`,
      {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      }
    );
    let data = response.data.data.PublicProvidentFund;
    console.log("Fetching Data:", data);
    setValue("bankName", data.bankName);
    setValue("ppfAccountNo", data.ppfAccountNo);
    setValue("branch", data.branch);
    setValue("natureOfHolding", data.natureOfHolding);
    setValue("jointHolderName", data.jointHolderName);
    setValue("additionalDetails", data.additionalDetails);
    setValue("name", data.name);
    setValue("mobile", data.mobile);
    setDisplayFamilyMembers(
      data.jointHolders?.map((nominee) => ({
        id: nominee.id,
        fullLegalName: nominee.fullLegalName,
        relationship: nominee.relationship,
      }))
    );
    setValue("email", data.email);
    if (data.natureOfHolding === "joint") {
      setShowJointHolderName(true);
    }
    // Assume nomineeDetails is an array of nominee objects
    setNomineeDetails(data.nomineeDetails || []);
    setSelectedNommie(data.nominees?.map((nominee) => nominee.id));
    setSelectedFamilyMembers(data.jointHolders?.map((nominee) => nominee.id));
    return response.data.data.PublicProvidentFund;
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
      console.error("Error fetching PPF data:", error);
      toast.error("Failed to fetch PPF data");
    },
  });

  const ppfMutate = useMutation({
    mutationFn: async (data) => {
      const Formdata = new FormData();
      Formdata.append("image", data.image);

      for (const [key, value] of Object.entries(data)) {
        Formdata.append(key, value);
      }
      Formdata.append("_method", "put");
      const response = await axios.post(
        `/api/public-provident-funds/${lifeInsuranceEditId}`,
        Formdata,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      return response.data.data.PublicProvidentFund;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("PublicProvidentFund");
      toast.success("Public Providend Fund details updated successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error updating Public Providend Fund details:", error);
      toast.error("Failed to update Public Providend Fund details");
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    data.mobile = phone;
    if (selectedNommie?.length > 0) {
      data.nominees = selectedNommie;
    }
    if (selectedFamilyMembers?.length > 0) {
      data.jointHolders = selectedFamilyMembers;
    }
    ppfMutate.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading Public Providend Fund data</div>;

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button onClick={() => navigate("/ppf")}>Back</Button>
              <div>
                <CardTitle className="text-2xl font-bold">
                  Edit Public Providend Fund Details
                </CardTitle>
                <CardDescription>
                  Update the form to edit the Public Providend Fund details.
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
              <Label htmlFor="bankName">Post/Bank Name</Label>
              <Controller
                name="bankName"
                control={control}
                render={({ field }) => (
                  <Input
                    id="bankName"
                    placeholder="Enter Post/Bank Name"
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
              <Label htmlFor="ppfAccountNo">
                Public Providend Fund Account Number
              </Label>
              <Controller
                name="ppfAccountNo"
                control={control}
                render={({ field }) => (
                  <Input
                    id="ppfAccountNo"
                    placeholder="Enter Public Providend Fund Account Number"
                    {...field}
                    className={errors.ppfAccountNo ? "border-red-500" : ""}
                  />
                )}
              />
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
                    className={errors.branch ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.branch && (
                <span className="text-red-500">{errors.branch.message}</span>
              )}
            </div>

            {displaynominie && displaynominie?.length > 0 && (
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
              <Label htmlFor="natureOfHolding">Nature of Holding</Label>
              <Controller
                name="natureOfHolding"
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
              {errors.natureOfHolding && (
                <span className="text-red-500">
                  {errors.natureOfHolding.message}
                </span>
              )}
            </div>

            {showJointHolderName && (
              <>
                <div>
                  {displayFamilyMembers && displayFamilyMembers?.length > 0 && (
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
                defaultValue={Benifyciary?.mobile || ""}
                render={({ field }) => (
                  <PhoneInput
                    id="mobile"
                    type="tel"
                    placeholder="Enter Mobile"
                    defaultCountry="in"
                    value={field.value || ""}
                    inputStyle={{ minWidth: "15.5rem" }}
                    onChange={(value) => {
                      console.log(value);
                      setValue("mobile", value);
                      setPhone(value);
                    }}
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
                        event?.target?.files && event?.target?.files[0]
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
            <div>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(`/api/file/${Benifyciary?.image}`);
                }}
              >
                View Attachment
              </Button>
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

export default PpfEditForm;

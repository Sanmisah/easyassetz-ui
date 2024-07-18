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
import { Textarea } from "@com/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@com/ui/radio-group";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { setlifeInsuranceEditId } from "@/Redux/sessionSlice";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Addnominee from "@/components/Nominee/EditNominee";
import cross from "@/components/image/close.png";
import { PhoneInput } from "react-international-phone";

const schema = z.object({
  employerName: z.string().nonempty({ message: "Employer Name is required" }),
  employerId: z.string().nonempty({ message: "Employee id is required" }),
  additionalDetails: z.string().optional(),
  name: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().optional(),
});

const FocusableSelectTrigger = forwardRef((props, ref) => (
  <SelectTrigger ref={ref} {...props} />
));

const GratuityEditForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const { lifeInsuranceEditId } = useSelector((state) => state.counterSlice);

  const [showOtherInsuranceCompany, setShowOtherInsuranceCompany] =
    useState(false);
  const [showOtherRelationship, setShowOtherRelationship] = useState(false);
  const [hideRegisteredFields, setHideRegisteredFields] = useState(false);
  const [showOthercompanyAddress, setShowOthercompanyAddress] = useState(false);
  const [FamilyMembersCovered, setFamilyMembersCovered] = useState([]);
  const [showOtherFamilyMembersCovered, setShowOtherFamilyMembersCovered] =
    useState(false);
  const [defaultValues, setDefaultValues] = useState({});
  const [brokerSelected, setBrokerSelected] = useState(false);
  const [selectedNommie, setSelectedNommie] = useState([]);
  const [displaynominie, setDisplaynominie] = useState([]);
  const [jointHolderName, setJointHolderName] = useState(false);
  const [showOtherCompanyRegistration, setShowOtherCompanyRegistration] =
    useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const getPersonalData = async () => {
    if (!user) return;
    const response = await axios.get(`/api/gratuities/${lifeInsuranceEditId}`, {
      headers: {
        Authorization: `Bearer ${user.data.token}`,
      },
    });
    const data = response.data.data.Gratuity;

    if (data.documentAvailability === "broker") {
      setBrokerSelected(true);
      setHideRegisteredFields(false);
    }
    if (data.documentAvailability === "e-insurance") {
      setBrokerSelected(false);
      setHideRegisteredFields(true);
    }

    setDefaultValues(data);
    reset(data);
    setShowOtherInsuranceCompany(data.companyName === "other");
    setShowOtherCompanyRegistration(
      !["CIN", "PAN", "FIRM NO"].includes(data.companyRegistration)
    );
    setJointHolderName(data.holdingType === "jointName");

    return data;
  };

  const {
    data: Benifyciary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lifeInsuranceDataUpdate", lifeInsuranceEditId],
    queryFn: getPersonalData,
    onSuccess: (data) => {
      setDisplaynominie(data.nominees || []);
    },
    onError: (error) => {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    },
  });

  const lifeInsuranceMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(
        `/api/gratuities/${lifeInsuranceEditId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      return response.data.data.Gratuity;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(
        "lifeInsuranceDataUpdate",
        lifeInsuranceEditId
      );
      toast.success("Gratuity added successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile");
    },
  });

  const onSubmit = (data) => {
    if (selectedNommie.length > 0) {
      data.nominees = selectedNommie;
    }
    lifeInsuranceMutate.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading Gratuity data</div>;

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-2xl font-bold">
                Gratuity Details
              </CardTitle>
              <CardDescription>
                Edit the form to update the Gratuity details.
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
                defaultValue={defaultValues.employerName}
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
              <Label htmlFor="employerId">Employer Id</Label>
              <Controller
                name="employerId"
                control={control}
                defaultValue={defaultValues.employerId}
                render={({ field }) => (
                  <Input
                    id="employerId"
                    placeholder="Enter Employer Id"
                    {...field}
                    className={errors.employerId ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.employerId && (
                <span className="text-red-500">
                  {errors.employerId.message}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="additionalDetails">Additional Information</Label>
              <Controller
                name="additionalDetails"
                control={control}
                defaultValue={defaultValues.additionalDetails}
                render={({ field }) => (
                  <Input
                    id="additionalDetails"
                    placeholder="Enter additional information"
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

            {displaynominie.length > 0 && (
              <div className="space-y-2">
                <div className="grid gap-4 py-4">
                  <Label className="text-lg font-bold">Selected Nominees</Label>
                  {displaynominie.map((nominee) => (
                    <div
                      key={nominee.id}
                      className="flex space-y-2 border border-input p-4 justify-between pl-4 pr-4 items-center rounded-lg"
                    >
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
              <Addnominee
                setSelectedNommie={setSelectedNommie}
                AllNominees={Benifyciary?.nominees}
                selectedNommie={selectedNommie}
                displaynominie={displaynominie}
                setDisplaynominie={setDisplaynominie}
              />
            </div>
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Controller
                    name="name"
                    control={control}
                    defaultValue={defaultValues.name}
                    render={({ field }) => (
                      <Input
                        id="name"
                        placeholder="Enter name"
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
                    defaultValue={defaultValues.mobile}
                    render={({ field }) => (
                      <PhoneInput
                        id="mobile"
                        type="tel"
                        placeholder="Enter mobile"
                        defaultCountry="in"
                        inputStyle={{ minWidth: "30.5rem" }}
                        value={field.value || ""}
                        onChange={field.onChange}
                        className={errors.mobile ? "border-red-500" : ""}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Controller
                    name="email"
                    control={control}
                    defaultValue={defaultValues.email}
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
            </>
            <CardFooter className="flex justify-end gap-2 mt-8">
              <Button type="submit">Submit</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GratuityEditForm;

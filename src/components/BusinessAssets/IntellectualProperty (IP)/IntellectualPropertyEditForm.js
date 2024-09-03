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
import cross from "@/components/image/close.png";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { PhoneInput } from "react-international-phone";
import { RadioGroup, RadioGroupItem } from "@com/ui/radio-group";
import Datepicker from "../../Beneficiarydetails/Datepicker";

const schema = z.object({
  typeOfIp: z.any().optional(),
  firmsRegistrationNumber: z
    .string()
    .min(3, { message: "Registration Number is required" }),
  whetherAssigned: z.string().optional(),
  nameOfAssignee: z.any().optional(),
  expiryDate: z.any().optional(),
  dateOfAssignment: z.any().optional(),
});

const IntellectualPropertyOtherForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const [showOtherMetalType, setShowOtherMetalType] = useState(false);
  const [showOtherArticleDetails, setShowOtherArticleDetails] = useState(false);
  const [weather, setWeather] = useState(false);
  const { lifeInsuranceEditId } = useSelector((state) => state.counterSlice);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  console.log(lifeInsuranceEditId);
  useEffect(() => {
    if (lifeInsuranceEditId) {
      console.log("lifeInsuranceEditId:", lifeInsuranceEditId);
    }
  }, [lifeInsuranceEditId]);
  const [showOtherBullion, setShowOtherBullion] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);

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
      `/api/business-assets/${lifeInsuranceEditId}`,
      {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      }
    );
    const data = response.data.data.BusinessAsset;
    setValue("dateOfAssignment", data.dateOfAssignment);
    setWeather(data.whetherAssigned === "yes");
    setValue("nameOfAssignee", data.nameOfAssignee);
    setValue("dateOfAssignment", data.dateOfAssignment);

    return response.data.data.BusinessAsset;
  };

  const {
    data: Benifyciary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bullionDataUpdate", lifeInsuranceEditId],
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
      setValue("metaltype", data.metaltype);
      setValue("otherInsuranceCompany", data.otherInsuranceCompany);
      setValue("expiryDate", data.expiryDate);
      setValue("nameOfAssignee", data.nameOfAssignee);
      setValue("pointOfContact", data.pointOfContact);

      // Set fetched values to the form
      for (const key in data) {
        setValue(key, data[key]);
      }

      setShowOtherBullion(data.Propritership === "other");

      console.log(data);
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile", error.message);
    },
  });

  const bullionMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(
        `/api/business-assets/${lifeInsuranceEditId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      return response.data.data.BusinessAsset;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("BullionDataUpdate", lifeInsuranceEditId);
      toast.success("Intellectual Property added successfully!");
      navigate("/intellectualproperty");
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile");
    },
  });
  useEffect(() => {
    console.log("Form values:", control._formValues);
  }, [control._formValues]);

  const onSubmit = async (data) => {
    if (data.expiryDate) {
      const date = new Date(data.expiryDate);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();
      const newdate = `${month}/${day}/${year}`;
      data.expiryDate = newdate;
    }
    if (data.dateOfAssignment) {
      const date = new Date(data.dateOfAssignment);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();
      const newdate = `${month}/${day}/${year}`;
      data.dateOfAssignment = newdate;
    }
    console.log(data);
    data.type = "intellectualProperty";

    console.log("bullion:", data.bullion);
    if (data.firmName === "other") {
      data.firmName = data.otherMetalType;
    }

    await bullionMutate.mutateAsync(data);
  };

  useEffect(() => {
    console.log(Benifyciary);
  }, [Benifyciary]);
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading bullion data</div>;
  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Intellectual Property Details
                </CardTitle>
                <CardDescription>
                  Edit the form to update the bullion details.
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
                <Label htmlFor="typeOfIp"> Intellectual Property Type</Label>
                <Controller
                  name="typeOfIp"
                  control={control}
                  defaultValue={Benifyciary?.typeOfIp}
                  render={({ field }) => (
                    <Select
                      id="typeOfIp"
                      value={field.value}
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherMetalType(value === "other");
                      }}
                      className={
                        errors.intellectualProperty ? "border-red-500" : ""
                      }
                      defaultValue={Benifyciary?.typeOfIp || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Intellectual Property Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tradeMark"> Trade Mark</SelectItem>
                        <SelectItem value="copyright">Copyright</SelectItem>
                        <SelectItem value="patent">Patent</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.typeOfIp && (
                  <span className="text-red-500">
                    {errors.typeOfIp.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="firmsRegistrationNumber">
                  Registration Number
                </Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="firmsRegistrationNumber"
                  control={control}
                  defaultValue={Benifyciary?.firmsRegistrationNumber || ""}
                  render={({ field }) => (
                    <Input
                      id="firmsRegistrationNumber"
                      defaultValue={Benifyciary?.firmsRegistrationNumber || ""}
                      placeholder="Enter Registration Number"
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                      className={
                        errors.firmsRegistrationNumber ? "border-red-500" : ""
                      }
                    />
                  )}
                />

                {errors.firmsRegistrationNumber && (
                  <span className="text-red-500">
                    {errors.firmsRegistrationNumber.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="expiryDate"
                  control={control}
                  defaultValue={Benifyciary?.expiryDate || ""}
                  render={({ field }) => (
                    <Datepicker
                      {...field}
                      onChange={(date) => field.onChange(date)}
                      selected={field.value}
                      value={field.value || Benifyciary?.expiryDate || ""}
                    />
                  )}
                />
                {errors.expiryDate && (
                  <span className="text-red-500">
                    {errors.expiryDate.message}
                  </span>
                )}
              </div>
              <div>
                <div className="space-y-2 col-span-full">
                  <Label>Whether Assigned </Label>
                  <Controller
                    name="whetherAssigned"
                    control={control}
                    defaultValue={Benifyciary?.whetherAssigned || ""}
                    render={({ field }) => (
                      <RadioGroup
                        {...field}
                        defaultValue={Benifyciary?.whetherAssigned || ""}
                        onValueChange={(value) => {
                          field.onChange(value);
                          setShowOtherArticleDetails(value === "other");
                          setWeather(value === "yes");
                        }}
                        className="flex items-center gap-2"
                      >
                        <div className="flex items-center gap-2 text-center">
                          <RadioGroupItem
                            defaultChecked={
                              Benifyciary?.whetherAssigned === "yes"
                            }
                            id="yes"
                            value="yes"
                          />
                          <Label htmlFor="yes">Yes</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem
                            defaultChecked={
                              Benifyciary?.whetherAssigned === "no"
                            }
                            id="no"
                            value="no"
                          />
                          <Label htmlFor="no">No</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                  {errors.whetherAssigned && (
                    <span className="text-red-500">
                      {errors.whetherAssigned.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {weather && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="nameOfAssignee">Name of Assignee</Label>
                  <Controller
                    name="nameOfAssignee"
                    control={control}
                    defaultValue={Benifyciary?.nameOfAssignee || ""}
                    render={({ field }) => (
                      <Input
                        id="nameOfAssignee"
                        placeholder="Enter Name of Assignee"
                        {...field}
                        className={
                          errors.nameOfAssignee ? "border-red-500" : ""
                        }
                        defaultValue={Benifyciary?.nameOfAssignee || ""}
                      />
                    )}
                  />
                  {errors.nameOfAssignee && (
                    <span className="text-red-500">
                      {errors.nameOfAssignee.message}
                    </span>
                  )}
                </div>
                <div className="w-full grid grid-cols-1 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfAssignment">Date of Assignment</Label>
                    <Controller
                      name="dateOfAssignment"
                      control={control}
                      defaultValue={Benifyciary?.dateOfAssignment || ""}
                      render={({ field }) => (
                        <Datepicker {...field} selected={field.value} />
                      )}
                    />
                    {errors.dateOfAssignment && (
                      <span className="text-red-500">
                        {errors.dateOfAssignment.message}
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}
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

export default IntellectualPropertyOtherForm;

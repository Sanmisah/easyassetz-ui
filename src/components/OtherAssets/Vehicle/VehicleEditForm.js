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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@com/ui/select";
import Datepicker from "../../Beneficiarydetails/Datepicker";

const FocusableSelectTrigger = forwardRef((props, ref) => (
  <SelectTrigger ref={ref} {...props} />
));

const schema = z.object({
  vehicleType: z.any().optional(),
  otherVehicleType: z.any().optional(),
  fourWheeler: z.any().optional(),
  otherFourWheeler: z.string().optional(),
  company: z.string().nonempty({ message: "Company Name is required" }),
  model: z.string().nonempty({ message: "Model is required" }),
  registrationNumber: z.any().optional(),
  yearOfManufacture: z.any().optional(),
  location: z.any().optional(),
  yearOfExpiry: z.any().optional(),
});

const OtherLoansEditForm = () => {
  const navigate = useNavigate();
  const { lifeInsuranceEditId } = useSelector((state) => state.counterSlice);
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const queryClient = useQueryClient();
  const [showOtherMetalType, setShowOtherMetalType] = useState(false);
  const [fourWheelerStatus, setfourWheelerStatus] = useState(false);
  const [showVehicleType, setShowVehicleType] = useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      vehicleType: "",
      otherVehicleType: "",
      fourWheeler: "",
      otherFourWheeler: "",
      company: "",
      model: "",
      registrationNumber: "",
      yearOfManufacture: "",
      location: "",
    },
  });
  const getPersonalData = async () => {
    if (!user) return;
    const response = await axios.get(
      `/api/other-assets/${lifeInsuranceEditId}`,
      {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      }
    );
    let data = response.data.data.OtherAsset;
    if (
      data.vehicleType !== "fourwheeler" ||
      data.vehicleType !== "twowheeler" ||
      data.vehicleType !== "threewheeler" ||
      data.vehicleType !== "tractor" ||
      data.vehicleType !== "bulldozer" ||
      data.vehicleType !== "crane"
    ) {
      setShowOtherMetalType(true);
      setValue("vehicleType", "other");
      setValue("otherVehicleType", data.vehicleType);
    }
    setValue("fourWheeler", data.fourWheeler);
    setValue("company", data.company);
    setValue("model", data.model);
    setValue("registrationNumber", data.registrationNumber);
    setValue("yearOfManufacture", data.yearOfManufacture);
    setValue("location", data.location);
    setValue("yearOfExpiry", data.yearOfExpiry);
    if (data.vehicleType === "fourwheeler") {
      setValue("fourWheeler", data.fourWheeler);
      setShowVehicleType(true);
    }
    return response.data.data.OtherAsset;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["vehicleData", lifeInsuranceEditId],
    queryFn: getPersonalData,
    onSuccess: (data) => {
      console.log("Data:", data);
      setInitialData(data);
      reset(data);
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile", error.message);
    },
  });

  const loanMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(
        `/api/other-assets/${lifeInsuranceEditId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      return response.data.data.OtherAsset;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("loanData");
      toast.success("Vehicle updated successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error updating loan:", error);
      toast.error("Failed to update loan");
    },
  });
  const formatDate = (date) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const onSubmit = (data) => {
    if (data.vehicleType === "other") {
      data.vehicleType = data.otherVehicleType;
    }
    console.log(data);
    if (data.yearOfExpiry) {
      const date = new Date(data.yearOfExpiry);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();
      const newdate = `${month}/${day}/${year}`;
      data.yearOfExpiry = newdate;
    }
    if (data.yearOfManufacture) {
      const date = new Date(data.yearOfManufacture);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();
      const newdate = `${month}/${day}/${year}`;
      data.yearOfManufacture = newdate;
    }
    data.type = "vehicle";
    loanMutate.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading vehicle data</div>;

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Edit Vehicle Details
                </CardTitle>
                <CardDescription>
                  Update the form to edit the Vehicle details.
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
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Controller
                  name="vehicleType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="vehicleType"
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherMetalType(value === "other");
                        setShowVehicleType(value === "fourwheeler");
                      }}
                      className={errors.vehicleType ? "border-red-500" : ""}
                    >
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select Vehicle Type" />
                      </FocusableSelectTrigger>
                      <SelectContent>
                        <SelectItem value="twowheeler">Two Wheeler</SelectItem>
                        <SelectItem value="threewheeler">
                          Three Wheeler
                        </SelectItem>
                        <SelectItem value="fourwheeler">
                          Four Wheeler
                        </SelectItem>
                        <SelectItem value="tractor">Tractor</SelectItem>
                        <SelectItem value="bulldozer">Bulldozer</SelectItem>
                        <SelectItem value="crane">Crane</SelectItem>

                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {showOtherMetalType && (
                  <Controller
                    name="otherVehicleType"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Vehicle Type"
                        className="mt-2"
                      />
                    )}
                  />
                )}
                {errors.vehicleType && (
                  <span className="text-red-500">
                    {errors.vehicleType.message}
                  </span>
                )}
              </div>

              {showVehicleType && (
                <div className="space-y-2">
                  <Label htmlFor="fourWheeler">Four Wheeler</Label>

                  <Controller
                    name="fourWheeler"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Type"
                        className="mt-2"
                      />
                    )}
                  />

                  {errors.fourWheeler && (
                    <span className="text-red-500">
                      {errors.fourWheeler.message}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Make</Label>
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="model"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="model"
                      placeholder="Enter Model"
                      {...field}
                      className={errors.model ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.model && (
                  <span className="text-red-500">{errors.model.message}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">
                  Registration/Vehicle Number
                </Label>
                <Controller
                  name="registrationNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="registrationNumber"
                      placeholder="Enter registration number"
                      {...field}
                      className={
                        errors.registrationNumber ? "border-red-500" : ""
                      }
                    />
                  )}
                />
                {errors.registrationNumber && (
                  <span className="text-red-500">
                    {errors.registrationNumber.message}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearOfManufacture">Year Of Registration</Label>
              <Controller
                name="yearOfManufacture"
                control={control}
                render={({ field }) => (
                  <Datepicker
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                    className={errors.yearOfManufacture ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.yearOfManufacture && (
                <span className="text-red-500">
                  {errors.yearOfManufacture.message}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearOfExpiry">Year Of Expiry</Label>
              <Controller
                name="yearOfExpiry"
                control={control}
                render={({ field }) => (
                  <Datepicker
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                  />
                )}
              />
              {errors.yearOfExpiry && (
                <span className="text-red-500">
                  {errors.yearOfExpiry.message}
                </span>
              )}
            </div>
            <div className="space-y-4 flex flex-col">
              <Label className="text-lg font-bold">Location</Label>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <Input
                    id="location"
                    placeholder="Enter Location"
                    {...field}
                    className={errors.location ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.location && (
                <span className="text-red-500">{errors.location.message}</span>
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
              <Button type="submit">Submit</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OtherLoansEditForm;

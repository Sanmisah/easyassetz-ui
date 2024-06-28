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

const schema = z.object({
  type: z.string().nonempty({ message: "Type is required" }),
  fourWheeler: z.string().nonempty({ message: "Four Wheeler is required" }),
  company: z.string().min(2, { message: "Company is required" }),
  model: z.string().nonempty({ message: "Model is required" }),
  registrationNumber: z
    .string()
    .min(3, { message: "Registration Number is required" })
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .transform((value) => (value === null ? null : Number(value))),
  yearOfManufacture: z
    .string()
    .nonempty({ message: "Year of Manufacture is required" }),
  location: z.string().nonempty({ message: "Location is required" }),
});

const FocusableSelectTrigger = forwardRef((props, ref) => (
  <SelectTrigger ref={ref} {...props} />
));

FocusableSelectTrigger.displayName = "FocusableSelectTrigger";

const VehicleDetailsOtherForm = () => {
  const navigate = useNavigate();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const queryClient = useQueryClient();
  const [showOtherType, setShowOtherType] = useState(false);
  const [showOtherFourWheeler, setShowOtherFourWheeler] = useState(false);
  const [selectedNommie, setSelectedNommie] = useState([]);
  const [nomineeerror, setNomineeError] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "",
      fourWheeler: "",
      company: "",
      model: "",
      registrationNumber: "",
      yearOfManufacture: "",
      location: "",
    },
  });

  const lifeInsuranceMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(`/api/other-assets`, data, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });

      return response.data.data.Vehicle;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("LifeInsuranceData");
      toast.success("Other Insurance added successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile");
    },
  });

  useEffect(() => {
    if (selectedNommie.length > 0) {
      setNomineeError(false);
    }
  }, [selectedNommie]);

  const onSubmit = (data) => {
    // data.name = name;
    // data.email = email;
    // data.mobile = phone;
    lifeInsuranceMutate.mutate(data);
  };

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-2xl font-bold">
                Vehicle Details
              </CardTitle>
              <CardDescription>
                Fill out the form to add a new Vehicle Details.
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
                <Label htmlFor="type">Type</Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="type"
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherType(value === "other");
                      }}
                      className={errors.type ? "border-red-500" : ""}
                    >
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </FocusableSelectTrigger>
                      <SelectContent>
                        <SelectItem value="fourWheeler">
                          Four Wheeler
                        </SelectItem>
                        <SelectItem value="twoWheeler">Two Wheeler</SelectItem>
                        <SelectItem value="tractor">Tractor</SelectItem>
                        <SelectItem value="bulidozer">Bulidozer</SelectItem>
                        <SelectItem value="crane">Crane</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {showOtherType && (
                  <Controller
                    name="otherType"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Type"
                        className="mt-2"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    )}
                  />
                )}
                {errors.type && (
                  <span className="text-red-500">{errors.type.message}</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fourWheeler">Four Wheeler</Label>
              <Controller
                name="fourWheeler"
                control={control}
                render={({ field }) => (
                  <Select
                    id="fourWheeler"
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setShowOtherFourWheeler(value === "other");
                    }}
                    className={errors.fourWheeler ? "border-red-500" : ""}
                  >
                    <FocusableSelectTrigger>
                      <SelectValue placeholder="Select Four Wheeler Type" />
                    </FocusableSelectTrigger>
                    <SelectContent>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="tempo">Tempo</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="bus">Bus</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {showOtherFourWheeler && (
                <Controller
                  name="otherFourWheeler"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Specify Four Wheeler"
                      className="mt-2"
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  )}
                />
              )}
              {errors.fourWheeler && (
                <span className="text-red-500">
                  {errors.fourWheeler.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Controller
                  name="company"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="company"
                      placeholder="Enter Company"
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                      className={errors.company ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.company && (
                  <span className="text-red-500">{errors.company.message}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Controller
                  name="model"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="model"
                      placeholder="Enter Model"
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
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
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Controller
                  name="registrationNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="registrationNumber"
                      placeholder="Enter Registration Number"
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="yearOfManufacture">Year Of Manufacture</Label>
                <Controller
                  name="yearOfManufacture"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="yearOfManufacture"
                      placeholder="Enter Year Of Manufacture"
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                      className={
                        errors.yearOfManufacture ? "border-red-500" : ""
                      }
                    />
                  )}
                />
                {errors.yearOfManufacture && (
                  <span className="text-red-500">
                    {errors.yearOfManufacture.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="location"
                      placeholder="Enter Location"
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                      className={errors.location ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.location && (
                  <span className="text-red-500">
                    {errors.location.message}
                  </span>
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

export default VehicleDetailsOtherForm;

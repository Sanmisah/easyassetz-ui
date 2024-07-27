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
import cross from "@/components/image/close.png";
import { useNavigate } from "react-router-dom";
import Datepicker from "../../Beneficiarydetails/Datepicker";
import { RadioGroup, RadioGroupItem } from "@com/ui/radio-group";
import { useDispatch, useSelector } from "react-redux";
const schema = z.object({
  typeOfIp: z
    .string()
    .min(3, { message: "Intellectual Property Type is required" }),
  firmsRegistrationNumber: z
    .string()
    .min(3, { message: "Registration Number is required" }),
  whetherAssigned: z.string().optional(),
  nameOfAssignee: z
    .string()
    .nonempty({ message: "Name of assignee is required" }),
  expiryDate: z.date().optional(),
  dateOfAssignment: z.date().optional(),
});

const FocusableSelectTrigger = forwardRef((props, ref) => (
  <SelectTrigger ref={ref} {...props} />
));

FocusableSelectTrigger.displayName = "FocusableSelectTrigger";

const IntellectualPropertyOtherForm = () => {
  const navigate = useNavigate();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const queryClient = useQueryClient();
  const [showIntellectualProperty, setShowIntellectualProperty] =
    useState(false);
  const [showOtherArticleDetails, setShowOtherArticleDetails] = useState(false);
  const [selectedNommie, setSelectedNommie] = useState([]);
  const [nomineeerror, setNomineeError] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [
    showOtherFirmsRegistrationNumber,
    setShowOtherFirmsRegistrationNumber,
  ] = useState();

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      typeOfIp: "",
      firmsRegistrationNumber: "",
      expiryDate: "",
      whetherAssigned: "",
      nameOfAssignee: "",
      dateOfAssignment: "",
    },
  });

  const lifeInsuranceMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(`/api/business-assets`, data, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });

      return response.data.data.BusinessAsset;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("LifeInsuranceData");
      toast.success("Other Insurance added successfully!");
      navigate("/intellectualproperty");
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
  const ConverDate = (date) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  };
  const onSubmit = (data) => {
    console.log(data);
    data.expiryDate = ConverDate(data.expiryDate);
    data.dateOfAssignment = ConverDate(data.dateOfAssignment);
    data.type = "intellectualProperty";
    // data.name = name;
    // data.email = email;
    // data.mobile = phone;
    // if (showOtherFirmsRegistrationNumber) {
    //   data.firmRegistrationNumberType = showOtherFirmsRegistrationNumber;
    //   data.firmRegistrationNumber = data.otherFirmRegistrationNumber;
    // }

    // if (data.firmRegistrationNumber === "other") {
    //   data.firmRegistrationNumber = data.otherFirmRegistrationNumber;
    // }

    lifeInsuranceMutate.mutate(data);
  };
  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-2xl font-bold">
                Intellectual Property Details
              </CardTitle>
              <CardDescription>
                Fill out the form to add a new Intellectual Property.
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
                <Label htmlFor=" typeOfIp">
                  Type Of Intellectual Property{" "}
                </Label>
                <Controller
                  name="typeOfIp"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="typeOfIp"
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowIntellectualProperty(value === "other");
                      }}
                      className={errors.typeOfIp ? "border-red-500" : ""}
                    >
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select Intellectual Property Type" />
                      </FocusableSelectTrigger>
                      <SelectContent>
                        <SelectItem value="tradeMark"> Trade Mark</SelectItem>
                        <SelectItem value="copyright">Copyright</SelectItem>
                        <SelectItem value="patent">Patent</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {showIntellectualProperty && (
                  <Controller
                    name=" IntellectualProperty"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Intellectual Property Type"
                        className="mt-2"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    )}
                  />
                )}
                {errors.typeOfIp && (
                  <span className="text-red-500">
                    {errors.typeOfIp.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor=" firmsRegistrationNumber">
                  Registration Number
                </Label>
                <Controller
                  name="firmsRegistrationNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="firmsRegistrationNumber"
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

            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Controller
                name="expiryDate"
                control={control}
                render={({ field }) => (
                  <Datepicker
                    {...field}
                    onChange={(date) => field.onChange(date)}
                    selected={field.value}
                  />
                )}
              />
              {errors.expiryDate && (
                <span className="text-red-500 mt-5">
                  {errors.expiryDate.message}
                </span>
              )}
            </div>

            <div className="space-y-4 flex flex-col">
              <Label className="text-lg font-bold">Whether Assigned</Label>
              <Controller
                name="whetherAssigned"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    className="flex items-center gap-2"
                  >
                    <div className="flex items-center gap-2 text-center">
                      <RadioGroupItem
                        defaultChecked="yes"
                        id="yes"
                        value="yes"
                      />
                      <Label htmlFor="broker">Yes</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id="no" value="no" />
                      <Label htmlFor="no">No</Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor=" nameOfAssignee">Name OF Assignee</Label>
                <Controller
                  name="nameOfAssignee"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="nameOfAssignee"
                      placeholder="Enter Name OF Assignee "
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                      className={errors.nameOfAssignee ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.nameOfAssignee && (
                  <span className="text-red-500">
                    {errors.nameOfAssignee.message}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfAssignment">Date of Assignment</Label>
              <Controller
                name="dateOfAssignment"
                control={control}
                render={({ field }) => (
                  <Datepicker
                    {...field}
                    onChange={(date) => field.onChange(date)}
                    selected={field.value}
                  />
                )}
              />
              {errors.dateOfAssignment && (
                <span className="text-red-500 mt-5">
                  {errors.dateOfAssignment.message}
                </span>
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

export default IntellectualPropertyOtherForm;

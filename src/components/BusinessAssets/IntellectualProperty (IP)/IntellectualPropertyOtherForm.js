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

const schema = z.object({
   typeOfIntellectualProperty: z.string().nonempty({ message: "Intellectual Property Name is required" }),
   registrationNumber: z
    .string()
    .nonempty({ message: "Registration Number is required" }),
   expiryDate: z
    .string()
    .min(2, { message: "    Expiry Date is required" }),

   whetherAssigned: z
    .string()
    .min(3, { message: "  Whether Assigned is required" })
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .transform((value) => (value === null ? null : Number(value))),
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
  const [showIntellectualProperty, setShowIntellectualProperty] = useState(false);
  const [selectedNommie, setSelectedNommie] = useState([]);
  const [displaynominie, setDisplaynominie] = useState([]);
  const [nomineeerror, setNomineeError] = useState(false);
  const [otherFirmName, setOtherFirmName] = useState("");


  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
       typeOfIntellectualProperty: "",
       registrationNumber: "",
       expiryDate: "",
       whetherAssigned: "",
      name: "",
      email: "",
      phone: "",
    },
  });

  const lifeInsuranceMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(`/api/propriterships`, data, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });

      return response.data.data.IntellectualProperty;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("LifeInsuranceData");
      toast.success("Other Insurance added successfully!");
      navigate("/otherinsurance");
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
    data.name = name;
    data.email = email;
    data.mobile = phone;

    if (data. expiryDate === "other") {
      data. expiryDate = data.otherFirmName;
    }

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
                <Label htmlFor=" typeOfIntellectualProperty">Type Of Intellectual Property </Label>
                <Controller
                  name=" typeOfIntellectualProperty"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id=" typeOfIntellectualProperty"
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowIntellectualProperty(value === "other");
                      }}
                      className={errors. typeOfIntellectualProperty ? "border-red-500" : ""}
                    >
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select Intellectual Property Type" />
                      </FocusableSelectTrigger>
                      <SelectContent>

                        <SelectItem value="company1"> Trade Mark</SelectItem>
                        <SelectItem value="company1">Copyright</SelectItem>
                        <SelectItem value="company1">Patent</SelectItem>

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
                {errors. typeOfIntellectualProperty && (
                  <span className="text-red-500">
                    {errors. typeOfIntellectualProperty.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor=" registrationNumber">
                  Registration Number
                </Label>
                <Controller
                  name=" registrationNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id=" registrationNumber"
                      placeholder="Enter Registration Number"
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                      className={
                        errors. registrationNumber ? "border-red-500" : ""
                      }
                    />
                  )}
                />
                {errors. registrationNumber && (
                  <span className="text-red-500">
                    {errors. registrationNumber.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor=" expiryDate">
                  Expiry Date 
                </Label>
                <Controller
                  name=" expiryDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id=" expiryDate"
                      placeholder="Enter Expiry Date "
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                      className={
                        errors. expiryDate ? "border-red-500" : ""
                      }
                    />
                  )}
                />
                {errors. expiryDate && (
                  <span className="text-red-500">
                    {errors. expiryDate.message}
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





            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor=" nameOfAssignee">
                  Name OF Assignee  
                </Label>
                <Controller
                  name=" nameOfAssignee"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id=" nameOfAssignee"
                      placeholder="Enter Name OF Assignee "
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                      className={
                        errors. nameOfAssignee ? "border-red-500" : ""
                      }
                    />
                  )}
                />
                {errors. nameOfAssignee && (
                  <span className="text-red-500">
                    {errors. nameOfAssignee.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor=" dateOfAssignment">
                  Date Of Assignment      
                </Label>
                <Controller
                  name=" dateOfAssignment"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id=" dateOfAssignment"
                      placeholder="Enter Date Of Assignment "
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                      className={
                        errors. dateOfAssignment ? "border-red-500" : ""
                      }
                    />
                  )}
                />
                {errors. dateOfAssignment && (
                  <span className="text-red-500">
                    {errors. dateOfAssignment.message}
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

export default IntellectualPropertyOtherForm;

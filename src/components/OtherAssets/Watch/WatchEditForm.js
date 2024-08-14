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
  company: z.string().nonempty({ message: "Company is required" }),
  model: z.string().nonempty({ message: "Model is required" }),
  // hufShare: z.string().optional(),
  // additionalInformation: z.string().optional(),
  name: z.string().optional(),
  email: z.string().optional(),
  mobile: z.string().optional(),
  type: z.any().optional(),
});

const WatchEditForm = () => {
  const navigate = useNavigate();
  const { lifeInsuranceEditId } = useSelector((state) => state.counterSlice);
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const queryClient = useQueryClient();
  const [showOtherMetalType, setShowOtherMetalType] = useState(false);
  const [fourWheelerStatus, setfourWheelerStatus] = useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      company: "",
      model: "",
      // hufShare: "",
      // additionalInformation: "",
      name: "",
      email: "",
      mobile: "",
      type: "watch",
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
    setValue("company", data.company);
    setValue("model", data.model);
    // setValue("hufShare", data.hufShare);
    // setValue("additionalInformation", data.additionalInformation);
    setValue("name", data.name);
    setValue("email", data.email);
    setValue("mobile", data.mobile);
    return response.data.data.OtherAsset;
  };

  const {
    data: Benifyciary,
    isLoading,
    isError,
  } = useQuery({
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
      const Formdata = new FormData();
      Formdata.append("watchImages", data.watchImages);

      for (const [key, value] of Object.entries(data)) {
        Formdata.append(key, value);
      }
      const response = await axios.put(
        `/api/other-assets/${lifeInsuranceEditId}`,
        Formdata,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      return response.data.data.Watch;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("loanData");
      toast.success("Watch updated successfully!");
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
    console.log(data);
    // data.type = "huf";
    // data.emiDate = formatDate(data.emiDate);
    // data.startDate = formatDate(data.startDate);
    // data.type = "vehicle";
    loanMutate.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading loan data</div>;

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-2xl font-bold">
                Edit Watch Details
              </CardTitle>
              <CardDescription>
                Update the form to edit the Watch details.
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
                <Label htmlFor="company">Name of Company</Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="company"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="company"
                      placeholder="Enter Name of Company"
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
            {/* <div className="space-y-2">
              <Label htmlFor="hufShare">Share of Huf</Label>
              <Controller
                name="hufShare"
                control={control}
                render={({ field }) => (
                  <Input
                    id="hufShare"
                    placeholder="Enter Share of Huf"
                    {...field}
                    className={errors.hufShare ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.hufShare && (
                <span className="text-red-500">{errors.hufShare.message}</span>
              )}
            </div> */}
            {/* <div className="space-y-2">
              <Label>Additional Information</Label>
              <Controller
                name="additionalInformation"
                control={control}
                render={({ field }) => (
                  <Input
                    id="additionalInformation"
                    placeholder="Enter Additional Information"
                    {...field}
                    className={
                      errors.additionalInformation ? "border-red-500" : ""
                    }
                  />
                )}
              />
              {errors.additionalInformation && (
                <span className="text-red-500">
                  {errors.additionalInformation.message}
                </span>
              )}
            </div> */}
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
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile</Label>
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
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.mobile && (
                <span className="text-red-500">{errors.mobile.message}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label>Upload File</Label>
              <Controller
                name="watchImages"
                control={control}
                render={({ field }) => (
                  <Input
                    id="file"
                    type="file"
                    onChange={(event) => {
                      field.onChange(
                        event.target.files && event.target.files[0]
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
                  window.open(`/api/file/${Benifyciary?.watchImages}`);
                }}
              >
                View Attachment
              </Button>
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

export default WatchEditForm;

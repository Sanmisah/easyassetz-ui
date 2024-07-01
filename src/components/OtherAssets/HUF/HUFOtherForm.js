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
import cross from "@/components/image/close.png";

const schema = z.object({
  hufName: z.string().nonempty({ message: " HUF Name is required" }),
  panNumber: z.string().nonempty({ message: "   PAN Number is required" }),
  hufShare: z.string().min(2, { message: "HUF Share is required" }),

  additionalInformation: z.string().optional(),
});

const FocusableSelectTrigger = forwardRef((props, ref) => (
  <SelectTrigger ref={ref} {...props} />
));

FocusableSelectTrigger.displayName = "FocusableSelectTrigger";

const HUFForm = () => {
  const navigate = useNavigate();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const queryClient = useQueryClient();
  const [showOtherMetalType, setShowOtherMetalType] = useState(false);
  const [showOtherArticleDetails, setShowOtherArticleDetails] = useState(false);
  const [selectedNommie, setSelectedNommie] = useState([]);
  const [nomineeerror, setNomineeError] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [showOtherHUf, setShowOtherFirmsRegistrationNumber] = useState();

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      hufName: "",
      panNumber: "",
      hufShare: "",
      additionalInformation: "",
      name: "",
      email: "",
      phone: "",
      type: "huf",
    },
  });

  const lifeInsuranceMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(`/api/other-assets`, data, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });

      return response.data.data.OtherAsset;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("HUFData");
      toast.success("HUF Details added successfully!");
      navigate("/huf");
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
    console.log("Form Data:", data);
    lifeInsuranceMutate.mutate(data);
  };

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-2xl font-bold">HUF Details</CardTitle>
              <CardDescription>
                Fill out the form to add a new HUF.
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
              <Label htmlFor="hufName">HUF Name</Label>
              <Controller
                name="hufName"
                control={control}
                render={({ field }) => (
                  <Input
                    id="hufName"
                    placeholder="Enter HUF Name"
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className={errors.hufName ? "border-red-500" : ""}
                  />
                )}
              />

              {errors.hufName && (
                <span className="text-red-500">{errors.hufName.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="panNumber">PAN Number</Label>
              <Controller
                name="panNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    id="panNumber"
                    placeholder="Enter PAN Number"
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className={errors.panNumber ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.panNumber && (
                <span className="text-red-500">{errors.panNumber.message}</span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hufShare">HUF Share</Label>
                <Controller
                  name="hufShare"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="hufShare"
                      placeholder="Enter HUF Share"
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                      className={errors.hufShare ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.hufShare && (
                  <span className="text-red-500">
                    {errors.hufShare.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="additionalInformation">Additional Information</Label>
                <Controller
                  name="additionalInformation"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="additionalInformation"
                      placeholder="Enter Additional Information"
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
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
              </div>
            </div>
            <div className="w-full grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="additionalInformation">Point Of Contact</Label>
                <div className="mt-2  flex item-center  gap-2 justify-between">
                  <div className="w-[40%] space-y-2 item-center">
                    <Label htmlFor="name">Name</Label>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="name"
                          placeholder="Enter Name"
                          {...field}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={errors.name ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.name && (
                      <span className="text-red-500">
                        {errors.name.message}
                      </span>
                    )}
                  </div>
                  <div className="w-[40%] space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="email"
                          placeholder="Enter Email"
                          {...field}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={errors.email ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.email && (
                      <span className="text-red-500">
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                  <div className="w-[40%] space-y-2">
                    <Label htmlFor="phone">Phone</Label>
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
                          value={field.value}
                          onChange={(value) => {
                            console.log(value);
                            setPhone(value);
                          }}
                        />
                      )}
                    />
                    {errors.phone && (
                      <span className="text-red-500">
                        {errors.phone.message}
                      </span>
                    )}
                  </div>
                </div>
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

export default HUFForm;

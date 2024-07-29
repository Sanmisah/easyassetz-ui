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
  typeOfArtifacts: z
    .string()
    .nonempty({ message: "Type of Artifacts is required" }),
  otherMetalType: z.string().optional(),
  numberOfArticles: z
    .string()
    .nonempty({ message: "Number of Article Details is required" }),
});

const FocusableSelectTrigger = forwardRef((props, ref) => (
  <SelectTrigger ref={ref} {...props} />
));

FocusableSelectTrigger.displayName = "FocusableSelectTrigger";

const BullionForm = () => {
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
  const [mobile, setPhone] = useState("");
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      typeOfArtifacts: "",
      otherMetalType: "",
      numberOfArticles: "",
    },
  });

  const lifeInsuranceMutate = useMutation({
    mutationFn: async (data) => {
      const Formdata = new FormData();
      Formdata.append("bullionFile", data.bullionFile);

      for (const [key, value] of Object.entries(data)) {
        Formdata.append(key, value);
      }

      const response = await axios.post(
        `/api/other-assets`,

        Formdata,

        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );

      return response.data.data.Artifacts;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("LifeInsuranceData");
      toast.success("Artifacts added successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile");
    },
  });

  // useEffect(() => {
  //   if (selectedNommie.length > 0) {
  //     setNomineeError(false);
  //   }
  // }, [selectedNommie]);

  const onSubmit = (data) => {
    console.log(data);
    if (data.metalType === "other") {
      data.metalType = data.otherMetalType;
    }
    // if (data.articleDetails === "other") {
    //   data.articleDetails = data.otherArticleDetails;
    // }
    // data.name = name;
    // data.email = email;
    // data.mobile = mobile;
    delete data.otherMetalType;
    // delete data.otherArticleDetails;

    lifeInsuranceMutate.mutate(data);
  };

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-2xl font-bold">
                Artifacts Details
              </CardTitle>
              <CardDescription>
                Fill out the form to add a new Artifacts.
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
                <Label htmlFor="metalType">Metal Type</Label>
                <Controller
                  name="metalType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="metalType"
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOtherMetalType(value === "other");
                      }}
                      className={errors.metalType ? "border-red-500" : ""}
                    >
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select Metal Type" />
                      </FocusableSelectTrigger>
                      <SelectContent>
                        <SelectItem value="gold">Gold</SelectItem>
                        <SelectItem value="silver">Silver</SelectItem>
                        <SelectItem value="copper">Copper</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {showOtherMetalType && (
                  <Controller
                    name="otherMetalType"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Metal Type"
                        className="mt-2"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    )}
                  />
                )}
                {errors.metalType && (
                  <span className="text-red-500">
                    {errors.metalType.message}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfArticles">Number Of Article</Label>
              <Controller
                name="numberOfArticles"
                control={control}
                render={({ field }) => (
                  <Input
                    id="numberOfArticles"
                    placeholder="Enter Number Of Article"
                    {...field}
                    value={field.value || ""}
                    onChange={field.onChange}
                    className={errors.numberOfArticles ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.numberOfArticles && (
                <span className="text-red-500">
                  {errors.numberOfArticles.message}
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

export default BullionForm;

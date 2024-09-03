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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { PhoneInput } from "react-international-phone";
import Datepicker from "../../Beneficiarydetails/Datepicker";
import { RadioGroup, RadioGroupItem } from "@com/ui/radio-group";

const FocusableSelectTrigger = forwardRef((props, ref) => (
  <SelectTrigger ref={ref} {...props} />
));

const schema = z.object({
  typeOfArtifacts: z.string().optional(),
  othertypeOfArtifacts: z.string().optional(),
  // otherPaintings: z.string().optional(),
  numberOfArticles: z.string().optional(),
  // hufShare: z.string().optional(),
  // additionalInformation: z.string().optional(),
  // name: z.string().optional(),
  // email: z.string().optional(),
  // mobile: z.string().optional(),
  type: z.any().optional(),
});

const ArtifactsOtherForm = () => {
  const navigate = useNavigate();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const queryClient = useQueryClient();
  const [fourWheelerStatus, setfourWheelerStatus] = useState(false);
  const [showOtherMetalType, setShowOtherMetalType] = useState(false);
  const [showOthertypeOfArtifacts, setShowOthertypeOfArtifacts] =
    useState(false);
  // const [showOtherPaintings, setShowOtherPaintings] = useState(false);
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      typeOfArtifacts: "",
      othertypeOfArtifacts: "",
      // otherPaintings: "",
      numberOfArticles: "",
      // hufShare: "",
      // additionalInformation: "",
      // name: "",
      // email: "",
      // mobile: "",
      type: "artifact",
    },
  });

  const loanMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(`/api/other-assets`, data, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });
      return response.data.data.Watch;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("LoanData");
      toast.success("Artifacts added successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error submitting loan:", error);
      toast.error("Failed to submit loan");
    },
  });

  const onSubmit = async (data) => {
    // console.log(data);
    // const date = new Date(data.yearOfManufacture);
    // const month = String(date.getMonth() + 1).padStart(2, "0");
    // const day = String(date.getDate()).padStart(2, "0");
    // const year = date.getFullYear();
    // const newdate = `${month}/${day}/${year}`;
    // data.yearOfManufacture = newdate;

    // if (data.paintings === "paintings") {
    //   data.paintings = data.otherPaintings;
    // }
    if (data.typeOfArtifacts === "other") {
      data.typeOfArtifacts = data.othertypeOfArtifacts;
    }
    if (data.typeOfArtifacts === "paintings") {
      data.typeOfArtifacts = data.otherPaintings;
    }
    delete data.othertypeOfArtifacts;
    // delete data.otherPaintings;
    // data.type = "vehicle";
    await loanMutate.mutateAsync(data);
  };

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button onClick={() => navigate("/artifacts")}>Back</Button>
              <div>
                <CardTitle className="text-2xl font-bold">Artifacts</CardTitle>
                <CardDescription>
                  Fill out the form to add a new Artifacts.
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
                <Label htmlFor="typeOfArtifacts">Type Of Artifact</Label>
                <Controller
                  name="typeOfArtifacts"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="typeOfArtifacts"
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOthertypeOfArtifacts(value);
                        // setShowOtherPaintings(value);
                      }}
                      className={errors.typeOfArtifacts ? "border-red-500" : ""}
                    >
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select Artifact Type" />
                      </FocusableSelectTrigger>
                      <SelectContent>
                        <SelectItem value="pots">Pots</SelectItem>
                        <SelectItem value="metal">Metal</SelectItem>
                        <SelectItem value="objects">Objects</SelectItem>
                        <SelectItem value="paintings">Paintings</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {showOthertypeOfArtifacts === "other" && (
                  <Controller
                    name="othertypeOfArtifacts"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Artifact Type"
                        className="mt-2"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    )}
                  />
                )}
                {errors.typeOfArtifacts && (
                  <span className="text-red-500">
                    {errors.typeOfArtifacts.message}
                  </span>
                )}
                {/* {showOtherPaintings === "paintings" && (
                  <>
                    <Controller
                      name="otherPaintings"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Specify Painting Name"
                          className="mt-2"
                          value={field.value || ""}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </>
                )}
                {errors.typeOfArtifacts && (
                  <span className="text-red-500">
                    {errors.typeOfArtifacts.message}
                  </span>
                )} */}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfArticles">Number Of Articles</Label>
              <Controller
                name="numberOfArticles"
                control={control}
                render={({ field }) => (
                  <Input
                    id="numberOfArticles"
                    placeholder="Enter Number Of Articles"
                    {...field}
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
            {/* <div className="space-y-2">
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
            </div> */}

            {/* <div className="space-y-2">
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
            </div> */}
            {/* <div className="space-y-2">
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
            </div> */}

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

export default ArtifactsOtherForm;

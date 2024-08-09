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
// import { RadioGroup, RadioGroupItem } from "@com/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@com/ui/select";
// import Datepicker from "../../Beneficiarydetails/Datepicker";

const FocusableSelectTrigger = forwardRef((props, ref) => (
  <SelectTrigger ref={ref} {...props} />
));

const schema = z.object({
  typeOfArtifacts: z
    .string()
    .nonempty({ message: "Bank/Institution Name is required" }),
  othertypeOfArtifacts: z.string().optional(),
  // fourWheeler: z
  //   .string()
  //   .nonempty({ message: "Loan Account Number is required" }),
  // otherFourWheeler: z.string().optional(),
  // company: z.string().optional(),
  // model: z.any().optional(),
  // registrationNumber: z.any().optional(),
  // yearOfManufacture: z.any().optional(),
  numberOfArticles: z
    .string()
    .nonempty({ message: "Guarantor Name is required" }),
});

const ArtifactsEditForm = () => {
  const navigate = useNavigate();
  const { lifeInsuranceEditId } = useSelector((state) => state.counterSlice);
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const queryClient = useQueryClient();
  const [showOtherMetalType, setShowOtherMetalType] = useState(false);
  // const [fourWheelerStatus, setfourWheelerStatus] = useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      typeOfArtifacts: "",
      // fourWheeler: "",
      // company: "",
      // model: "",
      // duration: "",
      // dueDate: "",
      numberOfArticles: "",
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
    let data = response.data.data.Artifact;
    setValue("typeOfArtifacts", data.typeOfArtifacts);
    // setValue("fourWheeler", data.fourWheeler);
    // setValue("company", data.company);
    // setValue("model", data.model);
    // setValue("registrationNumber", data.registrationNumber);
    // setValue("yearOfManufacture", data.yearOfManufacture);
    setValue("numberOfArticles", data.numberOfArticles);
    return response.data.data.Artifact;
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
      return response.data.data.Artifact;
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
  // const formatDate = (date) => {
  //   const d = new Date(date);
  //   const month = String(d.getMonth() + 1).padStart(2, "0");
  //   const day = String(d.getDate()).padStart(2, "0");
  //   const year = d.getFullYear();
  //   return `${month}/${day}/${year}`;
  // };

  const onSubmit = (data) => {
    console.log(data);

    // data.emiDate = formatDate(data.emiDate);
    // data.startDate = formatDate(data.startDate);
    data.type = "artifact";
    loanMutate.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading artifacts data</div>;

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button onClick={() => navigate("/artifacts")}>Back</Button>
              <div>
                <CardTitle className="text-2xl font-bold">
                  Edit Artifacts Details
                </CardTitle>
                <CardDescription>
                  Update the form to edit the artifacts details.
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
            <div className="space-y-2">
              <Label htmlFor="typeOfArtifacts">Type Of Artifacts</Label>
              <Controller
                name="typeOfArtifacts"
                control={control}
                render={({ field }) => (
                  <Select
                    id="typeOfArtifacts"
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setShowOtherMetalType(value === "other");
                    }}
                    className={errors.typeOfArtifacts ? "border-red-500" : ""}
                  >
                    <FocusableSelectTrigger>
                      <SelectValue placeholder="Select Type Of Artifacts" />
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
              {errors.typeOfArtifacts && (
                <span className="text-red-500">
                  {errors.typeOfArtifacts.message}
                </span>
              )}
            </div>
            {showOtherMetalType && (
              <Controller
                name="othertypeOfArtifacts"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Specify Type Of Artifacts"
                    className="mt-2"
                  />
                )}
              />
            )}
            {/* <div className="space-y-2">
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
                        setfourWheelerStatus(value === "other");
                      }}
                      className={errors.fourWheeler ? "border-red-500" : ""}
                    >
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </FocusableSelectTrigger>
                      <SelectContent>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="truck">Truck</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                        <SelectItem value="bus">Bus</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {fourWheelerStatus && (
                  <Controller
                    name="otherFourWheeler"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Type"
                        className="mt-2"
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
                      className={errors.company ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.company && (
                  <span className="text-red-500">{errors.company.message}</span>
                )}
              </div>
            </div> */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className={errors.model ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.model && (
                  <span className="text-red-500">{errors.model.message}</span>
                )}
              </div>
            </div> */}

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number</Label>
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
            </div> */}

            {/* <div className="space-y-2">
              <Label htmlFor="yearOfManufacture">Year Of Manufacture</Label>
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
            </div> */}
            <div className="space-y-4 flex flex-col">
              <Label className="text-lg font-bold">Number Of Articles</Label>
              <Controller
                name="numberOfArticles"
                control={control}
                render={({ field }) => (
                  <Input
                    id="numberOfArticles"
                    placeholder="Enter numberOfArticles"
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

            <CardFooter className="flex justify-end gap-2 mt-8">
              <Button type="submit">Submit</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArtifactsEditForm;

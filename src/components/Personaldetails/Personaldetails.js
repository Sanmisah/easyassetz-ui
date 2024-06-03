import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { Label } from "@com/ui/label";
import { Input } from "@com/ui/input";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@com/ui/select";
import { Button } from "@com/ui/button";
import { PopoverTrigger, PopoverContent, Popover } from "@com/ui/popover";
import { Calendar } from "@com/ui/calendar";
import { RadioGroupItem, RadioGroup } from "@com/ui/radio-group";
import { Checkbox } from "@com/ui/checkbox";
import Datepicker from "./Datepicker";

const Personaldetail = () => {
  const [showAdharFields, setShowAdharFields] = useState(false);
  const [showPANFields, setShowPANFields] = useState(false);
  const [showDLFields, setShowDLFields] = useState(false);
  const [showPassportFields, setShowPassportFields] = useState(false);
  const [isForeign, setIsForeign] = useState(false);
  const [sameAsLoginEmail, setSameAsLoginEmail] = useState(true);
  const [sameAsPermanentAddress, setSameAsPermanentAddress] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      adhar: "no",
      pan: "no",
      drivingLicense: "no",
      passport: "no",
      dob: null,
      drivingLicenseExpiry: null,
      drivingLicensePlace: "",
      passportExpiry: null,
      passportPlace: "",
      nationality: "indian",
      specificNationality: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission
  };

  const permanentAddress = watch([
    "permanentHouseFlatNo",
    "permanentAddressLine1",
    "permanentAddressLine2",
    "permanentPincode",
    "permanentCity",
    "permanentState",
    "permanentCountry",
  ]);

  useEffect(() => {
    if (sameAsPermanentAddress) {
      setValue("currentHouseFlatNo", permanentAddress[0]);
      setValue("currentAddressLine1", permanentAddress[1]);
      setValue("currentAddressLine2", permanentAddress[2]);
      setValue("currentPincode", permanentAddress[3]);
      setValue("currentCity", permanentAddress[4]);
      setValue("currentState", permanentAddress[5]);
      setValue("currentCountry", permanentAddress[6]);
    }
  }, [sameAsPermanentAddress, permanentAddress, setValue]);

  const handlePincodeChange = async (pincode) => {
    try {
      const response = await axios.get(
        `https://api.example.com/pincode/${pincode}`
      );
      const { city, state, country } = response.data;

      setValue("permanentCity", city);
      setValue("permanentState", state);
      setValue("permanentCountry", country);
    } catch (error) {
      console.error("Failed to fetch pincode details:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Personal Details</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {/* Other fields remain unchanged */}

        {/* Nationality Section */}
        <div className="space-y-2">
          <Label htmlFor="nationality">Nationality</Label>
          <Controller
            name="nationality"
            control={control}
            rules={{ required: "Nationality is required" }}
            render={({ field }) => (
              <RadioGroup
                {...field}
                onValueChange={(value) => {
                  field.onChange(value);
                  setIsForeign(value === "foreign");
                  if (value === "indian") {
                    setValue("specificNationality", "");
                  }
                }}
              >
                <div className="flex items-center gap-4">
                  <Label
                    className="flex items-center gap-2"
                    htmlFor="nationality-indian"
                  >
                    <RadioGroupItem id="nationality-indian" value="indian" />
                    Indian
                  </Label>
                  <Label
                    className="flex items-center gap-2"
                    htmlFor="nationality-foreign"
                  >
                    <RadioGroupItem id="nationality-foreign" value="foreign" />
                    Foreign
                  </Label>
                </div>
              </RadioGroup>
            )}
          />
          {errors.nationality && (
            <span className="text-red-500">{errors.nationality.message}</span>
          )}
          {isForeign && (
            <div className="space-y-2 mt-2">
              <Label htmlFor="specific-nationality">Specific Nationality</Label>
              <Controller
                name="specificNationality"
                control={control}
                rules={{ required: isForeign }}
                render={({ field }) => (
                  <Select
                    {...field}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="afghan">Afghan</SelectItem>
                      <SelectItem value="argentine">Argentine</SelectItem>
                      <SelectItem value="australian">Australian</SelectItem>
                      <SelectItem value="austrian">Austrian</SelectItem>
                      <SelectItem value="bangladeshi">Bangladeshi</SelectItem>
                      <SelectItem value="belgian">Belgian</SelectItem>
                      <SelectItem value="brazilian">Brazilian</SelectItem>
                      <SelectItem value="british">British</SelectItem>
                      <SelectItem value="canadian">Canadian</SelectItem>
                      <SelectItem value="chilean">Chilean</SelectItem>
                      <SelectItem value="colombian">Colombian</SelectItem>
                      <SelectItem value="costa-rican">Costa Rican</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.specificNationality && (
                <span className="text-red-500">
                  {errors.specificNationality.message}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Driving License Section */}
        <div className="col-span-full space-y-4">
          <h2 className="text-2xl font-bold">Driving License</h2>
          <div className="space-y-2">
            <Label htmlFor="driving-license">
              Do you have a Driving License?
            </Label>
            <Controller
              name="drivingLicense"
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setShowDLFields(value === "yes");
                  }}
                >
                  <div className="flex items-center gap-4">
                    <Label
                      className="flex items-center gap-2"
                      htmlFor="driving-license-yes"
                    >
                      <RadioGroupItem id="driving-license-yes" value="yes" />
                      Yes
                    </Label>
                    <Label
                      className="flex items-center gap-2"
                      htmlFor="driving-license-no"
                    >
                      <RadioGroupItem
                        checked={showDLFields === false}
                        id="driving-license-no"
                        value="no"
                      />
                      No
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.drivingLicense && (
              <span className="text-red-500">
                {errors.drivingLicense.message}
              </span>
            )}
          </div>
          {showDLFields && (
            <>
              <div className="space-y-2">
                <Label htmlFor="driving-license-number">DL Number</Label>
                <Input
                  id="driving-license-number"
                  placeholder="DL Number"
                  type="text"
                  {...register("drivingLicenseNumber", {
                    required: "DL Number is required",
                  })}
                />
                {errors.drivingLicenseNumber && (
                  <span className="text-red-500">
                    {errors.drivingLicenseNumber.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="driving-license-name">Name as per DL</Label>
                <Input
                  id="driving-license-name"
                  placeholder="Name as per DL"
                  type="text"
                  {...register("drivingLicenseName", {
                    required: "Name as per DL is required",
                  })}
                />
                {errors.drivingLicenseName && (
                  <span className="text-red-500">
                    {errors.drivingLicenseName.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="driving-license-expiry">Expiry Date</Label>
                <Controller
                  name="drivingLicenseExpiry"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          className="flex-col items-start w-full h-auto"
                          variant="outline"
                          onClick={() => field.onChange(field.value)}
                        >
                          <span className="font-semibold uppercase text-[0.65rem]">
                            Expiry Date
                          </span>
                          <span className="font-normal">
                            {field.value
                              ? new Date(field.value).toLocaleDateString()
                              : "Select Date"}
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 max-w-[276px]">
                        <Calendar
                          selected={field.value}
                          onSelect={(date) => field.onChange(date)}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.drivingLicenseExpiry && (
                  <span className="text-red-500">
                    {errors.drivingLicenseExpiry.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="driving-license-place">Place of issue</Label>
                <Controller
                  name="drivingLicensePlace"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="driving-license-place"
                      placeholder="Place of issue"
                    />
                  )}
                />
                {errors.drivingLicensePlace && (
                  <span className="text-red-500">
                    {errors.drivingLicensePlace.message}
                  </span>
                )}
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="driving-license-file">Upload File</Label>
                <Input
                  id="driving-license-file"
                  type="file"
                  {...register("drivingLicenseFile", {
                    required: "File upload is required",
                  })}
                />
                {errors.drivingLicenseFile && (
                  <span className="text-red-500">
                    {errors.drivingLicenseFile.message}
                  </span>
                )}
              </div> */}
            </>
          )}
        </div>

        {/* Passport Section */}
        <div className="col-span-full space-y-4">
          <h2 className="text-2xl font-bold">Passport</h2>
          <div className="space-y-2">
            <Label htmlFor="passport">Do you have a Passport?</Label>
            <Controller
              name="passport"
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setShowPassportFields(value === "yes");
                  }}
                >
                  <div className="flex items-center gap-4">
                    <Label
                      className="flex items-center gap-2"
                      htmlFor="passport-yes"
                    >
                      <RadioGroupItem id="passport-yes" value="yes" />
                      Yes
                    </Label>
                    <Label
                      className="flex items-center gap-2"
                      htmlFor="passport-no"
                    >
                      <RadioGroupItem
                        checked={showPassportFields === false}
                        id="passport-no"
                        value="no"
                      />
                      No
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.passport && (
              <span className="text-red-500">{errors.passport.message}</span>
            )}
          </div>
          {showPassportFields && (
            <>
              <div className="space-y-2">
                <Label htmlFor="pp-number">PP Number</Label>
                <Input
                  id="pp-number"
                  placeholder="PP Number"
                  type="text"
                  {...register("passportNumber", {
                    required: "Passport Number is required",
                  })}
                />
                {errors.passportNumber && (
                  <span className="text-red-500">
                    {errors.passportNumber.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="pp-name">Name as per PP</Label>
                <Input
                  id="pp-name"
                  placeholder="Name as per PP"
                  type="text"
                  {...register("passportName", {
                    required: "Name as per Passport is required",
                  })}
                />
                {errors.passportName && (
                  <span className="text-red-500">
                    {errors.passportName.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="pp-expiry">Expiry Date</Label>
                <Controller
                  name="passportExpiry"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          className="flex-col items-start w-full h-auto"
                          variant="outline"
                          onClick={() => field.onChange(field.value)}
                        >
                          <span className="font-semibold uppercase text-[0.65rem]">
                            Expiry Date
                          </span>
                          <span className="font-normal">
                            {field.value
                              ? new Date(field.value).toLocaleDateString()
                              : "Select Date"}
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 max-w-[276px]">
                        <Calendar
                          selected={field.value}
                          onSelect={(date) => field.onChange(date)}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.passportExpiry && (
                  <span className="text-red-500">
                    {errors.passportExpiry.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="pp-place">Place of issue</Label>
                <Controller
                  name="passportPlace"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="pp-place"
                      placeholder="Place of issue"
                    />
                  )}
                />
                {errors.passportPlace && (
                  <span className="text-red-500">
                    {errors.passportPlace.message}
                  </span>
                )}
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="pp-file">Upload File</Label>
                <Input
                  id="pp-file"
                  type="file"
                  {...register("passportFile", {
                    required: "File upload is required",
                  })}
                />
                {errors.passportFile && (
                  <span className="text-red-500">
                    {errors.passportFile.message}
                  </span>
                )}
              </div> */}
            </>
          )}
        </div>

        <div className="col-span-full flex justify-end">
          <Button className="w-full max-w-[200px]" type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Personaldetail;

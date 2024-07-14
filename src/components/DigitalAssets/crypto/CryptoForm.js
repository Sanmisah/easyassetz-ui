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
import { RadioGroup, RadioGroupItem } from "@com/ui/radio-group";
import Datepicker from "../../Beneficiarydetails/Datepicker";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Addnominee from "@/components/Nominee/addNominee";
import cross from "@/components/image/close.png";
import { PhoneInput } from "react-international-phone";

const schema = z.object({
  cryptoWalletType: z
    .string()
    .nonempty({ message: "Wallet type is required required" }),
  otherCryptoWalletType: z.string().optional(),
  cryptoWalletAddress: z
    .string()
    .nonempty({ message: "Crypto Wallet Address is required" }),
  exchange:z.string()
  .nonempty({ message: "exchange is required required" }),
  otherExchange:z.string().optional(),
  tradingAccount: z
  .string()
  .nonempty({ message: "Trading Account is required" }),
  typeOfCurrency: z
    .string()
    .optional(),
  otherTypeOfCurrency: z.string().optional(),
  holdingQty:z.string().optional(),
 // maturityDate: z.date().optional(),
  // premium: z
  //   .string()
  //   .min(3, { message: "Premium is required" })
  //   .transform((value) => (value === "" ? null : value))
  //   .nullable()
  //   .refine((value) => value === null || !isNaN(Number(value)), {
  //     message: "Premium must be a number",
  //   })
  //   .transform((value) => (value === null ? null : Number(value))),
  // sumInsured: z
  //   .string()
  //   .min(3, { message: "Sum Insured is required" })
  //   .transform((value) => (value === "" ? null : value))
  //   .nullable()
  //   .refine((value) => value === null || !isNaN(Number(value)), {
  //     message: "Sum Insured must be a number",
  //   })
  //   .transform((value) => (value === null ? null : Number(value))),
  // policyHolderName: z
  //   .string()
  //   .nonempty({ message: "Policy Holder Name is required" }),
  // relationship: z.string().nonempty({ message: "Relationship is required" }),
  // otherRelationship: z.string().optional(),
  // modeOfPurchase: z
  //   .string()
  //   .nonempty({ message: "Mode of Purchase is required" }),
  // contactPerson: z.string().nonempty({ message: "Contact Person is required" }),
  // contactNumber: z.string().min(7, {
  //   message: "Contact Number is required and must be more than 7 digits",
  // }),
  // email: z.string().email({ message: "Invalid email address" }),
  // registeredMobile: z.string().optional(),
  // registeredEmail: z.string().optional(),
  additionalDetails: z.string().optional(),
  // previousPolicyNumber: z.string().optional(),
  // brokerName: z.string().nonempty({ message: "Broker Name is required" }),
});

const FocusableSelectTrigger = forwardRef((props, ref) => (
  <SelectTrigger ref={ref} {...props} />
));

FocusableSelectTrigger.displayName = "FocusableSelectTrigger";

const CryptoForm = () => {
  const navigate = useNavigate();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const queryClient = useQueryClient();
  const [showOtherInsuranceCompany, setShowOtherInsuranceCompany] =
    useState(false);
    const [otherCryptoWalletType, setOtherCryptoWalletType] =
    useState(false);
    const [otherExchange, setOtherExchange] =
    useState(false);
    const [otherTypeOfCurrency, setOtherTypeOfCurrency] =
    useState(false);
    
  const [showOtherRelationship, setShowOtherRelationship] = useState(false);
  const [hideRegisteredFields, setHideRegisteredFields] = useState(false);
  const [selectedNommie, setSelectedNommie] = useState([]);
  const [displaynominie, setDisplaynominie] = useState([]);
  const [brokerSelected, setBrokerSelected] = useState(true);
  const [nomineeerror, setnomineeerror] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      cryptoWalletType: "",
      cryptoWalletAddress: "",
      holdingType: "",
      exchange: "",
      tradingAccount: "",
      typeOfCurrency: "",
      holdingQty: "",
      additionalDetails: "",
      cryptoWalletAddress: "",
      cryptoWalletAddress: "",
      otherCryptoWalletType:"",
      otherExchange:"",
      otherTypeOfCurrency:"",
      // otherInsuranceCompany: "",
      // insuranceType: "",
      // policyNumber: "",
      // maturityDate: "",
      // premium: "",
      // sumInsured: "",
      // policyHolderName: "",
      // relationship: "",
      // otherRelationship: "",
      // modeOfPurchase: "broker",
      // contactPerson: "",
      // contactNumber: "",
      // email: "",
      // registeredMobile: "",
      // registeredEmail: "",
      // additionalDetails: "",
      // previousPolicyNumber: "",
      // brokerName: "",
    },
  });

  const cryptoMutate = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(`/api/cryptos`, data, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });

      return response.data.data.Crypto;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("LifeInsuranceData");
      toast.success("Crypto details added successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error submitting data:", error);
      toast.error("Failed to submit data");
    },
  });
  useEffect(() => {
    if (selectedNommie.length > 0) {
      setnomineeerror(false);
    }
  }, [selectedNommie, nomineeerror]);

  const onSubmit = (data) => {
    if (data.typeOfCurrency === "other") {
      data.typeOfCurrency = data.otherTypeOfCurrency;
    }
    if(data.exchange === "other") {
      data.exchange = data.otherExchange;
    }
    if(data.cryptoWalletAddress === "other") {
      data.cryptoWalletAddress = data.otherCryptoWalletAddress;
    } 
    console.log(data);
    const date = new Date(data.maturityDate);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    const newdate = `${month}/${day}/${year}`;
    data.maturityDate = newdate;
    console.log("Nomiee:", selectedNommie.length > 0);
    if (selectedNommie.length < 1) {
      console.log("Nomiee:", selectedNommie.length > 0);

      setnomineeerror(true);
      return;
    }
    data.nominees = selectedNommie;
    cryptoMutate.mutate(data);
  };
  useEffect(() => {
    console.log("displaynominie:", displaynominie);
  }, [displaynominie]);

  return (
    <div className="w-full">
      <Card className="w-full ">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-2xl font-bold">
                Crypto Details
              </CardTitle>
              <CardDescription>
                Fill out the form to add a new Crypto Details.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 ">
          <form
            className="space-y-6 flex flex-col"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cryptoWalletType">Type of Crypto Wallet</Label>
                <Controller
                  name="cryptoWalletType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="cryptoWalletType"
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setOtherCryptoWalletType(value === "other");
                      }}
                      className={errors.cryptoWalletType ? "border-red-500" : ""}
                    >
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select Wallet Type" />
                      </FocusableSelectTrigger>
                      <SelectContent>
                        <SelectItem value="cryptoExchange">Crypto Exchange</SelectItem>
                        <SelectItem value="digitalWallet">Digital Wallet</SelectItem>
                        <SelectItem value="coldWallet">Cold Wallet</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {otherCryptoWalletType && (
                  <Controller
                    name="otherCryptoWalletType"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Crypto Wallet Type"
                        className="mt-2"
                      />
                    )}
                  />
                )}
                {errors.cryptoWalletType && (
                  <span className="text-red-500">
                    {errors.cryptoWalletType.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cryptoWalletAddress">Crypto Wallet Address</Label>
                <Controller
                  name="cryptoWalletAddress"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="cryptoWalletAddress"
                      placeholder="Enter Crypto Wallet Address"
                      {...field}
                      className={errors.cryptoWalletAddress ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.cryptoWalletAddress && (
                  <span className="text-red-500">
                    {errors.cryptoWalletAddress.message}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="exchange">Exchange</Label>
                <Controller
                  name="exchange"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="exchange"
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setOtherExchange(value === "other");
                      }}
                      className={errors.exchange ? "border-red-500" : ""}
                    >
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select" />
                      </FocusableSelectTrigger>
                      <SelectContent>
                        <SelectItem value="wazirX">Wazir X</SelectItem>
                        <SelectItem value="unoCoin">UnoCoin</SelectItem>
                        <SelectItem value="coinDCX">Coin DCX</SelectItem>
                        <SelectItem value="coinSwitchKuber">Coin Switch Kuber</SelectItem>
                        <SelectItem value="buyUCoin">BuyUCoin</SelectItem>
                        <SelectItem value="giottus">Giottus</SelectItem>
                        <SelectItem value="mudrax">MUDRAX</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {otherExchange && (
                  <Controller
                    name="otherExchange"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify other Exchange"
                        className="mt-2"
                      />
                    )}
                  />
                )}
                {errors.exchange && (
                  <span className="text-red-500">
                    {errors.exchange.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="tradingAccount">Trading Account</Label>
                <Controller
                  name="tradingAccount"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="tradingAccount"
                      placeholder="Enter Trading Account Details"
                      {...field}
                      className={errors.tradingAccount ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.tradingAccount && (
                  <span className="text-red-500">
                    {errors.tradingAccount.message}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="typeOfCurrency">Type of Currency</Label>
                <Controller
                  name="typeOfCurrency"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="typeOfCurrency"
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setOtherTypeOfCurrency(value === "other");
                      }}
                      className={errors.typeOfCurrency ? "border-red-500" : ""}
                    >
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select currency Type" />
                      </FocusableSelectTrigger>
                      <SelectContent>
                        <SelectItem value="cryptoExchange">ApeMax</SelectItem>
                        <SelectItem value="digitalWallet">Bitcoin</SelectItem>
                        <SelectItem value="coldWallet">Etherium</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {otherTypeOfCurrency && (
                  <Controller
                    name="otherTypeOfCurrency"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Specify Other Type Of Currency"
                        className="mt-2"
                      />
                    )}
                  />
                )}
                {errors.typeOfCurrency && (
                  <span className="text-red-500">
                    {errors.typeOfCurrency.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="holdingQty">holdingQty</Label>
                <Controller
                  name="holdingQty"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="holdingQty"
                      placeholder="Enter holding quantity Details"
                      {...field}
                      className={errors.holdingQty ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.holdingQty && (
                  <span className="text-red-500">
                    {errors.holdingQty.message}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="additional-details">Additional Details</Label>
                <Controller
                  name="additionalDetails"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      value={field.value}
                      id="additional-details"
                      placeholder="Enter additional details"
                      {...field}
                    />
                  )}
                />
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
              <Label htmlFor="registered-mobile" className="text-lg font-bold">
                Add nominee
              </Label>
              <Addnominee
                setDisplaynominie={setDisplaynominie}
                setSelectedNommie={setSelectedNommie}
                displaynominie={displaynominie}
              />
              {nomineeerror && (
                <span className="text-red-500">
                  Please select atleast one nominee
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="image-upload">Image Upload</Label>
              <Controller
                name="imageUpload"
                control={control}
                render={({ field }) => (
                  <Input id="image-upload" type="file" {...field} />
                )}
              />
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

export default CryptoForm;

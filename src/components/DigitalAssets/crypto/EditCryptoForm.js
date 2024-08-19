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
import { Textarea } from "@com/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@com/ui/radio-group";
import Datepicker from "../../Beneficiarydetails/Datepicker";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Addnominee from "@/components/Nominee/EditNominee";
import cross from "@/components/image/close.png";
import { PhoneInput } from "react-international-phone";

const FocusableSelectTrigger = forwardRef((props, ref) => (
  <SelectTrigger ref={ref} {...props} />
));

const schema = z.object({
  cryptoWalletType: z.any().optional(),
  otherCryptoWalletType: z.any().optional(),
  cryptoWalletAddress: z
    .string()
    .nonempty({ message: "Crypto Wallet Address is required" }),
  holdingType: z.any().optional(),
  jointHolderName: z.any().optional(),
  jointHolderPan: z.any().optional(),
  exchange: z.any().optional(),
  otherExchange: z.any().optional(),
  tradingAccount: z
    .string()
    .nonempty({ message: "Trading Account is required" }),
  typeOfCurrency: z.any().optional(),
  otherTypeOfCurrency: z.any().optional(),
  holdingQty: z.any().optional(),
  name: z.any().optional(),
  mobile: z.any().optional(),
  email: z.any().optional(),
  additionalDetails: z.any().optional(),
  image: z.any().optional(),
});

const EditCryptoForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const getitem = localStorage.getItem("user");
  const user = JSON.parse(getitem);
  const { lifeInsuranceEditId } = useSelector((state) => state.counterSlice);

  console.log(lifeInsuranceEditId);
  useEffect(() => {
    if (lifeInsuranceEditId) {
      console.log("lifeInsuranceEditId:", lifeInsuranceEditId);
    }
  }, [lifeInsuranceEditId]);
  const [showOtherInsuranceCompany, setShowOtherInsuranceCompany] =
    useState(false);
  const [showOtherRelationship, setShowOtherRelationship] = useState(false);
  const [hideRegisteredFields, setHideRegisteredFields] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);
  const [brokerSelected, setBrokerSelected] = useState(false);
  const [JoinHolder, setJoinHolder] = useState(false);
  const [otherCryptoWalletType, setOtherCryptoWalletType] = useState(false);
  const [otherExchange, setOtherExchange] = useState(false);
  const [otherTypeOfCurrency, setOtherTypeOfCurrency] = useState(false);
  const [selectedNommie, setSelectedNommie] = useState([]);
  const [displaynominie, setDisplaynominie] = useState([]);

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {},
  });

  const getPersonalData = async () => {
    if (!user) return;
    const response = await axios.get(`/api/cryptos/${lifeInsuranceEditId}`, {
      headers: {
        Authorization: `Bearer ${user.data.token}`,
      },
    });
    let data = response.data.data.Crypto;
    // setValue("cryptoWalletType", data.cryptoWalletType);
    // setValue("cryptoWalletAddress", data.cryptoWalletAddress);
    // setValue("holdingType", data.holdingType);
    // setValue("holdingQty", data.holdingQty);
    // setValue("exchange", data.exchange);
    // setValue("tradingAccount", data.tradingAccount);
    // setValue("typeOfCurrency", data.typeOfCurrency);
    // setValue("name", data.name);
    // setValue("mobile", data.mobile);
    // setValue("email", data.email);
    if (data.holdingType === "joint") {
      setJoinHolder(true);
      setValue("holdingType", data.holdingType);
      setValue("jointHolderName", data.jointHolderName);
      setValue("jointHolderPan", data.jointHolderPan);
    }
    if (
      data.cryptoWalletType !== "cryptoExchange" ||
      data.cryptoWalletType !== "digitalWallet" ||
      data.cryptoWalletType !== "coldWallet"
    ) {
      setOtherCryptoWalletType(true);
      setValue("cryptoWalletType", "other");
      setValue("otherCryptoWalletType", data.cryptoWalletType);
    }
    if (
      data.exchange !== "wazirX" ||
      data.exchange !== "unoCoin" ||
      data.exchange !== "coinDCX" ||
      data.exchange !== "coinSwitchKuber" ||
      data.exchange !== "buyUCoin" ||
      data.exchange !== "Giottus" ||
      data.exchange !== "Mudrax"
    ) {
      setOtherExchange(true);
      setValue("exchange", "other");
      setValue("otherExchange", data.exchange);
    }
    if (
      data.typeOfCurrency !== "cryptoExchange" ||
      data.typeOfCurrency !== "digitalWallet" ||
      data.typeOfCurrency !== "coldWallet"
    ) {
      setOtherTypeOfCurrency(true);
      setValue("typeOfCurrency", "other");
      setValue("otherTypeOfCurrency", data.typeOfCurrency);
    }
    setValue("name", data.name);
    setValue("mobile", data.mobile);
    setValue("email", data.email);
    setSelectedNommie(data.nominees.map((nominee) => nominee.id));
    return response.data.data.Crypto;
  };

  const {
    data: Benifyciary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lifeInsuranceDataUpdate", lifeInsuranceEditId],
    queryFn: getPersonalData,

    onSuccess: (data) => {
      if (data.modeOfPurchase === "broker") {
        setBrokerSelected(true);
        setHideRegisteredFields(false);
      }
      if (data.modeOfPurchase === "e-insurance") {
        setBrokerSelected(false);
        setHideRegisteredFields(true);
      }
      setDefaultValues(data);
      reset(data);
      setValue(data);
      setValue("additionalDetails", data.additionalDetails);
      setValue("otherRelationship", data.otherRelationship);
      setValue("registeredMobile", data.registeredMobile);
      setValue("registeredEmail", data.registeredEmail);
      setValue("additionalDetails", data.additionalDetails);
      setValue("previousPolicyNumber", data.previousPolicyNumber);
      setValue("exchange", data.exchange);
      setValue("typeOfCurrency", data.typeOfCurrency);
      setValue("holdingQty", data.holdingQty);
      setValue("holdingType", data.holdingType);
      setValue("modeOfPurchase", data.modeOfPurchase);
      setValue("contactPerson", data.contactPerson);
      setValue("contactNumber", data.contactNumber);
      setValue("registeredMobile", data.registeredMobile);
      setValue("registeredEmail", data.registeredEmail);
      setValue("additionalDetails", data.additionalDetails);
      setValue("previousPolicyNumber", data.previousPolicyNumber);
      setValue("brokerName", data.brokerName);
      setValue("contactPerson", data.contactPerson);
      setValue("contactNumber", data.contactNumber);

      // Set fetched values to the form
      for (const key in data) {
        setValue(key, data[key]);
      }

      setShowOtherInsuranceCompany(data.cryptoWalletType === "other");
      setShowOtherRelationship(data.additionalDetails === "other");

      console.log(data);
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile", error.message);
    },
  });

  const lifeInsuranceMutate = useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();
      for (const [key, value] of Object.entries(data)) {
        formData.append(key, value);
      }
      formData.append("_method", "put");
      const response = await axios.put(
        `/api/cryptos/${lifeInsuranceEditId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      return response.data.data.Crypto;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(
        "lifeInsuranceDataUpdate",
        lifeInsuranceEditId
      );
      toast.success("Crypto added successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile");
    },
  });
  useEffect(() => {
    console.log("Form values:", control._formValues);
  }, [control._formValues]);

  useEffect(() => {
    if (Benifyciary?.nominees) {
      setDisplaynominie(Benifyciary?.nominees);
    }
  }, [Benifyciary?.nominees]);
  const onSubmit = (data) => {
    if (data.cryptoWalletType === "other") {
      data.cryptoWalletType = data.otherCryptoWalletType;
    }
    if (data.exchange === "other") {
      data.exchange = data.otherExchange;
    }
    if (data.typeOfCurrency === "other") {
      data.typeOfCurrency = data.otherTypeOfCurrency;
    }
    if (selectedNommie.length > 0) {
      data.nominees = selectedNommie;
    }
    lifeInsuranceMutate.mutate(data);
  };
  useEffect(() => {
    console.log("displaynominie:", displaynominie);
  }, [displaynominie]);

  useEffect(() => {
    console.log(Benifyciary);
  }, [Benifyciary]);
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error Loading Crypto Data</div>;
  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button onClick={() => navigate("/crypto")}>Back</Button>
              <div>
                <CardTitle className="text-2xl font-bold">
                  Crypto Details
                </CardTitle>
                <CardDescription>
                  Edit the form to update the Crypto details.
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
                <Label htmlFor="cryptoWalletType">Wallet Type</Label>
                <Controller
                  name="cryptoWalletType"
                  control={control}
                  defaultValue={Benifyciary?.cryptoWalletType}
                  render={({ field }) => (
                    <Select
                      id="cryptoWalletType"
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setOtherCryptoWalletType(value === "other");
                      }}
                      className={
                        errors.cryptoWalletType ? "border-red-500" : ""
                      }
                    >
                      <FocusableSelectTrigger>
                        <SelectValue placeholder="Select Wallet Type" />
                      </FocusableSelectTrigger>
                      <SelectContent>
                        <SelectItem value="cryptoExchange">
                          Crypto Exchange
                        </SelectItem>
                        <SelectItem value="digitalWallet">
                          Digital Wallet
                        </SelectItem>
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
                <Label htmlFor="cryptoWalletAddress">
                  Crypto Wallet Address
                </Label>
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="cryptoWalletAddress"
                  control={control}
                  defaultValue={Benifyciary?.cryptoWalletAddress || ""}
                  render={({ field }) => (
                    <Input
                      id="cryptoWalletAddress"
                      placeholder="Enter sub type"
                      value={field.value}
                      {...field}
                      className={
                        errors.cryptoWalletAddress ? "border-red-500" : ""
                      }
                      defaultValue={Benifyciary?.cryptoWalletAddress || ""}
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
                  defaultValue={Benifyciary?.exchange || ""}
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
                        <SelectItem value="coinSwitchKuber">
                          Coin Switch Kuber
                        </SelectItem>
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
                <Label style={{ color: "red" }}>*</Label>
                <Controller
                  name="tradingAccount"
                  defaultValue={Benifyciary?.tradingAccount || ""}
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
                <Label htmlFor="typeOfCurrency">Type Of Currency</Label>
                <Controller
                  name="typeOfCurrency"
                  control={control}
                  defaultValue={Benifyciary?.typeOfCurrency || ""}
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
                <Label htmlFor="sum-insured">Holding Type</Label>
                <Controller
                  name="holdingQty"
                  control={control}
                  defaultValue={Benifyciary?.holdingQty || ""}
                  render={({ field }) => (
                    <Input
                      id="holdingQty"
                      placeholder="Enter Holding Type"
                      {...field}
                      className={errors.holdingQty ? "border-red-500" : ""}
                      defaultValue={Benifyciary?.holdingQty || ""}
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
                <Label htmlFor="holdingType">Holding Type</Label>
                <Controller
                  name="holdingType"
                  control={control}
                  defaultValue={Benifyciary?.holdingType || ""}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setJoinHolder(value === "joint");
                      }}
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2 text-center">
                        <RadioGroupItem id="single" value="single" />
                        <Label htmlFor="single">Single</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem id="joint" value="joint" />
                        <Label htmlFor="joint">Joint</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
                {errors.holdingType && (
                  <span className="text-red-500">
                    {errors.holdingType.message}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-full">
                {JoinHolder && (
                  <div className="space-y-2">
                    <Label htmlFor="jointHolderName">Joint Holder Name</Label>
                    <Controller
                      name="jointHolderName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="jointHolderName"
                          placeholder="Enter Joint Holder Name"
                          {...field}
                          className={
                            errors.jointHolderName ? "border-red-500" : ""
                          }
                        />
                      )}
                    />
                    {errors.jointHolderName && (
                      <span className="text-red-500">
                        {errors.jointHolderName.message}
                      </span>
                    )}
                  </div>
                )}
                {JoinHolder && (
                  <div className="space-y-2">
                    <Label htmlFor="jointHolderPan">Joint Holder Pan</Label>
                    <Controller
                      name="jointHolderPan"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="jointHolderPan"
                          placeholder="Enter Joint Holder Name"
                          {...field}
                          value={field?.value?.toUpperCase() || ""}
                          className={
                            errors.jointHolderPan ? "border-red-500" : ""
                          }
                        />
                      )}
                    />
                    {errors.jointHolderPan && (
                      <span className="text-red-500">
                        {errors.jointHolderPan.message}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalDetails">Additional Details</Label>
                <Controller
                  name="additionalDetails"
                  defaultValue={Benifyciary?.additionalDetails || ""}
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
                {errors.additionalDetails && (
                  <span className="text-red-500">
                    {errors.additionalDetails.message}
                  </span>
                )}
              </div>
            </div>

            {displaynominie && displaynominie.length > 0 && (
              <div className="space-y-2">
                <div className="grid gap-4 py-4">
                  {console.log(displaynominie)}
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
                                (item) => item !== nominee.id
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
                <Label htmlFor="name">Name</Label>
                <Controller
                  name="name"
                  defaultValue={Benifyciary?.name || ""}
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
                <Label htmlFor="mobile">Mobile</Label>
                <Controller
                  name="mobile"
                  control={control}
                  defaultValue={Benifyciary?.mobile || ""}
                  render={({ field }) => (
                    <PhoneInput
                      id="mobile"
                      type="tel"
                      placeholder="Enter mobile number"
                      defaultCountry="in"
                      inputStyle={{ minWidth: "15.5rem" }}
                      {...field}
                      className={errors.mobile ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.mobile && (
                  <span className="text-red-500">{errors.mobile.message}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Controller
                  name="email"
                  control={control}
                  defaultValue={Benifyciary?.email || ""}
                  render={({ field }) => (
                    <Input
                      id="email"
                      type="email"
                      defaultValue={Benifyciary?.email || ""}
                      placeholder="Enter email"
                      {...field}
                      className={errors.email ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.email && (
                  <span className="text-red-500">{errors.email.message}</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-upload">Image Upload</Label>
              <Controller
                name="image"
                control={control}
                defaultValue={Benifyciary?.image || ""}
                render={({ field }) => (
                  <Input id="image-upload" type="file" {...field} />
                )}
              />
            </div>
            <div>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(`/api/file/${Benifyciary?.image}`);
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

export default EditCryptoForm;

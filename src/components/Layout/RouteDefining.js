import React from "react";
import { useLocation } from "react-router-dom";
import PersonalDetails from "@/components/Personaldetail/PersonalDetail";
import BeneficiaryDetails from "@/components/Beneficiarydetails/Benificiarydetails";
import InsuranceMainForm from "@/components/Insurance/Lifeinsurance/InsuranceForm";
import Insurance from "@/components/Insurance/Lifeinsurance/LifeInsurance";
import InsuranceForm from "@/components/Insurance/Lifeinsurance/InsuranceForm";
import EditInsuranceForm from "@/components/Insurance/Lifeinsurance/EditInsuranceForm";
import MotorInsurance from "@/components/Insurance/MotorInsurance/MotorInsurance";
import MotorForm from "@/components/Insurance/MotorInsurance/MotorForm";
import EditMotorForm from "@/components/Insurance/MotorInsurance/EditMotorForm";
import OtherInsurance from "@/components/Insurance/Otherinsurance/OtherInsurance";
import OtherForm from "@/components/Insurance/Otherinsurance/OtherForm";
import EditOtherForm from "@/components/Insurance/Otherinsurance/EditOtherForm";
import GeneralInsurance from "@/components/Insurance/GeneralInsurance/GeneralInsurance";
import GeneralForm from "@/components/Insurance/GeneralInsurance/GeneralForm";
import EditGeneralForm from "@/components/Insurance/GeneralInsurance/EditFormGeneral";
import Healthinsurance from "@/components/Insurance/Healthinsurance/Healthinsurance";
import HealthForm from "@/components/Insurance/Healthinsurance/HealthForm";
import EditHealthForm from "@/components/Insurance/Healthinsurance/EditFormHealth";
import BullionForm from "@/components/Bullion/BullionOtherForm";
import BullionEditFrom from "@/components/Bullion/BullionEdit";
import MembershipForm from "@/components/Membership/MembershipOtherForm";
import MembershipEditFrom from "@/components/Bullion/MembershipEdit";

const RouteDefining = () => {
  const location = useLocation();
  console.log("location:", location);

  return (
    <>
      {/* Conditionally render content based on location */}
      {location.pathname === "/personal" && <PersonalDetails />}
      {location.pathname === "/benificiary" && <BeneficiaryDetails />}
      {location.pathname === "/insurance" && <InsuranceMainForm />}
      {location.pathname === "/lifeinsurance" && <Insurance />}
      {location.pathname === "/lifeinsurance/add" && <InsuranceForm />}
      {location.pathname === "/lifeinsurance/edit" && <EditInsuranceForm />}
      {location.pathname === "/motorinsurance" && <MotorInsurance />}
      {location.pathname === "/motorinsurance/add" && <MotorForm />}
      {location.pathname === "/motorinsurance/edit" && <EditMotorForm />}
      {location.pathname === "/otherinsurance" && <OtherInsurance />}
      {location.pathname === "/otherinsurance/add" && <OtherForm />}
      {location.pathname === "/otherinsurance/edit" && <EditOtherForm />}
      {location.pathname === "/generalinsurance" && <GeneralInsurance />}
      {location.pathname === "/generalinsurance/add" && <GeneralForm />}
      {location.pathname === "/generalinsurance/edit" && <EditGeneralForm />}
      {location.pathname === "/healthinsurance" && <Healthinsurance />}
      {location.pathname === "/healthinsurance/add" && <HealthForm />}
      {location.pathname === "/healthinsurance/edit" && <EditHealthForm />}
      {location.pathname === "/bullion" && <BullionForm />}
      {location.pathname === "/bullion/edit" && <BullionEditFrom />}
      {location.pathname === "/membership" && <MembershipForm />}
      {location.pathname === "/membership/edit" && <MembershipEditFrom />}
    </>
  );
};

export default RouteDefining;

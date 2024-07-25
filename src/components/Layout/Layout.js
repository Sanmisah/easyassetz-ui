import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import PersonalDetails from "@/components/Personaldetail/PersonalDetail";
import BeneficiaryDetails from "@/components/Beneficiarydetails/Benificiarydetails";
import Logo from "../image/Logo.png";
import Hamburger from "../image/hamburger.svg";
import Insurance from "@/components/Insurance/Lifeinsurance/LifeInsurance";
import Crypto from "@/components/DigitalAssets/crypto/Crypto";
import InsuranceMainForm from "@/components/Insurance/InsuranceMainForm";
import DigitalAssetsMainForm from "@/components/DigitalAssets/DigitalAssetsMainForm";
import InsuranceForm from "@/components/Insurance/Lifeinsurance/InsuranceForm";
import CryptoForm from "@/components/DigitalAssets/crypto/CryptoForm";
import EditInsuranceForm from "@/components/Insurance/Lifeinsurance/EditInsuranceForm";
import EditCryptoForm from "@/components/DigitalAssets/crypto/EditCryptoForm";
import OtherAssetMainForm from "@/components/OtherAssets/OtherAsset/OtherAssetMainForm";
import ImmovableAssetsMainForm from "@/components/ImmovableAssets/contents";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@com/ui/sheet";
import MotorForm from "@/components/Insurance/MotorInsurance/MotorForm";
import EditMotorForm from "@/components/Insurance/MotorInsurance/EditMotorForm";
import MotorInsurance from "@/components/Insurance/MotorInsurance/MotorInsurance";
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
import BullionMainForm from "@/components/Bullion/BullionMainForm";
import MembershipForm from "@/components/Membership/MembershipOtherForm";
import MembershipEditForm from "@/components/Membership/MembershipEdit";
import MembershipMainForm from "@/components/Membership/MembershipMainForm";
import BuisnessassetsMainForm from "@/components/BusinessAssets/BusinessAssetsMainForm";
import PropritershipMainForm from "@/components/BusinessAssets/Propritorship/PropritorishipMainForm";
import PropritershipForm from "@/components/BusinessAssets/Propritorship/PropritorshipOtherForm";
import PropritershipEditForm from "@/components/BusinessAssets/Propritorship/PropritorshipEdit";
import IntellectualPropertyMainForm from "@/components/BusinessAssets/IntellectualProperty (IP)/IntellectualPropertyMainForm";
import IntellectualPropertyOtherForm from "@/components/BusinessAssets/IntellectualProperty (IP)/IntellectualPropertyOtherForm";
import OtherAssetsMainForm from "@/components/OtherAssets/OtherAssetsMainForm";
import Dashboard from "@/components/Dashboard/Dashboard";
import PartnershipFirmMainForm from "@/components/BusinessAssets/PartnershipFirm/partnershipMainForm";
import PartnershipFirmOtherForm from "@/components/BusinessAssets/PartnershipFirm/PartnershipOtherForm";
import PartnershipFirmEditForm from "@/components/BusinessAssets/PartnershipFirm/PartnershipEdit";
import CompanyMainForm from "@/components/BusinessAssets/Company/CompanyMainForm";
import CompanyOtherForm from "@/components/BusinessAssets/Company/CompanyOtherForm";
import CompanyEditForm from "@/components/BusinessAssets/Company/CompanyEdit";
import VehicleDetailsMainForm from "@/components/OtherAssets/VehicleDetails/VehicleDetailsMainForm";
import VehicleDetailsOtherForm from "@/components/OtherAssets/VehicleDetails/VehicleDetailsOtherForm";
import VehicleDetailsEditForm from "@/components/OtherAssets/VehicleDetails/VehicleDetailsEditForm";
import HUFMainForm from "@/components/OtherAssets/HUF/HUFMainForm";
import HUFOtherForm from "@/components/OtherAssets/HUF/HUFOtherForm";
import JewelleryMainForm from "@/components/OtherAssets/Jewellery/JewelleryMainForm";
import JewelleryOtherForm from "@/components/OtherAssets/Jewellery/JewelleryOtherForm";
import JewelleryEdit from "@/components/OtherAssets/Jewellery/JewelleryEdit";
import DigitalAssetMainForm from "@/components/DigitalAssets/DigitalAssets/DigitalAssetMainForm";
import DigitalAssetOtherForm from "@/components/DigitalAssets/DigitalAssets/DigitalAssetOtherForm";
import WatchMainForm from "@/components/OtherAssets/Watch/WatchMainForm";
import WatchOtherForm from "@/components/OtherAssets/Watch/WatchOtherForm";
import WatchEdit from "@/components/OtherAssets/Watch/WatchEdit";
import ArtifactsMainForm from "@/components/OtherAssets/Artifacts/MainForm";
import ArtifactsOtherForm from "@/components/OtherAssets/Artifacts/ArtifactsOtherForm";
import HomeLoanOtherForm from "@/components/Liabilities/HomeLoans/HomeLoanOtherForm";
import EditHomeLoanForm from "@/components/Liabilities/HomeLoans/HomeLoanEdit";
import HomeLoanForm from "@/components/Liabilities/HomeLoans/HomeLoanMainForm";
import Liabilities from "@/components/Liabilities/LibilitiesMainForm";
import VehicleLoanMainForm from "@/components/Liabilities/VehicleLoan/VehicleLoanMainForm";
import VehicleLoanOtherForm from "@/components/Liabilities/VehicleLoan/VehicleLoanOtherForm";
import VehicleLoanEdit from "@/components/Liabilities/VehicleLoan/VehicleLoanEdit";
import LitigationMainForm from "@/components/Liabilities/Litigation/LitigationMainForm";
import LitigationOtherForm from "@/components/Liabilities/Litigation/LitigationOtherForm";
import LitigationEdit from "@/components/Liabilities/Litigation/LitigationEdit";
import PpfMainForm from "@/components/RetirementFund/PublicProvidendFund/PpfMainForm";
import PpfOtherForm from "@/components/RetirementFund/PublicProvidendFund/PpfOtherForm";
import PpfEditForm from "@/components/RetirementFund/PublicProvidendFund/PpfEdit";
import ProvidentFund from "@/components/RetirementFund/ProvidentFund/ProvidentFundMainForm";
import ProvidentFundOtherForm from "@/components/RetirementFund/ProvidentFund/ProvidentFundOtherForm";
import ProvidentFundEditForm from "@/components/RetirementFund/ProvidentFund/ProvidentFundEdit";
import NPSMainForm from "@/components/RetirementFund/NPS/NpsMainForm";
import NPSOtherForm from "@/components/RetirementFund//NPS/NpsOtherForm";
import NPSEditForm from "@/components/RetirementFund/NPS/NpsEdit";
import GratuityMainForm from "@/components/RetirementFund/Gratuity/GratuityMainForm";
import GratuityOtherForm from "@/components/RetirementFund/Gratuity/GratuityOtherForm";
import GratuityEditForm from "@/components/RetirementFund/Gratuity/GratuityEdit";
import SuperAnnuationMainForm from "@/components/RetirementFund/SuperAnnuation/SuperAnnuationMainForm";
import SuperAnnuationOtherForm from "@/components/RetirementFund/SuperAnnuation/SuperAnnuationOtherForm";
import SuperAnnuationEditForm from "@/components/RetirementFund/SuperAnnuation/SuperAnnuationEdit";
import PersonalLoanMainForm from "@/components/Liabilities/PersonalLoans/PersonalLoanMainForm";
import PersonalLoanOtherForm from "@/components/Liabilities/PersonalLoans/PersonalLoanOtherForm";
import PersonalLoanEdit from "@/components/Liabilities/PersonalLoans/PersonalLoanEdit";
import OtherLoanMainForm from "@/components/Liabilities/OtherLoans/OtherLoanMainForm";
import OtherLoanOtherForm from "@/components/Liabilities/OtherLoans/OtherLoanOtherForm";
import OtherLoanEdit from "@/components/Liabilities/OtherLoans/OtherLoanMainForm";
import RetirementFundMainForm from "@/components/RetirementFund/RetirementFundsMainForm";
import BankContentForm from "@/components/Bank&Post/contents";
import BankAccountMainForm from "@/components/Bank&Post/BankAccounts/BankAccountMainForm";
import BankAccountOtherForm from "@/components/Bank&Post/BankAccounts/BankAccountOtherForm";
import BankEditForm from "@/components/Bank&Post/BankAccounts/BankAccountEditForm";
import RecoverableMainForm from "@/components/OtherAssets/Recoverable/RecoverableMainForm";
import RecoverableForm from "@/components/OtherAssets/Recoverable/RecoverableForm";
import RecoverableEditForm from "@/components/OtherAssets/Recoverable/RecoverableEdit";
import OtherAssetForm from "@/components/OtherAssets/OtherAsset/OtherAssetForm";
import OtherAssetEditForm from "@/components/OtherAssets/OtherAsset/OtherAssetEdit";
import IntellectualPropertyEditForm from "@/components/BusinessAssets/IntellectualProperty (IP)/IntellectualPropertyEditForm";
import OtherDepositsMainForm from "@/components/Bank&Post/OtherDeposit/OtherDepositMainForm";
import OtherDepositsForm from "@/components/Bank&Post/OtherDeposit/OtherDepositOtherForm";
import OtherDepositsEditForm from "@/components/Bank&Post/OtherDeposit/OtherDepositEdit";
import PSSMainForm from "@/components/Bank&Post/PostSavingScheme/PSSMainForm";
import PSSOtherForm from "@/components/Bank&Post/PostSavingScheme/PSSOtherForm";
import PSSEditForm from "@/components/Bank&Post/PostSavingScheme/PSSEdit";
import PSADMainForm from "@/components/Bank&Post/PostalSavingAccountDetails/PSADMainForm";
import PSADOtherForm from "@/components/Bank&Post/PostalSavingAccountDetails/PSADOtherForm";
import PSADEditForm from "@/components/Bank&Post/PostalSavingAccountDetails/PSADEdit";
import FixDepositsMainForm from "@/components/Bank&Post/FixDeposits/FixDepositsMainForm";
import FixDepositsForm from "@/components/Bank&Post/FixDeposits/FixDepositsAdd";
import FixDepositsEditForm from "@/components/Bank&Post/FixDeposits/FixDepositsEdit";
import BankLockerMainForm from "@/components/Bank&Post/BankLocker/BankLockerMainForm";
import BankLockerOtherForm from "@/components/Bank&Post/BankLocker/BankLockerOtherForm";
import BankLockerEditForm from "@/components/Bank&Post/BankLocker/BankLockerEditForm";
import ResidentialOtherform from "@/components/ImmovableAssets/ResidentialProperty/ResidentialOtherForm";
import ResidentialMainForm from "@/components/ImmovableAssets/ResidentialProperty/ResidentialMainForm";
import ResidentialEditForm from "@/components/ImmovableAssets/ResidentialProperty/ResidentialEdit";
import FinancialAssetsContentForm from "@/components/FinancialAssets/contents";
import ShareDetailsMainForm from "@/components/FinancialAssets/ShareDetails/ShareDetailsMainForm";
import ShareDetailsEditForm from "@/components/FinancialAssets/ShareDetails/ShareDetailsEdit";
import ShareDetailsOtherForm from "@/components/FinancialAssets/ShareDetails/ShareDetailsOtherForm";
import LandMainForm from "@/components/ImmovableAssets/Land/LandMainForm";
import LandOtherForm from "@/components/ImmovableAssets/Land/LandOtherForm";
import LandEditForm from "@/components/ImmovableAssets/Land/LandEdit";
import CommercialMainForm from "@/components/ImmovableAssets/CommercialProperty/CommercialMainForm";
import CommercialOtherForm from "@/components/ImmovableAssets/CommercialProperty/CommercialOtherForm";
import CommercialEditForm from "@/components/ImmovableAssets/CommercialProperty/CommercialEdit";
import DigitalAssetEditForm from "@/components/DigitalAssets/DigitalAssets/DigitalAssetEdit";
const Layout = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col md:grid md:grid-cols-[300px_1fr] gap-8 p-2 sm:p-8 md:p-12 lg:p-16">
      <div className="flex flex-col">
        <div className="flex item-center space-x-[40%] justify-center max-h-[100px] mr-6 ml-8">
          <img
            src={Logo}
            alt="Logo"
            className="w-[200px] max-h-[100px] max-md:block hidden"
          />
          <img
            className="max-md:block hidden self-center ml-[10%] mr-2 w-[30px] h-[30px] cursor-pointer align-self-center justify-self-end"
            src={Hamburger}
            alt="Hamburger"
            onClick={toggle}
          />
        </div>
        <nav id="layout" className="space-y-4 ml-2 mt-4 max-md:hidden">
          <NavLink
            prefetch="true"
            activeClassName="active"
            className="flex items-center gap-2 rounded-md  px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200 focus:bg-gray-200 focus:outline-none dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:bg-gray-700 aria-[current=page]:bg-[#069bb3] aria-[current=page]:text-white"
            to="/personal"
          >
            <UserIcon className="h-5 w-5" />
            Personal Details
          </NavLink>
          <NavLink
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:hover:bg-gray-800 dark:focus:bg-gray-800 aria-[current=page]:bg-[#069bb3] aria-[current=page]:text-white"
            to="/benificiary"
          >
            <HandHelpingIcon className="h-5 w-5" />
            Beneficiary Details
          </NavLink>

          <NavLink
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:hover:bg-gray-800 dark:focus:bg-gray-800 aria-[current=page]:bg-[#069bb3] aria-[current=page]:text-white"
            to="/insurance"
          >
            <UserIcon className="h-5 w-5" />
            Insurance
          </NavLink>

          <NavLink
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:hover:bg-gray-800 dark:focus:bg-gray-800 aria-[current=page]:bg-[#069bb3] aria-[current=page]:text-white"
            to="/bullion"
          >
            <UserIcon className="h-5 w-5" />
            Bullion
          </NavLink>
          <NavLink
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:hover:bg-gray-800 dark:focus:bg-gray-800 aria-[current=page]:bg-[#069bb3] aria-[current=page]:text-white"
            to="/businessasset"
          >
            <UserIcon className="h-5 w-5" />
            Buisness Assets
          </NavLink>
          <NavLink
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:hover:bg-gray-800 dark:focus:bg-gray-800 aria-[current=page]:bg-[#069bb3] aria-[current=page]:text-white"
            to="/membership"
          >
            <UserIcon className="h-5 w-5" />
            Membership
          </NavLink>
          {/* <NavLink
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:hover:bg-gray-800 dark:focus:bg-gray-800 aria-[current=page]:bg-[#069bb3] aria-[current=page]:text-white"
            to="/other-assets"
          >
            <UserIcon className="h-5 w-5" />
            Other Assets
          </NavLink> */}
          <NavLink
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:hover:bg-gray-800 dark:focus:bg-gray-800 aria-[current=page]:bg-[#069bb3] aria-[current=page]:text-white"
            to="/digitalassets"
          >
            <UserIcon className="h-5 w-5" />
            Digital Assets
          </NavLink>
          {/* <NavLink
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:hover:bg-gray-800 dark:focus:bg-gray-800 aria-[current=page]:bg-[#069bb3] aria-[current=page]:text-white"
            to="/liabilities"
          >
            <UserIcon className="h-5 w-5" />
            Liabilities
          </NavLink> */}
          <NavLink
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:hover:bg-gray-800 dark:focus:bg-gray-800 aria-[current=page]:bg-[#069bb3] aria-[current=page]:text-white"
            to="/bank"
          >
            <UserIcon className="h-5 w-5" />
            Bank & Post
          </NavLink>
          <NavLink
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:hover:bg-gray-800 dark:focus:bg-gray-800 aria-[current=page]:bg-[#069bb3] aria-[current=page]:text-white"
            to="/retirementfund"
          >
            <UserIcon className="h-5 w-5" />
            Retirement Fund
          </NavLink>
          <NavLink
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:hover:bg-gray-800 dark:focus:bg-gray-800 aria-[current=page]:bg-[#069bb3] aria-[current=page]:text-white"
            to="/immovableassets"
          >
            <UserIcon className="h-5 w-5" />
            Immovable Assets
          </NavLink>
          <NavLink
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:hover:bg-gray-800 dark:focus:bg-gray-800 aria-[current=page]:bg-[#069bb3] aria-[current=page]:text-white"
            to="/financialassets"
          >
            <UserIcon className="h-5 w-5" />
            Financial Assets
          </NavLink>
        </nav>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle></SheetTitle>
              <SheetDescription>
                <nav className="space-y-4">
                  <img src={Logo} alt="Logo" width="190" height="100" />
                  <NavLink
                    className="flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200 focus:bg-gray-200 focus:outline-none dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                    to="/personal"
                  >
                    <UserIcon className="h-5 w-5" />
                    Personal Details
                  </NavLink>
                  <NavLink
                    className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:hover:bg-gray-800 dark:focus:bg-gray-800"
                    to="/benificiary"
                  >
                    <HandHelpingIcon className="h-5 w-5" />
                    Beneficiary Details
                  </NavLink>
                  <NavLink
                    className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:hover:bg-gray-800 dark:focus:bg-gray-800"
                    to="/nomination"
                  >
                    <HomeIcon className="h-5 w-5" />
                    Insurance
                  </NavLink>
                  <NavLink
                    className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:hover:bg-gray-800 dark:focus:bg-gray-800"
                    to="/insurance"
                  >
                    <HomeIcon className="h-5 w-5" />
                    Bullion
                  </NavLink>
                  <NavLink
                    className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:hover:bg-gray-800 dark:focus:bg-gray-800"
                    to="/bullion"
                  >
                    <HomeIcon className="h-5 w-5" />
                    Other Assets
                  </NavLink>
                  <NavLink
                    className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:hover:bg-gray-800 dark:focus:bg-gray-800"
                    to="/digitalassets"
                  >
                    <HomeIcon className="h-5 w-5" />
                    Digital Assets
                  </NavLink>
                  <NavLink
                    className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:hover:bg-gray-800 dark:focus:bg-gray-800"
                    to="/financialassets"
                  >
                    <HomeIcon className="h-5 w-5" />
                    Financial Assets
                  </NavLink>
                </nav>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>

      {/* Conditionally render content based on location */}
      {location.pathname === "/personal" && <PersonalDetails />}
      {location.pathname === "/benificiary" && <BeneficiaryDetails />}
      {location.pathname === "/insurance" && <InsuranceMainForm />}

      {location.pathname === "/lifeinsurance" && <Insurance />}
      {location.pathname === "/crypto" && <Crypto />}
      {location.pathname === "/lifeinsurance/add" && <InsuranceForm />}
      {location.pathname === "/crypto/add" && <CryptoForm />}
      {location.pathname === "/lifeinsurance/edit" && <EditInsuranceForm />}
      {location.pathname === "/crypto/edit" && <EditCryptoForm />}
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
      {location.pathname === "/bullion" && <BullionMainForm />}
      {location.pathname === "/bullion/add" && <BullionForm />}
      {location.pathname === "/bullion/edit" && <BullionEditFrom />}
      {location.pathname === "/membership/add" && <MembershipForm />}
      {location.pathname === "/membership" && <MembershipMainForm />}
      {location.pathname === "/membership/edit" && <MembershipEditForm />}
      {location.pathname === "/businessasset" && <BuisnessassetsMainForm />}
      {location.pathname === "/propritership" && <PropritershipMainForm />}
      {location.pathname === "/propritership/add" && <PropritershipForm />}
      {location.pathname === "/propritership/edit" && <PropritershipEditForm />}
      {location.pathname === "/partnershipfirm" && <PartnershipFirmMainForm />}
      {location.pathname === "/partnershipfirm/add" && (
        <PartnershipFirmOtherForm />
      )}
      {location.pathname === "/partnershipfirm/edit" && (
        <PartnershipFirmEditForm />
      )}
      {location.pathname === "/intellectualproperty" && (
        <IntellectualPropertyMainForm />
      )}
      {location.pathname === "/intellectualproperty/add" && (
        <IntellectualPropertyOtherForm />
      )}
      {location.pathname === "/intellectualproperty/edit" && (
        <IntellectualPropertyEditForm />
      )}
      {location.pathname === "/dashboard" && <Dashboard />}
      {location.pathname === "/company" && <CompanyMainForm />}
      {location.pathname === "/company/add" && <CompanyOtherForm />}
      {location.pathname === "/company/edit" && <CompanyEditForm />}
      {location.pathname === "/other-assets" && <OtherAssetsMainForm />}
      {location.pathname === "/vehicle" && <VehicleDetailsMainForm />}
      {location.pathname === "/vehicle/add" && <VehicleDetailsOtherForm />}
      {location.pathname === "/vehicle/edit" && <VehicleDetailsEditForm />}
      {location.pathname === "/huf" && <HUFMainForm />}
      {location.pathname === "/huf/add" && <HUFOtherForm />}
      {location.pathname === "/jewellery" && <JewelleryMainForm />}
      {location.pathname === "/jewellery/add" && <JewelleryOtherForm />}
      {location.pathname === "/jewellery/edit" && <JewelleryEdit />}
      {location.pathname === "/digitalassets" && <DigitalAssetMainForm />}
      {location.pathname === "/digitalassets/add" && <DigitalAssetOtherForm />}
      {location.pathname === "/digitalassets/edit" && <DigitalAssetEditForm />}
      {location.pathname === "/watch" && <WatchMainForm />}
      {location.pathname === "/watch/add" && <WatchOtherForm />}
      {location.pathname === "/watch/edit" && <WatchEdit />}
      {location.pathname === "/artifacts" && <ArtifactsMainForm />}
      {location.pathname === "/artifacts/add" && <ArtifactsOtherForm />}
      {location.pathname === "/liabilities" && <Liabilities />}
      {location.pathname === "/homeloans" && <HomeLoanForm />}
      {location.pathname === "/homeloans/add" && <HomeLoanOtherForm />}
      {location.pathname === "/homeloans/edit" && <EditHomeLoanForm />}
      {location.pathname === "/personalloan" && <PersonalLoanMainForm />}
      {location.pathname === "/personalloan/add" && <PersonalLoanOtherForm />}
      {location.pathname === "/personalloan/edit" && <PersonalLoanEdit />}
      {location.pathname === "/vehicleloan" && <VehicleLoanMainForm />}
      {location.pathname === "/vehicleloan/add" && <VehicleLoanOtherForm />}
      {location.pathname === "/vehicleloan/edit" && <VehicleLoanEdit />}
      {location.pathname === "/otherloan" && <OtherLoanMainForm />}
      {location.pathname === "/otherloan/add" && <OtherLoanOtherForm />}
      {location.pathname === "/otherloan/edit" && <OtherLoanEdit />}
      {location.pathname === "/litigation" && <LitigationMainForm />}
      {location.pathname === "/litigation/add" && <LitigationOtherForm />}
      {location.pathname === "/litigation/edit" && <LitigationEdit />}
      {location.pathname === "/ppf" && <PpfMainForm />}
      {location.pathname === "/ppf/add" && <PpfOtherForm />}
      {location.pathname === "/ppf/edit" && <PpfEditForm />}
      {location.pathname === "/providentfund" && <ProvidentFund />}
      {location.pathname === "/providentfund/add" && <ProvidentFundOtherForm />}
      {location.pathname === "/providentfund/edit" && <ProvidentFundEditForm />}
      {location.pathname === "/gratuity" && <GratuityMainForm />}
      {location.pathname === "/gratuity/add" && <GratuityOtherForm />}
      {location.pathname === "/gratuity/edit" && <GratuityEditForm />}
      {location.pathname === "/superannuation" && <SuperAnnuationMainForm />}
      {location.pathname === "/superannuation/add" && (
        <SuperAnnuationOtherForm />
      )}
      {location.pathname === "/superannuation/edit" && (
        <SuperAnnuationEditForm />
      )}
      {location.pathname === "/retirementfund" && <RetirementFundMainForm />}
      {location.pathname === "/nps" && <NPSMainForm />}
      {location.pathname === "/nps/add" && <NPSOtherForm />}
      {location.pathname === "/nps/edit" && <NPSEditForm />}
      {location.pathname === "/bank" && <BankContentForm />}
      {location.pathname === "/bankaccount" && <BankAccountMainForm />}
      {location.pathname === "/bankaccount/add" && <BankAccountOtherForm />}
      {location.pathname === "/bankaccount/edit" && <BankEditForm />}
      {location.pathname === "/fixdeposit" && <FixDepositsMainForm />}
      {location.pathname === "/fixdeposit/add" && <FixDepositsForm />}
      {location.pathname === "/fixdeposit/edit" && <FixDepositsEditForm />}

      {location.pathname === "/recoverable" && <RecoverableMainForm />}
      {location.pathname === "/recoverable/add" && <RecoverableForm />}
      {location.pathname === "/recoverable/edit" && <RecoverableEditForm />}
      {location.pathname === "/other-asset" && <OtherAssetMainForm />}
      {location.pathname === "/other-asset/add" && <OtherAssetForm />}
      {location.pathname === "/other-asset/edit" && <OtherAssetEditForm />}
      {location.pathname === "/other-deposits" && <OtherDepositsMainForm />}
      {location.pathname === "/other-deposits/add" && <OtherDepositsForm />}
      {location.pathname === "/other-deposits/edit" && (
        <OtherDepositsEditForm />
      )}
      {location.pathname === "/pss" && <PSSMainForm />}
      {location.pathname === "/pss/add" && <PSSOtherForm />}
      {location.pathname === "/pss/edit" && <PSSEditForm />}
      {location.pathname === "/psad" && <PSADMainForm />}
      {location.pathname === "/psad/add" && <PSADOtherForm />}
      {location.pathname === "/psad/edit" && <PSADEditForm />}
      {location.pathname === "/banklocker" && <BankLockerMainForm />}
      {location.pathname === "/banklocker/add" && <BankLockerOtherForm />}
      {location.pathname === "/banklocker/edit" && <BankLockerEditForm />}
      {location.pathname === "/immovableassets" && <ImmovableAssetsMainForm />}
      {location.pathname === "/land" && <LandMainForm />}
      {location.pathname === "/residentialproperty" && <ResidentialMainForm />}
      {location.pathname === "/residentialproperty/add" && (
        <ResidentialOtherform />
      )}
      {location.pathname === "/residentialproperty/edit" && (
        <ResidentialEditForm />
      )}
      {location.pathname === "/financialassets" && (
        <FinancialAssetsContentForm />
      )}
      {location.pathname === "/share-details" && <ShareDetailsMainForm />}
      {location.pathname === "/share-details/add" && <ShareDetailsOtherForm />}
      {location.pathname === "/share-details/edit" && <ShareDetailsEditForm />}
      {location.pathname === "/land" && <LandMainForm />}
      {location.pathname === "/land/add" && <LandOtherForm />}
      {location.pathname === "/land/edit" && <LandEditForm />}
      {location.pathname === "/commercialproperty" && <CommercialMainForm />}
      {location.pathname === "/commercialproperty/add" && (
        <CommercialOtherForm />
      )}
      {location.pathname === "/commercialproperty/edit" && (
        <CommercialEditForm />
      )}
    </div>
  );
};

export default Layout;

function HandHelpingIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14" />
      <path d="m7 18 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
      <path d="m2 13 6 6" />
    </svg>
  );
}

function HomeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function SettingsIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function UserIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

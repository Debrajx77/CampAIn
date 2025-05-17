import React, { useState } from "react";
import EmailChannel from "./channels/EmailChannel";
import GoogleAdsChannel from "./channels/GoogleAdsChannel";
import MetaAdsChannel from "./channels/MetaAdsChannel";
import LinkedInAdsChannel from "./channels/LinkedInAdsChannel";
import WhatsAppChannel from "./channels/WhatsAppChannel";
import ChannelSelector from "./ChannelSelector";
import MasterCampaignDetailsForm from "./MasterCampaignDetailsForm";
import StepperNavigation from "./StepperNavigation";
import { useToast } from "../../hooks/useToast";
import { useNavigate } from "react-router-dom";
import { launchCampaign } from "../../api/campaign";
import CampaignPreview from "./CampaignPreview";

const CreateCampaignPage = () => {
  const [step, setStep] = useState(0);
  const [masterCampaign, setMasterCampaign] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const [selectedChannels, setSelectedChannels] = useState([]);
  const [channelConfigs, setChannelConfigs] = useState({});
  const { setToast } = useToast();
  const navigate = useNavigate();

  const handleNext = () => {
    if (step === 0 && (!masterCampaign.name || !masterCampaign.description)) {
      setToast({
        open: true,
        message: "Please fill in all campaign details",
        severity: "error",
      });
      return;
    }

    if (step === 1 && selectedChannels.length === 0) {
      setToast({
        open: true,
        message: "Please select at least one channel",
        severity: "error",
      });
      return;
    }

    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const handleChannelConfigChange = (channelKey, config) => {
    setChannelConfigs((prevConfigs) => ({
      ...prevConfigs,
      [channelKey]: config,
    }));
  };

  const handleLaunchAllChannels = async () => {
    try {
      const payload = {
        ...masterCampaign,
        channels: selectedChannels.map((channelKey) => ({
          channel: channelKey,
          config: channelConfigs[channelKey],
        })),
      };
      await launchCampaign(payload);
      setToast({
        open: true,
        message: "Campaign launched successfully!",
        severity: "success",
      });
      navigate("/campaigns");
    } catch (error) {
      console.error("Error launching campaign:", error);
      setToast({
        open: true,
        message: error?.response?.data?.message || "Failed to launch channels",
        severity: "error",
      });
    }
  };

  const renderChannelForm = (channelKey) => {
    const commonProps = {
      config: channelConfigs[channelKey] || {},
      onConfigChange: (config) => handleChannelConfigChange(channelKey, config),
    };

    switch (channelKey) {
      case "email":
        return <EmailChannel {...commonProps} />;
      case "googleAds":
        return <GoogleAdsChannel {...commonProps} />;
      case "metaAds":
        return <MetaAdsChannel {...commonProps} />;
      case "linkedInAds":
        return <LinkedInAdsChannel {...commonProps} />;
      case "whatsapp":
        return <WhatsAppChannel {...commonProps} />;
      default:
        return null;
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <MasterCampaignDetailsForm
            masterCampaign={masterCampaign}
            setMasterCampaign={setMasterCampaign}
          />
        );
      case 1:
        return (
          <ChannelSelector
            selectedChannels={selectedChannels}
            setSelectedChannels={setSelectedChannels}
          />
        );
      case 2:
        return (
          <div className="space-y-6">
            {selectedChannels.map((channelKey) => (
              <div key={channelKey}>
                <h3 className="text-xl font-semibold capitalize mb-2">
                  {channelKey}
                </h3>
                {renderChannelForm(channelKey)}
              </div>
            ))}
          </div>
        );
      case 3:
        return (
          <CampaignPreview
            masterCampaign={masterCampaign}
            selectedChannels={selectedChannels}
            channelConfigs={channelConfigs}
            handleLaunch={handleLaunchAllChannels}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Campaign</h1>
      {renderStepContent()}
      <StepperNavigation
        step={step}
        handleBack={handleBack}
        handleNext={handleNext}
      />
    </div>
  );
};

export default CreateCampaignPage;

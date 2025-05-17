import React from "react";
import { Button } from "@/components/ui/button";

const CampaignPreview = ({
  masterCampaign,
  selectedChannels,
  channelConfigs,
  handleLaunch,
}) => {
  const isLaunchDisabled = selectedChannels.some(
    (key) =>
      !channelConfigs[key] || Object.keys(channelConfigs[key]).length === 0
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Review & Launch</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Campaign Details</h3>
        <p>
          <strong>Name:</strong> {masterCampaign.name}
        </p>
        <p>
          <strong>Description:</strong> {masterCampaign.description}
        </p>
        <p>
          <strong>Start Date:</strong> {masterCampaign.startDate}
        </p>
        <p>
          <strong>End Date:</strong> {masterCampaign.endDate}
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Selected Channels</h3>
        {selectedChannels.map((channelKey) => (
          <div key={channelKey} className="mb-4">
            <h4 className="text-lg font-medium capitalize">{channelKey}</h4>
            <pre className="bg-gray-100 p-4 rounded">
              {JSON.stringify(channelConfigs[channelKey], null, 2)}
            </pre>
          </div>
        ))}
      </div>

      <Button onClick={handleLaunch} disabled={isLaunchDisabled}>
        Launch All Channels
      </Button>
    </div>
  );
};

export default CampaignPreview;

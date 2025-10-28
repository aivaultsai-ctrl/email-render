import React from 'react';

interface AutomationControlsProps {
  webhookUrl: string;
  onWebhookUrlChange: (url: string) => void;
}

const AutomationControls: React.FC<AutomationControlsProps> = ({ webhookUrl, onWebhookUrlChange }) => {
  
  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">2. Automate Your Outreach</h3>
        <p className="text-sm text-gray-400 mb-4">
          Connect your favorite tools to automatically send these generated emails and supercharge your sales pipeline.
        </p>
      </div>
      <div className="space-y-4">
          <div>
            <label htmlFor="makeWebhook" className="block text-sm font-medium text-gray-300">Make.com Webhook URL</label>
            <input 
              type="url" 
              name="makeWebhook" 
              id="makeWebhook" 
              value={webhookUrl} 
              onChange={(e) => onWebhookUrlChange(e.target.value)} 
              placeholder="Paste your webhook URL here" 
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
            />
            <p className="mt-2 text-xs text-gray-500">
              In Make.com, create a new scenario with a "Custom webhook" trigger to get this URL.
            </p>
          </div>
          <button
            onClick={() => openLink('https://zapier.com/')}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            Connect to Zapier
          </button>
           <button
            disabled
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-500 cursor-not-allowed"
          >
            Integrate with Gmail API (Coming Soon)
          </button>
      </div>
    </div>
  );
};

export default AutomationControls;
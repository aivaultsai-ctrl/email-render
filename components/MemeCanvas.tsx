import React, { useState } from 'react';
import { GeneratedEmail } from '../services/geminiService';
import { Lead } from '../types';

interface EmailDisplayProps {
  emails: GeneratedEmail[];
  lead: Lead | null;
  isLoading: boolean;
  isSending: boolean;
  makeWebhookUrl: string;
  onSendToMake: () => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-full">
        <svg className="animate-spin h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);

const EmailDisplay: React.FC<EmailDisplayProps> = ({ emails, lead, isLoading, isSending, makeWebhookUrl, onSendToMake }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleSendEmail = () => {
    if (!lead || !lead.contactEmail || !emails[activeTab]) return;

    const email = emails[activeTab];
    const subject = encodeURIComponent(email.subject);
    const body = encodeURIComponent(email.body);
    window.location.href = `mailto:${lead.contactEmail}?subject=${subject}&body=${body}`;
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (emails.length === 0) {
      return (
        <div className="text-center">
            <p className="mt-2 text-sm text-gray-400">Enter lead details and generate emails to see the results here.</p>
        </div>
      );
    }
    
    const activeEmail = emails[activeTab];

    return (
      <div>
        <div className="flex justify-between items-center border-b border-gray-700 flex-wrap">
            <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                {emails.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className={`${
                    activeTab === index
                        ? 'border-indigo-500 text-indigo-400'
                        : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                    } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
                >
                    Email Version {index + 1}
                </button>
                ))}
            </nav>
            <div className="flex items-center space-x-2 mb-px ml-4">
               <button
                  onClick={onSendToMake}
                  disabled={!makeWebhookUrl || isSending || emails.length === 0}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                  {isSending ? 'Sending...' : 'Send to Make.com'}
                </button>
                <button
                  onClick={handleSendEmail}
                  disabled={!lead?.contactEmail}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    Send Email
                </button>
            </div>
        </div>
        <div className="mt-4 p-4 bg-gray-900 rounded-md">
            <div className="mb-4">
              <span className="text-xs font-semibold text-gray-400 uppercase">Subject</span>
              <p className="font-medium text-gray-200">{activeEmail.subject}</p>
            </div>
            <div className="border-t border-gray-700 pt-4">
              <span className="text-xs font-semibold text-gray-400 uppercase">Body</span>
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-200 mt-1">
                  {activeEmail.body}
              </pre>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-96 bg-gray-800/70 rounded-lg p-6 border border-gray-700 flex flex-col justify-center">
        <h3 className="text-lg font-semibold text-white mb-4">Generated Outreach Emails</h3>
        {renderContent()}
    </div>
  );
};

export default EmailDisplay;
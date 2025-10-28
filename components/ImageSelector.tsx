import React, { useCallback, useState } from 'react';
import { Lead } from '../types';

interface LeadInputFormProps {
  lead: Lead;
  onLeadChange: (field: keyof Lead, value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  credits: number;
  onAddCredits: () => void;
}

const LeadInputForm: React.FC<LeadInputFormProps> = ({ lead, onLeadChange, onSubmit, isLoading, credits, onAddCredits }) => {
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onLeadChange(name as keyof Lead, value);

    if (name === 'contactEmail') {
      // Simple regex for email validation
      if (value && !/^\S+@\S+\.\S+$/.test(value)) {
        setEmailError('Please enter a valid email address.');
      } else {
        setEmailError(null);
      }
    }
  };

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (credits > 0) {
      onSubmit();
    }
  }, [onSubmit, credits]);

  const isFormIncomplete = !lead.companyName || !lead.contactName || !lead.contactEmail || !lead.website || !lead.niche;
  const isSubmitDisabled = isLoading || isFormIncomplete || !!emailError || credits <= 0;

  return (
    <div className="w-full bg-gray-800 rounded-lg shadow-lg">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">1. Enter Lead Details</h3>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${credits > 0 ? 'text-indigo-300 bg-indigo-900/50' : 'text-red-300 bg-red-900/50'}`}>
                Credits: {credits}
            </span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-300">Company Name</label>
            <input type="text" name="companyName" id="companyName" value={lead.companyName} onChange={handleChange} placeholder="e.g., Acme Inc." required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="contactName" className="block text-sm font-medium text-gray-300">Contact Name</label>
            <input type="text" name="contactName" id="contactName" value={lead.contactName} onChange={handleChange} placeholder="e.g., John Doe" required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-300">Contact Email</label>
            <input type="email" name="contactEmail" id="contactEmail" value={lead.contactEmail} onChange={handleChange} placeholder="e.g., john.doe@example.com" required className={`mt-1 block w-full bg-gray-700 border rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 sm:text-sm ${emailError ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-indigo-500'}`} />
            {emailError && <p className="mt-1 text-sm text-red-400">{emailError}</p>}
          </div>
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-300">Website URL</label>
            <input type="url" name="website" id="website" value={lead.website} onChange={handleChange} placeholder="https://example.com" required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="niche" className="block text-sm font-medium text-gray-300">Industry / Niche</label>
            <input type="text" name="niche" id="niche" value={lead.niche} onChange={handleChange} placeholder="e.g., B2B SaaS for project management" required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
           {credits <= 0 && (
            <div className="text-center p-4 bg-gray-700/50 rounded-md border border-yellow-600/50">
                <p className="text-yellow-300 font-medium">You've used all your free generations.</p>
                <button
                type="button"
                onClick={onAddCredits}
                className="mt-2 text-sm font-semibold text-white underline hover:text-indigo-400 focus:outline-none"
                >
                Subscribe to get more credits.
                </button>
            </div>
            )}
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Generating...' : credits > 0 ? 'Generate Emails' : 'Out of Credits'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeadInputForm;
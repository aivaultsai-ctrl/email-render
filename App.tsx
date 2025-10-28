import React, { useState, useCallback, useEffect } from 'react';
import LeadInputForm from './components/ImageSelector'; // Repurposed as LeadInputForm
import EmailDisplay from './components/MemeCanvas'; // Repurposed as EmailDisplay
import AutomationControls from './components/CaptionControls'; // Repurposed as AutomationControls
import { generateLeadEmails, GeneratedEmail } from './services/geminiService';
import { Lead } from './types';

const App: React.FC = () => {
  const [lead, setLead] = useState<Lead>({
    companyName: '',
    contactName: '',
    contactEmail: '',
    website: '',
    niche: ''
  });
  const [emails, setEmails] = useState<GeneratedEmail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [makeWebhookUrl, setMakeWebhookUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [credits, setCredits] = useState<number>(() => {
    const savedCredits = localStorage.getItem('aiLeadMachineCredits');
    // Initialize with 4 free credits if not found in localStorage
    return savedCredits ? parseInt(savedCredits, 10) : 4;
  });

  useEffect(() => {
    // Persist credits to localStorage whenever they change
    localStorage.setItem('aiLeadMachineCredits', credits.toString());
  }, [credits]);


  const handleLeadChange = (field: keyof Lead, value: string) => {
    setLead(prev => ({ ...prev, [field]: value }));
  };
  
  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  }

  const handleAddCredits = () => {
    const newCredits = 4;
    setCredits(newCredits);
    clearMessages();
    setSuccessMessage(`Subscription successful! You have been given ${newCredits} new credits.`);
  }

  const handleGenerateEmails = useCallback(async () => {
    if (credits <= 0) {
      setError("You are out of credits. Please subscribe to generate more emails.");
      return;
    }
    setIsLoading(true);
    clearMessages();
    setEmails([]);
    try {
      const newEmails = await generateLeadEmails(lead);
      setEmails(newEmails);
      setCredits(prev => prev - 1); // Decrement credit after successful generation
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [lead, credits]);

  const handleSendToMake = useCallback(async () => {
    if (!makeWebhookUrl) {
      setError("Please provide a Make.com webhook URL.");
      return;
    }
    setIsSending(true);
    clearMessages();
    try {
      const response = await fetch(makeWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lead, emails }),
      });

      if (!response.ok) {
        throw new Error(`Webhook failed with status: ${response.status}`);
      }
      
      setSuccessMessage("Successfully sent data to Make.com!");

    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to send data to webhook.');
    } finally {
      setIsSending(false);
    }
  }, [lead, emails, makeWebhookUrl]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
            AI Lead Machine
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Generate personalized outreach emails in seconds with Gemini AI.
          </p>
        </header>

        {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative mb-6" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}
        {successMessage && (
            <div className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded-lg relative mb-6" role="alert">
                <strong className="font-bold">Success: </strong>
                <span className="block sm:inline">{successMessage}</span>
            </div>
        )}

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col gap-8">
            <LeadInputForm 
              lead={lead}
              onLeadChange={handleLeadChange}
              onSubmit={handleGenerateEmails} 
              isLoading={isLoading} 
              credits={credits}
              onAddCredits={handleAddCredits}
            />
            <AutomationControls 
              webhookUrl={makeWebhookUrl}
              onWebhookUrlChange={setMakeWebhookUrl}
            />
          </div>

          <div className="lg:sticky lg:top-8">
            <EmailDisplay 
                emails={emails} 
                lead={lead}
                isLoading={isLoading}
                isSending={isSending}
                makeWebhookUrl={makeWebhookUrl}
                onSendToMake={handleSendToMake}
            />
          </div>
        </main>

        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>Powered by AIVaults.ai</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
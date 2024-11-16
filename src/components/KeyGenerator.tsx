"use client";

import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";

const LoadingSpinner = () => (
  <div 
    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"
    role="status"
  >
    <span className="sr-only">Loading...</span>
  </div>
);

const LoadingOverlay = ({ keySize }: { keySize: string }) => (
  <div 
    className="absolute inset-0 bg-black/50 flex items-center justify-center"
    style={{ pointerEvents: 'none' }}
  >
    <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
      <LoadingSpinner />
      <p className="text-lg font-medium">Generating {keySize}-bit RSA Keys...</p>
    </div>
  </div>
);

const KeyDisplay = ({
  title,
  value,
  onCopy
}: {
  title: string;
  value: string;
  onCopy: () => void;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between py-2">
      <CardTitle className="text-md">{title}</CardTitle>
      {value && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={onCopy}
        >
          Copy
        </Button>
      )}
    </CardHeader>
    <CardContent>
      <textarea 
        className="w-full h-24 px-2 border rounded bg-slate-50 font-mono text-sm"
        value={value}
        readOnly
      />
    </CardContent>
  </Card>
);

const KeyGenerator = () => {
  const [keySize, setKeySize] = useState('2048');
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await invoke<{
        public_key: string;
        private_key: string;
      }>('generate_keypair', { bits: parseInt(keySize) });
      
      setPublicKey(result.public_key);
      setPrivateKey(result.private_key);
      toast({
        description: "Keys generated successfully",
      });
    } catch (error) {
      console.error('Key generation failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate keys');
      toast({
        variant: "destructive",
        description: "Failed to generate keys. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        description: `${label} copied to clipboard`,
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        variant: "destructive",
        description: "Failed to copy to clipboard",
      });
    }
  };

  const clearKeys = () => {
    setPublicKey('');
    setPrivateKey('');
    setError(null);
  };

  return (
    <div className="relative min-h-screen">
      <div className="container mx-auto py-2 ">
        <Card className="max-w-full mx-auto shadow-none border-none">
          <CardHeader className='items-center mx-4 my-4 bg-slate-200 rounded-lg'>
            <CardTitle>RSA GENERATOR</CardTitle>
            <CardDescription>Generator Private Key dan Public Key</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Select 
                value={keySize} 
                onValueChange={(value) => {
                  setKeySize(value);
                  clearKeys();
                }}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Key Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1024">1024 bits</SelectItem>
                  <SelectItem value="2048">2048 bits</SelectItem>
                  <SelectItem value="4096">4096 bits</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                onClick={handleGenerate}
                disabled={isLoading}
                className="min-w-32 bg-slate-600"
              >
                {isLoading ? 'Generating...' : 'Generate Keys'}
              </Button>

              {(publicKey || privateKey) && (
                <Button 
                  variant="outline" 
                  onClick={clearKeys}
                  className="ml-2"
                >
                  Clear
                </Button>
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <KeyDisplay 
                title="Public Key"
                value={publicKey}
                onCopy={() => copyToClipboard(publicKey, 'Public key')}
              />
              <KeyDisplay 
                title="Private Key"
                value={privateKey}
                onCopy={() => copyToClipboard(privateKey, 'Private key')}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="absolute bottom-0 w-full text-center pb-4 text-xs text-gray-400">
        &copy; 2024 RSA Generator by Bank Sultra
      </div>

      {isLoading && <LoadingOverlay keySize={keySize} />}

    </div>
  );
};

export default KeyGenerator;
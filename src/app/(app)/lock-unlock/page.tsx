"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Lock, Unlock, KeyRound, Repeat } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { xorEncrypt, xorDecrypt } from '@/lib/locker';

export default function LockUnlockPage() {
  const [inputText, setInputText] = useState('');
  const [key, setKey] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const { toast } = useToast();

  const handleLock = () => {
    if (!inputText) {
      toast({ title: "Input Missing", description: "Please enter text to lock.", variant: "destructive" });
      return;
    }
    if (!key) {
      toast({ title: "Key Missing", description: "Please enter a key for locking.", variant: "destructive" });
      return;
    }
    setOutputText(xorEncrypt(inputText, key));
    setIsLocked(true);
    toast({ title: "Text Locked", description: "Your text has been successfully locked." });
  };

  const handleUnlock = () => {
    if (!inputText) {
      toast({ title: "Input Missing", description: "Please enter text to unlock.", variant: "destructive" });
      return;
    }
    if (!key) {
      toast({ title: "Key Missing", description: "Please enter the key for unlocking.", variant: "destructive" });
      return;
    }
    setOutputText(xorDecrypt(inputText, key));
    setIsLocked(false);
    toast({ title: "Text Unlocked", description: "Your text has been successfully unlocked." });
  };
  
  const handleSwap = () => {
    if (outputText) {
      setInputText(outputText);
      setOutputText(''); // Clear output as it's now input
      setIsLocked(!isLocked); // Toggle lock state if swapping processed text back
      toast({ title: "Text Swapped", description: "Output text moved to input." });
    } else {
      toast({ title: "Nothing to Swap", description: "Output is empty.", variant: "destructive" });
    }
  };

  const handleClear = () => {
    setInputText('');
    setKey('');
    setOutputText('');
    setIsLocked(false);
    toast({ title: "Fields Cleared", description: "All input fields have been cleared." });
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-primary">Lock/Unlock Text</CardTitle>
          <CardDescription className="text-lg">
            Secure your text snippets using a simple XOR-based reversible encoding.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="inputText" className="text-base">Input Text</Label>
            <Textarea
              id="inputText"
              placeholder="Enter text to lock or unlock..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="key" className="text-base">Encryption Key <KeyRound className="inline h-4 w-4 ml-1" /></Label>
            <Input
              id="key"
              type="password"
              placeholder="Enter your secret key..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
             <p className="text-xs text-muted-foreground">
              The same key is used for both locking and unlocking. Keep it secret!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleLock} className="flex-1 bg-destructive hover:bg-destructive/90">
              <Lock className="mr-2 h-4 w-4" /> Lock Text
            </Button>
            <Button onClick={handleUnlock} className="flex-1">
              <Unlock className="mr-2 h-4 w-4" /> Unlock Text
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleSwap} variant="outline" className="flex-1">
              <Repeat className="mr-2 h-4 w-4" /> Swap Input/Output
            </Button>
            <Button onClick={handleClear} variant="ghost" className="flex-1">
              Clear All
            </Button>
          </div>

          {outputText && (
            <div className="grid gap-2 pt-4 border-t">
              <Label htmlFor="outputText" className="text-base">{isLocked ? "Locked Text" : "Unlocked Text"}</Label>
              <Textarea
                id="outputText"
                value={outputText}
                readOnly
                rows={6}
                className="bg-muted/50 resize-none"
                placeholder="Processed text will appear here..."
              />
              <Button 
                onClick={() => {
                  navigator.clipboard.writeText(outputText);
                  toast({title: "Copied!", description: "Output text copied to clipboard."})
                }} 
                variant="outline" 
                size="sm" 
                className="mt-2 self-start"
              >
                Copy Output
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

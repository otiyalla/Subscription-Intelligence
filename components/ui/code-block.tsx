"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CodeBlockProps = {
  title: string;
  code: string;
};

export function CodeBlock({ title, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success(`${title} copied`, {
        description: "The snippet is now on your clipboard.",
      });
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Clipboard unavailable", {
        description: "Copy the snippet manually from the code panel.",
      });
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle className="text-base">{title}</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          aria-label={`Copy ${title}`}
          onClick={copy}
        >
          {copied ? <Check className="mr-2 size-4" /> : <Copy className="mr-2 size-4" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </CardHeader>
      <CardContent>
        <pre className="overflow-x-auto rounded-2xl bg-[#06101d] p-4 font-mono text-xs leading-6 text-[#d4e3ff] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <code>{code}</code>
        </pre>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mentorApi } from "@/lib/api/mentor";
import { Loader2, MessageSquare, Code, Lightbulb, AlertCircle } from "lucide-react";

export default function MentorPage() {
  const [question, setQuestion] = useState("");
  const [code, setCode] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await mentorApi.explain(question);
      setResponse(result);
    } catch (err: any) {
      console.error("Mentor error:", err);
      setError(err.response?.data?.message || "Failed to get response. AI service may be unavailable.");
    } finally {
      setLoading(false);
    }
  };

  const handleAudit = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await mentorApi.auditCode(code);
      setResponse(result);
    } catch (err: any) {
      console.error("Audit error:", err);
      setError(err.response?.data?.message || "Failed to audit code. AI service may be unavailable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Mentor</h1>
        <p className="text-muted-foreground">
          Get personalized blockchain learning assistance
        </p>
      </div>

      {/* Service Status Notice */}
      <Card className="border-yellow-500/50 bg-yellow-500/10">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-700 dark:text-yellow-400">AI Service Configuration Required</p>
              <p className="text-sm text-muted-foreground mt-1">
                The AI mentor requires a GEMINI_API_KEY to be set in the Railway environment. 
                Contact the admin to enable AI features.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="ask" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ask" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Ask Mentor
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Code Audit
          </TabsTrigger>
          <TabsTrigger value="suggest" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Get Suggestions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ask" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ask a Question</CardTitle>
              <CardDescription>
                Get personalized explanations about blockchain concepts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="What is a smart contract and how does it work?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={4}
              />
              <Button onClick={handleAsk} disabled={loading || !question.trim()}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Thinking...
                  </>
                ) : (
                  "Ask Mentor"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Code Audit</CardTitle>
              <CardDescription>
                Get security analysis and suggestions for your smart contracts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="// Paste your Solidity code here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={10}
                className="font-mono text-sm"
              />
              <Button onClick={handleAudit} disabled={loading || !code.trim()}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Audit Code"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggest" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Suggestions</CardTitle>
              <CardDescription>
                Get personalized recommendations based on your progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Connect your wallet to get personalized learning suggestions based on your course progress.
              </p>
              <Button className="mt-4" variant="outline" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Response Display */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-4">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {response && !error && (
        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              {typeof response === "string" ? (
                <p>{response}</p>
              ) : response.data ? (
                <div className="space-y-4">
                  {response.data.explanation && (
                    <div>
                      <h4 className="font-semibold">Explanation</h4>
                      <p className="whitespace-pre-wrap">{response.data.explanation}</p>
                    </div>
                  )}
                  {response.data.analogy && (
                    <div>
                      <h4 className="font-semibold">Analogy</h4>
                      <p>{response.data.analogy}</p>
                    </div>
                  )}
                  {response.data.code_example && (
                    <div>
                      <h4 className="font-semibold">Code Example</h4>
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                        <code>{response.data.code_example}</code>
                      </pre>
                    </div>
                  )}
                  {response.data.next_topics && (
                    <div>
                      <h4 className="font-semibold">Next Topics to Explore</h4>
                      <ul className="list-disc list-inside">
                        {response.data.next_topics.map((topic: string, i: number) => (
                          <li key={i}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <pre className="text-sm overflow-x-auto">
                  {JSON.stringify(response, null, 2)}
                </pre>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

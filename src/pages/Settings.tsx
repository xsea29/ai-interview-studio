import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Palette, Clock, Key, Save, Upload } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

const Settings = () => {
  const [companyName, setCompanyName] = useState("Acme Corp");
  const [defaultQuestions, setDefaultQuestions] = useState([8]);
  const [defaultDuration, setDefaultDuration] = useState([3]);
  const [adaptiveDifficulty, setAdaptiveDifficulty] = useState(true);
  const [followUpQuestions, setFollowUpQuestions] = useState(true);
  const [defaultInterviewType, setDefaultInterviewType] = useState("video");

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-0.5">
              Configure your AI Interview defaults
            </p>
          </div>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <div className="space-y-6">
          {/* Company Branding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Company Branding</CardTitle>
                    <CardDescription>Customize how your company appears to candidates</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Company Logo</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Brand Color</Label>
                  <div className="flex items-center gap-4">
                    <Palette className="h-5 w-5 text-muted-foreground" />
                    <Input
                      id="primary-color"
                      type="color"
                      defaultValue="#0ea5e9"
                      className="w-20 h-10 p-1 cursor-pointer"
                    />
                    <span className="text-sm text-muted-foreground">Used in candidate interview UI</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Default Interview Rules */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Default Interview Rules</CardTitle>
                    <CardDescription>Set defaults for new AI interviews</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Default Interview Type</Label>
                  <Select value={defaultInterviewType} onValueChange={setDefaultInterviewType}>
                    <SelectTrigger className="w-full sm:w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">AI Text Interview</SelectItem>
                      <SelectItem value="audio">AI Audio Interview</SelectItem>
                      <SelectItem value="video">AI Video Interview</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Default Number of Questions</Label>
                    <span className="font-medium">{defaultQuestions[0]}</span>
                  </div>
                  <Slider
                    value={defaultQuestions}
                    onValueChange={setDefaultQuestions}
                    min={3}
                    max={15}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>3 questions</span>
                    <span>15 questions</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Default Time per Question</Label>
                    <span className="font-medium">{defaultDuration[0]} min</span>
                  </div>
                  <Slider
                    value={defaultDuration}
                    onValueChange={setDefaultDuration}
                    min={1}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 min</span>
                    <span>5 min</span>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Adaptive Difficulty</Label>
                      <p className="text-sm text-muted-foreground">AI adjusts question difficulty based on responses</p>
                    </div>
                    <Switch
                      checked={adaptiveDifficulty}
                      onCheckedChange={setAdaptiveDifficulty}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>AI Follow-up Questions</Label>
                      <p className="text-sm text-muted-foreground">Allow AI to ask clarifying questions</p>
                    </div>
                    <Switch
                      checked={followUpQuestions}
                      onCheckedChange={setFollowUpQuestions}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* API Keys */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Key className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">API Keys</CardTitle>
                    <CardDescription>Manage your API access credentials</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">Production API Key</span>
                    <Button variant="ghost" size="sm">Reveal</Button>
                  </div>
                  <code className="text-sm font-mono text-muted-foreground">
                    sk_live_••••••••••••••••••••••••
                  </code>
                </div>
                <div className="p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">Test API Key</span>
                    <Button variant="ghost" size="sm">Reveal</Button>
                  </div>
                  <code className="text-sm font-mono text-muted-foreground">
                    sk_test_••••••••••••••••••••••••
                  </code>
                </div>
                <Button variant="outline">Generate New API Key</Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Usage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Usage & Limits</CardTitle>
                <CardDescription>Your current plan usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">AI Interviews this month</span>
                    <span className="font-medium">247 / 500</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "49.4%" }} />
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Pro Plan</span>
                    <span>Resets in 12 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Settings;

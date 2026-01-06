import { motion } from "framer-motion";
import { FileSpreadsheet, Link2, Webhook, Code, Download, Upload, CheckCircle, Copy, ExternalLink } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const sampleCSV = `name,email,phone,job_title
John Smith,john@example.com,+1234567890,Software Engineer
Jane Doe,jane@example.com,+0987654321,Product Manager
Bob Wilson,bob@example.com,,UX Designer`;

const sampleWebhook = {
  event: "interview.completed",
  data: {
    candidate_id: "cand_123",
    candidate_name: "John Smith",
    interview_id: "int_456",
    score: 87,
    recommendation: "Strong Hire",
    completed_at: "2024-01-15T14:30:00Z"
  }
};

const Integrations = () => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Integrations & Export</h1>
          <p className="text-muted-foreground mt-0.5">
            Connect with any ATS or export data in your preferred format
          </p>
        </div>

        {/* Hero Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Link2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Works with any ATS</h2>
                  <p className="text-muted-foreground">Import candidates from anywhere. No complex integrations required.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="text-sm">Greenhouse</Badge>
                <Badge variant="secondary" className="text-sm">Lever</Badge>
                <Badge variant="secondary" className="text-sm">Ashby</Badge>
                <Badge variant="secondary" className="text-sm">Workable</Badge>
                <Badge variant="secondary" className="text-sm">Custom ATS</Badge>
                <Badge variant="secondary" className="text-sm">Spreadsheets</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* CSV Import */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <FileSpreadsheet className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">CSV / Excel Import</CardTitle>
                    <CardDescription>Upload candidate data from any source</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Automatic column detection
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Email validation
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Duplicate detection
                </div>
                
                <div className="pt-4">
                  <div className="text-sm font-medium mb-2">Sample CSV Format</div>
                  <div className="relative">
                    <pre className="p-3 rounded-lg bg-muted text-xs overflow-x-auto font-mono">
                      {sampleCSV}
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(sampleCSV, "Sample CSV")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Sample Template
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* API Access */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Code className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">REST API</CardTitle>
                    <CardDescription>Programmatic access to all features</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Create interviews programmatically
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Fetch evaluation reports
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Manage candidates
                </div>

                <div className="pt-4">
                  <div className="text-sm font-medium mb-2">API Endpoint</div>
                  <div className="p-3 rounded-lg bg-muted text-sm font-mono">
                    https://api.interviewai.com/v1
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View API Documentation
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Webhooks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Webhook className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Webhooks</CardTitle>
                    <CardDescription>Real-time event notifications</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Receive instant notifications when:
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Interview completed
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Candidate started interview
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Interview link expired
                  </li>
                </ul>

                <div className="pt-2">
                  <div className="text-sm font-medium mb-2">Sample Webhook Payload</div>
                  <div className="relative">
                    <pre className="p-3 rounded-lg bg-muted text-xs overflow-x-auto font-mono">
                      {JSON.stringify(sampleWebhook, null, 2)}
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(JSON.stringify(sampleWebhook, null, 2), "Webhook payload")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Export Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Upload className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Export Options</CardTitle>
                    <CardDescription>Download data in multiple formats</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium text-sm">CSV Export</div>
                        <div className="text-xs text-muted-foreground">All candidate data and scores</div>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Code className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium text-sm">JSON Export</div>
                        <div className="text-xs text-muted-foreground">Full evaluation reports</div>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="h-5 w-5 text-red-600" />
                      <div>
                        <div className="font-medium text-sm">PDF Reports</div>
                        <div className="text-xs text-muted-foreground">Individual candidate reports</div>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
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

export default Integrations;

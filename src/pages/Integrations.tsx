import { motion } from "framer-motion";
import { FileSpreadsheet, Link2, Webhook, Code, Download, Upload, CheckCircle, Copy, ExternalLink, Clock, Database, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const sampleCSV = `name,email,phone,job_title,ats_id
John Smith,john@example.com,+1234567890,Software Engineer,ATS-001
Jane Doe,jane@example.com,+0987654321,Product Manager,ATS-002
Bob Wilson,bob@example.com,,UX Designer,ATS-003`;

const sampleWebhook = {
  event: "interview.completed",
  data: {
    candidate_id: "cand_123",
    candidate_name: "John Smith",
    external_reference_id: "ATS-001",
    source: "csv_import",
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
      
      <main className="container py-6 md:py-8 max-w-5xl px-4">
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Integrations & Export</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-0.5">
            Connect with any ATS or export data in your preferred format
          </p>
        </div>

        {/* Hero Message - ATS Neutral */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="mb-6 md:mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-5 md:p-8">
              <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Link2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-semibold">We're not replacing your ATS</h2>
                  <p className="text-sm md:text-base text-muted-foreground mt-1">
                    Import candidates from anywhere, run AI interviews, and export results back to your existing tools. Zero migration, zero lock-in.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 md:gap-3">
                <Badge variant="secondary" className="text-xs md:text-sm">Greenhouse</Badge>
                <Badge variant="secondary" className="text-xs md:text-sm">Lever</Badge>
                <Badge variant="secondary" className="text-xs md:text-sm">Ashby</Badge>
                <Badge variant="secondary" className="text-xs md:text-sm">Workable</Badge>
                <Badge variant="secondary" className="text-xs md:text-sm">BambooHR</Badge>
                <Badge variant="secondary" className="text-xs md:text-sm">Excel / Sheets</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Start CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6 md:mb-8"
        >
          <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
            <CardContent className="p-5 md:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg ai-gradient flex items-center justify-center">
                    <Upload className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Ready to run AI interviews?</h3>
                    <p className="text-sm text-muted-foreground">Upload your candidates and let AI handle the screening</p>
                  </div>
                </div>
                <Link to="/create">
                  <Button className="ai-gradient gap-2 w-full sm:w-auto">
                    Import Candidates
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* CSV Import */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full">
              <CardHeader className="pb-3 md:pb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <FileSpreadsheet className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <CardTitle className="text-base md:text-lg">CSV / Excel Import</CardTitle>
                    <CardDescription className="text-xs md:text-sm">Upload from any source or ATS export</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-success shrink-0" />
                  Automatic column detection
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-success shrink-0" />
                  Preserves External Reference IDs
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-success shrink-0" />
                  Duplicate detection & validation
                </div>
                
                <div className="pt-3 md:pt-4">
                  <div className="text-xs md:text-sm font-medium mb-2">Required CSV Columns</div>
                  <div className="relative">
                    <pre className="p-3 rounded-lg bg-muted text-[10px] md:text-xs overflow-x-auto font-mono">
                      {sampleCSV}
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(sampleCSV, "Sample CSV")}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <Button variant="outline" className="w-full text-sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Sample Template
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* API Access - Coming Soon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="h-full relative overflow-hidden">
              <div className="absolute top-3 right-3 z-10">
                <Badge variant="secondary" className="bg-warning/15 text-warning border-warning/30 text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  Coming Soon
                </Badge>
              </div>
              <CardHeader className="pb-3 md:pb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Code className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base md:text-lg">REST API</CardTitle>
                    <CardDescription className="text-xs md:text-sm">Direct ATS sync & automation</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4 opacity-60">
                <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                  <Database className="h-4 w-4 shrink-0" />
                  Auto-sync candidates from ATS
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                  <Database className="h-4 w-4 shrink-0" />
                  Push results back automatically
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                  <Database className="h-4 w-4 shrink-0" />
                  Trigger interviews programmatically
                </div>

                <div className="pt-3 md:pt-4">
                  <div className="text-xs md:text-sm font-medium mb-2">API Endpoint</div>
                  <div className="p-3 rounded-lg bg-muted text-xs md:text-sm font-mono">
                    https://api.interviewai.com/v1
                  </div>
                </div>

                <Button variant="outline" className="w-full text-sm" disabled>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Join Waitlist
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
              <CardHeader className="pb-3 md:pb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Webhook className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base md:text-lg">Webhooks</CardTitle>
                    <CardDescription className="text-xs md:text-sm">Real-time event notifications</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="text-xs md:text-sm text-muted-foreground">
                  Push updates to your ATS when:
                </div>
                <ul className="space-y-2 text-xs md:text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    AI interview completed
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
                  <div className="text-xs md:text-sm font-medium mb-2">Sample Webhook Payload</div>
                  <div className="relative">
                    <pre className="p-3 rounded-lg bg-muted text-[10px] md:text-xs overflow-x-auto font-mono max-h-40">
                      {JSON.stringify(sampleWebhook, null, 2)}
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(JSON.stringify(sampleWebhook, null, 2), "Webhook payload")}
                    >
                      <Copy className="h-3.5 w-3.5" />
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
              <CardHeader className="pb-3 md:pb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <Upload className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <CardTitle className="text-base md:text-lg">Export to ATS</CardTitle>
                    <CardDescription className="text-xs md:text-sm">Plug results back into your tools</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="h-5 w-5 text-success" />
                      <div>
                        <div className="font-medium text-xs md:text-sm">CSV Export</div>
                        <div className="text-[10px] md:text-xs text-muted-foreground">All scores with ATS IDs</div>
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
                        <div className="font-medium text-xs md:text-sm">JSON Export</div>
                        <div className="text-[10px] md:text-xs text-muted-foreground">Full evaluation reports</div>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="h-5 w-5 text-destructive" />
                      <div>
                        <div className="font-medium text-xs md:text-sm">PDF Reports</div>
                        <div className="text-[10px] md:text-xs text-muted-foreground">Shareable candidate reports</div>
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

        {/* ATS Identity Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start gap-3">
                <Database className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium text-sm md:text-base">Your candidate data stays yours</h4>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">
                    Every candidate preserves their External Reference ID and source origin. Export at any time with all identifiers intact for seamless ATS re-import.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Integrations;
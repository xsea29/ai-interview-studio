import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Copy, 
  Link2, 
  Clock, 
  CheckCircle, 
  Users, 
  MessageSquare,
  Send,
  RefreshCw,
  Sparkles,
  Calendar,
  ExternalLink,
  AlertCircle
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const mockReadiness = {
  interviewId: "int-2024-001",
  title: "Senior Frontend Developer",
  company: "Acme Inc",
  candidateName: "Sarah Chen",
  candidateEmail: "sarah@example.com",
  atsId: "ATS-12345",
  source: "CSV Import",
  createdAt: "Jan 15, 2024",
  expiresAt: "Feb 15, 2024",
  daysUntilExpiry: 28,
  checklist: {
    questionsGenerated: true,
    candidateInvited: true,
    linkActive: true,
  },
  questionCount: 8,
  estimatedDuration: "12-15 min",
};

const InterviewReadiness = () => {
  const { id } = useParams();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSendingReminder, setIsSendingReminder] = useState(false);

  const interviewLink = `https://interview.ai/i/${id || mockReadiness.interviewId}`;

  const copyLink = () => {
    navigator.clipboard.writeText(interviewLink);
    toast.success("Interview link copied to clipboard");
  };

  const sendReminder = async () => {
    setIsSendingReminder(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSendingReminder(false);
    toast.success("Reminder sent to candidate");
  };

  const regenerateLink = async () => {
    setIsRegenerating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRegenerating(false);
    toast.success("Interview link regenerated");
  };

  const allReady = Object.values(mockReadiness.checklist).every(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6 md:py-8">
        {/* Back button and header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div className="flex items-center gap-3 md:gap-4">
            <Link to="/interviews">
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Interview Readiness</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {mockReadiness.title} • {mockReadiness.candidateName}
              </p>
            </div>
          </div>
          {allReady && (
            <Badge className="ai-gradient text-primary-foreground self-start sm:self-auto">
              <Sparkles className="h-3 w-3 mr-1" />
              Ready for AI Screening
            </Badge>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column - Readiness Checklist */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className={`border-2 ${allReady ? "border-primary/50 bg-primary/5" : "border-amber-500/50 bg-amber-500/5"}`}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${allReady ? "ai-gradient" : "bg-amber-500"}`}>
                      {allReady ? (
                        <CheckCircle className="h-6 w-6 text-primary-foreground" />
                      ) : (
                        <AlertCircle className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">
                        {allReady ? "This interview is ready for AI screening" : "Setup in progress"}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {allReady 
                          ? "The candidate can start their interview anytime"
                          : "Complete the checklist items below to activate the interview"
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Readiness Checklist */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Readiness Checklist</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ReadinessItem
                    icon={MessageSquare}
                    title="Questions Generated"
                    description={`${mockReadiness.questionCount} AI-tailored questions ready`}
                    checked={mockReadiness.checklist.questionsGenerated}
                  />
                  <ReadinessItem
                    icon={Users}
                    title="Candidate Invited"
                    description={`Invitation sent to ${mockReadiness.candidateEmail}`}
                    checked={mockReadiness.checklist.candidateInvited}
                  />
                  <ReadinessItem
                    icon={Link2}
                    title="Interview Link Active"
                    description="Secure interview link is accessible"
                    checked={mockReadiness.checklist.linkActive}
                  />

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Link Expires: {mockReadiness.expiresAt}</div>
                        <div className="text-sm text-muted-foreground">
                          {mockReadiness.daysUntilExpiry} days remaining
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Candidate Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Candidate Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-sm text-muted-foreground mb-1">Name</div>
                      <div className="font-medium">{mockReadiness.candidateName}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-sm text-muted-foreground mb-1">Email</div>
                      <div className="font-medium">{mockReadiness.candidateEmail}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-sm text-muted-foreground mb-1">External Reference ID</div>
                      <div className="font-medium font-mono text-sm">{mockReadiness.atsId}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-sm text-muted-foreground mb-1">Source</div>
                      <div className="font-medium">{mockReadiness.source}</div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Candidate data imported from your ATS and cannot be modified here
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right column - Actions */}
          <div className="space-y-6">
            {/* Interview Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Link2 className="h-5 w-5" />
                    Interview Link
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-lg bg-muted text-sm font-mono break-all">
                    {interviewLink}
                  </div>
                  <Button onClick={copyLink} className="w-full ai-gradient">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Interview Link
                  </Button>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Expires {mockReadiness.expiresAt}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={sendReminder}
                    disabled={isSendingReminder}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSendingReminder ? "Sending..." : "Send Reminder"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={regenerateLink}
                    disabled={isRegenerating}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRegenerating ? "animate-spin" : ""}`} />
                    {isRegenerating ? "Regenerating..." : "Regenerate Link"}
                  </Button>
                  <Link to={`/interview/${id || mockReadiness.interviewId}`} className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Preview Candidate View
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Interview Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Interview Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Position</span>
                    <span className="font-medium">{mockReadiness.title}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Questions</span>
                    <span className="font-medium">{mockReadiness.questionCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Est. Duration</span>
                    <span className="font-medium">{mockReadiness.estimatedDuration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Created</span>
                    <span className="font-medium">{mockReadiness.createdAt}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

function ReadinessItem({
  icon: Icon,
  title,
  description,
  checked,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  checked: boolean;
}) {
  return (
    <div className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all ${
      checked ? "border-primary/30 bg-primary/5" : "border-border bg-card"
    }`}>
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg shrink-0 ${
        checked ? "ai-gradient" : "bg-muted"
      }`}>
        <Icon className={`h-5 w-5 ${checked ? "text-primary-foreground" : "text-muted-foreground"}`} />
      </div>
      <div className="flex-1">
        <div className="font-medium flex items-center gap-2">
          {title}
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
      </div>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
        checked ? "bg-primary" : "border-2 border-muted-foreground"
      }`}>
        {checked && <CheckCircle className="h-4 w-4 text-primary-foreground" />}
      </div>
    </div>
  );
}

export default InterviewReadiness;
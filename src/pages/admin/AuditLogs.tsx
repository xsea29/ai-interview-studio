import { useState } from "react";
import { FileText, Search, Download, Filter, Check, X, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface AuditLog {
  id: string;
  timestamp: string;
  actor: {
    type: "user" | "org" | "platform-admin" | "system";
    name: string;
    email?: string;
  };
  actionType: string;
  targetEntity: string;
  ipAddress: string;
  result: "success" | "failure";
  details?: string;
}

const mockLogs: AuditLog[] = [
  {
    id: "log-001",
    timestamp: "2024-03-15 14:32:45",
    actor: { type: "platform-admin", name: "Platform Admin", email: "admin@platform.io" },
    actionType: "organization.suspend",
    targetEntity: "MediCare Plus (org-004)",
    ipAddress: "192.168.1.100",
    result: "success",
    details: "Organization suspended due to payment failure",
  },
  {
    id: "log-002",
    timestamp: "2024-03-15 14:28:12",
    actor: { type: "user", name: "Sarah Chen", email: "sarah@techcorp.com" },
    actionType: "interview.create",
    targetEntity: "Senior Engineer Interview (int-456)",
    ipAddress: "10.0.0.55",
    result: "success",
  },
  {
    id: "log-003",
    timestamp: "2024-03-15 14:15:33",
    actor: { type: "system", name: "AI Scoring Engine" },
    actionType: "report.generate",
    targetEntity: "Candidate Report (rpt-789)",
    ipAddress: "internal",
    result: "success",
  },
  {
    id: "log-004",
    timestamp: "2024-03-15 13:58:20",
    actor: { type: "platform-admin", name: "Platform Admin", email: "admin@platform.io" },
    actionType: "feature.toggle",
    targetEntity: "AI Model v1.8",
    ipAddress: "192.168.1.100",
    result: "success",
    details: "Enabled beta feature for enterprise customers",
  },
  {
    id: "log-005",
    timestamp: "2024-03-15 13:45:10",
    actor: { type: "user", name: "Mike Johnson", email: "mike@techcorp.com" },
    actionType: "user.login",
    targetEntity: "TechCorp Inc.",
    ipAddress: "203.0.113.42",
    result: "success",
  },
  {
    id: "log-006",
    timestamp: "2024-03-15 13:30:05",
    actor: { type: "org", name: "GlobalHR Solutions" },
    actionType: "api.request",
    targetEntity: "/v1/candidates/import",
    ipAddress: "198.51.100.23",
    result: "failure",
    details: "Rate limit exceeded (429)",
  },
  {
    id: "log-007",
    timestamp: "2024-03-15 13:22:18",
    actor: { type: "platform-admin", name: "Platform Admin", email: "admin@platform.io" },
    actionType: "organization.create",
    targetEntity: "NewStartup Inc. (org-007)",
    ipAddress: "192.168.1.100",
    result: "success",
  },
  {
    id: "log-008",
    timestamp: "2024-03-15 13:10:45",
    actor: { type: "user", name: "Emily Davis", email: "emily@techcorp.com" },
    actionType: "user.password_change",
    targetEntity: "emily@techcorp.com",
    ipAddress: "10.0.0.78",
    result: "success",
  },
  {
    id: "log-009",
    timestamp: "2024-03-15 12:55:30",
    actor: { type: "system", name: "Billing Service" },
    actionType: "payment.process",
    targetEntity: "RetailMax (inv-2024-003)",
    ipAddress: "internal",
    result: "success",
    details: "Monthly subscription charged: $4,851.00",
  },
  {
    id: "log-010",
    timestamp: "2024-03-15 12:40:22",
    actor: { type: "user", name: "Unknown", email: "hacker@malicious.com" },
    actionType: "user.login",
    targetEntity: "TechCorp Inc.",
    ipAddress: "45.33.32.156",
    result: "failure",
    details: "Invalid credentials (3rd attempt)",
  },
  {
    id: "log-011",
    timestamp: "2024-03-15 12:25:15",
    actor: { type: "platform-admin", name: "Platform Admin", email: "admin@platform.io" },
    actionType: "compliance.export",
    targetEntity: "Platform Audit Logs",
    ipAddress: "192.168.1.100",
    result: "success",
    details: "Exported 30-day audit logs",
  },
  {
    id: "log-012",
    timestamp: "2024-03-15 12:10:08",
    actor: { type: "org", name: "FinanceFirst" },
    actionType: "data.delete",
    targetEntity: "Candidate Data (batch-eraser)",
    ipAddress: "198.51.100.45",
    result: "success",
    details: "GDPR erasure request processed for 5 candidates",
  },
];

const actionTypeColors: Record<string, string> = {
  "organization.suspend": "bg-destructive/15 text-destructive",
  "organization.create": "bg-success/15 text-success",
  "interview.create": "bg-primary/15 text-primary",
  "report.generate": "bg-accent text-accent-foreground",
  "feature.toggle": "bg-warning/15 text-warning",
  "user.login": "bg-muted text-muted-foreground",
  "api.request": "bg-secondary text-secondary-foreground",
  "user.password_change": "bg-muted text-muted-foreground",
  "payment.process": "bg-success/15 text-success",
  "compliance.export": "bg-primary/15 text-primary",
  "data.delete": "bg-destructive/15 text-destructive",
};

const actorTypeIcons: Record<string, { label: string; className: string }> = {
  "platform-admin": { label: "Platform", className: "bg-primary text-primary-foreground" },
  user: { label: "User", className: "bg-muted text-muted-foreground" },
  org: { label: "Org", className: "bg-accent text-accent-foreground" },
  system: { label: "System", className: "bg-secondary text-secondary-foreground" },
};

export default function AuditLogs() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState("all");

  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch =
      log.actor.name.toLowerCase().includes(search.toLowerCase()) ||
      log.actionType.toLowerCase().includes(search.toLowerCase()) ||
      log.targetEntity.toLowerCase().includes(search.toLowerCase());
    const matchesAction = actionFilter === "all" || log.actionType.startsWith(actionFilter);
    const matchesResult = resultFilter === "all" || log.result === resultFilter;
    return matchesSearch && matchesAction && matchesResult;
  });

  const handleExport = () => {
    toast.success("Audit logs exported to CSV");
  };

  const successCount = mockLogs.filter((l) => l.result === "success").length;
  const failureCount = mockLogs.filter((l) => l.result === "failure").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground mt-1">
            Track all high-risk actions across the platform
          </p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-2xl font-semibold mt-1">{mockLogs.length}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Successful</p>
                <p className="text-2xl font-semibold mt-1 text-success">{successCount}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Check className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-semibold mt-1 text-destructive">{failureCount}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="card-elevated">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by actor, action, or target..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="organization">Organization</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="report">Report</SelectItem>
                <SelectItem value="feature">Feature</SelectItem>
                <SelectItem value="api">API</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="data">Data</SelectItem>
              </SelectContent>
            </Select>
            <Select value={resultFilter} onValueChange={setResultFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Results</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failure">Failure</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="card-elevated">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[160px]">Timestamp</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead className="w-[100px]">Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id} className={log.result === "failure" ? "bg-destructive/5" : ""}>
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {log.timestamp}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${actorTypeIcons[log.actor.type].className}`}
                    >
                      {actorTypeIcons[log.actor.type].label}
                    </Badge>
                    <div>
                      <p className="font-medium text-sm">{log.actor.name}</p>
                      {log.actor.email && (
                        <p className="text-xs text-muted-foreground">{log.actor.email}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={actionTypeColors[log.actionType] || "bg-muted text-muted-foreground"}
                  >
                    {log.actionType}
                  </Badge>
                  {log.details && (
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs truncate">
                      {log.details}
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm">{log.targetEntity}</span>
                </TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                    {log.ipAddress}
                  </code>
                </TableCell>
                <TableCell>
                  {log.result === "success" ? (
                    <Badge variant="outline" className="bg-success/15 text-success border-success/30">
                      <Check className="h-3 w-3 mr-1" />
                      Success
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-destructive/15 text-destructive border-destructive/30">
                      <X className="h-3 w-3 mr-1" />
                      Failure
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredLogs.length} of {mockLogs.length} events
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

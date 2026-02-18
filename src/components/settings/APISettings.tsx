import { useState } from "react";
import { motion } from "framer-motion";
import { Key, Copy, RefreshCw, Eye, EyeOff, Webhook, Code, BarChart3, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  status: "active" | "failing";
  lastDelivery: string;
}

const mockWebhooks: WebhookEndpoint[] = [
  { id: "1", url: "https://your-app.com/webhooks/interviews", events: ["interview.completed", "interview.failed"], status: "active", lastDelivery: "2 min ago" },
  { id: "2", url: "https://zapier.com/hooks/catch/abc123", events: ["candidate.applied"], status: "failing", lastDelivery: "1 hour ago" },
];

const events = ["interview.completed", "interview.started", "interview.failed", "candidate.applied", "candidate.invited", "report.ready"];

export function APISettings() {
  const [showProd, setShowProd] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [webhooks, setWebhooks] = useState(mockWebhooks);
  const [newWebhookUrl, setNewWebhookUrl] = useState("");

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("Copied to clipboard");
  };

  const addWebhook = () => {
    if (!newWebhookUrl) return;
    setWebhooks(prev => [...prev, {
      id: Date.now().toString(),
      url: newWebhookUrl,
      events: ["interview.completed"],
      status: "active",
      lastDelivery: "Never",
    }]);
    setNewWebhookUrl("");
    toast.success("Webhook endpoint added");
  };

  const removeWebhook = (id: string) => {
    setWebhooks(prev => prev.filter(w => w.id !== id));
    toast.success("Webhook removed");
  };

  return (
    <div className="space-y-6">
      {/* API Keys */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Key className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">API Keys</CardTitle>
                <CardDescription>Use these keys to authenticate API requests</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Production API Key", key: "sk_live_7a8b9c0d1e2f3g4h5i6j7k8l9m0n", show: showProd, onToggle: () => setShowProd(v => !v) },
              { label: "Test API Key", key: "sk_test_1a2b3c4d5e6f7g8h9i0j1k2l3m4n", show: showTest, onToggle: () => setShowTest(v => !v) },
            ].map(({ label, key, show, onToggle }) => (
              <div key={label} className="p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{label}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onToggle}>
                      {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyKey(key)}>
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast.success(`${label} regenerated`)}>
                      <RefreshCw className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <code className="text-sm font-mono text-muted-foreground">
                  {show ? key : key.slice(0, 10) + "••••••••••••••••••••••••"}
                </code>
              </div>
            ))}
            <Button variant="outline" onClick={() => toast.info("Contact support to add scoped API keys")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Scoped API Key
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Webhooks */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Webhook className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Webhooks</CardTitle>
                <CardDescription>Send real-time event notifications to your endpoints</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {webhooks.map(wh => (
              <div key={wh.id} className="p-4 rounded-lg border bg-card space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <code className="text-xs break-all font-mono">{wh.url}</code>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className={wh.status === "active" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}>
                      {wh.status}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeWebhook(wh.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {wh.events.map(e => <Badge key={e} variant="secondary" className="text-xs font-mono">{e}</Badge>)}
                </div>
                <div className="text-xs text-muted-foreground">Last delivery: {wh.lastDelivery}</div>
              </div>
            ))}

            <div className="flex gap-2">
              <Input
                placeholder="https://your-app.com/webhook"
                value={newWebhookUrl}
                onChange={e => setNewWebhookUrl(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addWebhook()}
                className="flex-1"
              />
              <Button variant="outline" onClick={addWebhook}>Add Endpoint</Button>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Available events</Label>
              <div className="flex flex-wrap gap-1.5">
                {events.map(e => <code key={e} className="text-xs bg-muted px-1.5 py-0.5 rounded">{e}</code>)}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Rate Limits */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Rate Limits</CardTitle>
                <CardDescription>Current API usage against your plan limits</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "API requests per hour", used: 342, limit: 1000 },
              { label: "Webhook deliveries per day", used: 87, limit: 500 },
              { label: "Interview creates per day", used: 23, limit: 100 },
            ].map(item => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{item.label}</span>
                  <span className="font-medium tabular-nums">{item.used.toLocaleString()} / {item.limit.toLocaleString()}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.used / item.limit > 0.8 ? "bg-warning" : "bg-primary"}`}
                    style={{ width: `${(item.used / item.limit) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="mt-2" onClick={() => toast.info("Request submitted — we'll be in touch within 24h")}>
              Request Limit Increase
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

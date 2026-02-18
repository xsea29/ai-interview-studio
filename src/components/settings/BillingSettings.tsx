import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Zap, TrendingUp, Download, RefreshCw, CheckCircle, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

const plans = [
  { id: "starter", label: "Starter", price: "$49/mo", interviews: "100 interviews/mo", features: ["Basic video/audio", "Basic analytics", "Email support"], current: false },
  { id: "professional", label: "Professional", price: "$149/mo", interviews: "500 interviews/mo", features: ["Advanced analytics", "Custom reports", "ATS sync", "Webhooks", "Priority support"], current: true },
  { id: "enterprise", label: "Enterprise", price: "Custom", interviews: "Unlimited", features: ["SSO", "White-labeling", "Custom domain", "HRIS integration", "Dedicated success manager"], current: false },
];

const invoices = [
  { id: "INV-2024-012", date: "Jan 1, 2025", amount: "$149.00", status: "Paid" },
  { id: "INV-2024-011", date: "Dec 1, 2024", amount: "$149.00", status: "Paid" },
  { id: "INV-2024-010", date: "Nov 1, 2024", amount: "$149.00", status: "Paid" },
  { id: "INV-2024-009", date: "Oct 1, 2024", amount: "$99.00", status: "Paid" },
];

export function BillingSettings() {
  const [autoRecharge, setAutoRecharge] = useState(true);
  const [rechargeThreshold, setRechargeThreshold] = useState([50]);
  const [rechargeAmount, setRechargeAmount] = useState([200]);
  const [billingEmail, setBillingEmail] = useState("billing@acme.com");

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Current Plan</CardTitle>
                <CardDescription>Manage your subscription and upgrade at any time</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Usage bar */}
            <div className="p-4 rounded-lg border bg-muted/20 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">AI Interviews this month</span>
                <span className="font-semibold tabular-nums">247 / 500</span>
              </div>
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: "49.4%" }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Professional Plan · Renews Feb 1, 2025</span>
                <span>253 remaining</span>
              </div>
            </div>

            {/* Plan cards */}
            <div className="grid sm:grid-cols-3 gap-3">
              {plans.map(plan => (
                <div key={plan.id} className={`p-4 rounded-lg border relative ${plan.current ? "border-primary bg-primary/5 ring-1 ring-primary" : "bg-card hover:border-primary/40 transition-colors"}`}>
                  {plan.current && (
                    <Badge variant="secondary" className="absolute top-3 right-3 bg-primary/10 text-primary text-xs">Current</Badge>
                  )}
                  <div className="font-semibold text-base mb-0.5">{plan.label}</div>
                  <div className="text-xl font-bold mb-1">{plan.price}</div>
                  <div className="text-xs text-muted-foreground mb-3">{plan.interviews}</div>
                  <ul className="space-y-1 mb-4">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-1.5 text-xs">
                        <CheckCircle className="h-3 w-3 text-success shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                  {!plan.current && (
                    <Button size="sm" variant={plan.id === "enterprise" ? "outline" : "default"} className="w-full" onClick={() => toast.success(`Request to switch to ${plan.label} sent`)}>
                      {plan.id === "enterprise" ? "Contact Sales" : <><ArrowUpRight className="h-3.5 w-3.5 mr-1" />Upgrade</>}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment Method */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Payment Method</CardTitle>
                <CardDescription>Manage your payment details and billing contact</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Card display */}
            <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-3">
                <div className="h-10 w-14 rounded bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="font-medium text-sm">Visa ending in 4242</div>
                  <div className="text-xs text-muted-foreground">Expires 12/2027</div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info("Card update flow coming soon")}>
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />Update Card
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Billing Contact Email</Label>
              <div className="flex gap-2">
                <Input type="email" value={billingEmail} onChange={e => setBillingEmail(e.target.value)} className="flex-1" />
                <Button variant="outline" onClick={() => toast.success("Billing email updated")}>Save</Button>
              </div>
              <p className="text-xs text-muted-foreground">Invoices and billing alerts will be sent here</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Auto-recharge */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Auto-Recharge</CardTitle>
                <CardDescription>Automatically purchase credits before you run out</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <Label>Enable Auto-Recharge</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Automatically add credits when balance drops below threshold</p>
              </div>
              <Switch checked={autoRecharge} onCheckedChange={setAutoRecharge} />
            </div>

            <div className={`space-y-5 transition-opacity ${autoRecharge ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Recharge Threshold</Label>
                  <span className="font-medium text-sm tabular-nums">{rechargeThreshold[0]} credits remaining</span>
                </div>
                <Slider value={rechargeThreshold} onValueChange={setRechargeThreshold} min={10} max={200} step={10} />
                <p className="text-xs text-muted-foreground">Trigger recharge when credits drop to this level</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Recharge Amount</Label>
                  <span className="font-medium text-sm tabular-nums">{rechargeAmount[0]} credits</span>
                </div>
                <Slider value={rechargeAmount} onValueChange={setRechargeAmount} min={100} max={1000} step={100} />
                <p className="text-xs text-muted-foreground">How many credits to purchase each time</p>
              </div>
            </div>

            <Button onClick={() => toast.success("Auto-recharge settings saved")}>Save Recharge Settings</Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Billing History */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Billing History</CardTitle>
            <CardDescription>Download invoices for your records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {invoices.map(inv => (
                <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div>
                    <div className="font-medium text-sm">{inv.id}</div>
                    <div className="text-xs text-muted-foreground">{inv.date}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm">{inv.amount}</span>
                    <Badge variant="secondary" className="bg-success/10 text-success text-xs">{inv.status}</Badge>
                    <Button variant="ghost" size="sm" className="h-8" onClick={() => toast.success(`Downloading ${inv.id}`)}>
                      <Download className="h-3.5 w-3.5 mr-1.5" />PDF
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

import { useState } from "react";
import { CreditCard, Plus, Edit, Archive, Check, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Plan {
  id: string;
  name: string;
  creditsPerMonth: number;
  pricePerUser: number;
  features: string[];
  isActive: boolean;
  orgsCount: number;
}

const initialPlans: Plan[] = [
  {
    id: "trial",
    name: "Trial",
    creditsPerMonth: 50,
    pricePerUser: 0,
    features: ["Text Interviews", "Basic Analytics", "Email Support"],
    isActive: true,
    orgsCount: 23,
  },
  {
    id: "business",
    name: "Business",
    creditsPerMonth: 500,
    pricePerUser: 49,
    features: [
      "Text Interviews",
      "Audio Interviews",
      "Advanced Analytics",
      "Webhooks",
      "ATS Integration",
      "Priority Support",
    ],
    isActive: true,
    orgsCount: 45,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    creditsPerMonth: 2000,
    pricePerUser: 99,
    features: [
      "All Interview Types",
      "Video Interviews",
      "Fairness Scoring",
      "White-Label Branding",
      "SSO/SAML",
      "Custom AI Models",
      "Dedicated Support",
      "SLA Guarantee",
    ],
    isActive: true,
    orgsCount: 12,
  },
  {
    id: "legacy",
    name: "Legacy Pro",
    creditsPerMonth: 300,
    pricePerUser: 39,
    features: ["Text Interviews", "Audio Interviews", "Basic Analytics"],
    isActive: false,
    orgsCount: 8,
  },
];

const allFeatures = [
  "Text Interviews",
  "Audio Interviews",
  "Video Interviews",
  "Basic Analytics",
  "Advanced Analytics",
  "Fairness Scoring",
  "Webhooks",
  "ATS Integration",
  "White-Label Branding",
  "SSO/SAML",
  "Custom AI Models",
  "Email Support",
  "Priority Support",
  "Dedicated Support",
  "SLA Guarantee",
];

export default function BillingPlans() {
  const [plans, setPlans] = useState(initialPlans);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [newPlan, setNewPlan] = useState({
    name: "",
    creditsPerMonth: 100,
    pricePerUser: 29,
    features: [] as string[],
  });

  const handleCreatePlan = () => {
    const plan: Plan = {
      id: newPlan.name.toLowerCase().replace(/\s+/g, "-"),
      ...newPlan,
      isActive: true,
      orgsCount: 0,
    };
    setPlans((prev) => [...prev, plan]);
    toast.success("Plan created successfully");
    setIsCreateOpen(false);
    setNewPlan({ name: "", creditsPerMonth: 100, pricePerUser: 29, features: [] });
  };

  const handleArchivePlan = (planId: string) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, isActive: false } : p))
    );
    toast.success("Plan archived");
  };

  const handleRestorePlan = (planId: string) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, isActive: true } : p))
    );
    toast.success("Plan restored");
  };

  const toggleFeature = (feature: string) => {
    setNewPlan((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Billing & Plans</h1>
          <p className="text-muted-foreground mt-1">
            Configure pricing plans for organizations
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="ai-gradient text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Create Plan
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Plans</p>
                <p className="text-2xl font-semibold mt-1">
                  {plans.filter((p) => p.isActive).length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Organizations</p>
                <p className="text-2xl font-semibold mt-1">
                  {plans.reduce((acc, p) => acc + p.orgsCount, 0)}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Archived Plans</p>
                <p className="text-2xl font-semibold mt-1 text-muted-foreground">
                  {plans.filter((p) => !p.isActive).length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <Archive className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plans Table */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>All Plans</CardTitle>
          <CardDescription>Manage subscription plans and their features</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Credits/Month</TableHead>
                <TableHead>Price/User</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Organizations</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id} className={!plan.isActive ? "opacity-50" : ""}>
                  <TableCell>
                    <span className="font-medium">{plan.name}</span>
                  </TableCell>
                  <TableCell>{plan.creditsPerMonth.toLocaleString()}</TableCell>
                  <TableCell>
                    {plan.pricePerUser === 0 ? (
                      <span className="text-success">Free</span>
                    ) : (
                      <span>${plan.pricePerUser}/mo</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {plan.features.slice(0, 3).map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {plan.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{plan.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{plan.orgsCount}</TableCell>
                  <TableCell>
                    {plan.isActive ? (
                      <Badge variant="outline" className="bg-success/15 text-success border-success/30">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Archived</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditingPlan(plan)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {plan.isActive ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleArchivePlan(plan.id)}
                          disabled={plan.orgsCount > 0}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => handleRestorePlan(plan.id)}>
                          Restore
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Plan Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans
          .filter((p) => p.isActive)
          .map((plan, index) => (
            <Card
              key={plan.id}
              className={`card-elevated relative ${
                index === 2 ? "border-primary ai-glow-sm" : ""
              }`}
            >
              {index === 2 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="ai-gradient text-primary-foreground">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    {plan.pricePerUser === 0 ? "Free" : `$${plan.pricePerUser}`}
                  </span>
                  {plan.pricePerUser > 0 && (
                    <span className="text-muted-foreground">/user/mo</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {plan.creditsPerMonth.toLocaleString()} credits/month
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Create Plan Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Plan</DialogTitle>
            <DialogDescription>
              Define a new subscription plan for organizations
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Plan Name</Label>
                <Input
                  value={newPlan.name}
                  onChange={(e) => setNewPlan((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Pro Plan"
                />
              </div>
              <div className="space-y-2">
                <Label>Price per User ($/month)</Label>
                <Input
                  type="number"
                  value={newPlan.pricePerUser}
                  onChange={(e) =>
                    setNewPlan((prev) => ({ ...prev, pricePerUser: Number(e.target.value) }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Credits per Month</Label>
              <Input
                type="number"
                value={newPlan.creditsPerMonth}
                onChange={(e) =>
                  setNewPlan((prev) => ({ ...prev, creditsPerMonth: Number(e.target.value) }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Features</Label>
              <div className="grid grid-cols-2 gap-3 p-4 rounded-lg bg-muted/50">
                {allFeatures.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Checkbox
                      checked={newPlan.features.includes(feature)}
                      onCheckedChange={() => toggleFeature(feature)}
                    />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreatePlan}
              disabled={!newPlan.name}
              className="ai-gradient text-primary-foreground"
            >
              Create Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Plan Dialog */}
      <Dialog open={!!editingPlan} onOpenChange={() => setEditingPlan(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Plan: {editingPlan?.name}</DialogTitle>
            <DialogDescription>
              Update plan details and features
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Plan editing functionality would go here. Changes affect all organizations on this plan.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPlan(null)}>
              Cancel
            </Button>
            <Button onClick={() => { toast.success("Plan updated"); setEditingPlan(null); }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

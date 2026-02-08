import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Download,
  Pause,
  Play,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  useOrganization,
  useOrgBilling,
  useUpdateOrganization,
  useDeleteOrganization,
} from "@/hooks/useOrganizations";
import { planConfigs, type PlanType } from "@/lib/planFeatureConfig";
import { OrgDetailOverview } from "@/components/admin/OrgDetailOverview";
import { OrgDetailFeatures } from "@/components/admin/OrgDetailFeatures";
import { OrgDetailBilling } from "@/components/admin/OrgDetailBilling";
import { OrgDetailAuditLog } from "@/components/admin/OrgDetailAuditLog";
import { useNavigate } from "react-router-dom";

export default function OrganizationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: org, isLoading } = useOrganization(id);
  const { data: billing } = useOrgBilling(id);
  const updateOrg = useUpdateOrganization();
  const deleteOrg = useDeleteOrganization();
  const [activeTab, setActiveTab] = useState("overview");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Loading organization...
      </div>
    );
  }

  if (!org) {
    return (
      <div className="space-y-4 animate-fade-in">
        <Link
          to="/admin/organizations"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Organizations
        </Link>
        <div className="text-center py-20 text-muted-foreground">
          <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Organization not found</p>
          <p className="text-sm mt-1">
            This organization may have been deleted or you don't have access.
          </p>
        </div>
      </div>
    );
  }

  const handleSuspend = async () => {
    await updateOrg.mutateAsync({ id: org.id, updates: { status: "suspended" } });
    toast.success("Organization suspended");
  };

  const handleResume = async () => {
    await updateOrg.mutateAsync({ id: org.id, updates: { status: "active" } });
    toast.success("Organization resumed");
  };

  const handleDelete = async () => {
    await deleteOrg.mutateAsync(org.id);
    navigate("/admin/organizations");
  };

  const planCfg = planConfigs[org.plan as PlanType] || planConfigs.starter;

  const statusConfig: Record<string, { label: string; className: string }> = {
    active: { label: "Active", className: "bg-success/15 text-success border-success/30" },
    trial: { label: "Trial", className: "bg-warning/15 text-warning border-warning/30" },
    suspended: { label: "Suspended", className: "bg-destructive/15 text-destructive border-destructive/30" },
    cancelled: { label: "Cancelled", className: "bg-muted text-muted-foreground border-muted" },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <Link
        to="/admin/organizations"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Organizations
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold">{org.name}</h1>
              <Badge
                variant="outline"
                className={statusConfig[org.status]?.className || ""}
              >
                {statusConfig[org.status]?.label || org.status}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">{org.domain || "No domain"}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span>Created: {new Date(org.created_at).toLocaleDateString()}</span>
              <span>•</span>
              <Badge variant="secondary" className={planCfg.className}>
                {planCfg.label}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          {org.status === "suspended" ? (
            <Button variant="outline" size="sm" onClick={handleResume}>
              <Play className="h-4 w-4 mr-2" />
              Resume
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleSuspend}>
              <Pause className="h-4 w-4 mr-2" />
              Suspend
            </Button>
          )}
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OrgDetailOverview org={org} billing={billing ?? null} />
        </TabsContent>

        <TabsContent value="features" className="mt-6">
          <OrgDetailFeatures org={org} />
        </TabsContent>

        <TabsContent value="billing" className="mt-6">
          <OrgDetailBilling org={org} billing={billing ?? null} />
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <OrgDetailAuditLog org={org} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

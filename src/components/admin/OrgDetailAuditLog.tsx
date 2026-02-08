import { Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFeatureAuditLog, type Organization } from "@/hooks/useOrganizations";
import { initialFeatures } from "@/lib/featureFlagConfig";

interface OrgDetailAuditLogProps {
  org: Organization;
}

export function OrgDetailAuditLog({ org }: OrgDetailAuditLogProps) {
  const { data: auditLogs = [], isLoading } = useFeatureAuditLog(org.id);

  const getFeatureName = (id: string) => {
    return initialFeatures.find((f) => f.id === id)?.name || id;
  };

  if (isLoading) {
    return (
      <Card className="card-elevated">
        <CardContent className="py-8 text-center text-muted-foreground">
          Loading audit log...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Feature Change Audit Log
        </CardTitle>
        <CardDescription>History of all feature changes for this organization</CardDescription>
      </CardHeader>
      <CardContent>
        {auditLogs.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <Clock className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No changes yet</p>
            <p className="text-sm mt-1">Feature override changes will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {auditLogs.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-4 p-3 rounded-lg border border-border"
              >
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {getFeatureName(entry.feature_name)}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <Badge
                      variant="outline"
                      className={
                        entry.old_value
                          ? "bg-success/10 text-success border-success/20 text-xs"
                          : "bg-muted text-muted-foreground text-xs"
                      }
                    >
                      {entry.old_value ? "ON" : "OFF"}
                    </Badge>
                    <ArrowRight className="h-3 w-3" />
                    <Badge
                      variant="outline"
                      className={
                        entry.new_value
                          ? "bg-success/10 text-success border-success/20 text-xs"
                          : "bg-destructive/10 text-destructive border-destructive/20 text-xs"
                      }
                    >
                      {entry.new_value ? "ON" : "OFF"}
                    </Badge>
                    <span>•</span>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {entry.change_type.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground shrink-0">
                  {new Date(entry.created_at).toLocaleDateString()}{" "}
                  {new Date(entry.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

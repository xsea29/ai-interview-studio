import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Search,
  Plus,
  MoreHorizontal,
  Users,
  AlertTriangle,
  Trash2,
  Pause,
  Play,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  useOrganizations,
  useUpdateOrganization,
  useDeleteOrganization,
} from "@/hooks/useOrganizations";

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-success/15 text-success border-success/30" },
  trial: { label: "Trial", className: "bg-warning/15 text-warning border-warning/30" },
  suspended: { label: "Suspended", className: "bg-destructive/15 text-destructive border-destructive/30" },
  cancelled: { label: "Cancelled", className: "bg-muted text-muted-foreground border-muted" },
};

const planConfig: Record<string, { label: string; className: string }> = {
  starter: { label: "Starter", className: "bg-muted text-muted-foreground" },
  professional: { label: "Professional", className: "bg-primary/15 text-primary" },
  enterprise: { label: "Enterprise", className: "bg-accent text-accent-foreground" },
};

export default function Organizations() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const { data: organizations = [], isLoading } = useOrganizations();
  const updateOrg = useUpdateOrganization();
  const deleteOrg = useDeleteOrganization();

  const filteredOrgs = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(search.toLowerCase()) ||
      (org.domain || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || org.status === statusFilter;
    const matchesPlan = planFilter === "all" || org.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const toggleSelectAll = () => {
    if (selectedOrgs.length === filteredOrgs.length) {
      setSelectedOrgs([]);
    } else {
      setSelectedOrgs(filteredOrgs.map((org) => org.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedOrgs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSuspend = async (orgId: string) => {
    await updateOrg.mutateAsync({ id: orgId, updates: { status: "suspended" } });
    toast.success("Organization suspended");
  };

  const handleResume = async (orgId: string) => {
    await updateOrg.mutateAsync({ id: orgId, updates: { status: "active" } });
    toast.success("Organization resumed");
  };

  const handleDelete = async () => {
    if (!deleteTarget || deleteConfirm !== "DELETE") return;
    await deleteOrg.mutateAsync(deleteTarget);
    setIsDeleteOpen(false);
    setDeleteTarget(null);
    setDeleteConfirm("");
  };

  const handleBulkSuspend = async () => {
    for (const id of selectedOrgs) {
      await updateOrg.mutateAsync({ id, updates: { status: "suspended" } });
    }
    toast.success(`${selectedOrgs.length} organizations suspended`);
    setSelectedOrgs([]);
  };

  const stats = {
    total: organizations.length,
    active: organizations.filter((o) => o.status === "active").length,
    trial: organizations.filter((o) => o.status === "trial").length,
    suspended: organizations.filter((o) => o.status === "suspended").length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Organizations</h1>
          <p className="text-muted-foreground mt-1">
            Manage all tenant organizations on the platform
          </p>
        </div>
        <Button onClick={() => navigate("/admin/organizations/create")} className="ai-gradient text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Create Organization
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Organizations</p>
                <p className="text-2xl font-semibold mt-1">{stats.total}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-semibold mt-1 text-success">{stats.active}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Play className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On Trial</p>
                <p className="text-2xl font-semibold mt-1 text-warning">{stats.trial}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Suspended</p>
                <p className="text-2xl font-semibold mt-1 text-destructive">{stats.suspended}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card className="card-elevated">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or domain..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="starter">Starter</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedOrgs.length > 0 && (
            <div className="mt-4 flex items-center gap-4 p-3 rounded-lg bg-accent/50">
              <span className="text-sm font-medium">{selectedOrgs.length} selected</span>
              <Button variant="outline" size="sm" onClick={handleBulkSuspend}>
                <Pause className="h-4 w-4 mr-1" />
                Suspend Selected
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="card-elevated">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Loading organizations...</div>
        ) : filteredOrgs.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <Building2 className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No organizations found</p>
            <p className="text-sm mt-1">
              {organizations.length === 0
                ? "Create your first organization to get started."
                : "Try adjusting your search or filters."}
            </p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedOrgs.length === filteredOrgs.length && filteredOrgs.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrgs.map((org) => (
                  <TableRow key={org.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedOrgs.includes(org.id)}
                        onCheckedChange={() => toggleSelect(org.id)}
                      />
                    </TableCell>
                    <TableCell onClick={() => navigate(`/admin/organizations/${org.id}`)}>
                      <div>
                        <p className="font-medium">{org.name}</p>
                        <p className="text-sm text-muted-foreground">{org.domain || "—"}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusConfig[org.status]?.className || ""}
                      >
                        {statusConfig[org.status]?.label || org.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={planConfig[org.plan]?.className || ""}
                      >
                        {planConfig[org.plan]?.label || org.plan}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(org.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/admin/organizations/${org.id}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {org.status === "suspended" ? (
                            <DropdownMenuItem onClick={() => handleResume(org.id)}>
                              <Play className="h-4 w-4 mr-2" />
                              Resume
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleSuspend(org.id)}>
                              <Pause className="h-4 w-4 mr-2" />
                              Suspend
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setDeleteTarget(org.id);
                              setIsDeleteOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="p-4 border-t border-border flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredOrgs.length} of {organizations.length} organizations
              </p>
            </div>
          </>
        )}
      </Card>


      {/* Delete Confirmation */}

      {/* Delete Confirmation */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Organization
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the organization and all
              associated data including features, billing, and audit logs.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm font-medium">Type "DELETE" to confirm:</p>
            <Input
              className="mt-2"
              placeholder="DELETE"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteOpen(false);
                setDeleteConfirm("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteConfirm !== "DELETE" || deleteOrg.isPending}
            >
              {deleteOrg.isPending ? "Deleting..." : "Delete Organization"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

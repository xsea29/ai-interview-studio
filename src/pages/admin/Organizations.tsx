import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Building2, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Filter, 
  Users, 
  CreditCard,
  AlertTriangle,
  Trash2,
  Pause,
  Play,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const mockOrganizations = [
  {
    id: "org-001",
    name: "TechCorp Inc.",
    domain: "techcorp.com",
    status: "active",
    plan: "enterprise",
    usersCount: 45,
    interviewsThisMonth: 128,
    creditsUsed: 340,
    billingStatus: "paid",
    createdAt: "2024-01-15",
  },
  {
    id: "org-002",
    name: "StartupXYZ",
    domain: "startupxyz.io",
    status: "trial",
    plan: "trial",
    usersCount: 8,
    interviewsThisMonth: 23,
    creditsUsed: 45,
    billingStatus: "trial",
    createdAt: "2024-03-01",
  },
  {
    id: "org-003",
    name: "GlobalHR Solutions",
    domain: "globalhr.com",
    status: "active",
    plan: "business",
    usersCount: 22,
    interviewsThisMonth: 67,
    creditsUsed: 180,
    billingStatus: "paid",
    createdAt: "2023-11-20",
  },
  {
    id: "org-004",
    name: "MediCare Plus",
    domain: "medicareplus.com",
    status: "suspended",
    plan: "business",
    usersCount: 15,
    interviewsThisMonth: 0,
    creditsUsed: 0,
    billingStatus: "past-due",
    createdAt: "2023-09-10",
  },
  {
    id: "org-005",
    name: "FinanceFirst",
    domain: "financefirst.co",
    status: "expired",
    plan: "trial",
    usersCount: 5,
    interviewsThisMonth: 0,
    creditsUsed: 0,
    billingStatus: "expired",
    createdAt: "2024-02-01",
  },
  {
    id: "org-006",
    name: "RetailMax",
    domain: "retailmax.com",
    status: "active",
    plan: "enterprise",
    usersCount: 78,
    interviewsThisMonth: 245,
    creditsUsed: 620,
    billingStatus: "paid",
    createdAt: "2023-06-15",
  },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-success/15 text-success border-success/30" },
  trial: { label: "Trial", className: "bg-warning/15 text-warning border-warning/30" },
  suspended: { label: "Suspended", className: "bg-destructive/15 text-destructive border-destructive/30" },
  expired: { label: "Expired", className: "bg-muted text-muted-foreground border-muted" },
};

const planConfig: Record<string, { label: string; className: string }> = {
  trial: { label: "Trial", className: "bg-muted text-muted-foreground" },
  business: { label: "Business", className: "bg-primary/15 text-primary" },
  enterprise: { label: "Enterprise", className: "bg-accent text-accent-foreground" },
};

const billingConfig: Record<string, { label: string; className: string }> = {
  paid: { label: "Paid", className: "text-success" },
  trial: { label: "Trial", className: "text-muted-foreground" },
  "past-due": { label: "Past Due", className: "text-destructive" },
  expired: { label: "Expired", className: "text-muted-foreground" },
};

export default function Organizations() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filteredOrgs = mockOrganizations.filter((org) => {
    const matchesSearch = org.name.toLowerCase().includes(search.toLowerCase()) ||
      org.domain.toLowerCase().includes(search.toLowerCase());
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

  const handleSuspend = (orgId: string) => {
    toast.success("Organization suspended successfully");
  };

  const handleResume = (orgId: string) => {
    toast.success("Organization resumed successfully");
  };

  const handleDelete = () => {
    toast.success("Organization deleted successfully");
    setIsDeleteOpen(false);
    setDeleteTarget(null);
  };

  const handleCreateOrg = () => {
    toast.success("Organization created successfully");
    setIsCreateOpen(false);
  };

  const handleBulkSuspend = () => {
    toast.success(`${selectedOrgs.length} organizations suspended`);
    setSelectedOrgs([]);
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
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="ai-gradient text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Create Organization
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Organization</DialogTitle>
              <DialogDescription>
                Add a new tenant organization to the platform.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input id="orgName" placeholder="Acme Corp" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <Input id="domain" placeholder="acme.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan">Plan</Label>
                <Select defaultValue="trial">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input id="adminEmail" type="email" placeholder="admin@acme.com" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateOrg} className="ai-gradient text-primary-foreground">
                Create Organization
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Organizations</p>
                <p className="text-2xl font-semibold mt-1">{mockOrganizations.length}</p>
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
                <p className="text-2xl font-semibold mt-1 text-success">
                  {mockOrganizations.filter((o) => o.status === "active").length}
                </p>
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
                <p className="text-2xl font-semibold mt-1 text-warning">
                  {mockOrganizations.filter((o) => o.status === "trial").length}
                </p>
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
                <p className="text-sm text-muted-foreground">Past Due</p>
                <p className="text-2xl font-semibold mt-1 text-destructive">
                  {mockOrganizations.filter((o) => o.billingStatus === "past-due").length}
                </p>
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
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedOrgs.length > 0 && (
            <div className="mt-4 flex items-center gap-4 p-3 rounded-lg bg-accent/50">
              <span className="text-sm font-medium">
                {selectedOrgs.length} selected
              </span>
              <Button variant="outline" size="sm" onClick={handleBulkSuspend}>
                <Pause className="h-4 w-4 mr-1" />
                Suspend Selected
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-1" />
                Delete Selected
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="card-elevated">
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
              <TableHead className="text-right">Users</TableHead>
              <TableHead className="text-right">Interviews</TableHead>
              <TableHead className="text-right">Credits</TableHead>
              <TableHead>Billing</TableHead>
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
                    <p className="text-sm text-muted-foreground">{org.domain}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusConfig[org.status].className}>
                    {statusConfig[org.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={planConfig[org.plan].className}>
                    {planConfig[org.plan].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{org.usersCount}</TableCell>
                <TableCell className="text-right">{org.interviewsThisMonth}</TableCell>
                <TableCell className="text-right">{org.creditsUsed}</TableCell>
                <TableCell>
                  <span className={billingConfig[org.billingStatus].className}>
                    {billingConfig[org.billingStatus].label}
                  </span>
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

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredOrgs.length} of {mockOrganizations.length} organizations
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

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Organization
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the organization
              and all associated data including users, interviews, and reports.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm font-medium">Type "DELETE" to confirm:</p>
            <Input className="mt-2" placeholder="DELETE" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Organization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Globe, Upload, Phone, Mail, MapPin, Briefcase, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function OrganizationSettings() {
  const [legalName, setLegalName] = useState("Acme Corporation Inc.");
  const [displayName, setDisplayName] = useState("Acme Corp");
  const [industry, setIndustry] = useState("technology");
  const [size, setSize] = useState("51-200");
  const [country, setCountry] = useState("us");
  const [timezone, setTimezone] = useState("America/New_York");
  const [supportEmail, setSupportEmail] = useState("hr@acme.com");
  const [phone, setPhone] = useState("+1 (555) 000-0000");
  const [domains] = useState(["acme.com", "acme.io"]);

  const handleSave = () => toast.success("Organization profile saved");

  return (
    <div className="space-y-6">
      {/* Company Profile */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Company Profile</CardTitle>
                <CardDescription>Update your organization's public-facing identity</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl bg-muted flex items-center justify-center border">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Company Logo</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">Remove</Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB. 200×200px recommended.</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="legal-name">Legal Name</Label>
                <Input id="legal-name" value={legalName} onChange={e => setLegalName(e.target.value)} />
                <p className="text-xs text-muted-foreground">Used on invoices and legal documents</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="display-name">Display Name</Label>
                <Input id="display-name" value={displayName} onChange={e => setDisplayName(e.target.value)} />
                <p className="text-xs text-muted-foreground">Shown to candidates</p>
              </div>
              <div className="space-y-2">
                <Label>Industry</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="finance">Finance & Banking</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="retail">Retail & E-commerce</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Company Size</Label>
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1–10 employees</SelectItem>
                    <SelectItem value="11-50">11–50 employees</SelectItem>
                    <SelectItem value="51-200">51–200 employees</SelectItem>
                    <SelectItem value="201-1000">201–1,000 employees</SelectItem>
                    <SelectItem value="1001+">1,001+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="gb">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                    <SelectItem value="fr">France</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    <SelectItem value="Europe/Berlin">Berlin (CET)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-email" className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> Support Email
                </Label>
                <Input id="support-email" type="email" value={supportEmail} onChange={e => setSupportEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> Phone Number
                </Label>
                <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
            </div>

            <Button onClick={handleSave} className="mt-2">Save Company Profile</Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Domain Management */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Domain Management</CardTitle>
                <CardDescription>Verify domains to enable SSO and branded emails</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {domains.map((domain) => (
                <div key={domain} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{domain}</span>
                    <Badge variant="secondary" className="bg-success/10 text-success text-xs">Verified</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-xs">Re-verify</Button>
                    <Button variant="ghost" size="sm" className="text-xs text-destructive">Remove</Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input placeholder="yourdomain.com" className="flex-1" />
              <Button variant="outline">Add Domain</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Verifying a domain allows your team members to sign in with company email addresses.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export interface OrgFormData {
  name: string;
  domain: string;
  industry: string;
  size: string;
  ownerEmail: string;
  dataResidency: string;
}

interface OrgDetailsFormProps {
  data: OrgFormData;
  onChange: (data: OrgFormData) => void;
  errors: Record<string, string>;
}

export function OrgDetailsForm({ data, onChange, errors }: OrgDetailsFormProps) {
  const update = (field: keyof OrgFormData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Organization Details</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Basic information about the organization
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="orgName">
            Organization Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="orgName"
            value={data.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Acme Corporation"
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name ? (
            <p className="text-xs text-destructive">{errors.name}</p>
          ) : (
            <p className="text-xs text-muted-foreground">Required identifier for the organization</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="domain">Domain</Label>
          <Input
            id="domain"
            value={data.domain}
            onChange={(e) => update("domain", e.target.value)}
            placeholder="acme.com"
            className={errors.domain ? "border-destructive" : ""}
          />
          {errors.domain ? (
            <p className="text-xs text-destructive">{errors.domain}</p>
          ) : (
            <p className="text-xs text-muted-foreground">Used for SSO and email setup</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Industry</Label>
            <Select value={data.industry} onValueChange={(v) => update("industry", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Company Size</Label>
            <Select value={data.size} onValueChange={(v) => update("size", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-50">1–50</SelectItem>
                <SelectItem value="51-200">51–200</SelectItem>
                <SelectItem value="201-500">201–500</SelectItem>
                <SelectItem value="501-1000">501–1,000</SelectItem>
                <SelectItem value="1001+">1,001+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold text-foreground">Billing & Contact</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Owner will receive the onboarding invitation
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ownerEmail">
            Owner Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="ownerEmail"
            type="email"
            value={data.ownerEmail}
            onChange={(e) => update("ownerEmail", e.target.value)}
            placeholder="admin@acme.com"
            className={errors.ownerEmail ? "border-destructive" : ""}
          />
          {errors.ownerEmail ? (
            <p className="text-xs text-destructive">{errors.ownerEmail}</p>
          ) : (
            <p className="text-xs text-muted-foreground">Invitation link will be sent to this email</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Data Residency</Label>
          <Select value={data.dataResidency} onValueChange={(v) => update("dataResidency", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">
                <span className="flex items-center gap-2">🇺🇸 United States</span>
              </SelectItem>
              <SelectItem value="EU">
                <span className="flex items-center gap-2">🇪🇺 European Union (GDPR)</span>
              </SelectItem>
              <SelectItem value="APAC">
                <span className="flex items-center gap-2">🌏 Asia Pacific</span>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Where organization data will be stored</p>
        </div>
      </div>
    </div>
  );
}

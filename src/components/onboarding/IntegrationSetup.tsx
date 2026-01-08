import { useState } from "react";
import { Database, Upload, FileSpreadsheet, ArrowRight, ArrowLeft, Check, X, AlertCircle, RefreshCw, Download, Link, Clock, Settings, Eye, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { OnboardingData } from "@/pages/CompanyOnboarding";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface IntegrationSetupProps {
  data: OnboardingData;
  updateData: <K extends keyof OnboardingData>(section: K, updates: Partial<OnboardingData[K]>) => void;
  onNext: () => void;
  onBack: () => void;
  step: number;
}

const systemFields = [
  { id: "candidate_name", label: "Candidate Name", required: true },
  { id: "candidate_email", label: "Candidate Email", required: true },
  { id: "job_title", label: "Job Title", required: true },
  { id: "job_id", label: "Job ID", required: false },
  { id: "department", label: "Department", required: false },
  { id: "recruiter_email", label: "Recruiter Email", required: false },
  { id: "experience_level", label: "Experience Level", required: false },
  { id: "location", label: "Location", required: false },
];

const atsProviders = [
  { id: "greenhouse", name: "Greenhouse", logo: "🌿" },
  { id: "lever", name: "Lever", logo: "🔧" },
  { id: "workday", name: "Workday", logo: "📊" },
  { id: "bamboohr", name: "BambooHR", logo: "🎋" },
  { id: "icims", name: "iCIMS", logo: "📋" },
  { id: "taleo", name: "Taleo", logo: "🎯" },
];

const IntegrationSetup = ({ data, updateData, onNext, onBack, step }: IntegrationSetupProps) => {
  const [csvPreview, setCsvPreview] = useState<string[][] | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState<{ imported: number; skipped: number; errors: number } | null>(null);
  const [validationErrors, setValidationErrors] = useState<Array<{ row: number; field: string; error: string }>>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const rows = text.split("\n").map((row) => row.split(",").map((cell) => cell.trim().replace(/^"|"$/g, "")));
        
        if (rows.length > 0) {
          setCsvHeaders(rows[0]);
          setCsvPreview(rows.slice(1, 6)); // Preview first 5 data rows
          
          // Auto-map common column names
          const autoMappings: Array<{ source: string; target: string }> = [];
          rows[0].forEach((header) => {
            const normalized = header.toLowerCase().replace(/[^a-z]/g, "");
            if (normalized.includes("name") && normalized.includes("candidate")) {
              autoMappings.push({ source: header, target: "candidate_name" });
            } else if (normalized.includes("email")) {
              autoMappings.push({ source: header, target: "candidate_email" });
            } else if (normalized.includes("job") && normalized.includes("title")) {
              autoMappings.push({ source: header, target: "job_title" });
            }
          });
          
          if (autoMappings.length > 0) {
            updateData("integrations", { csvMappings: autoMappings });
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleMapping = (sourceHeader: string, targetField: string) => {
    const existingMappings = data.integrations.csvMappings.filter(
      (m) => m.source !== sourceHeader
    );
    if (targetField) {
      existingMappings.push({ source: sourceHeader, target: targetField });
    }
    updateData("integrations", { csvMappings: existingMappings });
  };

  const getMappedField = (sourceHeader: string) => {
    return data.integrations.csvMappings.find((m) => m.source === sourceHeader)?.target || "";
  };

  const validateData = () => {
    const errors: Array<{ row: number; field: string; error: string }> = [];
    
    // Simulate validation
    if (csvPreview) {
      csvPreview.forEach((row, index) => {
        // Check email format
        const emailIdx = csvHeaders.findIndex((h) => getMappedField(h) === "candidate_email");
        if (emailIdx !== -1 && row[emailIdx] && !row[emailIdx].includes("@")) {
          errors.push({ row: index + 2, field: "Email", error: "Invalid email format" });
        }
      });
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleImport = () => {
    if (!validateData()) {
      toast.error("Please fix validation errors before importing");
      return;
    }

    setImporting(true);
    setImportProgress(0);
    
    const interval = setInterval(() => {
      setImportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setImporting(false);
          setImportResults({
            imported: csvPreview?.length || 0,
            skipped: 0,
            errors: validationErrors.length,
          });
          toast.success("Import completed successfully");
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  // Step 0: Import Method
  if (step === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl ai-gradient ai-glow mb-4">
            <Database className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Data Ingestion</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Choose how you'll import candidate and job data
          </p>
        </div>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-lg">Select Import Method</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={data.integrations.mode}
              onValueChange={(value) => updateData("integrations", { mode: value as "csv" | "ats" })}
              className="space-y-4"
            >
              <Label
                htmlFor="csv"
                className={cn(
                  "flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all",
                  data.integrations.mode === "csv"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <RadioGroupItem value="csv" id="csv" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Manual CSV Upload</span>
                    <Badge variant="secondary">Recommended for Phase I</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload CSV/Excel files with candidate and job data. Configure column mappings and validate before import.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Badge variant="outline">Candidates</Badge>
                    <Badge variant="outline">Job Requisitions</Badge>
                    <Badge variant="outline">Departments</Badge>
                    <Badge variant="outline">Recruiter Assignments</Badge>
                  </div>
                </div>
              </Label>

              <Label
                htmlFor="ats"
                className={cn(
                  "flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all",
                  data.integrations.mode === "ats"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <RadioGroupItem value="ats" id="ats" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Link className="w-5 h-5 text-primary" />
                    <span className="font-semibold">ATS Integration</span>
                    <Badge variant="outline">Coming in Phase II</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Connect to your ATS via API for automatic candidate sync. Configure webhooks and field mappings.
                  </p>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {atsProviders.slice(0, 4).map((p) => (
                      <Badge key={p.id} variant="secondary">
                        {p.logo} {p.name}
                      </Badge>
                    ))}
                    <Badge variant="secondary">+2 more</Badge>
                  </div>
                </div>
              </Label>
            </RadioGroup>
          </CardContent>
        </Card>

        {data.integrations.mode === "csv" && (
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Upload CSV File
              </CardTitle>
              <CardDescription>
                Upload a CSV file with candidate or job data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="upload-zone flex flex-col items-center justify-center cursor-pointer min-h-[160px]">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {csvPreview ? (
                  <div className="text-center">
                    <Check className="w-8 h-8 text-success mx-auto mb-2" />
                    <p className="font-medium">File uploaded</p>
                    <p className="text-sm text-muted-foreground">
                      {csvHeaders.length} columns, {csvPreview.length}+ rows detected
                    </p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Drag & drop or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports CSV, XLSX
                    </p>
                  </>
                )}
              </label>

              {csvPreview && (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {csvHeaders.map((header) => (
                          <TableHead key={header} className="min-w-[150px]">
                            {header}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {csvPreview.slice(0, 3).map((row, i) => (
                        <TableRow key={i}>
                          {row.map((cell, j) => (
                            <TableCell key={j} className="text-sm">
                              {cell || <span className="text-muted-foreground">—</span>}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {csvPreview.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Showing 3 of {csvPreview.length}+ rows
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {data.integrations.mode === "ats" && (
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-lg">Select ATS Provider</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-3">
                {atsProviders.map((provider) => (
                  <Label
                    key={provider.id}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all",
                      data.integrations.atsProvider === provider.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => updateData("integrations", { atsProvider: provider.id })}
                  >
                    <span className="text-2xl">{provider.logo}</span>
                    <span className="font-medium">{provider.name}</span>
                  </Label>
                ))}
              </div>
              <Alert className="mt-4">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  ATS integration requires API credentials. You'll configure these in the settings after onboarding.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button onClick={onNext} size="lg" className="gap-2" disabled={data.integrations.mode === "csv" && !csvPreview}>
            Continue to Field Mapping
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Step 1: Field Mapping
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl ai-gradient ai-glow mb-4">
          <Settings className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Field Mapping</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Map your data columns to system fields
        </p>
      </div>

      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-lg">Column Mapping</CardTitle>
          <CardDescription>
            Match your CSV columns to the required system fields
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Your Column</TableHead>
                <TableHead>Maps To</TableHead>
                <TableHead>Required</TableHead>
                <TableHead>Sample Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {csvHeaders.map((header) => (
                <TableRow key={header}>
                  <TableCell className="font-medium">{header}</TableCell>
                  <TableCell>
                    <Select
                      value={getMappedField(header)}
                      onValueChange={(value) => handleMapping(header, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">— Skip —</SelectItem>
                        {systemFields.map((field) => (
                          <SelectItem key={field.id} value={field.id}>
                            {field.label}
                            {field.required && " *"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {systemFields.find((f) => f.id === getMappedField(header))?.required && (
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {csvPreview?.[0]?.[csvHeaders.indexOf(header)] || "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {validationErrors.length > 0 && (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              Validation Errors ({validationErrors.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Row</TableHead>
                  <TableHead>Field</TableHead>
                  <TableHead>Error</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {validationErrors.map((err, i) => (
                  <TableRow key={i}>
                    <TableCell>{err.row}</TableCell>
                    <TableCell>{err.field}</TableCell>
                    <TableCell className="text-destructive">{err.error}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export Errors CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {importing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Importing data...</span>
                <span className="text-sm text-muted-foreground">{importProgress}%</span>
              </div>
              <Progress value={importProgress} />
            </div>
          </CardContent>
        </Card>
      )}

      {importResults && (
        <Card className="border-success/50 bg-success/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Check className="w-8 h-8 text-success" />
              <div>
                <h3 className="font-semibold">Import Complete</h3>
                <p className="text-sm text-muted-foreground">
                  Imported: {importResults.imported} | Skipped: {importResults.skipped} | Errors: {importResults.errors}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-lg">Save Mapping Template</CardTitle>
          <CardDescription>
            Save this mapping for future imports with the same format
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input placeholder="Template name (e.g., Greenhouse Export)" className="flex-1" />
          <Button variant="outline">Save Template</Button>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={validateData}>
            <Eye className="w-4 h-4 mr-2" />
            Validate Data
          </Button>
          <Button onClick={onNext} size="lg" className="gap-2">
            Continue to Privacy Setup
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IntegrationSetup;

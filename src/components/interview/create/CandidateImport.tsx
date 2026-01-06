import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, FileSpreadsheet, Mail, Link2, AlertCircle, Check, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CandidateData } from "@/pages/CreateInterview";

interface CandidateImportProps {
  candidates: CandidateData[];
  setCandidates: (candidates: CandidateData[]) => void;
  onNext: () => void;
}

type TabType = "csv" | "paste" | "ats";

export function CandidateImport({ candidates, setCandidates, onNext }: CandidateImportProps) {
  const [activeTab, setActiveTab] = useState<TabType>("csv");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pastedEmails, setPastedEmails] = useState("");
  const [columnMapping, setColumnMapping] = useState({
    name: "",
    email: "",
    phone: "",
    jobTitle: "",
    atsId: "",
  });
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.xlsx'))) {
      processFile(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setUploadedFile(file);
    // Simulate parsing CSV - in real app, use a library like papaparse
    const mockColumns = ["Full Name", "Email Address", "Phone Number", "Position", "ATS ID"];
    const mockData = [
      ["John Smith", "john.smith@email.com", "+1 555-0123", "Developer", "ATS-001"],
      ["Sarah Johnson", "sarah.j@email.com", "+1 555-0124", "Designer", "ATS-002"],
      ["Mike Brown", "mike.b@email.com", "+1 555-0125", "PM", "ATS-003"],
      ["Emily Davis", "emily.d@email.com", "+1 555-0126", "Developer", "ATS-004"],
      ["Chris Wilson", "invalid-email", "+1 555-0127", "Analyst", "ATS-005"],
    ];
    setAvailableColumns(mockColumns);
    setPreviewData(mockData);
    setColumnMapping({
      name: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      jobTitle: "Position",
      atsId: "ATS ID",
    });
  };

  const parseEmailsFromText = (text: string): CandidateData[] => {
    const emailRegex = /[^\s,]+@[^\s,]+\.[^\s,]+/g;
    const emails = text.match(emailRegex) || [];
    return emails.map(email => ({
      email: email.toLowerCase(),
      isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    }));
  };

  const handlePasteEmailsChange = (text: string) => {
    setPastedEmails(text);
    const parsed = parseEmailsFromText(text);
    setCandidates(parsed);
  };

  const handleApplyMapping = () => {
    if (!columnMapping.email) return;
    
    const emailColIndex = availableColumns.indexOf(columnMapping.email);
    const nameColIndex = columnMapping.name ? availableColumns.indexOf(columnMapping.name) : -1;
    const phoneColIndex = columnMapping.phone ? availableColumns.indexOf(columnMapping.phone) : -1;
    const titleColIndex = columnMapping.jobTitle ? availableColumns.indexOf(columnMapping.jobTitle) : -1;
    const atsColIndex = columnMapping.atsId ? availableColumns.indexOf(columnMapping.atsId) : -1;

    const mapped = previewData.map(row => {
      const email = row[emailColIndex] || "";
      return {
        email,
        name: nameColIndex >= 0 ? row[nameColIndex] : undefined,
        phone: phoneColIndex >= 0 ? row[phoneColIndex] : undefined,
        jobTitle: titleColIndex >= 0 ? row[titleColIndex] : undefined,
        atsId: atsColIndex >= 0 ? row[atsColIndex] : undefined,
        isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      };
    });
    setCandidates(mapped);
  };

  const validCount = candidates.filter(c => c.isValid).length;
  const invalidCount = candidates.filter(c => !c.isValid).length;

  const tabs = [
    { id: "csv" as TabType, label: "Upload CSV / Excel", icon: FileSpreadsheet, highlighted: true },
    { id: "paste" as TabType, label: "Paste Emails", icon: Mail },
    { id: "ats" as TabType, label: "ATS Integration", icon: Link2, comingSoon: true },
  ];

  return (
    <div className="max-w-4xl">
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl mb-6 inline-flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.comingSoon && setActiveTab(tab.id)}
            disabled={tab.comingSoon}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-card text-foreground shadow-sm"
                : tab.comingSoon
                ? "text-muted-foreground/50 cursor-not-allowed"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {tab.comingSoon && (
              <span className="text-[10px] uppercase tracking-wider bg-muted-foreground/20 px-1.5 py-0.5 rounded">
                Soon
              </span>
            )}
            {tab.highlighted && activeTab === tab.id && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full tab-indicator" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rounded-xl bg-card border border-border card-elevated">
        {activeTab === "csv" && (
          <div className="p-6">
            {!uploadedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`upload-zone text-center ${isDragging ? "upload-zone-active" : ""}`}
              >
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-4">
                      <Upload className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">
                      Drag & drop your file here
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports .csv and .xlsx files
                    </p>
                  </div>
                </label>
              </div>
            ) : (
              <div className="space-y-6">
                {/* File info */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">{uploadedFile.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {previewData.length} rows detected
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setUploadedFile(null);
                      setPreviewData([]);
                      setAvailableColumns([]);
                      setCandidates([]);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Column mapping */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Map your columns</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <MappingSelect
                      label="Candidate Name"
                      value={columnMapping.name}
                      options={availableColumns}
                      onChange={(v) => setColumnMapping({ ...columnMapping, name: v })}
                    />
                    <MappingSelect
                      label="Email (required)"
                      value={columnMapping.email}
                      options={availableColumns}
                      onChange={(v) => setColumnMapping({ ...columnMapping, email: v })}
                      required
                    />
                    <MappingSelect
                      label="Phone (optional)"
                      value={columnMapping.phone}
                      options={availableColumns}
                      onChange={(v) => setColumnMapping({ ...columnMapping, phone: v })}
                    />
                    <MappingSelect
                      label="Job Title (optional)"
                      value={columnMapping.jobTitle}
                      options={availableColumns}
                      onChange={(v) => setColumnMapping({ ...columnMapping, jobTitle: v })}
                    />
                    <MappingSelect
                      label="ATS ID (optional)"
                      value={columnMapping.atsId}
                      options={availableColumns}
                      onChange={(v) => setColumnMapping({ ...columnMapping, atsId: v })}
                    />
                  </div>
                  <Button
                    onClick={handleApplyMapping}
                    className="mt-4"
                    disabled={!columnMapping.email}
                  >
                    Apply Mapping
                  </Button>
                </div>

                {/* Preview */}
                {previewData.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-3">Preview (first 5 rows)</h4>
                    <div className="overflow-x-auto rounded-lg border border-border">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left font-medium px-4 py-2.5 w-8"></th>
                            {availableColumns.map((col) => (
                              <th key={col} className="text-left font-medium px-4 py-2.5">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {previewData.slice(0, 5).map((row, rowIndex) => {
                            const emailColIndex = availableColumns.indexOf(columnMapping.email);
                            const email = row[emailColIndex] || "";
                            const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
                            
                            return (
                              <tr 
                                key={rowIndex} 
                                className={!isValid && columnMapping.email ? "bg-destructive/5" : ""}
                              >
                                <td className="px-4 py-2.5">
                                  {columnMapping.email && (
                                    isValid ? (
                                      <Check className="h-4 w-4 text-success" />
                                    ) : (
                                      <AlertCircle className="h-4 w-4 text-destructive" />
                                    )
                                  )}
                                </td>
                                {row.map((cell, cellIndex) => (
                                  <td 
                                    key={cellIndex} 
                                    className={`px-4 py-2.5 ${
                                      cellIndex === emailColIndex && !isValid ? "text-destructive" : ""
                                    }`}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            <p className="text-sm text-muted-foreground mt-4">
              Export candidates from your ATS and upload the file here.
            </p>
          </div>
        )}

        {activeTab === "paste" && (
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Paste candidate emails
                </label>
                <Textarea
                  value={pastedEmails}
                  onChange={(e) => handlePasteEmailsChange(e.target.value)}
                  placeholder="john@example.com&#10;sarah@example.com&#10;mike@example.com"
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>
              
              {candidates.length > 0 && (
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5 text-success">
                    <Check className="h-4 w-4" />
                    {validCount} valid emails
                  </span>
                  {invalidCount > 0 && (
                    <span className="flex items-center gap-1.5 text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      {invalidCount} invalid
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "ats" && (
          <div className="p-6">
            <div className="text-center py-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted mx-auto mb-4">
                <Link2 className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                Connect your ATS
              </h3>
              <p className="text-muted-foreground text-sm mb-4 max-w-md mx-auto">
                Connect Greenhouse, Lever, Ashby, and other ATS platforms to automatically sync candidates.
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs bg-muted px-3 py-1.5 rounded-full text-muted-foreground">
                Coming soon — CSV works with all ATS
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Summary and continue */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {candidates.length > 0 && (
            <span>
              <strong className="text-foreground">{validCount}</strong> candidates ready to import
              {invalidCount > 0 && (
                <span className="text-destructive ml-2">
                  ({invalidCount} will be skipped)
                </span>
              )}
            </span>
          )}
        </div>
        <Button
          onClick={onNext}
          disabled={validCount === 0}
          className="ai-gradient"
        >
          Continue to Job Setup
        </Button>
      </div>
    </div>
  );
}

function MappingSelect({
  label,
  value,
  options,
  onChange,
  required,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs text-muted-foreground mb-1.5 block">
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={required && !value ? "border-destructive" : ""}>
          <SelectValue placeholder="Select column" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

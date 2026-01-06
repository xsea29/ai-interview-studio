import { useState } from "react";
import { Save, FolderOpen, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface ColumnMapping {
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  atsId: string;
}

interface MappingTemplate {
  id: string;
  name: string;
  mapping: ColumnMapping;
  createdAt: string;
}

interface MappingTemplatesProps {
  currentMapping: ColumnMapping;
  onApplyTemplate: (mapping: ColumnMapping) => void;
}

// Mock saved templates (in real app, would be stored in DB)
const mockTemplates: MappingTemplate[] = [
  {
    id: "1",
    name: "Greenhouse Export",
    mapping: {
      name: "Full Name",
      email: "Email",
      phone: "Phone",
      jobTitle: "Job Title",
      atsId: "Candidate ID",
    },
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    name: "Lever Export",
    mapping: {
      name: "Candidate Name",
      email: "Contact Email",
      phone: "Phone Number",
      jobTitle: "Position",
      atsId: "Lever ID",
    },
    createdAt: "2024-01-08",
  },
];

export function MappingTemplates({ currentMapping, onApplyTemplate }: MappingTemplatesProps) {
  const [templates, setTemplates] = useState<MappingTemplate[]>(mockTemplates);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);

  const handleSaveTemplate = () => {
    if (!newTemplateName.trim()) {
      toast.error("Please enter a template name");
      return;
    }

    const newTemplate: MappingTemplate = {
      id: Date.now().toString(),
      name: newTemplateName.trim(),
      mapping: currentMapping,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTemplates([newTemplate, ...templates]);
    setNewTemplateName("");
    setSaveDialogOpen(false);
    toast.success("Mapping template saved!");
  };

  const handleApplyTemplate = (template: MappingTemplate) => {
    onApplyTemplate(template.mapping);
    setLoadDialogOpen(false);
    toast.success(`Applied "${template.name}" template`);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    toast.success("Template deleted");
  };

  return (
    <div className="flex gap-2">
      {/* Save Template */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Save className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Save Template</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Mapping Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">
              Save this column mapping for future imports from the same ATS.
            </p>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Template Name</label>
              <Input
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                placeholder="e.g., Greenhouse Export, Lever Format"
              />
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs font-medium mb-2">Current Mapping:</p>
              <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                {currentMapping.name && <span>Name → {currentMapping.name}</span>}
                {currentMapping.email && <span>Email → {currentMapping.email}</span>}
                {currentMapping.phone && <span>Phone → {currentMapping.phone}</span>}
                {currentMapping.jobTitle && <span>Title → {currentMapping.jobTitle}</span>}
                {currentMapping.atsId && <span>ATS ID → {currentMapping.atsId}</span>}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveTemplate}>
                <Check className="h-4 w-4 mr-1.5" />
                Save Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Load Template */}
      <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5">
            <FolderOpen className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Load Template</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Load Mapping Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <p className="text-sm text-muted-foreground">
              Apply a saved column mapping to quickly set up your import.
            </p>
            {templates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No saved templates yet
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{template.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Created {template.createdAt}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleApplyTemplate(template)}
                      >
                        Apply
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState } from "react";
import { Brain, RotateCcw, Play, AlertTriangle, Check, Clock, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface ModelVersion {
  version: string;
  status: "active" | "deprecated" | "testing";
  releaseDate: string;
  releaseNotes: string;
}

interface AIModel {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  versions: ModelVersion[];
}

const initialModels: AIModel[] = [
  {
    id: "question-generator",
    name: "QuestionGenerator",
    description: "Generates contextual interview questions based on job requirements",
    icon: <FileText className="h-5 w-5" />,
    versions: [
      {
        version: "2.1.0",
        status: "active",
        releaseDate: "2024-03-01",
        releaseNotes: "Improved question relevance by 23%. Added support for technical roles. Better handling of junior vs senior positions.",
      },
      {
        version: "2.0.5",
        status: "deprecated",
        releaseDate: "2024-02-15",
        releaseNotes: "Bug fixes for edge cases in behavioral questions. Performance improvements.",
      },
      {
        version: "2.0.0",
        status: "deprecated",
        releaseDate: "2024-01-20",
        releaseNotes: "Major overhaul with GPT-4 integration. New question types added.",
      },
    ],
  },
  {
    id: "speech-to-text",
    name: "Speech-to-Text",
    description: "Transcribes candidate audio responses with high accuracy",
    icon: <Brain className="h-5 w-5" />,
    versions: [
      {
        version: "3.2.1",
        status: "active",
        releaseDate: "2024-03-10",
        releaseNotes: "99.2% accuracy on English. Added support for 8 new languages. Improved handling of technical terminology.",
      },
      {
        version: "3.1.0",
        status: "testing",
        releaseDate: "2024-03-15",
        releaseNotes: "Experimental real-time streaming support. 15% faster processing.",
      },
      {
        version: "3.0.0",
        status: "deprecated",
        releaseDate: "2024-02-01",
        releaseNotes: "Whisper v3 integration. Multi-language support foundation.",
      },
    ],
  },
  {
    id: "scoring-model",
    name: "ScoringModel",
    description: "Evaluates candidate responses and generates scores",
    icon: <Brain className="h-5 w-5" />,
    versions: [
      {
        version: "4.0.2",
        status: "active",
        releaseDate: "2024-03-05",
        releaseNotes: "Enhanced rubric-based scoring. Better calibration with human reviewers. Added confidence intervals.",
      },
      {
        version: "4.0.1",
        status: "testing",
        releaseDate: "2024-03-12",
        releaseNotes: "Testing new competency mapping algorithm. Early results show 18% better correlation.",
      },
      {
        version: "3.5.0",
        status: "deprecated",
        releaseDate: "2024-02-10",
        releaseNotes: "Legacy scoring model. Scheduled for removal in Q2.",
      },
    ],
  },
  {
    id: "bias-detector",
    name: "BiasDetector",
    description: "Detects potential bias in AI-generated content and evaluations",
    icon: <AlertTriangle className="h-5 w-5" />,
    versions: [
      {
        version: "1.5.0",
        status: "active",
        releaseDate: "2024-02-28",
        releaseNotes: "Comprehensive bias detection across 12 dimensions. Real-time flagging. Integration with fairness dashboard.",
      },
      {
        version: "1.4.0",
        status: "testing",
        releaseDate: "2024-03-08",
        releaseNotes: "New intersectional bias detection. Improved explainability of flags.",
      },
      {
        version: "1.3.0",
        status: "deprecated",
        releaseDate: "2024-01-15",
        releaseNotes: "Initial bias detection framework. Basic demographic parity checks.",
      },
    ],
  },
];

const statusConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  active: {
    label: "Active",
    className: "bg-success/15 text-success border-success/30",
    icon: <Check className="h-3 w-3" />,
  },
  deprecated: {
    label: "Deprecated",
    className: "bg-muted text-muted-foreground border-muted",
    icon: <Clock className="h-3 w-3" />,
  },
  testing: {
    label: "Testing",
    className: "bg-warning/15 text-warning border-warning/30",
    icon: <AlertTriangle className="h-3 w-3" />,
  },
};

export default function AIModels() {
  const [models, setModels] = useState(initialModels);
  const [rollbackDialog, setRollbackDialog] = useState<{
    modelId: string;
    version: string;
  } | null>(null);
  const [testingVersion, setTestingVersion] = useState<string | null>(null);

  const handleRollback = () => {
    if (rollbackDialog) {
      setModels((prev) =>
        prev.map((model) => {
          if (model.id === rollbackDialog.modelId) {
            return {
              ...model,
              versions: model.versions.map((v) => ({
                ...v,
                status:
                  v.version === rollbackDialog.version
                    ? "active"
                    : v.status === "active"
                    ? "deprecated"
                    : v.status,
              })) as ModelVersion[],
            };
          }
          return model;
        })
      );
      toast.success(`Rolled back to version ${rollbackDialog.version}`);
      setRollbackDialog(null);
    }
  };

  const handleTest = (modelId: string, version: string) => {
    setTestingVersion(`${modelId}-${version}`);
    setTimeout(() => {
      setTestingVersion(null);
      toast.success("Model test completed successfully");
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">AI Model Versions</h1>
        <p className="text-muted-foreground mt-1">
          Control and manage AI pipeline model versions across the platform
        </p>
      </div>

      {/* Model Cards */}
      {models.map((model) => (
        <Card key={model.id} className="card-elevated">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                {model.icon}
              </div>
              <div>
                <CardTitle className="text-lg">{model.name}</CardTitle>
                <CardDescription>{model.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Version</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Release Date</TableHead>
                  <TableHead>Release Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {model.versions.map((version) => (
                  <TableRow key={version.version}>
                    <TableCell>
                      <span className="font-mono font-medium">v{version.version}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${statusConfig[version.status].className} flex items-center gap-1 w-fit`}
                      >
                        {statusConfig[version.status].icon}
                        {statusConfig[version.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {version.releaseDate}
                    </TableCell>
                    <TableCell>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-primary">
                            View Notes
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-medium">
                              v{version.version} Release Notes
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {version.releaseNotes}
                            </p>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTest(model.id, version.version)}
                          disabled={testingVersion === `${model.id}-${version.version}`}
                        >
                          {testingVersion === `${model.id}-${version.version}` ? (
                            <>
                              <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
                              Testing...
                            </>
                          ) : (
                            <>
                              <Play className="h-3 w-3 mr-1" />
                              Test
                            </>
                          )}
                        </Button>
                        {version.status !== "active" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setRollbackDialog({
                                modelId: model.id,
                                version: version.version,
                              })
                            }
                          >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Rollback
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
      ))}

      {/* Rollback Confirmation Dialog */}
      <Dialog open={!!rollbackDialog} onOpenChange={() => setRollbackDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-warning" />
              Confirm Rollback
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to rollback to version {rollbackDialog?.version}? This will
              deprecate the currently active version and may affect ongoing interviews.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRollbackDialog(null)}>
              Cancel
            </Button>
            <Button onClick={handleRollback} className="bg-warning text-warning-foreground hover:bg-warning/90">
              Confirm Rollback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

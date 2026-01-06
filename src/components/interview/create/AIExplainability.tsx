import { motion } from "framer-motion";
import { Brain, Target, Lightbulb, CheckCircle, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { JobContextData } from "@/pages/CreateInterview";

interface AIExplainabilityProps {
  data: JobContextData;
}

export function AIExplainability({ data }: AIExplainabilityProps) {
  // Generate explainability based on job context
  const getSkillsToEvaluate = () => {
    if (data.skills.length > 0) {
      return data.skills.slice(0, 5);
    }
    // Default skills based on title
    if (data.title.toLowerCase().includes('frontend') || data.title.toLowerCase().includes('react')) {
      return ['React', 'JavaScript', 'CSS', 'Problem Solving', 'Communication'];
    }
    if (data.title.toLowerCase().includes('backend')) {
      return ['System Design', 'API Development', 'Database', 'Problem Solving', 'Communication'];
    }
    return ['Technical Skills', 'Problem Solving', 'Communication', 'Experience', 'Culture Fit'];
  };

  const getQuestionRationale = () => {
    const rationales = [];
    
    if (data.experienceLevel === 'senior') {
      rationales.push('Leadership and mentoring scenarios');
      rationales.push('System architecture decisions');
    } else if (data.experienceLevel === 'mid') {
      rationales.push('Independent problem-solving');
      rationales.push('Technical depth in core areas');
    } else {
      rationales.push('Foundational knowledge');
      rationales.push('Learning aptitude and growth mindset');
    }
    
    if (data.skills.length > 0) {
      rationales.push(`Deep-dive into ${data.skills[0]}`);
    }
    
    rationales.push('Communication clarity and structure');
    
    return rationales.slice(0, 4);
  };

  const getJobSignals = () => {
    const signals = [];
    
    if (data.title) {
      signals.push(`Role: ${data.title}`);
    }
    if (data.experienceLevel) {
      const levelMap = { junior: '0-2 years', mid: '2-5 years', senior: '5+ years' };
      signals.push(`Experience: ${levelMap[data.experienceLevel]}`);
    }
    if (data.department) {
      signals.push(`Department: ${data.department}`);
    }
    if (data.description && data.description.length > 50) {
      signals.push('Job description analyzed');
    }
    
    return signals;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="bg-accent/30 border-primary/20">
        <CardContent className="p-4 md:p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg ai-gradient flex items-center justify-center shrink-0">
              <Lightbulb className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Why these questions?</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                AI explains its interview approach
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Skills Being Evaluated */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <Target className="h-3.5 w-3.5" />
                Skills to Evaluate
              </div>
              <ul className="space-y-1.5">
                {getSkillsToEvaluate().map((skill, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-3.5 w-3.5 text-success" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            {/* Question Strategy */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <Brain className="h-3.5 w-3.5" />
                Question Strategy
              </div>
              <ul className="space-y-1.5">
                {getQuestionRationale().map((rationale, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {rationale}
                  </li>
                ))}
              </ul>
            </div>

            {/* Job Signals Used */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <FileText className="h-3.5 w-3.5" />
                Signals Used
              </div>
              <ul className="space-y-1.5">
                {getJobSignals().map((signal, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                    {signal}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">AI Note:</span> These questions are generated to evaluate {data.skills.length > 0 ? data.skills.slice(0, 2).join(', ') : 'core competencies'}, problem-solving, and communication based on the job description and experience level.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

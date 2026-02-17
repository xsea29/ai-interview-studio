import { useState } from "react";
import { MessageCircleQuestion, X, Mail, BookOpen, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function OnboardingSupportButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-3"
          >
            <Card className="w-72 card-elevated shadow-2xl border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageCircleQuestion className="w-5 h-5 text-primary" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted/50 transition-colors text-left">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Documentation</p>
                    <p className="text-xs text-muted-foreground">Setup guides & FAQs</p>
                  </div>
                </button>
                <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted/50 transition-colors text-left">
                  <Mail className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Email Support</p>
                    <p className="text-xs text-muted-foreground">support@aiinterview.com</p>
                  </div>
                </button>
                <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted/50 transition-colors text-left">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Live Chat</p>
                    <p className="text-xs text-muted-foreground">Mon–Fri, 9am–6pm EST</p>
                  </div>
                </button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="icon"
        className={cn(
          "w-12 h-12 rounded-full shadow-lg transition-all",
          open
            ? "bg-muted text-foreground hover:bg-muted/80"
            : "ai-gradient text-primary-foreground ai-glow-sm hover:scale-105"
        )}
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircleQuestion className="w-5 h-5" />}
      </Button>
    </div>
  );
}

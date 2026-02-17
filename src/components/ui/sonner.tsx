import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-xl group-[.toaster]:rounded-xl group-[.toaster]:backdrop-blur-sm",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-sm",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-lg group-[.toast]:font-medium group-[.toast]:text-xs",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-lg group-[.toast]:font-medium group-[.toast]:text-xs",
          success:
            "group-[.toaster]:!border-success/30 group-[.toaster]:!bg-success/5",
          error:
            "group-[.toaster]:!border-destructive/30 group-[.toaster]:!bg-destructive/5",
          warning:
            "group-[.toaster]:!border-warning/30 group-[.toaster]:!bg-warning/5",
          info:
            "group-[.toaster]:!border-primary/30 group-[.toaster]:!bg-primary/5",
        },
      }}
      icons={{
        success: <CheckCircle className="h-5 w-5 text-success" />,
        error: <XCircle className="h-5 w-5 text-destructive" />,
        warning: <AlertTriangle className="h-5 w-5 text-warning" />,
        info: <Info className="h-5 w-5 text-primary" />,
      }}
      {...props}
    />
  );
};

export { Toaster, toast };

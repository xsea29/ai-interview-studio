 import { useState, useEffect } from "react";
 import { motion } from "framer-motion";
 import { 
   Link2, 
   CheckCircle, 
   AlertTriangle, 
   Trash2, 
   RefreshCw,
   ExternalLink,
   Clock
 } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
 import { Badge } from "@/components/ui/badge";
 import { 
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
 } from "@/components/ui/alert-dialog";
 import { atsProviders, ATSProvider, ATSConfig } from "@/lib/atsConfig";
 import { toast } from "sonner";
 
 interface ATSConnection {
   provider: ATSProvider;
   connectedAt: string;
 }
 
 export function ATSSettings() {
   const [connection, setConnection] = useState<ATSConnection | null>(null);
   const [connectedProvider, setConnectedProvider] = useState<ATSConfig | null>(null);
 
   useEffect(() => {
     const saved = localStorage.getItem('ats_connection');
     if (saved) {
       try {
         const parsed: ATSConnection = JSON.parse(saved);
         setConnection(parsed);
         const provider = atsProviders.find(p => p.id === parsed.provider);
         if (provider) {
           setConnectedProvider(provider);
         }
       } catch (e) {
         console.error('Failed to load ATS connection', e);
       }
     }
   }, []);
 
   const handleDisconnect = () => {
     localStorage.removeItem('ats_connection');
     const providerName = connectedProvider?.name || 'ATS';
     setConnection(null);
     setConnectedProvider(null);
     toast.success(`Disconnected from ${providerName}`, {
       description: 'Your ATS integration has been removed',
     });
   };
 
   const formatDate = (dateString: string) => {
     return new Date(dateString).toLocaleDateString('en-US', {
       month: 'short',
       day: 'numeric',
       year: 'numeric',
       hour: '2-digit',
       minute: '2-digit',
     });
   };
 
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
     >
       <Card>
         <CardHeader>
           <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
               <Link2 className="h-5 w-5 text-primary" />
             </div>
             <div>
               <CardTitle className="text-lg">ATS Integration</CardTitle>
               <CardDescription>Manage your Applicant Tracking System connection</CardDescription>
             </div>
           </div>
         </CardHeader>
         <CardContent className="space-y-4">
           {connectedProvider && connection ? (
             <div className="space-y-4">
               {/* Connected Status */}
               <div className="p-4 rounded-lg border border-success/30 bg-success/5">
                 <div className="flex items-start justify-between">
                   <div className="flex items-center gap-3">
                     <div className="h-12 w-12 rounded-xl bg-card border flex items-center justify-center text-2xl">
                       {connectedProvider.icon}
                     </div>
                     <div>
                       <div className="font-medium flex items-center gap-2">
                         {connectedProvider.name}
                         <Badge variant="secondary" className="bg-success/10 text-success text-xs">
                           <CheckCircle className="h-3 w-3 mr-1" />
                           Connected
                         </Badge>
                       </div>
                       <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                         <Clock className="h-3 w-3" />
                         Connected on {formatDate(connection.connectedAt)}
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
 
               {/* Actions */}
               <div className="flex flex-wrap gap-3">
                 <Button variant="outline" size="sm">
                   <RefreshCw className="h-4 w-4 mr-2" />
                   Test Connection
                 </Button>
                 <Button variant="outline" size="sm">
                   <ExternalLink className="h-4 w-4 mr-2" />
                   Open {connectedProvider.name}
                 </Button>
                 
                 <AlertDialog>
                   <AlertDialogTrigger asChild>
                     <Button variant="outline" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                       <Trash2 className="h-4 w-4 mr-2" />
                       Disconnect
                     </Button>
                   </AlertDialogTrigger>
                   <AlertDialogContent>
                     <AlertDialogHeader>
                       <AlertDialogTitle className="flex items-center gap-2">
                         <AlertTriangle className="h-5 w-5 text-warning" />
                         Disconnect from {connectedProvider.name}?
                       </AlertDialogTitle>
                       <AlertDialogDescription>
                         This will remove the connection to {connectedProvider.name}. You'll need to re-authenticate to import candidates again. Previously imported candidates will not be affected.
                       </AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter>
                       <AlertDialogCancel>Cancel</AlertDialogCancel>
                       <AlertDialogAction 
                         onClick={handleDisconnect}
                         className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                       >
                         Disconnect
                       </AlertDialogAction>
                     </AlertDialogFooter>
                   </AlertDialogContent>
                 </AlertDialog>
               </div>
 
               {/* Info Note */}
               <div className="p-3 rounded-lg bg-muted/50 border border-dashed">
                 <p className="text-xs text-muted-foreground">
                   <strong>Note:</strong> Disconnecting will only remove the API connection. All previously imported candidate data and interview records will remain intact.
                 </p>
               </div>
             </div>
           ) : (
             <div className="text-center py-8">
               <div className="h-14 w-14 mx-auto rounded-xl bg-muted flex items-center justify-center mb-4">
                 <Link2 className="h-7 w-7 text-muted-foreground" />
               </div>
               <h3 className="font-medium mb-1">No ATS Connected</h3>
               <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
                 Connect your Applicant Tracking System to import candidates directly.
               </p>
               <Button variant="outline" asChild>
                 <a href="/create">
                   <Link2 className="h-4 w-4 mr-2" />
                   Connect ATS
                 </a>
               </Button>
             </div>
           )}
         </CardContent>
       </Card>
     </motion.div>
   );
 }
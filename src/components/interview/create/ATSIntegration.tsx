 import { useState, useEffect } from "react";
 import { motion, AnimatePresence } from "framer-motion";
 import { 
   Link2, 
   CheckCircle, 
   AlertCircle, 
   Loader2, 
   RefreshCw, 
   Users,
   Check,
   X,
   ChevronDown,
   ExternalLink,
   Key,
   Zap
 } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Badge } from "@/components/ui/badge";
 import { 
   Select, 
   SelectContent, 
   SelectItem, 
   SelectTrigger, 
   SelectValue 
 } from "@/components/ui/select";
 import { CandidateData } from "@/pages/CreateInterview";
 import { atsProviders, ATSProvider, ATSConfig, ATSCandidate } from "@/lib/atsConfig";
 import { toast } from "sonner";
 
 interface ATSIntegrationProps {
   candidates: CandidateData[];
   setCandidates: (candidates: CandidateData[]) => void;
 }
 
 type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';
 type FetchStatus = 'idle' | 'fetching' | 'loaded' | 'error';
 
 export function ATSIntegration({ candidates, setCandidates }: ATSIntegrationProps) {
   const [selectedATS, setSelectedATS] = useState<ATSProvider | null>(null);
   const [apiKey, setApiKey] = useState("");
   const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
   const [fetchStatus, setFetchStatus] = useState<FetchStatus>('idle');
   const [atsCandidates, setAtsCandidates] = useState<ATSCandidate[]>([]);
   const [selectedCandidateIds, setSelectedCandidateIds] = useState<Set<string>>(new Set());
   const [connectedProvider, setConnectedProvider] = useState<ATSConfig | null>(null);
 
   const selectedProvider = selectedATS ? atsProviders.find(p => p.id === selectedATS) : null;
 
   // Load saved connection from localStorage
   useEffect(() => {
     const saved = localStorage.getItem('ats_connection');
     if (saved) {
       try {
         const { provider, connectedAt } = JSON.parse(saved);
         const config = atsProviders.find(p => p.id === provider);
         if (config) {
           setConnectedProvider(config);
           setSelectedATS(provider);
           setConnectionStatus('connected');
         }
       } catch (e) {
         console.error('Failed to load ATS connection', e);
       }
     }
   }, []);
 
   const handleTestConnection = async () => {
     if (!selectedProvider) return;
     
     setConnectionStatus('connecting');
     
     // Simulate API connection test
     await new Promise(resolve => setTimeout(resolve, 1500));
     
     // Simulate success (in real app, validate with actual API)
     if (apiKey.length >= 10 || selectedProvider.authMethod === 'oauth') {
       setConnectionStatus('connected');
       setConnectedProvider(selectedProvider);
       localStorage.setItem('ats_connection', JSON.stringify({
         provider: selectedProvider.id,
         connectedAt: new Date().toISOString(),
       }));
       toast.success(`Connected to ${selectedProvider.name}`, {
         description: 'You can now fetch candidates from your ATS',
       });
     } else {
       setConnectionStatus('error');
       toast.error('Connection failed', {
         description: 'Please check your API key and try again',
       });
     }
   };
 
   const handleOAuthConnect = async () => {
     if (!selectedProvider) return;
     
     setConnectionStatus('connecting');
     
     // Simulate OAuth flow
     toast.info(`Redirecting to ${selectedProvider.name}...`, {
       description: 'Complete authentication in the popup window',
     });
     
     await new Promise(resolve => setTimeout(resolve, 2000));
     
     setConnectionStatus('connected');
     setConnectedProvider(selectedProvider);
     localStorage.setItem('ats_connection', JSON.stringify({
       provider: selectedProvider.id,
       connectedAt: new Date().toISOString(),
     }));
     toast.success(`Connected to ${selectedProvider.name}`);
   };
 
   const handleFetchCandidates = async () => {
     if (!connectedProvider) return;
     
     setFetchStatus('fetching');
     
     // Simulate fetching candidates
     await new Promise(resolve => setTimeout(resolve, 2000));
     
     // Mock candidate data
     const mockCandidates: ATSCandidate[] = [
       { id: '1', name: 'John Smith', email: 'john.smith@email.com', phone: '+1 555-0123', jobTitle: 'Senior Developer', atsId: `${connectedProvider.id.toUpperCase()}-001`, source: connectedProvider.name, stage: 'Phone Screen' },
       { id: '2', name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+1 555-0124', jobTitle: 'Product Manager', atsId: `${connectedProvider.id.toUpperCase()}-002`, source: connectedProvider.name, stage: 'Technical Interview' },
       { id: '3', name: 'Mike Brown', email: 'mike.b@email.com', phone: '+1 555-0125', jobTitle: 'UX Designer', atsId: `${connectedProvider.id.toUpperCase()}-003`, source: connectedProvider.name, stage: 'Phone Screen' },
       { id: '4', name: 'Emily Davis', email: 'emily.d@email.com', phone: '+1 555-0126', jobTitle: 'Frontend Developer', atsId: `${connectedProvider.id.toUpperCase()}-004`, source: connectedProvider.name, stage: 'Initial Review' },
       { id: '5', name: 'Chris Wilson', email: 'chris.w@email.com', phone: '+1 555-0127', jobTitle: 'Backend Engineer', atsId: `${connectedProvider.id.toUpperCase()}-005`, source: connectedProvider.name, stage: 'Technical Interview' },
       { id: '6', name: 'Lisa Anderson', email: 'lisa.a@email.com', phone: '+1 555-0128', jobTitle: 'Data Scientist', atsId: `${connectedProvider.id.toUpperCase()}-006`, source: connectedProvider.name, stage: 'Phone Screen' },
     ];
     
     setAtsCandidates(mockCandidates);
     setFetchStatus('loaded');
     toast.success(`Loaded ${mockCandidates.length} candidates from ${connectedProvider.name}`);
   };
 
   const handleSelectAll = () => {
     if (selectedCandidateIds.size === atsCandidates.length) {
       setSelectedCandidateIds(new Set());
     } else {
       setSelectedCandidateIds(new Set(atsCandidates.map(c => c.id)));
     }
   };
 
   const handleToggleCandidate = (id: string) => {
     const newSelected = new Set(selectedCandidateIds);
     if (newSelected.has(id)) {
       newSelected.delete(id);
     } else {
       newSelected.add(id);
     }
     setSelectedCandidateIds(newSelected);
   };
 
   const handleLoadSelectedCandidates = () => {
     const selected = atsCandidates.filter(c => selectedCandidateIds.has(c.id));
     const candidateData: CandidateData[] = selected.map(c => ({
       email: c.email,
       name: c.name,
       phone: c.phone,
       jobTitle: c.jobTitle,
       atsId: c.atsId,
       isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email),
     }));
     setCandidates(candidateData);
     toast.success(`Loaded ${candidateData.length} candidates`, {
       description: 'Candidates are ready for interview creation',
     });
   };
 
   const validCount = candidates.filter(c => c.isValid).length;
   const invalidCount = candidates.filter(c => !c.isValid).length;
 
   return (
     <div className="p-6 space-y-6">
       {/* ATS Selector */}
       <div className="space-y-3">
         <Label className="text-sm font-medium">Select your ATS</Label>
         <Select 
           value={selectedATS || ""} 
           onValueChange={(v) => {
             setSelectedATS(v as ATSProvider);
             if (connectionStatus !== 'connected' || connectedProvider?.id !== v) {
               setConnectionStatus('disconnected');
               setApiKey("");
               setFetchStatus('idle');
               setAtsCandidates([]);
             }
           }}
         >
           <SelectTrigger className="w-full">
             <SelectValue placeholder="Choose an ATS provider..." />
           </SelectTrigger>
           <SelectContent>
             {atsProviders.map((ats) => (
               <SelectItem key={ats.id} value={ats.id}>
                 <div className="flex items-center gap-2">
                   <span className="text-lg">{ats.icon}</span>
                   <span>{ats.name}</span>
                   {connectedProvider?.id === ats.id && (
                     <Badge variant="secondary" className="ml-2 text-xs bg-success/10 text-success">
                       Connected
                     </Badge>
                   )}
                 </div>
               </SelectItem>
             ))}
           </SelectContent>
         </Select>
       </div>
 
       {/* Connection Status & Auth */}
       <AnimatePresence mode="wait">
         {selectedProvider && connectionStatus !== 'connected' && (
           <motion.div
             initial={{ opacity: 0, height: 0 }}
             animate={{ opacity: 1, height: 'auto' }}
             exit={{ opacity: 0, height: 0 }}
             className="space-y-4"
           >
             <div className="p-4 rounded-lg border bg-muted/30">
               <div className="flex items-start gap-3">
                 <span className="text-2xl">{selectedProvider.icon}</span>
                 <div className="flex-1">
                   <h4 className="font-medium">{selectedProvider.name}</h4>
                   <p className="text-sm text-muted-foreground mt-0.5">
                     {selectedProvider.description}
                   </p>
                 </div>
               </div>
 
               {/* API Key Input or OAuth Button */}
               <div className="mt-4 space-y-3">
                 {selectedProvider.authMethod === 'api_key' ? (
                   <>
                     <div className="space-y-2">
                       <Label htmlFor="api-key" className="text-sm">
                         {selectedProvider.apiKeyLabel || 'API Key'}
                       </Label>
                       <div className="relative">
                         <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                         <Input
                           id="api-key"
                           type="password"
                           value={apiKey}
                           onChange={(e) => setApiKey(e.target.value)}
                           placeholder={selectedProvider.apiKeyPlaceholder || 'Enter your API key'}
                           className="pl-10"
                         />
                       </div>
                       <p className="text-xs text-muted-foreground">
                         Find this in your {selectedProvider.name} settings → Integrations
                       </p>
                     </div>
                     <Button 
                       onClick={handleTestConnection}
                       disabled={!apiKey || connectionStatus === 'connecting'}
                       className="w-full"
                     >
                       {connectionStatus === 'connecting' ? (
                         <>
                           <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                           Testing Connection...
                         </>
                       ) : (
                         <>
                           <Link2 className="h-4 w-4 mr-2" />
                           Test Connection
                         </>
                       )}
                     </Button>
                   </>
                 ) : (
                   <Button 
                     onClick={handleOAuthConnect}
                     disabled={connectionStatus === 'connecting'}
                     className="w-full ai-gradient"
                   >
                     {connectionStatus === 'connecting' ? (
                       <>
                         <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                         Connecting...
                       </>
                     ) : (
                       <>
                         <Zap className="h-4 w-4 mr-2" />
                         Connect with {selectedProvider.name}
                       </>
                     )}
                   </Button>
                 )}
               </div>
 
               {connectionStatus === 'error' && (
                 <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                   <div className="flex items-center gap-2 text-destructive text-sm">
                     <AlertCircle className="h-4 w-4" />
                     <span>Connection failed. Please check your credentials.</span>
                   </div>
                 </div>
               )}
             </div>
           </motion.div>
         )}
 
         {/* Connected State */}
         {connectionStatus === 'connected' && connectedProvider && (
           <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="space-y-4"
           >
             {/* Connection Success Banner */}
             <div className="p-4 rounded-lg border border-success/30 bg-success/5">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                     <CheckCircle className="h-5 w-5 text-success" />
                   </div>
                   <div>
                     <div className="font-medium flex items-center gap-2">
                       <span className="text-lg">{connectedProvider.icon}</span>
                       Connected to {connectedProvider.name}
                     </div>
                     <p className="text-sm text-muted-foreground">
                       Ready to fetch candidates
                     </p>
                   </div>
                 </div>
                 <Button 
                   variant="outline" 
                   size="sm"
                   onClick={() => {
                     setConnectionStatus('disconnected');
                     setConnectedProvider(null);
                     setApiKey("");
                     setFetchStatus('idle');
                     setAtsCandidates([]);
                     localStorage.removeItem('ats_connection');
                     toast.info('Disconnected from ATS');
                   }}
                 >
                   Disconnect
                 </Button>
               </div>
             </div>
 
             {/* Fetch Candidates */}
             {fetchStatus === 'idle' && (
               <Button 
                 onClick={handleFetchCandidates}
                 className="w-full ai-gradient"
                 size="lg"
               >
                 <Users className="h-4 w-4 mr-2" />
                 Load Candidates from {connectedProvider.name}
               </Button>
             )}
 
             {fetchStatus === 'fetching' && (
               <div className="p-6 rounded-lg border bg-muted/30 text-center">
                 <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary mb-3" />
                 <p className="font-medium">Fetching candidates...</p>
                 <p className="text-sm text-muted-foreground">
                   Connecting to {connectedProvider.name} API
                 </p>
               </div>
             )}
 
             {/* Candidate Preview Table */}
             {fetchStatus === 'loaded' && atsCandidates.length > 0 && (
               <div className="space-y-4">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <Badge variant="secondary" className="bg-success/10 text-success">
                       <CheckCircle className="h-3 w-3 mr-1" />
                       Loaded {atsCandidates.length} candidates
                     </Badge>
                   </div>
                   <Button 
                     variant="ghost" 
                     size="sm"
                     onClick={handleFetchCandidates}
                   >
                     <RefreshCw className="h-4 w-4 mr-1" />
                     Refresh
                   </Button>
                 </div>
 
                 {/* Preview Table */}
                 <div className="rounded-lg border overflow-hidden">
                   <table className="w-full text-sm">
                     <thead className="bg-muted/50">
                       <tr>
                         <th className="text-left px-4 py-3 w-10">
                           <button 
                             onClick={handleSelectAll}
                             className="h-4 w-4 rounded border flex items-center justify-center hover:border-primary transition-colors"
                           >
                             {selectedCandidateIds.size === atsCandidates.length && (
                               <Check className="h-3 w-3 text-primary" />
                             )}
                           </button>
                         </th>
                         <th className="text-left font-medium px-4 py-3">Candidate</th>
                         <th className="text-left font-medium px-4 py-3 hidden sm:table-cell">Job Title</th>
                         <th className="text-left font-medium px-4 py-3 hidden md:table-cell">Stage</th>
                         <th className="text-left font-medium px-4 py-3 hidden lg:table-cell">ATS ID</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-border">
                       {atsCandidates.map((candidate) => (
                         <tr 
                           key={candidate.id}
                           className={`hover:bg-muted/30 cursor-pointer transition-colors ${
                             selectedCandidateIds.has(candidate.id) ? 'bg-primary/5' : ''
                           }`}
                           onClick={() => handleToggleCandidate(candidate.id)}
                         >
                           <td className="px-4 py-3">
                             <div 
                               className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                                 selectedCandidateIds.has(candidate.id) 
                                   ? 'bg-primary border-primary' 
                                   : 'border-muted-foreground/30'
                               }`}
                             >
                               {selectedCandidateIds.has(candidate.id) && (
                                 <Check className="h-3 w-3 text-primary-foreground" />
                               )}
                             </div>
                           </td>
                           <td className="px-4 py-3">
                             <div>
                               <div className="font-medium">{candidate.name}</div>
                               <div className="text-muted-foreground text-xs">{candidate.email}</div>
                             </div>
                           </td>
                           <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                             {candidate.jobTitle}
                           </td>
                           <td className="px-4 py-3 hidden md:table-cell">
                             <Badge variant="outline" className="text-xs">
                               {candidate.stage}
                             </Badge>
                           </td>
                           <td className="px-4 py-3 text-muted-foreground font-mono text-xs hidden lg:table-cell">
                             {candidate.atsId}
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
 
                 {/* Load Selected Button */}
                 <div className="flex items-center justify-between pt-2">
                   <p className="text-sm text-muted-foreground">
                     {selectedCandidateIds.size} of {atsCandidates.length} selected
                   </p>
                   <Button
                     onClick={handleLoadSelectedCandidates}
                     disabled={selectedCandidateIds.size === 0}
                     className="ai-gradient"
                   >
                     Load Selected Candidates from {connectedProvider.name}
                   </Button>
                 </div>
               </div>
             )}
 
             {/* Imported Candidates Summary */}
             {candidates.length > 0 && (
               <div className="p-4 rounded-lg border bg-muted/30">
                 <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2">
                     <CheckCircle className="h-4 w-4 text-success" />
                     <span className="text-sm font-medium">{validCount} valid</span>
                   </div>
                   {invalidCount > 0 && (
                     <div className="flex items-center gap-2 text-destructive">
                       <AlertCircle className="h-4 w-4" />
                       <span className="text-sm font-medium">{invalidCount} invalid</span>
                     </div>
                   )}
                 </div>
               </div>
             )}
           </motion.div>
         )}
       </AnimatePresence>
 
       {/* Empty State */}
       {!selectedATS && (
         <div className="text-center py-8">
           <div className="h-16 w-16 mx-auto rounded-xl bg-muted flex items-center justify-center mb-4">
             <Link2 className="h-8 w-8 text-muted-foreground" />
           </div>
           <h3 className="font-medium mb-1">Connect your ATS</h3>
           <p className="text-sm text-muted-foreground max-w-sm mx-auto">
             Select your Applicant Tracking System above to import candidates directly.
           </p>
         </div>
       )}
     </div>
   );
 }
 // ATS Configuration and Types
 
 export type ATSProvider = 'greenhouse' | 'lever' | 'ashby' | 'workable' | 'bamboohr' | 'workday' | 'icims';
 
 export type ATSAuthMethod = 'api_key' | 'oauth';
 
 export interface ATSConfig {
   id: ATSProvider;
   name: string;
   icon: string;
   authMethod: ATSAuthMethod;
   description: string;
   apiKeyLabel?: string;
   apiKeyPlaceholder?: string;
 }
 
 export const atsProviders: ATSConfig[] = [
   {
     id: 'greenhouse',
     name: 'Greenhouse',
     icon: '🌱',
     authMethod: 'api_key',
     description: 'Connect with your Greenhouse API key',
     apiKeyLabel: 'Harvest API Key',
     apiKeyPlaceholder: 'Enter your Greenhouse Harvest API key',
   },
   {
     id: 'lever',
     name: 'Lever',
     icon: '⚡',
     authMethod: 'oauth',
     description: 'Connect via OAuth authentication',
   },
   {
     id: 'ashby',
     name: 'Ashby',
     icon: '🔷',
     authMethod: 'api_key',
     description: 'Connect with your Ashby API key',
     apiKeyLabel: 'API Key',
     apiKeyPlaceholder: 'Enter your Ashby API key',
   },
   {
     id: 'workable',
     name: 'Workable',
     icon: '💼',
     authMethod: 'api_key',
     description: 'Connect with your Workable API key',
     apiKeyLabel: 'API Access Token',
     apiKeyPlaceholder: 'Enter your Workable access token',
   },
   {
     id: 'bamboohr',
     name: 'BambooHR',
     icon: '🎍',
     authMethod: 'api_key',
     description: 'Connect with your BambooHR API key',
     apiKeyLabel: 'API Key',
     apiKeyPlaceholder: 'Enter your BambooHR API key',
   },
   {
     id: 'workday',
     name: 'Workday',
     icon: '🏢',
     authMethod: 'api_key',
     description: 'Connect with your Workday credentials',
     apiKeyLabel: 'Integration Key',
     apiKeyPlaceholder: 'Enter your Workday integration key',
   },
   {
     id: 'icims',
     name: 'iCIMS',
     icon: '🔵',
     authMethod: 'api_key',
     description: 'Connect with your iCIMS API key',
     apiKeyLabel: 'API Key',
     apiKeyPlaceholder: 'Enter your iCIMS API key',
   },
 ];
 
 export interface ATSConnection {
   provider: ATSProvider;
   isConnected: boolean;
   connectedAt?: Date;
   lastSyncAt?: Date;
 }
 
 export interface ATSCandidate {
   id: string;
   name: string;
   email: string;
   phone?: string;
   jobTitle?: string;
   atsId: string;
   source: string;
   appliedAt?: Date;
   stage?: string;
 }
 
 export const getATSProvider = (id: ATSProvider): ATSConfig | undefined => {
   return atsProviders.find(p => p.id === id);
 };
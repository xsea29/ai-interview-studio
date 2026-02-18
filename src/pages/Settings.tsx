import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Shield, Users, Palette, Video, CreditCard, Database, Bell, Key, Link2, Search } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { OrganizationSettings } from "@/components/settings/OrganizationSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { TeamSettings } from "@/components/settings/TeamSettings";
import { BrandingSettings } from "@/components/settings/BrandingSettings";
import { InterviewSettings } from "@/components/settings/InterviewSettings";
import { ATSSettings } from "@/components/settings/ATSSettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { BillingSettings } from "@/components/settings/BillingSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { APISettings } from "@/components/settings/APISettings";

const tabs = [
  { id: "organization", label: "Organization", icon: Building2, desc: "Company profile & domains" },
  { id: "security", label: "Security & Access", icon: Shield, desc: "Auth, MFA, sessions" },
  { id: "team", label: "Team & Roles", icon: Users, desc: "Members, invites, permissions" },
  { id: "branding", label: "Branding", icon: Palette, desc: "Colors, fonts, email templates" },
  { id: "interviews", label: "Interviews & AI", icon: Video, desc: "Defaults, AI behavior" },
  { id: "integrations", label: "Integrations", icon: Link2, desc: "ATS, CSV, webhooks" },
  { id: "privacy", label: "Privacy & Compliance", icon: Database, desc: "Consent, retention, GDPR" },
  { id: "billing", label: "Billing & Usage", icon: CreditCard, desc: "Plans, payments, invoices" },
  { id: "notifications", label: "Notifications", icon: Bell, desc: "Alerts, Slack, DND" },
  { id: "api", label: "API & Developers", icon: Key, desc: "API keys, webhooks, rate limits" },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState("organization");
  const [search, setSearch] = useState("");

  const filteredTabs = tabs.filter(t =>
    t.label.toLowerCase().includes(search.toLowerCase()) ||
    t.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-6 px-4 sm:px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Configure every aspect of your AI Interview platform</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:flex flex-col w-56 shrink-0">
            <div className="relative mb-3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search settings..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 h-9 text-sm"
              />
            </div>
            <nav className="space-y-0.5">
              {filteredTabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all group text-sm",
                      activeTab === tab.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className={cn("h-4 w-4 shrink-0", activeTab === tab.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Mobile tab scroll */}
          <div className="lg:hidden w-full">
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 no-scrollbar">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all border",
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-muted-foreground border-border hover:border-primary/40"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
            >
              {/* Section header */}
              <div className="mb-5">
                {(() => {
                  const tab = tabs.find(t => t.id === activeTab);
                  const Icon = tab?.icon;
                  return (
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className="h-5 w-5 text-primary" />}
                      <div>
                        <h2 className="text-lg font-semibold">{tab?.label}</h2>
                        <p className="text-sm text-muted-foreground">{tab?.desc}</p>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {activeTab === "organization" && <OrganizationSettings />}
              {activeTab === "security" && <SecuritySettings />}
              {activeTab === "team" && <TeamSettings />}
              {activeTab === "branding" && <BrandingSettings />}
              {activeTab === "interviews" && <InterviewSettings />}
              {activeTab === "integrations" && <ATSSettings />}
              {activeTab === "privacy" && <PrivacySettings />}
              {activeTab === "billing" && <BillingSettings />}
              {activeTab === "notifications" && <NotificationSettings />}
              {activeTab === "api" && <APISettings />}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;

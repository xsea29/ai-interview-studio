import { Link } from "react-router-dom";
import { Shield, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthChoice() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container px-4 py-10 sm:py-16">
        <div className="mx-auto max-w-3xl space-y-6">
          <header className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
            <p className="text-muted-foreground">
              Choose where you want to sign in—client workspace or platform admin.
            </p>
          </header>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserRound className="h-5 w-5" /> Client
                </CardTitle>
                <CardDescription>For interview operations and analytics.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/auth/client">Client login</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" /> Platform Admin
                </CardTitle>
                <CardDescription>For organizations, compliance, and billing.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="secondary" className="w-full">
                  <Link to="/auth/admin">Admin login</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

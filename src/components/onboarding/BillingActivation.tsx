import { useState } from "react";
import { CreditCard, Zap, Users, ArrowRight, ArrowLeft, Check, AlertCircle, TrendingUp, Download, RefreshCw, Bell } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { OnboardingData } from "@/pages/CompanyOnboarding";
import { cn } from "@/lib/utils";

interface BillingActivationProps {
  data: OnboardingData;
  updateData: <K extends keyof OnboardingData>(section: K, updates: Partial<OnboardingData[K]>) => void;
  onNext: () => void;
  onBack: () => void;
  step: number;
}

const plans = [
  {
    id: "pay_per_interview",
    name: "Pay Per Interview",
    description: "Pay only for what you use",
    price: "$5",
    unit: "per interview",
    features: [
      "No monthly commitment",
      "All interview types included",
      "Full analytics access",
      "Email support",
    ],
    recommended: false,
  },
  {
    id: "credits",
    name: "Credit Packs",
    description: "Buy credits in bulk for discounts",
    price: "$99",
    unit: "for 25 credits",
    features: [
      "20% savings vs pay-per-use",
      "Credits never expire",
      "Priority support",
      "Advanced analytics",
    ],
    recommended: true,
  },
  {
    id: "subscription",
    name: "Monthly Subscription",
    description: "Unlimited interviews for teams",
    price: "$299",
    unit: "per month",
    features: [
      "Unlimited interviews",
      "Up to 10 users included",
      "Dedicated support",
      "Custom integrations",
    ],
    recommended: false,
  },
];

const BillingActivation = ({ data, updateData, onNext, onBack, step }: BillingActivationProps) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const handlePaymentSubmit = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      updateData("billing", { paymentMethod: "card_****" + cardNumber.slice(-4) });
    }, 2000);
  };

  // Step 0: Choose Plan
  if (step === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl ai-gradient ai-glow mb-4">
            <Zap className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Choose Your Plan</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Select the billing model that works best for your organization
          </p>
        </div>

        <RadioGroup
          value={data.billing.plan}
          onValueChange={(value) =>
            updateData("billing", { plan: value as "pay_per_interview" | "credits" | "subscription" })
          }
          className="grid gap-4 md:grid-cols-3"
        >
          {plans.map((plan) => (
            <Label
              key={plan.id}
              htmlFor={plan.id}
              className={cn(
                "flex flex-col p-6 rounded-xl border-2 cursor-pointer transition-all relative",
                data.billing.plan === plan.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              {plan.recommended && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Recommended
                </Badge>
              )}
              <RadioGroupItem value={plan.id} id={plan.id} className="sr-only" />
              
              <div className="mb-4">
                <h3 className="font-semibold text-lg">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
              
              <div className="mb-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground text-sm"> {plan.unit}</span>
              </div>
              
              <ul className="space-y-2 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-success" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="mt-4 pt-4 border-t">
                {data.billing.plan === plan.id ? (
                  <Badge variant="default" className="w-full justify-center">Selected</Badge>
                ) : (
                  <Badge variant="outline" className="w-full justify-center">Select Plan</Badge>
                )}
              </div>
            </Label>
          ))}
        </RadioGroup>

        <Alert>
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            <strong>Free Trial:</strong> Start with 5 free interview credits to test the platform.
            No payment required until you're ready to scale.
          </AlertDescription>
        </Alert>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button onClick={onNext} size="lg" className="gap-2">
            Continue to Payment
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Step 1: Payment & Activation
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl ai-gradient ai-glow mb-4">
          <CreditCard className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Payment & Activation</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Add a payment method to activate your account
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-lg">Payment Method</CardTitle>
              <CardDescription>
                Add a credit or debit card
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                />
              </div>
              
              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    maxLength={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    maxLength={4}
                    type="password"
                  />
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handlePaymentSubmit}
                disabled={processing || !cardNumber || !expiry || !cvv}
              >
                {processing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Add Payment Method
                  </>
                )}
              </Button>

              {data.billing.paymentMethod && (
                <Alert className="border-success/50 bg-success/5">
                  <Check className="w-4 h-4 text-success" />
                  <AlertDescription className="text-success">
                    Payment method added: {data.billing.paymentMethod}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-Recharge</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically buy more credits when running low
                  </p>
                </div>
                <Switch
                  checked={data.billing.autoRecharge}
                  onCheckedChange={(checked) =>
                    updateData("billing", { autoRecharge: checked })
                  }
                />
              </div>

              {data.billing.autoRecharge && (
                <Alert>
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>
                    We'll automatically purchase credits when your balance falls below 5.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Usage Dashboard Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 grid-cols-3">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-primary">5</p>
                  <p className="text-xs text-muted-foreground">Free Credits</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground">Interviews Done</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground">Candidates</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Credits Used</span>
                  <span>0 / 5</span>
                </div>
                <Progress value={0} />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Low credits warning", sublabel: "When credits fall below 5" },
                { label: "Payment failure warning", sublabel: "If auto-recharge fails" },
                { label: "Monthly usage report", sublabel: "Summary of interviews conducted" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.sublabel}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Download className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-semibold">Invoices & Receipts</h3>
                  <p className="text-sm text-muted-foreground">
                    Download invoices and receipts from your dashboard after activation
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Alert className="border-primary/30 bg-primary/5">
        <Zap className="w-4 h-4 text-primary" />
        <AlertDescription>
          <strong>Ready to go!</strong> You can skip payment for now and start with your 5 free credits.
          Add a payment method anytime from your settings.
        </AlertDescription>
      </Alert>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onNext}>
            Skip for Now
          </Button>
          <Button onClick={onNext} size="lg" className="gap-2">
            Complete Setup
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BillingActivation;

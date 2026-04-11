import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
  CreditCard, Smartphone, Building2, CheckCircle2, Clock, ArrowUpRight, Shield, Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const subscriptionPlans = [
  { id: "basic", name: "Basic", price: 5000, currency: "RWF", period: "month", features: ["Access to courses", "Basic advisory", "Weather updates", "1 farm profile"] },
  { id: "pro", name: "Professional", price: 15000, currency: "RWF", period: "month", features: ["All Basic features", "AI Plant Diagnosis", "Unlimited farms", "Marketplace access", "Reports & Analytics", "Priority support"] },
  { id: "enterprise", name: "Enterprise", price: 50000, currency: "RWF", period: "month", features: ["All Professional features", "Team management", "Custom reports", "API access", "Dedicated support", "Training certificates"] },
];

const paymentMethods = [
  { id: "mtn", name: "MTN Mobile Money", icon: "📱", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30", prefix: "078", description: "Pay with MTN MoMo" },
  { id: "airtel", name: "Airtel Money", icon: "📱", color: "bg-red-500/10 text-red-600 border-red-500/30", prefix: "073", description: "Pay with Airtel Money" },
  { id: "tigo", name: "Tigo Cash", icon: "📱", color: "bg-blue-500/10 text-blue-600 border-blue-500/30", prefix: "072", description: "Pay with Tigo Cash" },
  { id: "bank", name: "Bank Transfer", icon: "🏦", color: "bg-primary/10 text-primary border-primary/30", prefix: "", description: "Pay via bank transfer (BK, Equity, I&M)" },
];

const Payments = () => {
  const { user, profile } = useAuth();
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof subscriptionPlans[0] | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSelectPlan = (plan: typeof subscriptionPlans[0]) => {
    setSelectedPlan(plan);
    setSelectedMethod("");
    setPhoneNumber("");
    setBankName("");
    setAccountNumber("");
    setProcessing(false);
    setPaymentSuccess(false);
    setPaymentOpen(true);
  };

  const handlePayment = async () => {
    if (!selectedMethod) { toast({ title: "Select payment method", variant: "destructive" }); return; }
    if (selectedMethod !== "bank" && !phoneNumber) { toast({ title: "Enter phone number", variant: "destructive" }); return; }
    if (selectedMethod === "bank" && (!bankName || !accountNumber)) { toast({ title: "Enter bank details", variant: "destructive" }); return; }

    setProcessing(true);

    // Simulate payment processing
    await new Promise(r => setTimeout(r, 3000));

    setProcessing(false);
    setPaymentSuccess(true);
    toast({ title: "✅ Payment Successful!", description: `${selectedPlan?.name} plan activated via ${paymentMethods.find(m => m.id === selectedMethod)?.name}` });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Payments & Subscription</h1>
          <p className="text-muted-foreground">Choose a plan and pay via Mobile Money or Bank Transfer</p>
        </div>

        {/* Payment Methods Overview */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="font-display text-base font-bold text-card-foreground flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />Accepted Payment Methods
          </h3>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {paymentMethods.map((m) => (
              <div key={m.id} className={`flex items-center gap-2 rounded-lg border p-3 ${m.color}`}>
                <span className="text-xl">{m.icon}</span>
                <div>
                  <p className="text-xs font-medium">{m.name}</p>
                  <p className="text-[10px] opacity-70">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Subscription Plans */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subscriptionPlans.map((plan, i) => (
            <motion.div key={plan.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
              className={`rounded-xl border bg-card p-6 shadow-card relative ${plan.id === "pro" ? "border-primary ring-2 ring-primary/20" : "border-border"}`}>
              {plan.id === "pro" && (
                <Badge className="absolute -top-2.5 right-4 bg-primary text-primary-foreground">Popular</Badge>
              )}
              <div className="mb-4">
                <h3 className="font-display text-lg font-bold text-card-foreground">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-primary">{plan.price.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">{plan.currency}/{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant={plan.id === "pro" ? "default" : "outline"} onClick={() => handleSelectPlan(plan)}>
                <CreditCard className="mr-1.5 h-4 w-4" />Subscribe Now
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Transaction History Section */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="font-display text-base font-bold text-card-foreground flex items-center gap-2">
            <Banknote className="h-5 w-5 text-primary" />Payment Information
          </h3>
          <div className="mt-3 space-y-3">
            <div className="flex items-center gap-3 rounded-lg border border-border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted"><Building2 className="h-5 w-5 text-muted-foreground" /></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-card-foreground">Bank Transfer Details</p>
                <p className="text-xs text-muted-foreground">Bank of Kigali · Account: 100-XXXX-XXXX · Moses AMS Company</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted"><Smartphone className="h-5 w-5 text-muted-foreground" /></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-card-foreground">Mobile Money</p>
                <p className="text-xs text-muted-foreground">MTN: *182*8*1# · Airtel: *185*9*1# · Tigo: *150*7*1#</p>
              </div>
            </div>
            <div className="rounded-lg bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">💡 For enterprise plans or custom billing, contact Moses AMS Company support team.</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ===== PAYMENT DIALOG ===== */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" /> Pay for {selectedPlan?.name} Plan</DialogTitle>
            <DialogDescription>
              Amount: {selectedPlan?.price.toLocaleString()} {selectedPlan?.currency}/{selectedPlan?.period}
            </DialogDescription>
          </DialogHeader>

          {paymentSuccess ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6 space-y-4">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
                <CheckCircle2 className="h-10 w-10 text-success" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-card-foreground">Payment Successful!</h3>
                <p className="text-sm text-muted-foreground mt-1">{selectedPlan?.name} plan activated. Enjoy all features!</p>
              </div>
              <Button onClick={() => setPaymentOpen(false)}>Done</Button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {/* Payment Method Selection */}
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="grid grid-cols-2 gap-2">
                  {paymentMethods.map((m) => (
                    <button key={m.id} onClick={() => setSelectedMethod(m.id)}
                      className={`flex items-center gap-2 rounded-lg border-2 p-3 text-left transition-all ${
                        selectedMethod === m.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}>
                      <span className="text-lg">{m.icon}</span>
                      <div>
                        <p className="text-xs font-medium text-card-foreground">{m.name}</p>
                        {m.prefix && <p className="text-[10px] text-muted-foreground">{m.prefix}xxxxxxx</p>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone Number for Mobile Money */}
              {selectedMethod && selectedMethod !== "bank" && (
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input placeholder={`${paymentMethods.find(m => m.id === selectedMethod)?.prefix || "07"}xxxxxxxx`}
                    value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                </div>
              )}

              {/* Bank Details */}
              {selectedMethod === "bank" && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Bank Name</Label>
                    <Select value={bankName} onValueChange={setBankName}>
                      <SelectTrigger><SelectValue placeholder="Select bank" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bk">Bank of Kigali (BK)</SelectItem>
                        <SelectItem value="equity">Equity Bank</SelectItem>
                        <SelectItem value="im">I&M Bank</SelectItem>
                        <SelectItem value="bnr">BNR</SelectItem>
                        <SelectItem value="cogebanque">Cogebanque</SelectItem>
                        <SelectItem value="access">Access Bank</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Account Number</Label>
                    <Input placeholder="Enter account number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
                  </div>
                </div>
              )}

              {/* Summary */}
              {selectedMethod && (
                <div className="rounded-lg bg-muted/30 p-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Plan</span>
                    <span className="font-medium text-card-foreground">{selectedPlan?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-bold text-primary">{selectedPlan?.price.toLocaleString()} {selectedPlan?.currency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Method</span>
                    <span className="text-card-foreground">{paymentMethods.find(m => m.id === selectedMethod)?.name}</span>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button className="w-full" onClick={handlePayment} disabled={processing || !selectedMethod}>
                  {processing ? (
                    <><div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2" />Processing...</>
                  ) : (
                    <><ArrowUpRight className="mr-1.5 h-4 w-4" />Pay {selectedPlan?.price.toLocaleString()} {selectedPlan?.currency}</>
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Payments;

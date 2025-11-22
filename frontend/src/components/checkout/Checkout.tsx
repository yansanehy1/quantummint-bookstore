import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, AlertCircle, CheckCircle2, CreditCard, Smartphone, DollarSign } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

interface CheckoutStep {
  id: number;
  title: string;
  completed: boolean;
}

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "SLL">("USD");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("card");
  const [billingInfo, setBillingInfo] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    country: "Sierra Leone",
    zipCode: "",
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Mock book data - in real app, this would come from URL params or route state
  const mockBook = {
    id: 0,
    title: "Language Arts - JSS 1, Term 1",
    author: "Sierra Books Admin",
    priceUSD: 4.99,
    priceSLL: 82000,
    description: "Comprehensive English Language Arts course",
  };

  const steps: CheckoutStep[] = [
    { id: 1, title: "Order Review", completed: currentStep > 1 },
    { id: 2, title: "Billing Info", completed: currentStep > 2 },
    { id: 3, title: "Payment Method", completed: currentStep > 3 },
    { id: 4, title: "Confirmation", completed: false },
  ];

  const price = selectedCurrency === "USD" ? mockBook.priceUSD : mockBook.priceSLL;
  const currencySymbol = selectedCurrency === "USD" ? "$" : "Le ";

  const handleBillingChange = (field: string, value: string) => {
    setBillingInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError("");
  };

  const validateBillingInfo = () => {
    if (!billingInfo.fullName.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!billingInfo.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!billingInfo.phone.trim()) {
      setError("Phone number is required");
      return false;
    }
    if (!billingInfo.address.trim()) {
      setError("Address is required");
      return false;
    }
    if (!billingInfo.city.trim()) {
      setError("City is required");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      if (!validateBillingInfo()) {
        return;
      }
      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      if (!selectedPaymentMethod) {
        setError("Please select a payment method");
        return;
      }
      setCurrentStep(4);
      processPayment();
      return;
    }
  };

  const processPayment = async () => {
    setLoading(true);
    setError("");

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate order ID
      const newOrderId = `ORD-${Date.now()}`;
      setOrderId(newOrderId);
      setOrderPlaced(true);

      // In real app, would call tRPC mutation to create purchase
      // await trpc.purchases.create.useMutation({
      //   bookId: mockBook.id,
      //   amount: price,
      //   currency: selectedCurrency,
      //   paymentMethod: selectedPaymentMethod,
      //   billingInfo,
      // });
    } catch (err) {
      setError("Payment processing failed. Please try again.");
      setCurrentStep(3);
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 px-4" role="main" aria-labelledby="orderConfirmationTitle">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" role="img" aria-label="Order success check mark" />
            <h1 id="orderConfirmationTitle" className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">Thank you for your purchase</p>
          </div>

          <Card className="p-8 mb-6 border-2 border-green-200 bg-green-50" role="region" aria-label="Order summary">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600" id="orderIdLabel">Order ID</p>
                <p className="text-lg font-bold text-gray-900" aria-labelledby="orderIdLabel">{orderId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600" id="orderDateLabel">Order Date</p>
                <p className="text-lg font-bold text-gray-900" aria-labelledby="orderDateLabel">{new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="border-t border-green-200 pt-6">
              <h3 className="font-bold text-gray-900 mb-4">Order Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">{mockBook.title}</span>
                  <span className="font-bold text-gray-900" aria-label={`Price: ${currencySymbol}${price.toFixed(2)}`}>
                    {currencySymbol}
                    {price.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-green-200 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-lg text-green-600" aria-label={`Total amount: ${currencySymbol}${price.toFixed(2)}`}>
                    {currencySymbol}
                    {price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Next Steps:</strong> Your book has been added to your library. You can start reading immediately by visiting your Dashboard.
              </p>
            </div>
          </Card>

          <div className="flex gap-4" role="navigation" aria-label="Post-purchase navigation">
            <Button
              onClick={() => setLocation("/dashboard")}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
            >
              Go to Dashboard
            </Button>
            <Button
              onClick={() => setLocation("/library")}
              variant="outline"
              className="flex-1"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 px-4" role="main" aria-labelledby="checkoutTitle">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/library")}
            className="mb-4 text-gray-700 hover:text-orange-600"
            aria-label="Back to Library"
          >
            <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
            Back to Library
          </Button>
          <h1 id="checkoutTitle" className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <nav className="mb-8" aria-label="Checkout progress" role="navigation">
          <div className="flex justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    currentStep >= step.id
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                  aria-current={currentStep === step.id ? "step" : undefined}
                  aria-label={`Step ${step.id}: ${step.title} ${step.completed ? "completed" : currentStep === step.id ? "current" : ""}`}
                >
                  {step.completed ? "✓" : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      currentStep > step.id ? "bg-orange-500" : "bg-gray-200"
                    }`}
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            {steps.map((step) => (
              <span key={step.id} className="flex-1">
                {step.title}
              </span>
            ))}
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Order Review */}
            {currentStep === 1 && (
              <Card className="p-6 mb-6" role="region" aria-labelledby="orderReviewTitle">
                <h2 id="orderReviewTitle" className="text-xl font-bold text-gray-900 mb-6">Order Review</h2>
                <div className="space-y-4">
                  <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-4xl" role="img" aria-label="Book emoji">📖</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{mockBook.title}</h3>
                      <p className="text-sm text-gray-600">by {mockBook.author}</p>
                      <p className="text-sm text-gray-600 mt-2">{mockBook.description}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 id="currencySelectionTitle" className="font-bold text-gray-900 mb-3">Select Currency</h3>
                    <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-labelledby="currencySelectionTitle">
                      <button
                        onClick={() => setSelectedCurrency("USD")}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedCurrency === "USD"
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 bg-white hover:border-orange-300"
                        }`}
                        role="radio"
                        aria-checked={selectedCurrency === "USD"}
                      >
                        <DollarSign className="w-5 h-5 mx-auto mb-1 text-orange-500" aria-hidden="true" />
                        <div className="font-bold text-gray-900">${mockBook.priceUSD}</div>
                        <div className="text-xs text-gray-600">USD</div>
                      </button>
                      <button
                        onClick={() => setSelectedCurrency("SLL")}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedCurrency === "SLL"
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 bg-white hover:border-orange-300"
                        }`}
                        role="radio"
                        aria-checked={selectedCurrency === "SLL"}
                      >
                        <DollarSign className="w-5 h-5 mx-auto mb-1 text-orange-500" aria-hidden="true" />
                        <div className="font-bold text-gray-900">Le {mockBook.priceSLL}</div>
                        <div className="text-xs text-gray-600">SLL</div>
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Step 2: Billing Information */}
            {currentStep === 2 && (
              <Card className="p-6 mb-6" role="region" aria-labelledby="billingInfoTitle">
                <h2 id="billingInfoTitle" className="text-xl font-bold text-gray-900 mb-6">Billing Information</h2>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handlePlaceOrder(); }}>
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <Input
                      id="fullName"
                      value={billingInfo.fullName}
                      onChange={(e) => handleBillingChange("fullName", e.target.value)}
                      placeholder="John Doe"
                      className="w-full"
                      required
                      aria-required="true"
                      aria-invalid={error && !billingInfo.fullName.trim() ? "true" : "false"}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={billingInfo.email}
                        onChange={(e) => handleBillingChange("email", e.target.value)}
                        placeholder="john@example.com"
                        required
                        aria-required="true"
                        aria-invalid={error && !billingInfo.email.trim() ? "true" : "false"}
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone *
                      </label>
                      <Input
                        id="phone"
                        value={billingInfo.phone}
                        onChange={(e) => handleBillingChange("phone", e.target.value)}
                        placeholder="+232 76 123 456"
                        required
                        aria-required="true"
                        aria-invalid={error && !billingInfo.phone.trim() ? "true" : "false"}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <Input
                      id="address"
                      value={billingInfo.address}
                      onChange={(e) => handleBillingChange("address", e.target.value)}
                      placeholder="123 Main Street"
                      required
                      aria-required="true"
                      aria-invalid={error && !billingInfo.address.trim() ? "true" : "false"}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <Input
                        id="city"
                        value={billingInfo.city}
                        onChange={(e) => handleBillingChange("city", e.target.value)}
                        placeholder="Freetown"
                        required
                        aria-required="true"
                        aria-invalid={error && !billingInfo.city.trim() ? "true" : "false"}
                      />
                    </div>
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Zip Code
                      </label>
                      <Input
                        id="zipCode"
                        value={billingInfo.zipCode}
                        onChange={(e) => handleBillingChange("zipCode", e.target.value)}
                        placeholder="00000"
                        aria-required="false"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <Input
                      id="country"
                      value={billingInfo.country}
                      onChange={(e) => handleBillingChange("country", e.target.value)}
                      placeholder="Sierra Leone"
                      aria-required="false"
                    />
                  </div>
                </form>
              </Card>
            )}

            {/* Step 3: Payment Method */}
            {currentStep === 3 && (
              <Card className="p-6 mb-6" role="region" aria-labelledby="paymentMethodTitle">
                <h2 id="paymentMethodTitle" className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
                <div className="space-y-3" role="radiogroup" aria-label="Payment methods">
                  {/* Card Payment */}
                  <button
                    onClick={() => setSelectedPaymentMethod("card")}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedPaymentMethod === "card"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 bg-white hover:border-orange-300"
                    }`}
                    role="radio"
                    aria-checked={selectedPaymentMethod === "card"}
                    aria-label="Credit or Debit Card payment"
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard
                        className={`w-5 h-5 ${
                          selectedPaymentMethod === "card"
                            ? "text-orange-500"
                            : "text-gray-400"
                        }`}
                        aria-hidden="true"
                      />
                      <div>
                        <div className="font-bold text-gray-900">Credit/Debit Card</div>
                        <div className="text-xs text-gray-600">Visa, Mastercard, American Express</div>
                      </div>
                    </div>
                  </button>

                  {/* Mobile Money - Orange */}
                  <button
                    onClick={() => setSelectedPaymentMethod("orange")}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedPaymentMethod === "orange"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 bg-white hover:border-orange-300"
                    }`}
                    role="radio"
                    aria-checked={selectedPaymentMethod === "orange"}
                    aria-label="Orange Money mobile payment"
                  >
                    <div className="flex items-center gap-3">
                      <Smartphone
                        className={`w-5 h-5 ${
                          selectedPaymentMethod === "orange"
                            ? "text-orange-500"
                            : "text-gray-400"
                        }`}
                        aria-hidden="true"
                      />
                      <div>
                        <div className="font-bold text-gray-900">Orange Money</div>
                        <div className="text-xs text-gray-600">Mobile money payment</div>
                      </div>
                    </div>
                  </button>

                  {/* Mobile Money - Afrimoney */}
                  <button
                    onClick={() => setSelectedPaymentMethod("afrimoney")}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedPaymentMethod === "afrimoney"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 bg-white hover:border-orange-300"
                    }`}
                    role="radio"
                    aria-checked={selectedPaymentMethod === "afrimoney"}
                    aria-label="Afrimoney mobile payment"
                  >
                    <div className="flex items-center gap-3">
                      <Smartphone
                        className={`w-5 h-5 ${
                          selectedPaymentMethod === "afrimoney"
                            ? "text-orange-500"
                            : "text-gray-400"
                        }`}
                        aria-hidden="true"
                      />
                      <div>
                        <div className="font-bold text-gray-900">Afrimoney</div>
                        <div className="text-xs text-gray-600">Mobile money payment</div>
                      </div>
                    </div>
                  </button>

                  {/* Mobile Money - Qmoney */}
                  <button
                    onClick={() => setSelectedPaymentMethod("qmoney")}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedPaymentMethod === "qmoney"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 bg-white hover:border-orange-300"
                    }`}
                    role="radio"
                    aria-checked={selectedPaymentMethod === "qmoney"}
                    aria-label="Qmoney mobile payment"
                  >
                    <div className="flex items-center gap-3">
                      <Smartphone
                        className={`w-5 h-5 ${
                          selectedPaymentMethod === "qmoney"
                            ? "text-orange-500"
                            : "text-gray-400"
                        }`}
                        aria-hidden="true"
                      />
                      <div>
                        <div className="font-bold text-gray-900">Qmoney</div>
                        <div className="text-xs text-gray-600">Mobile money payment</div>
                      </div>
                    </div>
                  </button>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Note:</strong> Payment processing is currently in demo mode. In production, you will be redirected to the payment provider's secure portal.
                  </p>
                </div>
              </Card>
            )}

            {/* Error Message */}
            {error && (
              <div 
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3"
                role="alert"
                aria-live="polite"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm text-red-900">{error}</p>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <aside className="lg:col-span-1" aria-labelledby="orderSummaryTitle">
            <Card className="p-6 sticky top-4 bg-white border-2 border-orange-200">
              <h3 id="orderSummaryTitle" className="font-bold text-gray-900 mb-4">Order Summary</h3>

              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold text-gray-900" aria-label={`Subtotal: ${currencySymbol}${price.toFixed(2)}`}>
                    {currencySymbol}
                    {price.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (0%)</span>
                  <span className="font-bold text-gray-900" aria-label="Tax: 0">
                    {currencySymbol}
                    {(0).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-orange-600" aria-label={`Total: ${currencySymbol}${price.toFixed(2)}`}>
                  {currencySymbol}
                  {price.toFixed(2)}
                </span>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3"
                aria-busy={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin" aria-hidden="true">⏳</span>
                    Processing...
                  </span>
                ) : currentStep === 1 ? (
                  "Continue to Billing"
                ) : currentStep === 2 ? (
                  "Continue to Payment"
                ) : currentStep === 3 ? (
                  "Place Order"
                ) : (
                  "Complete Purchase"
                )}
              </Button>

              {currentStep > 1 && (
                <Button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  variant="outline"
                  className="w-full mt-2"
                  aria-label={`Go back to ${steps[currentStep - 2].title}`}
                >
                  Back
                </Button>
              )}

              <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg" role="note">
                <p className="text-xs text-green-900">
                  <strong>✓ Secure Checkout</strong>
                  <br />
                  Your payment information is encrypted and secure.
                </p>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import { ArrowLeft, AlertCircle, CheckCircle2, CreditCard, Smartphone, DollarSign, Loader2 } from "lucide-react";

interface CheckoutStep {
  id: number;
  title: string;
  completed: boolean;
}

// Mock components to satisfy the imports for a single-file environment
const MockButton = ({ children, onClick, disabled = false, variant = 'default', className = '' }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 font-semibold rounded-lg transition-colors duration-200 shadow-sm flex items-center justify-center ${variant === 'outline' ? 'border border-gray-300 text-gray-700 hover:bg-gray-100' :
      variant === 'ghost' ? 'text-gray-600 hover:bg-gray-100' :
        'bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed'
      } ${className}`}
  >
    {children}
  </button>
);

const MockCard = ({ children, className = '' }: any) => (
  <div className={`bg-white rounded-xl shadow-lg ${className}`}>
    {children}
  </div>
);

const MockInput = ({ value, onChange, placeholder, type = 'text', className = '', required, disabled }: any) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    disabled={disabled}
    className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-150 outline-none ${disabled ? 'bg-gray-100 text-gray-500' : ''} ${className}`}
  />
);

export default function Checkout() {
  // Replace imported components with mock versions
  const Button = MockButton;
  const Card = MockCard;
  const Input = MockInput;

  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "SLL">("SLL"); // Default to SLL
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("afrimoney"); // Default to local mobile money

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

  useEffect(() => {
    document.title = 'Checkout - Quantummint Bookstore';
  }, []);


  const mockBook = {
    id: 0,
    title: "Language Arts - JSS 1, Term 1",
    author: "Sierra Books Admin",
    priceUSD: 4.99,
    priceSLL: 82000,
    description: "Comprehensive English Language Arts course, tailored for the Sierra Leone Junior Secondary School curriculum.",
  };

  const steps: CheckoutStep[] = [
    { id: 1, title: "Review", completed: currentStep > 1 },
    { id: 2, title: "Billing", completed: currentStep > 2 },
    { id: 3, title: "Payment", completed: currentStep > 3 },
    { id: 4, title: "Confirm", completed: false },
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
    // Added minimal address validation for better UX

    if (!billingInfo.address.trim() || !billingInfo.city.trim()) {
      setError("Address and City are required");
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
      // Move to step 4 (Processing) before calling payment function

      setCurrentStep(4);
      processPayment();
      return;
    }
    // Step 4 is for display only (loading/success)

  };

  const processPayment = async () => {
    setLoading(true);
    setError("");
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2500));

      const newOrderId = `SLBOOKS-${Math.floor(Math.random() * 900000 + 100000)}`;
      setOrderId(newOrderId);
      setOrderPlaced(true);
      // In a real app: call mutation here
    } catch (err) {
      setError("Payment processing failed. Please try again.");
      setCurrentStep(3); // Go back to payment selection

    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 py-12 px-4 font-sans overflow-auto">

        <div className="max-w-2xl mx-auto">
          <Card className="p-10 border-4 border-green-100 bg-white shadow-2xl">
            <div className="text-center mb-8">
              <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Success!</h1>
              <p className="text-lg text-gray-600">Your order has been successfully confirmed.</p>
            </div>


            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Order ID" value={orderId} highlight={true} />
                <DetailItem label="Order Date" value={new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })} />
              </div>
              <DetailItem label="Payment Method" value={selectedPaymentMethod.charAt(0).toUpperCase() + selectedPaymentMethod.slice(1)} />

              <div className="mt-8">
                <h3 className="font-bold text-xl text-gray-800 mb-3">Item Purchased</h3>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">{mockBook.title}</span>
                  <span className="font-bold text-gray-900 text-lg">{currencySymbol}{price.toFixed(selectedCurrency === "USD" ? 2 : 0)}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6 flex justify-between items-center">
              <span className="font-extrabold text-2xl text-gray-900">Total Charged</span>
              <span className="font-extrabold text-3xl text-green-600">{currencySymbol}{price.toFixed(selectedCurrency === "USD" ? 2 : 0)}</span>
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <p className="text-sm text-blue-900 font-medium">
                <strong>Next Steps:</strong> The book is now available in your digital library. Go check it out!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button onClick={() => navigate("/seller/dashboard")} className="flex-1 text-lg py-3 bg-orange-600 hover:bg-orange-700">Go to Dashboard</Button>
              <Button onClick={() => navigate("/library")} variant="outline" className="flex-1 text-lg py-3 border-gray-300 text-gray-700 hover:bg-gray-100">Continue Shopping</Button>

            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 py-12 px-4 font-sans overflow-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate("/library")} className="mb-4 text-gray-600 hover:text-orange-600 p-2">

            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Library
          </Button>
          <h1 className="text-4xl font-bold text-gray-900">Secure Checkout</h1>
          <p className="text-gray-500 mt-1">Complete your purchase in 4 easy steps.</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-10 flex justify-between px-4">
          {steps.map((step, index) => (
            <StepIndicator key={step.id} step={step} currentStep={currentStep} index={index} stepsLength={steps.length} />
          ))}
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content (Steps) */}
          <div className="lg:col-span-2">

            {/* Step 1: Order Review */}

            {currentStep === 1 && (
              <Card className="p-8 shadow-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">1. Review Your Order</h2>
                <div className="space-y-6">
                  {/* Item Details */}

                  <div className="flex flex-col sm:flex-row gap-4 p-5 bg-orange-50 rounded-xl border border-orange-200">
                    <div className="text-4xl flex items-center justify-center w-16 h-16 bg-white rounded-lg shadow-inner">📖</div>
                    <div className="flex-1">
                      <h3 className="font-extrabold text-xl text-gray-900">{mockBook.title}</h3>
                      <p className="text-sm text-gray-600">by {mockBook.author}</p>
                      <p className="text-sm text-gray-700 mt-2 italic">{mockBook.description}</p>
                    </div>
                  </div>

                  {/* Currency Selector */}
                  <div className="pt-4 border-t">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">Select Currency</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <CurrencyButton
                        currency="USD"
                        price={mockBook.priceUSD}
                        selected={selectedCurrency === "USD"}
                        onClick={() => setSelectedCurrency("USD")}
                      />
                      <CurrencyButton
                        currency="SLL"
                        price={mockBook.priceSLL}
                        selected={selectedCurrency === "SLL"}

                        onClick={() => setSelectedCurrency("SLL")}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Step 2: Billing Information */}

            {currentStep === 2 && (
              <Card className="p-8 shadow-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">2. Billing & Contact Information</h2>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormGroup label="Full Name" field="fullName" value={billingInfo.fullName} onChange={handleBillingChange} placeholder="Adama Sesay" required={true} />
                    <FormGroup label="Email Address" field="email" type="email" value={billingInfo.email} onChange={handleBillingChange} placeholder="adama.sesay@example.com" required={true} />
                  </div>
                  <FormGroup label="Phone Number" field="phone" value={billingInfo.phone} onChange={handleBillingChange} placeholder="+232 76 123 456" required={true} />
                  <FormGroup label="Street Address" field="address" value={billingInfo.address} onChange={handleBillingChange} placeholder="123 Main Road" required={true} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormGroup label="City" field="city" value={billingInfo.city} onChange={handleBillingChange} placeholder="Freetown" required={true} />
                    <FormGroup label="Zip Code" field="zipCode" value={billingInfo.zipCode} onChange={handleBillingChange} placeholder="00000" required={false} />
                  </div>
                  <FormGroup label="Country" field="country" value={billingInfo.country} onChange={handleBillingChange} placeholder="Sierra Leone" required={false} disabled={true} />
                </div>
              </Card>
            )}

            {/* Step 3: Payment Method */}

            {currentStep === 3 && (
              <Card className="p-8 shadow-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">3. Choose Payment Method</h2>
                <div className="space-y-4">
                  <PaymentMethodButton
                    method="Card"
                    icon={<CreditCard className="w-5 h-5" />}
                    description="Visa, Mastercard, Amex"
                    selected={selectedPaymentMethod === "card"}
                    onClick={() => setSelectedPaymentMethod("card")}
                  />
                  <PaymentMethodButton
                    method="Orange Money"
                    icon={<Smartphone className="w-5 h-5" />}
                    description="Local mobile money"
                    selected={selectedPaymentMethod === "orange"}
                    onClick={() => setSelectedPaymentMethod("orange")}
                  />
                  <PaymentMethodButton
                    method="Afrimoney"
                    icon={<Smartphone className="w-5 h-5" />}
                    description="Local mobile money"
                    selected={selectedPaymentMethod === "afrimoney"}
                    onClick={() => setSelectedPaymentMethod("afrimoney")}
                  />
                  <PaymentMethodButton
                    method="Qmoney"
                    icon={<Smartphone className="w-5 h-5" />}
                    description="Local mobile money"
                    selected={selectedPaymentMethod === "qmoney"}
                    onClick={() => setSelectedPaymentMethod("qmoney")}

                  />
                </div>
                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-sm text-blue-900">
                    <strong className="font-semibold">Note:</strong> Payment is currently in demo mode. The transaction will complete immediately upon clicking "Place Order".
                  </p>
                </div>
              </Card>
            )}

            {/* Step 4: Confirmation/Processing */}
            {currentStep === 4 && (
              <Card className="p-8 shadow-xl min-h-[250px] flex flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Processing Payment...</h2>
                {loading ? (
                  <>
                    <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
                    <p className="text-gray-600">Please wait while we secure your purchase.</p>
                  </>
                ) : error ? (
                  <>
                    <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
                    <p className="text-red-700 font-semibold">{error}</p>
                    <Button onClick={() => setCurrentStep(3)} className="mt-4 bg-gray-500 hover:bg-gray-600">Try Payment Again</Button>
                  </>
                ) : (
                  <p className="text-gray-600">Finalizing order details...</p>
                )}
              </Card>
            )}

            {/* Global Error Message */}

            {error && currentStep !== 4 && (
              <div className="mt-6 p-4 bg-red-50 border border-red-300 rounded-xl flex items-center gap-3 shadow-sm">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-900 font-medium">{error}</p>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8 bg-white border-2 border-orange-500 shadow-2xl">
              <h3 className="font-extrabold text-2xl text-gray-900 mb-4">Summary</h3>

              {/* Item Line */}

              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Item Price</span>
                  <span className="font-bold text-gray-900">{currencySymbol}{price.toFixed(selectedCurrency === "USD" ? 2 : 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax / VAT (0%)</span>
                  <span className="font-bold text-gray-900">{currencySymbol}{(0).toFixed(selectedCurrency === "USD" ? 2 : 0)}</span>
                </div>
              </div>

              {/* Total */}

              <div className="flex justify-between mb-6 items-center">
                <span className="font-extrabold text-xl text-gray-900">Order Total</span>
                <span className="text-3xl font-extrabold text-orange-600">{currencySymbol}{price.toFixed(selectedCurrency === "USD" ? 2 : 0)}</span>
              </div>

              {/* Actions */}
              <Button
                onClick={handlePlaceOrder}
                disabled={loading || currentStep === 4}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-lg py-3 shadow-lg hover:shadow-xl"
              >
                {loading ? (<span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />Processing...</span>) :
                  currentStep === 1 ? ("Proceed to Billing") :
                    currentStep === 2 ? ("Proceed to Payment") :
                      currentStep === 3 ? ("Place Order & Pay") :
                        ("Finalizing...")}
              </Button>

              {/* Back Button */}
              {currentStep > 1 && currentStep < 4 && (
                <Button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  variant="outline"

                  className="w-full mt-3 border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Go Back to Step {currentStep - 1}
                </Button>
              )}

              {/* Security Message */}

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                <p className="text-xs text-green-900 font-semibold">
                  ✓ 100% Secure Checkout<br />Your information is safe and encrypted.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

const StepIndicator: React.FC<{ step: CheckoutStep, currentStep: number, index: number, stepsLength: number }> = ({ step, currentStep, index, stepsLength }) => {
  const isActive = currentStep === step.id;
  const isCompleted = currentStep > step.id;

  return (
    <div className="flex flex-col items-center flex-1 relative z-10">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ring-4 ring-offset-2 
                ${isCompleted ? "bg-green-500 text-white ring-green-200" :
          isActive ? "bg-orange-600 text-white ring-orange-300 shadow-lg" :
            "bg-white text-gray-500 ring-gray-100 border border-gray-300"
        }`}
      >
        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.id}
      </div>
      <span className={`mt-2 text-sm text-center transition-colors duration-300 hidden sm:block
                ${isActive ? "text-gray-900 font-semibold" :
          isCompleted ? "text-green-600 font-medium" :
            "text-gray-500"
        }`}>
        {step.title}
      </span>
      {index < stepsLength - 1 && (
        <div className={`absolute top-5 left-1/2 w-full h-1 -translate-y-1/2 transition-all duration-500 -z-10 
                    ${isCompleted ? "bg-green-500" : isActive || currentStep === step.id + 1 ? "bg-orange-300" : "bg-gray-200"}`}
          style={{ transform: 'translateX(-50%)', width: '100%', left: 'calc(50% + 50%)' }}
        />
      )}
    </div>
  );
};

// --- Helper Components for improved structure and readability ---

// Helper for detail items on success page
const DetailItem = ({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`text-lg ${highlight ? "font-extrabold text-orange-600" : "font-semibold text-gray-800"}`}>{value}</p>
  </div>
);

// Helper for currency selection buttons
const CurrencyButton = ({ currency, price, selected, onClick }: { currency: "USD" | "SLL", price: number, selected: boolean, onClick: () => void }) => {
  const symbol = currency === "USD" ? "$" : "Le ";
  const displayPrice = price.toFixed(currency === "USD" ? 2 : 0);

  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border-2 transition-all duration-300 text-center shadow-sm 
                ${selected ? "border-orange-600 bg-orange-50 shadow-md ring-4 ring-orange-100" : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-md"}`}
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <DollarSign className={`w-5 h-5 ${selected ? "text-orange-600" : "text-gray-500"}`} />
        <span className={`text-xl font-bold ${selected ? "text-orange-600" : "text-gray-900"}`}>{displayPrice}</span>
      </div>
      <div className="text-sm font-semibold text-gray-600">{currency}</div>
    </button>
  );
};

// Helper for payment method selection buttons
const PaymentMethodButton = ({ method, icon, description, selected, onClick }: { method: string, icon: React.ReactNode, description: string, selected: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left shadow-sm 
            ${selected ? "border-orange-600 bg-orange-50 shadow-md ring-4 ring-orange-100" : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-md"}`}
  >
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 
                ${selected ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-500"}`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="font-extrabold text-base text-gray-900">{method}</div>
        <div className="text-xs text-gray-600">{description}</div>
      </div>
      {selected && <CheckCircle2 className="w-5 h-5 text-orange-600" />}
    </div>
  </button>
);

// Helper for form groups
const FormGroup = ({ label, field, value, onChange, placeholder, type = 'text', required, disabled = false }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <MockInput
      type={type}
      value={value}
      onChange={(e: any) => onChange(field, e.target.value)}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
    />
  </div>
);


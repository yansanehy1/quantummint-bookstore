import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Upload,
  Eye,
  EyeOff,
} from "lucide-react";
import { useLocation } from "wouter";

interface RegistrationStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface SellerFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;

  // Business Information
  businessName: string;
  businessType: string;
  businessDescription: string;
  businessWebsite: string;

  // Bank Information
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: string;

  // Tax Information
  taxId: string;
  taxDocumentUrl: string;

  // Agreement
  agreedToTerms: boolean;
  agreedToPrivacy: boolean;
}

export default function SellerRegistration() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SellerFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    businessName: "",
    businessType: "",
    businessDescription: "",
    businessWebsite: "",
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    routingNumber: "",
    accountType: "checking",
    taxId: "",
    taxDocumentUrl: "",
    agreedToTerms: false,
    agreedToPrivacy: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps: RegistrationStep[] = [
    {
      id: 1,
      title: "Personal Information",
      description: "Your basic details",
      completed: false,
    },
    {
      id: 2,
      title: "Business Profile",
      description: "About your business",
      completed: false,
    },
    {
      id: 3,
      title: "Payment Method",
      description: "Bank account details",
      completed: false,
    },
    {
      id: 4,
      title: "Tax Information",
      description: "Tax ID and documents",
      completed: false,
    },
    {
      id: 5,
      title: "Review & Confirm",
      description: "Verify your information",
      completed: false,
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.firstName.trim())
          newErrors.firstName = "First name is required";
        if (!formData.lastName.trim())
          newErrors.lastName = "Last name is required";
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
          newErrors.email = "Valid email is required";
        if (!formData.phone.match(/^\d{10,}$/))
          newErrors.phone = "Valid phone number is required";
        if (!formData.country.trim())
          newErrors.country = "Country is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        break;

      case 2:
        if (!formData.businessName.trim())
          newErrors.businessName = "Business name is required";
        if (!formData.businessType)
          newErrors.businessType = "Business type is required";
        if (!formData.businessDescription.trim())
          newErrors.businessDescription = "Business description is required";
        break;

      case 3:
        if (!formData.bankName.trim())
          newErrors.bankName = "Bank name is required";
        if (!formData.accountHolderName.trim())
          newErrors.accountHolderName = "Account holder name is required";
        if (!formData.accountNumber.match(/^\d{8,}$/))
          newErrors.accountNumber = "Valid account number is required";
        if (!formData.routingNumber.match(/^\d{8,}$/))
          newErrors.routingNumber = "Valid routing number is required";
        break;

      case 4:
        if (!formData.taxId.trim())
          newErrors.taxId = "Tax ID is required";
        if (!formData.taxDocumentUrl)
          newErrors.taxDocumentUrl = "Tax document is required";
        break;

      case 5:
        if (!formData.agreedToTerms)
          newErrors.agreedToTerms = "You must agree to the terms";
        if (!formData.agreedToPrivacy)
          newErrors.agreedToPrivacy = "You must agree to the privacy policy";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert("Registration successful! Welcome to Sierra Books seller program.");
      setLocation("/seller-dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate file upload
      setFormData((prev) => ({
        ...prev,
        taxDocumentUrl: `${file.name} (uploaded)`,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setLocation("/")}
          >
            <BookOpen className="w-8 h-8 text-amber-600" />
            <h1 className="text-2xl font-bold text-gray-900">Sierra Books</h1>
          </div>
          <nav className="flex gap-4 items-center">
            <button
              onClick={() => setLocation("/")}
              className="text-gray-700 hover:text-amber-600 font-medium"
            >
              Home
            </button>
            <button
              onClick={() => setLocation("/dashboard")}
              className="text-gray-700 hover:text-amber-600 font-medium"
            >
              Dashboard
            </button>
          </nav>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-12">
        {/* Header Section */}
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Become a Seller
          </h1>
          <p className="text-xl text-gray-600">
            Join thousands of educators sharing knowledge and earning income on
            Sierra Books.
          </p>
        </section>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {/* Steps Sidebar */}
          <div className="md:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-6">Registration Steps</h3>
              <div className="space-y-4">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={`p-3 rounded-lg cursor-pointer transition ${
                      currentStep === step.id
                        ? "bg-amber-100 border-2 border-amber-600"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          currentStep >= step.id
                            ? "bg-green-600 text-white"
                            : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {currentStep > step.id ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          step.id
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">
                          {step.title}
                        </p>
                        <p className="text-xs text-gray-600">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Form Content */}
          <div className="md:col-span-3">
            <Card className="p-8">
              <form onSubmit={handleSubmit}>
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Personal Information
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          First Name *
                        </label>
                        <Input
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="John"
                          className="h-10"
                        />
                        {errors.firstName && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.firstName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <Input
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Doe"
                          className="h-10"
                        />
                        {errors.lastName && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="h-10"
                      />
                      {errors.email && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1234567890"
                        className="h-10"
                      />
                      {errors.phone && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Country *
                        </label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="">Select Country</option>
                          <option value="Sierra Leone">Sierra Leone</option>
                          <option value="Guinea">Guinea</option>
                          <option value="Liberia">Liberia</option>
                          <option value="Mali">Mali</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.country && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.country}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          City *
                        </label>
                        <Input
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="Freetown"
                          className="h-10"
                        />
                        {errors.city && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.city}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Business Profile */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Business Profile
                    </h2>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Business Name *
                      </label>
                      <Input
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        placeholder="My Educational Content"
                        className="h-10"
                      />
                      {errors.businessName && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.businessName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Business Type *
                      </label>
                      <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="">Select Business Type</option>
                        <option value="individual">Individual Creator</option>
                        <option value="educator">Educator/Teacher</option>
                        <option value="publisher">Publisher</option>
                        <option value="organization">Educational Organization</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.businessType && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.businessType}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Business Description *
                      </label>
                      <textarea
                        name="businessDescription"
                        value={formData.businessDescription}
                        onChange={handleInputChange}
                        placeholder="Tell us about your educational content and expertise..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg h-32"
                      />
                      {errors.businessDescription && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.businessDescription}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Business Website (Optional)
                      </label>
                      <Input
                        name="businessWebsite"
                        value={formData.businessWebsite}
                        onChange={handleInputChange}
                        placeholder="https://example.com"
                        className="h-10"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Payment Method */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Payment Method
                    </h2>

                    <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded mb-6">
                      <p className="text-sm text-gray-700">
                        <strong>Secure Payment:</strong> Your bank details are
                        encrypted and securely stored. We never share your
                        information with third parties.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Bank Name *
                      </label>
                      <Input
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleInputChange}
                        placeholder="Your Bank Name"
                        className="h-10"
                      />
                      {errors.bankName && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.bankName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Account Holder Name *
                      </label>
                      <Input
                        name="accountHolderName"
                        value={formData.accountHolderName}
                        onChange={handleInputChange}
                        placeholder="Full Name"
                        className="h-10"
                      />
                      {errors.accountHolderName && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.accountHolderName}
                        </p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Account Number *
                        </label>
                        <Input
                          name="accountNumber"
                          value={formData.accountNumber}
                          onChange={handleInputChange}
                          placeholder="Account Number"
                          className="h-10"
                        />
                        {errors.accountNumber && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.accountNumber}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Routing Number *
                        </label>
                        <Input
                          name="routingNumber"
                          value={formData.routingNumber}
                          onChange={handleInputChange}
                          placeholder="Routing Number"
                          className="h-10"
                        />
                        {errors.routingNumber && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.routingNumber}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Account Type *
                      </label>
                      <select
                        name="accountType"
                        value={formData.accountType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="checking">Checking</option>
                        <option value="savings">Savings</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 4: Tax Information */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Tax Information
                    </h2>

                    <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded mb-6">
                      <p className="text-sm text-gray-700">
                        <strong>Tax Compliance:</strong> We require tax
                        information to comply with local and international
                        regulations.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tax ID / NIN *
                      </label>
                      <Input
                        name="taxId"
                        value={formData.taxId}
                        onChange={handleInputChange}
                        placeholder="Your Tax ID"
                        className="h-10"
                      />
                      {errors.taxId && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.taxId}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tax Document *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            onChange={handleFileUpload}
                            accept=",.pdf,.jpg,.png"
                            className="hidden"
                          />
                          <p className="text-sm font-semibold text-gray-700 mb-1">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-600">
                            PDF, JPG, or PNG (Max 5MB)
                          </p>
                        </label>
                      </div>
                      {formData.taxDocumentUrl && (
                        <p className="text-green-600 text-sm mt-2">
                          ✓ {formData.taxDocumentUrl}
                        </p>
                      )}
                      {errors.taxDocumentUrl && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.taxDocumentUrl}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 5: Review & Confirm */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Review & Confirm
                    </h2>

                    <div className="space-y-4">
                      <Card className="p-4 bg-gray-50">
                        <h3 className="font-bold text-gray-900 mb-3">
                          Personal Information
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Name</p>
                            <p className="font-semibold text-gray-900">
                              {formData.firstName} {formData.lastName}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Email</p>
                            <p className="font-semibold text-gray-900">
                              {formData.email}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Phone</p>
                            <p className="font-semibold text-gray-900">
                              {formData.phone}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Location</p>
                            <p className="font-semibold text-gray-900">
                              {formData.city}, {formData.country}
                            </p>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4 bg-gray-50">
                        <h3 className="font-bold text-gray-900 mb-3">
                          Business Information
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="text-gray-600">Business Name</p>
                            <p className="font-semibold text-gray-900">
                              {formData.businessName}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Business Type</p>
                            <p className="font-semibold text-gray-900">
                              {formData.businessType}
                            </p>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4 bg-blue-50 border-2 border-blue-200">
                        <h3 className="font-bold text-gray-900 mb-4">
                          Agreements
                        </h3>
                        <div className="space-y-3">
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              name="agreedToTerms"
                              checked={formData.agreedToTerms}
                              onChange={handleInputChange}
                              className="mt-1"
                            />
                            <span className="text-sm text-gray-700">
                              I agree to the{" "}
                              <a href="#" className="text-blue-600 font-semibold">
                                Terms of Service
                              </a>{" "}
                              and{" "}
                              <a href="#" className="text-blue-600 font-semibold">
                                Seller Agreement
                              </a>
                              *
                            </span>
                          </label>
                          {errors.agreedToTerms && (
                            <p className="text-red-600 text-sm">
                              {errors.agreedToTerms}
                            </p>
                          )}

                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              name="agreedToPrivacy"
                              checked={formData.agreedToPrivacy}
                              onChange={handleInputChange}
                              className="mt-1"
                            />
                            <span className="text-sm text-gray-700">
                              I agree to the{" "}
                              <a href="#" className="text-blue-600 font-semibold">
                                Privacy Policy
                              </a>
                              *
                            </span>
                          </label>
                          {errors.agreedToPrivacy && (
                            <p className="text-red-600 text-sm">
                              {errors.agreedToPrivacy}
                            </p>
                          )}
                        </div>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 justify-between mt-8 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    variant="outline"
                  >
                    Previous
                  </Button>

                  {currentStep < 5 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-green-600 hover:bg-green-700 px-8"
                    >
                      {isSubmitting ? "Registering..." : "Complete Registration"}
                    </Button>
                  )}
                </div>
              </form>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

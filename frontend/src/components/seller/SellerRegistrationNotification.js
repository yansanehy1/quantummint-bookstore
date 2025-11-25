"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SellerRegistrationNotification;
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const button_1 = require("@/components/ui/button");
const wouter_1 = require("wouter");
function SellerRegistrationNotification({ completionPercentage, currentStep, onDismiss }) {
    const [, setLocation] = (0, wouter_1.useLocation)();
    const [isVisible, setIsVisible] = (0, react_1.useState)(true);
    if (!isVisible || completionPercentage === 100) {
        return null;
    }
    const handleContinue = () => {
        setLocation("/advanced-seller-registration");
    };
    return (<div className="fixed bottom-4 right-4 max-w-md z-40 animate-in slide-in-from-bottom-5">
      <div className="bg-white rounded-lg shadow-lg border border-amber-200">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <lucide_react_1.AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"/>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                Complete Your Seller Registration
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                You're {completionPercentage}% done! Finish step {currentStep} to unlock seller features.
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-300" style={{ width: `${completionPercentage}%` }}/>
              </div>
              <div className="flex gap-2">
                <button_1.Button onClick={handleContinue} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-sm h-8">
                  Continue
                  <lucide_react_1.ArrowRight className="w-3 h-3 ml-1"/>
                </button_1.Button>
                <button_1.Button onClick={() => { setIsVisible(false); onDismiss(); }} variant="outline" className="px-3 h-8">
                  <lucide_react_1.X className="w-4 h-4"/>
                </button_1.Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
}

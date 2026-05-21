
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { getSystemSettings, updateSystemSettings, resetPlatformData, subscribe } from '@/services/store';
import { AppSystemSettings } from '@/services/store';
import { toast } from 'sonner';
import { Save, Shield, CreditCard, Cpu, Globe, AlertTriangle, RefreshCw } from 'lucide-react';

export const SystemSettings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<AppSystemSettings>(getSystemSettings());

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setSettings(getSystemSettings());
    });
    return unsubscribe;
  }, []);

  const handleToggle = (key: keyof AppSystemSettings) => {
    // @ts-ignore - dynamic key access
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePaymentToggle = (key: keyof AppSystemSettings['paymentProviders']) => {
    setSettings(prev => ({
      ...prev,
      paymentProviders: {
        ...prev.paymentProviders,
        [key]: !prev.paymentProviders[key]
      }
    }));
  };

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      updateSystemSettings(settings);
      setIsLoading(false);
      toast.success("Settings saved successfully and applied to the store!");
    }, 800);
  };

  const handleReset = () => {
    if (window.confirm("WARNING: This will reset all books, users, and balances to default mock data. Are you sure?")) {
      resetPlatformData();
      toast.error("Platform data reset.");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">System Settings</h1>
          <p className="text-slate-500 mt-1">Configure global platform parameters and integrations.</p>
        </div>
        <Button onClick={handleSave} isLoading={isLoading} className="gap-2">
          <Save size={18} /> Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* General Settings */}
        <Card>
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="flex items-center gap-2">
              <Globe size={20} className="text-emerald-600" /> General Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Platform Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full border-slate-200 rounded-lg p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div>
                <div className="font-medium text-slate-900">Maintenance Mode</div>
                <div className="text-xs text-slate-500">Disable access for non-admins</div>
              </div>
              <Switch checked={settings.maintenanceMode} onChange={() => handleToggle('maintenanceMode')} />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div>
                <div className="font-medium text-slate-900">Allow New Registrations</div>
                <div className="text-xs text-slate-500">Public sign-up availability</div>
              </div>
              <Switch checked={settings.allowRegistrations} onChange={() => handleToggle('allowRegistrations')} />
            </div>
          </CardContent>
        </Card>

        {/* Financial Settings */}
        <Card>
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="flex items-center gap-2">
              <CreditCard size={20} className="text-blue-600" /> Financial & Payments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Withdrawal Fee (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={settings.withdrawalFeePercent}
                    onChange={(e) => setSettings({ ...settings, withdrawalFeePercent: parseFloat(e.target.value) })}
                    className="w-full border-slate-200 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500 pr-8"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 text-sm">%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Exchange Rate (1 USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-sm">Le</span>
                  <input
                    type="number"
                    value={settings.exchangeRateUsdSll}
                    onChange={(e) => setSettings({ ...settings, exchangeRateUsdSll: parseFloat(e.target.value) })}
                    className="w-full border-slate-200 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500 pl-8"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Active Payment Gateways</label>
              <div className="space-y-3">
                <PaymentSwitch label="Stripe (Cards)" checked={settings.paymentProviders.stripe} onChange={() => handlePaymentToggle('stripe')} />
                <PaymentSwitch label="Orange Money" checked={settings.paymentProviders.orange} onChange={() => handlePaymentToggle('orange')} />
                <PaymentSwitch label="Afrimoney" checked={settings.paymentProviders.afri} onChange={() => handlePaymentToggle('afri')} />
                <PaymentSwitch label="QMoney" checked={settings.paymentProviders.qmoney} onChange={() => handlePaymentToggle('qmoney')} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Configuration */}
        <Card>
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="flex items-center gap-2">
              <Cpu size={20} className="text-purple-600" /> AI Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-100">
              <div className="flex gap-3">
                <div className="p-2 bg-white rounded-lg text-purple-600 shadow-sm"><Cpu size={20} /></div>
                <div>
                  <div className="font-bold text-purple-900">Google Gemini API</div>
                  <div className="text-xs text-purple-700">Status: <span className="font-bold text-emerald-600">Connected</span></div>
                </div>
              </div>
              <Button size="sm" variant="outline" className="h-8 text-xs bg-white">Rotatation Key</Button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Default TTS Model</label>
              <select
                value={settings.defaultTtsModel}
                onChange={(e) => setSettings({ ...settings, defaultTtsModel: e.target.value })}
                className="w-full border-slate-200 rounded-lg p-2.5 text-sm focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="gemini-2.5-flash-preview-tts">Gemini 2.5 Flash TTS (Recommended)</option>
                <option value="standard-voice">Standard Voice</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div>
                <div className="font-medium text-slate-900">Enable AI Features</div>
                <div className="text-xs text-slate-500">Summaries, Covers, Chat, Vision</div>
              </div>
              <Switch checked={settings.enableAiFeatures} onChange={() => handleToggle('enableAiFeatures')} />
            </div>
          </CardContent>
        </Card>

        {/* Security / Danger Zone */}
        <Card className="border-red-100">
          <CardHeader className="border-b border-red-50 bg-red-50/30">
            <CardTitle className="flex items-center gap-2 text-red-700">
              <Shield size={20} /> Security & Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="p-4 border border-red-100 bg-red-50 rounded-lg flex items-start gap-4">
              <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-bold text-red-900 text-sm">System Reset</h4>
                <p className="text-xs text-red-700 mt-1 mb-3">
                  This will purge all mock data, reset user balances, and clear cached chapters. This action cannot be undone.
                </p>
                <Button variant="danger" size="sm" onClick={handleReset}>Reset Platform Data</Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Force Cache Clearing</span>
              <Button variant="outline" className="text-xs h-8 gap-2">
                <RefreshCw size={14} /> Clear Redis
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

// Helper Components
const Switch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    className={`w-11 h-6 flex items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${checked ? 'bg-emerald-600' : 'bg-slate-200'}`}
  >
    <span
      className={`inline-block w-4 h-4 transform bg-white rounded-full shadow transition-transform duration-200 ease-in-out ${checked ? 'translate-x-6' : 'translate-x-1'}`}
    />
  </button>
);

const PaymentSwitch = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-sm text-slate-700">{label}</span>
    <Switch checked={checked} onChange={onChange} />
  </div>
);





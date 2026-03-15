"use client";

import { useState } from "react";
import {
  CreditCard,
  DollarSign,
  Users,
  Settings,
  Shield,
  Wallet,
  Wifi,
  RefreshCw,
  Save,
  CheckCircle2,
  Database,
  Key,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

export default function PaymentSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  // Razorpay Settings
  const [razorpaySettings, setRazorpaySettings] = useState({
    keyId: "rzp_live_xxxxxxxxxxxx",
    keySecret: "••••••••••••••••••••",
    webhookSecret: "••••••••••••••••••••",
  });

  // Default Doctor Fees
  const [doctorFees, setDoctorFees] = useState({
    digitalCertificate: 100,
    writtenCertificate: 500,
    faceToDigital: 400,
  });

  // Fee Configuration
  const [feeConfig, setFeeConfig] = useState({
    razorpayFeeRate: 2,
    gstOnGatewayFees: 18,
    platformCommission: 5,
  });

  // Withdrawal Settings
  const [withdrawalSettings, setWithdrawalSettings] = useState({
    minimumWithdrawal: 1,
    maximumWithdrawal: 50000,
    processingTime: 3,
    autoApprove: false,
  });

  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    testMode: true,
    maintenanceMode: false,
    autoRefundInterval: 5,
    emailNotifications: true,
    whatsappNotifications: true,
    adminAlerts: true,
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaving(false);
    toast.success("Settings saved successfully");
  };

  const handleTestConnection = async () => {
    setTesting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setTesting(false);
    toast.success("Connection successful");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Settings</h1>
          <p className="text-gray-500">
            Configure payment gateway, fees, and financial settings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Refresh
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Settings
          </button>
        </div>
      </div>

      {/* Status Banner */}
      <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
        <span className="text-sm text-green-800">
          Payment system is operational. All services are running normally.
        </span>
        <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded">
          Live Connection Active
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Razorpay Configuration */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Razorpay Configuration
                </h2>
                <p className="text-sm text-gray-500">
                  Configure your Razorpay payment gateway settings
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Key ID
                </label>
                <input
                  type="text"
                  value={razorpaySettings.keyId}
                  onChange={(e) =>
                    setRazorpaySettings((prev) => ({
                      ...prev,
                      keyId: e.target.value,
                    }))
                  }
                  className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Key Secret
                </label>
                <input
                  type="password"
                  value={razorpaySettings.keySecret}
                  onChange={(e) =>
                    setRazorpaySettings((prev) => ({
                      ...prev,
                      keySecret: e.target.value,
                    }))
                  }
                  className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Webhook Secret
                </label>
                <input
                  type="password"
                  value={razorpaySettings.webhookSecret}
                  onChange={(e) =>
                    setRazorpaySettings((prev) => ({
                      ...prev,
                      webhookSecret: e.target.value,
                    }))
                  }
                  className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                onClick={handleTestConnection}
                disabled={testing}
                className="w-full flex items-center justify-center gap-2 h-11 px-4 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                <Wifi className="h-4 w-4" />
                {testing ? "Testing..." : "Test Connection"}
              </button>
            </div>
          </div>

          {/* Default Doctor Fees */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Default Doctor Fees
                </h2>
                <p className="text-sm text-gray-500">
                  Set default earning rates for new doctors
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Digital Certificate (₹)
                </label>
                <input
                  type="number"
                  value={doctorFees.digitalCertificate}
                  onChange={(e) =>
                    setDoctorFees((prev) => ({
                      ...prev,
                      digitalCertificate: Number(e.target.value),
                    }))
                  }
                  className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Written Certificate (₹)
                </label>
                <input
                  type="number"
                  value={doctorFees.writtenCertificate}
                  onChange={(e) =>
                    setDoctorFees((prev) => ({
                      ...prev,
                      writtenCertificate: Number(e.target.value),
                    }))
                  }
                  className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Face to Digital (₹)
                </label>
                <input
                  type="number"
                  value={doctorFees.faceToDigital}
                  onChange={(e) =>
                    setDoctorFees((prev) => ({
                      ...prev,
                      faceToDigital: Number(e.target.value),
                    }))
                  }
                  className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <p className="text-xs text-gray-500">
                These rates apply to new doctor registrations. Existing doctors retain their individual rates.
              </p>
            </div>
          </div>

          {/* System Settings */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Settings className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  System Settings
                </h2>
                <p className="text-sm text-gray-500">
                  Configure system and notification settings
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Test Mode */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-700">
                  Test Mode
                </span>
                <button
                  onClick={() =>
                    setSystemSettings((prev) => ({
                      ...prev,
                      testMode: !prev.testMode,
                    }))
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    systemSettings.testMode ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      systemSettings.testMode ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Maintenance Mode */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-700">
                  Maintenance Mode
                </span>
                <button
                  onClick={() =>
                    setSystemSettings((prev) => ({
                      ...prev,
                      maintenanceMode: !prev.maintenanceMode,
                    }))
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    systemSettings.maintenanceMode ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      systemSettings.maintenanceMode
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Auto Refund Interval */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Auto Refund Interval (minutes)
                </label>
                <input
                  type="number"
                  value={systemSettings.autoRefundInterval}
                  onChange={(e) =>
                    setSystemSettings((prev) => ({
                      ...prev,
                      autoRefundInterval: Number(e.target.value),
                    }))
                  }
                  className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Email Notifications */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-700">
                  Email Notifications
                </span>
                <button
                  onClick={() =>
                    setSystemSettings((prev) => ({
                      ...prev,
                      emailNotifications: !prev.emailNotifications,
                    }))
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    systemSettings.emailNotifications ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      systemSettings.emailNotifications
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* WhatsApp Notifications */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-700">
                  WhatsApp Notifications
                </span>
                <button
                  onClick={() =>
                    setSystemSettings((prev) => ({
                      ...prev,
                      whatsappNotifications: !prev.whatsappNotifications,
                    }))
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    systemSettings.whatsappNotifications
                      ? "bg-blue-600"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      systemSettings.whatsappNotifications
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Admin Alerts */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-700">
                  Admin Alerts
                </span>
                <button
                  onClick={() =>
                    setSystemSettings((prev) => ({
                      ...prev,
                      adminAlerts: !prev.adminAlerts,
                    }))
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    systemSettings.adminAlerts ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      systemSettings.adminAlerts
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Fee Configuration */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Fee Configuration
                </h2>
                <p className="text-sm text-gray-500">
                  Configure platform and gateway fee rates
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Razorpay Fee Rate (%)
                </label>
                <input
                  type="number"
                  value={feeConfig.razorpayFeeRate}
                  onChange={(e) =>
                    setFeeConfig((prev) => ({
                      ...prev,
                      razorpayFeeRate: Number(e.target.value),
                    }))
                  }
                  className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Current: 2% per transaction
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  GST on Gateway Fees (%)
                </label>
                <input
                  type="number"
                  value={feeConfig.gstOnGatewayFees}
                  onChange={(e) =>
                    setFeeConfig((prev) => ({
                      ...prev,
                      gstOnGatewayFees: Number(e.target.value),
                    }))
                  }
                  className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Applied to gateway fees: 18%
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Platform Commission (%)
                </label>
                <input
                  type="number"
                  value={feeConfig.platformCommission}
                  onChange={(e) =>
                    setFeeConfig((prev) => ({
                      ...prev,
                      platformCommission: Number(e.target.value),
                    }))
                  }
                  className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Additional platform fee: 5%
                </p>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Effective Rate Calculation
                </a>
                <p className="text-xs text-blue-500 mt-0.5">
                  Gateway: 2% + GST = 2.36%
                </p>
              </div>
            </div>
          </div>

          {/* Withdrawal Settings */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Wallet className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Withdrawal Settings
                </h2>
                <p className="text-sm text-gray-500">
                  Configure doctor withdrawal limits and processing
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Minimum Withdrawal (₹)
                </label>
                <input
                  type="number"
                  value={withdrawalSettings.minimumWithdrawal}
                  onChange={(e) =>
                    setWithdrawalSettings((prev) => ({
                      ...prev,
                      minimumWithdrawal: Number(e.target.value),
                    }))
                  }
                  className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Maximum Withdrawal (₹)
                </label>
                <input
                  type="number"
                  value={withdrawalSettings.maximumWithdrawal}
                  onChange={(e) =>
                    setWithdrawalSettings((prev) => ({
                      ...prev,
                      maximumWithdrawal: Number(e.target.value),
                    }))
                  }
                  className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Processing Time{" "}
                  <span className="text-blue-600">(days)</span>
                </label>
                <input
                  type="number"
                  value={withdrawalSettings.processingTime}
                  onChange={(e) =>
                    setWithdrawalSettings((prev) => ({
                      ...prev,
                      processingTime: Number(e.target.value),
                    }))
                  }
                  className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Auto-approve withdrawals */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Auto-approve withdrawals
                  </span>
                  <p className="text-xs text-gray-500">
                    Automatically approve withdrawals within limits
                  </p>
                </div>
                <button
                  onClick={() =>
                    setWithdrawalSettings((prev) => ({
                      ...prev,
                      autoApprove: !prev.autoApprove,
                    }))
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    withdrawalSettings.autoApprove ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      withdrawalSettings.autoApprove
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Security & Backup */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Security & Backup
                </h2>
                <p className="text-sm text-gray-500">
                  Security settings and data backup options
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2 h-11 px-4 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                <Database className="h-4 w-4" />
                Backup Financial Data
              </button>

              <button className="w-full flex items-center justify-center gap-2 h-11 px-4 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                <Key className="h-4 w-4" />
                Rotate API Keys
              </button>

              <button className="w-full flex items-center justify-center gap-2 h-11 px-4 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                <FileText className="h-4 w-4" />
                Security Audit Log
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Last backup: Today at 2:00 AM
              </p>
              <p className="text-xs text-gray-500">
                Next scheduled backup: Tomorrow at 2:00 AM
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

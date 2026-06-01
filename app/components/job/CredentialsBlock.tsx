"use client";

import React, { useState } from "react";
import { Lock, Copy, Check, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

interface CredentialsBlockProps {
  username?: string;
  password?: string;
}

export const CredentialsBlock: React.FC<CredentialsBlockProps> = ({
  username,
  password,
}) => {
  const [copiedUser, setCopiedUser] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!username && !password) return null;

  const handleCopy = async (text: string, isPassword: boolean) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("কপি হয়েছে ✓");
      if (isPassword) {
        setCopiedPass(true);
        setTimeout(() => setCopiedPass(false), 2000);
      } else {
        setCopiedUser(true);
        setTimeout(() => setCopiedUser(false), 2000);
      }
    } catch {
      toast.error("কপি করা যায়নি, অনুগ্রহ করে ম্যানুয়ালি কপি করুন");
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 shadow-xs rounded-xl p-5 mb-6 text-left">
      <div className="flex items-center gap-2 mb-4 text-blue-700 font-semibold font-sans">
        <Lock size={18} className="text-blue-600" />
        <span>লগইন তথ্য (সরকারি পোর্টালে আবেদনের জন্য)</span>
      </div>

      <div className="space-y-3.5">
        {username && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white border border-gray-100 rounded-lg">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-400 font-sans">
                ইউজারনেম / মোবাইল
              </span>
              <span className="text-sm font-mono text-gray-800 break-all">
                {username}
              </span>
            </div>
            <button
              onClick={() => handleCopy(username, false)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-md text-xs font-semibold cursor-pointer transition-all shrink-0"
              title="ইউজারনেম কপি করুন"
            >
              {copiedUser ? (
                <Check size={14} className="text-green-600" />
              ) : (
                <Copy size={14} />
              )}
              <span>{copiedUser ? "কপি হয়েছে" : "কপি"}</span>
            </button>
          </div>
        )}

        {password && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white border border-gray-100 rounded-lg">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-400 font-sans">
                পাসওয়ার্ড
              </span>
              <span className="text-sm font-mono text-gray-800 break-all">
                {showPassword ? password : "••••••••"}
              </span>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="inline-flex items-center justify-center p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-800 border border-gray-200 rounded-md text-xs cursor-pointer transition-all"
                title={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button
                onClick={() => handleCopy(password, true)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-md text-xs font-semibold cursor-pointer transition-all"
                title="পাসওয়ার্ড কপি করুন"
              >
                {copiedPass ? (
                  <Check size={14} className="text-green-600" />
                ) : (
                  <Copy size={14} />
                )}
                <span>{copiedPass ? "কপি হয়েছে" : "কপি"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

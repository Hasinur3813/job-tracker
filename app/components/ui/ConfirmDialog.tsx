"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "আপনি কি নিশ্চিত?",
  message = "এই চাকরিটি স্থায়ীভাবে মুছে যাবে।",
  confirmText = "হ্যাঁ, মুছে ফেলুন",
  cancelText = "বাতিল করুন",
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative w-full max-w-sm overflow-hidden bg-white shadow-xl rounded-xl border border-gray-100 p-6 z-10"
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full text-red-600 mb-4 animate-pulse">
                <AlertTriangle size={24} />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sans">
                {title}
              </h3>
              <p className="text-sm text-gray-500 mb-6 font-sans">{message}</p>

              <div className="flex gap-3 w-full">
                <Button variant="secondary" fullWidth onClick={onClose}>
                  {cancelText}
                </Button>
                <Button variant="danger" fullWidth onClick={onConfirm}>
                  {confirmText}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

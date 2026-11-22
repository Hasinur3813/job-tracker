"use client";

import React, { useEffect, useId } from "react";
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
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "আপনি কি নিশ্চিত?",
  message = "এই চাকরিটি স্থায়ীভাবে মুছে যাবে।",
  confirmText = "হ্যাঁ, মুছে ফেলুন",
  cancelText = "বাতিল করুন",
  loading = false,
}) => {
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, loading, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !loading && onClose()}
            className="fixed inset-0 bg-slate-950/55 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 12 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-white/60 bg-white p-6 shadow-lift"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-rose-500 to-rose-600 text-white shadow-[0_16px_32px_-16px_rgba(225,29,72,0.9)]">
                <AlertTriangle size={26} />
              </div>

              <h3
                id={titleId}
                className="mb-2 text-lg font-bold text-slate-900"
              >
                {title}
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-slate-500">
                {message}
              </p>

              <div className="flex w-full gap-3">
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={onClose}
                  disabled={loading}
                >
                  {cancelText}
                </Button>
                <Button
                  variant="danger"
                  fullWidth
                  onClick={onConfirm}
                  loading={loading}
                >
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

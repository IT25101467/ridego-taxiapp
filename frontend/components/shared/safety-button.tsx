"use client";

import { useState } from "react";

/**
 * Demo Safety Button — shows confirmation popups only.
 * No GPS, APIs, or real emergency services.
 */
export default function SafetyButton() {
  // Step 1 popup: emergency alert confirmation
  const [showConfirm, setShowConfirm] = useState(false);
  // Step 2 popup: success message after user clicks OK
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSafetyClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmOk = () => {
    setShowConfirm(false);
    setShowSuccess(true);
  };

  const handleSuccessOk = () => {
    setShowSuccess(false);
  };

  return (
    <>
      {/* Fixed red button — visible on mobile and desktop */}
      <button
        type="button"
        onClick={handleSafetyClick}
        className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-30 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm sm:text-base font-semibold shadow-lg shadow-red-600/30 transition-colors"
        aria-label="Safety Button — emergency demo"
      >
        Safety Button
      </button>

      {/* Popup 1: emergency alert activated */}
      {showConfirm && (
        <SimpleModal onBackdropClick={() => setShowConfirm(false)}>
          <h2 className="text-lg font-bold text-foreground mb-2">Emergency alert</h2>
          <p className="text-sm text-muted-foreground mb-6">Emergency alert activated</p>
          <button
            type="button"
            onClick={handleConfirmOk}
            className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition"
          >
            OK
          </button>
        </SimpleModal>
      )}

      {/* Popup 2: demo success message (no real location sharing) */}
      {showSuccess && (
        <SimpleModal>
          <h2 className="text-lg font-bold text-foreground mb-2">Alert sent</h2>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Emergency message sent successfully.
            <br />
            Your live location has been shared with trusted contacts.
          </p>
          <button
            type="button"
            onClick={handleSuccessOk}
            className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition"
          >
            OK
          </button>
        </SimpleModal>
      )}
    </>
  );
}

/** Simple centered modal — plain div overlay, no external UI library */
function SimpleModal({
  children,
  onBackdropClick,
}: {
  children: React.ReactNode;
  onBackdropClick?: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      role="dialog"
      aria-modal="true"
    >
      {/* Click outside to close (optional, first popup only) */}
      {onBackdropClick && (
        <div
          className="absolute inset-0"
          onClick={onBackdropClick}
          aria-hidden="true"
        />
      )}
      {!onBackdropClick && <span className="absolute inset-0" aria-hidden="true" />}
      <div className="relative w-full max-w-sm rounded-2xl bg-card border border-border p-5 sm:p-6 shadow-xl">
        {children}
      </div>
    </div>
  );
}

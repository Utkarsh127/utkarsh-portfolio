import { useState, useEffect } from "react";
import { ShieldCheck, Check, X } from "lucide-react";
import { getConsentStatus, setConsentStatus } from "../utils/analytics";

export default function ConsentBanner({ isOpen, onClose }) {
  const [currentConsent, setCurrentConsent] = useState(() => getConsentStatus());
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleConsentChange = (e) => {
      setCurrentConsent(e.detail);
    };

    window.addEventListener("analytics_consent_changed", handleConsentChange);
    return () => {
      window.removeEventListener("analytics_consent_changed", handleConsentChange);
    };
  }, []);

  const handleAccept = () => {
    setConsentStatus("granted");
    setIsDismissed(true);
    if (onClose) onClose();
  };

  const handleDecline = () => {
    setConsentStatus("denied");
    setIsDismissed(true);
    if (onClose) onClose();
  };

  // Show banner if explicitly requested via footer (isOpen) OR if user hasn't made a choice yet and hasn't dismissed in current session
  const shouldShow = (isOpen || currentConsent === null) && !isDismissed;

  if (!shouldShow) return null;

  return (
    <aside
      role="region"
      aria-label="Analytics & Privacy Consent"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 animate-fade-in"
    >
      <div className="bg-surface/95 backdrop-blur-md border border-border p-5 rounded-xl shadow-2xl text-white">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-background border border-border rounded-lg text-accent shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-white">
              Privacy & Analytics
            </h3>
            <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">
              This portfolio uses privacy-focused Google Analytics 4 (with IP
              anonymization) to evaluate anonymous visitor engagement and device metrics.
              No personally identifiable information is collected.
            </p>

            {currentConsent && (
              <p className="mt-2 text-xs font-medium text-accent">
                Current preference:{" "}
                <span className="capitalize">{currentConsent}</span>
              </p>
            )}

            <div className="mt-4 flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleAccept}
                className="flex-1 bg-accent hover:bg-accent-hover text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                Accept Analytics
              </button>
              <button
                type="button"
                onClick={handleDecline}
                className="flex-1 bg-background hover:bg-surface-hover border border-border text-text-secondary hover:text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

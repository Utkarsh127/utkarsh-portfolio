/**
 * Google Analytics 4 (GA4) Analytics Utility
 * 
 * Features:
 * - Safe initialization using Google tag (gtag.js)
 * - Strict consent verification (do not load or track without consent)
 * - Graceful handling of missing or placeholder Measurement IDs
 * - Zero Personally Identifiable Information (PII) transmission
 * - SPA hash-based route page view tracking with deduplication
 * - Custom event tracking (project_view, github_click, linkedin_click, resume_download, contact_form_submit, email_click, phone_click)
 */

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const CONSENT_STORAGE_KEY = "portfolio_analytics_consent";

// Check if Measurement ID is present and valid
export const isMeasurementIdValid = () => {
  return (
    typeof GA_MEASUREMENT_ID === "string" &&
    /^G-[A-Za-z0-9]+$/.test(GA_MEASUREMENT_ID.trim()) &&
    GA_MEASUREMENT_ID.trim() !== "G-XXXXXXXXXX"
  );
};

// Retrieve stored consent status: "granted" | "denied" | null
export const getConsentStatus = () => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    return null;
  }
};

let isInitialized = false;

// Initialize GA4 safely after consent is confirmed
export const initGA = () => {
  if (typeof window === "undefined") return false;

  // Strict consent check: never initialize if consent is not granted
  if (getConsentStatus() !== "granted") {
    return false;
  }

  // Gracefully handle missing / placeholder environment variable
  if (!isMeasurementIdValid()) {
    return false;
  }

  // Avoid duplicate initialization
  if (isInitialized) {
    return true;
  }

  const id = GA_MEASUREMENT_ID.trim();

  // Clear any previous opt-out flag
  window[`ga-disable-${id}`] = false;

  // Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = window.gtag || gtag;

  gtag("js", new Date());
  gtag("config", id, {
    send_page_view: false, // SPA page views tracked manually to avoid duplicates
    anonymize_ip: true,
    cookie_flags: "SameSite=None;Secure",
  });

  // Asynchronously inject gtag.js script if not already present
  const scriptId = "google-analytics-gtag";
  if (!document.getElementById(scriptId)) {
    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);
  }

  isInitialized = true;
  return true;
};

// Disable GA4 tracking (e.g. when user revokes consent)
export const disableGA = () => {
  if (typeof window === "undefined") return;
  if (isMeasurementIdValid()) {
    const id = GA_MEASUREMENT_ID.trim();
    window[`ga-disable-${id}`] = true;
  }
  isInitialized = false;
};

// Update and persist consent status
export const setConsentStatus = (status) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, status);
    window.dispatchEvent(
      new CustomEvent("analytics_consent_changed", { detail: status })
    );

    if (status === "granted") {
      initGA();
      // Track initial page view upon consent grant
      trackPageView();
    } else if (status === "denied") {
      disableGA();
    }
  } catch (error) {
    console.warn("Unable to access localStorage for analytics consent.", error);
  }
};

let lastTrackedPath = null;
let lastTrackedTimestamp = 0;

// Track SPA page / section views with deduplication
export const trackPageView = (path, title) => {
  if (getConsentStatus() !== "granted" || !isMeasurementIdValid()) {
    return;
  }

  if (!isInitialized) {
    initGA();
  }

  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    const currentPath =
      path || window.location.pathname + (window.location.hash || "");
    const currentTitle = title || document.title;
    const now = Date.now();

    // Prevent duplicate rapid page-view tracking within 500ms
    if (lastTrackedPath === currentPath && now - lastTrackedTimestamp < 500) {
      return;
    }

    lastTrackedPath = currentPath;
    lastTrackedTimestamp = now;

    window.gtag("event", "page_view", {
      page_path: currentPath,
      page_title: currentTitle,
      page_location: window.location.href,
    });
  }
};

// Keys to strip to ensure NO Personally Identifiable Information (PII) is sent
const PII_KEYS = [
  "name",
  "email",
  "phone",
  "phonenumber",
  "telephone",
  "message",
  "content",
  "password",
  "token",
  "ip",
];

const sanitizeParams = (params = {}) => {
  const sanitized = {};
  for (const [key, value] of Object.entries(params)) {
    if (PII_KEYS.includes(key.toLowerCase())) {
      continue; // Filter out sensitive keys
    }
    if (typeof value === "string") {
      // Disallow strings containing email patterns or phone number patterns
      if (/@/.test(value) || /^\+?[0-9\s-]{7,}$/.test(value.trim())) {
        continue;
      }
    }
    sanitized[key] = value;
  }
  return sanitized;
};

// Track custom engagement events
export const trackEvent = (eventName, params = {}) => {
  if (getConsentStatus() !== "granted" || !isMeasurementIdValid()) {
    return;
  }

  if (!isInitialized) {
    initGA();
  }

  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    const cleanParams = sanitizeParams(params);
    window.gtag("event", eventName, cleanParams);
  }
};

// Convenience helper for resume download
export const trackResumeDownload = (fileName = "resume.pdf") => {
  trackEvent("resume_download", { file_name: fileName });
};

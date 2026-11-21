import { useState } from "react";
import { Mail, Phone, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { CONTACT_INFO } from "../data/socialLinks";
import { trackEvent } from "../utils/analytics";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    type: null, // "success" | "error" | null
    message: "",
  });

  // Validate a single field
  const validateField = (fieldName, value) => {
    const trimmed = value.trim();
    switch (fieldName) {
      case "name":
        if (!trimmed) return "Name is required.";
        return "";
      case "email":
        if (!trimmed) return "Email is required.";
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/.test(trimmed)) {
          return "Please enter a valid email address.";
        }
        return "";
      case "message":
        if (!trimmed) return "Message is required.";
        return "";
      default:
        return "";
    }
  };

  // Validate full form
  const validateForm = () => {
    const newErrors = {};
    const nameError = validateField("name", formData.name);
    if (nameError) newErrors.name = nameError;

    const emailError = validateField("email", formData.email);
    if (emailError) newErrors.email = emailError;

    const messageError = validateField("message", formData.message);
    if (messageError) newErrors.message = messageError;

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation error clearance
    if (errors[name]) {
      const errorMsg = validateField(name, value);
      setErrors((prev) => {
        const next = { ...prev };
        if (!errorMsg) {
          delete next[name];
        } else {
          next[name] = errorMsg;
        }
        return next;
      });
    }

    // Clear submission feedback on user edit
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: "" });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errorMsg = validateField(name, value);
    if (errorMsg) {
      setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent duplicate submissions
    if (isSubmitting) return;

    // Validate inputs
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      // Focus first erroneous field for accessibility
      if (formErrors.name) {
        document.getElementById("name")?.focus();
      } else if (formErrors.email) {
        document.getElementById("email")?.focus();
      } else if (formErrors.message) {
        document.getElementById("message")?.focus();
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;

    if (!endpoint || endpoint.trim() === "" || endpoint === "YOUR_FORMSPREE_ENDPOINT") {
      setSubmitStatus({
        type: "error",
        message:
          "Form submission endpoint is not configured. Please set a valid VITE_FORMSPREE_ENDPOINT.",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        // Track successful contact form submission (NO personal data sent to GA)
        trackEvent("contact_form_submit", { status: "success" });

        setSubmitStatus({
          type: "success",
          message: "Thank you! Your message has been sent successfully. I'll get back to you soon.",
        });
        // Clear form after successful submission
        setFormData({ name: "", email: "", message: "" });
        setErrors({});
      } else {
        let errorMessage = "Oops! There was a problem submitting your form. Please try again.";
        if (data && data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          errorMessage = data.errors.map((err) => err.message || err.field).join(", ");
        } else if (data && data.error) {
          errorMessage = data.error;
        }
        setSubmitStatus({
          type: "error",
          message: errorMessage,
        });
      }
    } catch {
      setSubmitStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-surface/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-4">
              Let's Connect
            </h2>
            <p className="text-lg text-text-secondary">
              Currently open for new opportunities. Feel free to reach out.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold text-white mb-6">Contact Information</h3>
              <div className="space-y-6">
                {/* Email Option */}
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  onClick={() => trackEvent("email_click", { link_location: "contact" })}
                  className="flex items-center gap-4 text-text-secondary hover:text-white transition-colors group"
                  aria-label="Send email"
                >
                  <div className="p-3 bg-background border border-border rounded-lg group-hover:border-accent transition-colors">
                    <Mail className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <span className="block text-sm font-medium">Email</span>
                    <span className="text-lg font-semibold text-white">{CONTACT_INFO.email}</span>
                  </div>
                </a>

                {/* Direct Phone / Call Me Option */}
                <a
                  href={`tel:${CONTACT_INFO.phone}`}
                  onClick={() => trackEvent("phone_click", { link_location: "contact" })}
                  className="flex items-center gap-4 text-text-secondary hover:text-white transition-colors group"
                  aria-label="Call Me directly"
                >
                  <div className="p-3 bg-background border border-border rounded-lg group-hover:border-accent transition-colors">
                    <Phone className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <span className="block text-sm font-medium">Call Me</span>
                    <span className="text-lg font-semibold text-white">{CONTACT_INFO.phone}</span>
                  </div>
                </a>

                {/* GitHub Option */}
                <a
                  href={CONTACT_INFO.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("github_click", { link_location: "contact" })}
                  className="flex items-center gap-4 text-text-secondary hover:text-white transition-colors group"
                  aria-label="Visit GitHub profile"
                >
                  <div className="p-3 bg-background border border-border rounded-lg group-hover:border-accent transition-colors">
                    <FaGithub className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <span className="block text-sm font-medium">GitHub</span>
                    <span className="text-lg font-semibold text-white">{CONTACT_INFO.githubUsername}</span>
                  </div>
                </a>

                {/* LinkedIn Option */}
                <a
                  href={CONTACT_INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("linkedin_click", { link_location: "contact" })}
                  className="flex items-center gap-4 text-text-secondary hover:text-white transition-colors group"
                  aria-label="Visit LinkedIn profile"
                >
                  <div className="p-3 bg-background border border-border rounded-lg group-hover:border-accent transition-colors">
                    <FaLinkedin className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <span className="block text-sm font-medium">LinkedIn</span>
                    <span className="text-lg font-semibold text-white">{CONTACT_INFO.linkedinUsername}</span>
                  </div>
                </a>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              {submitStatus.type === "success" && (
                <div
                  role="status"
                  aria-live="polite"
                  className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
                  <div className="text-sm">
                    <p className="font-semibold text-emerald-300">Message Sent</p>
                    <p className="mt-0.5 text-emerald-400/90">{submitStatus.message}</p>
                  </div>
                </div>
              )}

              {submitStatus.type === "error" && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
                  <div className="text-sm">
                    <p className="font-semibold text-red-300">Submission Error</p>
                    <p className="mt-0.5 text-red-400/90">{submitStatus.message}</p>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">
                  Name <span className="text-red-400" aria-hidden="true">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  aria-required="true"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  autoComplete="name"
                  className={`w-full bg-background border rounded-lg px-4 py-3 text-white focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${errors.name
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-border focus:border-accent"
                    }`}
                  placeholder="Your Name"
                />
                {errors.name && (
                  <p id="name-error" role="alert" className="text-red-400 text-xs mt-1.5 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">
                  Email <span className="text-red-400" aria-hidden="true">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  aria-required="true"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  autoComplete="email"
                  className={`w-full bg-background border rounded-lg px-4 py-3 text-white focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-border focus:border-accent"
                    }`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p id="email-error" role="alert" className="text-red-400 text-xs mt-1.5 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-1">
                  Message <span className="text-red-400" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  aria-required="true"
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  className={`w-full bg-background border rounded-lg px-4 py-3 text-white focus:outline-none transition-colors resize-none disabled:opacity-60 disabled:cursor-not-allowed ${errors.message
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-border focus:border-accent"
                    }`}
                  placeholder="How can I help you?"
                />
                {errors.message && (
                  <p id="message-error" role="alert" className="text-red-400 text-xs mt-1.5 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.message}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

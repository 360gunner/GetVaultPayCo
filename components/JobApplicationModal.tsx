"use client";

import React, { useState } from "react";
import { vars } from "@/styles/theme.css";
import { fluidUnit } from "@/styles/fluid-unit";
import Typography from "@/components/Typography/Typography";

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
}

export default function JobApplicationModal({
  isOpen,
  onClose,
  jobTitle,
}: JobApplicationModalProps) {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    
    // Employment Information
    linkedin: "",
    portfolio: "",
    currentEmployer: "",
    startDate: "",
    
    // Legal Requirements (US)
    isVeteran: "",
    veteranStatus: "",
    hasDisability: "",
    ethnicity: "",
    gender: "",
    isAuthorizedToWork: "",
    requiresSponsorship: "",
    
    // Additional
    howDidYouHear: "",
    cv: null as File | null,
    coverLetter: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, cv: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Send to endpoint when ready
    console.log("Application submitted:", formData);
    alert("Application submitted successfully! We'll review it and get back to you soon.");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: fluidUnit(20),
        overflowY: "auto",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: vars.color.vaultWhite,
          borderRadius: fluidUnit(16),
          padding: fluidUnit(40),
          maxWidth: "800px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
          border: `3px solid ${vars.color.vaultBlack}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: fluidUnit(20),
            right: fluidUnit(20),
            background: "none",
            border: "none",
            fontSize: fluidUnit(32),
            cursor: "pointer",
            color: vars.color.vaultBlack,
          }}
        >
          ×
        </button>

        {/* Header */}
        <Typography
          as="h2"
          style={{
            fontSize: fluidUnit(32),
            fontWeight: 700,
            marginBottom: fluidUnit(8),
            color: vars.color.vaultBlack,
          }}
        >
          Apply for {jobTitle}
        </Typography>
        <Typography
          as="p"
          style={{
            fontSize: fluidUnit(16),
            color: vars.color.muted,
            marginBottom: fluidUnit(32),
          }}
        >
          All fields marked with * are required
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <section style={{ marginBottom: fluidUnit(32) }}>
            <Typography
              as="h3"
              style={{
                fontSize: fluidUnit(20),
                fontWeight: 700,
                marginBottom: fluidUnit(16),
                color: vars.color.vaultBlack,
              }}
            >
              Personal Information
            </Typography>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: fluidUnit(16) }}>
              <div>
                <label style={{ fontSize: fluidUnit(14), fontWeight: 600, display: "block", marginBottom: fluidUnit(8) }}>
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: fluidUnit(12),
                    border: `2px solid ${vars.color.vaultBlack}`,
                    borderRadius: fluidUnit(8),
                    fontSize: fluidUnit(16),
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: fluidUnit(14), fontWeight: 600, display: "block", marginBottom: fluidUnit(8) }}>
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: fluidUnit(12),
                    border: `2px solid ${vars.color.vaultBlack}`,
                    borderRadius: fluidUnit(8),
                    fontSize: fluidUnit(16),
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: fluidUnit(16), display: "grid", gridTemplateColumns: "1fr 1fr", gap: fluidUnit(16) }}>
              <div>
                <label style={{ fontSize: fluidUnit(14), fontWeight: 600, display: "block", marginBottom: fluidUnit(8) }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: fluidUnit(12),
                    border: `2px solid ${vars.color.vaultBlack}`,
                    borderRadius: fluidUnit(8),
                    fontSize: fluidUnit(16),
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: fluidUnit(14), fontWeight: 600, display: "block", marginBottom: fluidUnit(8) }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: fluidUnit(12),
                    border: `2px solid ${vars.color.vaultBlack}`,
                    borderRadius: fluidUnit(8),
                    fontSize: fluidUnit(16),
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: fluidUnit(16) }}>
              <label style={{ fontSize: fluidUnit(14), fontWeight: 600, display: "block", marginBottom: fluidUnit(8) }}>
                Address *
              </label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: fluidUnit(12),
                  border: `2px solid ${vars.color.vaultBlack}`,
                  borderRadius: fluidUnit(8),
                  fontSize: fluidUnit(16),
                }}
              />
            </div>

            <div style={{ marginTop: fluidUnit(16), display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: fluidUnit(16) }}>
              <div>
                <label style={{ fontSize: fluidUnit(14), fontWeight: 600, display: "block", marginBottom: fluidUnit(8) }}>
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: fluidUnit(12),
                    border: `2px solid ${vars.color.vaultBlack}`,
                    borderRadius: fluidUnit(8),
                    fontSize: fluidUnit(16),
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: fluidUnit(14), fontWeight: 600, display: "block", marginBottom: fluidUnit(8) }}>
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: fluidUnit(12),
                    border: `2px solid ${vars.color.vaultBlack}`,
                    borderRadius: fluidUnit(8),
                    fontSize: fluidUnit(16),
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: fluidUnit(14), fontWeight: 600, display: "block", marginBottom: fluidUnit(8) }}>
                  ZIP Code *
                </label>
                <input
                  type="text"
                  name="zipCode"
                  required
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: fluidUnit(12),
                    border: `2px solid ${vars.color.vaultBlack}`,
                    borderRadius: fluidUnit(8),
                    fontSize: fluidUnit(16),
                  }}
                />
              </div>
            </div>
          </section>

          {/* Professional Information */}
          <section style={{ marginBottom: fluidUnit(32) }}>
            <Typography
              as="h3"
              style={{
                fontSize: fluidUnit(20),
                fontWeight: 700,
                marginBottom: fluidUnit(16),
                color: vars.color.vaultBlack,
              }}
            >
              Professional Information
            </Typography>

            <div>
              <label style={{ fontSize: fluidUnit(14), fontWeight: 600, display: "block", marginBottom: fluidUnit(8) }}>
                LinkedIn Profile
              </label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/yourprofile"
                style={{
                  width: "100%",
                  padding: fluidUnit(12),
                  border: `2px solid ${vars.color.vaultBlack}`,
                  borderRadius: fluidUnit(8),
                  fontSize: fluidUnit(16),
                }}
              />
            </div>

            <div style={{ marginTop: fluidUnit(16) }}>
              <label style={{ fontSize: fluidUnit(14), fontWeight: 600, display: "block", marginBottom: fluidUnit(8) }}>
                Portfolio/Website
              </label>
              <input
                type="url"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleInputChange}
                placeholder="https://yourportfolio.com"
                style={{
                  width: "100%",
                  padding: fluidUnit(12),
                  border: `2px solid ${vars.color.vaultBlack}`,
                  borderRadius: fluidUnit(8),
                  fontSize: fluidUnit(16),
                }}
              />
            </div>

            <div style={{ marginTop: fluidUnit(16) }}>
              <label style={{ fontSize: fluidUnit(14), fontWeight: 600, display: "block", marginBottom: fluidUnit(8) }}>
                Resume/CV * (PDF, DOC, DOCX - Max 5MB)
              </label>
              <input
                type="file"
                name="cv"
                required
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                style={{
                  width: "100%",
                  padding: fluidUnit(12),
                  border: `2px solid ${vars.color.vaultBlack}`,
                  borderRadius: fluidUnit(8),
                  fontSize: fluidUnit(16),
                }}
              />
            </div>

            <div style={{ marginTop: fluidUnit(16) }}>
              <label style={{ fontSize: fluidUnit(14), fontWeight: 600, display: "block", marginBottom: fluidUnit(8) }}>
                Cover Letter
              </label>
              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                rows={6}
                placeholder="Tell us why you'd be a great fit for this role..."
                style={{
                  width: "100%",
                  padding: fluidUnit(12),
                  border: `2px solid ${vars.color.vaultBlack}`,
                  borderRadius: fluidUnit(8),
                  fontSize: fluidUnit(16),
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
              />
            </div>
          </section>

          {/* US Legal Requirements */}
          <section style={{ marginBottom: fluidUnit(32), background: vars.color.cloudSilver, padding: fluidUnit(24), borderRadius: fluidUnit(12) }}>
            <Typography
              as="h3"
              style={{
                fontSize: fluidUnit(20),
                fontWeight: 700,
                marginBottom: fluidUnit(8),
                color: vars.color.vaultBlack,
              }}
            >
              Equal Employment Opportunity Information
            </Typography>
            <Typography
              as="p"
              style={{
                fontSize: fluidUnit(14),
                color: vars.color.muted,
                marginBottom: fluidUnit(16),
              }}
            >
              VaultPay is an Equal Opportunity Employer. The following information is requested for compliance with federal regulations. Providing this information is voluntary and will not affect your application.
            </Typography>

            <div style={{ marginBottom: fluidUnit(16) }}>
              <label style={{ fontSize: fluidUnit(14), fontWeight: 600, display: "block", marginBottom: fluidUnit(8) }}>
                Are you a protected veteran? *
              </label>
              <select
                name="isVeteran"
                required
                value={formData.isVeteran}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: fluidUnit(12),
                  border: `2px solid ${vars.color.vaultBlack}`,
                  borderRadius: fluidUnit(8),
                  fontSize: fluidUnit(16),
                  background: vars.color.vaultWhite,
                }}
              >
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="decline">I choose not to self-identify</option>
              </select>
            </div>

            <div style={{ marginBottom: fluidUnit(16) }}>
              <label style={{ fontSize: fluidUnit(14), fontWeight: 600, display: "block", marginBottom: fluidUnit(8) }}>
                Do you have a disability? *
              </label>
              <select
                name="hasDisability"
                required
                value={formData.hasDisability}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: fluidUnit(12),
                  border: `2px solid ${vars.color.vaultBlack}`,
                  borderRadius: fluidUnit(8),
                  fontSize: fluidUnit(16),
                  background: vars.color.vaultWhite,
                }}
              >
                <option value="">Select...</option>
                <option value="yes">Yes, I have a disability</option>
                <option value="no">No, I don't have a disability</option>
                <option value="decline">I choose not to self-identify</option>
              </select>
            </div>

            <div style={{ marginBottom: fluidUnit(16) }}>
              <label style={{ fontSize: fluidUnit(14), fontWeight: 600, display: "block", marginBottom: fluidUnit(8) }}>
                Gender *
              </label>
              <select
                name="gender"
                required
                value={formData.gender}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: fluidUnit(12),
                  border: `2px solid ${vars.color.vaultBlack}`,
                  borderRadius: fluidUnit(8),
                  fontSize: fluidUnit(16),
                  background: vars.color.vaultWhite,
                }}
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-Binary</option>
                <option value="decline">I choose not to self-identify</option>
              </select>
            </div>

            <div style={{ marginBottom: fluidUnit(16) }}>
              <label style={{ fontSize: fluidUnit(14), fontWeight: 600, display: "block", marginBottom: fluidUnit(8) }}>
                Race/Ethnicity *
              </label>
              <select
                name="ethnicity"
                required
                value={formData.ethnicity}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: fluidUnit(12),
                  border: `2px solid ${vars.color.vaultBlack}`,
                  borderRadius: fluidUnit(8),
                  fontSize: fluidUnit(16),
                  background: vars.color.vaultWhite,
                }}
              >
                <option value="">Select...</option>
                <option value="hispanic">Hispanic or Latino</option>
                <option value="white">White (Not Hispanic or Latino)</option>
                <option value="black">Black or African American</option>
                <option value="asian">Asian</option>
                <option value="native-american">American Indian or Alaska Native</option>
                <option value="pacific-islander">Native Hawaiian or Other Pacific Islander</option>
                <option value="two-or-more">Two or More Races</option>
                <option value="decline">I choose not to self-identify</option>
              </select>
            </div>

            <div style={{ marginBottom: fluidUnit(16) }}>
              <label style={{ fontSize: fluidUnit(14), fontWeight: 600, display: "block", marginBottom: fluidUnit(8) }}>
                Are you legally authorized to work in the United States? *
              </label>
              <select
                name="isAuthorizedToWork"
                required
                value={formData.isAuthorizedToWork}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: fluidUnit(12),
                  border: `2px solid ${vars.color.vaultBlack}`,
                  borderRadius: fluidUnit(8),
                  fontSize: fluidUnit(16),
                  background: vars.color.vaultWhite,
                }}
              >
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: fluidUnit(14), fontWeight: 600, display: "block", marginBottom: fluidUnit(8) }}>
                Will you now or in the future require sponsorship for employment visa status? *
              </label>
              <select
                name="requiresSponsorship"
                required
                value={formData.requiresSponsorship}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: fluidUnit(12),
                  border: `2px solid ${vars.color.vaultBlack}`,
                  borderRadius: fluidUnit(8),
                  fontSize: fluidUnit(16),
                  background: vars.color.vaultWhite,
                }}
              >
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </section>

          {/* Additional Information */}
          <section style={{ marginBottom: fluidUnit(32) }}>
            <div>
              <label style={{ fontSize: fluidUnit(14), fontWeight: 600, display: "block", marginBottom: fluidUnit(8) }}>
                How did you hear about this position?
              </label>
              <select
                name="howDidYouHear"
                value={formData.howDidYouHear}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: fluidUnit(12),
                  border: `2px solid ${vars.color.vaultBlack}`,
                  borderRadius: fluidUnit(8),
                  fontSize: fluidUnit(16),
                  background: vars.color.vaultWhite,
                }}
              >
                <option value="">Select...</option>
                <option value="website">VaultPay Website</option>
                <option value="linkedin">LinkedIn</option>
                <option value="indeed">Indeed</option>
                <option value="referral">Employee Referral</option>
                <option value="social-media">Social Media</option>
                <option value="other">Other</option>
              </select>
            </div>
          </section>

          {/* Submit Button */}
          <div style={{ display: "flex", gap: fluidUnit(16), justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: `${fluidUnit(14)} ${fluidUnit(32)}`,
                fontSize: fluidUnit(16),
                fontWeight: 700,
                borderRadius: fluidUnit(50),
                border: `2px solid ${vars.color.vaultBlack}`,
                background: vars.color.vaultWhite,
                color: vars.color.vaultBlack,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: `${fluidUnit(14)} ${fluidUnit(32)}`,
                fontSize: fluidUnit(16),
                fontWeight: 700,
                borderRadius: fluidUnit(50),
                border: `2px solid ${vars.color.vaultBlack}`,
                background: vars.color.neonMint,
                color: vars.color.vaultBlack,
                cursor: "pointer",
              }}
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

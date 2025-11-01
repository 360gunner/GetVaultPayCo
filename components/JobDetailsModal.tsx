"use client";

import React from "react";
import { vars } from "@/styles/theme.css";
import { fluidUnit } from "@/styles/fluid-unit";
import Typography from "@/components/Typography/Typography";
import Button from "@/components/Button/Button";

interface JobDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    title: string;
    department: string;
    location: string;
    type: string;
    description: string;
  } | null;
  onApplyClick: () => void;
}

export default function JobDetailsModal({
  isOpen,
  onClose,
  job,
  onApplyClick,
}: JobDetailsModalProps) {
  if (!isOpen || !job) return null;

  // Detailed job information based on job title
  const getJobDetails = () => {
    const details: { [key: string]: any } = {
      "Senior Full-Stack Engineer": {
        responsibilities: [
          "Design and build scalable payment infrastructure handling millions of transactions",
          "Develop customer-facing features for web and mobile applications",
          "Collaborate with product and design teams to deliver high-quality solutions",
          "Write clean, maintainable code with comprehensive tests",
          "Participate in code reviews and mentor junior engineers",
          "Optimize application performance and security",
        ],
        qualifications: [
          "5+ years of experience in full-stack development",
          "Strong proficiency in React, Node.js, and TypeScript",
          "Experience with payment systems or fintech applications",
          "Knowledge of database design and optimization (PostgreSQL, MongoDB)",
          "Understanding of security best practices and PCI compliance",
          "Excellent problem-solving and communication skills",
        ],
        benefits: [
          "Competitive salary: $150k - $200k + equity",
          "Comprehensive health, dental, and vision insurance",
          "Unlimited PTO and flexible work hours",
          "Remote-first culture with option for office work",
          "$2,000 annual learning budget",
          "Latest tech equipment and tools",
        ],
      },
      "Product Designer": {
        responsibilities: [
          "Design intuitive and beautiful user experiences for millions of users",
          "Create wireframes, prototypes, and high-fidelity mockups",
          "Conduct user research and usability testing",
          "Collaborate with engineering teams to implement designs",
          "Maintain and evolve the VaultPay design system",
          "Present design concepts to stakeholders",
        ],
        qualifications: [
          "3+ years of experience in product design",
          "Proficiency in Figma, Sketch, or similar design tools",
          "Strong portfolio demonstrating end-to-end product design",
          "Experience designing for fintech or payment applications",
          "Understanding of responsive and mobile-first design",
          "Excellent visual design and typography skills",
        ],
        benefits: [
          "Competitive salary: $120k - $160k + equity",
          "Comprehensive health benefits",
          "Creative freedom to shape product direction",
          "Access to premium design tools and resources",
          "Unlimited PTO",
          "Conference and workshop attendance",
        ],
      },
      "Security Engineer": {
        responsibilities: [
          "Protect user data and payment information across all systems",
          "Conduct security audits and penetration testing",
          "Implement security best practices and compliance standards",
          "Monitor and respond to security incidents",
          "Build and maintain security tools and infrastructure",
          "Educate team members on security awareness",
        ],
        qualifications: [
          "4+ years of experience in cybersecurity",
          "Strong knowledge of PCI DSS, GDPR, and other compliance standards",
          "Experience with security tools (SIEM, IDS/IPS, vulnerability scanners)",
          "Understanding of cryptography and secure coding practices",
          "Knowledge of cloud security (AWS, GCP, or Azure)",
          "Relevant certifications (CISSP, CEH, or similar) preferred",
        ],
        benefits: [
          "Competitive salary: $140k - $190k + equity",
          "Comprehensive health insurance",
          "Security conference attendance",
          "Certification and training budget",
          "Remote-first with flexible hours",
          "Latest security tools and equipment",
        ],
      },
      "Customer Success Manager": {
        responsibilities: [
          "Help merchant partners succeed and grow their businesses",
          "Onboard new customers and ensure smooth adoption",
          "Provide technical support and troubleshooting",
          "Identify upsell and expansion opportunities",
          "Build strong relationships with key accounts",
          "Gather customer feedback to improve products",
        ],
        qualifications: [
          "3+ years of customer success or account management experience",
          "Experience in SaaS, payments, or fintech industry",
          "Excellent communication and relationship-building skills",
          "Technical aptitude to understand payment systems",
          "Data-driven approach to customer success",
          "Experience with CRM tools (Salesforce, HubSpot)",
        ],
        benefits: [
          "Competitive salary: $80k - $110k + commission",
          "Comprehensive health benefits",
          "Career growth opportunities",
          "Remote work flexibility",
          "Team events and retreats",
          "Professional development budget",
        ],
      },
      "Data Scientist": {
        responsibilities: [
          "Build ML models for fraud detection and risk assessment",
          "Develop personalization and recommendation systems",
          "Analyze user behavior and transaction patterns",
          "Create dashboards and reports for business insights",
          "Collaborate with engineering to deploy models to production",
          "Experiment with new ML techniques and technologies",
        ],
        qualifications: [
          "4+ years of experience in data science or ML engineering",
          "Strong proficiency in Python, SQL, and ML frameworks",
          "Experience with fraud detection or risk modeling",
          "Knowledge of statistics and experimental design",
          "Familiarity with big data tools (Spark, Hadoop)",
          "Master's or PhD in relevant field preferred",
        ],
        benefits: [
          "Competitive salary: $140k - $180k + equity",
          "Comprehensive health insurance",
          "Access to cutting-edge ML infrastructure",
          "Conference and research paper publication support",
          "Remote-first culture",
          "Generous learning budget",
        ],
      },
      "Marketing Manager": {
        responsibilities: [
          "Drive growth and build the VaultPay brand globally",
          "Develop and execute marketing campaigns across channels",
          "Manage content strategy and social media presence",
          "Analyze marketing metrics and optimize performance",
          "Collaborate with product and sales teams",
          "Build partnerships and co-marketing initiatives",
        ],
        qualifications: [
          "5+ years of marketing experience in tech or fintech",
          "Proven track record of driving growth",
          "Experience with digital marketing and analytics tools",
          "Strong writing and content creation skills",
          "Data-driven decision making",
          "Experience managing marketing budgets",
        ],
        benefits: [
          "Competitive salary: $100k - $140k + equity",
          "Comprehensive health benefits",
          "Marketing tools and budget",
          "Professional development opportunities",
          "Remote work flexibility",
          "Creative freedom to build brand",
        ],
      },
    };

    return (
      details[job.title] || {
        responsibilities: [
          "Work on exciting projects in the fintech space",
          "Collaborate with talented team members",
          "Contribute to product innovation",
          "Grow your skills and career",
        ],
        qualifications: [
          "Relevant experience in your field",
          "Passion for fintech and payments",
          "Strong communication skills",
          "Team player mindset",
        ],
        benefits: [
          "Competitive salary and equity",
          "Comprehensive health benefits",
          "Remote work options",
          "Professional development budget",
        ],
      }
    );
  };

  const jobDetails = getJobDetails();

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
        zIndex: 9998,
        padding: fluidUnit(20),
        overflowY: "auto",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: vars.color.vaultWhite,
          borderRadius: fluidUnit(16),
          padding: fluidUnit(48),
          maxWidth: "900px",
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
            fontSize: fluidUnit(40),
            cursor: "pointer",
            color: vars.color.vaultBlack,
            lineHeight: 1,
          }}
        >
          ×
        </button>

        {/* Header */}
        <Typography
          as="h1"
          style={{
            fontSize: fluidUnit(40),
            fontWeight: 700,
            marginBottom: fluidUnit(16),
            color: vars.color.vaultBlack,
          }}
        >
          {job.title}
        </Typography>

        {/* Job Meta */}
        <div
          style={{
            display: "flex",
            gap: fluidUnit(24),
            marginBottom: fluidUnit(32),
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: fluidUnit(8),
              padding: `${fluidUnit(8)} ${fluidUnit(16)}`,
              background: vars.color.neonMint,
              borderRadius: fluidUnit(20),
              border: `2px solid ${vars.color.vaultBlack}`,
            }}
          >
            <span style={{ fontSize: fluidUnit(16) }}>🏢</span>
            <Typography
              as="span"
              style={{
                fontSize: fluidUnit(14),
                fontWeight: 600,
                color: vars.color.vaultBlack,
              }}
            >
              {job.department}
            </Typography>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: fluidUnit(8),
              padding: `${fluidUnit(8)} ${fluidUnit(16)}`,
              background: vars.color.cloudSilver,
              borderRadius: fluidUnit(20),
              border: `2px solid ${vars.color.vaultBlack}`,
            }}
          >
            <span style={{ fontSize: fluidUnit(16) }}>📍</span>
            <Typography
              as="span"
              style={{
                fontSize: fluidUnit(14),
                fontWeight: 600,
                color: vars.color.vaultBlack,
              }}
            >
              {job.location}
            </Typography>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: fluidUnit(8),
              padding: `${fluidUnit(8)} ${fluidUnit(16)}`,
              background: vars.color.cloudSilver,
              borderRadius: fluidUnit(20),
              border: `2px solid ${vars.color.vaultBlack}`,
            }}
          >
            <span style={{ fontSize: fluidUnit(16) }}>🕐</span>
            <Typography
              as="span"
              style={{
                fontSize: fluidUnit(14),
                fontWeight: 600,
                color: vars.color.vaultBlack,
              }}
            >
              {job.type}
            </Typography>
          </div>
        </div>

        {/* Description */}
        <Typography
          as="p"
          style={{
            fontSize: fluidUnit(18),
            lineHeight: 1.6,
            color: vars.color.muted,
            marginBottom: fluidUnit(40),
          }}
        >
          {job.description}
        </Typography>

        {/* Responsibilities */}
        <section style={{ marginBottom: fluidUnit(40) }}>
          <Typography
            as="h2"
            style={{
              fontSize: fluidUnit(28),
              fontWeight: 700,
              marginBottom: fluidUnit(16),
              color: vars.color.vaultBlack,
            }}
          >
            What You'll Do
          </Typography>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {jobDetails.responsibilities.map((item: string, index: number) => (
              <li
                key={index}
                style={{
                  fontSize: fluidUnit(16),
                  lineHeight: 1.8,
                  color: vars.color.muted,
                  marginBottom: fluidUnit(12),
                  paddingLeft: fluidUnit(32),
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    color: vars.color.neonMint,
                    fontWeight: 700,
                    fontSize: fluidUnit(20),
                  }}
                >
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Qualifications */}
        <section style={{ marginBottom: fluidUnit(40) }}>
          <Typography
            as="h2"
            style={{
              fontSize: fluidUnit(28),
              fontWeight: 700,
              marginBottom: fluidUnit(16),
              color: vars.color.vaultBlack,
            }}
          >
            What We're Looking For
          </Typography>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {jobDetails.qualifications.map((item: string, index: number) => (
              <li
                key={index}
                style={{
                  fontSize: fluidUnit(16),
                  lineHeight: 1.8,
                  color: vars.color.muted,
                  marginBottom: fluidUnit(12),
                  paddingLeft: fluidUnit(32),
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    color: vars.color.neonMint,
                    fontWeight: 700,
                    fontSize: fluidUnit(20),
                  }}
                >
                  •
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Benefits */}
        <section style={{ marginBottom: fluidUnit(40) }}>
          <Typography
            as="h2"
            style={{
              fontSize: fluidUnit(28),
              fontWeight: 700,
              marginBottom: fluidUnit(16),
              color: vars.color.vaultBlack,
            }}
          >
            What We Offer
          </Typography>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {jobDetails.benefits.map((item: string, index: number) => (
              <li
                key={index}
                style={{
                  fontSize: fluidUnit(16),
                  lineHeight: 1.8,
                  color: vars.color.muted,
                  marginBottom: fluidUnit(12),
                  paddingLeft: fluidUnit(32),
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    fontSize: fluidUnit(20),
                  }}
                >
                  🎁
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Call to Action */}
        <div
          style={{
            background: vars.color.neonMint,
            padding: fluidUnit(32),
            borderRadius: fluidUnit(12),
            border: `2px solid ${vars.color.vaultBlack}`,
            textAlign: "center",
          }}
        >
          <Typography
            as="p"
            style={{
              fontSize: fluidUnit(18),
              fontWeight: 600,
              marginBottom: fluidUnit(24),
              color: vars.color.vaultBlack,
            }}
          >
            Ready to join the VaultPay team?
          </Typography>
          <Button
            variant="primary"
            size="large"
            label="Apply for this Position"
            onClick={() => {
              onClose();
              onApplyClick();
            }}
            style={{
              fontSize: fluidUnit(18),
              padding: `${fluidUnit(16)} ${fluidUnit(48)}`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

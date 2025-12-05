"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import SplitHero from "@/components/sections/SplitHero";
import { vars } from "@/styles/theme.css";
import Container from "@/components/Layout/Container";
import Typography from "@/components/Typography/Typography";
import { fluidUnit } from "@/styles/fluid-unit";
import TextInput from "@/components/Form/TextInput";
import Button from "@/components/Button/Button";
import { validateContactForm, ClientRateLimiter } from "@/lib/security";

const rateLimiter = new ClientRateLimiter(3, 60000); // 3 attempts per minute

export default function ContactPage() {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Rate limiting check
    if (!rateLimiter.canAttempt('contact-form')) {
      setFormErrors({ general: 'Too many attempts. Please wait a minute before trying again.' });
      return;
    }
    
    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };
    
    // Validate and sanitize
    const validation = validateContactForm(data);
    
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      setSubmitStatus('error');
      return;
    }
    
    // Clear errors
    setFormErrors({});
    
    // Simulate form submission (in production, send to API)
    console.log('Secure form data:', validation.sanitized);
    setSubmitStatus('success');
    
    // Reset form
    e.currentTarget.reset();
    
    // Reset status after 5 seconds
    setTimeout(() => setSubmitStatus('idle'), 5000);
  };
  return (
    <>
      <Navbar />
      <SplitHero
        eyebrow="CONTACT US"
        title="We're here to help"
        description="Have questions? Need support? Want to partner with us? Our team is ready to assist you. Reach out through any of the channels below and we'll get back to you as soon as possible."
        buttonLabel="Get Support"
        buttonVariant="secondary"
        buttonHref="#contact-form"
        imageSrc="/image 95_1.png"
        imageAlt="Contact VaultPay"
        containerSize="2xl"
        gridTemplateColumns="1fr 1fr"
        containerStyle={{ padding: `${vars.space.xl} ${vars.space["4xl"]}` }}
        imageWidth={569}
        imageHeight={458}
        minColWidth={360}
      />

      <section style={{ padding: `${fluidUnit(80)} 0`, background: vars.color.cloudSilver }}>
        <Container size="lg">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: fluidUnit(32),
            }}
          >
            {[
              {
                icon: "📧",
                title: "Email Support",
                info: "support@getvaultpay.co",
                description: "Get help via email. Response time: 24 hours",
              },
              {
                icon: "💬",
                title: "Live Chat",
                info: "Available 24/7",
                description: "Chat with our support team in the app",
              },
              {
                icon: "📞",
                title: "Phone Support",
                info: "+1 (800) VAULTPAY",
                description: "Mon-Fri, 9am-6pm PST",
              },
              {
                icon: "🏢",
                title: "Office",
                info: "Sherman Oaks, CA",
                description: "15442 Ventura Blvd., STE 201-1952",
              },
            ].map((contact, index) => (
              <div
                key={index}
                style={{
                  background: vars.color.vaultWhite,
                  borderRadius: fluidUnit(16),
                  padding: fluidUnit(32),
                  textAlign: "center",
                  border: `2px solid ${vars.color.vaultBlack}`,
                }}
              >
                <div style={{ fontSize: fluidUnit(56), marginBottom: fluidUnit(16) }}>
                  {contact.icon}
                </div>
                <Typography
                  as="h3"
                  style={{
                    fontSize: fluidUnit(24),
                    fontWeight: 700,
                    marginBottom: fluidUnit(8),
                    color: vars.color.vaultBlack,
                  }}
                >
                  {contact.title}
                </Typography>
                <Typography
                  as="p"
                  style={{
                    fontSize: fluidUnit(18),
                    color: vars.color.neonMint,
                    marginBottom: fluidUnit(8),
                    fontWeight: 600,
                  }}
                >
                  {contact.info}
                </Typography>
                <Typography
                  as="p"
                  style={{
                    fontSize: fluidUnit(14),
                    color: vars.color.muted,
                    margin: 0,
                  }}
                >
                  {contact.description}
                </Typography>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section id="contact-form" style={{ padding: `${fluidUnit(80)} 0` }}>
        <Container size="md">
          <Typography
            as="h2"
            style={{
              fontSize: fluidUnit(48),
              fontWeight: 700,
              textAlign: "center",
              marginBottom: fluidUnit(16),
              color: vars.color.vaultBlack,
            }}
          >
            Send us a message
          </Typography>
          <Typography
            as="p"
            style={{
              fontSize: fluidUnit(18),
              textAlign: "center",
              color: vars.color.muted,
              marginBottom: fluidUnit(48),
            }}
          >
            Fill out the form below and our team will get back to you within 24 hours.
          </Typography>
          {submitStatus === 'success' && (
            <div
              style={{
                background: vars.color.neonMint,
                padding: fluidUnit(16),
                borderRadius: fluidUnit(8),
                marginBottom: fluidUnit(24),
                textAlign: "center",
              }}
            >
              <Typography as="p" style={{ margin: 0, color: vars.color.vaultBlack, fontWeight: 600 }}>
                ✓ Message sent successfully! We'll get back to you within 24 hours.
              </Typography>
            </div>
          )}
          {formErrors.general && (
            <div
              style={{
                background: '#ffebee',
                border: '2px solid #f44336',
                padding: fluidUnit(16),
                borderRadius: fluidUnit(8),
                marginBottom: fluidUnit(24),
                textAlign: "center",
              }}
            >
              <Typography as="p" style={{ margin: 0, color: '#c62828', fontWeight: 600 }}>
                {formErrors.general}
              </Typography>
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            style={{
              background: vars.color.vaultWhite,
              border: `2px solid ${vars.color.vaultBlack}`,
              borderRadius: fluidUnit(16),
              padding: fluidUnit(40),
            }}
          >
            <div style={{ display: "grid", gap: fluidUnit(24) }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: fluidUnit(24),
                }}
              >
                <div>
                  <TextInput
                    label="First Name"
                    type="text"
                    name="firstName"
                    placeholder="John"
                    required
                    labelColor={vars.color.vaultBlack}
                  />
                  {formErrors.firstName && (
                    <Typography as="p" style={{ color: '#c62828', fontSize: fluidUnit(12), marginTop: fluidUnit(4) }}>
                      {formErrors.firstName}
                    </Typography>
                  )}
                </div>
                <div>
                  <TextInput
                    label="Last Name"
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    required
                    labelColor={vars.color.vaultBlack}
                  />
                  {formErrors.lastName && (
                    <Typography as="p" style={{ color: '#c62828', fontSize: fluidUnit(12), marginTop: fluidUnit(4) }}>
                      {formErrors.lastName}
                    </Typography>
                  )}
                </div>
              </div>
              <div>
                <TextInput
                  label="Email"
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  required
                  labelColor={vars.color.vaultBlack}
                />
                {formErrors.email && (
                  <Typography as="p" style={{ color: '#c62828', fontSize: fluidUnit(12), marginTop: fluidUnit(4) }}>
                    {formErrors.email}
                  </Typography>
                )}
              </div>
              <div>
                <TextInput
                  label="Subject"
                  type="text"
                  name="subject"
                  placeholder="How can we help?"
                  required
                  labelColor={vars.color.vaultBlack}
                />
                {formErrors.subject && (
                  <Typography as="p" style={{ color: '#c62828', fontSize: fluidUnit(12), marginTop: fluidUnit(4) }}>
                    {formErrors.subject}
                  </Typography>
                )}
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: fluidUnit(14),
                    fontWeight: 600,
                    marginBottom: fluidUnit(8),
                    color: vars.color.vaultBlack,
                  }}
                >
                  Message
                </label>
                <textarea
                  name="message"
                  placeholder="Tell us more about your inquiry..."
                  required
                  rows={6}
                  style={{
                    width: "100%",
                    padding: fluidUnit(12),
                    borderRadius: fluidUnit(8),
                    border: `1px solid ${vars.color.muted}`,
                    fontSize: fluidUnit(16),
                    fontFamily: "inherit",
                    resize: "vertical",
                  }}
                />
                {formErrors.message && (
                  <Typography as="p" style={{ color: '#c62828', fontSize: fluidUnit(12), marginTop: fluidUnit(4) }}>
                    {formErrors.message}
                  </Typography>
                )}
              </div>
              <Button
                variant="primary"
                size="large"
                style={{
                  width: "100%",
                  backgroundColor: vars.color.vaultBlack,
                  color: vars.color.vaultWhite,
                }}
              >
                Send Message
              </Button>
            </div>
          </form>
        </Container>
      </section>

      <Footer />
    </>
  );
}

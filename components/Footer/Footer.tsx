import React from "react";
import * as s from "./Footer.css";
import Container from "@/components/Layout/Container";
import Image from "next/image";
import { AppLink } from "@/components/Link/AppLink";
import Typography from "../Typography/Typography";
import { vars } from "@/styles/theme.css";
import Link from "next/link";

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  dark?: boolean;
}

const Footer: React.FC<FooterProps> = ({ className, dark, style, ...rest }) => {
  return (
    <footer
      className={[s.root, className].filter(Boolean).join(" ")}
      style={{
        ...style,
        backgroundColor: dark ? vars.color.vaultBlack : vars.color.vaultNavie,
      }}
      {...rest}
    >
      <Container
        size="full"
        style={{ paddingRight: vars.space.xl, paddingLeft: vars.space.xl }}
      >
        <div className={s.inner}>
          <div className={s.topRule} />
          <div className={s.columns}>
            {/* Left column: logo, long text, copyright */}
            <div>
              <div className={s.logo}>
                <Link href={"/"}>
                  <Image
                    unoptimized
                    src="/logo_horizontal_white.svg"
                    width={203 * 1.3}
                    height={41 * 1.3}
                    alt="VaultPay"
                  />
                </Link>
              </div>
              <Typography
                as="p"
                style={{
                  color: vars.color.slateGray,
                  margin: vars.space.xl,
                  fontSize: 16,
                }}
              >
                VaultPay™ is a fintech company provided by VaultPay Global Inc, with
                its principal office located at 15442 VENTURA BLVD., STE 201-1952, SHERMAN OAKS, CALIFORNIA 91403, United States of America.
              </Typography>
              <Typography
                as="p"
                style={{
                  fontSize: 12,
                  margin: vars.space.xl,
                  color: vars.color.footerGray,
                  lineHeight: "12px",
                }}
              >
                Copyright © 2025 VaultPay™. All rights reserved. VaultPay™ operates under licenses through our partners and maintains PCI compliance standards for secure payment processing. VaultPay™ is a registered trademark of VaultPay Global Inc. <br /> <br /> All trademarks and brand names
                belong to their respective owners. Use of these trademarks and
                brand names do not represent endorsement by or association with
                this card program. All rights reserved. Standard data rates from
                your wireless service provider may apply. Ability to use money
                sent to you for VaultPay™ payments to other users or authorized
                merchants subject to VaultPay™ verifying your required
                identifying information. The VaultPay™ physical card is issued by
                Venmob LLC in the MIPS BIN network. <br /> <br />
                Card may be used everywhere Visa® and Mastercard® are accepted. Visa® and Mastercard® are registered
                trademarks, and the circles design is a trademark of Visa Inc. and Mastercard
                International Incorporated. All trademarks and brand names
                belong to their respective owners. Use of these trademarks and
                brand names do not represent endorsement by or association with
                this card program. All rights reserved. Standard data rates from
                your wireless service provider may apply.
              </Typography>
            </div>

            {/* Middle column: links and social */}
            <div>
              <div style={{ marginBottom: 48 }}>
                <div className={s.linksRow}>
                  <AppLink
                    href="/send-and-receive"
                    style={{ color: vars.color.vaultWhite }}
                  >
                    Send & Receive
                  </AppLink>
                  <AppLink href="/fees-pricing" style={{ color: vars.color.vaultWhite }}>
                    Fees & Pricing
                  </AppLink>
                  <AppLink href="/features" style={{ color: vars.color.vaultWhite }}>
                    Features
                  </AppLink>
                  <AppLink href="/partners" style={{ color: vars.color.vaultWhite }}>
                    Partners
                  </AppLink>
                  <AppLink href="/developers" style={{ color: vars.color.vaultWhite }}>
                    Developers
                  </AppLink>
                  <AppLink href="/jobs" style={{ color: vars.color.vaultWhite }}>
                    Jobs
                  </AppLink>
                  <AppLink
                    href="/help-center"
                    style={{ color: vars.color.vaultWhite }}
                  >
                    Help
                  </AppLink>
                </div>
              </div>
              <div>
                <h4 className={s.sectionTitle}>Stay in Touch</h4>
                <div className={s.linksRow}>
                  <AppLink href="https://facebook.com/vaultpayglobal" style={{ color: vars.color.vaultWhite }}>
                    Facebook
                  </AppLink>
                  <AppLink href="https://instagram.com/getvaultpay" style={{ color: vars.color.vaultWhite }}>
                    Instagram
                  </AppLink>
                  <AppLink href="https://www.linkedin.com/company/vaultpayglobal" style={{ color: vars.color.vaultWhite }}>
                    LinkedIn
                  </AppLink>
                </div>
              </div>
            </div>

            {/* Right column: other links */}
            <div>
              <div className={s.list}>
                <AppLink href="/about" style={{ color: vars.color.vaultWhite }}>
                  About
                </AppLink>
                <AppLink href="/contact" style={{ color: vars.color.vaultWhite }}>
                  Contact
                </AppLink>
                <AppLink
                  href="/privacy"
                  style={{ color: vars.color.vaultWhite }}
                  className={s.muted}
                >
                  Privacy Policy
                </AppLink>
                <AppLink href="#" style={{ color: vars.color.vaultWhite }}>
                  Terms & Conditions
                </AppLink>
                <AppLink href="/sitemap" style={{ color: vars.color.vaultWhite }}>
                  Site Map
                </AppLink>
                <AppLink href="/accessibility" style={{ color: vars.color.vaultWhite }}>
                  Accessibility
                </AppLink>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

import React from "react";
import * as s from "./Footer.css";
import Container from "@/components/Layout/Container";
import Image from "next/image";
import { AppLink } from "@/components/Link/AppLink";
import Typography from "../Typography/Typography";
import { vars } from "@/styles/theme.css";

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
                <Image
                  unoptimized
                  src="/logo_horizontal_white.png"
                  width={203 * 1.3}
                  height={41 * 1.3}
                  alt="Vault Pay"
                />
              </div>
              <Typography
                as="p"
                style={{
                  color: vars.color.slateGray,
                  margin: vars.space.xl,
                  fontSize: 16,
                }}
              >
                Vault Pay is a financial service provided by Vault Pay LLC, with
                its principal office located at 2400 Hanover Street, Palo Alto,
                CA 94304, United States of America.
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
                Copyright © 2024 Vault Pay. All rights reserved. ATSC (ISO:
                900001) is authorised by the Financial Conduct Authority under
                the Electronic Money Regulations 2023 for the issuing of
                electronic money and payment instruments. Vault Pay is a
                registered trademark of ATSC. Advanced Technology Systems
                Committee & registered with the Financial Conduct Authority as a
                cryptoasset firm under the Money Laundering, and PCI Compliance
                Financing and Transfer of Funds (Information on the Payer)
                Regulations 2023. <br /> <br /> All trademarks and brand names
                belong to their respective owners. Use of these trademarks and
                brand names do not represent endorsement by or association with
                this card program. All rights reserved. Standard data rates from
                your wireless service provider may apply. Ability to use money
                sent to you for Vault Pay payments to other users or authorized
                merchants subject to Vault Pay verifying your required
                identifying information. The Vault Pay Mastercard® is issued by
                The Bancorp Bank pursuant to license by Mastercard International
                Incorporated. <br /> <br />
                The Bancorp Bank; Member FDIC. Card may be used everywhere
                Mastercard is accepted in the U.S. Mastercard is a registered
                trademark, and the circles design is a trademark of Mastercard
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
                  <AppLink href="#" style={{ color: vars.color.vaultWhite }}>
                    Fees & Pricing
                  </AppLink>
                  <AppLink href="#" style={{ color: vars.color.vaultWhite }}>
                    Features
                  </AppLink>
                  <AppLink href="#" style={{ color: vars.color.vaultWhite }}>
                    Partners
                  </AppLink>
                  <AppLink href="#" style={{ color: vars.color.vaultWhite }}>
                    Developers
                  </AppLink>
                  <AppLink href="#" style={{ color: vars.color.vaultWhite }}>
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
                  <AppLink href="#" style={{ color: vars.color.vaultWhite }}>
                    Facebook
                  </AppLink>
                  <AppLink href="#" style={{ color: vars.color.vaultWhite }}>
                    Instagram
                  </AppLink>
                  <AppLink href="#" style={{ color: vars.color.vaultWhite }}>
                    LinkedIn
                  </AppLink>
                  <AppLink href="#" style={{ color: vars.color.vaultWhite }}>
                    X
                  </AppLink>
                </div>
              </div>
            </div>

            {/* Right column: other links */}
            <div>
              <div className={s.list}>
                <AppLink href="#" style={{ color: vars.color.vaultWhite }}>
                  About
                </AppLink>
                <AppLink href="#" style={{ color: vars.color.vaultWhite }}>
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
                <AppLink href="#" style={{ color: vars.color.vaultWhite }}>
                  Site Map
                </AppLink>
                <AppLink href="#" style={{ color: vars.color.vaultWhite }}>
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

import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Container from "@/components/Layout/Container";
import Typography from "@/components/Typography/Typography";
import { fluidUnit } from "@/styles/fluid-unit";

const TermsTitle: React.FC<{ title: string }> = ({ title }) => {
  return (
    <Typography
      as="h2"
      font="Instrument Sans"
      weight={600}
      style={{ fontSize: 18, marginBottom: 8, marginTop: 24 }}
    >
      {title}
    </Typography>
  );
};

const TermsSubtitle: React.FC<{ children: string }> = ({ children }) => {
  return (
    <Typography
      as="h3"
      font="Instrument Sans"
      weight={600}
      style={{ fontSize: 14, marginBottom: 4, marginTop: 16 }}
    >
      {children}
    </Typography>
  );
};

const TermsText: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Typography as="p" style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>
      {children}
    </Typography>
  );
};

const TermsPageH1: React.FC<{ children: string }> = ({ children }) => {
  return (
    <Typography
      as="h1"
      font="Space Grotesk"
      weight={400}
      style={{ fontSize: fluidUnit(80, 40), marginBottom: 8 }}
    >
      {children}
    </Typography>
  );
};

const TermsList: React.FC<{ items: string[] }> = ({ items }) => {
  return (
    <ul style={{ paddingLeft: 24, marginBottom: 12 }}>
      {items.map((item, index) => (
        <li key={index} style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 4 }}>
          {item}
        </li>
      ))}
    </ul>
  );
};

export default function TermsAndConditionsPage() {
  return (
    <>
      <Navbar />
      <Container
        size="lg"
        style={{
          paddingTop: 32,
          paddingBottom: 64,
          marginLeft: fluidUnit(26),
        }}
      >
        <TermsPageH1>Terms & Conditions</TermsPageH1>
        <TermsText>
          <strong>VaultPay Global Inc – User Agreement</strong>
          <br />
          Effective Date: December 5, 2024
          <br />
          Last Updated: December 5, 2024
        </TermsText>

        <Container>
          {/* 1. Agreement to Terms */}
          <TermsTitle title="1. Agreement to Terms" />
          <TermsText>
            Welcome to VaultPay. These Terms and Conditions ("Agreement") constitute a legally binding agreement between you ("User," "you," or "your") and VaultPay Global Inc ("VaultPay," "we," "us," or "our"), a California corporation. VaultPay operates under licenses held by our banking and payment partners to provide financial services.
          </TermsText>
          <TermsText>
            By accessing or using the VaultPay mobile application, website, or any of our services (collectively, the "Services"), you agree to be bound by this Agreement, our Privacy Policy, and all applicable laws and regulations. If you do not agree to these terms, you must not access or use our Services.
          </TermsText>
          <TermsText>
            <strong>IMPORTANT:</strong> This Agreement contains an arbitration provision and class action waiver (Section 18) that affects your rights. Please read it carefully.
          </TermsText>

          {/* 2. Electronic Communications Agreement */}
          <TermsTitle title="2. Electronic Communications Agreement (E-SIGN Disclosure)" />
          <TermsText>
            In accordance with the Electronic Signatures in Global and National Commerce Act (E-SIGN Act), 15 U.S.C. § 7001 et seq., and applicable state laws, you consent to receive electronic communications from VaultPay. By agreeing to these Terms, you acknowledge and consent to:
          </TermsText>
          <TermsList
            items={[
              "Receive all disclosures, notices, agreements, and other communications electronically",
              "Conduct transactions electronically with legally binding effect",
              "Receive electronic statements and transaction records",
              "Use electronic signatures with the same legal validity as handwritten signatures",
            ]}
          />
          <TermsSubtitle>Hardware and Software Requirements</TermsSubtitle>
          <TermsText>
            To access and retain electronic records, you will need: a device with internet access, a current web browser (Chrome, Safari, Firefox, or Edge), a valid email address, and sufficient storage to save or print communications.
          </TermsText>
          <TermsText>
            You may withdraw your consent to receive electronic communications by contacting us at legal@getvaultpay.co. Withdrawal of consent may result in termination of your account.
          </TermsText>

          {/* 3. Eligibility */}
          <TermsTitle title="3. Eligibility Requirements" />
          <TermsText>
            To use VaultPay Services, you must:
          </TermsText>
          <TermsList
            items={[
              "Be at least 18 years of age (or the age of majority in your jurisdiction)",
              "Be a U.S. citizen, permanent resident, or authorized to work in the United States",
              "Provide accurate, current, and complete identity information",
              "Not be located in, under the control of, or a national or resident of any country subject to U.S. sanctions",
              "Not be listed on the Specially Designated Nationals (SDN) List maintained by OFAC or any other U.S. government prohibited parties list",
              "Not have previously been suspended or removed from our Services",
            ]}
          />

          {/* 4. Account Registration and Verification */}
          <TermsTitle title="4. Account Registration and Identity Verification" />
          <TermsSubtitle>4.1 Know Your Customer (KYC) Requirements</TermsSubtitle>
          <TermsText>
            As a regulated financial services provider, VaultPay is required to verify your identity pursuant to the Bank Secrecy Act (BSA), USA PATRIOT Act, and FinCEN regulations. You agree to provide:
          </TermsText>
          <TermsList
            items={[
              "Full legal name as it appears on government-issued identification",
              "Date of birth",
              "Social Security Number (SSN) or Individual Taxpayer Identification Number (ITIN)",
              "Current residential address (P.O. boxes not accepted for primary address)",
              "Valid government-issued photo identification",
              "Additional documentation as may be required for enhanced due diligence",
            ]}
          />
          <TermsSubtitle>4.2 Account Security</TermsSubtitle>
          <TermsText>
            You are responsible for maintaining the confidentiality of your account credentials, including your password and PIN. You agree to: (a) create a strong, unique password; (b) enable multi-factor authentication when available; (c) immediately notify VaultPay of any unauthorized access; and (d) never share your credentials with third parties. VaultPay will never ask for your full password via email, phone, or text message.
          </TermsText>

          {/* 5. Payment Services */}
          <TermsTitle title="5. Payment Services" />
          <TermsSubtitle>5.1 Scope of Services</TermsSubtitle>
          <TermsText>
            VaultPay provides the following payment services subject to this Agreement:
          </TermsText>
          <TermsList
            items={[
              "Digital wallet services for storing and managing funds",
              "Peer-to-peer (P2P) money transfers within the United States",
              "Bill payment services",
              "Debit card services (subject to separate Cardholder Agreement)",
              "Currency conversion services (where available)",
              "International remittances (subject to applicable laws and available corridors)",
            ]}
          />
          <TermsSubtitle>5.2 Transaction Limits</TermsSubtitle>
          <TermsText>
            VaultPay imposes transaction limits based on your verification level, account history, and regulatory requirements. Limits may include daily, weekly, and monthly caps on sending, receiving, and withdrawing funds. Current limits are displayed in your account settings and may be adjusted at our discretion.
          </TermsText>
          <TermsSubtitle>5.3 Authorization and Finality</TermsSubtitle>
          <TermsText>
            By initiating a transaction, you authorize VaultPay to execute the payment on your behalf. Once submitted, transactions cannot be cancelled or reversed except as required by law or in cases of demonstrated error or fraud. You acknowledge that payment instructions properly authenticated using your credentials are considered authorized by you.
          </TermsText>

          {/* 6. Fees and Charges */}
          <TermsTitle title="6. Fees and Charges" />
          <TermsText>
            VaultPay may charge fees for certain Services, including but not limited to: instant transfers, ATM withdrawals, currency conversion, and international remittances. All applicable fees are disclosed before you authorize a transaction and are detailed in our Fee Schedule, available at getvaultpay.co/fees-pricing or within the App.
          </TermsText>
          <TermsText>
            We reserve the right to modify our fee structure with 30 days&apos; prior notice. Your continued use of the Services after such notice constitutes acceptance of the updated fees.
          </TermsText>

          {/* 7. Funding Sources and Linked Accounts */}
          <TermsTitle title="7. Funding Sources and Linked Accounts" />
          <TermsText>
            You may link external bank accounts or debit cards to fund your VaultPay wallet. By linking a funding source, you represent that you are the authorized holder of that account. VaultPay uses third-party service providers to verify and process linked accounts. We are not responsible for any fees charged by your bank or card issuer.
          </TermsText>
          <TermsText>
            If any funding transaction is returned, reversed, or otherwise fails (e.g., due to insufficient funds, account closure, or unauthorized use), you authorize VaultPay to recover the amount from your VaultPay balance or linked accounts, and you agree to pay any associated fees.
          </TermsText>

          {/* 8. Prohibited Activities */}
          <TermsTitle title="8. Prohibited Activities" />
          <TermsText>
            You agree not to use VaultPay Services for any unlawful purpose or in violation of this Agreement. Prohibited activities include, but are not limited to:
          </TermsText>
          <TermsList
            items={[
              "Money laundering, terrorist financing, or other financial crimes",
              "Transactions involving sanctioned countries, entities, or individuals",
              "Fraud, identity theft, or misrepresentation",
              "Purchasing illegal goods or services, including controlled substances",
              "Gambling (unless legally licensed and explicitly permitted)",
              "Circumventing transaction limits or verification requirements",
              "Operating an unlicensed money transmission business",
              "Violating intellectual property rights or other third-party rights",
              "Reverse engineering, decompiling, or tampering with the Services",
              "Using the Services in a manner that could damage, disable, or impair VaultPay",
            ]}
          />
          <TermsText>
            VaultPay reserves the right to suspend or terminate accounts engaged in prohibited activities without prior notice and to report such activities to law enforcement and regulatory authorities.
          </TermsText>

          {/* 9. Anti-Money Laundering and Sanctions Compliance */}
          <TermsTitle title="9. Anti-Money Laundering (AML) and Sanctions Compliance" />
          <TermsText>
            VaultPay maintains a comprehensive AML compliance program in accordance with the Bank Secrecy Act, USA PATRIOT Act, and FinCEN regulations. Our program includes:
          </TermsText>
          <TermsList
            items={[
              "Customer identification and verification procedures",
              "Ongoing transaction monitoring and suspicious activity detection",
              "Screening against OFAC sanctions lists and other government watchlists",
              "Filing of Suspicious Activity Reports (SARs) and Currency Transaction Reports (CTRs) as required",
              "Recordkeeping and retention in accordance with regulatory requirements",
            ]}
          />
          <TermsText>
            You agree to cooperate with VaultPay in fulfilling our compliance obligations, including providing additional information or documentation upon request. We may delay, block, or refuse any transaction that we believe may violate applicable laws or our policies.
          </TermsText>

          {/* 10. Privacy and Data Security */}
          <TermsTitle title="10. Privacy and Data Security" />
          <TermsText>
            Your privacy is important to us. Our collection, use, and disclosure of personal information is governed by our Privacy Policy, available at getvaultpay.co/privacy. By using the Services, you consent to the practices described in the Privacy Policy.
          </TermsText>
          <TermsText>
            VaultPay implements industry-standard security measures to protect your data, including encryption, secure data storage, and access controls. However, no system is completely secure, and we cannot guarantee absolute security. You are responsible for maintaining the security of your devices and credentials.
          </TermsText>

          {/* 11. Intellectual Property */}
          <TermsTitle title="11. Intellectual Property" />
          <TermsText>
            VaultPay and its licensors own all rights, title, and interest in the Services, including all software, content, trademarks, logos, and other intellectual property. You are granted a limited, non-exclusive, non-transferable, revocable license to use the Services for personal, non-commercial purposes in accordance with this Agreement.
          </TermsText>
          <TermsText>
            You may not copy, modify, distribute, sell, or lease any part of our Services or included software, nor may you reverse engineer or attempt to extract the source code of that software.
          </TermsText>

          {/* 12. Third-Party Services */}
          <TermsTitle title="12. Third-Party Services" />
          <TermsText>
            The Services may contain links to or integrations with third-party websites, applications, or services. VaultPay is not responsible for the content, privacy practices, or terms of any third-party services. Your use of third-party services is at your own risk and subject to the terms and conditions of those third parties.
          </TermsText>

          {/* 13. Disclaimers */}
          <TermsTitle title="13. Disclaimers" />
          <TermsText>
            THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. VAULTPAY DOES NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE.
          </TermsText>
          <TermsText>
            VaultPay is not a bank. Your VaultPay balance is not a deposit account and is not insured by the Federal Deposit Insurance Corporation (FDIC). Funds held in your VaultPay wallet are maintained in pooled accounts at FDIC-insured banks for your benefit, subject to applicable terms.
          </TermsText>

          {/* 14. Limitation of Liability */}
          <TermsTitle title="14. Limitation of Liability" />
          <TermsText>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, VAULTPAY, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
          </TermsText>
          <TermsList
            items={[
              "Your access to or use of (or inability to access or use) the Services",
              "Any conduct or content of any third party on the Services",
              "Any content obtained from the Services",
              "Unauthorized access, use, or alteration of your transmissions or content",
            ]}
          />
          <TermsText>
            IN NO EVENT SHALL VAULTPAY&apos;S TOTAL LIABILITY TO YOU FOR ALL CLAIMS EXCEED THE GREATER OF (A) THE AMOUNT OF FEES PAID BY YOU TO VAULTPAY IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM OR (B) ONE HUNDRED DOLLARS ($100).
          </TermsText>

          {/* 15. Indemnification */}
          <TermsTitle title="15. Indemnification" />
          <TermsText>
            You agree to indemnify, defend, and hold harmless VaultPay and its affiliates, officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable attorneys&apos; fees) arising out of or in any way connected with: (a) your access to or use of the Services; (b) your violation of this Agreement; (c) your violation of any third-party rights; or (d) your violation of any applicable laws or regulations.
          </TermsText>

          {/* 16. Error Resolution and Unauthorized Transactions */}
          <TermsTitle title="16. Error Resolution and Unauthorized Transactions" />
          <TermsText>
            In accordance with the Electronic Fund Transfer Act (EFTA) and Regulation E, you have certain rights regarding errors and unauthorized transactions:
          </TermsText>
          <TermsSubtitle>16.1 Reporting Errors</TermsSubtitle>
          <TermsText>
            If you believe an error has occurred or an unauthorized transaction has been made from your account, contact us immediately at support@getvaultpay.co or call 1-800-VAULTPAY. You must notify us within 60 days after the error appeared on your statement.
          </TermsText>
          <TermsSubtitle>16.2 Your Liability for Unauthorized Transfers</TermsSubtitle>
          <TermsText>
            If you notify us within 2 business days of learning of the loss or theft of your credentials, your liability is limited to $50. If you do not notify us within 2 business days, your liability may increase to $500. If you do not report an unauthorized transfer within 60 days of when your statement was made available, you may be liable for the full amount of transfers made after the 60-day period.
          </TermsText>
          <TermsSubtitle>16.3 Investigation Timeline</TermsSubtitle>
          <TermsText>
            We will investigate your complaint within 10 business days (20 business days for new accounts) and report results within 3 business days after completing the investigation. If more time is needed, we may take up to 45 days (90 days for certain transactions) and will provisionally credit your account within 10 business days.
          </TermsText>

          {/* 17. Account Suspension and Termination */}
          <TermsTitle title="17. Account Suspension and Termination" />
          <TermsText>
            VaultPay may suspend, limit, or terminate your account and access to the Services at any time for any reason, including but not limited to: violation of this Agreement, suspected fraudulent or illegal activity, regulatory requirements, or extended inactivity. We will provide notice when possible, unless prohibited by law or if doing so would compromise our security or investigation.
          </TermsText>
          <TermsText>
            You may close your account at any time by contacting customer support. Upon termination, you remain liable for all obligations under this Agreement, including any fees owed. We will return any remaining balance to you, less any amounts owed to VaultPay, in accordance with applicable law.
          </TermsText>

          {/* 18. Dispute Resolution and Arbitration */}
          <TermsTitle title="18. Dispute Resolution and Arbitration Agreement" />
          <TermsText>
            <strong>PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS, INCLUDING YOUR RIGHT TO FILE A LAWSUIT IN COURT.</strong>
          </TermsText>
          <TermsSubtitle>18.1 Informal Resolution</TermsSubtitle>
          <TermsText>
            Before initiating arbitration, you agree to contact VaultPay at legal@getvaultpay.co to attempt to resolve any dispute informally. We will attempt to resolve the dispute within 30 days.
          </TermsText>
          <TermsSubtitle>18.2 Binding Arbitration</TermsSubtitle>
          <TermsText>
            If informal resolution is unsuccessful, any dispute, claim, or controversy arising out of or relating to this Agreement or the Services shall be resolved by binding arbitration administered by the American Arbitration Association (AAA) in accordance with its Consumer Arbitration Rules. The arbitration will be conducted in the English language in the county of your residence or Santa Clara County, California, at your election.
          </TermsText>
          <TermsSubtitle>18.3 Class Action Waiver</TermsSubtitle>
          <TermsText>
            YOU AND VAULTPAY AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING. Unless both you and VaultPay agree otherwise, the arbitrator may not consolidate more than one person&apos;s claims.
          </TermsText>
          <TermsSubtitle>18.4 Opt-Out</TermsSubtitle>
          <TermsText>
            You may opt out of this arbitration agreement by sending written notice to legal@getvaultpay.co within 30 days of first accepting this Agreement. Your notice must include your name, address, and a clear statement that you wish to opt out.
          </TermsText>

          {/* 19. Governing Law */}
          <TermsTitle title="19. Governing Law" />
          <TermsText>
            This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of laws principles. For any matters not subject to arbitration, you consent to the exclusive jurisdiction of the state and federal courts located in Delaware.
          </TermsText>

          {/* 20. Amendments */}
          <TermsTitle title="20. Amendments to this Agreement" />
          <TermsText>
            VaultPay reserves the right to modify this Agreement at any time. We will notify you of material changes by posting the updated Agreement on our website and/or sending notice to your registered email address at least 30 days before the changes take effect. Your continued use of the Services after the effective date constitutes acceptance of the modified Agreement. If you do not agree to the changes, you must stop using the Services and close your account.
          </TermsText>

          {/* 21. General Provisions */}
          <TermsTitle title="21. General Provisions" />
          <TermsSubtitle>21.1 Entire Agreement</TermsSubtitle>
          <TermsText>
            This Agreement, together with the Privacy Policy and any other agreements expressly incorporated by reference, constitutes the entire agreement between you and VaultPay concerning the Services.
          </TermsText>
          <TermsSubtitle>21.2 Severability</TermsSubtitle>
          <TermsText>
            If any provision of this Agreement is held to be invalid or unenforceable, such provision shall be modified to the minimum extent necessary, and the remaining provisions shall continue in full force and effect.
          </TermsText>
          <TermsSubtitle>21.3 Waiver</TermsSubtitle>
          <TermsText>
            The failure of VaultPay to enforce any right or provision of this Agreement shall not constitute a waiver of such right or provision.
          </TermsText>
          <TermsSubtitle>21.4 Assignment</TermsSubtitle>
          <TermsText>
            You may not assign or transfer this Agreement or your rights hereunder without VaultPay&apos;s prior written consent. VaultPay may assign this Agreement without restriction.
          </TermsText>
          <TermsSubtitle>21.5 Notices</TermsSubtitle>
          <TermsText>
            Notices to you may be sent to your registered email address or through the App. Notices to VaultPay should be sent to: VaultPay Global Inc, 15442 Ventura Blvd., Ste 201-1952, Sherman Oaks, CA 91403, or legal@getvaultpay.co.
          </TermsText>

          {/* 22. Contact Information */}
          <TermsTitle title="22. Contact Information" />
          <TermsText>
            If you have any questions about this Agreement or the Services, please contact us:
          </TermsText>
          <TermsText>
            <strong>VaultPay Global Inc</strong>
            <br />
            15442 Ventura Blvd., Ste 201-1952
            <br />
            Sherman Oaks, CA 91403
            <br />
            Email: support@getvaultpay.co
            <br />
            Legal Inquiries: legal@getvaultpay.co
            <br />
            Phone: 1-800-VAULTPAY
          </TermsText>
          <TermsText>
            For complaints that cannot be resolved directly with VaultPay, you may file a complaint with the Consumer Financial Protection Bureau (CFPB) at consumerfinance.gov/complaint or with your state&apos;s financial regulatory agency.
          </TermsText>

          {/* State-Specific Disclosures */}
          <TermsTitle title="23. State-Specific Disclosures" />
          <TermsText>
            VaultPay Global Inc operates under licenses held by our banking and payment partners in states where required. License information is available upon request and at getvaultpay.co/licenses.
          </TermsText>
          <TermsText>
            <strong>California Residents:</strong> If you have a complaint, you may contact the California Department of Financial Protection and Innovation at 1-866-275-2677 or dfpi.ca.gov.
          </TermsText>
          <TermsText>
            <strong>Texas Residents:</strong> If you have a complaint, first contact VaultPay. If still unresolved, contact the Texas Department of Banking at 1-877-276-5554 or dob.texas.gov.
          </TermsText>
          <TermsText>
            <strong>New York Residents:</strong> VaultPay Global Inc operates under partner licenses with the New York State Department of Financial Services. Complaints may be directed to the Consumer Assistance Unit at 1-800-342-3736.
          </TermsText>
        </Container>
      </Container>
      <Footer />
    </>
  );
}

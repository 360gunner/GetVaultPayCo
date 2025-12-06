"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import SplitHero from "@/components/sections/SplitHero";
import { vars } from "@/styles/theme.css";
import Container from "@/components/Layout/Container";
import Typography from "@/components/Typography/Typography";
import { fluidUnit } from "@/styles/fluid-unit";

// Countries with USD bank account availability (excluding US-sanctioned jurisdictions)
const availableCountries = [
  { name: "Albania", fee: "$3.00" },
  { name: "Algeria", fee: "$3.00" },
  { name: "Argentina", fee: "$3.00" },
  { name: "Australia", fee: "$3.00" },
  { name: "Austria", fee: "$3.00" },
  { name: "Bahamas", fee: "$3.00" },
  { name: "Bahrain", fee: "$3.00" },
  { name: "Bangladesh", fee: "$3.00" },
  { name: "Belgium", fee: "$3.00" },
  { name: "Belize", fee: "$3.00" },
  { name: "Benin", fee: "$3.00" },
  { name: "Bhutan", fee: "$3.00" },
  { name: "Bolivia", fee: "$3.00" },
  { name: "Bosnia and Herzegovina", fee: "$3.00" },
  { name: "Botswana", fee: "$3.00" },
  { name: "Brazil", fee: "$3.00" },
  { name: "Brunei", fee: "$3.00" },
  { name: "Bulgaria", fee: "$3.00" },
  { name: "Burkina Faso", fee: "$3.00" },
  { name: "Cameroon", fee: "$3.00" },
  { name: "Canada", fee: "FREE" },
  { name: "Cape Verde", fee: "$3.00" },
  { name: "Chile", fee: "$3.00" },
  { name: "Colombia", fee: "$3.00" },
  { name: "Costa Rica", fee: "$3.00" },
  { name: "Côte d'Ivoire", fee: "$3.00" },
  { name: "Croatia", fee: "$3.00" },
  { name: "Cyprus", fee: "$3.00" },
  { name: "Czech Republic", fee: "$3.00" },
  { name: "Denmark", fee: "$3.00" },
  { name: "Dominican Republic", fee: "$3.00" },
  { name: "Ecuador", fee: "$3.00" },
  { name: "Egypt", fee: "$3.00" },
  { name: "El Salvador", fee: "$3.00" },
  { name: "Estonia", fee: "$3.00" },
  { name: "Ethiopia", fee: "$3.00" },
  { name: "Fiji", fee: "$3.00" },
  { name: "Finland", fee: "$3.00" },
  { name: "France", fee: "$3.00" },
  { name: "Gambia", fee: "$3.00" },
  { name: "Georgia", fee: "$3.00" },
  { name: "Germany", fee: "$3.00" },
  { name: "Ghana", fee: "$3.00" },
  { name: "Greece", fee: "$3.00" },
  { name: "Guatemala", fee: "$3.00" },
  { name: "Guyana", fee: "$3.00" },
  { name: "Honduras", fee: "$3.00" },
  { name: "Hong Kong", fee: "$3.00" },
  { name: "Hungary", fee: "$3.00" },
  { name: "Iceland", fee: "$3.00" },
  { name: "India", fee: "$3.00" },
  { name: "Indonesia", fee: "$3.00" },
  { name: "Ireland", fee: "$3.00" },
  { name: "Israel", fee: "$3.00" },
  { name: "Italy", fee: "$3.00" },
  { name: "Jamaica", fee: "$3.00" },
  { name: "Japan", fee: "$3.00" },
  { name: "Jordan", fee: "$3.00" },
  { name: "Kazakhstan", fee: "$3.00" },
  { name: "Kenya", fee: "$3.00" },
  { name: "Kuwait", fee: "$3.00" },
  { name: "Latvia", fee: "$3.00" },
  { name: "Lesotho", fee: "$3.00" },
  { name: "Liechtenstein", fee: "$3.00" },
  { name: "Lithuania", fee: "$3.00" },
  { name: "Luxembourg", fee: "$3.00" },
  { name: "Madagascar", fee: "$3.00" },
  { name: "Malawi", fee: "$3.00" },
  { name: "Malaysia", fee: "$3.00" },
  { name: "Maldives", fee: "$3.00" },
  { name: "Mali", fee: "$3.00" },
  { name: "Malta", fee: "$3.00" },
  { name: "Mauritius", fee: "$3.00" },
  { name: "Mexico", fee: "$3.00" },
  { name: "Moldova", fee: "$3.00" },
  { name: "Monaco", fee: "$3.00" },
  { name: "Mongolia", fee: "$3.00" },
  { name: "Montenegro", fee: "$3.00" },
  { name: "Mozambique", fee: "$3.00" },
  { name: "Namibia", fee: "$3.00" },
  { name: "Nepal", fee: "$3.00" },
  { name: "Netherlands", fee: "$3.00" },
  { name: "New Zealand", fee: "$3.00" },
  { name: "Niger", fee: "$3.00" },
  { name: "Nigeria", fee: "$3.00" },
  { name: "North Macedonia", fee: "$3.00" },
  { name: "Norway", fee: "$3.00" },
  { name: "Oman", fee: "$3.00" },
  { name: "Pakistan", fee: "$3.00" },
  { name: "Panama", fee: "$3.00" },
  { name: "Paraguay", fee: "$3.00" },
  { name: "Peru", fee: "$3.00" },
  { name: "Philippines", fee: "$3.00" },
  { name: "Poland", fee: "$3.00" },
  { name: "Portugal", fee: "$3.00" },
  { name: "Qatar", fee: "$3.00" },
  { name: "Romania", fee: "$3.00" },
  { name: "Rwanda", fee: "$3.00" },
  { name: "San Marino", fee: "$3.00" },
  { name: "Saudi Arabia", fee: "$3.00" },
  { name: "Senegal", fee: "$3.00" },
  { name: "Serbia", fee: "$3.00" },
  { name: "Seychelles", fee: "$3.00" },
  { name: "Sierra Leone", fee: "$3.00" },
  { name: "Singapore", fee: "$3.00" },
  { name: "Slovakia", fee: "$3.00" },
  { name: "Slovenia", fee: "$3.00" },
  { name: "South Africa", fee: "$3.00" },
  { name: "South Korea", fee: "$3.00" },
  { name: "Spain", fee: "$3.00" },
  { name: "Sri Lanka", fee: "$3.00" },
  { name: "Suriname", fee: "$3.00" },
  { name: "Sweden", fee: "$3.00" },
  { name: "Switzerland", fee: "$3.00" },
  { name: "Taiwan", fee: "$3.00" },
  { name: "Tanzania", fee: "$3.00" },
  { name: "Thailand", fee: "$3.00" },
  { name: "Togo", fee: "$3.00" },
  { name: "Trinidad and Tobago", fee: "$3.00" },
  { name: "Tunisia", fee: "$3.00" },
  { name: "Turkey", fee: "$3.00" },
  { name: "Uganda", fee: "$3.00" },
  { name: "Ukraine", fee: "$3.00" },
  { name: "United Arab Emirates", fee: "$3.00" },
  { name: "United Kingdom", fee: "$3.00" },
  { name: "United States", fee: "FREE" },
  { name: "Uruguay", fee: "$3.00" },
  { name: "Uzbekistan", fee: "$3.00" },
  { name: "Vietnam", fee: "$3.00" },
  { name: "Zambia", fee: "$3.00" },
  { name: "Zimbabwe", fee: "$3.00" },
];

const feeTableData = [
  {
    service: "MIPS Physical Card",
    price: "$20.00",
    details: "One-time issuance fee",
    category: "cards",
  },
  {
    service: "Virtual Card (Visa/Mastercard)",
    price: "$5.00",
    details: "Monthly limit: $10,000 USD",
    category: "cards",
  },
  {
    service: "Peer-to-Peer Transfer",
    price: "1.5%",
    details: "Min $0.99 — Max $5.00 USD per transaction",
    category: "transfers",
  },
  {
    service: "SEPA Transfer",
    price: "1% - 7%",
    details: "Min €0.99 — Max €10.00 EUR per transfer",
    category: "transfers",
  },
  {
    service: "SEPA Instant",
    price: "FREE",
    details: "Instant transfers within SEPA zone",
    category: "transfers",
    highlight: true,
  },
  {
    service: "ACH Next Day",
    price: "$5.00",
    details: "Next business day transfer (US)",
    category: "transfers",
  },
  {
    service: "ACH Instant",
    price: "$10.00",
    details: "Same-day instant transfer (US)",
    category: "transfers",
  },
  {
    service: "SWIFT Transfer",
    price: "$30.00",
    details: "Max $10,000 (Personal) / $250,000 (Business)",
    category: "transfers",
  },
  {
    service: "Crypto Payout",
    price: "$1.00",
    details: "Fixed fee per crypto withdrawal",
    category: "crypto",
  },
  {
    service: "Monthly Account Fee",
    price: "$0.00",
    details: "No monthly fees ever",
    category: "account",
    highlight: true,
  },
];

export default function FeesPage() {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [showCountryList, setShowCountryList] = useState(false);

  const selectedCountryData = availableCountries.find(
    (c) => c.name === selectedCountry
  );

  return (
    <>
      <Navbar />
      <SplitHero
        eyebrow="FEES"
        title="No Hidden Fees with VaultPay"
        description="We believe in complete transparency. Every fee is clearly displayed upfront so you always know exactly what you're paying. No surprises, no hidden charges, just straightforward pricing."
        buttonLabel="Get Started"
        buttonVariant="secondary"
        buttonHref="/signup"
        imageSrc="/fees-pricing-hero.svg"
        imageAlt="VaultPay Transparent Fees - No Hidden Fees"
        containerSize="2xl"
        gridTemplateColumns="1fr 1fr"
        containerStyle={{ padding: `${vars.space.xl} ${vars.space["4xl"]}` }}
        imageWidth={569}
        imageHeight={458}
        minColWidth={360}
      />

      {/* Fee Table Section */}
      <section
        style={{ padding: `${fluidUnit(80)} 0`, background: vars.color.vaultWhite }}
      >
        <Container size="lg">
          <Typography
            as="h2"
            style={{
              fontSize: fluidUnit(48),
              fontWeight: 700,
              textAlign: "center",
              marginBottom: fluidUnit(24),
              color: vars.color.vaultBlack,
            }}
          >
            Our Pricing
          </Typography>
          <Typography
            as="p"
            style={{
              fontSize: fluidUnit(18),
              textAlign: "center",
              marginBottom: fluidUnit(64),
              color: vars.color.muted,
              maxWidth: 600,
              margin: "0 auto",
              marginTop: fluidUnit(16),
            }}
          >
            Simple, transparent fees for all VaultPay services
          </Typography>

          {/* Fee Table */}
          <div
            style={{
              maxWidth: 900,
              margin: "0 auto",
              marginTop: fluidUnit(48),
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: vars.color.vaultWhite,
                borderRadius: fluidUnit(16),
                overflow: "hidden",
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: vars.color.vaultBlack,
                  }}
                >
                  <th
                    style={{
                      padding: fluidUnit(24),
                      textAlign: "left",
                      color: vars.color.vaultWhite,
                      fontSize: fluidUnit(18),
                      fontWeight: 700,
                    }}
                  >
                    Service
                  </th>
                  <th
                    style={{
                      padding: fluidUnit(24),
                      textAlign: "center",
                      color: vars.color.vaultWhite,
                      fontSize: fluidUnit(18),
                      fontWeight: 700,
                    }}
                  >
                    Price
                  </th>
                  <th
                    style={{
                      padding: fluidUnit(24),
                      textAlign: "left",
                      color: vars.color.vaultWhite,
                      fontSize: fluidUnit(18),
                      fontWeight: 700,
                    }}
                  >
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {feeTableData.map((row, index) => {
                  const isHighlight = (row as { highlight?: boolean }).highlight;
                  const isFree = row.price === "FREE" || row.price === "$0.00";
                  return (
                    <tr
                      key={index}
                      style={{
                        borderBottom: `1px solid ${vars.color.cloudSilver}`,
                        background: isHighlight
                          ? vars.color.neonMint
                          : index % 2 === 0
                          ? vars.color.vaultWhite
                          : "#f9fafb",
                      }}
                    >
                      <td
                        style={{
                          padding: fluidUnit(20),
                          fontSize: fluidUnit(16),
                          fontWeight: 600,
                          color: vars.color.vaultBlack,
                        }}
                      >
                        {row.service}
                      </td>
                      <td
                        style={{
                          padding: fluidUnit(20),
                          textAlign: "center",
                          fontSize: fluidUnit(20),
                          fontWeight: 700,
                          color: isFree ? "#16a34a" : vars.color.vaultBlack,
                        }}
                      >
                        {row.price}
                      </td>
                      <td
                        style={{
                          padding: fluidUnit(20),
                          fontSize: fluidUnit(14),
                          color: vars.color.muted,
                        }}
                      >
                        {row.details}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* USD Bank Account Section */}
      <section
        style={{ padding: `${fluidUnit(80)} 0`, background: vars.color.cloudSilver }}
      >
        <Container size="lg">
          <Typography
            as="h2"
            style={{
              fontSize: fluidUnit(48),
              fontWeight: 700,
              textAlign: "center",
              marginBottom: fluidUnit(24),
              color: vars.color.vaultBlack,
            }}
          >
            USD Bank Account
          </Typography>
          <Typography
            as="p"
            style={{
              fontSize: fluidUnit(18),
              textAlign: "center",
              marginBottom: fluidUnit(48),
              color: vars.color.muted,
              maxWidth: 700,
              margin: "0 auto",
            }}
          >
            Get a USD bank account from virtually anywhere in the world. Monthly
            maintenance fee depends on your country of residence.
          </Typography>

          <div
            style={{
              maxWidth: 600,
              margin: "0 auto",
              marginTop: fluidUnit(48),
              background: vars.color.vaultWhite,
              borderRadius: fluidUnit(16),
              padding: fluidUnit(40),
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            }}
          >
            {/* Default fee display */}
            <div
              style={{
                textAlign: "center",
                marginBottom: fluidUnit(32),
                padding: fluidUnit(24),
                background: vars.color.neonMint,
                borderRadius: fluidUnit(12),
              }}
            >
              <Typography
                as="p"
                style={{
                  fontSize: fluidUnit(14),
                  color: vars.color.vaultBlack,
                  marginBottom: fluidUnit(8),
                  fontWeight: 500,
                }}
              >
                Starting from
              </Typography>
              <Typography
                as="p"
                style={{
                  fontSize: fluidUnit(48),
                  fontWeight: 700,
                  color: vars.color.vaultBlack,
                  marginBottom: fluidUnit(8),
                }}
              >
                $3.00
              </Typography>
              <Typography
                as="p"
                style={{
                  fontSize: fluidUnit(16),
                  color: vars.color.vaultBlack,
                }}
              >
                per month to keep your account active
              </Typography>
            </div>

            {/* Country selector */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: fluidUnit(14),
                  fontWeight: 600,
                  marginBottom: fluidUnit(12),
                  color: vars.color.vaultBlack,
                }}
              >
                Select your country to view pricing:
              </label>
              <div style={{ position: "relative" }}>
                <select
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    setShowCountryList(false);
                  }}
                  style={{
                    width: "100%",
                    padding: fluidUnit(16),
                    fontSize: fluidUnit(16),
                    border: `2px solid ${vars.color.cloudSilver}`,
                    borderRadius: fluidUnit(8),
                    background: vars.color.vaultWhite,
                    color: vars.color.vaultBlack,
                    cursor: "pointer",
                    appearance: "none",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                    backgroundSize: "20px",
                  }}
                >
                  <option value="">Choose a country...</option>
                  {availableCountries.map((country) => (
                    <option key={country.name} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCountry && selectedCountryData && (
                <div
                  style={{
                    marginTop: fluidUnit(24),
                    padding: fluidUnit(20),
                    background: "#f0fdf4",
                    borderRadius: fluidUnit(8),
                    border: `1px solid ${vars.color.neonMint}`,
                  }}
                >
                  <Typography
                    as="p"
                    style={{
                      fontSize: fluidUnit(16),
                      color: vars.color.vaultBlack,
                    }}
                  >
                    <strong>{selectedCountryData.name}</strong>: USD Bank Account
                    maintenance fee is{" "}
                    <strong style={{ color: selectedCountryData.fee === "FREE" ? "#16a34a" : vars.color.vaultBlack }}>
                      {selectedCountryData.fee === "FREE" ? "FREE" : `${selectedCountryData.fee}/month`}
                    </strong>
                  </Typography>
                </div>
              )}
            </div>

            {/* Toggle country list */}
            <button
              onClick={() => setShowCountryList(!showCountryList)}
              style={{
                marginTop: fluidUnit(24),
                padding: `${fluidUnit(12)} ${fluidUnit(24)}`,
                background: "transparent",
                border: `2px solid ${vars.color.vaultBlack}`,
                borderRadius: fluidUnit(8),
                fontSize: fluidUnit(14),
                fontWeight: 600,
                color: vars.color.vaultBlack,
                cursor: "pointer",
                width: "100%",
                transition: "all 0.2s ease",
              }}
            >
              {showCountryList ? "Hide" : "View"} All Available Countries (
              {availableCountries.length})
            </button>

            {showCountryList && (
              <div
                style={{
                  marginTop: fluidUnit(24),
                  maxHeight: 400,
                  overflowY: "auto",
                  border: `1px solid ${vars.color.cloudSilver}`,
                  borderRadius: fluidUnit(8),
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                    gap: fluidUnit(1),
                  }}
                >
                  {availableCountries.map((country, index) => (
                    <div
                      key={country.name}
                      style={{
                        padding: fluidUnit(12),
                        background:
                          index % 2 === 0 ? vars.color.vaultWhite : "#f9fafb",
                        fontSize: fluidUnit(14),
                        color: vars.color.vaultBlack,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>{country.name}</span>
                      <span
                        style={{
                          fontWeight: 600,
                          color: country.fee === "FREE" ? "#16a34a" : vars.color.vaultBlack,
                        }}
                      >
                        {country.fee}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Typography
            as="p"
            style={{
              fontSize: fluidUnit(14),
              textAlign: "center",
              marginTop: fluidUnit(32),
              color: vars.color.muted,
              fontStyle: "italic",
            }}
          >
            Note: USD bank accounts are not available in jurisdictions subject to
            U.S. sanctions.
          </Typography>
        </Container>
      </section>

      {/* Highlight Section */}
      <section
        style={{
          padding: `${fluidUnit(80)} 0`,
          background: vars.color.vaultBlack,
        }}
      >
        <Container size="lg">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: fluidUnit(48),
              textAlign: "center",
            }}
          >
            <div>
              <Typography
                as="p"
                style={{
                  fontSize: fluidUnit(64),
                  fontWeight: 700,
                  color: vars.color.neonMint,
                  marginBottom: fluidUnit(16),
                }}
              >
                $0
              </Typography>
              <Typography
                as="p"
                style={{
                  fontSize: fluidUnit(18),
                  color: vars.color.vaultWhite,
                }}
              >
                Monthly Account Fees
              </Typography>
            </div>
            <div>
              <Typography
                as="p"
                style={{
                  fontSize: fluidUnit(64),
                  fontWeight: 700,
                  color: vars.color.neonMint,
                  marginBottom: fluidUnit(16),
                }}
              >
                $5
              </Typography>
              <Typography
                as="p"
                style={{
                  fontSize: fluidUnit(18),
                  color: vars.color.vaultWhite,
                }}
              >
                Virtual Card (Visa/MC)
              </Typography>
            </div>
            <div>
              <Typography
                as="p"
                style={{
                  fontSize: fluidUnit(64),
                  fontWeight: 700,
                  color: vars.color.neonMint,
                  marginBottom: fluidUnit(16),
                }}
              >
                1.5%
              </Typography>
              <Typography
                as="p"
                style={{
                  fontSize: fluidUnit(18),
                  color: vars.color.vaultWhite,
                }}
              >
                P2P Transfer Fee
              </Typography>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </>
  );
}

import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import SplitHero from "@/components/sections/SplitHero";
import { vars } from "@/styles/theme.css";
import Container from "@/components/Layout/Container";
import Image from "next/image";
import FeatureGridSection from "@/components/sections/FeatureGridSection";
import Typography from "@/components/Typography/Typography";
import BottomCallToActionBanner from "@/components/sections/BottomCallToActionBanner";
import Accordion, { AccordionItem } from "@/components/Accordion/Accordion";
import Button from "@/components/Button/Button";
import Grid from "@/components/Layout/Grid";
import { fluidUnit } from "@/styles/fluid-unit";
import Link from "next/link";
type GridItemProps = {
  imageSrc: string;
  title: string;
  description: string;
  bgColor: string;
  imageHeight: number;
  imageWidth: number;
  buttonLabel: string;
};
const FindTheCardForYou = () => {
  const leftItem: GridItemProps = {
    imageSrc: "/blue_cards.png",
    imageHeight: 314,
    imageWidth: 480,
    buttonLabel: "Apply",
    title: "Pre-paid Card",
    description:
      "Pay and cashback from ATM or some of your favorite stores — right to your Physical account.",
    bgColor: "#B8FF9F",
  };
  const rightItem: GridItemProps = {
    imageSrc: "/green_card_s.png",
    imageHeight: 314,
    imageWidth: 480,
    buttonLabel: "Apply",
    title: "Debit Card",
    description:
      "Pay and cashback from ATM or some of your favorite stores — right to your Physical account.",
    bgColor: "#07232F",
  };
  const GridItem = (props: GridItemProps) => {
    return (
      <div>
        <div
          style={{
            aspectRatio: "659/547",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: vars.space.md,
            padding: vars.space.md,

            borderRadius: vars.space.lg,
            backgroundColor: props.bgColor,
          }}
        >
          <Image
            unoptimized
            src={props.imageSrc}
            alt={props.title}
            height={props.imageHeight}
            width={props.imageWidth}
          />
        </div>

        <div style={{ padding: vars.space.md, paddingTop: vars.space.xl }}>
          <Typography
            as="h2"
            font="Instrument Sans"
            weight={400}
            style={{
              fontSize: fluidUnit(40),
              lineHeight: "91%",
              letterSpacing: "-0.58px",
            }}
          >
            {props.title}
          </Typography>
          <Typography
            as="p"
            font="Instrument Sans"
            weight={400}
            style={{
              fontSize: fluidUnit(20),
              lineHeight: "150%",
              letterSpacing: "-0.24px",
            }}
          >
            {props.description}
          </Typography>
          <Link href={"/signup"}>
            <Button
              label={props.buttonLabel}
              variant="secondary"
              size="medium"
              textStyle={{ fontSize: fluidUnit(18, 12) }}
              style={{
                backgroundColor: "white",
                marginTop: vars.space.md,
                minWidth: "5rem",
                border: "2px solid black",
                padding: `${fluidUnit(18, 14)} ${fluidUnit(22, 18)}`,
              }}
            />
          </Link>
        </div>
      </div>
    );
  };

  return (
    <section>
      <Container
        size="2xl"
        style={{
          padding: vars.space["4xl"],
          paddingLeft: fluidUnit(24),
          paddingRight: fluidUnit(24),
          backgroundColor: "#D9D9D9",
        }}
      >
        <Typography
          as="h1"
          font="Instrument Sans"
          weight={400}
          style={{
            fontSize: "60px",
            lineHeight: "91%",
            letterSpacing: "-0.58px",
          }}
        >
          Find the card for you
        </Typography>
        <Grid
          style={{
            paddingTop: vars.space["4xl"],
            gap: vars.space["xxl"],
            gridTemplateColumns: "1fr 1fr",
          }}
        >
          <GridItem
            imageSrc={leftItem.imageSrc}
            imageHeight={leftItem.imageHeight}
            imageWidth={leftItem.imageWidth}
            buttonLabel={leftItem.buttonLabel}
            title={leftItem.title}
            description={leftItem.description}
            bgColor={leftItem.bgColor}
          />
          <GridItem
            imageSrc={rightItem.imageSrc}
            imageHeight={rightItem.imageHeight}
            imageWidth={rightItem.imageWidth}
            buttonLabel={rightItem.buttonLabel}
            title={rightItem.title}
            description={rightItem.description}
            bgColor={rightItem.bgColor}
          />
        </Grid>
      </Container>
    </section>
  );
};
export default function PayInStorePage() {
  return (
    <>
      <Navbar />
      <SplitHero
        eyebrow="VAULT PAY CARDS"
        title={"Access even without your phone."}
        description={`VaultPay Prepaid Card goes where you go, and brings your balance along. Pay and  cashback from ATM or some of your favorite stores — right to your Physical account.`}
        textNote={"View terms¹"}
        buttonLabel="Get Started"
        buttonHref="/signup"
        buttonVariant="secondary"
        imageSrc="/image 103_2.png"
        containerSize="2xl"
        imageAlt="Send and receive"
        gridTemplateColumns="1fr 1fr"
        containerStyle={{
          padding: `${vars.space.xl} ${vars.space["4xl"]}`,
          marginTop: vars.space["4xl"],
          marginBottom: vars.space["4xl"],
        }}
        imageWidth={600}
        imageStyle={{
          width: "100%",
          // height: "auto",
        }}
        imageHeight={649}
        minColWidth={360}
        underDescription={
          <Image
            src="/visa_mastercard.png"
            alt="VaultPay card"
            width={124}
            unoptimized
            height={47}
            style={{
              width: "100px",
              height: "auto",
              display: "block",
              marginBottom: vars.space.md,
            }}
          />
        }
      />
      <Container
        size="2xl"
        style={{ paddingTop: vars.space["4xl"], paddingLeft: fluidUnit(24) }}
      >
        <Typography
          as="h1"
          font="Instrument Sans"
          weight={400}
          style={{
            fontSize: "60px",
            lineHeight: "91%",
            letterSpacing: "-0.58px",
          }}
        >
          Unlock the most with cards{" "}
        </Typography>
      </Container>
      <FeatureGridSection
        containerSize="2xl"
        sectionPadding={fluidUnit(24)}
        columnGap={0}
        minColWidth={280}
        gap="xl"
        items={[
          {
            src: "/Group 1037.png",
            alt: "Add money easily",
            title: "Add money easily",
            description:
              "Need to build up your balance? Tap “Add Money” to transfer cash into your VaultPay account from our ATM's.",
          },
          {
            src: "/Group 1038.png",
            alt: "Touch-free NFC shopping",
            title: "Touch-free NFC shopping",
            description:
              "No more inserting chips or swiping card. Just tap your card and go.",
          },
          {
            src: "/Group 1039.png",
            alt: "ATM access",
            title: "ATM access",
            description:
              "Get no-cost cash withdrawals from VaultPay® ATMs.² (Other ATMs charge fees.)",
          },
        ]}
      />
      <FindTheCardForYou />

      <BottomCallToActionBanner />
      <Footer />
    </>
  );
}

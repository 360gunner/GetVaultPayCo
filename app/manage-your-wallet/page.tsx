import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import SplitHero from "@/components/sections/SplitHero";
import { vars } from "@/styles/theme.css";

export default function ManageYourWalletPage() {
  return (
    <>
      <Navbar />
      <SplitHero
        eyebrow="MANAGE & TOP-UP"
        title="Move your money faster"
        description="Use Vault Pay app for transferring money with just a few taps, and your money will be received in less than a minute.*Transfer speed depends on your bank and could take up to 30 minutes. Transfers are reviewed which may result in delays or funds being frozen or removed from your Vault Pay account."
        buttonLabel="Learn more"
        buttonVariant="secondary"
        imageSrc="/Group 998.png"
        imageAlt="Send and receive"
        containerSize="xl"
        gridTemplateColumns="1fr 1fr"
        containerStyle={{ padding: `${vars.space.xl} ${vars.space["4xl"]}` }}
        imageWidth={685}
        imageStyle={{
          width: "100%",
          height: "auto",
        }}
        imageHeight={649}
        minColWidth={360}
      />
      <Footer />
    </>
  );
}

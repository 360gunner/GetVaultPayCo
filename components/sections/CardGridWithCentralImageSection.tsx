import { vars } from "@/styles/theme.css";
import Image from "next/image";
import Typography from "@/components/Typography/Typography";
import Container, { ContainerProps } from "@/components/Layout/Container";
import Stack from "@/components/Layout/Stack";
type SSSItem = { title: string; text: string; iconSrc?: string };
interface CardGridWithCentralImageSectionProps {
  leftItems: SSSItem[];
  image: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    aspectRatio?: number;
  };
  rightItems: SSSItem[];
  containerSize?: ContainerProps["size"];
  containerStyle?: React.CSSProperties;
}
const CardGridWithCentralImageSection: React.FC<
  CardGridWithCentralImageSectionProps
> = ({ leftItems, image, rightItems, containerSize, containerStyle }) => {
  const Card = ({
    title,
    text,
    iconSrc,
  }: {
    title: string;
    text: string;
    iconSrc?: string;
  }) => (
    <div
      style={{
        background: vars.gradients.vpGradient,
        borderRadius: 16,
        padding: 16,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        aspectRatio: "1/1",
        gap: 8,
        maxWidth: "30vw",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 8,
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {iconSrc ? (
          <Image src={iconSrc} alt={title} width={22} height={22} />
        ) : (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.285 6.709a1 1 0 010 1.414l-9 9a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10.5 14.5l8.293-8.293a1 1 0 011.492.502z"
              fill="#FFFFFF"
            />
          </svg>
        )}
      </div>
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <Typography as="h4" font="Instrument Sans" weight={400}>
          {title}
        </Typography>
        <Typography font="Instrument Sans" as="p">
          {text}
        </Typography>
      </div>
    </div>
  );

  return (
    <section style={{ padding: "24px 0", minHeight: "90vh" }}>
      <Container size={containerSize} style={containerStyle}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr 1fr",
            gap: 16,
            alignItems: "stretch",
          }}
        >
          {/* Left column: two cards */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "end",
              gap: 16,
            }}
          >
            {leftItems.map((it) => (
              <Card
                key={it.title}
                title={it.title}
                text={it.text}
                iconSrc={it.iconSrc}
              />
            ))}
          </div>

          {/* Middle column: tall image */}
          <div
            style={{
              aspectRatio: image.aspectRatio,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              height={image.height}
              width={image.width}
              style={{
                margin: "0 auto",
                objectFit: "cover",
                flex: 1,
              }}
            />
          </div>

          {/* Right column: two cards */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "start",
              gap: 16,
            }}
          >
            {rightItems.map((it) => (
              <Card
                key={it.title}
                title={it.title}
                text={it.text}
                iconSrc={it.iconSrc}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
export default CardGridWithCentralImageSection;

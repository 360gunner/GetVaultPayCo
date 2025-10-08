import { vars } from "@/styles/theme.css";
import Image from "next/image";
import Typography from "@/components/Typography/Typography";
import Container, { ContainerProps } from "@/components/Layout/Container";
import Stack from "@/components/Layout/Stack";
import { fluidUnit } from "@/styles/fluid-unit";
type SSSItem = {
  title: string;
  text: string;
  iconSrc?: string;
  floatingTopRightImage?: React.ReactNode;
  index?: number;
};
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
> = ({
  leftItems,
  image,
  rightItems,
  containerSize = "2xl",
  containerStyle,
}) => {
  const Card = ({
    title,
    text,
    iconSrc,
    floatingTopRightImage,
    index,
  }: {
    title: string;
    text: string;
    iconSrc?: string;
    floatingTopRightImage?: React.ReactNode;
    index?: number;
  }) => {
    const getGradient = (index?: number) => {
      switch (index) {
        case 1:
          return vars.gradients.vpGradient;
        case 2:
          return vars.gradients.vpGradient2;
        case 3:
          return vars.gradients.vpGradient3;
        case 4:
          return vars.gradients.vpGradient4;
        default:
          return vars.gradients.vpGradient;
      }
    };
    return (
      <div
        style={{
          background: getGradient(index),
          borderRadius: fluidUnit(30),
          padding: fluidUnit(24),
          flex: 1,
          display: "flex",
          flexDirection: "column",
          aspectRatio: "1/1",
          gap: 8,
          maxWidth: "30 * var(--vw)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: fluidUnit(80),
              height: fluidUnit(80),
              borderRadius: fluidUnit(11),
              background: "#000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {iconSrc ? (
              <Image
                src={iconSrc}
                alt={title}
                width={48}
                height={48}
                style={{
                  height: fluidUnit(48),
                  width: fluidUnit(48),
                }}
              />
            ) : (
              <svg
                style={{
                  width: fluidUnit(48),
                  height: fluidUnit(48),
                }}
                width="48"
                height="48"
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
          {floatingTopRightImage}
        </div>
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            gap: fluidUnit(4),
          }}
        >
          <Typography
            as="h4"
            font="Instrument Sans"
            weight={400}
            style={{ fontSize: fluidUnit(30, 14) }}
          >
            {title}
          </Typography>
          <Typography
            font="Instrument Sans"
            as="p"
            style={{ fontSize: fluidUnit(20, 10) }}
          >
            {text}
          </Typography>
        </div>
      </div>
    );
  };

  const gridGap = fluidUnit(60);
  return (
    <section style={{ padding: "24px 0", minHeight: "90vh" }}>
      <Container
        size={containerSize}
        style={{ padding: gridGap, ...containerStyle }}
      >
        <Stack gap="sm">
          <Typography
            as="h2"
            font="Space Grotesk"
            weight={400}
            style={{ fontSize: fluidUnit(60) }}
          >
            Simple, Secure, Social
          </Typography>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.5fr 1fr",
              gap: gridGap,
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
                gap: gridGap,
              }}
            >
              {leftItems.map((it) => (
                <Card
                  key={it.title}
                  title={it.title}
                  text={it.text}
                  iconSrc={it.iconSrc}
                  index={it.index}
                  floatingTopRightImage={it.floatingTopRightImage}
                />
              ))}
            </div>

            {/* Middle column: tall image */}
            <div
              style={{
                aspectRatio:
                  image.aspectRatio ||
                  (image.width && image.height
                    ? `${image.width}/${image.height}`
                    : "56/78"),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                style={{
                  margin: "0 auto",
                  objectFit: "cover",
                  flex: 1,
                }}
                height={781}
              />
            </div>

            {/* Right column: two cards */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "start",
                gap: gridGap,
              }}
            >
              {rightItems.map((it) => (
                <Card
                  key={it.title}
                  title={it.title}
                  text={it.text}
                  iconSrc={it.iconSrc}
                  index={it.index}
                  floatingTopRightImage={it.floatingTopRightImage}
                />
              ))}
            </div>
          </div>
        </Stack>
      </Container>
    </section>
  );
};
export default CardGridWithCentralImageSection;

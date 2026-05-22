import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Link,
  Row,
  Column,
} from "@react-email/components"

const SERVICE_LABELS: Record<string, string> = {
  "web-development": "Web Development",
  "mobile-development": "Mobile App Development",
  "freelance-project": "Freelance Project",
  collaboration: "Collaboration",
  "job-opportunity": "Job Opportunity",
}

function getServiceLabel(service: string): string {
  return SERVICE_LABELS[service] || service
}

interface ContactEmailProps {
  name: string
  email: string
  service: string
  subject: string
  message: string
}

export function ContactEmail({ name, email, service, subject, message }: ContactEmailProps) {
  const previewText = `New signal from ${name} regarding ${getServiceLabel(service)}`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Terminal-style Header */}
          <Section style={headerSection}>
            <Text style={terminalDots}>
              <span style={{ color: "#ff5f57" }}>●</span>{" "}
              <span style={{ color: "#febc2e" }}>●</span>{" "}
              <span style={{ color: "#28c840" }}>●</span>
            </Text>
            <Heading style={headerTitle}>INCOMING_SIGNAL_DETECTION</Heading>
            <Text style={headerSubtitle}>Portfolio OS // Contact System v2.0</Text>
          </Section>

          <Section style={mainSection}>
            <Text style={greetingText}>
              <span style={keywordStyle}>const</span> signal = {"{"}
            </Text>
            
            <div style={dataWrapper}>
              <Row style={dataRow}>
                <Column style={labelCol}>source:</Column>
                <Column style={valueCol}>
                  <span style={quoteStyle}>&quot;</span>
                  {name}
                  <span style={quoteStyle}>&quot;</span>
                </Column>
              </Row>
              <Row style={dataRow}>
                <Column style={labelCol}>identity:</Column>
                <Column style={valueCol}>
                  <Link href={`mailto:${email}`} style={linkStyle}>
                    <span style={quoteStyle}>&quot;</span>
                    {email}
                    <span style={quoteStyle}>&quot;</span>
                  </Link>
                </Column>
              </Row>
              <Row style={dataRow}>
                <Column style={labelCol}>protocol:</Column>
                <Column style={valueCol}>
                  <span style={quoteStyle}>&quot;</span>
                  {getServiceLabel(service)}
                  <span style={quoteStyle}>&quot;</span>
                </Column>
              </Row>
              <Row style={dataRow}>
                <Column style={labelCol}>header:</Column>
                <Column style={valueCol}>
                  <span style={quoteStyle}>&quot;</span>
                  {subject}
                  <span style={quoteStyle}>&quot;</span>
                </Column>
              </Row>
            </div>

            <Text style={greetingText}>{"}"}</Text>

            <Hr style={dividerStyle} />

            <Section style={messageContainer}>
              <Text style={messageLabel}>{"// PAYLOAD_START"}</Text>
              <Text style={messageContent}>{message}</Text>
              <Text style={messageLabel}>{"// PAYLOAD_END"}</Text>
            </Section>
          </Section>

          <Section style={footerSection}>
            <Text style={footerText}>
              This signal was encrypted and transmitted via <Link href="https://leonard.appelgryn.com" style={footerLink}>Portfolio OS</Link>.
            </Text>
            <Text style={copyrightText}>
              &copy; {new Date().getFullYear()} Leonard Appelgryn. All systems operational.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const bodyStyle = {
  backgroundColor: "#06090c",
  fontFamily: "'Courier New', Courier, monospace",
  margin: "0",
  padding: "40px 0",
}

const containerStyle = {
  backgroundColor: "#0d1117",
  border: "1px solid #1e3a4a",
  borderRadius: "12px",
  margin: "0 auto",
  maxWidth: "600px",
  overflow: "hidden",
}

const headerSection = {
  backgroundColor: "#0d1f2d",
  borderBottom: "1px solid #1e3a4a",
  padding: "20px 24px",
}

const terminalDots = {
  fontSize: "14px",
  margin: "0 0 10px 0",
}

const headerTitle = {
  color: "#34d399",
  fontSize: "16px",
  fontWeight: "bold",
  letterSpacing: "0.1em",
  margin: "0",
}

const headerSubtitle = {
  color: "#4a6b7a",
  fontSize: "10px",
  margin: "4px 0 0 0",
  textTransform: "uppercase" as const,
}

const mainSection = {
  padding: "32px 24px",
}

const greetingText = {
  color: "#e2e8f0",
  fontSize: "14px",
  margin: "0",
}

const keywordStyle = {
  color: "#c084fc",
}

const dataWrapper = {
  margin: "16px 0 16px 20px",
}

const dataRow = {
  marginBottom: "8px",
}

const labelCol = {
  color: "#4a6b7a",
  fontSize: "13px",
  width: "100px",
}

const valueCol = {
  color: "#60a5fa",
  fontSize: "13px",
}

const quoteStyle = {
  color: "#34d399",
}

const linkStyle = {
  color: "#60a5fa",
  textDecoration: "none",
}

const dividerStyle = {
  borderColor: "#1e3a4a",
  margin: "32px 0",
}

const messageContainer = {
  backgroundColor: "rgba(255, 255, 255, 0.02)",
  border: "1px solid rgba(30, 58, 74, 0.5)",
  borderRadius: "8px",
  padding: "20px",
}

const messageLabel = {
  color: "#4a6b7a",
  fontSize: "11px",
  margin: "0",
  letterSpacing: "0.05em",
}

const messageContent = {
  color: "#e2e8f0",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "16px 0",
  whiteSpace: "pre-wrap" as const,
}

const footerSection = {
  padding: "0 24px 32px 24px",
  textAlign: "center" as const,
}

const footerText = {
  color: "#4a6b7a",
  fontSize: "12px",
  margin: "0 0 8px 0",
}

const footerLink = {
  color: "#34d399",
  textDecoration: "underline",
}

const copyrightText = {
  color: "#304a5a",
  fontSize: "10px",
  margin: "0",
}

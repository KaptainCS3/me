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
  return (
    <Html>
      <Head />
      <Preview>New message from {name}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Heading style={headingStyle}>New Contact Message</Heading>
            <Text style={subheadingStyle}>Portfolio Contact Form</Text>
          </Section>

          <Section style={fieldsSectionStyle}>
            <Row style={rowStyle}>
              <Column style={labelColumnStyle}>Name</Column>
              <Column style={valueColumnStyle}>{name}</Column>
            </Row>
            <Row style={rowStyle}>
              <Column style={labelColumnStyle}>Email</Column>
              <Column style={valueColumnStyle}>
                <Link href={`mailto:${email}`} style={linkStyle}>
                  {email}
                </Link>
              </Column>
            </Row>
            <Row style={rowStyle}>
              <Column style={labelColumnStyle}>Subject</Column>
              <Column style={valueColumnStyle}>{subject}</Column>
            </Row>
            <Row style={rowStyle}>
              <Column style={labelColumnStyle}>Service</Column>
              <Column style={valueColumnStyle}>{getServiceLabel(service)}</Column>
            </Row>
          </Section>

          <Hr style={hrStyle} />

          <Section style={messageSectionStyle}>
            <Text style={messageLabelStyle}>Message</Text>
            <Text style={messageBodyStyle}>{message}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const bodyStyle = {
  fontFamily: "monospace",
  backgroundColor: "#050a12",
  margin: 0,
  padding: "32px 0",
}

const containerStyle = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "0 16px",
}

const headerStyle = {
  borderBottom: "1px solid rgba(52, 211, 153, 0.3)",
  paddingBottom: "16px",
  marginBottom: "24px",
}

const headingStyle = {
  color: "#34d399",
  fontSize: "18px",
  margin: "0 0 4px",
}

const subheadingStyle = {
  color: "#6b8fa0",
  fontSize: "12px",
  margin: 0,
}

const fieldsSectionStyle = {
  marginBottom: "24px",
}

const rowStyle = {
  borderBottom: "1px solid rgba(30, 58, 74, 0.3)",
}

const labelColumnStyle = {
  color: "#4a6b7a",
  fontSize: "13px",
  padding: "8px 12px",
  width: "100px",
}

const valueColumnStyle = {
  color: "#e2e8f0",
  fontSize: "13px",
  padding: "8px 12px",
}

const linkStyle = {
  color: "#60a5fa",
}

const hrStyle = {
  borderColor: "rgba(30, 58, 74, 0.3)",
  margin: "24px 0",
}

const messageSectionStyle = {
  padding: "16px",
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  borderRadius: "8px",
  border: "1px solid rgba(30, 58, 74, 0.3)",
}

const messageLabelStyle = {
  color: "#4a6b7a",
  fontSize: "11px",
  margin: "0 0 8px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
}

const messageBodyStyle = {
  color: "#e2e8f0",
  fontSize: "13px",
  margin: 0,
  lineHeight: "1.6",
  whiteSpace: "pre-wrap" as const,
}

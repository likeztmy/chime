export const templates = [
  {
    id: "blank",
    label: "空白文档",
    imageUrl: "/blank-document.svg",
    initialContent: `<p></p>`,
  },
  {
    id: "software-proposal",
    label: "软件开发提案",
    imageUrl: "/software-proposal.svg",
    initialContent: `
      <h1>Software Development Proposal</h1>
      <h2>Introduction</h2>
      <p>This proposal outlines the key objectives, timeline, and budget for the software development project. It is designed to provide a comprehensive overview to stakeholders.</p>
      <h2>Objectives</h2>
      <ul>
        <li>Develop a scalable and robust software solution.</li>
        <li>Ensure seamless integration with existing systems.</li>
        <li>Enhance user experience through an intuitive design.</li>
      </ul>
      <h2>Timeline</h2>
      <p>The project is estimated to be completed in three phases over six months:</p>
      <ol>
        <li>Phase 1: Requirement Gathering and Planning (Month 1)</li>
        <li>Phase 2: Development and Testing (Months 2-5)</li>
        <li>Phase 3: Deployment and Maintenance (Month 6)</li>
      </ol>
      <h2>Budget</h2>
      <p>The total budget for the project is estimated at $50,000, covering development, testing, and deployment costs.</p>
      <h2>Conclusion</h2>
      <p>We are committed to delivering a high-quality software solution that meets all outlined objectives. Your approval and support are crucial for the project's success.</p>
    `,
  },
  {
    id: "project-proposal",
    label: "项目提案",
    imageUrl: "/project-proposal.svg",
    initialContent: `
      <h1>Project Proposal</h1>
      <p>This document provides an overview of the project goals, scope, and implementation plan to ensure its successful completion.</p>
      <h2>Overview</h2>
      <p>The project aims to streamline workflows and improve operational efficiency within the organization.</p>
      <h2>Goals</h2>
      <ul>
        <li>Reduce process inefficiencies by 30%.</li>
        <li>Implement advanced analytics for decision-making.</li>
        <li>Enhance team collaboration through improved tools.</li>
      </ul>
      <h2>Scope</h2>
      <p>The project includes the design, development, and deployment of a custom solution tailored to organizational needs.</p>
    `,
  },
  {
    id: "business-letter",
    label: "商务信函",
    imageUrl: "/business-letter.svg",
    initialContent: `
      <p>[Your Address]</p>
      <p>[Date]</p>
      <p>[Recipient's Name]</p>
      <p>[Recipient's Address]</p>
      <p>Dear [Recipient's Name],</p>
      <p>We are writing to inform you about the upcoming changes to our policies and how they will affect your account. Please review the details below carefully.</p>
      <p>Should you have any questions, feel free to contact us directly.</p>
      <p>Sincerely,</p>
      <p>[Your Name]</p>
    `,
  },
  {
    id: "resume",
    label: "简历",
    imageUrl: "/resume.svg",
    initialContent: `
      <h1>[Your Name]</h1>
      <h2>Contact Information</h2>
      <p>[Your Address, Phone, Email]</p>
      <h2>Objective</h2>
      <p>Seeking a challenging position where I can contribute to the growth of the organization through my skills and expertise.</p>
      <h2>Education</h2>
      <ul>
        <li>Bachelor of Science in Computer Science, [University Name], [Year]</li>
      </ul>
      <h2>Experience</h2>
      <ul>
        <li>Software Developer at [Company Name] ([Year] - Present)</li>
      </ul>
      <h2>Skills</h2>
      <p>JavaScript, React, Node.js, SQL</p>
    `,
  },
  {
    id: "cover-letter",
    label: "求职信",
    imageUrl: "/cover-letter.svg",
    initialContent: `
      <p>Dear [Hiring Manager's Name],</p>
      <p>I am excited to apply for the [Job Title] position at [Company Name]. With my expertise in [specific skills or experience], I am confident in my ability to contribute to your team's success.</p>
      <p>My experience includes [specific achievements or responsibilities].</p>
      <p>I look forward to the opportunity to discuss my application further.</p>
      <p>Sincerely,</p>
      <p>[Your Name]</p>
    `,
  },
  {
    id: "letter",
    label: "信件",
    imageUrl: "/letter.svg",
    initialContent: `
      <p>Dear [Recipient's Name],</p>
      <p>I hope this letter finds you well. I am writing to inform you about [specific topic].</p>
      <p>Thank you for your attention to this matter.</p>
      <p>Best regards,</p>
      <p>[Your Name]</p>
    `,
  },
];

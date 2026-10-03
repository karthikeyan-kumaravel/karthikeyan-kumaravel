/**
 * ─────────────────────────────────────────────────────────────
 *  PORTFOLIO CONFIG — edit this file to personalise the site.
 * ─────────────────────────────────────────────────────────────
 *  Every link, the resume path, career history and extra projects
 *  live here. Values containing "example.com", "your-profile" or
 *  "your-username" are treated as placeholders: they render with a
 *  dashed outline while `showPlaceholders` is true.
 *
 *  Also update the static SEO tags in index.html <head>
 *  (search for "your-username.github.io").
 */
window.PORTFOLIO = {
  name: "Karthikeyan Kumaravel",
  role: "Team Lead | Senior Software Engineer",
  brand: "BUILD SCALABLE SOFTWARE",
  positioning: "Exploring AI-Native Engineering",

  // Public URL of the deployed site (used for structured data).
  siteUrl: "https://your-username.github.io/",

  links: {
    linkedin: "https://www.linkedin.com/in/your-profile", // TODO: replace
    github: "https://github.com/your-username",            // TODO: replace
    email: "hello@example.com"                             // TODO: replace (used for mailto:)
  },

  // Resume — swap the file in assets/resume/ and update this path.
  resume: {
    path: "assets/resume/Karthikeyan-Kumaravel-Resume.pdf",
    downloadName: "Karthikeyan-Kumaravel-Resume.pdf"
  },

  // GitHub section: lists your most recently updated public repos.
  // Leave enabled; it only calls the API once the section is near the viewport
  // and only when links.github is a real profile URL.
  github: {
    showRepos: true,
    maxRepos: 6,
    includeForks: false
  },

  // While true, missing details render as visible [placeholders] so
  // nothing is accidentally published blank. Set to false to hide them.
  showPlaceholders: true,

  /**
   * Career journey. Fill in `title`, `company` and `period` with real
   * details. Empty fields show as placeholders (or are hidden when
   * showPlaceholders is false). Add, remove or reorder entries freely.
   */
  career: [
    {
      phase: "Software development",
      title: "",
      company: "",
      period: "",
      summary: "Building features end to end and learning how business requirements become working software."
    },
    {
      phase: "Senior engineering",
      title: "",
      company: "",
      period: "",
      summary: "Owning larger modules, making design decisions and taking responsibility for quality in production."
    },
    {
      phase: "Team leadership",
      title: "Team Lead",
      company: "",
      period: "",
      summary: "Breaking down requirements, reviewing code, mentoring developers and coordinating delivery through UAT and deployment."
    },
    {
      phase: "Scalable systems",
      title: "",
      company: "",
      period: "",
      summary: "Leading engineering on RailERP, an enterprise railway project management platform with interdependent workflows."
    },
    {
      phase: "AI-native engineering",
      title: "",
      company: "",
      period: "Ongoing",
      summary: "Applying coding agents, context engineering and AI-assisted workflows inside a disciplined engineering process."
    }
  ],

  /**
   * Additional projects. Only add projects that genuinely exist.
   * RailERP is featured separately in index.html.
   * Example:
   * {
   *   name: "Project name",
   *   problem: "What problem it solves.",
   *   solution: "How it solves it.",
   *   tech: ["Laravel", "React"],
   *   challenge: "The interesting engineering problem.",
   *   repo: "https://github.com/your-username/project",
   *   demo: "" // leave empty if no live demo
   * }
   */
  projects: []
};

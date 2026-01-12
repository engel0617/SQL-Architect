
export const TECHNICAL_ROADMAP = {
  phases: [
    { title: "MVP - Core Logic", status: "Done", items: ["Dialect Mapping", "Basic Optimization"] },
    { title: "V1.5 - Schema Awareness", status: "In Progress", items: ["DDL Parsing", "Index Suggestion"] },
    { title: "V2.0 - CI/CD Integration", status: "Planned", items: ["Git Hooks", "Query Linting"] }
  ],
  stack: {
    frontend: "React + Tailwind + TypeScript",
    ai: "Gemini 3 Pro (Multimodal for ERD parsing)",
    validation: "PgLast / SQLFluff (Self-hosted Python Microservice)"
  }
};

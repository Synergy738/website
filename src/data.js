// Edit this file to update the site. Nothing else needs to change.

export const me = {
  name: "Blũ Dennis",
  role: "Full-Stack Developer",
  location: "Kraaifontein, Cape Town, South Africa",
  email: "bludennis17@gmail.com",
  phone: "+27 64 766 9310",
  links: [
    { label: "GitHub", href: "https://github.com/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/github/github-original.svg" },
    { label: "LinkedIn", href: "https://linkedin.com/", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/linkedin/linkedin-plain.svg" },
  ],
  manifesto: [
    "I didn't take the usual path into software development. No formal campus, no fixed syllabus — just a decision to learn from the best teachers I could find.",
    "From 2023 to 2025 I studied online through Harvard, MIT, Georgia Tech and others, taking courses from beginner to advanced and finishing each one at 80% or above.",
    "Along the way my thinking changed: from comfortable with consistency to comfortable with growth. What's left is a stack of things that work — AI experiments, applications, databases, security work, websites.",
  ],
};

// icons: devicon paths, cdn.jsdelivr.net/gh/devicons/devicon/icons/<path>.svg
export const skills = [
  { group: "Languages", items: ["C#", "Python", "Java", "JavaScript", "TypeScript", "PHP", "PowerShell", "Bash", "HTML", "CSS", "SQL"], icons: ["csharp/csharp-plain", "python/python-plain", "java/java-plain", "javascript/javascript-plain", "typescript/typescript-plain", "php/php-plain", "powershell/powershell-plain", "bash/bash-plain", "html5/html5-plain", "css3/css3-plain"] },
  { group: "Frameworks & Tools", items: ["React", "ASP.NET / .NET 8", "Entity Framework Core", "Django", "REST APIs", "Orchard Core", "Git", "Visual Studio", "WordPress", "Elementor", "jQuery", "WooCommerce"], icons: ["react/react-original", "dotnetcore/dotnetcore-plain", "django/django-plain", "git/git-plain", "visualstudio/visualstudio-plain", "wordpress/wordpress-plain", "jquery/jquery-plain", "woocommerce/woocommerce-plain"] },
  { group: "Databases", items: ["SQL Server", "T-SQL", "PostgreSQL", "MySQL", "SQLite"], icons: ["microsoftsqlserver/microsoftsqlserver-plain", "postgresql/postgresql-plain", "mysql/mysql-original", "sqlite/sqlite-plain"] },
  { group: "Cloud & DevOps", items: ["Microsoft Azure", "AWS (EC2, Lambda, S3, IAM, CloudFormation)", "Azure DevOps", "CI/CD"], icons: ["azure/azure-plain", "amazonwebservices/amazonwebservices-original-wordmark", "azuredevops/azuredevops-plain"] },
  { group: "Security", items: ["IAM", "PAM", "Zero Trust", "Cryptography", "Backup & DR", "Secure coding"] },
];

export const experience = [
  {
    role: "Front-End Developer",
    company: "Temo Digital",
    where: "Cape Town",
    when: "Jun 2026 — Present",
    bullets: [
      "Building Eduman, a React school information management system spanning 30+ modules: learners, staff, finance, assessments, attendance, communication and incident management, tracked against Azure DevOps work items.",
      "Shipped standalone modules — Incident Management, Parent Management, Subject Attendance, Educator, Communication (eThetha), Textbook Management and Finance — each delivered as a working page against a tracked item.",
      "Built the shared UI infrastructure (dock navigation, glass-surface components, quick actions, listing modals) reused across 30+ pages.",
      "Designed a theming system for Orchard Core CMS in C#/.NET: 6 themes over a shared library of 40+ widgets, each restyled per theme so widgets adapt to whichever theme is equipped.",
    ],
  },
  {
    role: "Website Developer (Independent Contractor)",
    company: "Superb Digital",
    where: "Cape Town",
    when: "Apr 2025 — Feb 2026",
    bullets: [
      "Designed and built WordPress sites for 5 small businesses. Clients went from zero online enquiries to 10–15 inbound leads a month within 4–6 weeks of launch.",
      "Maintained 15 live sites with weekly updates, security checks and bug fixes — inside a one-hour service window, zero missed deadlines.",
      "Rolled out Solid Security across every deployment; reported security incidents dropped to zero.",
      "Reviewed custom PHP and CSS to hold a consistent standard across the team.",
      "Configured domains and SSL via cPanel for every launch — 100% went live secure and development-ready.",
    ],
  },
];

export const projects = [
  {
    title: "Traffic Sign Classifier",
    kind: "Harvard CS50AI",
    stack: ["Python", "TensorFlow/Keras", "OpenCV"],
    href: "https://github.com/Synergy738/Projects/tree/main/Python%20Projects/traffic%20(small)",
    blurb:
      "A convolutional network that identifies traffic signs in photographs at 99.7% test accuracy on a three-sign GTSRB subset. OpenCV preprocesses and resizes the GTSRB dataset; the CNN stacks convolutional and pooling layers. The hard part was overfitting — dropout layers moved the needle most.",
  },
  {
    title: "PageRank",
    kind: "Harvard CS50AI",
    stack: ["Python", "Markov Chains", "Iterative Algorithms"],
    href: "https://github.com/Synergy738/Projects/tree/main/Python%20Projects/pagerank",
    blurb:
      "Ranks web pages by link structure, two ways: a random-surfer sampler that estimates rank by visit frequency, and an iterative formula refined until it converges. Both rank programming and AI pages highest.",
  },
  {
    title: "Workout Tracker Database",
    kind: "Harvard CS50 SQL",
    stack: ["SQL", "MySQL", "Schema Design", "Views", "Indexes"],
    href: "https://github.com/Synergy738/Projects/tree/main/SQL%20Projects/Harvard_Final_Project",
    blurb:
      "Four related tables for users, workouts, exercises and progress, with constraints, indexes on hot columns and three views for the common reads. The schema assumes individual workouts — collaborative sessions would want a many-to-many redesign.",
  },
  {
    title: "Gents Pride",
    kind: "Client — barbershop",
    stack: ["WordPress", "Elementor", "Setmore"],
    href: "https://gentspride.co.za",
    blurb:
      "A Bonteheuwel barbershop with 25 years behind it: online appointment booking, service listings, brand partnerships, barber training programs and community competitions.",
  },
  {
    title: "Township Luxury",
    kind: "E-commerce — streetwear",
    stack: ["WordPress", "WooCommerce"],
    href: "https://townshipluxury.co.za",
    blurb:
      "Full e-commerce store for a fashion and streetwear brand. Built as a side project for a friend during my first month at Temo Digital.",
  },
  {
    title: "Opian Capital",
    kind: "Client — private equity",
    stack: ["WordPress", "Elementor", "Analytics"],
    href: "https://opiancapital.com",
    blurb:
      "Site for a private equity and wealth management firm in tech-driven investments and high-net-worth advisory. Secure consultation forms, analytics wired to track inquiries.",
  },
  {
    title: "MetroWorld Kids",
    kind: "Non-profit — youth",
    stack: ["WordPress", "Elementor", "Donations"],
    href: "https://metroworldkidscpt.co.za",
    blurb:
      "A youth non-profit working across 30 Cape Town schools. Volunteering, child sponsorships, partnerships and donations, with sign-up and giving flows built in.",
  },
];

// Drop an official logo at public/logos/<slug>.svg (or .png — change ext below)
// and the card uses it. Until then the card shows the monogram.
export const orgs = {
  "Microsoft": { slug: "microsoft" },
  "Amazon Web Services": { slug: "aws" },
  "Harvard University": { slug: "harvard", color: "#a51c30" },
  "NYU Tandon": { slug: "nyu", color: "#57068c" },
  "MIT": { slug: "mit", color: "#a31f34" },
  "Georgia Tech": { slug: "georgia-tech", color: "#b3a369" },
  "Board Infinity": { slug: "board-infinity" },
  "Oracle": { slug: "oracle" },
};

export const certs = [
  { name: "Microsoft Azure Fundamentals", org: "Microsoft", mark: "73%", date: "Nov 2025", url: "https://learn.microsoft.com/api/credentials/share/en-us/BluDennis-9028/89CD5A33EBFCFB7C?sharingId=23DCD1AF26FE57D8", about: "Core Azure services, cloud concepts, security, compliance, and pricing models." },
  { name: "AWS Certified AI Practitioner", org: "Amazon Web Services", mark: "81%", date: "Jul 2025", url: "https://www.credly.com/badges/5f6b9d60-edf8-421e-8a5d-63697e2f6eca/linked_in_profile", about: "AI and ML on AWS, Generative AI, EC2, Lambda, IAM, CloudFormation, S3, Responsible AI." },
  { name: "Prompt Engineering for Microsoft 365 Copilot", org: "Microsoft", mark: "100%", date: "Jun 2025", url: "https://courses.edx.org/certificates/1b1cbc012d5c47a28c2ededcf515f84a", about: "Cutting-edge LLM integration, enterprise-grade prompt design, real-world deployment." },
  { name: "CS50 Cybersecurity", org: "Harvard University", mark: "81%", date: "Nov 2024", url: "https://courses.edx.org/certificates/8c98691ddf4f413e886e57486cef5085", about: "Hands-on labs, secure coding, and systems-level security concepts." },
  { name: "CS50 SQL", org: "Harvard University", mark: "95%", date: "Nov 2024", url: "https://courses.edx.org/certificates/60c14bfcfe354d519d0575bf51224381", about: "Relational databases, joins, indexing, and query optimisation." },
  { name: "Data Science: R Basics", org: "Harvard University", mark: "94%", date: "Mar 2024", url: "https://courses.edx.org/certificates/981e9e75b38145d8b53b4badeef0c052", about: "Introductory R programming and data wrangling." },
  { name: "Cybersecurity Specialization", org: "NYU Tandon", mark: "87%", date: "Feb 2024", url: "https://coursera.org/share/70a144b9856231e090442005500994e2", about: "Multi-course specialisation: threat modelling, cryptography, and network security." },
  { name: "CS50AI", org: "Harvard University", mark: "86%", date: "Feb 2024", url: "https://cs50.harvard.edu/certificates/f27a5d40-d20e-4709-9d6a-ae644e07d978", about: "Advanced AI concepts, Python, search algorithms, neural networks." },
  { name: "Microservices & Deployment with ASP.NET", org: "Board Infinity", mark: "95%", date: "Dec 2023", url: "https://coursera.org/share/03c04b91b2a79d9a5048e961ee23b39b", about: "Service architecture, containerisation, and CI/CD pipelines." },
  { name: "Advanced Java", org: "LearnQuest", mark: "92%", date: "Dec 2023" },
  { name: "C# Class Development", org: "University of Colorado", mark: "100%", date: "Nov 2023", url: "https://www.coursera.org/account/accomplishments/verify/EYFMSXG3DXM9", about: "Object-oriented C# with classes, inheritance, and Unity game development." },
  { name: "Java II", org: "Georgia Tech", mark: "83%", date: "Aug 2023", url: "https://courses.edx.org/certificates/d53b98b364b348e093f435b804995d18", about: "Object-oriented design, data structures, and algorithmic thinking." },
  { name: "Java I", org: "Georgia Tech", mark: "98%", date: "Jun 2023", url: "https://courses.edx.org/certificates/89a9c6149ace45daad234af1a9560fb2", about: "Syntax, basic OOP principles, and Java tooling." },
  { name: "Computational Thinking & Data Science", org: "MIT", mark: "94%", date: "May 2023", url: "https://courses.edx.org/certificates/99799a611aa140cea73e1494fafa0c02", about: "Python-based modelling, simulations, and data analysis." },
  { name: "Intro to CS & Python", org: "MIT", mark: "88%", date: "Mar 2023", url: "https://courses.edx.org/certificates/3fe39b587565472e98db7199e96c40e8", about: "Foundational programming, control flow, and problem-solving." },
  { name: "Web Development", org: "Stellenberg High School", mark: "90%", date: "Aug 2022", url: "https://www.linkedin.com/in/blu-dennis-b40136278/details/certifications/1748355840394/single-media-viewer/", about: "HTML, CSS, and basic web design principles." },
];

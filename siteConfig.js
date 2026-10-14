// Central Configuration File for Sharnitha T's Portfolio
// You can easily update your links, contact details, and project info here!

export const siteConfig = {
  personal: {
    name: "SHARNITHA T",
    firstName: "Sharnitha",
    lastName: "T",
    title: "Full Stack Data Analyst",
    subtitle: "Data Analytics • Business Intelligence • Machine Learning • Full Stack Web Development",
    email: "sharnithat@gmail.com",
    location: "Coimbatore, Tamil Nadu, India",
    availability: "Available for Full-Time & Internship Roles",
    summary: "Aspiring Full Stack Data Analyst with strong knowledge of data analysis, visualization, reporting, and modern web application development. Proficient in Excel, Power BI, SQL, Python, and data transformation, with hands-on experience uncovering actionable business insights and engineering RESTful web services.",
    bio: [
      "I am a passionate Full Stack Data Analyst based in Coimbatore, Tamil Nadu, combining deep analytical rigor with full-stack web engineering. Currently completing my B.Sc in Computer Science at PSG College of Arts & Science alongside a specialized program in AI-Driven Data Analytics at Entri Elevate.",
      "My practical industry background spans data analytics at DecodeLabs—where I transformed datasets into strategic business insights—and full-stack web development at Career Ladder, where I built responsive web applications and RESTful APIs with Node.js, Express, MySQL, and MongoDB.",
      "Whether developing interactive Power BI dashboards, deploying machine learning classification models, or developing database-driven web platforms, I am driven by delivering accurate, data-backed solutions to complex real-world challenges."
    ],
    socialLinks: {
      github: "https://github.com/sharnitha-t", // Update with your GitHub profile URL
      linkedin: "https://linkedin.com/in/sharnitha-t", // Update with your LinkedIn profile URL
      email: "mailto:sharnithat@gmail.com"
    },
    metrics: [
      { label: "Records Cleaned & Modeled", value: "1,200+", desc: "Excel & Power Query analysis" },
      { label: "ML Prediction Accuracy", value: "92%", desc: "Blood group classification model" },
      { label: "RESTful Endpoints Built", value: "5+", desc: "Node.js & Express API services" },
      { label: "Industry Internships", value: "2", desc: "Data Analytics & Full-Stack Web" }
    ]
  },

  skills: {
    categories: [
      {
        id: "analytics",
        name: "Data Analytics & BI",
        icon: "BarChart3",
        skills: [
          { name: "Power BI", level: "Advanced", desc: "DAX, Interactive Dashboards, KPI Reports" },
          { name: "Microsoft Excel", level: "Advanced", desc: "PivotTables, Advanced Formulas, Modeling" },
          { name: "Power Query", level: "Advanced", desc: "ETL, Data Cleaning & Schema Transformation" },
          { name: "Data Modeling", level: "Proficient", desc: "Star Schemas, Relationships, Aggregations" },
          { name: "Data Visualization", level: "Advanced", desc: "Executive Reports & Storytelling" },
          { name: "Data Cleaning", level: "Advanced", desc: "Outlier Removal, Normalization, Imputation" }
        ]
      },
      {
        id: "programming",
        name: "Programming & Databases",
        icon: "Database",
        skills: [
          { name: "Python", level: "Proficient", desc: "Scripting, Data Analysis, Machine Learning" },
          { name: "SQL", level: "Proficient", desc: "Complex Joins, Subqueries, Aggregations" },
          { name: "MySQL", level: "Proficient", desc: "Relational Schema Design & Optimization" },
          { name: "MongoDB", level: "Intermediate", desc: "NoSQL Document Store, Aggregations" },
          { name: "DBMS", level: "Proficient", desc: "ACID Transactions, Normalization, Indexing" },
          { name: "Java", level: "Intermediate", desc: "Object-Oriented Programming Fundamentals" }
        ]
      },
      {
        id: "ml",
        name: "Data & ML Libraries",
        icon: "Cpu",
        skills: [
          { name: "Pandas", level: "Proficient", desc: "DataFrames, Data Wrangling, Time-Series" },
          { name: "NumPy", level: "Proficient", desc: "Matrix Operations & Numerical Computing" },
          { name: "Matplotlib & Seaborn", level: "Proficient", desc: "Statistical Graphics & Exploratory Plots" },
          { name: "Scikit-Learn", level: "Proficient", desc: "Classification, Regression, Feature Prep" },
          { name: "OpenCV", level: "Intermediate", desc: "Image Preprocessing & Feature Extraction" },
          { name: "TensorFlow", level: "Intermediate", desc: "Neural Networks & Predictive Modeling" }
        ]
      },
      {
        id: "web",
        name: "Web & API Technologies",
        icon: "Globe",
        skills: [
          { name: "HTML5 & CSS3", level: "Proficient", desc: "Semantic Markup & Responsive Layouts" },
          { name: "JavaScript (ES6+)", level: "Proficient", desc: "DOM, Async/Await, Modern Front-end" },
          { name: "Node.js", level: "Intermediate", desc: "Server-side JavaScript & Runtime" },
          { name: "Express.js", level: "Intermediate", desc: "RESTful API Routing & Middleware" },
          { name: "RESTful APIs", level: "Proficient", desc: "Endpoint Design, Testing & CRUD Ops" },
          { name: "React", level: "Intermediate", desc: "Component Architecture & Hooks" }
        ]
      },
      {
        id: "core",
        name: "Core Professional Skills",
        icon: "Brain",
        skills: [
          { name: "Analytical Thinking", level: "Advanced", desc: "Translating ambiguous data into insights" },
          { name: "Problem Solving", level: "Advanced", desc: "Systematic root-cause analysis" },
          { name: "Critical Thinking", level: "Advanced", desc: "Evaluating trade-offs & data accuracy" },
          { name: "Cross-Functional Collaboration", level: "Advanced", desc: "Agile teamwork & communication" },
        ]
      }
    ]
  },

  projects: [
    {
      id: "flight-booking-analytics",
      title: "Flight Booking and Travel Data Analysis",
      category: "analytics",
      categoryName: "Data Analytics & BI",
      date: "Aug 2026",
      featured: true,
      githubUrl: "https://github.com/sharnitha-t/flight-booking-analysis",
      summary: "An end-to-end travel data analysis project exploring flight booking patterns, ticket pricing, customer preferences, and demand trends to uncover useful insights from travel data.",
      shortDescription: "An end-to-end travel data analysis project exploring flight booking patterns, ticket pricing, customer preferences, and demand trends to uncover useful insights from travel data.",
      expandedDescription: "This project explores flight booking and travel data to understand how ticket prices, booking behaviour, customer preferences, and demand patterns vary across the available dataset. The workflow can include data cleaning, exploratory analysis, comparisons, and visualizations that make travel-related trends easier to interpret. The goal is to transform raw booking data into clear, useful insights that can support data-driven decision-making.",
      highlights: [
        "Analyzed multi-dimensional flight booking records to uncover airline performance trends, booking demand peaks, customer preferences, and dynamic pricing patterns.",
        "Cleaned and transformed 1,200 records using Microsoft Excel and Power Query, performing robust data modeling with PivotTables and DAX calculations.",
        "Built an interactive Power BI executive dashboard presenting actionable insights and key trends to support data-driven business strategy."
      ],
      tags: ["Excel", "SQL", "Python", "Power BI", "Data Cleaning", "Data Visualization"],
      metrics: [
        { label: "Records Cleaned", value: "1,200" },
        { label: "Core Tool", value: "Power BI" },
        { label: "Focus", value: "Demand & Pricing" }
      ],
      pipeline: [
        { step: "Data Acquisition", desc: "Extracted flight booking records covering route pricing, cabin class, and timing features." },
        { step: "ETL & Cleaning", desc: "Handled missing records, normalized categories, and created calculated measures in Power Query." },
        { step: "Data Modeling", desc: "Constructed relational models and analytical summaries using PivotTables and DAX." },
        { step: "Executive Dashboard", desc: "Visualized route profitability, booking lead-times, and airline fare comparisons in Power BI." }
      ]
    },
    {
      id: "smart-city-bike-sharing",
      title: "Smart City Bike Sharing Analytics",
      category: "analytics",
      categoryName: "Data Analytics & BI",
      date: "Jul 2026",
      featured: false,
      githubUrl: null,
      summary: "A Power BI analytics project exploring bike-sharing station data, data relationships, and urban mobility patterns through interactive visualizations.",
      shortDescription: "A Power BI analytics project exploring bike-sharing station data, data relationships, and urban mobility patterns through interactive visualizations.",
      expandedDescription: "This project uses a dataset containing 2,856 station records to explore bike-sharing station information and urban mobility data. It includes a structured star-schema data model, DAX measures, and an interactive Power BI dashboard designed to present key information clearly. The project demonstrates how data preparation, modeling, and visualization can turn raw station records into an accessible analytical experience.",
      highlights: [
        "Analyzed urban mobility dataset comprising 2,856 bike-sharing station records across geographic zones.",
        "Engineered a relational star-schema data model linking station dimensions, temporal factors, and trip metrics.",
        "Authored custom DAX calculations and developed an interactive Power BI dashboard visualizing station density and mobility trends."
      ],
      tags: ["Power BI", "DAX", "Data Modeling", "Data Visualization"],
      metrics: [
        { label: "Station Records", value: "2,856" },
        { label: "Architecture", value: "Star Schema" },
        { label: "Tool", value: "Power BI" }
      ],
      pipeline: [
        { step: "Data Exploration", desc: "Profiled 2,856 station records to evaluate geographic coverage and capacity." },
        { step: "Data Modeling", desc: "Architected relational star schema connecting dimension tables to fact tables." },
        { step: "DAX Measures", desc: "Formulated dynamic time-intelligence and utilization calculations in DAX." },
        { step: "Power BI Reports", desc: "Created interactive map layers and station distribution dashboards." }
      ]
    },
    {
      id: "fingerprint-blood-detection",
      title: "Fingerprint-Based Blood Group Detection",
      category: "ml",
      categoryName: "AI & Machine Learning",
      date: "Jan 2026 – Apr 2026",
      featured: false,
      githubUrl: "https://github.com/sharnitha-t/fingerprint-blood-group-detection",
      summary: "An experimental computer-vision project exploring fingerprint image classification for blood-group prediction.",
      shortDescription: "An experimental computer-vision project exploring fingerprint image classification for blood-group prediction.",
      expandedDescription: "This project investigates an experimental approach to fingerprint image classification using computer-vision and machine-learning techniques. It focuses on exploring image inputs, classification workflows, and the challenges of developing a model that attempts to predict blood-group categories from fingerprint patterns. The project is presented as an exploratory technical implementation, not a clinically validated diagnostic system.",
      highlights: [
        "Investigated experimental computer-vision classification workflow predicting blood groups from biometric fingerprint images.",
        "Applied OpenCV image preprocessing routines including contrast adjustment, ridge filtering, and binarization to enhance feature clarity.",
        "Trained machine learning classification algorithms and validated model performance across sample image datasets."
      ],
      tags: ["Python", "Computer Vision", "Image Processing", "Machine Learning"],
      metrics: [
        { label: "Workflow", value: "Experimental ML" },
        { label: "Processing", value: "OpenCV" },
        { label: "Language", value: "Python" }
      ],
      pipeline: [
        { step: "Image Acquisition", desc: "Sample fingerprint biometric scan dataset collection." },
        { step: "OpenCV Preprocessing", desc: "Noise filtering, contrast enhancement, and ridge contour extraction." },
        { step: "Feature Extraction", desc: "Extracted visual minutiae patterns and biometric spatial vectors." },
        { step: "Classification Model", desc: "Trained and evaluated machine learning classifiers on extracted feature sets." }
      ]
    },
    {
      id: "crime-pattern-detection",
      title: "Crime Pattern Detection",
      category: "ml",
      categoryName: "AI & Machine Learning",
      date: "May 2026",
      featured: false,
      githubUrl: null,
      summary: "A data-driven project exploring crime records to identify patterns, examine trends, and make complex information easier to investigate.",
      shortDescription: "A data-driven project exploring crime records to identify patterns, examine trends, and make complex information easier to investigate.",
      expandedDescription: "This project focuses on exploring crime-related data through structured data preparation, analysis, and visualization. Depending on the available dataset and implemented functionality, it can help examine patterns across recorded incidents and present trends in a more accessible format. The objective is to demonstrate how analytical techniques can support the exploration and interpretation of complex datasets.",
      highlights: [
        "Organized and analyzed multidimensional crime datasets to identify historical trends, temporal distributions, and spatial clusters.",
        "Implemented SQL queries and Pandas data-wrangling pipelines to aggregate records by category and frequency.",
        "Created structured statistical visualizations and clustering models to assist analytical interpretation."
      ],
      tags: ["Python", "Pandas", "SQL", "Data Visualization", "Machine Learning"],
      metrics: [
        { label: "Technique", value: "Clustering & EDA" },
        { label: "Data Stack", value: "SQL & Pandas" },
        { label: "Output", value: "Pattern Insights" }
      ],
      pipeline: [
        { step: "SQL Aggregation", desc: "Queried and structured raw incident records from relational database." },
        { step: "Pandas Wrangling", desc: "Cleaned categorical variables, standardized timestamps, and prepared features." },
        { step: "Exploratory Analysis", desc: "Evaluated recurring patterns and seasonal variations across incident types." },
        { step: "Visual Presentation", desc: "Generated clear analytical charts and data node graphs." }
      ]
    },
    {
      id: "my-portfolio",
      title: "My Portfolio",
      category: "web",
      categoryName: "Full Stack",
      date: "Oct 2026",
      featured: false,
      githubUrl: null,
      summary: "A personal portfolio website showcasing my background, technical skills, projects, and development journey through an interactive visual experience.",
      shortDescription: "A personal portfolio website showcasing my background, technical skills, projects, and development journey through an interactive visual experience.",
      expandedDescription: "This portfolio brings together my technical background, projects, skills, and learning journey in one place. It uses a consistent deep-maroon visual identity, interactive sections, animated visual elements, and responsive layouts to present my work. The project demonstrates my approach to interface design, web development, and building a cohesive personal brand.",
      highlights: [
        "Designed and implemented an executive deep-maroon glassmorphism interface with custom atmospheric lighting effects.",
        "Engineered interactive components including a constellation canvas, floating tech bubbles, and an interactive 3D folding carousel.",
        "Ensured responsive cross-device layouts, semantic HTML5 structure, and full accessibility support."
      ],
      tags: ["HTML", "CSS", "JavaScript", "React", "Responsive Design", "UI Animation"],
      metrics: [
        { label: "Framework", value: "React & Vanilla CSS" },
        { label: "Theme", value: "Deep Maroon Glass" },
        { label: "Layout", value: "Folding Carousel" }
      ],
      pipeline: [
        { step: "UI Architecture", desc: "Created design system with deep-maroon, burgundy, and rose color tokens." },
        { step: "Component Engineering", desc: "Built interactive hero, glassmorphic tech stack, and 3D folding carousel." },
        { step: "Micro-Interactions", desc: "Engineered mouse-following spotlights, tooltips, and folding 3D transitions." },
        { step: "Optimization", desc: "Streamlined performance, responsive breakpoints, and reduced-motion modes." }
      ]
    },
    {
      id: "ecommerce-sales-performance",
      title: "Ecommerce Sales Performance",
      category: "analytics",
      categoryName: "Data Analytics & BI",
      date: "Jun 2026",
      featured: false,
      githubUrl: null,
      summary: "A sales analytics project exploring ecommerce transactions, product performance, customer purchasing patterns, and revenue trends.",
      shortDescription: "A sales analytics project exploring ecommerce transactions, product performance, customer purchasing patterns, and revenue trends.",
      expandedDescription: "This project examines ecommerce sales data to explore transaction patterns, product categories, customer purchasing behaviour, and sales performance across the available records. The analysis can include data cleaning, aggregation, comparisons, and visualizations that make business information easier to understand. Its goal is to demonstrate a structured approach to preparing data and communicating analytical findings.",
      highlights: [
        "Analyzed transactional sales datasets to identify top product categories, regional demand distributions, and repeat purchase trends.",
        "Conducted ETL data transformation using Excel, SQL, and Python to clean customer records and order histories.",
        "Built executive Power BI summary dashboards with interactive filters for category benchmarking and revenue insights."
      ],
      tags: ["Microsoft Excel", "SQL", "Python", "Power BI", "Data Cleaning", "Data Visualization"],
      metrics: [
        { label: "Focus", value: "Sales & Revenue" },
        { label: "Tools", value: "Excel • SQL • Power BI" },
        { label: "Workflow", value: "ETL & Analytics" }
      ],
      pipeline: [
        { step: "Transactional Ingestion", desc: "Consolidated orders, customers, and product inventory datasets." },
        { step: "Data Cleansing", desc: "Handled return anomalies and computed customer lifetime metrics." },
        { step: "SQL Analysis", desc: "Formulated revenue aggregations, monthly trends, and basket breakdowns." },
        { step: "Power BI Reporting", desc: "Delivered interactive dashboard with category sales performance KPIs." }
      ]
    }
  ],

  experience: [
    {
      id: "decodelabs",
      number: "01",
      role: "Data Analytics Intern",
      company: "DecodeLabs.tech",
      logo: "assets/decodelabs-logo.png",
      remoteLogo: "https://media.licdn.com/dms/image/v2/D560BAQGJj6eNsQtGOw/company-logo_200_200/B56Zsdz6jaHAAI-/0/1765731707795?e=2147483647&v=beta&t=uawK7bP-7LV3tVseHH8gWqafvewE6k8mtbqnZaTBL-0",
      period: "Jun 2026 – Jul 2026",
      type: "Internship",
      location: "Remote / Hybrid",
      highlights: [
        "Worked on practical data analytics projects involving dataset analysis, business-oriented problem solving, and collaborative analytical tasks.",
        "Applied data analytics concepts to organize, analyze, and interpret datasets to identify meaningful patterns, outliers, and insights.",
        "Strengthened practical skills in exploratory data analysis, analytical thinking, problem solving, and collaborative project execution in cross-functional teams."
      ],
      responsibilities: [
        "Worked on practical data analytics projects involving dataset analysis, business-oriented problem solving, and collaborative analytical tasks.",
        "Applied data analytics concepts to organize, analyze, and interpret datasets to identify meaningful patterns, outliers, and insights.",
        "Strengthened practical skills in exploratory data analysis, analytical thinking, problem solving, and collaborative project execution in cross-functional teams."
      ],
      tags: ["Data Analytics", "Exploratory Analysis", "Pattern Recognition", "Business Insights", "Problem Solving"]
    },
    {
      id: "careerladder",
      number: "02",
      role: "Full Stack Web Development Intern",
      company: "CareerLadder",
      logo: "assets/careerladder-logo.png",
      remoteLogo: "https://www.careerladderedu.com/logo.png",
      period: "May 2025 – Jun 2025",
      type: "Internship",
      location: "Coimbatore, India",
      highlights: [
        "Developed responsive and cross-browser web pages using HTML, CSS, and modern JavaScript.",
        "Built and tested 5+ RESTful API endpoints using Node.js and Express.js to support key application features.",
        "Integrated MongoDB and MySQL databases and collaborated seamlessly with front-end developers in an agile team environment."
      ],
      responsibilities: [
        "Developed responsive and cross-browser web pages using HTML, CSS, and modern JavaScript.",
        "Built and tested 5+ RESTful API endpoints using Node.js and Express.js to support key application features.",
        "Integrated MongoDB and MySQL databases and collaborated seamlessly with front-end developers in an agile team environment."
      ],
      tags: ["HTML/CSS", "JavaScript", "Node.js", "Express.js", "MongoDB", "MySQL", "REST APIs", "Agile"]
    }
  ],

  education: [
    {
      id: "entri-elevate",
      degree: "AI-Driven Data Analytics",
      institution: "Entri Elevate",
      period: "Jul 2026 – Dec 2026",
      status: "IN PROGRESS",
      logo: "assets/entri-elevate-logo.png",
      remoteLogo: "https://media.licdn.com/dms/image/v2/D560BAQEzU6Cqt9-_VA/company-logo_200_200/B56ZoLMnzcJYAI-/0/1761124450201/entri_elevate_logo?e=2147483647&v=beta&t=S7TVBeT3JBOfiVZ6x553W31vOq7UqABppOgfpxGjOX0",
      description: "Developing practical data analysis, reporting, and visualization skills through hands-on predictive workflows, database querying, and executive KPI dashboard creation.",
      learningSummary: "Developing practical data analysis, reporting, and visualization skills through hands-on predictive workflows, database querying, and executive KPI dashboard creation.",
      learningTags: ["Excel", "Power BI", "SQL", "Python", "Power Query", "Data Modeling"]
    },
    {
      id: "psg-cas",
      degree: "Bachelor of Computer Science (BSc CS)",
      institution: "PSG College of Arts and Science",
      period: "Jun 2023 – May 2026",
      status: "COMPLETED",
      grade: "CGPA: 8.0/10",
      logo: "assets/psg-logo.png",
      remoteLogo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu4jJIN6rskrfqPVUf0-AfpIOoX3wzUZxlMaKR79CX6XVuFxTmVgIwh4sL&s=10",
      description: "Rigorous computer science curriculum emphasizing Database Management Systems (DBMS), Data Structures, Algorithms, Software Engineering, and Object-Oriented Programming.",
      tags: ["DBMS", "Data Structures", "Algorithms", "Software Engineering", "OOP"]
    },
    {
      id: "higher-studies",
      degree: "Higher Studies",
      subtitle: "Higher Secondary Education",
      institution: "Vidya Mandir Matriculation Higher Secondary School",
      period: "Jun 2022 – Mar 2023",
      status: "COMPLETED",
      grade: "82%",
      logo: "assets/vidyamandhir-logo.png",
      remoteLogo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmbKWO4OtSgNQ4gIRCBNh8xpZWt9r6u0DOOMuZ9G1bJEXLxfJ1R-CsmmGb&s=10",
      description: "Foundational coursework in Computer Science, Mathematics, and Physics with strong analytical foundation.",
      tags: ["Computer Science", "Mathematics", "Physics", "Analytical Foundation"]
    }
  ],

  certificates: [
    {
      id: "simplilearn-excel",
      title: "Business Analytics with Excel",
      issuer: "Simplilearn | SkillUp (Powered by Microsoft)",
      date: "Oct 8, 2026",
      code: "10859627",
      recipient: "Sharnitha.T",
      image: "assets/certificates/simplilearn-business-analytics-excel.png",
      category: "Data Analytics & Excel",
      badge: "Microsoft Partner",
      description: "Demonstrated initiative and commitment to deepening analytics skills in business analysis and reporting workflows with Microsoft Excel."
    },
    {
      id: "skillcourse-python",
      title: "30 Days Python Micro Course",
      issuer: "SkillCourse (ISO 9001:2015 Certified)",
      date: "Oct 7, 2026",
      code: "SC-XBXJ0WXVN0",
      recipient: "Sharnitha",
      image: "assets/certificates/skillcourse-30-days-python.png",
      category: "Python Programming",
      badge: "ISO 9001:2015",
      description: "Successfully completed intensive 30-day curriculum covering Python programming syntax, algorithms, data structures, and script automation."
    },
    {
      id: "skillcourse-powerbi",
      title: "30 Days Power BI Micro Course",
      issuer: "SkillCourse (ISO 9001:2015 Certified)",
      date: "Oct 7, 2026",
      code: "SC-3U4BLDK5VL",
      recipient: "Sharnitha",
      image: "assets/certificates/skillcourse-30-days-power-bi.png",
      category: "Business Intelligence",
      badge: "ISO 9001:2015",
      description: "Hands-on 30-day micro course mastering business intelligence dashboards, DAX queries, Power Query ETL, and KPI data modeling."
    },
    {
      id: "linkedin-web-dev",
      title: "HTML, CSS, and JavaScript: Building the Web",
      issuer: "LinkedIn Learning",
      date: "May 21, 2025",
      code: "41d8cb2300b85c90d020fde8667390e1efc43a3d0df38036f6636a1b721eb95b",
      recipient: "Sharnitha Raj",
      image: "assets/certificates/linkedin-html-css-javascript.png",
      category: "Web Development",
      badge: "LinkedIn Verified",
      description: "Comprehensive front-end engineering fundamentals covering responsive web design, semantic HTML, modern CSS styling, and interactive JavaScript."
    },
    {
      id: "novitech-ai",
      title: "30 Days MasterClass in Artificial Intelligence",
      issuer: "NoviTech R&D Private Limited (ISO 9001:2015)",
      date: "Jul 4 – Aug 3, 2024",
      code: "NT_B23AI253",
      recipient: "SHARNITHA.T",
      image: "assets/certificates/novitech-ai-masterclass.png",
      category: "Artificial Intelligence",
      badge: "ISO Certified R&D",
      description: "Extensive hands-on masterclass focusing on core machine learning concepts, AI algorithm pipelines, neural architectures, and intelligent workflows."
    }
  ],

  certifications: [
    {
      title: "Business Analytics with Excel",
      issuer: "Simplilearn / Microsoft SkillUp",
      period: "Oct 2026",
      badge: "Microsoft Partner",
      icon: "FileSpreadsheet"
    },
    {
      title: "30 Days Python Micro Course",
      issuer: "SkillCourse",
      period: "Oct 2026",
      badge: "ISO 9001:2015",
      icon: "Code"
    },
    {
      title: "30 Days Power BI Micro Course",
      issuer: "SkillCourse",
      period: "Oct 2026",
      badge: "ISO 9001:2015",
      icon: "Award"
    },
    {
      title: "HTML, CSS, and JavaScript",
      issuer: "LinkedIn Learning",
      period: "May 2025",
      badge: "Verified",
      icon: "Code"
    },
    {
      title: "Artificial Intelligence MasterClass",
      issuer: "NoviTech R&D Pvt. Ltd.",
      period: "Jul 2024 – Aug 2024",
      badge: "ISO Certified",
      icon: "Cpu"
    }
  ],

  theme: {
    primaryCrimson: "#6C1A1A",
    rubyGlow: "#9B1B30",
    vibrantRose: "#E63946",
    pinkGlow: "#FF758F",
    bgDark: "#0A0304",
    bgCard: "rgba(22, 7, 10, 0.7)",
    borderCrimson: "rgba(108, 26, 26, 0.4)",
    textLight: "#F8FAFC",
    textMuted: "#D4C6C9"
  }
};

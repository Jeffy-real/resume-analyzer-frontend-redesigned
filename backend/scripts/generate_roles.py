#!/usr/bin/env python3
"""
Generate the comprehensive 150+ role database for Smart Resume Analyzer.

This script creates data/roles.json with every supported job role,
including required_skills, preferred_skills, keywords, tools,
frameworks, and certifications for each role.

Run:
    cd backend && python scripts/generate_roles.py
"""
import json
import sys
from pathlib import Path

ROLES = []

# ─────────────────────────────────────────────────────────────────
# HELPER
# ─────────────────────────────────────────────────────────────────
def _role(name, category, req, pref, kw, tools, frames, certs):
    """Append a role dict to ROLES."""
    ROLES.append({
        "name": name,
        "category": category,
        "required_skills": req,
        "preferred_skills": pref,
        "keywords": kw,
        "tools": tools,
        "frameworks": frames,
        "certifications": certs,
    })


# ─────────────────────────────────────────────────────────────────
# CATEGORY 1 — SOFTWARE ENGINEERING (25 roles)
# ─────────────────────────────────────────────────────────────────
_role("Software Engineer",
      "Software Engineering",
      ["Python", "Java", "JavaScript", "SQL", "Git"],
      ["C++", "Go", "Rust", "Docker", "Kubernetes"],
      ["software development", "algorithms", "data structures", "OOP", "design patterns", "API", "testing", "debugging", "CI/CD"],
      ["Git", "Docker", "Jenkins", "Jira", "VS Code", "IntelliJ"],
      ["Spring", "Django", "Flask", "Express.js", ".NET"],
      ["AWS Certified Developer", "Oracle Certified Professional", "Google Cloud Professional"])

_role("Backend Developer",
      "Software Engineering",
      ["Python", "Java", "SQL", "Git", "REST API"],
      ["Go", "Rust", "Docker", "Kubernetes", "TypeScript"],
      ["backend", "server-side", "API development", "microservices", "database design", "authentication", "caching", "scalability"],
      ["PostgreSQL", "MySQL", "Redis", "Docker", "Git", "VS Code"],
      ["Django", "Flask", "Spring Boot", "Express.js", "FastAPI"],
      ["AWS Certified Developer", "Oracle Certified Professional", "Google Cloud Professional"])

_role("Frontend Developer",
      "Software Engineering",
      ["JavaScript", "HTML", "CSS", "React", "TypeScript"],
      ["Vue.js", "Angular", "Sass", "Tailwind CSS", "GraphQL"],
      ["frontend", "UI", "responsive design", "web applications", "SPA", "client-side", "component architecture", "browser APIs"],
      ["VS Code", "Git", "Chrome DevTools", "npm", "Webpack"],
      ["React", "Angular", "Vue.js", "Next.js", "Vite"],
      ["Meta Front-End Developer", "Google Mobile Web Specialist", "AWS Certified Developer"])

_role("Full Stack Developer",
      "Software Engineering",
      ["JavaScript", "React", "Node.js", "SQL", "Git"],
      ["TypeScript", "Docker", "PostgreSQL", "MongoDB", "GraphQL"],
      ["full-stack", "frontend", "backend", "web applications", "REST API", "database design", "CI/CD", "server deployment"],
      ["Git", "Docker", "VS Code", "Postman", "npm"],
      ["React", "Express.js", "Next.js", "Django", "FastAPI"],
      ["AWS Certified Developer", "Meta Front-End Developer", "MongoDB Certified Developer"])

_role("Java Developer",
      "Software Engineering",
      ["Java", "SQL", "Git", "REST API", "Spring"],
      ["Kotlin", "Maven", "Gradle", "Docker", "Hibernate"],
      ["Java", "JVM", "backend", "enterprise", "OOP", "design patterns", "API development", "JDBC"],
      ["IntelliJ IDEA", "Maven", "Gradle", "Git", "Jira", "Postman"],
      ["Spring Boot", "Spring MVC", "Hibernate", "Jakarta EE", "MyBatis"],
      ["Oracle Certified Professional", "AWS Certified Developer", "Google Cloud Professional"])

_role("Python Developer",
      "Software Engineering",
      ["Python", "SQL", "Git", "REST API", "Flask"],
      ["Django", "FastAPI", "PostgreSQL", "Docker", "Celery"],
      ["Python", "backend", "API development", "scripting", "automation", "data processing", "web scraping"],
      ["VS Code", "PyCharm", "Git", "Docker", "pip", "Postman"],
      ["Django", "Flask", "FastAPI", "Pandas", "SQLAlchemy"],
      ["AWS Certified Developer", "Google Cloud Professional", "Certified Kubernetes Administrator"])

_role("C++ Developer",
      "Software Engineering",
      ["C++", "Git", "Linux", "Algorithms", "Data Structures"],
      ["Python", "CMake", "GDB", "Docker", "SQL"],
      ["C++", "performance optimization", "embedded", "systems programming", "OOP", "templates", "multithreading", "memory management"],
      ["Visual Studio", "GDB", "Valgrind", "Git", "CMake", "CLion"],
      ["Boost", "Qt", "Google Test", "CMake", "Vcpkg"],
      [".NET Certified Developer", "Linux Foundation Certified System Administrator", "AWS Certified Developer"])

_role(".NET Developer",
      "Software Engineering",
      ["C#", ".NET", "SQL Server", "JavaScript", "Git"],
      ["TypeScript", "Azure", "Docker", "Entity Framework", "PowerShell"],
      [".NET", "C#", "backend", "enterprise", "API development", "web applications", "ORM", "Windows"],
      ["Visual Studio", "Azure DevOps", "SQL Server", "IIS", "Postman"],
      [".NET Core", "ASP.NET", "Entity Framework", "Blazor", "SignalR"],
      ["Microsoft Certified: Azure Developer", "Microsoft Certified: .NET", "AWS Certified Developer"])

_role("Go Developer",
      "Software Engineering",
      ["Go", "SQL", "Git", "REST API", "Linux"],
      ["Docker", "Kubernetes", "gRPC", "PostgreSQL", "Redis"],
      ["Go", "Golang", "backend", "systems programming", "concurrency", "microservices", "high performance", "cloud-native"],
      ["VS Code", "GoLand", "Git", "Docker", "Postman"],
      ["Gin", "Echo", "Fiber", "gRPC", "Beego"],
      ["Google Cloud Professional", "Certified Kubernetes Administrator", "AWS Certified Developer"])

_role("Rust Developer",
      "Software Engineering",
      ["Rust", "Git", "Linux", "SQL", "REST API"],
      ["Python", "C++", "Docker", "WebAssembly", "Tokio"],
      ["Rust", "systems programming", "safety", "performance", "concurrency", "memory safety", "embedded", "WebAssembly"],
      ["VS Code", "RustRover", "Cargo", "Git", "Docker"],
      ["Actix", "Rocket", "Tokio", "Diesel", "Axum"],
      ["AWS Certified Developer", "Certified Kubernetes Administrator", "Google Cloud Professional"])

_role("Ruby Developer",
      "Software Engineering",
      ["Ruby", "Rails", "SQL", "Git", "REST API"],
      ["JavaScript", "PostgreSQL", "Redis", "Docker", "Sidekiq"],
      ["Ruby", "Rails", "backend", "web applications", "API", "MVC", "database design", "testing"],
      ["VS Code", "RubyMine", "PostgreSQL", "Redis", "Git"],
      ["Ruby on Rails", "RSpec", "Sidekiq", "Devise", "JBuilder"],
      ["AWS Certified Developer", "Heroku Certified Associate", "Google Cloud Professional"])

_role("PHP Developer",
      "Software Engineering",
      ["PHP", "MySQL", "JavaScript", "HTML", "Git"],
      ["TypeScript", "Laravel", "Symfony", "Docker", "WordPress"],
      ["PHP", "backend", "web applications", "CMS", "API development", "OOP", "database design"],
      ["VS Code", "PHPStorm", "XAMPP", "Composer", "Postman"],
      ["Laravel", "Symfony", "WordPress", "CodeIgniter", "Drupal"],
      ["AWS Certified Developer", "WordPress Certified Developer", "Zend Certified Engineer"])

_role("Kotlin Developer",
      "Software Engineering",
      ["Kotlin", "Android", "Java", "Git", "SQL"],
      ["TypeScript", "Jetpack Compose", "Retrofit", "Docker", "Firebase"],
      ["Kotlin", "Android development", "mobile apps", "JVM", "coroutines", "functional programming"],
      ["Android Studio", "IntelliJ IDEA", "Gradle", "Git", "Firebase Console"],
      ["Jetpack Compose", "Retrofit", "Room", "Dagger Hilt", "Ktor"],
      ["Google Associate Android Developer", "AWS Certified Developer", "Firebase Certified"])

_role("Swift Developer",
      "Software Engineering",
      ["Swift", "iOS", "Xcode", "Git", "UIKit"],
      ["SwiftUI", "Core Data", "REST API", "Firebase", "Combine"],
      ["Swift", "iOS development", "mobile apps", "Apple ecosystem", "UI frameworks", "app architecture"],
      ["Xcode", "Instruments", "Git", "CocoaPods", "Swift Package Manager"],
      ["SwiftUI", "UIKit", "Combine", "Core Data", "CloudKit"],
      ["Apple Certified iOS Developer", "AWS Certified Developer", "Google Cloud Professional"])

_role("Mobile App Developer",
      "Software Engineering",
      ["JavaScript", "React Native", "Git", "REST API", "TypeScript"],
      ["Flutter", "Swift", "Kotlin", "Firebase", "Docker"],
      ["mobile apps", "cross-platform", "iOS", "Android", "UI/UX", "push notifications", "app store deployment"],
      ["VS Code", "Xcode", "Android Studio", "Git", "Firebase Console"],
      ["React Native", "Flutter", "Expo", "Redux", "NativeBase"],
      ["Google Associate Android Developer", "Apple Certified Developer", "AWS Certified Developer"])

_role("Android Developer",
      "Software Engineering",
      ["Kotlin", "Android", "Java", "SQL", "Git"],
      ["Jetpack Compose", "Firebase", "Retrofit", "Docker", "TypeScript"],
      ["Android", "mobile apps", "Google Play Store", "UI/UX", "push notifications", "app architecture", "material design"],
      ["Android Studio", "IntelliJ IDEA", "Gradle", "Firebase Console", "Git"],
      ["Jetpack Compose", "Retrofit", "Room", "Dagger Hilt", "WorkManager"],
      ["Google Associate Android Developer", "AWS Certified Developer", "Meta Certified"])

_role("iOS Developer",
      "Software Engineering",
      ["Swift", "iOS", "Xcode", "Git", "UIKit"],
      ["SwiftUI", "Core Data", "Combine", "REST API", "Firebase"],
      ["iOS", "Apple", "mobile apps", "App Store", "UI frameworks", "app architecture", "core ML"],
      ["Xcode", "Instruments", "TestFlight", "CocoaPods", "Git"],
      ["SwiftUI", "UIKit", "Combine", "Core Data", "CloudKit"],
      ["Apple Certified iOS Developer", "AWS Certified Developer", "Google Cloud Professional"])

_role("Flutter Developer",
      "Software Engineering",
      ["Flutter", "Dart", "Git", "REST API", "Firebase"],
      ["Kotlin", "Swift", "TypeScript", "RxDart", "GetX"],
      ["Flutter", "cross-platform", "mobile apps", "UI/UX", "state management", "dart", "widget architecture"],
      ["VS Code", "Android Studio", "Xcode", "Firebase Console", "Git"],
      ["Flutter", "Bloc", "Provider", "GetX", "Riverpod"],
      ["Google Associate Android Developer", "Apple Certified Developer", "AWS Certified Developer"])

_role("React Native Developer",
      "Software Engineering",
      ["React Native", "JavaScript", "TypeScript", "Git", "REST API"],
      ["Swift", "Kotlin", "Firebase", "Redux", "GraphQL"],
      ["React Native", "cross-platform", "mobile apps", "UI/UX", "state management", "navigation", "native modules"],
      ["VS Code", "Xcode", "Android Studio", "Expo CLI", "Git"],
      ["React Native", "Expo", "Redux", "React Navigation", "AsyncStorage"],
      ["AWS Certified Developer", "Google Associate Android Developer", "Meta Certified"])

_role("Embedded Systems Engineer",
      "Software Engineering",
      ["C", "C++", "Embedded Systems", "Linux", "Git"],
      ["Rust", "Python", "RTOS", "ARM", "Assembly"],
      ["embedded", "firmware", "real-time", "IoT", "microcontrollers", "hardware abstraction", "low-level programming"],
      ["JTAG Debugger", "Oscilloscope", "Keil", "IAR", "Git", "Serial Monitor"],
      ["FreeRTOS", "Zephyr", "Mbed OS", "Arduino", "ESP-IDF"],
      ["Embedded Systems Certification (ISCET)", "ARM Accredited Engineer", "AWS Certified Developer"])

_role("Firmware Engineer",
      "Software Engineering",
      ["C", "C++", "Assembly", "Embedded Systems", "Git"],
      ["Python", "Rust", "RTOS", "ARM", "Linux"],
      ["firmware", "bootloader", "BIOS", "device drivers", "hardware", "flash memory", "low-level programming"],
      ["JTAG Debugger", "Logic Analyzer", "Keil", "IAR", "Git"],
      ["FreeRTOS", "Mbed OS", "Zephyr", "UEFI", "U-Boot"],
      ["ARM Accredited Engineer", "Embedded Systems Certification", "Linux Foundation Certified"])

_role("Game Developer",
      "Software Engineering",
      ["C++", "C#", "Unity", "Git", "3D Math"],
      ["Lua", "Python", "Unreal Engine", "Blender", "DirectX"],
      ["game development", "game physics", "rendering", "gameplay", "multiplayer", "game optimization", "3D graphics"],
      ["Unity Editor", "Unreal Editor", "Visual Studio", "Perforce", "Blender"],
      ["Unity", "Unreal Engine", "Godot", "Phaser", "PixiJS"],
      ["Unity Certified Developer", "Unreal Engine Authorized Instructor", "AWS Certified Developer"])

_role("AR Developer",
      "Software Engineering",
      ["C#", "Unity", "Git", "3D Math", "C++"],
      ["Swift", "Kotlin", "ARKit", "ARCore", "Vuforia"],
      ["augmented reality", "AR", "3D rendering", "spatial computing", "marker tracking", "real-time overlay"],
      ["Unity", "Unreal Engine", "ARKit", "ARCore", "Vuforia SDK"],
      ["Unity", "ARKit", "ARCore", "Wikitude", "8th Wall"],
      ["Unity Certified Developer", "Apple Certified Developer", "Google Certified"])

_role("VR Developer",
      "Software Engineering",
      ["C#", "Unity", "C++", "Git", "3D Math"],
      ["Unreal Engine", "Blueprint", "Oculus SDK", "SteamVR", "OpenGL"],
      ["virtual reality", "VR", "immersive", "3D environment", "haptics", "spatial audio", "head tracking"],
      ["Unity", "Unreal Engine", "Oculus Rift/Quest", "HTC Vive", "Visual Studio"],
      ["Unity", "Unreal Engine", "OpenXR", "Oculus SDK", "SteamVR"],
      ["Unity Certified Developer", "Oculus Developer", "AWS Certified Developer"])

_role("Blockchain Developer",
      "Blockchain & Web3",
      ["Solidity", "JavaScript", "Git", "Blockchain", "Cryptography"],
      ["Rust", "Go", "TypeScript", "React", "Node.js"],
      ["blockchain", "smart contracts", "DeFi", "Web3", "decentralized", "cryptocurrency", "tokenomics"],
      ["Remix IDE", "Hardhat", "Truffle", "Ganache", "Git"],
      ["Ethereum", "Solana", "Web3.js", "Ethers.js", "Hardhat"],
      ["Certified Blockchain Developer", "AWS Certified Developer", "Google Cloud Professional"])

_role("Web3 Developer",
      "Blockchain & Web3",
      ["JavaScript", "TypeScript", "Solidity", "Git", "React"],
      ["Rust", "Go", "Node.js", "Hardhat", "IPFS"],
      ["Web3", "decentralized applications", "dApps", "blockchain", "smart contracts", "DeFi", "NFTs", "DAOs"],
      ["MetaMask", "Remix IDE", "Hardhat", "IPFS", "Alchemy"],
      ["Web3.js", "Ethers.js", "Next.js", "React", "Hardhat"],
      ["Certified Blockchain Developer", "AWS Certified Developer", "Google Cloud Professional"])

_role("Smart Contract Developer",
      "Blockchain & Web3",
      ["Solidity", "Rust", "Git", "Cryptography", "Blockchain"],
      ["TypeScript", "Go", "JavaScript", "Hardhat", "Anchor"],
      ["smart contracts", "blockchain", "DeFi", "tokenomics", "audit", "gas optimization", "security patterns"],
      ["Remix IDE", "Hardhat", "Truffle", "Foundry", "Solana CLI"],
      ["Ethereum", "Solana", "Anchor", "Hardhat", "OpenZeppelin"],
      ["Certified Blockchain Developer", "Certified Smart Contract Auditor", "AWS Certified Developer"])

_role("AR/VR/XR Developer",
      "Software Engineering",
      ["C#", "Unity", "C++", "Git", "3D Math"],
      ["Unreal Engine", "Swift", "Kotlin", "Oculus SDK", "OpenXR"],
      ["augmented reality", "virtual reality", "mixed reality", "XR", "spatial computing", "3D interaction", "immersive experience"],
      ["Unity", "Unreal Engine", "HoloLens", "Oculus Quest", "Visual Studio"],
      ["Unity", "Unreal Engine", "OpenXR", "ARKit", "ARCore"],
      ["Unity Certified Developer", "Microsoft Mixed Reality Certified", "Apple Certified Developer"])

# ─────────────────────────────────────────────────────────────────
# CATEGORY 2 — WEB DEVELOPMENT (10 roles)
# ─────────────────────────────────────────────────────────────────
_role("Web Developer",
      "Web Development",
      ["JavaScript", "HTML", "CSS", "React", "Node.js"],
      ["TypeScript", "Vue.js", "Angular", "Next.js", "GraphQL"],
      ["frontend", "backend", "responsive design", "web applications", "SPA", "PWA", "SEO", "cross-browser"],
      ["VS Code", "Git", "Webpack", "npm", "Chrome DevTools"],
      ["React", "Angular", "Vue.js", "Next.js", "Express.js"],
      ["AWS Certified Developer", "Meta Front-End Developer", "Google Cloud Certified"])

_role("WordPress Developer",
      "Web Development",
      ["PHP", "WordPress", "MySQL", "JavaScript", "HTML"],
      ["CSS", "jQuery", "REST API", "WooCommerce", "SEO"],
      ["WordPress", "CMS", "themes", "plugins", "PHP", "web development", "e-commerce", "content management"],
      ["WordPress Admin", "WP-CLI", "MySQL", "Git", "cPanel"],
      ["WordPress", "WooCommerce", "Elementor", "ACF", "Genesis"],
      ["WordPress Certified Developer", "AWS Certified Developer", "Google Cloud Professional"])

_role("Shopify Developer",
      "Web Development",
      ["JavaScript", "Liquid", "HTML", "CSS", "Shopify API"],
      ["TypeScript", "React", "Node.js", "Ruby", "GraphQL"],
      ["Shopify", "e-commerce", "Liquid", "storefront", "checkout", "inventory management", "payment gateway"],
      ["Shopify Admin", "Shopify CLI", "GitHub", "Postman", "Git"],
      ["Shopify Polaris", "Shopify Hydrogen", "React", "Remix", "Next.js"],
      ["Shopify Partner Academy", "AWS Certified Developer", "Google Cloud Professional"])

_role("Drupal Developer",
      "Web Development",
      ["PHP", "Drupal", "MySQL", "JavaScript", "HTML"],
      ["Symfony", "Composer", "Docker", "REST API", "CSS"],
      ["Drupal", "CMS", "PHP", "web applications", "content management", "theming", "module development"],
      ["Drupal Console", "Composer", "Git", "Docker", "Drush"],
      ["Drupal", "Symfony", "Twig", "React", "Vue.js"],
      ["Drupal Certified Developer", "AWS Certified Developer", "Linux Certified"])

_role("E-commerce Developer",
      "Web Development",
      ["JavaScript", "React", "Node.js", "SQL", "REST API"],
      ["TypeScript", "Shopify", "Stripe", "PHP", "Python"],
      ["e-commerce", "online store", "payment gateway", "inventory", "product management", "shopping cart", "checkout flow"],
      ["Shopify", "WooCommerce", "Stripe", "PayPal", "Git", "VS Code"],
      ["React", "Next.js", "Shopify Hydrogen", "WooCommerce", "Medusa.js"],
      ["AWS Certified Developer", "Google Cloud Professional", "Shopify Partner Academy"])

_role("Technical Writer",
      "Web Development",
      ["Technical Writing", "Markdown", "Git", "HTML", "CSS"],
      ["Docker", "Python", "Swagger", "JSDoc", "REST API"],
      ["documentation", "API documentation", "user guides", "tutorials", "content management", "knowledge base"],
      ["Confluence", "Notion", "Git", "Docusaurus", "Swagger"],
      ["Docusaurus", "ReadMe", "GitBook", "Swagger", "Postman"],
      ["API Documentation Certification", "AWS Certified Developer", "Google Cloud Professional"])

_role("E-commerce Architect",
      "Web Development",
      ["JavaScript", "Node.js", "React", "SQL", "Microservices"],
      ["TypeScript", "Docker", "AWS", "Kubernetes", "GraphQL"],
      ["e-commerce", "architecture", "scalability", "payment integration", "inventory management", "distributed systems"],
      ["AWS", "Docker", "Kubernetes", "Elasticsearch", "Redis"],
      ["Next.js", "Medusa.js", "Commercetools", "Magento", "Shopware"],
      ["AWS Solutions Architect", "Google Cloud Professional", "Certified Kubernetes Administrator"])

# ─────────────────────────────────────────────────────────────────
# CATEGORY 3 — DATA SCIENCE & ANALYTICS (18 roles)
# ─────────────────────────────────────────────────────────────────
_role("Data Analyst",
      "Data Science & Analytics",
      ["SQL", "Python", "Excel", "Statistics", "Data Analysis"],
      ["Tableau", "Power BI", "R", "Spark", "Machine Learning"],
      ["data analysis", "data visualization", "reporting", "business intelligence", "ETL", "dashboards", "KPI", "metrics"],
      ["Excel", "Tableau", "Power BI", "SQL", "Python", "Jupyter"],
      ["Pandas", "NumPy", "Matplotlib", "Seaborn", "Plotly"],
      ["Google Data Analytics", "Microsoft Power BI", "Tableau Desktop Specialist"])

_role("Data Scientist",
      "Data Science & Analytics",
      ["Python", "Machine Learning", "SQL", "Statistics", "Pandas"],
      ["TensorFlow", "PyTorch", "Deep Learning", "NLP", "Spark"],
      ["machine learning", "data science", "predictive modeling", "feature engineering", "statistical analysis", "big data", "experimentation"],
      ["Jupyter Notebook", "Python", "R", "SQL", "Git", "AWS"],
      ["TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "Hugging Face"],
      ["Google Professional ML Engineer", "AWS Machine Learning Specialty", "IBM Data Science Professional"])

_role("Data Engineer",
      "Data Science & Analytics",
      ["Python", "SQL", "Spark", "Docker", "Airflow"],
      ["AWS", "Azure", "Scala", "Java", "dbt"],
      ["data pipelines", "ETL", "data warehouse", "big data", "streaming", "data lake", "data modeling", "orchestration"],
      ["Airflow", "Spark", "Docker", "AWS Glue", "dbt", "Git"],
      ["Apache Spark", "Apache Kafka", "Airflow", "dbt", "Delta Lake"],
      ["AWS Certified Data Analytics", "Google Professional Data Engineer", "Databricks Certified"])

_role("Data Architect",
      "Data Science & Analytics",
      ["SQL", "Python", "Data Modeling", "Cloud Computing", "ETL"],
      ["Spark", "Kafka", "Docker", "Terraform", "NoSQL"],
      ["data architecture", "data governance", "data modeling", "data warehousing", "master data management", "data strategy"],
      ["SQL Server", "PostgreSQL", "AWS Redshift", "Snowflake", "ER/Studio"],
      ["Snowflake", "AWS Redshift", "Databricks", "Informatica", "Tableau"],
      ["AWS Solutions Architect", "Google Professional Data Engineer", "Snowflake Certified Architect"])

_role("Business Intelligence Analyst",
      "Data Science & Analytics",
      ["SQL", "Power BI", "Excel", "Python", "Data Analysis"],
      ["Tableau", "R", "ETL", "Data Modeling", "Statistics"],
      ["business intelligence", "BI", "reporting", "dashboards", "data visualization", "KPI tracking", "ad-hoc analysis"],
      ["Power BI", "Tableau", "Excel", "SQL Server", "SSRS"],
      ["Power BI", "Tableau", "SSRS", "SSIS", "Looker"],
      ["Microsoft Certified: Power BI Data Analyst", "Tableau Desktop Specialist", "Google Data Analytics"])

_role("Analytics Engineer",
      "Data Science & Analytics",
      ["SQL", "Python", "dbt", "Git", "Data Modeling"],
      ["Airflow", "Spark", "Docker", "Snowflake", "Terraform"],
      ["analytics engineering", "data transformation", "dbt", "data warehouse", "metrics layer", "data quality", "documentation"],
      ["dbt", "Snowflake", "BigQuery", "Git", "SQLFluff"],
      ["dbt", "Snowflake", "BigQuery", "Looker", "Airflow"],
      ["dbt Analytics Engineering", "Snowflake Certified", "Google Professional Data Engineer"])

_role("Business Analyst",
      "Data Science & Analytics",
      ["SQL", "Excel", "Data Analysis", "Business Analysis", "Requirements Gathering"],
      ["Tableau", "Power BI", "Python", "Agile", "JIRA"],
      ["business analysis", "requirements", "stakeholder management", "process improvement", "gap analysis", "user stories", "acceptance criteria"],
      ["Excel", "JIRA", "Confluence", "Visio", "SQL Server"],
      ["Tableau", "Power BI", "Microsoft Visio", "JIRA", "ServiceNow"],
      ["Certified Business Analysis Professional", "PMI-PBA", "IIBA Certification"])

_role("BI Developer",
      "Data Science & Analytics",
      ["SQL", "Power BI", "ETL", "Python", "Data Warehousing"],
      ["SSIS", "SSRS", "Azure", "Data Modeling", "DAX"],
      ["business intelligence", "data warehouse", "ETL", "reporting", "dashboards", "OLAP", "dimensional modeling"],
      ["Power BI", "SSRS", "SSIS", "SQL Server", "Azure Data Factory"],
      ["Power BI", "SSRS", "SSIS", "Azure Data Factory", "Tableau"],
      ["Microsoft Certified: Power BI Data Analyst", "AWS Certified Developer", "Google Cloud Professional"])

_role("Machine Learning Engineer",
      "Data Science & Analytics",
      ["Python", "Machine Learning", "TensorFlow", "Docker", "SQL"],
      ["PyTorch", "Kubernetes", "AWS", "MLOps", "Scikit-learn"],
      ["machine learning", "ML models", "model training", "model deployment", "feature engineering", "MLOps", "pipeline automation"],
      ["Python", "Docker", "Kubernetes", "MLflow", "AWS SageMaker"],
      ["TensorFlow", "PyTorch", "Scikit-learn", "MLflow", "Kubeflow"],
      ["Google Professional ML Engineer", "AWS Machine Learning Specialty", "Databricks Certified"])

_role("MLOps Engineer",
      "Data Science & Analytics",
      ["Python", "Docker", "Kubernetes", "Git", "CI/CD"],
      ["AWS", "Azure", "Terraform", "MLflow", "Airflow"],
      ["MLOps", "machine learning operations", "model deployment", "CI/CD", "model monitoring", "feature store", "retraining pipelines"],
      ["Docker", "Kubernetes", "MLflow", "Airflow", "AWS SageMaker"],
      ["MLflow", "Kubeflow", "Kubernetes", "Airflow", "Terraform"],
      ["AWS Machine Learning Specialty", "Certified Kubernetes Administrator", "Google Professional ML Engineer"])

_role("NLP Engineer",
      "Data Science & Analytics",
      ["Python", "NLP", "Deep Learning", "TensorFlow", "PyTorch"],
      ["Hugging Face", "SpaCy", "BERT", "Transformers", "SQL"],
      ["natural language processing", "text classification", "NER", "sentiment analysis", "language models", "text generation", "translation"],
      ["Jupyter Notebook", "Python", "Hugging Face", "SpaCy", "NLTK"],
      ["Hugging Face Transformers", "TensorFlow", "PyTorch", "SpaCy", "NLTK"],
      ["Google Professional ML Engineer", "AWS Machine Learning Specialty", "IBM Data Science Professional"])

_role("Computer Vision Engineer",
      "Data Science & Analytics",
      ["Python", "Computer Vision", "Deep Learning", "OpenCV", "PyTorch"],
      ["TensorFlow", "CUDA", "C++", "Object Detection", "Image Processing"],
      ["computer vision", "image processing", "object detection", "image segmentation", "OCR", "video analysis", "3D reconstruction"],
      ["OpenCV", "Python", "PyTorch", "NVIDIA GPUs", "Docker"],
      ["OpenCV", "TensorFlow", "PyTorch", "Detectron2", "MMDetection"],
      ["Google Professional ML Engineer", "AWS Machine Learning Specialty", "NVIDIA Deep Learning Institute"])

_role("Data Quality Analyst",
      "Data Science & Analytics",
      ["SQL", "Python", "Data Analysis", "Data Quality", "Excel"],
      ["Great Expectations", "dbt", "Airflow", "Tableau", "R"],
      ["data quality", "data validation", "data cleansing", "data profiling", "data governance", "anomaly detection", "data standards"],
      ["SQL", "Python", "Great Expectations", "Excel", "Talend"],
      ["Great Expectations", "dbt", "Talend", "Informatica", "Pandas"],
      ["Google Data Analytics", "CDMP", "Tableau Desktop Specialist"])

_role("Quantitative Analyst",
      "Data Science & Analytics",
      ["Python", "R", "Statistics", "SQL", "Financial Modeling"],
      ["C++", "Machine Learning", "Stochastic Calculus", "Bloomberg", "MATLAB"],
      ["quantitative finance", "algorithmic trading", "risk modeling", "financial analysis", "time series", "portfolio optimization"],
      ["Python", "R", "Bloomberg Terminal", "MATLAB", "SQL"],
      ["NumPy", "Pandas", "Scikit-learn", "QuantLib", "TensorFlow"],
      ["CFA", "FRM", "CQF", "AWS Certified Developer"])

_role("Big Data Engineer",
      "Data Science & Analytics",
      ["Python", "Spark", "Hadoop", "SQL", "Java"],
      ["Scala", "Kafka", "Hive", "AWS", "Docker"],
      ["big data", "Hadoop", "Spark", "data lake", "distributed computing", "streaming", "batch processing", "scalable pipelines"],
      ["Apache Spark", "Hadoop", "Hive", "AWS EMR", "Databricks"],
      ["Apache Spark", "Hadoop", "Kafka", "Flink", "Presto"],
      ["AWS Certified Big Data", "Google Professional Data Engineer", "Databricks Certified"])

_role("Database Administrator",
      "Data Science & Analytics",
      ["SQL", "MySQL", "PostgreSQL", "Database Management", "Backup & Recovery"],
      ["Oracle", "SQL Server", "MongoDB", "Redis", "Linux"],
      ["database administration", "backup", "recovery", "performance tuning", "replication", "security", "high availability"],
      ["MySQL", "PostgreSQL", "Oracle", "SQL Server", "pgAdmin"],
      ["MySQL", "PostgreSQL", "Oracle", "SQL Server", "MongoDB"],
      ["Oracle Certified Professional", "Microsoft Certified", "AWS Certified Database Specialty"])

_role("SQL Developer",
      "Data Science & Analytics",
      ["SQL", "MySQL", "PostgreSQL", "Database Design", "Stored Procedures"],
      ["Oracle", "SQL Server", "Python", "ETL", "Data Modeling"],
      ["SQL", "database development", "stored procedures", "triggers", "views", "query optimization", "data modeling"],
      ["SQL Server Management Studio", "MySQL Workbench", "pgAdmin", "DBeaver", "DataGrip"],
      ["SQL Server", "MySQL", "PostgreSQL", "Oracle", "SSIS"],
      ["Oracle Certified Professional", "Microsoft Certified", "AWS Certified Developer"])

# ─────────────────────────────────────────────────────────────────
# CATEGORY 4 — ARTIFICIAL INTELLIGENCE (10 roles)
# ─────────────────────────────────────────────────────────────────
_role("AI Engineer",
      "Artificial Intelligence",
      ["Python", "Machine Learning", "TensorFlow", "PyTorch", "Deep Learning"],
      ["NLP", "Computer Vision", "MLOps", "Docker", "Kubernetes"],
      ["artificial intelligence", "machine learning", "deep learning", "neural networks", "model training", "inference", "deployment", "AI products"],
      ["TensorFlow", "PyTorch", "Jupyter", "Docker", "MLflow"],
      ["TensorFlow", "PyTorch", "Keras", "Scikit-learn", "Hugging Face"],
      ["AWS Machine Learning Specialty", "Google Cloud ML Engineer", "Azure AI Engineer"])

_role("AI Research Scientist",
      "Artificial Intelligence",
      ["Python", "Machine Learning", "Deep Learning", "PyTorch", "TensorFlow"],
      ["C++", "CUDA", "NLP", "Computer Vision", "Reinforcement Learning"],
      ["AI research", "paper implementation", "experimentation", "novel architectures", "benchmarking", "scientific method"],
      ["Jupyter Notebook", "Python", "PyTorch", "Weights & Biases", "Linux"],
      ["PyTorch", "TensorFlow", "Hugging Face", "Weights & Biases", "Ray"],
      ["Google Cloud ML Engineer", "NVIDIA Deep Learning Institute", "AWS Machine Learning Specialty"])

_role("AI Product Manager",
      "Artificial Intelligence",
      ["Product Management", "AI/ML", "Agile", "Data Analysis", "Requirements Gathering"],
      ["Python", "SQL", "Machine Learning", "JIRA", "A/B Testing"],
      ["AI product management", "ML product lifecycle", "model evaluation", "ethical AI", "product strategy", "stakeholder alignment"],
      ["JIRA", "Confluence", "ProductBoard", "Miro", "Figma"],
      ["Scrum", "SAFe", "Kanban", "Notion", "Linear"],
      ["Certified Scrum Product Owner", "Google Product Management", "AWS Certified Cloud Practitioner"])

_role("Prompt Engineer",
      "Artificial Intelligence",
      ["Python", "NLP", "LLM", "Data Analysis", "API"],
      ["Machine Learning", "Deep Learning", "SQL", "JavaScript", "FastAPI"],
      ["prompt engineering", "LLM", "GPT", "Claude", "chain of thought", "few-shot", "fine-tuning", "RAG"],
      ["Jupyter Notebook", "Python", "OpenAI API", "LangChain", "Git"],
      ["LangChain", "LlamaIndex", "FastAPI", "Hugging Face", "Streamlit"],
      ["AWS Certified Developer", "Google Cloud Professional", "OpenAI Certified"])

_role("Robotics Engineer",
      "Artificial Intelligence",
      ["C++", "Python", "ROS", "Machine Learning", "Linux"],
      ["Computer Vision", "SLAM", "Control Systems", "MATLAB", "Docker"],
      ["robotics", "automation", "control systems", "path planning", "sensor fusion", "kinematics", "perception"],
      ["ROS", "Gazebo", "MATLAB/Simulink", "Python", "Linux"],
      ["ROS", "OpenCV", "TensorFlow", "MATLAB", "PyTorch"],
      ["AWS Certified Developer", "NVIDIA Deep Learning Institute", "Robotics Certification"])

_role("AI Infrastructure Engineer",
      "Artificial Intelligence",
      ["Python", "Docker", "Kubernetes", "Linux", "Git"],
      ["Terraform", "AWS", "Azure", "NVIDIA", "C++"],
      ["AI infrastructure", "GPU computing", "model serving", "inference optimization", "distributed training", "ML clusters"],
      ["Docker", "Kubernetes", "NVIDIA Triton", "AWS SageMaker", "Terraform"],
      ["NVIDIA Triton", "Kubernetes", "Terraform", "Airflow", "MLflow"],
      ["AWS Machine Learning Specialty", "Certified Kubernetes Administrator", "NVIDIA Deep Learning Institute"])

_role("Data Science Engineer",
      "Artificial Intelligence",
      ["Python", "SQL", "Machine Learning", "Spark", "Docker"],
      ["Airflow", "dbt", "AWS", "Kubernetes", "Terraform"],
      ["data science engineering", "ML pipelines", "feature engineering", "model deployment", "data infrastructure", "automation"],
      ["Python", "Spark", "Airflow", "Docker", "AWS SageMaker"],
      ["Scikit-learn", "TensorFlow", "PyTorch", "Airflow", "dbt"],
      ["Google Professional Data Engineer", "AWS Machine Learning Specialty", "Databricks Certified"])

_role("AI Ethics Researcher",
      "Artificial Intelligence",
      ["Machine Learning", "Python", "Statistics", "Ethics", "Data Analysis"],
      ["NLP", "Computer Vision", "Fairness Metrics", "Explainable AI", "R"],
      ["AI ethics", "fairness", "bias detection", "explainability", "responsible AI", "AI governance", "algorithmic audit"],
      ["Jupyter Notebook", "Python", "IBM AI Fairness 360", "LIME", "SHAP"],
      ["SHAP", "LIME", "IBM AI Fairness 360", "Fairlearn", "Alibi"],
      ["Google Cloud Professional", "AWS Certified Developer", "Certified Ethical AI Practitioner"])

_role("Conversational AI Engineer",
      "Artificial Intelligence",
      ["Python", "NLP", "LLM", "FastAPI", "Machine Learning"],
      ["TypeScript", "Docker", "Rasa", "Dialogflow", "AWS"],
      ["conversational AI", "chatbots", "voice assistants", "dialogue management", "NLU", "intent recognition", "entity extraction"],
      ["Rasa", "Dialogflow", "AWS Lex", "Python", "Docker"],
      ["Rasa", "Dialogflow", "LangChain", "FastAPI", "Hugging Face"],
      ["AWS Certified Developer", "Google Cloud Professional", "Rasa Certified"])

# ─────────────────────────────────────────────────────────────────
# CATEGORY 5 — CLOUD & DEVOPS (16 roles)
# ─────────────────────────────────────────────────────────────────
_role("Cloud Engineer",
      "Cloud & DevOps",
      ["AWS", "Docker", "Kubernetes", "Linux", "Python"],
      ["Terraform", "Azure", "GCP", "Ansible", "Jenkins"],
      ["cloud infrastructure", "cloud architecture", "IaC", "containers", "orchestration", "high availability", "disaster recovery"],
      ["AWS Console", "Azure Portal", "Docker", "Kubernetes", "Terraform"],
      ["Serverless Framework", "Terraform", "CloudFormation", "ARM Templates"],
      ["AWS Solutions Architect", "Azure Administrator", "Google Cloud Engineer", "Certified Kubernetes Administrator"])

_role("AWS Solutions Architect",
      "Cloud & DevOps",
      ["AWS", "Cloud Architecture", "Networking", "Security", "Linux"],
      ["Terraform", "Python", "Docker", "Kubernetes", "CI/CD"],
      ["AWS", "cloud architecture", "VPC", "EC2", "S3", "Lambda", "RDS", "CloudFront", "high availability"],
      ["AWS Console", "CloudFormation", "Terraform", "AWS CLI", "Git"],
      ["CloudFormation", "Terraform", "AWS CDK", "SAM", "ECS"],
      ["AWS Solutions Architect Associate", "AWS Solutions Architect Professional", "AWS Security Specialty"])

_role("Azure Cloud Engineer",
      "Cloud & DevOps",
      ["Azure", "Docker", "Kubernetes", "Linux", "Python"],
      ["Terraform", "AWS", "PowerShell", "CI/CD", "C#"],
      ["Azure", "cloud infrastructure", "Azure DevOps", "ARM templates", "virtual networks", "Azure AD", "storage accounts"],
      ["Azure Portal", "Azure CLI", "Azure DevOps", "Docker", "Terraform"],
      ["Azure DevOps", "ARM Templates", "Bicep", "Terraform", "AKS"],
      ["Azure Administrator", "Azure Solutions Architect", "Azure DevOps Engineer"])

_role("Google Cloud Engineer",
      "Cloud & DevOps",
      ["Google Cloud", "Docker", "Kubernetes", "Linux", "Python"],
      ["Terraform", "AWS", "Bash", "CI/CD", "SQL"],
      ["Google Cloud", "GCP", "BigQuery", "Cloud Functions", "Compute Engine", "GKE", "Cloud Storage"],
      ["GCP Console", "gcloud CLI", "Docker", "Kubernetes", "Terraform"],
      ["Cloud Functions", "GKE", "Terraform", "Cloud Build", "Pulumi"],
      ["Google Cloud Professional", "Google Cloud Associate", "Certified Kubernetes Administrator"])

_role("DevOps Engineer",
      "Cloud & DevOps",
      ["Linux", "Docker", "Kubernetes", "CI/CD", "Python"],
      ["Terraform", "Ansible", "AWS", "Jenkins", "Bash"],
      ["DevOps", "CI/CD", "automation", "infrastructure as code", "monitoring", "deployment", "incident response", "post-mortem"],
      ["Jenkins", "GitLab CI", "Docker", "Kubernetes", "Terraform", "Ansible"],
      ["Jenkins", "GitLab CI", "GitHub Actions", "ArgoCD", "Terraform"],
      ["Certified Kubernetes Administrator", "AWS DevOps Professional", "HashiCorp Terraform Associate"])

_role("Site Reliability Engineer",
      "Cloud & DevOps",
      ["Linux", "Python", "Kubernetes", "Monitoring", "CI/CD"],
      ["Go", "Terraform", "Prometheus", "Grafana", "AWS"],
      ["SRE", "reliability engineering", "SLI/SLO", "error budgets", "observability", "incident response", "toil reduction", "post-mortem"],
      ["Prometheus", "Grafana", "PagerDuty", "Kubernetes", "Linux"],
      ["Prometheus", "Grafana", "Datadog", "PagerDuty", "Terraform"],
      ["Google Cloud Professional", "Certified Kubernetes Administrator", "AWS Solutions Architect"])

_role("Platform Engineer",
      "Cloud & DevOps",
      ["Kubernetes", "Docker", "Go", "Terraform", "Linux"],
      ["Python", "AWS", "CI/CD", "Monitoring", "ArgoCD"],
      ["platform engineering", "internal developer platform", "IDP", "self-service", "infrastructure abstraction", "golden paths", "developer experience"],
      ["Kubernetes", "ArgoCD", "Terraform", "Crossplane", "Backstage"],
      ["Kubernetes", "ArgoCD", "Crossplane", "Backstage", "Terraform"],
      ["Certified Kubernetes Administrator", "AWS Solutions Architect", "HashiCorp Terraform Associate"])

_role("Release Engineer",
      "Cloud & DevOps",
      ["CI/CD", "Git", "Docker", "Linux", "Python"],
      ["Jenkins", "Kubernetes", "Terraform", "Bash", "Ansible"],
      ["release management", "CI/CD pipelines", "deployment", "versioning", "rollback", "release coordination", "change management"],
      ["Jenkins", "GitLab CI", "Docker", "Kubernetes", "Jira"],
      ["Jenkins", "GitLab CI", "GitHub Actions", "ArgoCD", "Octopus Deploy"],
      ["Certified Kubernetes Administrator", "AWS Certified Developer", "HashiCorp Terraform Associate"])

_role("Infrastructure Engineer",
      "Cloud & DevOps",
      ["Linux", "Networking", "Terraform", "Docker", "Python"],
      ["AWS", "Azure", "Ansible", "Kubernetes", "Bash"],
      ["infrastructure", "data center", "networking", "virtualization", "storage", "server management", "capacity planning", "automation"],
      ["Linux", "VMware", "Terraform", "Ansible", "AWS Console"],
      ["Terraform", "Ansible", "VMware", "Proxmox", "Kubernetes"],
      ["AWS Solutions Architect", "Azure Administrator", "VMware Certified Professional"])

_role("Cloud Security Engineer",
      "Cloud & DevOps",
      ["AWS", "Azure", "Security", "Linux", "Python"],
      ["Terraform", "Docker", "Kubernetes", "SIEM", "IAM"],
      ["cloud security", "IAM", "security groups", "encryption", "compliance", "vulnerability scanning", "incident response", "zero trust"],
      ["AWS Console", "Azure Portal", "Terraform", "SIEM tools", "Burp Suite"],
      ["AWS Security Hub", "Terraform", "CloudTrail", "GuardDuty", "Prisma Cloud"],
      ["AWS Security Specialty", "Azure Security Engineer", "Certified Information Systems Security Professional"])

_role("DevSecOps Engineer",
      "Cloud & DevOps",
      ["Linux", "Docker", "CI/CD", "Python", "Security"],
      ["Kubernetes", "Terraform", "SAST", "DAST", "SIEM"],
      ["DevSecOps", "shift-left security", "SAST", "DAST", "container security", "supply chain security", "security automation", "compliance-as-code"],
      ["SonarQube", "Trivy", "Snyk", "OWASP ZAP", "GitHub Advanced Security"],
      ["SonarQube", "Trivy", "Snyk", "Checkmarx", "HashiCorp Vault"],
      ["Certified Kubernetes Security Specialist", "AWS Security Specialty", "CompTIA Security+"])

_role("Kubernetes Engineer",
      "Cloud & DevOps",
      ["Kubernetes", "Docker", "Linux", "YAML", "Python"],
      ["Helm", "Istio", "ArgoCD", "Terraform", "Go"],
      ["Kubernetes", "container orchestration", "microservices", "service mesh", "Helm", "operators", "cluster management", "autoscaling"],
      ["kubectl", "Helm", "ArgoCD", "Lens", "k9s"],
      ["Kubernetes", "Helm", "Istio", "ArgoCD", "Crossplane"],
      ["Certified Kubernetes Administrator", "Certified Kubernetes Security Specialist", "AWS Certified Solutions Architect"])

_role("Cloud Architect",
      "Cloud & DevOps",
      ["AWS", "Azure", "Cloud Architecture", "Security", "Networking"],
      ["Terraform", "Docker", "Kubernetes", "Python", "Microservices"],
      ["cloud architecture", "multi-cloud", "hybrid cloud", "cost optimization", "governance", "migration", "scalability", "resilience"],
      ["AWS Console", "Azure Portal", "Terraform", "CloudHealth", "AWS Well-Architected Tool"],
      ["CloudFormation", "Terraform", "ARM Templates", "AWS CDK", "Pulumi"],
      ["AWS Solutions Architect Professional", "Azure Solutions Architect", "Google Cloud Professional"])

# ─────────────────────────────────────────────────────────────────
# CATEGORY 6 — CYBERSECURITY (14 roles)
# ─────────────────────────────────────────────────────────────────
_role("Cyber Security Analyst",
      "Cybersecurity",
      ["Security", "Networking", "Linux", "SIEM", "Python"],
      ["Firewall", "IDS/IPS", "Incident Response", "OSINT", "Bash"],
      ["cybersecurity", "threat analysis", "vulnerability assessment", "risk management", "compliance", "SOC", "incident handling"],
      ["SIEM", "Splunk", "Wireshark", "Nessus", "Linux", "Firewalls"],
      ["Splunk", "ELK Stack", "Suricata", "Snort", "OSSEC"],
      ["CompTIA Security+", "Certified Ethical Hacker", "CISSP"])

_role("Penetration Tester",
      "Cybersecurity",
      ["Penetration Testing", "Linux", "Networking", "Python", "OWASP"],
      ["Burp Suite", "Metasploit", "Nmap", "Kali Linux", "Bash"],
      ["penetration testing", "ethical hacking", "exploitation", "vulnerability scanning", "social engineering", "wireless testing", "web app security"],
      ["Kali Linux", "Burp Suite", "Metasploit", "Nmap", "Wireshark"],
      ["Burp Suite", "Metasploit", "OWASP ZAP", "SQLMap", "Cobalt Strike"],
      ["Certified Ethical Hacker", "OSCP", "CompTIA PenTest+", "CREST"])

_role("Ethical Hacker",
      "Cybersecurity",
      ["Penetration Testing", "Linux", "Python", "Networking", "Web Security"],
      ["Burp Suite", "Metasploit", "Kali Linux", "OWASP", "Cryptography"],
      ["ethical hacking", "bug bounty", "exploitation", "reconnaissance", "privilege escalation", "web application security", "network hacking"],
      ["Kali Linux", "Burp Suite", "Metasploit", "Nmap", "Gobuster"],
      ["Metasploit", "Burp Suite", "SQLMap", "Nikto", "Aircrack-ng"],
      ["Certified Ethical Hacker", "OSCP", "Bugcrowd University", "CompTIA Security+"])

_role("SOC Analyst",
      "Cybersecurity",
      ["SIEM", "Networking", "Linux", "Security", "Python"],
      ["Splunk", "Incident Response", "Threat Intelligence", "OSINT", "Bash"],
      ["SOC", "security operations", "incident detection", "log analysis", "threat hunting", "escalation", "forensics", "playbook execution"],
      ["Splunk", "QRadar", "ArcSight", "Wireshark", "Linux"],
      ["Splunk", "ELK Stack", "QRadar", "Cortex XDR", "CrowdStrike"],
      ["CompTIA Security+", "Splunk Certified Power User", "Certified SOC Analyst"])

_role("Security Engineer",
      "Cybersecurity",
      ["Security", "Python", "Linux", "Networking", "SIEM"],
      ["Docker", "Kubernetes", "AWS", "Firewall", "IDS/IPS"],
      ["security engineering", "security architecture", "firewall management", "IDS/IPS", "hardening", "encryption", "access control", "zero trust"],
      ["SIEM", "Firewall appliances", "Linux", "Docker", "AWS Security Hub"],
      ["Splunk", "ELK Stack", "HashiCorp Vault", "CrowdStrike", "Palo Alto"],
      ["Certified Information Systems Security Professional", "AWS Security Specialty", "CompTIA Security+"])

_role("Application Security Engineer",
      "Cybersecurity",
      ["SAST", "DAST", "Python", "Security", "CI/CD"],
      ["Java", "JavaScript", "OWASP", "Docker", "Kubernetes"],
      ["application security", "secure code review", "SAST", "DAST", "vulnerability management", "SDLC", "threat modeling", "security testing"],
      ["SonarQube", "Checkmarx", "Fortify", "OWASP ZAP", "Burp Suite"],
      ["SonarQube", "Checkmarx", "Snyk", "OWASP ZAP", "Contrast Security"],
      ["Certified Application Security Specialist", "AWS Security Specialty", "Certified Secure Software Lifecycle Professional"])

_role("Incident Response Analyst",
      "Cybersecurity",
      ["Incident Response", "Forensics", "Linux", "Networking", "Python"],
      ["SIEM", "Malware Analysis", "OSINT", "Bash", "Windows"],
      ["incident response", "digital forensics", "malware analysis", "threat hunting", "evidence collection", "chain of custody", "recovery", "post-incident"],
      ["EnCase", "FTK", "Volatility", "Splunk", "Wireshark"],
      ["EnCase", "Volatility", "YARA", "Cuckoo Sandbox", "Splunk"],
      ["Certified Incident Handler", "GIAC Certified Incident Handler", "CompTIA Security+"])

_role("Malware Analyst",
      "Cybersecurity",
      ["Malware Analysis", "Reverse Engineering", "Python", "C", "Assembly"],
      ["IDA Pro", "Ghidra", "OllyDbg", "Linux", "C++"],
      ["malware analysis", "reverse engineering", "static analysis", "dynamic analysis", "decompilation", "IOC extraction", "threat intelligence"],
      ["IDA Pro", "Ghidra", "OllyDbg", "Wireshark", "PE Explorer"],
      ["IDA Pro", "Ghidra", "Cuckoo Sandbox", "YARA", "PEiD"],
      ["GIAC Malware Analyst", "Certified Ethical Hacker", "CompTIA Security+"])

_role("Threat Intelligence Analyst",
      "Cybersecurity",
      ["Threat Intelligence", "OSINT", "Python", "Networking", "Security"],
      ["SIEM", "Malware Analysis", "Scripting", "CTI Frameworks", "Bash"],
      ["threat intelligence", "CTI", "MITRE ATT&CK", "threat modeling", "indicators of compromise", "dark web monitoring", "attribution"],
      ["MISP", "OpenCTI", "VirusTotal", "Shodan", "Splunk"],
      ["MISP", "OpenCTI", "STIX/TAXII", "YARA", "Sigma"],
      ["GIAC Cyber Threat Intelligence", "Certified Threat Intelligence Analyst", "CompTIA Security+"])

_role("GRC Analyst",
      "Cybersecurity",
      ["Compliance", "Risk Management", "Security", "Audit", "Excel"],
      ["ISO 27001", "SOC 2", "GDPR", "NIST", "SIEM"],
      ["governance", "risk", "compliance", "audit", "ISO 27001", "SOC 2", "GDPR", "NIST", "policy development", "risk assessment"],
      ["GRC platforms", "Excel", "SharePoint", "ServiceNow", "JIRA"],
      ["ServiceNow GRC", "OneTrust", "RSA Archer", "LogicGate", "Hyperproof"],
      ["Certified Information Systems Auditor", "ISO 27001 Lead Implementer", "Certified Risk Manager"])

_role("Cloud Security Architect",
      "Cybersecurity",
      ["AWS", "Azure", "Security", "Linux", "Python", "IAM", "Zero Trust Architecture"],
      ["Terraform", "Docker", "Kubernetes", "SIEM", "GCP"],
      ["cloud security", "IAM", "security architecture", "zero trust", "encryption", "compliance", "security design", "risk assessment", "threat modeling"],
      ["AWS Console", "Azure Portal", "Terraform", "SIEM tools", "Palo Alto"],
      ["AWS Security Hub", "Terraform", "CloudTrail", "GuardDuty", "Prisma Cloud"],
      ["AWS Security Specialty", "Azure Security Engineer", "Certified Cloud Security Professional"])

# ─────────────────────────────────────────────────────────────────
# CATEGORY 7 — NETWORKING & SYSTEMS (8 roles)
# ─────────────────────────────────────────────────────────────────
_role("Network Engineer",
      "Networking & Systems",
      ["Networking", "Linux", "TCP/IP", "DNS", "Firewall"],
      ["Cisco", "Python", "VMware", "Wireless", "VPN"],
      ["networking", "routing", "switching", "firewall", "network security", "troubleshooting", "VLAN", "load balancing"],
      ["Cisco Router/Switch", "Wireshark", "GNS3", "SolarWinds", "PuTTY"],
      ["Cisco IOS", "Juniper JunOS", "Palo Alto", "F5", "pfSense"],
      ["Cisco CCNA", "CompTIA Network+", "Juniper JNCIA"])

_role("Network Administrator",
      "Networking & Systems",
      ["Networking", "Linux", "Windows Server", "DNS", "DHCP"],
      ["Cisco", "Firewall", "VMware", "Python", "Monitoring"],
      ["network administration", "monitoring", "troubleshooting", "configuration management", "upgrades", "patch management", "documentation"],
      ["Cisco", "SolarWinds", "Nagios", "Wireshark", "Active Directory"],
      ["Cisco IOS", "Windows Server", "Linux", "VMware", "Nagios"],
      ["Cisco CCNA", "CompTIA Network+", "CompTIA Server+"])

_role("Systems Administrator",
      "Networking & Systems",
      ["Linux", "Windows Server", "Networking", "Active Directory", "Shell Scripting"],
      ["VMware", "Docker", "Python", "Monitoring", "Backup"],
      ["system administration", "server management", "user management", "backup", "patch management", "security hardening", "monitoring"],
      ["Linux CLI", "Active Directory", "VMware", "Nagios", "Ansible"],
      ["VMware", "Docker", "Ansible", "Nagios", "Zabbix"],
      ["Linux Foundation Certified System Administrator", "CompTIA Server+", "Microsoft Certified"])

_role("Linux Administrator",
      "Networking & Systems",
      ["Linux", "Shell Scripting", "Networking", "Security", "Docker"],
      ["Ansible", "Python", "Kubernetes", "Monitoring", "Backup"],
      ["Linux", "server administration", "shell scripting", "security hardening", "performance tuning", "package management", "systemd", "cron"],
      ["Linux CLI", "Ansible", "Nagios", "Zabbix", "Docker"],
      ["Ansible", "Docker", "Kubernetes", "Nagios", "Zabbix"],
      ["Linux Foundation Certified System Administrator", "Red Hat Certified System Administrator", "CompTIA Linux+"])

_role("Windows System Administrator",
      "Networking & Systems",
      ["Windows Server", "Active Directory", "PowerShell", "Networking", "DNS"],
      ["Azure", "VMware", "Exchange", "Group Policy", "Docker"],
      ["Windows Server", "Active Directory", "PowerShell", "Group Policy", "IIS", "DNS", "DHCP", "user management"],
      ["Windows Server", "Active Directory", "PowerShell", "VMware", "Azure Portal"],
      ["PowerShell", "System Center", "Azure", "VMware", "Exchange"],
      ["Microsoft Certified: Windows Server", "Azure Administrator", "CompTIA Server+"])

_role("System Engineer",
      "Networking & Systems",
      ["Linux", "Windows Server", "Networking", "Cloud Computing", "Security"],
      ["Docker", "Kubernetes", "Ansible", "Terraform", "Python"],
      ["systems engineering", "infrastructure", "integration", "system design", "performance optimization", "automation", "documentation"],
      ["Linux", "Windows Server", "VMware", "AWS", "Docker"],
      ["Docker", "Kubernetes", "Ansible", "Terraform", "VMware"],
      ["AWS Solutions Architect", "Azure Administrator", "Linux Foundation Certified"])

_role("Wireless Network Engineer",
      "Networking & Systems",
      ["Wireless", "Networking", "Cisco", "Linux", "Security"],
      ["Wi-Fi", "Python", "Firewall", "Monitoring", "VLAN"],
      ["wireless networking", "Wi-Fi", "802.11", "RF planning", "wireless security", "access points", "site survey", "spectrum analysis"],
      ["Cisco WLC", "Ekahau", "Wireshark", "Nmap", "SolarWinds"],
      ["Cisco WLC", "Aruba", "Ubiquiti", "Ekahau", "Wireshark"],
      ["Cisco CCNA Wireless", "CWNA Certified Wireless Network Administrator", "CompTIA Network+"])

_role("Telecom Engineer",
      "Networking & Systems",
      ["Networking", "Telecommunications", "Linux", "Python", "5G"],
      ["VoIP", "SIP", "Wireless", "Fiber", "Cloud"],
      ["telecommunications", "VoIP", "5G", "LTE", "fiber optics", "network design", "SIP trunking", "carrier services"],
      ["VoIP Systems", "SIP Servers", "Linux", "Wireshark", "Nmap"],
      ["Cisco", "Asterisk", "FreeSWITCH", "Avaya", "Mitel"],
      ["Cisco CCNA", "CompTIA Network+", "Avaya Certified Support Specialist"])

# ─────────────────────────────────────────────────────────────────
# CATEGORY 8 — QA & TESTING (7 roles)
# ─────────────────────────────────────────────────────────────────
_role("QA Engineer",
      "Quality Assurance",
      ["Manual Testing", "Test Cases", "Bug Reporting", "SQL", "Git"],
      ["Selenium", "JIRA", "API Testing", "Python", "Agile"],
      ["quality assurance", "manual testing", "test planning", "test cases", "defect tracking", "regression testing", "UAT", "exploratory testing"],
      ["JIRA", "TestRail", "Postman", "SQL Server", "Git"],
      ["Selenium", "TestRail", "JIRA", "Zephyr", "Postman"],
      ["ISTQB Certified Tester", "Certified Software Tester", "AWS Certified Developer"])

_role("Automation Tester",
      "Quality Assurance",
      ["Selenium", "Python", "Java", "Git", "SQL"],
      ["Cypress", "Playwright", "REST API", "Docker", "Jenkins"],
      ["test automation", "automation framework", "CI/CD testing", "regression testing", "test scripting", "code coverage", "parallel testing"],
      ["Selenium", "PyCharm", "VS Code", "Git", "Jenkins"],
      ["Selenium", "Pytest", "JUnit", "TestNG", "Cucumber"],
      ["ISTQB Certified Tester", "Selenium Certified Professional", "AWS Certified Developer"])

_role("SDET",
      "Quality Assurance",
      ["Java", "Selenium", "Python", "Git", "API Testing"],
      ["Cypress", "Playwright", "Docker", "Kubernetes", "Jenkins"],
      ["SDET", "software development engineer in test", "test automation", "code quality", "performance testing", "test architecture", "CI/CD testing"],
      ["IntelliJ IDEA", "VS Code", "Jenkins", "Selenium Grid", "Git"],
      ["Selenium", "TestNG", "Cucumber", "Rest Assured", "JMeter"],
      ["ISTQB Certified Tester", "AWS Certified Developer", "Certified Software Test Engineer"])

_role("Performance Tester",
      "Quality Assurance",
      ["JMeter", "Performance Testing", "SQL", "Linux", "Scripting"],
      ["LoadRunner", "Gatling", "Python", "Docker", "Monitoring"],
      ["performance testing", "load testing", "stress testing", "scalability", "bottleneck analysis", "capacity planning", "benchmarking", "profiling"],
      ["JMeter", "LoadRunner", "Gatling", "New Relic", "Grafana"],
      ["JMeter", "Gatling", "Locust", "k6", "New Relic"],
      ["ISTQB Certified Tester", "HPE ASE LoadRunner", "AWS Certified Developer"])

_role("Test Engineer",
      "Quality Assurance",
      ["Testing", "SQL", "Git", "Python", "Linux"],
      ["Selenium", "Docker", "API Testing", "JIRA", "CI/CD"],
      ["test engineering", "test strategy", "test automation", "API testing", "integration testing", "system testing", "test environments"],
      ["Selenium", "Postman", "Git", "JIRA", "Docker"],
      ["Selenium", "Rest Assured", "Pytest", "Cypress", "JMeter"],
      ["ISTQB Certified Tester", "Certified Software Tester", "AWS Certified Developer"])

_role("Mobile QA Engineer",
      "Quality Assurance",
      ["Mobile Testing", "Selenium", "SQL", "Git", "Bug Reporting"],
      ["Appium", "Cypress", "Python", "iOS", "Android"],
      ["mobile testing", "iOS", "Android", "cross-platform testing", "app testing", "device compatibility", "performance testing", "UI testing"],
      ["Appium", "Xcode", "Android Studio", "Firebase Test Lab", "BrowserStack"],
      ["Appium", "Espresso", "XCUITest", "Detox", "Cypress"],
      ["ISTQB Mobile Tester", "Certified Software Tester", "AWS Certified Developer"])

_role("Test Automation Architect",
      "Quality Assurance",
      ["Selenium", "Java", "Python", "CI/CD", "Git"],
      ["Cypress", "Playwright", "Docker", "Kubernetes", "Design Patterns"],
      ["test automation architecture", "framework design", "CI/CD integration", "test strategy", "code quality", "scalability", "governance", "best practices"],
      ["Selenium Grid", "Docker", "Jenkins", "Git", "Allure"],
      ["Selenium", "TestNG", "Cucumber", "Allure", "Rest Assured"],
      ["ISTQB Certified Tester", "Certified Software Test Architect", "AWS Certified Developer"])

# ─────────────────────────────────────────────────────────────────
# CATEGORY 9 — DESIGN (8 roles)
# ─────────────────────────────────────────────────────────────────
_role("UI Designer",
      "Design",
      ["Figma", "Adobe XD", "HTML", "CSS", "Prototyping"],
      ["Photoshop", "Illustrator", "Design Systems", "JavaScript", "Accessibility"],
      ["user interface", "visual design", "layout", "typography", "color theory", "design systems", "UI patterns", "responsive design"],
      ["Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator"],
      ["Figma", "Adobe XD", "Sketch", "Storybook", "Zeplin"],
      ["Google UX Design Certificate", "Adobe Certified Professional", "Nielsen Norman UX Certification"])

_role("UX Designer",
      "Design",
      ["User Research", "Wireframing", "Prototyping", "Figma", "Information Architecture"],
      ["Usability Testing", "Interaction Design", "HTML", "CSS", "Accessibility"],
      ["user experience", "UX research", "user journey", "wireframing", "prototyping", "usability", "personas", "user testing"],
      ["Figma", "Miro", "UserTesting", "Optimal Workshop", "Hotjar"],
      ["Figma", "Sketch", "InVision", "Axure", "Balsamiq"],
      ["Google UX Design Certificate", "Nielsen Norman UX Certification", "Certified Usability Analyst"])

_role("Product Designer",
      "Design",
      ["Figma", "User Research", "Prototyping", "Design Systems", "HTML/CSS"],
      ["React", "JavaScript", "Animation", "Accessibility", "Data Analysis"],
      ["product design", "end-to-end design", "user research", "wireframing", "prototyping", "design systems", "cross-functional collaboration"],
      ["Figma", "Miro", "Notion", "JIRA", "Storybook"],
      ["Figma", "Sketch", "Lottie", "Storybook", "Principle"],
      ["Google UX Design Certificate", "Nielsen Norman UX Certification", "Interaction Design Foundation"])

_role("Graphic Designer",
      "Design",
      ["Photoshop", "Illustrator", "InDesign", "Typography", "Color Theory"],
      ["Figma", "After Effects", "Sketch", "Branding", "Print Design"],
      ["graphic design", "branding", "visual identity", "typography", "layout", "print design", "digital design", "logo design"],
      ["Adobe Creative Suite", "Figma", "Canva", "InVision", "Procreate"],
      ["Photoshop", "Illustrator", "InDesign", "After Effects", "Figma"],
      ["Adobe Certified Professional", "Google UX Design Certificate"])

_role("Motion Designer",
      "Design",
      ["After Effects", "Cinema 4D", "Premiere Pro", "Animation", "Figma"],
      ["Blender", "3ds Max", "Lottie", "SVG Animation", "CSS Animation"],
      ["motion design", "animation", "video production", "motion graphics", "visual effects", "3D animation", "transitions"],
      ["After Effects", "Cinema 4D", "Premiere Pro", "Blender", "Lottie"],
      ["After Effects", "Lottie", "Rive", "Principle", "Framer"],
      ["Adobe Certified Professional", "Apple Motion Certified", "Maxon Certified"])

_role("Interaction Designer",
      "Design",
      ["Figma", "Prototyping", "Interaction Design", "User Research", "HTML/CSS"],
      ["Framer", "React", "JavaScript", "Animation", "Accessibility"],
      ["interaction design", "micro-interactions", "animation", "prototyping", "usability", "user flows", "wireframing", "specification"],
      ["Figma", "Principle", "Framer", "Framer Motion", "InVision"],
      ["Figma", "Framer", "Principle", "ProtoPie", "Framer Motion"],
      ["Google UX Design Certificate", "Interaction Design Foundation", "Nielsen Norman Certification"])

_role("UX Researcher",
      "Design",
      ["User Research", "Usability Testing", "Data Analysis", "Interviews", "Statistics"],
      ["Figma", "Survey Design", "A/B Testing", "Python", "Excel"],
      ["UX research", "qualitative research", "quantitative research", "usability testing", "user interviews", "surveys", "card sorting", "A/B testing"],
      ["UserTesting", "Maze", "Optimal Workshop", "Hotjar", "Lookback"],
      ["Maze", "UserTesting", "Optimal Workshop", "Hotjar", "Dovetail"],
      ["Certified Usability Analyst", "Google UX Design Certificate", "Nielsen Norman Certification"])

_role("Design System Designer",
      "Design",
      ["Figma", "Design Systems", "HTML", "CSS", "Storybook"],
      ["React", "JavaScript", "TypeScript", "Accessibility", "Animation"],
      ["design systems", "component library", "tokens", "accessibility", "documentation", "governance", "cross-platform consistency"],
      ["Figma", "Storybook", "ZeroHeight", "Tokens Studio", "GitHub"],
      ["Figma", "Storybook", "Design Tokens", "ZeroHeight", "Chromatic"],
      ["Google UX Design Certificate", "Certified Design System Manager", "Nielsen Norman Certification"])

# ─────────────────────────────────────────────────────────────────
# CATEGORY 10 — PRODUCT & MANAGEMENT (12 roles)
# ─────────────────────────────────────────────────────────────────
_role("Product Manager",
      "Product & Management",
      ["Product Management", "Agile", "Data Analysis", "User Research", "Roadmapping"],
      ["SQL", "JIRA", "Figma", "A/B Testing", "Stakeholder Management"],
      ["product management", "product strategy", "roadmap", "prioritization", "user stories", "KPIs", "go-to-market", "market research"],
      ["JIRA", "ProductBoard", "Aha!", "Miro", "Notion"],
      ["Scrum", "SAFe", "Kanban", "Notion", "Linear"],
      ["Certified Scrum Product Owner", "Pragmatic Institute", "AWS Cloud Practitioner"])

_role("Technical Product Manager",
      "Product & Management",
      ["Product Management", "Technical Understanding", "Agile", "API", "SQL"],
      ["Python", "JIRA", "Figma", "Data Analysis", "Architecture"],
      ["technical product management", "API products", "platform products", "technical requirements", "system design", "developer experience", "technical roadmap"],
      ["JIRA", "Confluence", "ProductBoard", "Figma", "Postman"],
      ["Scrum", "SAFe", "Technical Writing", "API Design", "System Design"],
      ["Certified Scrum Product Owner", "AWS Cloud Practitioner", "Google Cloud Professional"])

_role("ML Product Manager",
      "Product & Management",
      ["Product Management", "AI/ML", "Agile", "Data Analysis", "Requirements Gathering"],
      ["Python", "SQL", "Machine Learning", "JIRA", "A/B Testing"],
      ["ML product management", "machine learning product lifecycle", "model evaluation", "model governance", "product strategy", "stakeholder alignment", "data-driven decisions"],
      ["JIRA", "Confluence", "ProductBoard", "Miro", "Figma"],
      ["Scrum", "SAFe", "Kanban", "Notion", "Linear"],
      ["Certified Scrum Product Owner", "Google Product Management", "AWS Certified Cloud Practitioner"])

_role("Project Manager",
      "Product & Management",
      ["Project Management", "Agile", "Scrum", "Risk Management", "Stakeholder Management"],
      ["JIRA", "MS Project", "Budget Management", "Communication", "Leadership"],
      ["project management", "scheduling", "budgeting", "risk management", "resource allocation", "status reporting", "stakeholder communication"],
      ["JIRA", "MS Project", "Monday.com", "Asana", "Notion"],
      ["MS Project", "Smartsheet", "Monday.com", "Asana", "Notion"],
      ["PMP", "Certified ScrumMaster", "PRINCE2", "CompTIA Project+"])

_role("Technical Project Manager",
      "Product & Management",
      ["Project Management", "Agile", "Technical Understanding", "Scrum", "Risk Management"],
      ["JIRA", "Confluence", "Python", "SQL", "Cloud Computing"],
      ["technical project management", "engineering coordination", "release management", "technical risk assessment", "cross-team coordination", "technical debt tracking"],
      ["JIRA", "Confluence", "GitHub", "Slack", "Azure DevOps"],
      ["JIRA", "GitHub", "Azure DevOps", "Monday.com", "Notion"],
      ["PMP", "Certified ScrumMaster", "AWS Cloud Practitioner", "SAFe Agilist"])

_role("Program Manager",
      "Product & Management",
      ["Program Management", "Agile", "Leadership", "Strategy", "Stakeholder Management"],
      ["JIRA", "Excel", "Communication", "Budget Management", "Risk Management"],
      ["program management", "cross-program coordination", "strategic alignment", "resource management", "portfolio management", "executive reporting", "OKRs"],
      ["JIRA", "Excel", "PowerPoint", "Monday.com", "Smartsheet"],
      ["Smartsheet", "Planview", "Microsoft Project", "Confluence", "Notion"],
      ["PMP", "SAFe Program Consultant", "Certified ScrumMaster", "PMI-ACP"])

_role("Scrum Master",
      "Product & Management",
      ["Scrum", "Agile", "Facilitation", "Coaching", "JIRA"],
      ["Kanban", "SAFe", "Conflict Resolution", "Metrics", "Retrospectives"],
      ["scrum master", "servant leadership", "facilitation", "impediment removal", "team coaching", "agile adoption", "continuous improvement", "sprint management"],
      ["JIRA", "Miro", "Slack", "Retrium", "Azure DevOps"],
      ["JIRA", "Miro", "Retrium", "Slido", "EasyRetro"],
      ["Certified ScrumMaster", "Professional Scrum Master", "SAFe Scrum Master", "ICAgile"])

_role("Delivery Manager",
      "Product & Management",
      ["Agile", "Project Management", "Leadership", "Stakeholder Management", "Risk Management"],
      ["JIRA", "Scrum", "Kanban", "Azure DevOps", "Excel"],
      ["delivery management", "on-time delivery", "quality management", "team performance", "process improvement", "release coordination", "vendor management"],
      ["JIRA", "Azure DevOps", "Monday.com", "Power BI", "Excel"],
      ["JIRA", "Azure DevOps", "Monday.com", "Smartsheet", "Confluence"],
      ["PMP", "Certified ScrumMaster", "SAFe Agilist", "AWS Cloud Practitioner"])

_role("Agile Coach",
      "Product & Management",
      ["Agile", "Scrum", "Kanban", "Coaching", "Leadership"],
      ["SAFe", "LeSS", "Facilitation", "Change Management", "Metrics"],
      ["agile coaching", "agile transformation", "team development", "organizational change", "scaling agile", "maturity assessment", "culture shift"],
      ["JIRA", "Miro", "Mural", "Confluence", "Retrium"],
      ["JIRA", "Miro", "Mural", "Retrium", "Agile Craft"],
      ["ICAgile Certified Professional", "Certified ScrumMaster", "SAFe Program Consultant"])

_role("Delivery Lead",
      "Product & Management",
      ["Agile", "Project Management", "Communication", "Scrum", "Leadership"],
      ["JIRA", "Azure DevOps", "Risk Management", "Budget Management", "Stakeholder Management"],
      ["delivery leadership", "team management", "project delivery", "cross-functional coordination", "quality assurance", "process optimization", "stakeholder communication"],
      ["JIRA", "Azure DevOps", "Monday.com", "Confluence", "Power BI"],
      ["JIRA", "Azure DevOps", "Smartsheet", "Notion", "Confluence"],
      ["PMP", "Certified ScrumMaster", "SAFe Agilist", "AWS Cloud Practitioner"])

_role("Release Manager",
      "Product & Management",
      ["Release Management", "CI/CD", "Agile", "Communication", "Risk Management"],
      ["JIRA", "Jenkins", "Docker", "Git", "ServiceNow"],
      ["release management", "deployment coordination", "change management", "rollback planning", "release documentation", "stakeholder communication", "compliance"],
      ["JIRA", "ServiceNow", "Jenkins", "Azure DevOps", "GitLab"],
      ["JIRA", "ServiceNow", "Azure DevOps", "Octopus Deploy", "Jenkins"],
      ["ITIL Foundation", "PMP", "SAFe Agilist", "Certified ScrumMaster"])

_role("Technical Program Manager",
      "Product & Management",
      ["Technical Program Management", "Agile", "Stakeholder Management", "Architecture", "Risk Management"],
      ["Python", "SQL", "JIRA", "Confluence", "Cloud Computing"],
      ["technical program management", "cross-team coordination", "technical strategy", "dependency management", "milestone tracking", "architecture review", "technical risk management"],
      ["JIRA", "Confluence", "Azure DevOps", "PowerPoint", "Miro"],
      ["JIRA", "Azure DevOps", "Notion", "Confluence", "Miro"],
      ["PMP", "SAFe Program Consultant", "AWS Cloud Practitioner", "Certified ScrumMaster"])

# ─────────────────────────────────────────────────────────────────
# CATEGORY 11 — ENTERPRISE / CRM / ERP (10 roles)
# ─────────────────────────────────────────────────────────────────
_role("Salesforce Developer",
      "Enterprise Solutions",
      ["Apex", "Visualforce", "Lightning Web Components", "SOQL", "Salesforce Platform"],
      ["JavaScript", "TypeScript", "REST API", "SQL", "Git"],
      ["Salesforce", "CRM", "Apex", "LWC", "trigger", "custom object", "workflow", "process builder", "integration"],
      ["Salesforce Developer Console", "VS Code", "Salesforce CLI", "Workbench", "Git"],
      ["Salesforce Platform", "Lightning Web Components", "Apex", "Heroku", "MuleSoft"],
      ["Salesforce Certified Platform Developer", "Salesforce Certified Administrator", "AWS Certified Developer"])

_role("Salesforce Administrator",
      "Enterprise Solutions",
      ["Salesforce", "CRM", "Data Management", "Reporting", "User Management"],
      ["Apex", "Visualforce", "SOQL", "Excel", "JavaScript"],
      ["Salesforce administration", "user management", "data management", "reporting", "dashboards", "workflow automation", "security model", "customization"],
      ["Salesforce Admin Portal", "Data Loader", "Excel", "Salesforce CLI", "JIRA"],
      ["Salesforce Platform", "Data Loader", "Process Builder", "Flow Builder", "Reports & Dashboards"],
      ["Salesforce Certified Administrator", "Salesforce Certified Advanced Administrator", "Salesforce Certified Platform App Builder"])

_role("SAP Consultant",
      "Enterprise Solutions",
      ["SAP", "ABAP", "SQL", "Business Process", "Integration"],
      ["SAP HANA", "SAP Fiori", "SAP BW", "Oracle", "Python"],
      ["SAP", "ERP", "business process", "configuration", "customization", "integration", "migration", "module implementation"],
      ["SAP GUI", "SAP Fiori", "SAP HANA Studio", "Transaction Codes", "SAP Solution Manager"],
      ["SAP Fiori", "SAP HANA", "SAP Integration Suite", "SAP BTP", "ABAP"],
      ["SAP Certified Application Associate", "SAP Certified Development Professional", "AWS Certified Developer"])

_role("SAP Developer",
      "Enterprise Solutions",
      ["ABAP", "SAP", "SQL", "OData", "SAP UI5"],
      ["Fiori", "CDS Views", "BTP", "HANA", "JavaScript"],
      ["SAP development", "ABAP", "SAP Fiori", "SAP BTP", "custom reports", "enhancements", "user exits", "BADIs"],
      ["SAP GUI", "Eclipse ADT", "SAP BTP", "SAP HANA Studio", "Git"],
      ["SAP Fiori", "SAP UI5", "CDS Views", "SAP BTP", "ABAP RESTful Application Programming"],
      ["SAP Certified Application Developer", "SAP Certified Development Professional", "AWS Certified Developer"])

_role("Oracle Consultant",
      "Enterprise Solutions",
      ["Oracle", "SQL", "PL/SQL", "Linux", "Database Administration"],
      ["Oracle Cloud", "Oracle EBS", "Java", "Shell Scripting", "Docker"],
      ["Oracle", "database administration", "PL/SQL", "performance tuning", "backup recovery", "Oracle Cloud", "EBS implementation", "migration"],
      ["Oracle Enterprise Manager", "SQL Developer", "Linux", "RMAN", "Data Guard"],
      ["Oracle Database", "Oracle EBS", "Oracle Cloud", "Oracle APEX", "GoldenGate"],
      ["Oracle Certified Professional", "Oracle Cloud Infrastructure Certified", "AWS Certified Developer"])

_role("Oracle Developer",
      "Enterprise Solutions",
      ["PL/SQL", "Oracle", "SQL", "Java", "REST API"],
      ["Oracle APEX", "Oracle Cloud", "JavaScript", "HTML", "Docker"],
      ["Oracle development", "PL/SQL", "Oracle APEX", "stored procedures", "functions", "packages", "triggers", "reporting"],
      ["Oracle SQL Developer", "Oracle APEX", "Toad", "Oracle Cloud Console", "Git"],
      ["Oracle APEX", "Oracle Cloud", "Oracle Forms", "Oracle Reports", "Java"],
      ["Oracle Certified Professional", "Oracle APEX Certified", "AWS Certified Developer"])

_role("SAP Basis Consultant",
      "Enterprise Solutions",
      ["SAP Basis", "Linux", "Oracle", "SAP HANA", "Networking"],
      ["Windows Server", "SAP Solution Manager", "Shell Scripting", "Docker", "Monitoring"],
      ["SAP Basis", "system administration", "installation", "upgrade", "patch management", "performance tuning", "transport management", "system copy"],
      ["SAP GUI", "SAP Solution Manager", "SAP HANA Studio", "Linux", "Oracle Enterprise Manager"],
      ["SAP HANA", "SAP Solution Manager", "SAP BTP", "Terraform", "Ansible"],
      ["SAP Certified Technology Associate", "SAP Certified Technology Professional", "AWS Certified Developer"])

_role("Dynamics 365 Developer",
      "Enterprise Solutions",
      ["C#", ".NET", "Dynamics 365", "SQL Server", "JavaScript"],
      ["Azure", "Power Platform", "TypeScript", "REST API", "Docker"],
      ["Dynamics 365", "CRM", "ERP", "plugin development", "custom workflows", "business process flows", "PCF controls", "integration"],
      ["Visual Studio", "Azure DevOps", "Dynamics 365 Portal", "XrmToolBox", "Postman"],
      ["Dynamics 365", "Power Platform", "Dataverse", "Power Apps", "Azure Functions"],
      ["Microsoft Certified: Power Platform App Maker", "Microsoft Certified: Dynamics 365", "AWS Certified Developer"])

_role("Workday Consultant",
      "Enterprise Solutions",
      ["Workday", "HCM", "Integration", "Security", "Business Process"],
      ["SQL", "XML", "XSLT", "REST API", "Excel"],
      ["Workday", "HCM", "payroll", "benefits", "recruiting", "compensation", "reporting", "integration", "security configuration"],
      ["Workday Studio", "Workday Dashboard", "Excel", "Report Writer", "EIB"],
      ["Workday HCM", "Workday Payroll", "Workday Recruiting", "Workday Security", "Workday Integration"],
      ["Workday Certified HCM Consultant", "Workday Certified Integration Consultant", "AWS Certified Developer"])

_role("ERP Consultant",
      "Enterprise Solutions",
      ["ERP", "Business Process", "SQL", "Data Migration", "Integration"],
      ["SAP", "Oracle", "Dynamics 365", "Python", "Excel"],
      ["ERP", "enterprise resource planning", "business process", "implementation", "data migration", "customization", "integration", "training"],
      ["ERP Admin Console", "Excel", "SQL", "JIRA", "Visio"],
      ["SAP", "Oracle ERP Cloud", "Dynamics 365", "NetSuite", "Odoo"],
      ["SAP Certified", "Oracle Cloud Certified", "Microsoft Certified"])

# ─────────────────────────────────────────────────────────────────
# CATEGORY 12 — EMBEDDED & IoT (6 roles)
# ─────────────────────────────────────────────────────────────────
_role("IoT Engineer",
      "Embedded & IoT",
      ["Python", "Embedded Systems", "MQTT", "Linux", "Networking"],
      ["C", "C++", "JavaScript", "Docker", "AWS IoT"],
      ["IoT", "Internet of Things", "embedded", "sensors", "MQTT", "edge computing", "data acquisition", "protocol"],
      ["Arduino IDE", "Raspberry Pi", "AWS IoT Core", "Node-RED", "Linux"],
      ["MQTT", "AWS IoT", "Azure IoT Hub", "Node-RED", "PlatformIO"],
      ["AWS IoT Specialty", "Certified IoT Professional", "AWS Certified Developer"])

_role("Embedded AI Engineer",
      "Embedded & IoT",
      ["C++", "Python", "Machine Learning", "Embedded Systems", "Linux"],
      ["TensorFlow Lite", "Rust", "ARM", "RTOS", "CUDA"],
      ["embedded AI", "edge AI", "TinyML", "model optimization", "quantization", "inference on edge", "neural network deployment"],
      ["STM32CubeIDE", "Arduino", "TensorFlow Lite", "OpenOCD", "Git"],
      ["TensorFlow Lite", "Edge Impulse", "OpenVINO", "ONNX Runtime", "PyTorch Mobile"],
      ["NVIDIA Jetson Certified", "AWS IoT Specialty", "TensorFlow Developer Certificate"])

_role("Embedded Linux Engineer",
      "Embedded & IoT",
      ["C", "C++", "Linux", "Yocto", "Shell Scripting"],
      ["Python", "Git", "Networking", "Device Drivers", "Buildroot"],
      ["embedded Linux", "BSP", "Yocto", "device drivers", "bootloader", "cross-compilation", "kernel configuration", "real-time Linux"],
      ["Yocto Project", "Buildroot", "Git", "Linux Kernel", "QEMU"],
      ["Yocto", "Buildroot", "CMake", "Meson", "Ninja"],
      ["Linux Foundation Certified", "ARM Accredited Engineer", "Certified Embedded Systems Professional"])

_role("Embedded Firmware Engineer",
      "Embedded & IoT",
      ["C", "C++", "Assembly", "Embedded Systems", "Git", "RTOS"],
      ["Python", "Rust", "ARM", "Linux", "Device Drivers"],
      ["embedded firmware", "firmware development", "device drivers", "bootloader", "RTOS", "hardware-software interface", "low-level programming", "flash memory"],
      ["JTAG Debugger", "Logic Analyzer", "Keil", "IAR", "Git"],
      ["FreeRTOS", "Mbed OS", "Zephyr", "UEFI", "U-Boot"],
      ["ARM Accredited Engineer", "Embedded Systems Certification", "Linux Foundation Certified"])

_role("Edge Computing Engineer",
      "Embedded & IoT",
      ["Python", "Docker", "Kubernetes", "Linux", "Networking"],
      ["C++", "Rust", "K3s", "Terraform", "MQTT"],
      ["edge computing", "edge deployment", "edge orchestration", "latency optimization", "offline-first", "edge AI", "fog computing", "distributed computing"],
      ["Docker", "K3s", "Kubernetes", "AWS Greengrass", "Azure IoT Edge"],
      ["K3s", "AWS Greengrass", "Azure IoT Edge", "KubeEdge", "Docker"],
      ["AWS IoT Specialty", "Certified Kubernetes Administrator", "Azure IoT Developer Specialty"])

_role("Hardware Test Engineer",
      "Embedded & IoT",
      ["Test Engineering", "C", "Python", "Lab Instruments", "Linux"],
      ["JTAG", "Oscilloscope", "Signal Analyzer", "Automation", "Git"],
      ["hardware testing", "PCB testing", "signal analysis", "test automation", "EMC testing", "environmental testing", "quality assurance"],
      ["Oscilloscope", "Multimeter", "Logic Analyzer", "Spectrum Analyzer", "Python"],
      ["LabVIEW", "Python", "JIRA", "Git", "MATLAB"],
      ["ISTQB Certified Tester", "Certified Hardware Test Engineer", "CompTIA A+"])

# ─────────────────────────────────────────────────────────────────
# CATEGORY 13 — ILLUSTRATIVE SPECIALIZED (remaining to hit 150+)
# ─────────────────────────────────────────────────────────────────
_role("Solutions Architect",
      "Architecture",
      ["Cloud Architecture", "Microservices", "AWS", "Docker", "System Design"],
      ["Terraform", "Kubernetes", "Python", "Java", "Azure"],
      ["solutions architecture", "system design", "scalability", "high availability", "cloud migration", "cost optimization", "technical strategy"],
      ["AWS Console", "Azure Portal", "Docker", "Miro", "Draw.io"],
      ["CloudFormation", "Terraform", "Kubernetes", "Serverless Framework"],
      ["AWS Solutions Architect Professional", "Azure Solutions Architect", "Google Cloud Professional"])

_role("Enterprise Architect",
      "Architecture",
      ["Enterprise Architecture", "TOGAF", "Cloud Computing", "Microservices", "Integration"],
      ["Docker", "Kubernetes", "API", "Security", "Agile"],
      ["enterprise architecture", "TOGAF", "technology strategy", "governance", "integration patterns", "reference architecture", "roadmapping", "standards"],
      ["Enterprise Architect Tool", "ArchiMate", "Visio", "Miro", "JIRA"],
      ["TOGAF", "ArchiMate", "Zachman", "DoDAF", "UML"],
      ["TOGAF Certified", "AWS Solutions Architect", "Certified Enterprise Architect"])

_role("Integration Engineer",
      "Architecture",
      ["API", "REST", "SOAP", "XML", "SQL"],
      ["MuleSoft", "Docker", "Python", "Java", "Kafka"],
      ["integration", "middleware", "API gateway", "ESB", "message queues", "data transformation", "ETL", "webhook orchestration"],
      ["Postman", "SoapUI", "MuleSoft Anypoint", "Docker", "Git"],
      ["MuleSoft", "Apache Camel", "Kafka", "RabbitMQ", "Dell Boomi"],
      ["MuleSoft Certified Developer", "AWS Certified Developer", "Dell Boomi Certified"])

_role("Technical Lead",
      "Software Engineering",
      ["Java", "Python", "System Design", "Git", "Leadership"],
      ["Docker", "Kubernetes", "AWS", "Agile", "Architecture"],
      ["technical leadership", "code review", "architecture decisions", "mentoring", "sprint planning", "technical debt management", "design reviews"],
      ["IntelliJ IDEA", "VS Code", "Git", "JIRA", "Confluence"],
      ["Spring Boot", "Django", "Express.js", "Kubernetes", "AWS"],
      ["AWS Solutions Architect", "Google Cloud Professional", "Certified Kubernetes Administrator"])

_role("Data Governance Analyst",
      "Data Science & Analytics",
      ["Data Governance", "SQL", "Data Quality", "Excel", "Compliance"],
      ["Python", "Collibra", "Informatica", "Tableau", "Data Modeling"],
      ["data governance", "data quality", "data catalog", "data lineage", "master data management", "compliance", "data standards", "metadata management"],
      ["Collibra", "Informatica", "Alation", "SQL", "Excel"],
      ["Collibra", "Informatica", "Alation", "Apache Atlas", "DataHub"],
      ["CDMP", "DAMA-DMBOK", "Google Data Analytics"])

_role("Solutions Engineer",
      "Architecture",
      ["Technical Sales", "Pre-sales", "Solution Design", "Demo", "Communication"],
      ["Cloud Computing", "API", "Architecture", "SQL", "Python"],
      ["solutions engineering", "pre-sales", "technical demonstrations", "proof of concept", "RFP response", "customer engagement", "technical consulting"],
      ["PowerPoint", "Visio", "Demo Environments", "AWS Console", "GitHub"],
      ["AWS Solutions Architect", "Salesforce", "Postman", "Docker"],
      ["AWS Solutions Architect", "Google Cloud Professional", "Azure Solutions Architect"])

_role("Platform Architect",
      "Architecture",
      ["Kubernetes", "Microservices", "Cloud Computing", "System Design", "Docker"],
      ["Go", "Python", "Terraform", "Monitoring", "Security"],
      ["platform architecture", "developer platform", "infrastructure design", "service mesh", "API gateway", "observability", "scalability", "resilience"],
      ["Kubernetes", "Terraform", "Prometheus", "Grafana", "Istio"],
      ["Kubernetes", "Istio", "Terraform", "ArgoCD", "Backstage"],
      ["Certified Kubernetes Administrator", "AWS Solutions Architect", "HashiCorp Terraform Associate"])

_role("Site Architect",
      "Architecture",
      ["Web Architecture", "Cloud Computing", "Performance", "Security", "Scalability"],
      ["AWS", "Docker", "Kubernetes", "CDN", "Caching"],
      ["site architecture", "performance optimization", "caching", "CDN", "high availability", "scalability", "load balancing", "SEO architecture"],
      ["AWS Console", "Cloudflare", "Nginx", "Redis", "Docker"],
      ["AWS", "Cloudflare", "Nginx", "Varnish", "Redis"],
      ["AWS Solutions Architect", "Google Cloud Professional", "HashiCorp Terraform Associate"])

_role("IT Consultant",
      "Architecture",
      ["IT Strategy", "Cloud Computing", "Project Management", "Business Analysis", "Agile"],
      ["AWS", "Azure", "Docker", "JIRA", "SQL"],
      ["IT consulting", "technology assessment", "digital transformation", "IT strategy", "vendor selection", "implementation planning", "change management"],
      ["JIRA", "Confluence", "PowerPoint", "Visio", "Excel"],
      ["AWS Solutions Architect", "Azure Administrator", "Google Cloud Professional"],
      ["PMP", "TOGAF", "ITIL Foundation", "AWS Cloud Practitioner"])

# ─────────────────────────────────────────────────────────────────
# CATEGORY 14 — DATABASE SPECIALIZED
# ─────────────────────────────────────────────────────────────────
_role("PostgreSQL Developer",
      "Data Science & Analytics",
      ["PostgreSQL", "SQL", "Python", "Database Design", "Performance Tuning"],
      ["Docker", "Linux", "Shell Scripting", "Git", "REST API"],
      ["PostgreSQL", "database development", "PL/pgSQL", "query optimization", "indexing", "partitioning", "replication", "extensions"],
      ["pgAdmin", "PostgreSQL CLI", "DBeaver", "pg_dump", "Git"],
      ["PostgreSQL", "PostGIS", "TimescaleDB", "Citus", "Python"],
      ["PostgreSQL Certified Professional", "AWS Certified Database Specialty", "Google Cloud Professional"])

_role("MongoDB Developer",
      "Data Science & Analytics",
      ["MongoDB", "JavaScript", "Node.js", "JSON", "REST API"],
      ["Python", "Docker", "TypeScript", "GraphQL", "Redis"],
      ["MongoDB", "NoSQL", "document database", "schema design", "aggregation pipeline", "sharding", "replication", "change streams"],
      ["MongoDB Compass", "MongoDB Atlas", "VS Code", "Git", "Postman"],
      ["MongoDB Atlas", "Mongoose", "MongoDB Realm", "Express.js", "Next.js"],
      ["MongoDB Certified Developer", "AWS Certified Developer", "Google Cloud Professional"])

# ─────────────────────────────────────────────────────────────────
# CATEGORY 15 — IT OPERATIONS
# ─────────────────────────────────────────────────────────────────
_role("IT Operations Manager",
      "IT Operations",
      ["IT Operations", "ITIL", "Incident Management", "Problem Management", "Service Management"],
      ["Monitoring", "Cloud Computing", "JIRA", "Excel", "Vendor Management"],
      ["IT operations", "incident management", "problem management", "change management", "service level management", "ITIL", "capacity planning", "vendor management"],
      ["ServiceNow", "JIRA", "SCCM", "Nagios", "Power BI"],
      ["ServiceNow", "JIRA", "SCCM", "Nagios", "Zendesk"],
      ["ITIL Foundation", "PMP", "Certified Information Systems Manager", "AWS Cloud Practitioner"])

_role("IT Service Desk Analyst",
      "IT Operations",
      ["ITIL", "Windows", "Active Directory", "Troubleshooting", "Communication"],
      ["ServiceNow", "JIRA", "Networking", "Linux", "Remote Support"],
      ["IT service desk", "help desk", "ticket management", "user support", "knowledge management", "SLA management", "remote troubleshooting"],
      ["ServiceNow", "JIRA", "SCCM", "TeamViewer", "Active Directory"],
      ["ServiceNow", "JIRA", "Zendesk", "Freshdesk", "SCCM"],
      ["ITIL Foundation", "CompTIA A+", "HDI Support Center Analyst"])

# ─────────────────────────────────────────────────────────────────
# ADDITIONAL ROLES (push total beyond 150)
# ─────────────────────────────────────────────────────────────────
_role("Staff Engineer",
      "Software Engineering",
      ["Python", "Java", "System Design", "Architecture", "SQL", "Git", "Microservices"],
      ["Go", "Rust", "Kubernetes", "Terraform", "C++"],
      ["staff engineer", "system design", "architecture", "mentoring", "technical leadership", "cross-team", "scalability", "code review"],
      ["AWS", "Kubernetes", "Terraform", "Jenkins", "GitHub Actions", "Datadog"],
      ["Spring Boot", "FastAPI", "React", "Next.js", "Django"],
      ["AWS Solutions Architect Professional", "Google Cloud Professional Architect", "Azure Solutions Architect"])

_role("Data Platform Engineer",
      "Cloud & DevOps",
      ["Python", "SQL", "Airflow", "dbt", "Spark", "Kafka", "Cloud Data Warehouses"],
      ["Java", "Scala", "Terraform", "Kubernetes", "Delta Lake"],
      ["data platform", "data engineering", "ETL", "ELT", "data pipelines", "data mesh", "lakehouse", "data governance", "real-time analytics"],
      ["Apache Airflow", "dbt", "Snowflake", "BigQuery", "Redshift", "Kafka", "Spark"],
      ["Airflow", "dbt", "Spark Structured Streaming", "Delta Lake", "Iceberg"],
      ["Snowflake SnowPro Core", "Databricks Certified Data Engineer", "Google Cloud Professional Data Engineer"])

_role("AI Safety Researcher",
      "Artificial Intelligence",
      ["Python", "Machine Learning", "AI Alignment", "Red Teaming", "Research Methods", "LLM Evaluation"],
      ["PyTorch", "JAX", "Hugging Face", "Weights & Biases", "Kubernetes"],
      ["AI safety", "alignment", "robustness", "interpretability", "adversarial attacks", "AI governance", "responsible AI", "model evaluation"],
      ["PyTorch", "JAX", "Hugging Face Transformers", "Weights & Biases", "LangChain"],
      ["PyTorch", "JAX", "Lit-GPT", "OpenAI Evals", "EleutherAI LM Eval"],
      ["AI Safety Fundamentals", "CHAI Research Fellowship", "MIT AI Safety"])

_role("Digital Forensics Analyst",
      "Cybersecurity",
      ["Digital Forensics", "Incident Response", "Windows Internals", "Linux Forensics", "Memory Analysis", "EnCase", "FTK"],
      ["Python", "Volatility", "YARA", "Autopsy", "Network Forensics"],
      ["digital forensics", "incident response", "memory forensics", "disk forensics", "malware forensics", "evidence acquisition", "chain of custody", "timeline analysis"],
      ["EnCase", "FTK", "Volatility", "Autopsy", "Cellebrite", "X-Ways"],
      ["Volatility", "Rekall", "Plaso", "Sleuth Kit", "Autopsy"],
      ["GCFA", "GCFE", "GASF", "CCFP", "EnCE"])

_role("Growth Product Manager",
      "Product & Management",
      ["Product Strategy", "A/B Testing", "SQL", "Analytics", "User Research", "Agile"],
      ["Python", "R", "Mixpanel", "Amplitude", "Figma"],
      ["growth", "product-led growth", "metrics", "conversion", "retention", "A/B testing", "user acquisition", "funnel optimization", "north star metric"],
      ["Amplitude", "Mixpanel", "Google Analytics", "Optimizely", "Notion"],
      ["Amplitude", "Mixpanel", "Hotjar", "Segment", "LaunchDarkly"],
      ["Pragmatic Institute", "Product School Product Manager", "Google Analytics IQ"])

_role("Salesforce Lightning Developer",
      "Enterprise Solutions",
      ["Salesforce", "Apex", "Lightning Web Components", "SOQL", "JavaScript", "HTML", "CSS"],
      ["Visualforce", "Aura", "Java", "REST API", "Angular"],
      ["Salesforce", "Lightning", "Apex", "LWC", "Salesforce integration", "CRM", "custom objects", "triggers", "Salesforce ecosystem"],
      ["Salesforce", "VS Code", "Workbench", "Postman", "Jenkins", "Copado"],
      ["Lightning Web Components", "Aura", "Salesforce DX", "Apex", "Visualforce"],
      ["Salesforce Certified Platform Developer I", "Salesforce Certified Platform Developer II", "Salesforce Administrator"])

_role("Developer Experience Engineer",
      "Web Development",
      ["Developer Tools", "API Design", "Documentation", "TypeScript", "Open Source", "Community"],
      ["React", "Node.js", "GraphQL", "CLI Design", "Marketing"],
      ["developer experience", "DX", "API design", "SDK", "documentation", "onboarding", "developer productivity", "tooling", "feedback loops"],
      ["VS Code", "GitHub", "Storybook", "Docusaurus", "Postman", "Figma"],
      ["React", "Next.js", "Astro", "Vite", "TypeScript", "Turborepo"],
      ["GitHub Actions Certification", "Vercel Certified", "Netlify Certified"])

_role("Game Engine Programmer",
      "Software Engineering",
      ["C++", "Game Engines", "3D Math", "Physics", "Graphics Programming", "GPU Programming"],
      ["C#", "Rust", "HLSL", "GLSL", "Vulkan", "DirectX"],
      ["game engine", "rendering engine", "physics engine", "graphics programming", "shader programming", "real-time rendering", "GPU optimization", "multiplayer networking"],
      ["Unreal Engine", "Unity", "Visual Studio", "RenderDoc", "PIX", "NSight"],
      ["Unreal Engine", "Unity", "Godot", "Custom Engine", "bgfx", "Diligent Engine"],
      ["Unity Certified Developer", "Unreal Engine Certified Developer", "NVIDIA CUDA Certification"])

# ─────────────────────────────────────────────────────────────────
# Build and write
# ─────────────────────────────────────────────────────────────────
def main():
    # Convert list to dict keyed by role name (matching existing format)
    roles_dict = {role["name"]: role for role in ROLES}

    out_path = Path(__file__).parent.parent / "data" / "roles.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(roles_dict, f, indent=2, ensure_ascii=False)

    print(f"Generated {len(ROLES)} roles -> {out_path}")

    # Print category breakdown
    categories = {}
    for role in ROLES:
        cat = role["category"]
        categories[cat] = categories.get(cat, 0) + 1
    print("\nCategory breakdown:")
    for cat, count in sorted(categories.items(), key=lambda x: -x[1]):
        print(f"  {cat}: {count}")
    print(f"\nTotal: {len(ROLES)} roles")


if __name__ == "__main__":
    main()

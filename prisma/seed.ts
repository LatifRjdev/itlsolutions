import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@itlsolutions.net";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (adminPassword === "admin123") {
    console.warn("⚠️  WARNING: Using default admin password. Set ADMIN_PASSWORD env variable for production!");
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Admin",
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("Admin user created:", admin.email);

  // Seed services (from original static data)
  const services = [
    {
      slug: "web-development",
      title: "Web Development",
      description: "Scalable, high-performance web applications built with modern frameworks like React and Next.js.",
      icon: "Globe",
      features: ["Custom Web Applications", "E-commerce Solutions", "Progressive Web Apps", "API Development"],
      order: 1,
    },
    {
      slug: "mobile-apps",
      title: "Mobile Apps",
      description: "Native and cross-platform mobile solutions for iOS and Android that engage users on the go.",
      icon: "Smartphone",
      features: ["iOS Development", "Android Development", "React Native", "Flutter Apps"],
      order: 2,
    },
    {
      slug: "ui-ux-design",
      title: "UI/UX Design",
      description: "User-centric interfaces and experiences that drive engagement and simplify complexity.",
      icon: "Palette",
      features: ["User Research", "Wireframing", "Prototyping", "Design Systems"],
      order: 3,
    },
    {
      slug: "cloud-solutions",
      title: "Cloud Solutions",
      description: "Secure migration, management, and optimization of cloud infrastructure on AWS and Azure.",
      icon: "Cloud",
      features: ["Cloud Migration", "DevOps & CI/CD", "Serverless Architecture", "Cost Optimization"],
      order: 4,
    },
    {
      slug: "cybersecurity",
      title: "Cyber Security",
      description: "Proactive threat monitoring, vulnerability assessments, and enterprise-grade protection.",
      icon: "Shield",
      features: ["Security Audits", "Penetration Testing", "Compliance", "Incident Response"],
      order: 5,
    },
    {
      slug: "it-consulting",
      title: "IT Consulting",
      description: "Strategic technology roadmapping to align your IT investment with business goals.",
      icon: "Lightbulb",
      features: ["Digital Strategy", "Technology Assessment", "Process Optimization", "Training & Support"],
      order: 6,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }
  console.log("Services seeded:", services.length);

  // Seed team members (from original static data)
  const teamMembers = [
    {
      slug: "sarah-chen",
      name: "Sarah Chen",
      role: "CEO & Founder",
      department: "Management",
      bio: "Visionary leader with 20+ years in tech industry. Former VP at Google.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      linkedin: "https://linkedin.com",
      order: 1,
    },
    {
      slug: "michael-torres",
      name: "Michael Torres",
      role: "CTO",
      department: "Management",
      bio: "Architecture expert specializing in scalable cloud solutions.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      order: 2,
    },
    {
      slug: "emily-watson",
      name: "Emily Watson",
      role: "Lead Developer",
      department: "Developers",
      bio: "Full-stack developer with expertise in React and Node.js ecosystems.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      order: 3,
    },
    {
      slug: "david-kim",
      name: "David Kim",
      role: "Senior Developer",
      department: "Developers",
      bio: "Backend specialist focused on microservices and distributed systems.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      order: 4,
    },
    {
      slug: "lisa-zhang",
      name: "Lisa Zhang",
      role: "UI/UX Designer",
      department: "Designers",
      bio: "Creative designer passionate about user-centered design principles.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      linkedin: "https://linkedin.com",
      order: 5,
    },
    {
      slug: "alex-johnson",
      name: "Alex Johnson",
      role: "DevOps Engineer",
      department: "Developers",
      bio: "Infrastructure expert with deep knowledge of AWS and Kubernetes.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      order: 6,
    },
    {
      slug: "maria-garcia",
      name: "Maria Garcia",
      role: "Project Manager",
      department: "Management",
      bio: "PMP certified with experience managing enterprise-scale projects.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
      linkedin: "https://linkedin.com",
      order: 7,
    },
    {
      slug: "james-wilson",
      name: "James Wilson",
      role: "Security Analyst",
      department: "Developers",
      bio: "Cybersecurity expert specializing in penetration testing and audits.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      order: 8,
    },
  ];

  for (const member of teamMembers) {
    await prisma.teamMember.upsert({
      where: { slug: member.slug },
      update: member,
      create: member,
    });
  }
  console.log("Team members seeded:", teamMembers.length);

  // Seed projects (from original static data)
  const projects = [
    {
      slug: "apex-bank",
      title: "Apex Bank Digital Transformation",
      category: "Fintech",
      description: "Complete digital banking platform with mobile apps and web portal.",
      content: "We partnered with Apex Bank to modernize their entire digital infrastructure, including a new mobile banking app, online platform, and backend systems. The solution included real-time transaction processing, biometric authentication, and AI-powered fraud detection.",
      image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Node.js", "AWS", "PostgreSQL"],
      featured: true,
    },
    {
      slug: "healthplus",
      title: "HealthPlus Telemedicine Platform",
      category: "Healthcare",
      description: "HIPAA-compliant telemedicine solution connecting patients with doctors.",
      content: "Developed a comprehensive telemedicine platform enabling secure video consultations, appointment scheduling, prescription management, and medical record access. The platform serves over 100,000 patients and 500 healthcare providers.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
      technologies: ["React Native", "Python", "Azure", "MongoDB"],
      featured: true,
    },
    {
      slug: "ecomart",
      title: "EcoMart E-commerce Platform",
      category: "E-commerce",
      description: "Sustainable marketplace with advanced inventory management.",
      content: "Built a scalable e-commerce platform focused on sustainable products, handling thousands of transactions daily. Features include AI-powered product recommendations, real-time inventory tracking, and carbon footprint calculator.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
      technologies: ["Next.js", "Stripe", "Shopify", "Tailwind"],
      featured: true,
    },
    {
      slug: "smartcity",
      title: "SmartCity IoT Dashboard",
      category: "IoT",
      description: "Real-time monitoring and analytics for smart city infrastructure.",
      content: "Real-time monitoring dashboard for city infrastructure including traffic sensors, utility meters, and environmental monitoring stations. The platform processes millions of data points daily and provides predictive analytics for city planning.",
      image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=800&q=80",
      technologies: ["Vue.js", "Go", "InfluxDB", "Grafana"],
      featured: false,
    },
    {
      slug: "edulearn",
      title: "EduLearn LMS",
      category: "EdTech",
      description: "Comprehensive learning management system with video streaming.",
      content: "Comprehensive LMS supporting video courses, live classes, assessments, certificates, and multi-tenant architecture. The platform is used by 100+ educational institutions with over 50,000 active students.",
      image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Django", "Redis", "WebRTC"],
      featured: false,
    },
    {
      slug: "logistrack",
      title: "LogisTrack Fleet Management",
      category: "Logistics",
      description: "GPS tracking and route optimization for logistics companies.",
      content: "IoT-powered fleet management solution providing real-time GPS tracking, route optimization, fuel monitoring, and predictive maintenance alerts. Reduced fleet operating costs by 25% for our clients.",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
      technologies: ["Flutter", "Node.js", "Google Maps", "Firebase"],
      featured: false,
    },
    {
      slug: "protocol-vazif",
      title: "Protocol Task Management System",
      category: "SaaS",
      description: "Cloud-based task management platform for teams with multi-channel notifications.",
      content: "Enterprise task management system with workspaces, projects, and role-based access control. Features include real-time collaboration, @mentions, multi-channel notifications (Email, SMS, In-App), and activity audit logs. Deployed in production serving organizations in Tajikistan.",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Node.js", "MongoDB", "Redis"],
      featured: true,
    },
    // GovTech Projects
    {
      slug: "electronic-queue",
      title: "Electronic Queue System",
      category: "GovTech",
      description: "Unified appointment system for government institutions with mobile app.",
      content: "Electronic queue management system for tax offices, registry offices, and passport services. Includes mobile app for citizens and web panel for administrators. Features SMS notifications, real-time queue status, and analytics dashboard.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Node.js", "PostgreSQL", "Redis"],
      featured: true,
    },
    {
      slug: "edocument-flow",
      title: "Electronic Document Management",
      category: "GovTech",
      description: "Document approval and digital signature system for government agencies.",
      content: "Comprehensive document management system with digital signatures (EDS), workflow routing between departments, deadline control, and notifications. Supports all document types with full audit trail.",
      image: "https://images.unsplash.com/photo-1568702846914-96b305d2uj86?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Java", "PostgreSQL", "Elasticsearch"],
      featured: false,
    },
    {
      slug: "citizens-portal",
      title: "Citizens Appeals Portal",
      category: "GovTech",
      description: "Platform for submitting complaints and suggestions to local authorities.",
      content: "Online portal for citizens to submit appeals, complaints, and suggestions to local government. Features automatic routing to relevant departments, status tracking, and response management.",
      image: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=800&q=80",
      technologies: ["Next.js", "Node.js", "MongoDB", "SendGrid"],
      featured: false,
    },
    {
      slug: "licenses-registry",
      title: "Licenses and Permits Registry",
      category: "GovTech",
      description: "Unified database of issued licenses with verification API.",
      content: "Central registry of all issued licenses and permits with public API for authenticity verification. Mobile app for inspectors enables on-site license validation.",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Go", "PostgreSQL", "Redis"],
      featured: false,
    },
    {
      slug: "utility-services",
      title: "Utility Services Management",
      category: "GovTech",
      description: "Meter readings submission and billing integration system.",
      content: "Comprehensive utility management system for submitting meter readings, generating bills, and payment processing. Integrates with major payment systems and banks.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
      technologies: ["Vue.js", "Python", "PostgreSQL", "Stripe"],
      featured: false,
    },
    {
      slug: "e-procurement",
      title: "E-Procurement Platform",
      category: "GovTech",
      description: "Electronic tenders and procurement system for government.",
      content: "Full-featured procurement platform for publishing tenders, receiving bids, automatic evaluation, and protocol generation. Integrates with supplier registry for vendor verification.",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Node.js", "PostgreSQL", "MinIO"],
      featured: true,
    },
    {
      slug: "cadastral-registry",
      title: "Cadastral Land Registry",
      category: "GovTech",
      description: "Land plots mapping with ownership history and GIS integration.",
      content: "Digital cadastral system with interactive map of land plots, ownership history, online extracts generation, and full GIS integration for spatial analysis.",
      image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Python", "PostGIS", "Mapbox"],
      featured: false,
    },
    {
      slug: "gov-services-portal",
      title: "Government Services Portal",
      category: "GovTech",
      description: "Unified portal for all government services and applications.",
      content: "Single window for all government services - application submission, status tracking, state duty payments, and digital notifications. Supports multiple authentication methods including national ID.",
      image: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=800&q=80",
      technologies: ["Next.js", "Java", "PostgreSQL", "Keycloak"],
      featured: true,
    },
    {
      slug: "municipal-property",
      title: "Municipal Property Management",
      category: "GovTech",
      description: "Registry of municipal buildings and lease management system.",
      content: "Comprehensive system for managing municipal real estate - building registry, lease agreements, usage control, and financial reporting for government property.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "C#", "SQL Server", "Power BI"],
      featured: false,
    },
    {
      slug: "electronic-archive",
      title: "Electronic Document Archive",
      category: "GovTech",
      description: "Document digitization with OCR and long-term storage.",
      content: "Enterprise document archive with digitization workflows, OCR recognition, full-text search, access control, and compliant long-term storage for government records.",
      image: "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Python", "Elasticsearch", "MinIO"],
      featured: false,
    },
    {
      slug: "housing-monitoring",
      title: "Housing Services Monitoring",
      category: "GovTech",
      description: "Incident tracking and crew dispatch for housing services.",
      content: "Monitoring system for housing and communal services - incident registration, crew dispatching, resolution time control, and analytics by district.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
      technologies: ["Vue.js", "Node.js", "PostgreSQL", "Grafana"],
      featured: false,
    },
    {
      slug: "tasks-control",
      title: "Government Tasks Control",
      category: "GovTech",
      description: "Inter-agency task assignment and deadline monitoring.",
      content: "Platform for assigning and tracking tasks between government agencies with deadline control, escalation procedures, and executive dashboards for leadership oversight.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Go", "PostgreSQL", "RabbitMQ"],
      featured: false,
    },
    {
      slug: "subsidies-system",
      title: "Subsidies Management System",
      category: "GovTech",
      description: "Social benefits eligibility verification and payment processing.",
      content: "System for managing social subsidies - recipient registry, eligibility verification, integration with banks for payments, and comprehensive reporting.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Java", "PostgreSQL", "Apache Kafka"],
      featured: false,
    },
    {
      slug: "public-hearings",
      title: "Public Hearings Platform",
      category: "GovTech",
      description: "Platform for public consultations and citizen voting.",
      content: "Digital platform for publishing draft projects, collecting citizen feedback, conducting votes, and generating protocols for public hearings.",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
      technologies: ["Next.js", "Node.js", "PostgreSQL", "WebSocket"],
      featured: false,
    },
    {
      slug: "school-queue",
      title: "School Enrollment System",
      category: "GovTech",
      description: "Electronic registration for kindergartens and schools.",
      content: "Queue management system for kindergarten and school enrollment - online registration, place distribution algorithm, and parent notifications throughout the process.",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Node.js", "PostgreSQL", "Twilio"],
      featured: false,
    },
    // Logistics Projects
    {
      slug: "cargo-aggregator",
      title: "Freight Aggregator Platform",
      category: "Logistics",
      description: "Marketplace connecting shippers with carriers.",
      content: "B2B marketplace connecting cargo owners with transport companies. Features tender system, real-time cargo tracking, and automated documentation.",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Node.js", "MongoDB", "Google Maps"],
      featured: false,
    },
    {
      slug: "taxi-fleet",
      title: "Taxi Fleet Management",
      category: "Logistics",
      description: "Order distribution and driver shift management for taxi services.",
      content: "Fleet management system for taxi companies - order distribution, driver shift tracking, efficiency analytics, and Wialon GPS integration.",
      image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80",
      technologies: ["React Native", "Node.js", "PostgreSQL", "Wialon API"],
      featured: false,
    },
    {
      slug: "warehouse-wms",
      title: "Warehouse Management System",
      category: "Logistics",
      description: "Full WMS with mobile barcode scanning and inventory control.",
      content: "Comprehensive warehouse management - receiving, put-away, order picking, inventory counting via mobile app with barcode scanner integration.",
      image: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80",
      technologies: ["React Native", "Node.js", "PostgreSQL", "Redis"],
      featured: true,
    },
    // Healthcare Projects
    {
      slug: "electronic-health-record",
      title: "Electronic Health Record",
      category: "Healthcare",
      description: "Patient medical history with mobile access.",
      content: "Digital medical records system - disease history, prescriptions, test results with secure patient access via mobile app.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
      technologies: ["React Native", "Node.js", "PostgreSQL", "FHIR"],
      featured: false,
    },
    {
      slug: "telemedicine-platform",
      title: "Telemedicine Platform",
      category: "Healthcare",
      description: "Video consultations with doctors and electronic prescriptions.",
      content: "Telemedicine solution with video consultations, appointment scheduling, electronic prescriptions, and integration with pharmacy networks.",
      image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "WebRTC", "Node.js", "PostgreSQL"],
      featured: false,
    },
    {
      slug: "pharmacy-inventory",
      title: "Pharmacy Network Inventory",
      category: "Healthcare",
      description: "Medication tracking with expiry alerts and auto-ordering.",
      content: "Inventory management for pharmacy chains - expiry date tracking, automatic reorder at minimum stock levels, and sales analytics.",
      image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=800&q=80",
      technologies: ["Vue.js", "Python", "PostgreSQL", "Celery"],
      featured: false,
    },
    // Education Projects
    {
      slug: "school-lms",
      title: "School Management System",
      category: "EdTech",
      description: "LMS for schools with gradebook and parent communication.",
      content: "Learning management system for K-12 - class schedules, grade journal, homework assignments, parent-teacher chat, and push notifications.",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
      technologies: ["React Native", "Node.js", "PostgreSQL", "Firebase"],
      featured: false,
    },
    {
      slug: "online-courses",
      title: "Online Learning Platform",
      category: "EdTech",
      description: "Video courses platform with subscription model.",
      content: "Online course platform with video lessons, quizzes, certificates, and subscription model for course authors to monetize content.",
      image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80",
      technologies: ["Next.js", "Node.js", "PostgreSQL", "Stripe"],
      featured: false,
    },
    // Finance Projects
    {
      slug: "smb-crm",
      title: "CRM for Small Business",
      category: "Fintech",
      description: "Sales pipeline with messenger integrations.",
      content: "CRM system for SMBs - sales funnel, task management, Telegram and WhatsApp integration, and manager performance analytics.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Node.js", "MongoDB", "Telegram API"],
      featured: false,
    },
    {
      slug: "debt-management",
      title: "Receivables Management",
      category: "Fintech",
      description: "Automated debt collection with payment reminders.",
      content: "Accounts receivable management - automatic payment reminders, overdue escalation, and reports for accounting department.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Python", "PostgreSQL", "Celery"],
      featured: false,
    },
    {
      slug: "microfinance",
      title: "Microfinance Platform",
      category: "Fintech",
      description: "Loan application processing with credit scoring.",
      content: "Microfinance platform - loan applications, credit scoring, electronic contracts, and payment system integration.",
      image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Python", "PostgreSQL", "ML Kit"],
      featured: false,
    },
    // Agriculture
    {
      slug: "agro-platform",
      title: "Agricultural Platform",
      category: "Agriculture",
      description: "Farm management with weather monitoring and marketplace.",
      content: "Platform for farmers - crop planning, work scheduling, weather monitoring, and marketplace for selling harvest directly to buyers.",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
      technologies: ["React Native", "Node.js", "PostgreSQL", "Weather API"],
      featured: false,
    },
    // Real Estate
    {
      slug: "developer-crm",
      title: "Real Estate Developer CRM",
      category: "Real Estate",
      description: "Property management with buyer portal and payment tracking.",
      content: "CRM for property developers - unit inventory, apartment booking, payment schedules, and buyer personal cabinet.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
      featured: false,
    },
    {
      slug: "commercial-rental",
      title: "Commercial Property Platform",
      category: "Real Estate",
      description: "Office and retail space rental with online contracts.",
      content: "Platform for commercial real estate rental - property catalog, online lease agreements, tenant payment tracking.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
      technologies: ["Next.js", "Node.js", "PostgreSQL", "DocuSign"],
      featured: false,
    },
    // HoReCa
    {
      slug: "restaurant-pos",
      title: "Restaurant Automation",
      category: "HoReCa",
      description: "POS system with kitchen display and loyalty program.",
      content: "Full restaurant automation - POS terminal, table management, kitchen display system (KDS), loyalty program, and QR menu.",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Node.js", "PostgreSQL", "Thermal Printer"],
      featured: true,
    },
    // Manufacturing
    {
      slug: "mes-system",
      title: "Manufacturing Execution System",
      category: "Manufacturing",
      description: "Production planning with quality control and downtime tracking.",
      content: "MES system - shift planning, output tracking, quality control, equipment downtime monitoring.",
      image: "https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "C#", "SQL Server", "MQTT"],
      featured: false,
    },
    {
      slug: "maintenance-system",
      title: "Equipment Maintenance System",
      category: "Manufacturing",
      description: "Preventive maintenance scheduling and spare parts tracking.",
      content: "Maintenance management system - preventive maintenance scheduling, work orders, spare parts inventory, and service history.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Node.js", "PostgreSQL", "Grafana"],
      featured: false,
    },
    {
      slug: "quality-control",
      title: "Quality Control System",
      category: "Manufacturing",
      description: "Inspection checklists with defect photo documentation.",
      content: "Quality management system - inspection checklists, defect photo capture, rejection statistics, and production line integration.",
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80",
      technologies: ["React Native", "Node.js", "PostgreSQL", "S3"],
      featured: false,
    },
    {
      slug: "safety-system",
      title: "Workplace Safety System",
      category: "Manufacturing",
      description: "Safety training tracking and incident reporting.",
      content: "Occupational health and safety system - training management, PPE inventory, incident registration, and regulatory compliance reporting.",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Node.js", "PostgreSQL", "PDF Kit"],
      featured: false,
    },
    // HR
    {
      slug: "hr-management",
      title: "HR Management System",
      category: "HR Tech",
      description: "Employee records with leave and timesheet management.",
      content: "Human resources system - employee files, orders, vacation and sick leave tracking, timesheets, and 1C integration.",
      image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Node.js", "PostgreSQL", "1C API"],
      featured: false,
    },
    {
      slug: "corporate-portal",
      title: "Corporate Intranet Portal",
      category: "HR Tech",
      description: "Company news, documents, and internal service requests.",
      content: "Corporate portal - company news, document library, IT and facilities service requests, meeting room booking.",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      technologies: ["Next.js", "Node.js", "PostgreSQL", "LDAP"],
      featured: false,
    },
    {
      slug: "performance-review",
      title: "Performance Management",
      category: "HR Tech",
      description: "KPI tracking with 360-degree feedback.",
      content: "Performance management platform - KPI tracking, 360-degree reviews, individual development plans, and goal setting.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Node.js", "PostgreSQL", "Chart.js"],
      featured: false,
    },
    {
      slug: "recruiting-ats",
      title: "Applicant Tracking System",
      category: "HR Tech",
      description: "Candidate pipeline with resume parsing.",
      content: "Recruiting platform - candidate funnel, resume parsing, job board integrations, and hiring analytics.",
      image: "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Python", "PostgreSQL", "NLP"],
      featured: false,
    },
    // Energy
    {
      slug: "askue-system",
      title: "Energy Metering System",
      category: "Energy",
      description: "Automated meter reading with billing and consumer portal.",
      content: "Automated commercial electricity metering - data collection from smart meters, loss calculation, billing, and consumer personal cabinet.",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Go", "TimescaleDB", "MQTT"],
      featured: false,
    },
    {
      slug: "water-monitoring",
      title: "Water Supply Monitoring",
      category: "Energy",
      description: "Pipeline pressure monitoring and leak detection.",
      content: "Water network monitoring - pressure sensors, leak detection, crew dispatching, and emergency notifications.",
      image: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Node.js", "InfluxDB", "Grafana"],
      featured: false,
    },
    {
      slug: "resource-accounting",
      title: "Resource Extraction Tracking",
      category: "Energy",
      description: "Mining volumes with transportation and regulatory reporting.",
      content: "Resource extraction management - extraction volumes, transportation logistics, warehouse accounting, and regulatory compliance reporting.",
      image: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Python", "PostgreSQL", "Power BI"],
      featured: false,
    },
    // Security
    {
      slug: "access-control",
      title: "Access Control System",
      category: "Security",
      description: "Badge and biometric access with visitor logging.",
      content: "Physical access control - badges, biometric readers, visitor log, and video surveillance integration.",
      image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Go", "PostgreSQL", "RTSP"],
      featured: false,
    },
    {
      slug: "video-analytics",
      title: "Video Analytics Platform",
      category: "Security",
      description: "Face recognition and people counting with incident detection.",
      content: "AI-powered video analytics - face recognition, visitor counting, incident detection, and security integration.",
      image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Python", "TensorFlow", "Redis"],
      featured: false,
    },
    {
      slug: "visitor-management",
      title: "Visitor Management System",
      category: "Security",
      description: "Guest registration with QR passes and host notifications.",
      content: "Visitor tracking system - guest registration, QR code passes, host notifications, and visitor analytics.",
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80",
      technologies: ["React Native", "Node.js", "PostgreSQL", "QR Code"],
      featured: false,
    },
    // Retail
    {
      slug: "franchise-management",
      title: "Franchise Management",
      category: "Retail",
      description: "Standards compliance and franchisee reporting.",
      content: "Franchise network management - standards compliance monitoring, franchisee reporting, royalty calculations, and training materials.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
      featured: false,
    },
    {
      slug: "b2b-orders",
      title: "B2B Ordering Platform",
      category: "Retail",
      description: "Wholesale catalog with personalized pricing.",
      content: "B2B ordering system - wholesale product catalog, customer-specific pricing, order history, and ERP integration.",
      image: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80",
      technologies: ["Next.js", "Node.js", "PostgreSQL", "1C API"],
      featured: false,
    },
    {
      slug: "service-center",
      title: "Service Center Management",
      category: "Retail",
      description: "Repair tracking with customer notifications.",
      content: "Service center automation - device intake, diagnostics, repair workflow, customer notifications, and warranty tracking.",
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Node.js", "PostgreSQL", "Twilio"],
      featured: false,
    },
    {
      slug: "booking-platform",
      title: "Service Booking Platform",
      category: "Retail",
      description: "Online appointments for salons, clinics, and auto services.",
      content: "Universal booking platform for service businesses - specialist scheduling, appointment reminders, online payments.",
      image: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=800&q=80",
      technologies: ["React Native", "Node.js", "PostgreSQL", "Stripe"],
      featured: false,
    },
    // Tourism
    {
      slug: "hotel-pms",
      title: "Hotel Property Management",
      category: "Tourism",
      description: "Reservations with OTA integration and reporting.",
      content: "Hotel PMS - room reservations, check-in/check-out, Booking.com and Airbnb integration, and financial reporting.",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Node.js", "PostgreSQL", "Channel Manager"],
      featured: false,
    },
    {
      slug: "tourism-statistics",
      title: "Regional Tourism Analytics",
      category: "Tourism",
      description: "Tourist flow monitoring and hotel occupancy tracking.",
      content: "Tourism statistics platform - visitor counting, hotel occupancy rates, and analytics dashboard for tourism ministry.",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Python", "PostgreSQL", "Power BI"],
      featured: false,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }
  console.log("Projects seeded:", projects.length);

  // Seed blog posts (from original static data)
  const blogPosts = [
    {
      slug: "future-of-cloud-computing",
      title: "The Future of Cloud Computing in 2024",
      excerpt: "Explore the emerging trends in cloud computing, from edge computing to serverless architectures.",
      content: `Cloud computing continues to evolve at a rapid pace. In this article, we explore the key trends shaping the future of cloud technology.

## Edge Computing
Edge computing brings computation closer to data sources, reducing latency and enabling real-time processing. This is crucial for IoT applications and autonomous systems.

## Serverless Architectures
Serverless computing allows developers to focus on code without managing infrastructure. AWS Lambda, Azure Functions, and Google Cloud Functions lead this space.

## Multi-Cloud Strategies
Organizations are increasingly adopting multi-cloud approaches to avoid vendor lock-in and optimize costs. This requires careful planning and robust management tools.

## AI and Machine Learning Integration
Cloud providers are making AI and ML more accessible through pre-built models and AutoML services, democratizing artificial intelligence.`,
      category: "Cloud",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
      readTime: 8,
      published: true,
      publishedAt: new Date("2024-01-15"),
    },
    {
      slug: "ai-in-software-development",
      title: "How AI is Transforming Software Development",
      excerpt: "Discover how artificial intelligence is revolutionizing the way we build and deploy software.",
      content: `Artificial intelligence is changing every aspect of software development, from writing code to testing and deployment.

## Code Generation
AI-powered tools like GitHub Copilot can suggest code completions, write entire functions, and even generate documentation.

## Automated Testing
Machine learning algorithms can identify potential bugs, generate test cases, and predict areas of code most likely to have issues.

## DevOps Optimization
AI helps optimize CI/CD pipelines, predict deployment failures, and automate incident response.

## The Human Element
While AI augments developer capabilities, human creativity and judgment remain essential for building great software.`,
      category: "AI & ML",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
      readTime: 6,
      published: true,
      publishedAt: new Date("2024-01-10"),
    },
    {
      slug: "cybersecurity-best-practices",
      title: "Essential Cybersecurity Best Practices for 2024",
      excerpt: "Protect your business with these proven cybersecurity strategies and tools.",
      content: `With cyber threats becoming more sophisticated, staying protected requires a proactive approach.

## Zero Trust Architecture
Never trust, always verify. Implement strict access controls and continuous verification for all users and devices.

## Employee Training
Human error remains the leading cause of security breaches. Regular training and phishing simulations are essential.

## Incident Response Planning
Have a documented plan for responding to security incidents. Regular drills ensure your team is prepared.

## Regular Security Audits
Conduct penetration testing and vulnerability assessments to identify weaknesses before attackers do.

## Data Encryption
Encrypt sensitive data both at rest and in transit. Use strong encryption standards and manage keys securely.`,
      category: "Security",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
      readTime: 10,
      published: true,
      publishedAt: new Date("2024-01-05"),
    },
    {
      slug: "microservices-architecture",
      title: "Building Scalable Apps with Microservices",
      excerpt: "A comprehensive guide to designing and implementing microservices architecture.",
      content: `Microservices architecture offers flexibility and scalability, but comes with its own challenges.

## When to Use Microservices
Not every application needs microservices. Consider your team size, deployment requirements, and scaling needs.

## Service Boundaries
Define clear boundaries between services based on business domains. Each service should have a single responsibility.

## Communication Patterns
Choose between synchronous (REST, gRPC) and asynchronous (message queues) communication based on your requirements.

## Data Management
Each microservice should own its data. Use events for data synchronization across services.

## Deployment and Monitoring
Containerization with Kubernetes has become the standard. Implement comprehensive monitoring and distributed tracing.`,
      category: "Architecture",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
      readTime: 12,
      published: true,
      publishedAt: new Date("2023-12-28"),
    },
    {
      slug: "react-vs-vue-2024",
      title: "React vs Vue in 2024: Which to Choose?",
      excerpt: "An in-depth comparison of the two popular frontend frameworks for modern web development.",
      content: `Both React and Vue are excellent choices for building modern web applications. Here's how they compare.

## Learning Curve
Vue has a gentler learning curve with its template syntax. React requires understanding JSX and functional programming concepts.

## Ecosystem
React has a larger ecosystem with more libraries and tools. Vue's ecosystem is smaller but more cohesive.

## Performance
Both frameworks offer excellent performance. Vue 3's Composition API and React Hooks provide similar capabilities.

## Community and Jobs
React has more job opportunities, but Vue's community is growing rapidly, especially in Asia and Europe.

## Our Recommendation
Choose React for larger teams and complex applications. Choose Vue for faster development and simpler architecture.`,
      category: "Frontend",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
      readTime: 7,
      published: true,
      publishedAt: new Date("2023-12-20"),
    },
    {
      slug: "devops-automation",
      title: "Automating Your DevOps Pipeline",
      excerpt: "Learn how to streamline your development workflow with CI/CD automation.",
      content: `Automation is the key to efficient software delivery. Here's how to build a robust DevOps pipeline.

## Continuous Integration
Automate builds and tests with every code commit. Use tools like GitHub Actions, GitLab CI, or Jenkins.

## Continuous Deployment
Automate deployments to staging and production environments. Implement feature flags for safe releases.

## Infrastructure as Code
Define your infrastructure using tools like Terraform or Pulumi. Version control your infrastructure alongside your code.

## Monitoring and Observability
Set up automated alerting and dashboards. Use tools like Prometheus, Grafana, and Datadog.

## Security Automation
Integrate security scanning into your pipeline. Use SAST, DAST, and dependency scanning tools.`,
      category: "DevOps",
      image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80",
      readTime: 9,
      published: true,
      publishedAt: new Date("2023-12-15"),
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }
  console.log("Blog posts seeded:", blogPosts.length);

  // Seed FAQ items
  const faqItems = [
    {
      question: "What services does ITL Solutions offer?",
      answer: "We offer a comprehensive range of IT services including: Web Development (React, Next.js, Node.js), Mobile App Development (iOS, Android, React Native), UI/UX Design, Cloud Solutions (AWS, Azure), Cybersecurity services, and IT Consulting. We work with businesses of all sizes, from startups to enterprises.",
      questionRu: "Какие услуги предоставляет ITL Solutions?",
      answerRu: "Мы предлагаем полный спектр IT-услуг, включая: Веб-разработку (React, Next.js, Node.js), Разработку мобильных приложений (iOS, Android, React Native), UI/UX дизайн, Облачные решения (AWS, Azure), Услуги кибербезопасности и IT-консалтинг. Мы работаем с компаниями любого размера, от стартапов до крупных предприятий.",
      category: "Services",
      sortOrder: 0,
      isActive: true,
    },
    {
      question: "How long does a typical project take?",
      answer: "Project timelines vary based on scope and complexity. A simple website typically takes 2-4 weeks, while a custom web application may take 2-4 months. Mobile apps usually require 3-6 months. During our initial consultation, we'll provide a detailed timeline specific to your project requirements.",
      questionRu: "Сколько времени занимает типичный проект?",
      answerRu: "Сроки проекта зависят от объёма и сложности. Простой веб-сайт обычно занимает 2-4 недели, тогда как разработка веб-приложения может занять 2-4 месяца. Мобильные приложения обычно требуют 3-6 месяцев. На первичной консультации мы предоставим детальные сроки для вашего проекта.",
      category: "Process",
      sortOrder: 1,
      isActive: true,
    },
    {
      question: "How much does it cost to develop a website or app?",
      answer: "Project costs depend on features, complexity, and timeline. We offer flexible pricing models including fixed-price projects and hourly rates. Contact us for a free consultation and detailed quote tailored to your specific needs and budget.",
      questionRu: "Сколько стоит разработка сайта или приложения?",
      answerRu: "Стоимость проекта зависит от функционала, сложности и сроков. Мы предлагаем гибкие модели ценообразования, включая фиксированную стоимость и почасовую оплату. Свяжитесь с нами для бесплатной консультации и детального расчёта под ваши потребности и бюджет.",
      category: "Pricing",
      sortOrder: 2,
      isActive: true,
    },
    {
      question: "What technologies do you use?",
      answer: "We use modern, proven technologies: Frontend (React, Next.js, Vue.js, TypeScript), Backend (Node.js, Python, Go, Java), Mobile (React Native, Flutter, Swift, Kotlin), Databases (PostgreSQL, MongoDB, Redis), Cloud (AWS, Azure, Google Cloud), and DevOps tools (Docker, Kubernetes, CI/CD).",
      questionRu: "Какие технологии вы используете?",
      answerRu: "Мы используем современные, проверенные технологии: Frontend (React, Next.js, Vue.js, TypeScript), Backend (Node.js, Python, Go, Java), Мобильные (React Native, Flutter, Swift, Kotlin), Базы данных (PostgreSQL, MongoDB, Redis), Облако (AWS, Azure, Google Cloud) и DevOps инструменты (Docker, Kubernetes, CI/CD).",
      category: "Technical",
      sortOrder: 3,
      isActive: true,
    },
    {
      question: "Do you provide support after project launch?",
      answer: "Yes! We offer ongoing maintenance and support packages including bug fixes, security updates, feature enhancements, performance monitoring, and 24/7 technical support. We also provide training for your team to manage the system independently if needed.",
      questionRu: "Вы предоставляете поддержку после запуска проекта?",
      answerRu: "Да! Мы предлагаем пакеты технической поддержки и обслуживания, включая исправление ошибок, обновления безопасности, доработку функционала, мониторинг производительности и круглосуточную техническую поддержку. Также проводим обучение вашей команды для самостоятельного управления системой.",
      category: "Support",
      sortOrder: 4,
      isActive: true,
    },
    {
      question: "How do we start working together?",
      answer: "Getting started is easy: 1) Contact us via the form or email, 2) We schedule a free consultation to discuss your needs, 3) We provide a detailed proposal with timeline and cost, 4) Upon approval, we begin the discovery phase and project planning. The entire process from inquiry to project start typically takes 1-2 weeks.",
      questionRu: "Как начать работу с вами?",
      answerRu: "Начать просто: 1) Свяжитесь с нами через форму или email, 2) Мы назначим бесплатную консультацию для обсуждения ваших потребностей, 3) Мы предоставим детальное предложение со сроками и стоимостью, 4) После согласования начинаем этап анализа и планирования проекта. Весь процесс от запроса до старта проекта обычно занимает 1-2 недели.",
      category: "Process",
      sortOrder: 5,
      isActive: true,
    },
    {
      question: "Do you work with international clients?",
      answer: "Yes, we work with clients worldwide. Our team is experienced in remote collaboration using modern tools (Slack, Jira, Figma, GitHub). We accommodate different time zones and provide clear communication throughout the project. We've successfully delivered projects for clients in Europe, Asia, and North America.",
      questionRu: "Вы работаете с международными клиентами?",
      answerRu: "Да, мы работаем с клиентами по всему миру. Наша команда имеет опыт удалённого сотрудничества с использованием современных инструментов (Slack, Jira, Figma, GitHub). Мы учитываем разницу во временных поясах и обеспечиваем чёткую коммуникацию на протяжении всего проекта. Мы успешно реализовали проекты для клиентов из Европы, Азии и Северной Америки.",
      category: "General",
      sortOrder: 6,
      isActive: true,
    },
    {
      question: "Can you help with an existing project?",
      answer: "Absolutely! We regularly help clients improve, scale, or fix existing applications. We can conduct a code audit to assess the current state, recommend improvements, and take over development or work alongside your existing team. We also offer rescue services for troubled projects.",
      questionRu: "Можете ли вы помочь с существующим проектом?",
      answerRu: "Безусловно! Мы регулярно помогаем клиентам улучшать, масштабировать или исправлять существующие приложения. Мы можем провести аудит кода для оценки текущего состояния, предложить улучшения и взять на себя разработку или работать совместно с вашей командой. Также предлагаем услуги по спасению проблемных проектов.",
      category: "Services",
      sortOrder: 7,
      isActive: true,
    },
    {
      question: "What is your development process?",
      answer: "We follow Agile methodology with 2-week sprints. Our process includes: Discovery & Planning, UI/UX Design, Development, Quality Assurance, Deployment, and Support. You'll have regular updates, access to project management tools, and demos at the end of each sprint to review progress and provide feedback.",
      questionRu: "Каков ваш процесс разработки?",
      answerRu: "Мы работаем по методологии Agile с двухнедельными спринтами. Наш процесс включает: Анализ и планирование, UI/UX дизайн, Разработку, Тестирование, Развёртывание и Поддержку. Вы будете получать регулярные обновления, иметь доступ к инструментам управления проектом и демонстрации в конце каждого спринта для обзора прогресса и обратной связи.",
      category: "Process",
      sortOrder: 8,
      isActive: true,
    },
    {
      question: "Do you sign NDA agreements?",
      answer: "Yes, we take confidentiality seriously. We're happy to sign Non-Disclosure Agreements (NDA) before discussing any project details. All our contracts include standard confidentiality clauses to protect your intellectual property and business information.",
      questionRu: "Вы подписываете соглашения о неразглашении?",
      answerRu: "Да, мы серьёзно относимся к конфиденциальности. Мы готовы подписать соглашение о неразглашении (NDA) перед обсуждением деталей проекта. Все наши контракты включают стандартные положения о конфиденциальности для защиты вашей интеллектуальной собственности и бизнес-информации.",
      category: "General",
      sortOrder: 9,
      isActive: true,
    },
  ];

  // Clear existing FAQ items and seed fresh
  const existingFaqs = await prisma.faqItem.count();
  if (existingFaqs === 0) {
    await prisma.faqItem.createMany({ data: faqItems });
    console.log("FAQ items seeded:", faqItems.length);
  } else {
    console.log("FAQ items already exist, skipping seed:", existingFaqs);
  }

  console.log("\nSeed completed successfully!");
  console.log(`Admin login: ${adminEmail} / ${adminPassword === "admin123" ? "admin123 (DEFAULT - CHANGE THIS!)" : "****"}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

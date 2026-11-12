export const company = {
  name: "Rathore Group",
  legalName: "R & B Infra Project Limited",
  founded: 1994,
  phone: "022-28957474",
  phoneAlt: "022-28958787",
  email: "rmr@rathoregroup.co",
  tenderEmail: "tender@rathoregroup.co",
  address:
    "B/1, Neela Apartments, Ground Floor, SVP Road, Borivali West, Mumbai – 400 092.",
  // Values checked against pages 2 and 11 of the 2026 corporate profile. Keep executed value separate from turnover and pipeline.
  metrics: [
    {
      value: 3000,
      suffix: "+",
      prefix: "₹",
      unit: "Cr",
      label: "Projects successfully executed",
    },
    { value: 1994, suffix: "", label: "The year our journey began" },
    { value: 100, suffix: "+", label: "Institutional clients" },
    { value: 100, suffix: "", label: "Completed projects" },
    { value: 100, suffix: "+", label: "Team members" },
  ],
};
export const capabilities = [
  {
    id: "buildings",
    number: "01",
    title: "Buildings",
    subtitle: "Spaces that move society forward.",
    description:
      "From the hospitals that care for our communities to the institutions that shape tomorrow, we build places with a lasting purpose.",
    items: [
      "Hospitals & medical colleges",
      "Hostels & police housing",
      "Commercial & administrative buildings",
      "Judicial buildings, libraries & auditoriums",
    ],
    image: "/images/project-silvassa.webp",
    scene: 0,
  },
  {
    id: "roads",
    number: "02",
    title: "Roads & transportation",
    subtitle: "Connecting places. Creating possibilities.",
    description:
      "Roads, bridges and flyovers engineered to connect people, support commerce and open up new possibilities across challenging terrain.",
    items: [
      "Road construction",
      "Bridges & flyovers",
      "Highway infrastructure",
    ],
    image: "/images/road.webp",
    scene: 1,
  },
  {
    id: "water",
    number: "03",
    title: "Water infrastructure",
    subtitle: "Essential systems. Everyday impact.",
    description:
      "Reliable water supply, treatment and drainage infrastructure that supports healthier communities and more resilient cities.",
    items: [
      "Water supply schemes",
      "Water treatment plants",
      "Sewage treatment plants",
      "Storm water drainage",
    ],
    image: "/images/water.webp",
    scene: 2,
  },
  {
    id: "waste",
    number: "04",
    title: "Waste & renewables",
    subtitle: "Engineering a more circular future.",
    description:
      "Integrated waste management and resource recovery solutions, with a focus on the next chapter of sustainable urban development.",
    items: [
      "Door-to-door collection & material recovery",
      "Waste-to-energy & waste-to-biogas",
      "Biochar plants",
      "Faecal sludge treatment plants",
    ],
    image: "/images/waste.webp",
    scene: 3,
  },
];
export type Project = {
  slug: string;
  title: string;
  location: string;
  state: string;
  category: string;
  status: "Completed" | "Ongoing";
  value?: string;
  description: string;
  image?: string;
  imageNote?: string;
};
export const projects: Project[] = [
  {
    slug: "parbhani-water-supply",
    title: "Parbhani Water Supply Scheme",
    location: "Parbhani, Maharashtra",
    state: "Maharashtra",
    category: "Water infrastructure",
    status: "Completed",
    value: "78.08",
    description:
      "Water supply infrastructure supporting essential urban services in Parbhani.",
    image: "/images/projects/parbhani-water-supply.webp",
    imageNote: "Project photograph from the 2026 company profile",
  },
  {
    slug: "sirohi-medical-college",
    title: "Medical College at Sirohi",
    location: "Sirohi, Rajasthan",
    state: "Rajasthan",
    category: "Buildings",
    status: "Completed",
    value: "77.85",
    description:
      "Institutional infrastructure for medical education and public healthcare in Sirohi.",
    image: "/images/projects/sirohi-medical-college.webp",
    imageNote: "Project photograph from the 2026 company profile",
  },
  {
    slug: "jammu-kashmir-roads",
    title: "Road Construction in Jammu & Kashmir",
    location: "Jammu & Kashmir",
    state: "Jammu & Kashmir",
    category: "Roads & transportation",
    status: "Completed",
    value: "92.65",
    description:
      "Road infrastructure connecting communities across the region.",
    image: "/images/projects/jammu-kashmir-roads.webp",
    imageNote: "Project photograph from the 2026 company profile",
  },
  {
    slug: "pali-medical-college",
    title: "Medical College & Hospital at Pali",
    location: "Pali, Rajasthan",
    state: "Rajasthan",
    category: "Buildings",
    status: "Completed",
    value: "86.26",
    description:
      "Medical college and hospital infrastructure serving education and healthcare needs.",
    image: "/images/projects/pali-medical-college.webp",
    imageNote: "Architectural visualization from the 2026 company profile",
  },
  {
    slug: "mount-abu-sewerage",
    title: "Sewerage Works at Mount Abu",
    location: "Mount Abu, Rajasthan",
    state: "Rajasthan",
    category: "Water infrastructure",
    status: "Completed",
    value: "54.64",
    description:
      "Sewerage infrastructure supporting sanitation and urban water management at Mount Abu.",
    image: "/images/projects/mount-abu-sewerage.webp",
    imageNote: "Project photograph from the 2026 company profile",
  },
  {
    slug: "bhind-sewage-network",
    title: "Sewage Network in Bhind",
    location: "Bhind, Madhya Pradesh",
    state: "Madhya Pradesh",
    category: "Water infrastructure",
    status: "Completed",
    value: "86.51",
    description:
      "Sewage network infrastructure for improved urban sanitation in Bhind.",
    image: "/images/projects/bhind-sewage-network.webp",
    imageNote: "Project photograph from the 2026 company profile",
  },
  {
    slug: "odisha-surveillance",
    title: "CCTV Surveillance Systems",
    location: "Odisha",
    state: "Odisha",
    category: "Electrical & technology",
    status: "Completed",
    value: "10.70",
    description:
      "Surveillance systems supporting public infrastructure and monitoring.",
  },
  {
    slug: "uttar-pradesh-solar",
    title: "Solar Street Lighting Systems",
    location: "Uttar Pradesh",
    state: "Uttar Pradesh",
    category: "Renewable energy",
    status: "Completed",
    value: "46.28",
    description:
      "Solar-powered street lighting infrastructure for public spaces.",
  },
  {
    slug: "kanjurmarg-hospital",
    title: "Mother–Child Hospital",
    location: "Kanjurmarg, Mumbai",
    state: "Maharashtra",
    category: "Buildings",
    status: "Ongoing",
    description:
      "Mother and child hospital infrastructure for BMC in Kanjurmarg.",
    image: "/images/projects/kanjurmarg-hospital.webp",
    imageNote: "Project photograph from the 2026 company profile",
  },
  {
    slug: "badlapur-waste-plant",
    title: "Badlapur Waste Plant",
    location: "Badlapur, Maharashtra",
    state: "Maharashtra",
    category: "Waste & renewables",
    status: "Ongoing",
    description:
      "Waste management infrastructure supporting the needs of a growing urban community.",
    image: "/images/projects/badlapur-waste-plant.webp",
    imageNote: "Project photograph from the 2026 company profile",
  },
  {
    slug: "latur-water",
    title: "Latur Water Supply Scheme",
    location: "Latur, Maharashtra",
    state: "Maharashtra",
    category: "Water infrastructure",
    status: "Ongoing",
    description: "Water supply infrastructure for Latur, Maharashtra.",
    image: "/images/projects/latur-water.webp",
    imageNote: "Project photograph from the 2026 company profile",
  },
  {
    slug: "nh244",
    title: "NH-244 Road Construction",
    location: "Jammu & Kashmir",
    state: "Jammu & Kashmir",
    category: "Roads & transportation",
    status: "Ongoing",
    description:
      "National highway road construction across the Jammu & Kashmir region.",
    image: "/images/projects/nh244.webp",
    imageNote: "Project photograph from the 2026 company profile",
  },
  {
    slug: "sumdo-road",
    title: "Sumdo–Nidder–Rhongo Road",
    location: "Ladakh",
    state: "Ladakh",
    category: "Roads & transportation",
    status: "Ongoing",
    description: "Road infrastructure in the high-altitude terrain of Ladakh.",
    image: "/images/projects/sumdo-road.webp",
    imageNote: "Project photograph from the 2026 company profile",
  },
  {
    slug: "pangong-road",
    title: "Lukung–Chartse Road",
    location: "Pangong Lake, Ladakh",
    state: "Ladakh",
    category: "Roads & transportation",
    status: "Ongoing",
    description:
      "Road connectivity infrastructure near Pangong Lake in Ladakh.",
    image: "/images/projects/pangong-road.webp",
    imageNote: "Project photograph from the 2026 company profile",
  },
  {
    slug: "roha-guest-house",
    title: "Roha Industrial Area — MIDC Guest House",
    location: "Roha, Maharashtra",
    state: "Maharashtra",
    category: "Buildings",
    status: "Ongoing",
    description: "Guest house facilities serving the Roha industrial area.",
    image: "/images/projects/roha-guest-house.webp",
    imageNote: "Project photograph from the 2026 company profile",
  },
  {
    slug: "amrut-water",
    title: "Water Supply Scheme under AMRUT 2.0",
    location: "India",
    state: "",
    category: "Water infrastructure",
    status: "Ongoing",
    description:
      "Water supply infrastructure under the AMRUT 2.0 programme. Location to be confirmed from approved project records.",
    image: "/images/projects/amrut-water.webp",
    imageNote: "Project photograph from the 2026 company profile",
  },
  {
    slug: "arunachal-road",
    title: "Sungestar–Cheema Karpola Road",
    location: "Arunachal Pradesh",
    state: "Arunachal Pradesh",
    category: "Roads & transportation",
    status: "Ongoing",
    description:
      "Road connectivity infrastructure across the terrain of Arunachal Pradesh.",
    image: "/images/projects/arunachal-road.webp",
    imageNote: "Project photograph from the 2026 company profile",
  },
];
export const leadership = [
  {
    name: "Mr. Ratansingh M. Rathore",
    role: "Founder / Chairman / Managing Director",
    note: "An infrastructure entrepreneur with over four decades of experience, who began the group’s journey in 1994 and continues to guide its long-term direction.",
    photo: "/images/leadership/ratansingh.webp",
  },
  {
    name: "Ms. Roopkuwar Ratansingh Rathore",
    role: "CEO & Whole Time Director",
    note: "A Master’s graduate in Strategic Marketing from Cranfield University, UK, focused on lasting client relationships and business growth.",
    photo: "/images/leadership/roopkuwar.webp",
  },
  {
    name: "Mr. Ajaypalsingh Ratansingh Rathore",
    role: "Managing Director",
    note: "A BFA Architecture graduate from Parsons School of Design, contributing to design, project execution and business development.",
    photo: "/images/leadership/ajaypalsingh.webp",
  },
];
export const equipment = [
  {
    image: "/images/equipment/dumper.webp",
    name: "Dumper / Tipper",
    description: "Bulk material transport across construction sites.",
  },
  {
    image: "/images/equipment/transit-mixer.webp",
    name: "Transit Mixer",
    description: "Concrete transportation for on-site delivery.",
  },
  {
    image: "/images/equipment/rmc-plant.webp",
    name: "RMC Plant",
    description: "Ready-mix concrete production for construction.",
  },
  {
    image: "/images/equipment/piling-machine.webp",
    name: "Piling Machine",
    description: "Deep-foundation construction and ground engineering.",
  },
  {
    image: "/images/equipment/asphalt-plant.webp",
    name: "Asphalt Plant",
    description: "Asphalt production for road construction.",
  },
  {
    image: "/images/equipment/mobile-crane.webp",
    name: "Tyre Mount Crane",
    description: "Mobile lifting and site material handling.",
  },
  {
    image: "/images/equipment/mastic-cooker.webp",
    name: "Mastic Cooker",
    description: "Mastic asphalt preparation for surfacing works.",
  },
  {
    image: "/images/equipment/compactor.webp",
    name: "Large Compactor",
    description: "Compaction for stable road and earthwork layers.",
  },
  {
    image: "/images/equipment/sensor-paver.webp",
    name: "Sensor Paver",
    description: "Controlled paving for consistent road surfaces.",
  },
  {
    image: "/images/equipment/milling-machine.webp",
    name: "Wirtgen Milling Machine",
    description: "Road-surface milling and pavement preparation.",
  },
  {
    image: "/images/equipment/cement-spreader.webp",
    name: "PLC Controlled Cement Spreader",
    description: "Controlled cement application for soil stabilization.",
  },
  {
    image: "/images/equipment/fdr.webp",
    name: "Wirtgen FDR",
    description: "Full-depth reclamation for pavement rehabilitation.",
  },
];
export const groupCompanies = [
  "R & B Infra Project Limited",
  "R & B Aquiles Waste Management Pvt. Ltd.",
  "R & B Green Tech LLP",
  "Navimumbai Environment Projects Pvt. Ltd.",
  "R & B Greengas & Renewables",
  "R & B Power Pvt Ltd",
];
export const registrations = [
  "CPWD Registration",
  "Electric Registration Certificate",
  "MP Registration Certificate",
  "Gujarat Registration Certificate",
  "BMC Registration",
  "RMC BMC Registration",
  "Asphalt & ROC Plant BMC Approved",
  "DLB Rajasthan / PHED Registration",
];

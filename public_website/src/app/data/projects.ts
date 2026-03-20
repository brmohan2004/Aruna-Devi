/* ────────────────────────────────────────────
   Shared Project Data
   ──────────────────────────────────────────── */

export type Category = "All" | "Residential" | "Commercial" | "Villa";

export interface ProjectDetail {
    id: string;
    title: string;
    location: string;
    category: Category;
    image: string;
    /* Optional hero media — can be image or video URL. Falls back to `image` */
    heroMedia?: string;
    /* Extended fields for detail page */
    client: string;
    area: string;
    duration: string;
    description: string;
    challenges: string;
    keyOutcomes: string[];
    solutions: string;
    gallery: string[];
}

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".mov"];

export function isVideoUrl(url: string): boolean {
    const lower = url.toLowerCase().split("?")[0];
    return VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export const projects: ProjectDetail[] = [
    {
        id: "skyline-residential",
        title: "Skyline Residential",
        location: "Coimbatore",
        category: "Residential",
        image: "/public_website/projects/skyline-residential.png",
        client: "Global Tech Ventures",
        area: "120,000 sq ft",
        duration: "24 Months",
        description:
            "We combine technical expertise with creative vision to deliver architectural solutions that are both innovative and practical. Our integrated approach ensures seamless coordination between design and execution.",
        challenges:
            "We combine technical expertise with creative vision to deliver architectural solutions that are both innovative and practical. Our integrated approach ensures seamless coordination between design and execution.",
        keyOutcomes: [
            "We combine technical expertise with creative vision to deliver architectural solutions that are both innovative and practical.",
            "Our integrated approach ensures seamless coordination between design and execution.",
        ],
        solutions:
            "We combine technical expertise with creative vision to deliver architectural solutions that are both innovative and practical. Our integrated approach ensures seamless coordination between design and execution.",
        gallery: [
            "/public_website/projects/skyline-residential.png",
            "/public_website/projects/tech-park-tower.png",
            "/public_website/projects/commercial-complex.png",
            "/public_website/projects/luxury-villas.png",
            "/public_website/projects/modern-apartments.png",
            "/public_website/projects/hillside-villa.png",
        ],
    },
    {
        id: "tech-park-tower",
        title: "Tech Park Tower",
        location: "Coimbatore",
        category: "Commercial",
        image: "/public_website/projects/tech-park-tower.png",
        client: "Techventure Holdings",
        area: "85,000 sq ft",
        duration: "18 Months",
        description:
            "A modern commercial tower designed for the tech industry, featuring smart building systems, energy-efficient architecture, and collaborative workspace planning.",
        challenges:
            "Integrating cutting-edge smart building technology within a tight urban footprint while maintaining optimal natural light and ventilation for workspace productivity.",
        keyOutcomes: [
            "Achieved LEED Gold certification for sustainable design and energy efficiency.",
            "Reduced operational energy costs by 35% compared to conventional office buildings.",
        ],
        solutions:
            "Implemented a double-skin façade system with automated shading, combined with smart HVAC integration and IoT-based building management systems for optimal performance.",
        gallery: [
            "/public_website/projects/tech-park-tower.png",
            "/public_website/projects/skyline-residential.png",
            "/public_website/projects/commercial-complex.png",
            "/public_website/projects/luxury-villas.png",
            "/public_website/projects/modern-apartments.png",
            "/public_website/projects/hillside-villa.png",
        ],
    },
    {
        id: "commercial-complex",
        title: "Commercial Complex",
        location: "Madurai",
        category: "Commercial",
        image: "/public_website/projects/commercial-complex.png",
        client: "Madurai Metro Group",
        area: "200,000 sq ft",
        duration: "30 Months",
        description:
            "A multi-purpose commercial complex featuring retail spaces, office floors, and a food court, designed with a contemporary aesthetic and maximum space utilization.",
        challenges:
            "Balancing diverse tenant requirements across retail and office spaces while creating a cohesive architectural identity that respects the cultural heritage of Madurai.",
        keyOutcomes: [
            "Successfully delivered a mixed-use development accommodating 50+ tenants.",
            "Created a landmark structure that blends modern design with traditional South Indian architectural elements.",
        ],
        solutions:
            "Employed modular floor planning with flexible partition systems, allowing tenants to customize spaces. Used locally sourced stone cladding to pay homage to regional architecture.",
        gallery: [
            "/public_website/projects/commercial-complex.png",
            "/public_website/projects/tech-park-tower.png",
            "/public_website/projects/skyline-residential.png",
            "/public_website/projects/luxury-villas.png",
            "/public_website/projects/modern-apartments.png",
            "/public_website/projects/hillside-villa.png",
        ],
    },
    {
        id: "luxury-villas",
        title: "Luxury Villas",
        location: "Kodaikanal",
        category: "Villa",
        image: "/public_website/projects/luxury-villas.png",
        client: "Hillcrest Developers",
        area: "45,000 sq ft",
        duration: "20 Months",
        description:
            "Premium hillside villas designed to harmonize with the natural terrain of Kodaikanal, offering panoramic views and luxurious living in the lap of nature.",
        challenges:
            "Building on steep, rocky terrain at high altitude while preserving the natural ecosystem and ensuring structural integrity against landslides and heavy rainfall.",
        keyOutcomes: [
            "Zero deforestation achieved through careful site planning and tree preservation strategies.",
            "Each villa features a private infinity pool with valley views.",
        ],
        solutions:
            "Used terraced construction with reinforced retaining walls and deep pile foundations. Implemented rainwater harvesting and greywater recycling for sustainable hillside development.",
        gallery: [
            "/public_website/projects/luxury-villas.png",
            "/public_website/projects/hillside-villa.png",
            "/public_website/projects/skyline-residential.png",
            "/public_website/projects/tech-park-tower.png",
            "/public_website/projects/commercial-complex.png",
            "/public_website/projects/modern-apartments.png",
        ],
    },
    {
        id: "modern-apartments",
        title: "Modern Apartments",
        location: "Chennai",
        category: "Residential",
        image: "/public_website/projects/modern-apartments.png",
        client: "Chennai Urban Living",
        area: "160,000 sq ft",
        duration: "26 Months",
        description:
            "A contemporary apartment complex in the heart of Chennai, featuring smart home integration, community amenities, and sustainable design principles.",
        challenges:
            "Maximizing unit count on a compact urban plot while ensuring each apartment receives adequate natural light, ventilation, and privacy.",
        keyOutcomes: [
            "Delivered 120 premium apartments with 100% pre-launch booking success.",
            "Integrated solar panels and rainwater harvesting to reduce residents' utility costs by 25%.",
        ],
        solutions:
            "Designed a staggered building layout with setback terraces, ensuring cross-ventilation and light penetration. Used advanced 3D modeling for shadow analysis during design phase.",
        gallery: [
            "/public_website/projects/modern-apartments.png",
            "/public_website/projects/skyline-residential.png",
            "/public_website/projects/tech-park-tower.png",
            "/public_website/projects/commercial-complex.png",
            "/public_website/projects/luxury-villas.png",
            "/public_website/projects/hillside-villa.png",
        ],
    },
    {
        id: "hillside-villa",
        title: "Hillside Villa",
        location: "Ooty",
        category: "Villa",
        image: "/public_website/projects/hillside-villa.png",
        client: "Nilgiri Estates",
        area: "32,000 sq ft",
        duration: "16 Months",
        description:
            "Exclusive hillside villas in the Nilgiris, blending colonial-era charm with modern luxury, surrounded by tea gardens and eucalyptus forests.",
        challenges:
            "Navigating complex environmental regulations in the Nilgiri Biosphere Reserve while delivering world-class luxury that meets international standards.",
        keyOutcomes: [
            "Received the Green Building Award from the Tamil Nadu architectural council.",
            "Featured in Architectural Digest for innovative eco-luxury design.",
        ],
        solutions:
            "Used reclaimed wood and recycled materials for 40% of construction. Employed passive cooling techniques and geothermal heating to eliminate conventional HVAC dependency.",
        gallery: [
            "/public_website/projects/hillside-villa.png",
            "/public_website/projects/luxury-villas.png",
            "/public_website/projects/skyline-residential.png",
            "/public_website/projects/tech-park-tower.png",
            "/public_website/projects/commercial-complex.png",
            "/public_website/projects/modern-apartments.png",
        ],
    },
];

export const categories: Category[] = ["All", "Residential", "Commercial", "Villa"];

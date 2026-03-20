export interface Slide {
    category: string;
    title: string;
    media: string;
}

export const FALLBACK_HERO_SLIDES: Slide[] = [
    {
        category: "Projects",
        title: "Skyline Residential in Coimbatore",
        media: "/public_website/hero/slide-1.mp4",
    },
    {
        category: "Projects",
        title: "Tech Park Tower in Chennai",
        media: "/public_website/hero/slide-2.mp4",
    },
    {
        category: "Projects",
        title: "Luxury Villas in Kodaikanal",
        media: "/public_website/hero/slide-3.webp",
    },
    {
        category: "Projects",
        title: "Commercial Complex in Madurai",
        media: "/public_website/hero/slide-4.png",
    },
];

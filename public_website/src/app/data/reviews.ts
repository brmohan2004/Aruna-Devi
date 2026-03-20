export interface Review {
    id: string | number;
    name: string;
    image: string;
    text: string;
}

export const FALLBACK_REVIEWS: Review[] = [
    {
        id: 1,
        name: "Client 1",
        image: "/public_website/projects/modern-apartments.png",
        text: "Our team of experienced architects and engineers brings together decades of expertise to deliver exceptional results for every project.",
    },
    {
        id: 2,
        name: "Client 2",
        image: "/public_website/projects/modern-apartments.png",
        text: "Our team of experienced architects and engineers brings together decades of expertise to deliver exceptional results for every project.",
    },
    {
        id: 3,
        name: "Client 3",
        image: "/public_website/projects/modern-apartments.png",
        text: "Our team of experienced architects and engineers brings together decades of expertise to deliver exceptional results for every project.",
    },
    {
        id: 4,
        name: "Client 4",
        image: "/public_website/projects/modern-apartments.png",
        text: "Our team of experienced architects and engineers brings together decades of expertise to deliver exceptional results for every project.",
    },
];

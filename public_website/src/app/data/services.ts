export interface Service {
    id: string;
    title: string;
    description: string;
    extendedDescription: string;
    image: string;
}

export const FALLBACK_SERVICES: Service[] = [
    {
        id: "3d-visualization",
        title: "From 2D Plans to 3D Reality",
        description:
            "Experience your project before construction begins with our advanced 3D visualization services.",
        extendedDescription:
            "Experience your project before construction begins with our advanced 3D visualization services.We combine technical expertise with creative vision to deliver architectural solutions that are both innovative and practical. Our integrated approach ensures seamless coordination between design and execution.",
        image: "/public_website/services/3d-visualization.png",
    },
    {
        id: "architectural-planning",
        title: "Architectural Planning",
        description:
            "Innovative architectural designs that blend functionality with aesthetic appeal, from concept to construction drawings.",
        extendedDescription:
            "Innovative architectural designs that blend functionality with aesthetic appeal, from concept to construction drawings. We combine technical expertise with creative vision to deliver architectural solutions that are both innovative and practical. Our integrated approach ensures seamless coordination between design and execution.",
        image: "/public_website/services/architectural-planning.png",
    },
    {
        id: "structural-design",
        title: "Structural Design",
        description:
            "Complete structural analysis and design for residential, commercial, and industrial buildings ensuring safety and compliance.",
        extendedDescription:
            "Complete structural analysis and design for residential, commercial, and industrial buildings ensuring safety and compliance. We combine technical expertise with creative vision to deliver architectural solutions that are both innovative and practical. Our integrated approach ensures seamless coordination between design and execution.",
        image: "/public_website/services/structural-design.png",
    },
];

export interface SoftwareItem {
    id: string;
    src: string;
    alt: string;
}

export const FALLBACK_SOFTWARE_ITEMS: SoftwareItem[] = [
    { id: "autocad", src: "/public_website/software/autocad.png", alt: "AutoCAD" },
    { id: "revit", src: "/public_website/software/revit.png", alt: "Revit" },
    { id: "vray", src: "/public_website/software/vray.png", alt: "V-Ray" },
    { id: "staadpro", src: "/public_website/software/staadpro.png", alt: "STAAD.Pro" },
    { id: "etabs", src: "/public_website/software/etabs.png", alt: "ETABS" },
    { id: "tekla", src: "/public_website/software/tekla.png", alt: "Tekla" },
];

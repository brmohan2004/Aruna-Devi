export interface NavLink {
    label: string;
    href: string;
    active?: boolean;
}

export const navLinks: NavLink[] = [
    { label: "Projects", href: "#projects", active: true },
    { label: "Services", href: "#services", active: false },
    { label: "Futured projects", href: "#featured-projects", active: false },
    { label: "About", href: "#about", active: false },
    { label: "Team", href: "#team", active: false },
    { label: "Reviews", href: "#reviews", active: false },
];

export const communityLinks: NavLink[] = [
    { label: "Student Community", href: "#" },
    { label: "Working Professional Community", href: "#" },
    { label: "Career", href: "#" },
];

export const quickActionLinks: NavLink[] = [
    { label: "Projects", href: "/#projects" },
    { label: "Services", href: "/#services" },
    { label: "Featured Projects", href: "/#projects-section" },
    { label: "Team", href: "/#team" },
    { label: "About", href: "/#about" },
    { label: "Review", href: "/#reviews" },
];

export const resourceLinks: NavLink[] = [
    { label: "Blogs & news", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Privacy", href: "#" },
];

export interface ContactItem {
    text: string;
    href: string;
}

export const FALLBACK_CONTACT: ContactItem[] = [
    { text: "+91 1234567890", href: "tel:+911234567890" },
    { text: "infoad20@gmail.com", href: "mailto:infoad20@gmail.com" },
    { text: "3/1275D , anna Nagar, Chennai - 603202", href: "#" },
];

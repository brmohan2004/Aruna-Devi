import ProjectDetailClient from "./ProjectDetailClient";
import type { Metadata } from "next";

/* ────────────────────────────────────────────
   Metadata (static fallback)
   ──────────────────────────────────────────── */
export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    return {
        title: `Project | Aruna Devi Infra Projects`,
        description: `View project details — ${id.replace(/-/g, " ")}.`,
    };
}

/* ────────────────────────────────────────────
   Page Component — passes slug to client
   ──────────────────────────────────────────── */
export default async function ProjectDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <ProjectDetailClient slug={id} />;
}

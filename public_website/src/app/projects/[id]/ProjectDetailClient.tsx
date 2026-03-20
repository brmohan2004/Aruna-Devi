"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Footer from "@/app/components/landing_page/Footer";
import BottomFooter from "@/app/components/landing_page/BottomFooter";
import ProjectDetailHero from "@/app/components/project_detail/ProjectDetailHero";
import ProjectInfoBar from "@/app/components/project_detail/ProjectInfoBar";
import ProjectChallengesOutcomes from "@/app/components/project_detail/ProjectChallengesOutcomes";
import ProjectGallery from "@/app/components/project_detail/ProjectGallery";
import RelatedProjects from "@/app/components/project_detail/RelatedProjects";
import type { ProjectDetail } from "@/app/data/projects";
import { projects as FALLBACK_PROJECTS } from "@/app/data/projects";
import { getProjectBySlug, getFileUrl } from "@/lib/api";
import { IMAGES_BUCKET } from "@/lib/appwrite";

interface Props {
    slug: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function docToProject(doc: any): ProjectDetail {
    return {
        id: doc.slug ?? doc.$id,
        title: doc.title ?? "",
        location: doc.location ?? "",
        category: doc.category ?? "Residential",
        image: doc.thumbnail_id ? getFileUrl(IMAGES_BUCKET, doc.thumbnail_id) : "/public_website/projects/skyline-residential.png",
        heroMedia: doc.hero_image_id ? getFileUrl(IMAGES_BUCKET, doc.hero_image_id) : undefined,
        client: doc.client_name ?? "",
        area: doc.area ?? "",
        duration: doc.duration ?? "",
        description: doc.description ?? "",
        challenges: doc.challenges ?? "",
        solutions: doc.solutions ?? "",
        keyOutcomes: Array.isArray(doc.key_outcomes) ? doc.key_outcomes : [],
        gallery: Array.isArray(doc.gallery_ids)
            ? doc.gallery_ids.map((fid: string) => getFileUrl(IMAGES_BUCKET, fid))
            : [],
    };
}

export default function ProjectDetailClient({ slug }: Props) {
    const [project, setProject] = useState<ProjectDetail | null | undefined>(undefined); // undefined = loading

    useEffect(() => {
        getProjectBySlug(slug)
            .then((doc) => {
                if (doc) {
                    setProject(docToProject(doc));
                } else {
                    // Fallback to static data
                    const fallback = FALLBACK_PROJECTS.find((p) => p.id === slug);
                    setProject(fallback ?? null);
                }
            })
            .catch(() => {
                // Fallback to static on error
                const fallback = FALLBACK_PROJECTS.find((p) => p.id === slug);
                setProject(fallback ?? null);
            });
    }, [slug]);

    // Loading state
    if (project === undefined) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#000", color: "#fff" }}>
                Loading…
            </div>
        );
    }

    // Not found
    if (project === null) {
        notFound();
    }

    return (
        <>
            <main>
                <ProjectDetailHero project={project} />
                <ProjectInfoBar project={project} />
                <ProjectChallengesOutcomes project={project} />
                <ProjectGallery project={project} />
                <RelatedProjects currentProjectId={project.id} />
            </main>
            <Footer />
            <BottomFooter />
        </>
    );
}

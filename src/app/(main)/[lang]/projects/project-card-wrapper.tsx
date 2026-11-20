"use client";

import { type ReactNode, useEffect, useMemo } from "react";
import { useProjectVisibility } from "./project-visibility";

interface ProjectCardWrapperProps {
	id: string;
	categoryId: string | null;
	children: ReactNode;
}

/**
 * Wrapper that:
 * 1. Registers the project's categoryId with the visibility controller
 * 2. Shows/hides children based on visibility state
 * 3. Adds stagger reveal animation
 */
export function ProjectCardWrapper({
	id,
	categoryId,
	children,
}: ProjectCardWrapperProps) {
	const { registerProject, isVisible } = useProjectVisibility();

	useEffect(() => {
		registerProject(id, categoryId);
	}, [id, categoryId, registerProject]);

	const animationDelay = useMemo(() => {
		const number = Number.parseInt(id.replace(/\D/g, "").slice(-2) || "0", 10);

		return `${(number % 5) * 120}ms`;
	}, [id]);

	if (!isVisible(id)) return null;

	return (
		<div
			className="animate-project-card-reveal h-full min-w-0 opacity-0"
			style={{
				animationDelay,
				animationFillMode: "forwards",
			}}
		>
			{children}
		</div>
	);
}

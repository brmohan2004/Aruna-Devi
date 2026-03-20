"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedTextProps {
    text: string;
    className?: string;
    wordClassName?: string;
    delayOffset?: number;
    wordDelay?: number;
}

export default function AnimatedText({
    text,
    className = "",
    wordClassName = "",
    delayOffset = 0,
    wordDelay = 0.06,
}: AnimatedTextProps) {
    const containerRef = useRef<HTMLSpanElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // Disconnect to play animation only once
                    observer.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: "0px" }
        );
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // Split text by spaces, preserving the structure
    const words = text.split(" ");

    return (
        <span ref={containerRef} className={`inline-block ${className}`} style={{ verticalAlign: 'top' }}>
            {words.map((word, index) => (
                <span
                    key={index}
                    className="inline-block overflow-hidden"
                    style={{ marginRight: "0.25em", paddingBottom: "0.1em", verticalAlign: 'top' }}
                >
                    <span
                        className={`inline-block transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${wordClassName}`}
                        style={{
                            transform: isVisible ? "translateY(0)" : "translateY(100%)",
                            opacity: isVisible ? 1 : 0,
                            transitionDelay: `${delayOffset + index * wordDelay}s`,
                        }}
                    >
                        {word}
                    </span>
                </span>
            ))}
        </span>
    );
}

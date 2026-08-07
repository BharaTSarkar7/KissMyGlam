import React from "react";

interface SectionHeadingProps {
  title: string;
  subtitle: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col gap-2 mb-8">
      <h2 className="font-serif text-3xl font-medium tracking-[-0.01em] text-ink">
        {title}
      </h2>
      <h3 className="font-sans text-lg text-ink-soft mt-1">
        {subtitle}
      </h3>
    </div>
  );
};

import React from "react";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ eyebrow, title }) => {
  return (
    <div className="flex flex-col gap-2 mb-8">
      <span className="text-[11px] uppercase tracking-[0.18em] text-ink-soft font-semibold font-sans">
        {eyebrow}
      </span>
      <h2 className="font-serif text-3xl font-medium tracking-[-0.01em] text-ink">
        {title}
      </h2>
    </div>
  );
};

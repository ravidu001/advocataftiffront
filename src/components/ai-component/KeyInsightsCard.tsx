"use client";

import React, { useState } from "react";

import KeyInsightsIcon from "./KeyInsightsIcon";

const ConfidenceIcon = ({ active }: { active: boolean }) => {
  const fillColor = active ? "#475569" : "none";
  const strokeColor = active ? "#334155" : "#475569";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className="inline-flex"
    >
      <path
        d="M1 6.25C1 5.6977 1.44771 5.25 2 5.25C2.82842 5.25 3.5 5.92155 3.5 6.75V8.75C3.5 9.57845 2.82842 10.25 2 10.25C1.44771 10.25 1 9.8023 1 9.25V6.25Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.73935 3.90313L7.6062 4.33317C7.4971 4.68556 7.44255 4.86175 7.4845 5.0009C7.51845 5.11345 7.59295 5.2105 7.6945 5.27435C7.82 5.35325 8.00985 5.35325 8.38955 5.35325H8.59155C9.8766 5.35325 10.5191 5.35325 10.8226 5.73365C10.8573 5.7771 10.8881 5.82335 10.9148 5.87185C11.1482 6.29605 10.8829 6.86755 10.352 8.01055C9.86485 9.05945 9.62125 9.5839 9.169 9.8926C9.12525 9.92245 9.08025 9.95065 9.03415 9.97705C8.558 10.25 7.9681 10.25 6.7882 10.25H6.5323C5.10285 10.25 4.38814 10.25 3.94407 9.81975C3.5 9.38945 3.5 8.69695 3.5 7.31195V6.82515C3.5 6.0973 3.5 5.7334 3.62917 5.4003C3.75834 5.0672 4.00568 4.79332 4.50035 4.24556L6.54605 1.98028C6.59735 1.92347 6.623 1.89506 6.64565 1.87538C6.85675 1.69164 7.1826 1.71232 7.3672 1.92118C7.387 1.94355 7.4086 1.97496 7.4518 2.03777C7.5194 2.13603 7.5532 2.18516 7.5827 2.23383C7.8464 2.66957 7.9262 3.18718 7.8054 3.67858C7.7919 3.73346 7.7744 3.79005 7.73935 3.90313Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const HelpfulIcon = ({ active }: { active: boolean }) => {
  const fillColor = active ? "#475569" : "none";
  const strokeColor = active ? "#334155" : "#475569";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 5.75C1 6.3023 1.44771 6.75 2 6.75C2.82842 6.75 3.5 6.07845 3.5 5.25V3.25C3.5 2.42158 2.82842 1.75 2 1.75C1.44771 1.75 1 2.19771 1 2.75V5.75Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.73935 8.09685L7.6062 7.66685C7.4971 7.31445 7.44255 7.13825 7.4845 6.9991C7.51845 6.88655 7.59295 6.7895 7.6945 6.72565C7.82 6.64675 8.00985 6.64675 8.38955 6.64675H8.59155C9.8766 6.64675 10.5191 6.64675 10.8226 6.26635C10.8573 6.2229 10.8881 6.17665 10.9148 6.12815C11.1482 5.70395 10.8829 5.13245 10.352 3.98945C9.86485 2.94055 9.62125 2.41611 9.169 2.10742C9.12525 2.07754 9.08025 2.04935 9.03415 2.02293C8.558 1.75 7.9681 1.75 6.7882 1.75H6.5323C5.10285 1.75 4.38814 1.75 3.94407 2.18026C3.5 2.61053 3.5 3.30304 3.5 4.68804V5.17485C3.5 5.9027 3.5 6.2666 3.62917 6.5997C3.75834 6.9328 4.00568 7.2067 4.50035 7.75445L6.54605 10.0197C6.59735 10.0766 6.623 10.105 6.64565 10.1247C6.85675 10.3083 7.1826 10.2877 7.3672 10.0788C7.387 10.0564 7.4086 10.025 7.4518 9.96225C7.5194 9.864 7.5532 9.81485 7.5827 9.76615C7.8464 9.33045 7.9262 8.8128 7.8054 8.32145C7.7919 8.26655 7.7744 8.20995 7.73935 8.09685Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

type ThumbFeedback = "up" | "down" | null;

interface KeyInsightsCardProps {
  title?: string;
  content?: string;
  confidence?: string;
}

export default function KeyInsightsCard({
  title = "Significant Growth in Food Consumption",
  content = "Food spending rose from Rs 5.38T (2022) to Rs 6.13T (2024), driven by 9.2% growth in 2023 and 4.4% in 2024.",
  confidence = "High (85%)",
}: KeyInsightsCardProps) {
  const [thumbFeedback, setThumbFeedback] = useState<ThumbFeedback>(null);

  return (
    <article className="flex w-full flex-col rounded-2xl border border-slate-200 bg-white px-4 py-5">
      <div className="grid gap-x-3">
        <div className="row-span-2">
          <KeyInsightsIcon />
        </div>

        <div className="space-y-2">
          <h3
            className="text-sm font-semibold leading-5 text-slate-900"
            style={{ fontFamily: "Montserrat" }}
          >
            {title}
          </h3>

          <p
            className="text-xs leading-5 text-slate-600 font-normal"
            style={{ fontFamily: '"Source Code Pro"' }}
          >
            {content}
          </p>
        </div>

        {/* ✅ Crisp 1px divider */}
        <div className="col-start-2 mt-2 pt-1.5 relative">
          <span className="absolute left-0 right-0 top-0 h-px bg-slate-100" />

          <div className="flex items-center justify-between text-[10px] leading-4 text-slate-500">
            <div
              className="flex items-center gap-1"
              style={{ fontFamily: '"Source Code Pro"' }}
            >
              <span className="text-slate-500">Confidence:</span>
              <span className="text-slate-600">{confidence}</span>
            </div>

            <div
              className="flex items-center gap-2.5"
              style={{ fontFamily: '"Source Code Pro"' }}
            >
              <span className="text-slate-500 leading-4">Helpful?</span>

              <div className="flex items-center gap-1.5 rounded-full text-xs text-slate-600">
                <button
                  type="button"
                  onClick={() =>
                    setThumbFeedback(thumbFeedback === "up" ? null : "up")
                  }
                  aria-pressed={thumbFeedback === "up"}
                  className="rounded-full transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CF1244]"
                >
                  <ConfidenceIcon active={thumbFeedback === "up"} />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setThumbFeedback(thumbFeedback === "down" ? null : "down")
                  }
                  aria-pressed={thumbFeedback === "down"}
                  className="rounded-full transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CF1244]"
                >
                  <HelpfulIcon active={thumbFeedback === "down"} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

import type { DetailContentMap, DetailVariant } from "./detailContent.types";
import React, { useEffect, useState } from "react";

import InsightsDisclaimerCard from "./InsightsDisclaimerCard";
import KeyInsightsCard from "./KeyInsightsCard";
import LoadingIcon from "./LoadingIcon";
import SuggestedActionCard from "./SuggestedActionCard";
import TitleCard from "./TitleCard";

export type AIInsightsPanelProps = {
  onClose?: () => void;
  datasetUrl?: string;
};

export default function AIInsightsPanel({ onClose, datasetUrl }: AIInsightsPanelProps) {
  const [insights, setInsights] = useState<DetailContentMap | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!datasetUrl) return;

    const fetchInsights = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/generate-insights", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ datasetUrl }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch insights");
        }

        const data = await response.json();
        setInsights(data);
      } catch (err) {
        console.error(err);
        setError("Failed to generate insights. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [datasetUrl]);

  const moreInsightsDetails: {
    title: string;
    description: string;
    detailVariant: DetailVariant;
    detailContent: DetailContentMap[DetailVariant] | undefined;
  }[] = [
    {
      title: "Generate Summary Statistics Report",
      description:
        "Get mean, median, growth rates & volatility for all 12 categories",
      detailVariant: "composition",
      detailContent: insights?.composition,
    },
    {
      title: "Visualize 26-Year Trend Lines",
      description: "See spending patterns across all categories from 1998-2024",
      detailVariant: "trend",
      detailContent: insights?.trend,
    },
    {
      title: "Compare Category Performance Ranking",
      description: "Rank all 12 categories by total spending, growth & stability",
      detailVariant: "ranking",
      detailContent: insights?.ranking,
    },
    {
      title: "Identify & Flag Data Quality Issues",
      description: "Detect missing values, outliers & anomalies in the dataset",
      detailVariant: "dataQuality",
      detailContent: insights?.dataQuality,
    },
    {
      title: "Project 2025-2027 Spending Patterns",
      description: "AI forecasts using time-series analysis on 26 years of data",
      detailVariant: "forecast",
      detailContent: insights?.forecast,
    },
    {
      title: "Export Analysis-Ready Dataset",
      description: "Download cleaned CSV with calculated fields & corrections",
      detailVariant: "dataset",
      detailContent: insights?.dataset,
    },
  ];

  return (
    <div className="flex w-full flex-col gap-3">
      <article className="rounded-[14px] bg-white px-6 pb-6 pt-6">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-gradient-to-br from-[#EA1952] to-[#AA1E58]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M22.7855 15.3691C21.8551 16.754 20.7302 18.1261 19.4276 19.4271C17.5556 21.3006 15.5372 22.8091 13.5486 23.9015C10.7958 25.4128 8.08695 26.1287 5.86558 25.981C4.20513 25.8716 2.79467 25.2921 1.75081 24.2481C0.398568 22.8959 -0.178102 20.9088 0.0477441 18.5738C0.1074 17.9502 0.664195 17.49 1.28777 17.5497C1.91132 17.6093 2.37155 18.1661 2.30905 18.7911C2.15706 20.3635 2.44683 21.7299 3.35872 22.6419C4.21382 23.497 5.4737 23.8024 6.92678 23.7129C8.60003 23.6092 10.509 22.9771 12.4535 21.909C14.2688 20.9104 16.1112 19.5312 17.8213 17.8211C19.3596 16.2828 20.6309 14.638 21.5968 13.0002C20.6309 11.3625 19.3597 9.71765 17.8213 8.17927C17.4207 7.7787 17.0145 7.39806 16.6026 7.03444C16.1324 6.62111 16.0855 5.90095 16.5003 5.43079C16.9151 4.96204 17.6352 4.91517 18.104 5.32994C18.5528 5.7248 18.9946 6.13816 19.4278 6.57139C21.2999 8.44347 22.8069 10.4632 23.8993 12.4505C23.9007 12.4519 23.9007 12.4519 23.9007 12.4519C25.4134 15.206 26.1293 17.9135 25.9802 20.1349C25.8708 21.7953 25.2913 23.2072 24.2487 24.2482C22.8965 25.6018 20.9079 26.1771 18.5729 25.9527C17.9494 25.893 17.492 25.3376 17.5502 24.7126C17.6113 24.0876 18.1667 23.6289 18.7917 23.6914C20.364 23.8405 21.7319 23.5536 22.6424 22.6417C23.4989 21.7866 23.8029 20.5253 23.712 19.0736C23.6424 17.9274 23.3242 16.6717 22.7859 15.369L22.7855 15.3691ZM2.10004 13.5481C0.587289 10.794 -0.128577 8.08651 0.0205453 5.86513C0.129916 4.20468 0.708012 2.79281 1.75059 1.75037C3.10426 0.398126 5.09139 -0.177127 7.42639 0.0473018C8.05139 0.106958 8.50876 0.662335 8.4505 1.28733C8.38943 1.91233 7.83405 2.36969 7.20906 2.3086C5.63668 2.15804 4.26883 2.44496 3.35683 3.35686C2.50173 4.21337 2.19778 5.47326 2.28727 6.92633C2.35829 8.07258 2.67645 9.32825 3.21338 10.6295C4.14516 9.246 5.27011 7.8739 6.57264 6.57289C8.44472 4.69939 10.4631 3.1909 12.4517 2.0985C15.2044 0.58721 17.9133 -0.128692 20.1347 0.019012C21.7952 0.128383 23.2056 0.707897 24.248 1.75048C25.6017 3.10414 26.1769 5.09127 25.9525 7.42628C25.8914 8.04982 25.3361 8.51006 24.7125 8.45039C24.0889 8.38931 23.6287 7.83394 23.6898 7.20894C23.8432 5.63656 23.5534 4.26872 22.6415 3.35817C21.7864 2.50307 20.5251 2.1977 19.0721 2.28719C17.4002 2.39088 15.4912 3.02294 13.5468 4.09109C11.7315 5.08963 9.88802 6.46886 8.17899 8.17894C6.63926 9.71725 5.36799 11.3621 4.40348 12.9999C5.36792 14.6376 6.6406 16.2824 8.17899 17.8208C8.57814 18.2214 8.98434 18.6006 9.39771 18.9642C9.86787 19.379 9.91474 20.0977 9.49998 20.5693C9.08381 21.038 8.36507 21.0835 7.89491 20.6701C7.44747 20.2753 7.00432 19.8605 6.5711 19.4273C4.70044 17.5566 3.19336 15.5368 2.10107 13.5496C2.09965 13.5482 2.09965 13.5482 2.09965 13.5482L2.10004 13.5481ZM13.6876 9.2712C13.6876 9.2712 14.3666 10.7839 14.7884 11.2072C15.2117 11.6305 16.7301 12.3137 16.7301 12.3137C16.9957 12.4373 17.1676 12.7057 17.1662 12.9998C17.1676 13.2952 16.9957 13.5637 16.7287 13.6872C16.7287 13.6872 15.2174 14.3662 14.7913 14.7866C14.368 15.2113 13.6862 16.7297 13.6862 16.7297C13.564 16.9953 13.2942 17.1658 12.9987 17.1658C12.7061 17.1672 12.4376 16.9953 12.3141 16.7297C12.3141 16.7297 11.6309 15.2113 11.2076 14.7881C10.7843 14.3662 9.27157 13.6873 9.27157 13.6873C9.00453 13.5623 8.83267 13.2938 8.83267 12.9998C8.83409 12.7058 9.00454 12.4359 9.27157 12.3123C9.27157 12.3123 10.7829 11.6334 11.2076 11.2115C11.6323 10.7882 12.3127 9.26985 12.3127 9.26985C12.4362 9.00423 12.7061 8.83379 13.0001 8.83237C13.2941 8.83237 13.5627 9.00417 13.6876 9.2712ZM13.0002 11.2228C12.7544 11.6518 12.4874 12.0722 12.2772 12.2825C12.0684 12.4913 11.6522 12.7555 11.2232 12.9998C11.6522 13.2441 12.0684 13.5083 12.2772 13.7157C12.4874 13.9245 12.7544 14.3449 13.0002 14.7767C13.2459 14.3464 13.5129 13.9259 13.7232 13.7157C13.9305 13.5083 14.3496 13.2441 14.7757 12.9998C14.3453 12.7541 13.9249 12.487 13.716 12.2768C13.5086 12.068 13.2431 11.6503 13.0002 11.2228Z"
                  fill="white"
                />
              </svg>
            </span>

            <div className="space-y-1">
              <p
                className="text-[16px] leading-6 font-normal text-slate-900"
                style={{ fontFamily: '"Source Code Pro"' }}
              >
                AI Insights
              </p>
              <p
                className="text-sm font-normal leading-5 text-slate-600"
                style={{ fontFamily: "Montserrat" }}
              >
                Automated analysis & recommendations
              </p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-end rounded-full  text-slate-400 transition hover:text-slate-600"
            aria-label="Close AI insights"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M15 5L5 15"
                stroke="#475569"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 5L15 15"
                stroke="#475569"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </header>

        {loading || !insights ? (
          <div className="flex h-64 items-center justify-center">
            {loading ? (
              <div className="flex flex-col items-center gap-2">
                <LoadingIcon className="h-8 w-8 animate-spin text-[#EA1952]" />
                <p className="text-sm text-slate-500">Analyzing dataset...</p>
              </div>
            ) : error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <LoadingIcon className="h-8 w-8 animate-spin text-[#EA1952]" />
                <p className="text-sm text-slate-500">Initializing...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-y-6">
            <TitleCard />

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p
                    className="text-base leading-6 font-semibold text-slate-900"
                    style={{ fontFamily: "Montserrat" }}
                  >
                    Key Insights
                  </p>
                  <span
                    className="flex h-5 items-center justify-center rounded-full bg-slate-200 px-2 text-slate-700 text-[10px] font-semibold leading-3"
                    style={{ fontFamily: "Arial" }}
                  >
                    {insights.keyInsights?.length || 0}
                  </span>
                </div>
                <span
                  className="text-xs font-normal leading-5 text-slate-500"
                  style={{ fontFamily: '"Source Code Pro"' }}
                >
                  AI-identified patterns
                </span>
              </div>
              {insights.keyInsights?.map((insight, index) => (
                <KeyInsightsCard
                  key={index}
                  title={insight.title}
                  content={insight.content}
                  confidence={insight.confidence}
                />
              ))}
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p
                    className="text-base leading-6 font-semibold text-slate-900"
                    style={{ fontFamily: "Montserrat" }}
                  >
                    More Insights
                  </p>
                  <span
                    className="flex h-5 items-center justify-center rounded-full bg-slate-200 px-2 text-slate-700 text-[10px] font-semibold leading-3"
                    style={{ fontFamily: "Arial" }}
                  >
                    {moreInsightsDetails.length}
                  </span>
                </div>
                <span
                  className="text-[11px] text-slate-500"
                  style={{ fontFamily: '"Source Code Pro"' }}
                >
                  Actionable recommendations
                </span>
              </div>
              <div className="space-y-2">
                {moreInsightsDetails.map((insight) => (
                  <SuggestedActionCard
                    key={insight.title}
                    showDetailOnClick
                    title={insight.title}
                    description={insight.description}
                    detailVariant={insight.detailVariant}
                    detailContent={insight.detailContent!}
                  />
                ))}
              </div>
            </section>
          </div>
        )}

        <div className="mt-6">
          <InsightsDisclaimerCard />
        </div>
      </article>
    </div>
  );
}

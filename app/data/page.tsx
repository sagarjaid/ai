"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Chart from "chart.js/auto";
import type { ChartDataset } from "chart.js";

interface CountryRaw {
  country: string;
  gdpPerCapita: number;
  saasCustomers_M: number;
  propensityToPayEdu: number; // 1-10
  kids_M: number; // children 6-17 in millions
  avgKidPerHouse: number;
  englishProficiency: number; // 1-10
  internetPenetration: number; // percent
  easeOfBiz: number; // 1-10
  opsComplexity: number; // 1-10 (higher = easier per original data intent)
  stemAwareness: number; // 1-10
  supplementaryLearning: number; // 1-10
  avgCPC: number; // USD
}

interface CountryProcessed extends CountryRaw {
  id: string;
  rank: number;
  targetHouseholds_M: number;
  gdp_10: number;
  saas_10: number;
  kids_10: number;
  households_10: number;
  cpc_10: number; // higher is better (lower CPC)
  internet_10: number; // 1-10
  marketScore: number;
  opsScore: number;
  affinityScore: number;
  finalScore: number;
}

function normalizeToTen(value: number, min: number, max: number): number {
  if (max === min) return 5; // avoid divide-by-zero; neutral score
  return ((value - min) / (max - min)) * 9 + 1;
}

const rawData: CountryRaw[] = [
  {
    country: "United States",
    gdpPerCapita: 76398,
    saasCustomers_M: 100,
    propensityToPayEdu: 8,
    kids_M: 49.5,
    avgKidPerHouse: 1.9,
    englishProficiency: 10,
    internetPenetration: 92,
    easeOfBiz: 6,
    opsComplexity: 8,
    stemAwareness: 9,
    supplementaryLearning: 7,
    avgCPC: 2.5,
  },
  {
    country: "United Kingdom",
    gdpPerCapita: 46140,
    saasCustomers_M: 45,
    propensityToPayEdu: 7,
    kids_M: 12.1,
    avgKidPerHouse: 1.7,
    englishProficiency: 10,
    internetPenetration: 95,
    easeOfBiz: 8,
    opsComplexity: 8,
    stemAwareness: 8,
    supplementaryLearning: 6,
    avgCPC: 2.1,
  },
  {
    country: "Canada",
    gdpPerCapita: 55529,
    saasCustomers_M: 25,
    propensityToPayEdu: 7,
    kids_M: 6.0,
    avgKidPerHouse: 1.6,
    englishProficiency: 10,
    internetPenetration: 94,
    easeOfBiz: 8,
    opsComplexity: 8,
    stemAwareness: 8,
    supplementaryLearning: 6,
    avgCPC: 2.3,
  },
  {
    country: "Australia",
    gdpPerCapita: 65100,
    saasCustomers_M: 20,
    propensityToPayEdu: 7,
    kids_M: 4.6,
    avgKidPerHouse: 1.8,
    englishProficiency: 10,
    internetPenetration: 91,
    easeOfBiz: 8,
    opsComplexity: 7,
    stemAwareness: 8,
    supplementaryLearning: 6,
    avgCPC: 2.6,
  },
  {
    country: "Singapore",
    gdpPerCapita: 82808,
    saasCustomers_M: 8,
    propensityToPayEdu: 9,
    kids_M: 0.8,
    avgKidPerHouse: 1.2,
    englishProficiency: 9,
    internetPenetration: 98,
    easeOfBiz: 9,
    opsComplexity: 7,
    stemAwareness: 10,
    supplementaryLearning: 10,
    avgCPC: 1.9,
  },
  {
    country: "India",
    gdpPerCapita: 2389,
    saasCustomers_M: 70,
    propensityToPayEdu: 9,
    kids_M: 375.0,
    avgKidPerHouse: 2.1,
    englishProficiency: 8,
    internetPenetration: 65,
    easeOfBiz: 6,
    opsComplexity: 6,
    stemAwareness: 9,
    supplementaryLearning: 10,
    avgCPC: 0.8,
  },
  {
    country: "Israel",
    gdpPerCapita: 52174,
    saasCustomers_M: 5,
    propensityToPayEdu: 8,
    kids_M: 2.5,
    avgKidPerHouse: 2.4,
    englishProficiency: 7,
    internetPenetration: 89,
    easeOfBiz: 7,
    opsComplexity: 6,
    stemAwareness: 10,
    supplementaryLearning: 8,
    avgCPC: 1.7,
  },
  {
    country: "New Zealand",
    gdpPerCapita: 48788,
    saasCustomers_M: 4,
    propensityToPayEdu: 6,
    kids_M: 0.9,
    avgKidPerHouse: 1.9,
    englishProficiency: 10,
    internetPenetration: 94,
    easeOfBiz: 9,
    opsComplexity: 8,
    stemAwareness: 7,
    supplementaryLearning: 5,
    avgCPC: 2.4,
  },
  {
    country: "UAE",
    gdpPerCapita: 53708,
    saasCustomers_M: 6,
    propensityToPayEdu: 8,
    kids_M: 1.5,
    avgKidPerHouse: 2.2,
    englishProficiency: 8,
    internetPenetration: 99,
    easeOfBiz: 8,
    opsComplexity: 7,
    stemAwareness: 9,
    supplementaryLearning: 8,
    avgCPC: 1.5,
  },
  {
    country: "Saudi Arabia",
    gdpPerCapita: 30448,
    saasCustomers_M: 10,
    propensityToPayEdu: 7,
    kids_M: 7.2,
    avgKidPerHouse: 2.5,
    englishProficiency: 6,
    internetPenetration: 98,
    easeOfBiz: 7,
    opsComplexity: 6,
    stemAwareness: 8,
    supplementaryLearning: 7,
    avgCPC: 1.2,
  },
  {
    country: "Indonesia",
    gdpPerCapita: 4788,
    saasCustomers_M: 20,
    propensityToPayEdu: 6,
    kids_M: 68.0,
    avgKidPerHouse: 2.2,
    englishProficiency: 5,
    internetPenetration: 77,
    easeOfBiz: 5,
    opsComplexity: 5,
    stemAwareness: 6,
    supplementaryLearning: 7,
    avgCPC: 0.5,
  },
  {
    country: "France",
    gdpPerCapita: 42330,
    saasCustomers_M: 30,
    propensityToPayEdu: 5,
    kids_M: 11.5,
    avgKidPerHouse: 1.8,
    englishProficiency: 4,
    internetPenetration: 93,
    easeOfBiz: 7,
    opsComplexity: 7,
    stemAwareness: 7,
    supplementaryLearning: 4,
    avgCPC: 2.8,
  },
  {
    country: "Germany",
    gdpPerCapita: 51222,
    saasCustomers_M: 40,
    propensityToPayEdu: 5,
    kids_M: 12.0,
    avgKidPerHouse: 1.6,
    englishProficiency: 5,
    internetPenetration: 94,
    easeOfBiz: 7,
    opsComplexity: 7,
    stemAwareness: 8,
    supplementaryLearning: 4,
    avgCPC: 2.9,
  },
  {
    country: "Thailand",
    gdpPerCapita: 7297,
    saasCustomers_M: 8,
    propensityToPayEdu: 7,
    kids_M: 12.8,
    avgKidPerHouse: 1.9,
    englishProficiency: 4,
    internetPenetration: 85,
    easeOfBiz: 6,
    opsComplexity: 6,
    stemAwareness: 7,
    supplementaryLearning: 8,
    avgCPC: 0.7,
  },
  {
    country: "Philippines",
    gdpPerCapita: 3649,
    saasCustomers_M: 15,
    propensityToPayEdu: 7,
    kids_M: 30.0,
    avgKidPerHouse: 2.5,
    englishProficiency: 8,
    internetPenetration: 73,
    easeOfBiz: 5,
    opsComplexity: 5,
    stemAwareness: 6,
    supplementaryLearning: 8,
    avgCPC: 0.6,
  },
  {
    country: "Vietnam",
    gdpPerCapita: 4087,
    saasCustomers_M: 12,
    propensityToPayEdu: 8,
    kids_M: 22.5,
    avgKidPerHouse: 2.1,
    englishProficiency: 5,
    internetPenetration: 79,
    easeOfBiz: 5,
    opsComplexity: 5,
    stemAwareness: 7,
    supplementaryLearning: 9,
    avgCPC: 0.45,
  },
  {
    country: "Mexico",
    gdpPerCapita: 11497,
    saasCustomers_M: 18,
    propensityToPayEdu: 5,
    kids_M: 33.0,
    avgKidPerHouse: 2.3,
    englishProficiency: 3,
    internetPenetration: 78,
    easeOfBiz: 6,
    opsComplexity: 6,
    stemAwareness: 6,
    supplementaryLearning: 5,
    avgCPC: 1.1,
  },
  {
    country: "Brazil",
    gdpPerCapita: 8918,
    saasCustomers_M: 22,
    propensityToPayEdu: 5,
    kids_M: 45.0,
    avgKidPerHouse: 2.2,
    englishProficiency: 3,
    internetPenetration: 81,
    easeOfBiz: 5,
    opsComplexity: 5,
    stemAwareness: 6,
    supplementaryLearning: 5,
    avgCPC: 1.0,
  },
];

const headerTooltips: Record<string, string> = {
  Rank: "Position after applying weighted scores across all categories.",
  Country: "Country/market being evaluated.",
  "Final Score":
    "Weighted blend of Market Attractiveness, Operational Feasibility, and Education Affinity.",
  "Market Score":
    "Market Attractiveness: GDP per capita, SaaS adoption, education spend propensity, target households, English proficiency.",
  "Ops Score":
    "Operational Feasibility: broadband/internet penetration, ease of doing digital business, operational complexity.",
  "Affinity Score":
    "Education Affinity: STEM/AI awareness, supplementary learning culture, ad conversion readiness (lower CPC scores higher).",
  "GDP per Capita (1-10)":
    "Indicates ability to pay for premium education apps; normalized 1-10.",
  "SaaS customers (M)":
    "Number of people paying for SaaS services (in millions).",
  "Propensity to Pay Edu (1-10)":
    "Cultural/behavioral inclination to spend on after-school learning; rated 1-10.",
  "Kids 6–17 (M)":
    "Target kids population (6–17) in millions; defines addressable audience.",
  "Target households (M)":
    "Families likely to pay: kids divided by avg kids per household (millions).",
  "English Proficiency (1-10)":
    "Determines content scalability without translation; rated 1-10.",
  "Internet Penetration (1-10)":
    "Broadband speed/penetration enabling smooth AI learning; rated 1-10.",
  "Ease of Digital Biz (1-10)":
    "Payments, privacy, ad costs, and digital readiness; rated 1-10.",
  "Operational Complexity (1-10)":
    "Local laws, education regs, currency, and setup barriers; higher = easier; rated 1-10.",
  "STEM/AI Awareness (1-10)":
    "Curricular emphasis on AI/coding/robotics; rated 1-10.",
  "Supplementary Learning (1-10)":
    "Cultural attitude toward after-school tutoring/digital learning; rated 1-10.",
  "Ad CPC ($)":
    "Ad Conversion Readiness via avg CPC in $ for EdTech; lower CPC implies higher readiness.",
};

function HeaderWithTip({
  label,
}: {
  label: keyof typeof headerTooltips | string;
}): React.ReactElement {
  const tip = headerTooltips[label as keyof typeof headerTooltips] ?? "";
  return (
    <span className="relative z-10">
      <span className="tooltip tooltip-bottom z-50" data-tip={tip}>
        <span className="inline-flex items-center gap-1 align-middle">
          {label}
          <span className="text-gray-400">ⓘ</span>
        </span>
      </span>
    </span>
  );
}

export default function Page(): React.ReactElement {
  const [marketWeight, setMarketWeight] = useState<number>(40);
  const [opsWeight, setOpsWeight] = useState<number>(20);
  const [affinityWeight, setAffinityWeight] = useState<number>(40);
  const [sortBy, setSortBy] = useState<
    | "finalScore"
    | "marketScore"
    | "opsScore"
    | "affinityScore"
    | "gdp_10"
    | "saasCustomers_M"
    | "propensityToPayEdu"
    | "kids_M"
    | "targetHouseholds_M"
    | "englishProficiency"
    | "internet_10"
    | "easeOfBiz"
    | "opsComplexity"
    | "stemAwareness"
    | "supplementaryLearning"
    | "avgCPC"
  >("finalScore");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [compactView, setCompactView] = useState<boolean>(false);
  const [showDeepDive, setShowDeepDive] = useState<boolean>(false);
  const [isEqualWeights, setIsEqualWeights] = useState<boolean>(false);
  const [excludedIds, setExcludedIds] = useState<string[]>([
    "new-zealand",
    "mexico",
    "brazil",
    "france",
    "singapore",
    "vietnam",
    "thailand",
    "germany",
  ]);
  const [showHidePanel, setShowHidePanel] = useState<boolean>(false);

  const bubbleRef = useRef<HTMLCanvasElement | null>(null);
  const radarRef = useRef<HTMLCanvasElement | null>(null);
  const bubbleChartRef = useRef<Chart | null>(null);
  const radarChartRef = useRef<Chart | null>(null);
  const hidePanelRef = useRef<HTMLDivElement | null>(null);

  interface CountryDataset
    extends ChartDataset<"bubble", Array<{ x: number; y: number; r: number }>> {
    countryId: string;
  }

  const processed: CountryProcessed[] = useMemo(() => {
    const maxGDP = Math.max(...rawData.map((c) => c.gdpPerCapita));
    const minGDP = Math.min(...rawData.map((c) => c.gdpPerCapita));
    const maxSaaS = Math.max(...rawData.map((c) => c.saasCustomers_M));
    const minSaaS = Math.min(...rawData.map((c) => c.saasCustomers_M));
    const maxKids = Math.max(...rawData.map((c) => c.kids_M));
    const minKids = Math.min(...rawData.map((c) => c.kids_M));
    const maxCPC = Math.max(...rawData.map((c) => c.avgCPC));
    const minCPC = Math.min(...rawData.map((c) => c.avgCPC));

    const householdsValues = rawData.map((c) => c.kids_M / c.avgKidPerHouse);
    const maxHouseholds = Math.max(...householdsValues);
    const minHouseholds = Math.min(...householdsValues);

    const withDerived: CountryProcessed[] = rawData.map((c) => {
      const targetHouseholds = c.kids_M / c.avgKidPerHouse;
      const gdp_10 = normalizeToTen(c.gdpPerCapita, minGDP, maxGDP);
      const saas_10 = normalizeToTen(c.saasCustomers_M, minSaaS, maxSaaS);
      const kids_10 = normalizeToTen(c.kids_M, minKids, maxKids);
      const households_10 = normalizeToTen(
        targetHouseholds,
        minHouseholds,
        maxHouseholds
      );
      const cpc_10 = 11 - normalizeToTen(c.avgCPC, minCPC, maxCPC);
      const internet_10 = c.internetPenetration / 10;

      // category scores
      const marketScore =
        (gdp_10 +
          saas_10 +
          c.propensityToPayEdu +
          households_10 +
          c.englishProficiency) /
        5;
      const opsScore = (internet_10 + c.easeOfBiz + c.opsComplexity) / 3;
      const affinityScore =
        (c.stemAwareness + c.supplementaryLearning + cpc_10) / 3;

      const total = marketWeight + opsWeight + affinityWeight || 100;
      const wMarket = marketWeight / total;
      const wOps = opsWeight / total;
      const wAffinity = affinityWeight / total;
      const finalScore =
        marketScore * wMarket + opsScore * wOps + affinityScore * wAffinity;

      return {
        ...c,
        id: c.country.toLowerCase().replace(/ /g, "-"),
        rank: 0,
        targetHouseholds_M: targetHouseholds,
        gdp_10,
        saas_10,
        kids_10,
        households_10,
        cpc_10,
        internet_10,
        marketScore,
        opsScore,
        affinityScore,
        finalScore,
      };
    });

    const sorted = [...withDerived].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      const av = (a as any)[sortBy];
      const bv = (b as any)[sortBy];
      if (av === undefined || bv === undefined) return 0;
      if (typeof av === "number" && typeof bv === "number") {
        return dir * (av - bv);
      }
      return dir * String(av).localeCompare(String(bv));
    });
    sorted.forEach((c, i) => (c.rank = i + 1));
    return sorted;
  }, [marketWeight, opsWeight, affinityWeight, sortBy, sortDir]);

  const displayData: CountryProcessed[] = useMemo(() => {
    const visible =
      excludedIds.length === 0
        ? processed
        : processed.filter((c) => !excludedIds.includes(c.id));
    // Re-number ranks for the visible subset
    return visible.map((c, idx) => ({ ...c, rank: idx + 1 }));
  }, [processed, excludedIds]);

  const totalVisibleHouseholds: number = useMemo(() => {
    return displayData.reduce(
      (sum, c) => sum + c.targetHouseholds_M * 1_000_000,
      0
    );
  }, [displayData]);

  useEffect(() => {
    if (!bubbleRef.current) return;

    const ctx = bubbleRef.current.getContext("2d");
    if (!ctx) return;

    if (bubbleChartRef.current) {
      bubbleChartRef.current.destroy();
    }

    bubbleChartRef.current = new Chart(ctx, {
      type: "bubble",
      data: {
        datasets: displayData.map((c) => {
          const dataset: CountryDataset = {
            label: c.country,
            data: [
              {
                x: c.marketScore,
                y: c.affinityScore,
                r: Math.max(5, Math.sqrt(c.kids_M) / 1.5),
              },
            ],
            backgroundColor:
              c.id === selectedId
                ? "rgba(79, 70, 229, 0.8)"
                : "rgba(129, 140, 248, 0.6)",
            borderColor:
              c.id === selectedId
                ? "rgba(79, 70, 229, 1)"
                : "rgba(129, 140, 248, 1)",
            borderWidth: 1,
            countryId: c.id,
          };
          return dataset;
        }),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const d = context.dataset.data[0] as unknown as {
                  x: number;
                  y: number;
                };
                const country = displayData[context.datasetIndex];
                return `${country.country}: (Market: ${d.x.toFixed(
                  1
                )}, Affinity: ${d.y.toFixed(1)}, Kids: ${country.kids_M}M)`;
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Market Attractiveness Score (1-10)",
            },
            min: 0,
            max: 10,
          },
          y: {
            title: { display: true, text: "Education Affinity Score (1-10)" },
            min: 0,
            max: 10,
          },
        },
        onClick: (e, elements, chart) => {
          if (elements.length > 0) {
            const datasetIndex = elements[0].datasetIndex;
            const ds = chart.data.datasets[
              datasetIndex
            ] as unknown as CountryDataset;
            const countryId = ds.countryId;
            setSelectedId(countryId);
          }
        },
      },
    });

    return () => {
      bubbleChartRef.current?.destroy();
    };
  }, [displayData, selectedId]);

  const selected = useMemo(() => {
    const source = displayData;
    return selectedId
      ? source.find((c) => c.id === selectedId) ?? source[0]
      : source[0];
  }, [displayData, selectedId]);

  useEffect(() => {
    if (!radarRef.current || !selected) return;
    const ctx = radarRef.current.getContext("2d");
    if (!ctx) return;
    if (radarChartRef.current) radarChartRef.current.destroy();

    radarChartRef.current = new Chart(ctx, {
      type: "radar",
      data: {
        labels: [
          "Market Attractiveness",
          "Operational Feasibility",
          "Education Affinity",
        ],
        datasets: [
          {
            label: selected.country,
            data: [
              selected.marketScore,
              selected.opsScore,
              selected.affinityScore,
            ],
            fill: true,
            backgroundColor: "rgba(79, 70, 229, 0.2)",
            borderColor: "rgba(79, 70, 229, 1)",
            pointBackgroundColor: "rgba(79, 70, 229, 1)",
            pointBorderColor: "#fff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { r: { beginAtZero: true, max: 10, ticks: { stepSize: 2 } } },
      },
    });

    return () => radarChartRef.current?.destroy();
  }, [selected]);

  useEffect(() => {
    if (!selectedId && displayData.length > 0) {
      setSelectedId(displayData[0].id);
    }
  }, [displayData, selectedId]);

  useEffect(() => {
    // If currently selected item becomes excluded, move selection to first visible
    if (selectedId && excludedIds.includes(selectedId)) {
      if (displayData.length > 0) setSelectedId(displayData[0].id);
      else setSelectedId(null);
    }
  }, [excludedIds, selectedId, displayData]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        hidePanelRef.current &&
        !hidePanelRef.current.contains(event.target as Node)
      ) {
        setShowHidePanel(false);
      }
    }

    if (showHidePanel) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showHidePanel]);

  const totalWeight = marketWeight + opsWeight + affinityWeight || 100;
  const marketPct = (marketWeight / totalWeight) * 100;
  const opsPct = (opsWeight / totalWeight) * 100;
  const affinityPct = (affinityWeight / totalWeight) * 100;

  return (
    <div className=" mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-orange-700 mb-2">
          AI Tutor Market Prioritization
        </h1>
        <p className="text-lg text-gray-600 max-w-4xl">
          This interactive report analyzes 18 potential markets for the AI tutor
          product. It uses a weighted scoring model based on your criteria to
          provide a strategic ranking. Use the controls to adjust weights and
          explore the data to find the best market to enter first.
        </p>
      </header>

      <section className="mb-8 p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Strategic Weighting Controls
        </h2>
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={() => {
              if (isEqualWeights) {
                setMarketWeight(40);
                setOpsWeight(20);
                setAffinityWeight(40);
              } else {
                setMarketWeight(33);
                setOpsWeight(33);
                setAffinityWeight(33);
              }
              setIsEqualWeights(!isEqualWeights);
            }}
            className="btn btn-sm btn-outline"
          >
            {isEqualWeights ? "Set to 4-2-4" : "Set to 33%"}
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Adjust the importance of each category to see how the rankings change
          based on different strategic priorities. The scores will update in
          real-time.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="marketWeight"
              className="block text-sm font-medium text-gray-700"
            >
              Market Attractiveness (<span>{marketPct.toFixed(2)}</span>%)
            </label>
            <input
              id="marketWeight"
              type="range"
              min={0}
              max={100}
              value={marketWeight}
              onChange={(e) => setMarketWeight(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
          </div>
          <div>
            <label
              htmlFor="opsWeight"
              className="block text-sm font-medium text-gray-700"
            >
              Operational Feasibility (<span>{opsPct.toFixed(2)}</span>%)
            </label>
            <input
              id="opsWeight"
              type="range"
              min={0}
              max={100}
              value={opsWeight}
              onChange={(e) => setOpsWeight(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
          </div>
          <div>
            <label
              htmlFor="affinityWeight"
              className="block text-sm font-medium text-gray-700"
            >
              Education Affinity (<span>{affinityPct.toFixed(2)}</span>%)
            </label>
            <input
              id="affinityWeight"
              type="range"
              min={0}
              max={100}
              value={affinityWeight}
              onChange={(e) => setAffinityWeight(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
          </div>
        </div>
      </section>

      <main
        className={`grid grid-cols-1 gap-8 ${
          showDeepDive ? "lg:grid-cols-3" : ""
        }`}
      >
        <div className={`${showDeepDive ? "lg:col-span-2" : ""} space-y-8`}>
          <section className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Prioritized Market Rankings
                </h2>
                <p className="text-gray-600 mt-1">
                  The complete list of countries, ranked by the weighted score.
                  Click any row for details.
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowDeepDive((v) => !v)}
                  className="btn btn-sm btn-outline"
                >
                  {showDeepDive ? "<" : ">"}
                </button>
                <div className="relative" ref={hidePanelRef}>
                  <button
                    type="button"
                    onClick={() => setShowHidePanel((v) => !v)}
                    className="btn btn-sm btn-outline"
                  >
                    {showHidePanel ? "Close" : "Hide countries"}
                  </button>
                  {showHidePanel && (
                    <div className="absolute right-0 z-50 mt-2 w-64 max-h-72 overflow-auto rounded-md border border-gray-200 bg-white shadow">
                      <div className="flex items-center justify-between p-2 border-b border-gray-200">
                        <span className="text-xs text-gray-600">
                          Exclude from view
                        </span>
                        <div className="space-x-2">
                          <button
                            type="button"
                            className="btn btn-xs"
                            onClick={() => setExcludedIds([])}
                          >
                            Show all
                          </button>
                        </div>
                      </div>
                      <ul className="p-2 space-y-1">
                        {processed.map((c) => (
                          <li
                            key={c.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <input
                              id={`ex-${c.id}`}
                              type="checkbox"
                              className="checkbox checkbox-sm"
                              checked={excludedIds.includes(c.id)}
                              onChange={(e) => {
                                setExcludedIds((prev) =>
                                  e.target.checked
                                    ? [...prev, c.id]
                                    : prev.filter((id) => id !== c.id)
                                );
                              }}
                            />
                            <label
                              htmlFor={`ex-${c.id}`}
                              className="cursor-pointer select-none"
                            >
                              {c.country}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setCompactView((v) => !v)}
                  className="btn btn-sm btn-outline"
                >
                  {compactView
                    ? "Show detailed columns"
                    : "Show summary columns"}
                </button>
                <label htmlFor="sortBy" className="sr-only">
                  Sort By
                </label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as any);
                    setSortDir("desc");
                  }}
                  className="block w-full sm:w-auto p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="finalScore">Sort by: Final Rank</option>
                  <option value="marketScore">
                    Sort by: Market Attractiveness
                  </option>
                  <option value="opsScore">
                    Sort by: Operational Feasibility
                  </option>
                  <option value="affinityScore">
                    Sort by: Education Affinity
                  </option>
                </select>
              </div>
            </div>
            <div className="mt-2 mb-2 text-sm text-gray-700">
              <span className="font-medium">
                Total target households (visible):{" "}
              </span>
              {Math.round(totalVisibleHouseholds).toLocaleString()}
            </div>
            <div className="overflow-x-auto overflow-y-visible">
              <table className="min-w-full divide-y divide-gray-200">
                {compactView ? (
                  <thead className="bg-gray-50 relative z-10">
                    <tr>
                      <th
                        className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 border border-gray-300`}
                      >
                        <HeaderWithTip label="Rank" />
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 border border-gray-300`}
                      >
                        <HeaderWithTip label="Country" />
                      </th>
                      <th
                        role="button"
                        onClick={() => {
                          setSortDir(
                            sortBy === "finalScore"
                              ? sortDir === "asc"
                                ? "desc"
                                : "asc"
                              : "desc"
                          );
                          setSortBy("finalScore");
                        }}
                        aria-sort={
                          sortBy === "finalScore"
                            ? sortDir === "asc"
                              ? "ascending"
                              : "descending"
                            : "none"
                        }
                        className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider cursor-pointer select-none border border-gray-300 ${
                          sortBy === "finalScore"
                            ? "text-orange-700"
                            : "text-gray-500"
                        }`}
                      >
                        <span className="inline-flex items-center gap-1">
                          <HeaderWithTip label="Final Score" />
                          {sortBy === "finalScore" && (
                            <span aria-hidden className="text-gray-500">
                              {sortDir === "asc" ? "▼" : "▲"}
                            </span>
                          )}
                        </span>
                      </th>
                      <th
                        role="button"
                        onClick={() => {
                          setSortDir(
                            sortBy === "marketScore"
                              ? sortDir === "asc"
                                ? "desc"
                                : "asc"
                              : "desc"
                          );
                          setSortBy("marketScore");
                        }}
                        aria-sort={
                          sortBy === "marketScore"
                            ? sortDir === "asc"
                              ? "ascending"
                              : "descending"
                            : "none"
                        }
                        className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider cursor-pointer select-none border border-gray-300 ${
                          sortBy === "marketScore"
                            ? "text-orange-700"
                            : "text-gray-500"
                        }`}
                      >
                        <span className="inline-flex items-center gap-1">
                          <HeaderWithTip label="Market Score" />
                          {sortBy === "marketScore" && (
                            <span aria-hidden className="text-gray-500">
                              {sortDir === "asc" ? "▼" : "▲"}
                            </span>
                          )}
                        </span>
                      </th>
                      <th
                        role="button"
                        onClick={() => {
                          setSortDir(
                            sortBy === "opsScore"
                              ? sortDir === "asc"
                                ? "desc"
                                : "asc"
                              : "desc"
                          );
                          setSortBy("opsScore");
                        }}
                        aria-sort={
                          sortBy === "opsScore"
                            ? sortDir === "asc"
                              ? "ascending"
                              : "descending"
                            : "none"
                        }
                        className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider cursor-pointer select-none border border-gray-300 ${
                          sortBy === "opsScore"
                            ? "text-orange-700"
                            : "text-gray-500"
                        }`}
                      >
                        <span className="inline-flex items-center gap-1">
                          <HeaderWithTip label="Ops Score" />
                          {sortBy === "opsScore" && (
                            <span aria-hidden className="text-gray-500">
                              {sortDir === "asc" ? "▼" : "▲"}
                            </span>
                          )}
                        </span>
                      </th>
                      <th
                        role="button"
                        onClick={() => {
                          setSortDir(
                            sortBy === "affinityScore"
                              ? sortDir === "asc"
                                ? "desc"
                                : "asc"
                              : "desc"
                          );
                          setSortBy("affinityScore");
                        }}
                        aria-sort={
                          sortBy === "affinityScore"
                            ? sortDir === "asc"
                              ? "ascending"
                              : "descending"
                            : "none"
                        }
                        className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider cursor-pointer select-none border border-gray-300 ${
                          sortBy === "affinityScore"
                            ? "text-orange-700"
                            : "text-gray-500"
                        }`}
                      >
                        <span className="inline-flex items-center gap-1">
                          <HeaderWithTip label="Affinity Score" />
                          {sortBy === "affinityScore" && (
                            <span aria-hidden className="text-gray-500">
                              {sortDir === "asc" ? "▼" : "▲"}
                            </span>
                          )}
                        </span>
                      </th>
                    </tr>
                  </thead>
                ) : (
                  <thead className="bg-gray-50 relative z-10">
                    <tr>
                      <th
                        className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider whitespace-nowrap text-gray-500 border border-gray-300`}
                      >
                        <HeaderWithTip label="Rank" />
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap text-gray-500 border border-gray-300`}
                      >
                        <HeaderWithTip label="Country" />
                      </th>
                      {[
                        ["gdp_10", "GDP per Capita (1-10)", "desc"],
                        ["saasCustomers_M", "SaaS customers (M)", "desc"],
                        [
                          "propensityToPayEdu",
                          "Propensity to Pay Edu (1-10)",
                          "desc",
                        ],
                        ["kids_M", "Kids 6–17 (M)", "desc"],
                        ["targetHouseholds_M", "Target households (M)", "desc"],
                        [
                          "englishProficiency",
                          "English Proficiency (1-10)",
                          "desc",
                        ],
                        ["internet_10", "Internet Penetration (1-10)", "desc"],
                        ["easeOfBiz", "Ease of Digital Biz (1-10)", "desc"],
                        [
                          "opsComplexity",
                          "Operational Complexity (1-10)",
                          "desc",
                        ],
                        ["stemAwareness", "STEM/AI Awareness (1-10)", "desc"],
                        [
                          "supplementaryLearning",
                          "Supplementary Learning (1-10)",
                          "desc",
                        ],
                        ["avgCPC", "Ad CPC ($)", "asc"],
                      ].map(([key, label, defDir]) => (
                        <th
                          key={key as string}
                          role="button"
                          onClick={() => {
                            if (sortBy === (key as string)) {
                              setSortDir(sortDir === "asc" ? "desc" : "asc");
                            } else {
                              setSortDir(defDir as "asc" | "desc");
                              setSortBy(key as any);
                            }
                          }}
                          aria-sort={
                            sortBy === (key as string)
                              ? sortDir === "asc"
                                ? "ascending"
                                : "descending"
                              : "none"
                          }
                          className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider whitespace-nowrap cursor-pointer select-none border border-gray-300 ${
                            sortBy === (key as string)
                              ? "text-orange-700"
                              : "text-gray-500"
                          }`}
                        >
                          <span className="inline-flex items-center gap-1">
                            <HeaderWithTip label={label as string} />
                            {sortBy === (key as string) && (
                              <span aria-hidden className="text-gray-500">
                                {sortDir === "asc" ? "▼" : "▲"}
                              </span>
                            )}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayData.map((c) => (
                    <tr
                      key={c.id}
                      className={`cursor-pointer hover:bg-gray-100 ${
                        c.id === selectedId ? "bg-orange-50" : ""
                      }`}
                      onClick={() => setSelectedId(c.id)}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-center border border-gray-300">
                        <span
                          className={`text-lg font-bold ${
                            c.rank <= 3 ? "text-orange-600" : "text-gray-700"
                          }`}
                        >
                          {c.rank}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-left border border-gray-300">
                        <span className="text-base font-medium text-gray-900">
                          {c.country}
                        </span>
                      </td>
                      {compactView ? (
                        <>
                          <td className="px-4 py-3 whitespace-nowrap text-center border border-gray-300">
                            <span className="text-base font-semibold text-gray-800">
                              {c.finalScore.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center border border-gray-300">
                            <span className="text-sm text-gray-800">
                              {c.marketScore.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center border border-gray-300">
                            <span className="text-sm text-gray-800">
                              {c.opsScore.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center border border-gray-300">
                            <span className="text-sm text-gray-800">
                              {c.affinityScore.toFixed(2)}
                            </span>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3 whitespace-nowrap text-center border border-gray-300">
                            <span className="text-sm text-gray-800">
                              {c.gdp_10.toFixed(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center border border-gray-300">
                            <span className="text-sm text-gray-800">
                              {c.saasCustomers_M}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center border border-gray-300">
                            <span className="text-sm text-gray-800">
                              {c.propensityToPayEdu}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center border border-gray-300">
                            <span className="text-sm text-gray-800">
                              {c.kids_M.toFixed(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center border border-gray-300">
                            <span className="text-sm text-gray-800">
                              {c.targetHouseholds_M.toFixed(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center border border-gray-300">
                            <span className="text-sm text-gray-800">
                              {c.englishProficiency}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center border border-gray-300">
                            <span className="text-sm text-gray-800">
                              {c.internet_10.toFixed(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center border border-gray-300">
                            <span className="text-sm text-gray-800">
                              {c.easeOfBiz}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center border border-gray-300">
                            <span className="text-sm text-gray-800">
                              {c.opsComplexity}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center border border-gray-300">
                            <span className="text-sm text-gray-800">
                              {c.stemAwareness}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center border border-gray-300">
                            <span className="text-sm text-gray-800">
                              {c.supplementaryLearning}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center border border-gray-300">
                            <span className="text-sm text-gray-800">
                              ${c.avgCPC.toFixed(2)}
                            </span>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Revenue Sizing (Annual)
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {(() => {
                  const householdsM = totalVisibleHouseholds / 1_000_000;
                  const formattedM = householdsM.toFixed(1);
                  return (
                    <>
                      Calculated using target households (number {formattedM}M)
                      × $30 × 12. SAM assumes 30% of TAM and SOM assumes 10% of
                      TAM.
                    </>
                  );
                })()}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(() => {
                  const pricePerMonth = 30;
                  const monthsPerYear = 12;
                  const samPenetration = 0.3; // 30% of TAM
                  const somPenetration = 0.1; // 10% of TAM
                  const households = totalVisibleHouseholds; // absolute number
                  const tam = households * pricePerMonth * monthsPerYear;
                  const sam = tam * samPenetration;
                  const som = tam * somPenetration;
                  const formatCurrency = (n: number) =>
                    n >= 1_000_000_000
                      ? `$${(n / 1_000_000_000).toFixed(2)}B`
                      : n >= 1_000_000
                      ? `$${(n / 1_000_000).toFixed(2)}M`
                      : `$${Math.round(n).toLocaleString()}`;
                  return (
                    <>
                      <div className="card border border-gray-200 bg-white">
                        <div className="card-body p-4">
                          <div className="text-xs uppercase text-gray-500">
                            TAM
                          </div>
                          <div className="text-2xl font-bold text-gray-900">
                            {formatCurrency(tam)}
                          </div>
                          <div className="text-xs text-gray-500">
                            100% of visible target households
                          </div>
                        </div>
                      </div>
                      <div className="card border border-gray-200 bg-white">
                        <div className="card-body p-4">
                          <div className="text-xs uppercase text-gray-500">
                            SAM
                          </div>
                          <div className="text-2xl font-bold text-gray-900">
                            {formatCurrency(sam)}
                          </div>
                          <div className="text-xs text-gray-500">
                            30% of TAM
                          </div>
                        </div>
                      </div>
                      <div className="card border border-gray-200 bg-white">
                        <div className="card-body p-4">
                          <div className="text-xs uppercase text-gray-500">
                            SOM
                          </div>
                          <div className="text-2xl font-bold text-gray-900">
                            {formatCurrency(som)}
                          </div>
                          <div className="text-xs text-gray-500">
                            10% of TAM
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </section>
        </div>

        {showDeepDive && (
          <aside className="lg:col-span-1">
            <section className="bg-white p-6 rounded-xl shadow-md sticky top-8">
              <h2 className="text-2xl font-semibold text-gray-800">
                Deep Dive:{" "}
                <span className="text-orange-600">
                  {selected?.country ?? ""}
                </span>
              </h2>
              <p className="text-gray-600 mb-4">
                This section shows the detailed profile for the selected
                country, including its scoring breakdown and raw data.
              </p>
              <div className="relative w-full h-[300px] max-h-[350px] max-w-[400px]">
                <canvas ref={radarRef} />
              </div>
              {selected && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">
                    Detailed Metrics
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between py-1 border-b">
                      <span className="font-medium text-gray-600">
                        Final Score:
                      </span>
                      <span className="font-bold text-lg text-orange-600">
                        {selected.finalScore.toFixed(2)}
                      </span>
                    </li>
                    <li className="flex justify-between py-1">
                      <span className="text-gray-600">GDP p.c. ($):</span>
                      <span className="font-medium text-gray-800">
                        {selected.gdpPerCapita.toLocaleString()}
                      </span>
                    </li>
                    <li className="flex justify-between py-1">
                      <span className="text-gray-600">SaaS Customers:</span>
                      <span className="font-medium text-gray-800">
                        {selected.saasCustomers_M} M
                      </span>
                    </li>
                    <li className="flex justify-between py-1">
                      <span className="text-gray-600">
                        Propensity to Pay Edu:
                      </span>
                      <span className="font-medium text-gray-800">
                        {selected.propensityToPayEdu} / 10
                      </span>
                    </li>
                    <li className="flex justify-between py-1">
                      <span className="text-gray-600">Kids (6-17):</span>
                      <span className="font-medium text-gray-800">
                        {selected.kids_M.toFixed(1)} M
                      </span>
                    </li>
                    <li className="flex justify-between py-1">
                      <span className="text-gray-600">Target Households:</span>
                      <span className="font-medium text-gray-800">
                        {selected.targetHouseholds_M.toFixed(1)} M
                      </span>
                    </li>
                    <li className="flex justify-between py-1">
                      <span className="text-gray-600">
                        English Proficiency:
                      </span>
                      <span className="font-medium text-gray-800">
                        {selected.englishProficiency} / 10
                      </span>
                    </li>
                    <li className="flex justify-between py-1">
                      <span className="text-gray-600">Internet Speed/Pen:</span>
                      <span className="font-medium text-gray-800">
                        {selected.internet_10.toFixed(1)} / 10
                      </span>
                    </li>
                    <li className="flex justify-between py-1">
                      <span className="text-gray-600">
                        Ease of Digital Biz:
                      </span>
                      <span className="font-medium text-gray-800">
                        {selected.easeOfBiz} / 10
                      </span>
                    </li>
                    <li className="flex justify-between py-1">
                      <span className="text-gray-600">
                        Ops Complexity (Easy):
                      </span>
                      <span className="font-medium text-gray-800">
                        {selected.opsComplexity} / 10
                      </span>
                    </li>
                    <li className="flex justify-between py-1">
                      <span className="text-gray-600">STEM/AI Awareness:</span>
                      <span className="font-medium text-gray-800">
                        {selected.stemAwareness} / 10
                      </span>
                    </li>
                    <li className="flex justify-between py-1">
                      <span className="text-gray-600">
                        Supp. Learning Attitude:
                      </span>
                      <span className="font-medium text-gray-800">
                        {selected.supplementaryLearning} / 10
                      </span>
                    </li>
                    <li className="flex justify-between py-1">
                      <span className="text-gray-600">
                        Avg. EdTech CPC ($):
                      </span>
                      <span className="font-medium text-gray-800">
                        ${selected.avgCPC.toFixed(2)}
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </section>
          </aside>
        )}
      </main>
    </div>
  );
}

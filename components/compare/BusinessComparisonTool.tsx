"use client";

import { useMemo, useState } from "react";
import { Award, CheckCircle2, Columns3, Star, Trophy } from "lucide-react";
import type { ComparedBusiness } from "@/lib/compare";

type BusinessComparisonToolProps = {
  category: string;
  criteria: string[];
  businesses: ComparedBusiness[];
};

type ScoreBreakdown = {
  total: number;
  proof: number;
  rating: number;
  rank: number;
  specialty: number;
  price: number;
};

function scorePrice(price: string) {
  const normalized = price.toLowerCase();

  if (normalized.includes("budget") || normalized.includes("value")) {
    return 9;
  }

  if (normalized.includes("mid")) {
    return 8;
  }

  if (normalized.includes("premium")) {
    return 6.8;
  }

  const numericPrice = Number.parseInt(price.replace(/[^\d]/g, ""), 10);

  if (Number.isNaN(numericPrice)) {
    return 7.4;
  }

  if (numericPrice <= 5) {
    return 9;
  }

  if (numericPrice <= 20) {
    return 8;
  }

  if (numericPrice <= 60) {
    return 7.4;
  }

  return 6.8;
}

function scoreBusiness(business: ComparedBusiness): ScoreBreakdown {
  const rating = business.rating * 20;
  const proof = Math.min(18, Math.log10(Math.max(business.reviews, 1)) * 7);
  const rank = Math.max(0, 14 - business.rank * 1.6);
  const specialty = Math.min(16, business.strengths.length * 4 + business.bestFor.length / 36);
  const price = scorePrice(business.price);
  const total = rating + proof + rank + specialty + price;

  return { total, proof, rating, rank, specialty, price };
}

function includesCriterion(business: ComparedBusiness, criterion: string) {
  const normalizedCriterion = criterion.toLowerCase();
  const text = [business.bestFor, business.verdict, business.price, business.area, ...business.strengths]
    .join(" ")
    .toLowerCase();

  return normalizedCriterion
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .some((word) => text.includes(word));
}

function formatScore(score: number) {
  return `${Math.round(score)}/150`;
}

export function BusinessComparisonTool({ category, criteria, businesses }: BusinessComparisonToolProps) {
  const initialSelection = useMemo(() => businesses.slice(0, Math.min(3, businesses.length)).map((business) => business.name), [businesses]);
  const [selectedNames, setSelectedNames] = useState(initialSelection);

  const selectedBusinesses = businesses.filter((business) => selectedNames.includes(business.name));
  const scoredBusinesses = useMemo(
    () =>
      selectedBusinesses
        .map((business) => ({ business, score: scoreBusiness(business) }))
        .sort((a, b) => b.score.total - a.score.total),
    [selectedBusinesses]
  );
  const winner = scoredBusinesses[0];
  const enoughSelected = selectedBusinesses.length >= 2;

  function toggleBusiness(name: string) {
    setSelectedNames((current) => {
      if (current.includes(name)) {
        return current.length === 1 ? current : current.filter((selected) => selected !== name);
      }

      return [...current, name];
    });
  }

  function selectTopRated() {
    setSelectedNames(
      [...businesses]
        .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
        .slice(0, 4)
        .map((business) => business.name)
    );
  }

  function selectBestValue() {
    setSelectedNames(
      [...businesses]
        .sort((a, b) => scorePrice(b.price) - scorePrice(a.price) || b.rating - a.rating)
        .slice(0, 4)
        .map((business) => business.name)
    );
  }

  function selectAll() {
    setSelectedNames(businesses.map((business) => business.name));
  }

  return (
    <section className="section section--soft compare-builder" aria-labelledby="compare-builder-title">
      <div className="container">
        <div className="compare-builder__header">
          <div>
            <span className="eyebrow">Interactive comparison</span>
            <h2 className="compact-title" id="compare-builder-title">
              Select multiple {category.toLowerCase()} businesses and compare specialties
            </h2>
            <p className="compact-copy">
              Pick two or more businesses to compare ratings, review proof, price position, strengths, contact details and best-fit use cases side by side.
            </p>
          </div>
          <div className="compare-builder__actions" aria-label="Quick selection tools">
            <button className="button button--outline" type="button" onClick={selectTopRated}>
              <Star size={16} aria-hidden />
              Top rated
            </button>
            <button className="button button--outline" type="button" onClick={selectBestValue}>
              <Award size={16} aria-hidden />
              Best value
            </button>
            <button className="button button--dark" type="button" onClick={selectAll}>
              <Columns3 size={16} aria-hidden />
              Compare all
            </button>
          </div>
        </div>

        <div className="compare-selector" role="list" aria-label={`${category} business options`}>
          {businesses.map((business) => {
            const isSelected = selectedNames.includes(business.name);

            return (
              <button
                aria-pressed={isSelected}
                className={isSelected ? "compare-selector__option is-selected" : "compare-selector__option"}
                key={business.name}
                onClick={() => toggleBusiness(business.name)}
                type="button"
              >
                <span className="compare-selector__rank">#{business.rank}</span>
                <span>
                  <strong>{business.name}</strong>
                  <small>
                    {business.area} · {business.rating}/5 · {business.price}
                  </small>
                </span>
                <CheckCircle2 size={17} aria-hidden />
              </button>
            );
          })}
        </div>

        {winner ? (
          <div className="compare-winner" aria-live="polite">
            <div className="compare-winner__badge">
              <Trophy size={18} aria-hidden />
              Best from selected
            </div>
            <div>
              <h3>{winner.business.name}</h3>
              <p>
                Best overall score for this selected set: {formatScore(winner.score.total)}. It performs strongest on rating, review proof, specialty coverage and fit for {winner.business.bestFor.toLowerCase()}.
              </p>
            </div>
          </div>
        ) : null}

        {!enoughSelected ? (
          <p className="compare-builder__notice">Select at least two businesses to make the comparison meaningful.</p>
        ) : null}

        <div className="responsive-table compare-matrix-wrap">
          <table className="compare-table compare-matrix">
            <thead>
              <tr>
                <th>Specialty / signal</th>
                {selectedBusinesses.map((business) => (
                  <th key={business.name}>{business.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Overall score</td>
                {selectedBusinesses.map((business) => (
                  <td key={business.name}>{formatScore(scoreBusiness(business).total)}</td>
                ))}
              </tr>
              <tr>
                <td>Rating and review proof</td>
                {selectedBusinesses.map((business) => (
                  <td key={business.name}>
                    {business.rating}/5 from {business.reviews} reviews
                  </td>
                ))}
              </tr>
              <tr>
                <td>Best for</td>
                {selectedBusinesses.map((business) => (
                  <td key={business.name}>{business.bestFor}</td>
                ))}
              </tr>
              <tr>
                <td>Price position</td>
                {selectedBusinesses.map((business) => (
                  <td key={business.name}>{business.price}</td>
                ))}
              </tr>
              {criteria.map((criterion) => {
                const criterionWinner = scoredBusinesses.find(({ business }) => includesCriterion(business, criterion)) ?? winner;

                return (
                  <tr key={criterion}>
                    <td>{criterion}</td>
                    {selectedBusinesses.map((business) => {
                      const isBest = criterionWinner?.business.name === business.name;

                      return (
                        <td className={isBest ? "is-best-cell" : undefined} key={business.name}>
                          {includesCriterion(business, criterion) ? "Strong match" : "Secondary fit"}
                          {isBest ? <span>Best</span> : null}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              <tr>
                <td>Specialties</td>
                {selectedBusinesses.map((business) => (
                  <td key={business.name}>{business.strengths.join(", ")}</td>
                ))}
              </tr>
              <tr>
                <td>Contact</td>
                {selectedBusinesses.map((business) => (
                  <td key={business.name}>{business.phone}</td>
                ))}
              </tr>
              <tr>
                <td>Verdict</td>
                {selectedBusinesses.map((business) => (
                  <td key={business.name}>{business.verdict}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

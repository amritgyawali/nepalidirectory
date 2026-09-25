"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftRight, Minus, Trophy } from "lucide-react";
import "./head-to-head.css";

export type HeadToHeadContender = {
  name: string;
  area: string;
  note: string;
  scores: number[];
  href?: string;
};

type HeadToHeadCompareProps = {
  category: string;
  conditions: string[];
  contenders: HeadToHeadContender[];
  reviewedAt: string;
};

type Side = "left" | "right";
type RowWinner = Side | "tie";

function tally(left: HeadToHeadContender, right: HeadToHeadContender, conditionCount: number) {
  const rows: RowWinner[] = [];
  let leftPoints = 0;
  let rightPoints = 0;
  let leftTotal = 0;
  let rightTotal = 0;

  for (let index = 0; index < conditionCount; index += 1) {
    const l = left.scores[index] ?? 0;
    const r = right.scores[index] ?? 0;
    leftTotal += l;
    rightTotal += r;
    if (l > r) {
      leftPoints += 1;
      rows.push("left");
    } else if (r > l) {
      rightPoints += 1;
      rows.push("right");
    } else {
      rows.push("tie");
    }
  }

  // More row wins decides the match; the summed score only breaks an exact points tie.
  let winner: RowWinner = "tie";
  if (leftPoints !== rightPoints) winner = leftPoints > rightPoints ? "left" : "right";
  else if (leftTotal !== rightTotal) winner = leftTotal > rightTotal ? "left" : "right";

  return { rows, leftPoints, rightPoints, ties: conditionCount - leftPoints - rightPoints, leftTotal, rightTotal, winner };
}

export function HeadToHeadCompare({ category, conditions, contenders, reviewedAt }: HeadToHeadCompareProps) {
  const [picked, setPicked] = useState<Record<Side, number>>({ left: 0, right: Math.min(1, contenders.length - 1) });

  if (contenders.length < 2) return null;

  const left = contenders[picked.left];
  const right = contenders[picked.right];
  const result = tally(left, right, conditions.length);
  const winnerName = result.winner === "left" ? left.name : result.winner === "right" ? right.name : null;
  const decidedOnTotal = result.winner !== "tie" && result.leftPoints === result.rightPoints;
  const leftShare = result.leftPoints + result.rightPoints === 0
    ? 50
    : (result.leftPoints / (result.leftPoints + result.rightPoints)) * 100;

  function pick(side: Side, index: number) {
    setPicked((current) => {
      const other: Side = side === "left" ? "right" : "left";
      // Choosing the business already in the other corner swaps the two corners.
      if (current[other] === index) return { [side]: index, [other]: current[side] } as Record<Side, number>;
      return { ...current, [side]: index };
    });
  }

  function swap() {
    setPicked((current) => ({ left: current.right, right: current.left }));
  }

  const lowerCategory = category.toLowerCase();

  return (
    <section className="section h2h" aria-labelledby="h2h-title">
      <div className="container">
        <header className="h2h-header">
          <span className="eyebrow">Head-to-head comparison</span>
          <h2 className="compact-title" id="h2h-title">
            Put two {lowerCategory} side by side
          </h2>
          <p className="compact-copy">
            Choose one business for the left corner and one for the right from the top {contenders.length} below. Each of the{" "}
            {conditions.length} conditions awards a point to the higher score, and the business with more
            points wins.
          </p>
        </header>

        <div className="h2h-roster" role="list" aria-label={`Top ${contenders.length} ${lowerCategory}`}>
          {contenders.map((contender, index) => {
            const onLeft = picked.left === index;
            const onRight = picked.right === index;
            return (
              <div
                className={`h2h-roster__item${onLeft ? " is-left" : ""}${onRight ? " is-right" : ""}`}
                role="listitem"
                key={contender.name}
              >
                <span className="h2h-roster__rank">#{index + 1}</span>
                <span className="h2h-roster__name">{contender.name}</span>
                <span className="h2h-roster__actions">
                  <button
                    type="button"
                    className="h2h-pick h2h-pick--left"
                    aria-pressed={onLeft}
                    aria-label={`Put ${contender.name} on the left`}
                    onClick={() => pick("left", index)}
                  >
                    Left
                  </button>
                  <button
                    type="button"
                    className="h2h-pick h2h-pick--right"
                    aria-pressed={onRight}
                    aria-label={`Put ${contender.name} on the right`}
                    onClick={() => pick("right", index)}
                  >
                    Right
                  </button>
                </span>
              </div>
            );
          })}
        </div>

        <div className="h2h-arena">
          <SideCard
            side="left"
            contender={left}
            points={result.leftPoints}
            isWinner={result.winner === "left"}
            selectedIndex={picked.left}
            contenders={contenders}
            onPick={(index) => pick("left", index)}
          />
          <div className="h2h-vs">
            <span>VS</span>
            <button type="button" className="h2h-swap" onClick={swap} aria-label="Swap left and right">
              <ArrowLeftRight size={16} aria-hidden />
            </button>
          </div>
          <SideCard
            side="right"
            contender={right}
            points={result.rightPoints}
            isWinner={result.winner === "right"}
            selectedIndex={picked.right}
            contenders={contenders}
            onPick={(index) => pick("right", index)}
          />
        </div>

        <ol className="h2h-rows" aria-label={`${left.name} versus ${right.name}, condition by condition`}>
          {conditions.map((condition, index) => {
            const l = left.scores[index];
            const r = right.scores[index];
            const rowWinner = result.rows[index];
            return (
              <li className="h2h-row" data-winner={rowWinner} key={condition}>
                <div className="h2h-cell h2h-cell--left">
                  <span className="h2h-bar" aria-hidden>
                    <span style={{ width: `${l * 10}%` }} />
                  </span>
                  <strong>{l}</strong>
                </div>
                <div className="h2h-cond">
                  <span>{condition}</span>
                  <small>
                    {rowWinner === "tie" ? (
                      <>
                        <Minus size={12} aria-hidden /> Tie
                      </>
                    ) : (
                      <>
                        <Trophy size={12} aria-hidden /> {rowWinner === "left" ? left.name : right.name}
                      </>
                    )}
                  </small>
                </div>
                <div className="h2h-cell h2h-cell--right">
                  <strong>{r}</strong>
                  <span className="h2h-bar" aria-hidden>
                    <span style={{ width: `${r * 10}%` }} />
                  </span>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="h2h-final" role="status" aria-live="polite" data-winner={result.winner}>
          <Trophy size={28} aria-hidden />
          <div className="h2h-final__text">
            <span className="eyebrow">Final winner</span>
            <strong>{winnerName ?? "It's a draw"}</strong>
            <p>
              {left.name} {result.leftPoints} – {result.rightPoints} {right.name}
              {result.ties > 0 ? ` · ${result.ties} ${result.ties === 1 ? "tie" : "ties"}` : ""}
              {decidedOnTotal ? ` · decided on total score ${result.leftTotal}–${result.rightTotal}` : ""}
            </p>
          </div>
          <div className="h2h-final__bar" aria-hidden>
            <span style={{ width: `${leftShare}%` }} />
          </div>
        </div>

        <p className="h2h-note">
          Scores are 1–10 editorial estimates by Nepali Directory, compiled from public information such as
          official websites, OpenStreetMap and directory listings, and last reviewed on{" "}
          <time dateTime={reviewedAt}>{reviewedAt}</time>. They are not audits, paid placements or customer
          ratings. Confirm prices, availability and credentials directly before you book. Business owners can{" "}
          <Link href="/contact">request a correction</Link>.
        </p>
      </div>
    </section>
  );
}

type SideCardProps = {
  side: Side;
  contender: HeadToHeadContender;
  points: number;
  isWinner: boolean;
  selectedIndex: number;
  contenders: HeadToHeadContender[];
  onPick: (index: number) => void;
};

function SideCard({ side, contender, points, isWinner, selectedIndex, contenders, onPick }: SideCardProps) {
  const selectId = `h2h-select-${side}`;
  return (
    <div className={`h2h-side h2h-side--${side}${isWinner ? " is-winner" : ""}`}>
      <label className="h2h-side__label" htmlFor={selectId}>
        {side === "left" ? "Left corner" : "Right corner"}
      </label>
      <select id={selectId} value={selectedIndex} onChange={(event) => onPick(Number(event.target.value))}>
        {contenders.map((option, index) => (
          <option key={option.name} value={index}>
            #{index + 1} {option.name}
          </option>
        ))}
      </select>
      <h3>
        {contender.href ? <Link href={contender.href}>{contender.name}</Link> : contender.name}
      </h3>
      <p className="h2h-side__area">{contender.area}</p>
      <p className="h2h-side__note">{contender.note}</p>
      <div className="h2h-side__points">
        <strong>{points}</strong>
        <span>points</span>
        {isWinner ? (
          <em>
            <Trophy size={13} aria-hidden /> Winner
          </em>
        ) : null}
      </div>
    </div>
  );
}

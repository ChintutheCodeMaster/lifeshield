"use client";

export type MockAnswers = Record<string, unknown>;

function key(funnel: "f1" | "f2") {
  return `mintlife_mock_${funnel}`;
}

export function readAnswers(funnel: "f1" | "f2"): MockAnswers {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(key(funnel));
    return raw ? (JSON.parse(raw) as MockAnswers) : {};
  } catch {
    return {};
  }
}

export function writeAnswers(funnel: "f1" | "f2", patch: MockAnswers) {
  if (typeof window === "undefined") return;
  const cur = readAnswers(funnel);
  const next = { ...cur, ...patch };
  window.sessionStorage.setItem(key(funnel), JSON.stringify(next));
}

export function clearAnswers(funnel: "f1" | "f2") {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(key(funnel));
}

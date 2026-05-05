import { t } from "./i18n";

const API_BASE = "http://127.0.0.1:8000";

const BACKEND_ERROR_MAP = {
  "Vote not found": "errVoteNotFound",
  "Voting is not allowed": "errVotingNotAllowed",
  "choices is required": "errChoicesRequired",
  "Too many choices": "errTooManyChoices",
  "Invalid option": "errInvalidOption",
  "Already voted": "errAlreadyVoted",
  "Submit vote to view results": "errSubmitToView",
  "endAt must be after startAt": "errEndAfterStart",
  "At least 2 options are required": "errAtLeast2Options",
  "Unauthorized": "errUnauthorized",
  "Invalid token": "invalidToken",
  "token is required": "adminTokenRequired",
  "Forbidden": "errUnauthorized",
  "Results are only visible after the vote ends": "errResultAfterEnd",
  "Too many requests": "errTooManyRequests",
  "Fingerprint is required": "errFingerprintRequired",
  "Too many votes from this IP": "errTooManyVotesIP",
  "Invalid proof-of-work": "errInvalidPow",
};

function translateBackendError(detail) {
  const key = BACKEND_ERROR_MAP[detail];
  return key ? t(key) : detail;
}

export async function apiFetch(path, options) {
  const url = API_BASE + path;
  const { headers: extraHeaders, ...restOptions } = options || {};
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...(extraHeaders || {}),
    },
  });

  const isJson = (res.headers.get("content-type") || "").includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);
  if (!res.ok) {
    let msg = t("errRequestFailed", { status: res.status });
    if (data && data.detail !== undefined) {
      const detail = data.detail;
      if (typeof detail === "string") {
        msg = translateBackendError(detail);
      } else if (Array.isArray(detail)) {
        const parts = detail
          .map((d) => {
            if (!d) return "";
            if (typeof d === "string") return d;
            if (typeof d.msg === "string") return d.msg;
            return JSON.stringify(d);
          })
          .filter(Boolean);
        msg = parts.length ? parts.join("; ") : JSON.stringify(detail);
      } else {
        msg = JSON.stringify(detail);
      }
    }
    const err = new Error(msg);
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data;
}

export function toVoteListVm(v) {
  return {
    id: v.id,
    title: v.title,
    description: v.description,
    status: v.status,
    startTime: v.startAt,
    endTime: v.endAt,
    mode: v.mode || "normal",
    tierConfig: v.tierConfig || null,
    tierWeights: v.tierWeights || null,
    rulesText: v.rulesText || "",
    maxChoices: v.maxChoices,
    totalVotes: v.totalVotes,
  };
}

export function toVoteDetailVm(v) {
  return {
    id: v.id,
    title: v.title,
    description: v.description,
    status: v.status,
    startTime: v.startAt,
    endTime: v.endAt,
    mode: v.mode || "normal",
    tierConfig: v.tierConfig || null,
    tierWeights: v.tierWeights || null,
    rulesText: v.rulesText || "",
    maxChoices: v.maxChoices,
    resultVisibility: v.resultVisibility,
    options: v.options,
  };
}

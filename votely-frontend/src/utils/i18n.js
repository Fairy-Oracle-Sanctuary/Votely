const LANG_KEY = "VOTELY_LANG";
const SUPPORTED = ["en", "zh"];

const TRANSLATIONS = {
  en: {
    create: "Create",
    searchPlaceholder: "Search votes...",
    loading: "Loading...",
    noVotesFound: "No votes found",
    votes: "votes",
    pending: "Not Started",
    active: "In Progress",
    ended: "Ended",
    backToList: "Back to list",
    rules: "Rules",
    ruleMaxChoices: "Each person can select up to {n} option{s}",
    ruleActiveOnly: "Voting is only allowed during the active period",
    ruleNoDuplicate: "Duplicate submissions from the same user are not allowed",
    ruleResultAfter: "Results will be visible after submission or when the vote ends",
    ruleResultAfterEnd: "Results are only visible after the vote ends",
    options: "Options",
    viewResults: "View Results",
    notStartedYet: "Voting has not started yet",
    submitVote: "Submit Vote",
    maxOptionsWarning: "You can select at most {n} options",
    submitSuccess: "Vote submitted successfully",
    submitToView: "Submit vote to view results",
    results: "Results",
    totalVotes: "Total Votes",
    optionsCount: "Options",
    maxChoices: "Max Choices",
    votesTotal: "votes total",
    voteNotFound: "Vote not found",
    createVote: "Create Vote",
    adminToken: "Admin Token",
    adminTokenHint: "Enter your admin token to login",
    login: "Login",
    logout: "Logout",
    adminLogin: "Admin Login",
    enterToken: "Enter admin token",
    loginSuccess: "Logged in as {name}",
    logoutSuccess: "Logged out",
    invalidToken: "Invalid token",
    title: "Title",
    enterVoteTitle: "Enter vote title",
    description: "Description",
    describeVote: "Describe the vote",
    startTime: "Start Time",
    endTime: "End Time",
    maxChoicesPerVoter: "Max Choices per Voter",
    resultVisibility: "Result Visibility",
    afterVote: "Visible after voting",
    afterEnd: "Visible only after ended",
    optionN: "Option {n}",
    addOption: "Add option",
    cancel: "Cancel",
    createBtn: "Create",
    adminTokenRequired: "Admin token is required",
    titleRequired: "Title is required",
    atLeast2Options: "At least 2 options are required",
    startEndRequired: "Start and end times are required",
    endAfterStart: "End time must be after start time",
    voteCreated: "Vote created successfully",
    footerText: "Votely \u2014 Lightweight Voting Platform",
    langEn: "EN",
    langZh: "\u4E2D\u6587",
    errVoteNotFound: "Vote not found",
    errVotingNotAllowed: "Voting is not allowed",
    errChoicesRequired: "choices is required",
    errTooManyChoices: "Too many choices",
    errInvalidOption: "Invalid option",
    errAlreadyVoted: "Already voted",
    errSubmitToView: "Submit vote to view results",
    errEndAfterStart: "endAt must be after startAt",
    errAtLeast2Options: "At least 2 options are required",
    errUnauthorized: "Unauthorized",
    errResultAfterEnd: "Results are only visible after the vote ends",
    errTooManyRequests: "Too many requests, please try again later",
    errFingerprintRequired: "Device fingerprint is required",
    errTooManyVotesIP: "Too many votes from this network",
    errPowFailed: "Verification failed, please try again",
    errInvalidPow: "Invalid proof-of-work",
    errRequestFailed: "Request failed ({status})",
    adminPanel: "Admin Panel",
    myVotes: "My Votes",
    allVotes: "All Votes",
    edit: "Edit",
    endVote: "End Vote",
    deleteVote: "Delete Vote",
    confirmDelete: "Are you sure you want to delete this vote?",
    voteDeleted: "Vote deleted",
    voteEnded: "Vote ended",
    editVote: "Edit Vote",
    shareLink: "Share",
    linkCopied: "Link copied",
    save: "Save",
    voteUpdated: "Vote updated",
    confirm: "Confirm",
    confirmLogout: "Are you sure you want to logout?",
    voteMode: "Vote Mode",
    modeNormal: "Normal",
    modeTiered: "Main/Secondary/Normal",
    tierConfigLabel: "Tier Quotas",
    tierConfigHint: "Order: Main / Secondary / Normal",
    tierMain: "Main",
    tierSecondary: "Secondary",
    tierNormal: "Normal",
    tierWeightsLabel: "Score Weights",
    tierWeightsHint: "Default: Main=4, Secondary=2, Normal=1",
    weightedScore: "Score",
    navRules: "Rules",
    navVote: "Vote",
    navResults: "Results",
    totalRanking: "Total Ranking",
    mainRanking: "Main Ranking",
    searchRole: "Search role...",
    votesUnit: "votes",
    defaultRules: "Select roles from the list on the left. They will be automatically assigned to Main, Secondary, or Normal slots based on priority. You can remove any selection by clicking it again. At least 1 role is required to submit.",
    voteSubmitted: "Vote submitted successfully",
  },
  zh: {
    create: "\u521B\u5EFA",
    searchPlaceholder: "\u641C\u7D22\u6295\u7968...",
    loading: "\u52A0\u8F7D\u4E2D...",
    noVotesFound: "\u6CA1\u6709\u627E\u5230\u6295\u7968",
    votes: "\u7968",
    pending: "\u672A\u5F00\u59CB",
    active: "\u8FDB\u884C\u4E2D",
    ended: "\u5DF2\u7ED3\u675F",
    backToList: "\u8FD4\u56DE\u5217\u8868",
    rules: "\u89C4\u5219",
    ruleMaxChoices: "\u6BCF\u4EBA\u6700\u591A\u53EF\u9009\u62E9 {n} \u4E2A\u9009\u9879",
    ruleActiveOnly: "\u4EC5\u5728\u6295\u7968\u8FDB\u884C\u671F\u95F4\u5141\u8BB8\u6295\u7968",
    ruleNoDuplicate: "\u540C\u4E00\u7528\u6237\u4E0D\u5141\u8BB8\u91CD\u590D\u63D0\u4EA4",
    ruleResultAfter: "\u63D0\u4EA4\u6295\u7968\u540E\u6216\u6295\u7968\u7ED3\u675F\u540E\u53EF\u67E5\u770B\u7ED3\u679C",
    ruleResultAfterEnd: "\u6295\u7968\u7ED3\u675F\u540E\u624D\u80FD\u67E5\u770B\u7ED3\u679C",
    options: "\u9009\u9879",
    viewResults: "\u67E5\u770B\u7ED3\u679C",
    notStartedYet: "\u6295\u7968\u5C1A\u672A\u5F00\u59CB",
    submitVote: "\u63D0\u4EA4\u6295\u7968",
    maxOptionsWarning: "\u6700\u591A\u53EA\u80FD\u9009\u62E9 {n} \u4E2A\u9009\u9879",
    submitSuccess: "\u6295\u7968\u63D0\u4EA4\u6210\u529F",
    submitToView: "\u63D0\u4EA4\u6295\u7968\u540E\u624D\u80FD\u67E5\u770B\u7ED3\u679C",
    results: "\u7ED3\u679C",
    totalVotes: "\u603B\u7968\u6570",
    optionsCount: "\u9009\u9879\u6570",
    maxChoices: "\u6700\u591A\u9009\u62E9",
    votesTotal: "\u7968\u603B\u8BA1",
    voteNotFound: "\u6295\u7968\u4E0D\u5B58\u5728",
    createVote: "\u521B\u5EFA\u6295\u7968",
    adminToken: "\u7BA1\u7406\u4EE4\u724C",
    adminTokenHint: "\u8F93\u5165\u7BA1\u7406\u4EE4\u724C\u4EE5\u767B\u5F55",
    login: "\u767B\u5F55",
    logout: "\u9000\u51FA",
    adminLogin: "\u7BA1\u7406\u5458\u767B\u5F55",
    enterToken: "\u8F93\u5165\u7BA1\u7406\u4EE4\u724C",
    loginSuccess: "\u5DF2\u767B\u5F55\u4E3A {name}",
    logoutSuccess: "\u5DF2\u9000\u51FA\u767B\u5F55",
    invalidToken: "\u65E0\u6548\u7684\u4EE4\u724C",
    title: "\u6807\u9898",
    enterVoteTitle: "\u8F93\u5165\u6295\u7968\u6807\u9898",
    description: "\u63CF\u8FF0",
    describeVote: "\u63CF\u8FF0\u8BE5\u6295\u7968",
    startTime: "\u5F00\u59CB\u65F6\u95F4",
    endTime: "\u7ED3\u675F\u65F6\u95F4",
    maxChoicesPerVoter: "\u6BCF\u4EBA\u6700\u591A\u9009\u62E9\u6570",
    resultVisibility: "\u7ED3\u679C\u53EF\u89C1\u6027",
    afterVote: "\u6295\u7968\u540E\u53EF\u89C1",
    afterEnd: "\u7ED3\u675F\u540E\u624D\u53EF\u89C1",
    optionN: "\u9009\u9879 {n}",
    addOption: "\u6DFB\u52A0\u9009\u9879",
    cancel: "\u53D6\u6D88",
    createBtn: "\u521B\u5EFA",
    adminTokenRequired: "\u7BA1\u7406\u4EE4\u724C\u4E0D\u80FD\u4E3A\u7A7A",
    titleRequired: "\u6807\u9898\u4E0D\u80FD\u4E3A\u7A7A",
    atLeast2Options: "\u81F3\u5C11\u9700\u8981 2 \u4E2A\u9009\u9879",
    startEndRequired: "\u5F00\u59CB\u548C\u7ED3\u675F\u65F6\u95F4\u4E0D\u80FD\u4E3A\u7A7A",
    endAfterStart: "\u7ED3\u675F\u65F6\u95F4\u5FC5\u987B\u665A\u4E8E\u5F00\u59CB\u65F6\u95F4",
    voteCreated: "\u6295\u7968\u521B\u5EFA\u6210\u529F",
    footerText: "Votely \u2014 \u8F7B\u91CF\u6295\u7968\u5E73\u53F0",
    langEn: "EN",
    langZh: "\u4E2D\u6587",
    errVoteNotFound: "\u6295\u7968\u4E0D\u5B58\u5728",
    errVotingNotAllowed: "\u5F53\u524D\u4E0D\u5141\u8BB8\u6295\u7968",
    errChoicesRequired: "\u8BF7\u9009\u62E9\u9009\u9879",
    errTooManyChoices: "\u9009\u62E9\u6570\u91CF\u8D85\u51FA\u9650\u5236",
    errInvalidOption: "\u65E0\u6548\u7684\u9009\u9879",
    errAlreadyVoted: "\u4F60\u5DF2\u7ECF\u6295\u8FC7\u7968\u4E86",
    errSubmitToView: "\u63D0\u4EA4\u6295\u7968\u540E\u624D\u80FD\u67E5\u770B\u7ED3\u679C",
    errEndAfterStart: "\u7ED3\u675F\u65F6\u95F4\u5FC5\u987B\u665A\u4E8E\u5F00\u59CB\u65F6\u95F4",
    errAtLeast2Options: "\u81F3\u5C11\u9700\u8981 2 \u4E2A\u9009\u9879",
    errUnauthorized: "\u672A\u6388\u6743",
    errResultAfterEnd: "\u6295\u7968\u7ED3\u675F\u540E\u624D\u80FD\u67E5\u770B\u7ED3\u679C",
    errTooManyRequests: "\u8BF7\u6C42\u8FC7\u4E8E\u9891\u7E41\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5",
    errFingerprintRequired: "\u8BBE\u5907\u6307\u7EB9\u4E0D\u80FD\u4E3A\u7A7A",
    errTooManyVotesIP: "\u8BE5\u7F51\u7EDC\u4E0B\u6295\u7968\u6B21\u6570\u8FC7\u591A",
    errPowFailed: "\u9A8C\u8BC1\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5",
    errInvalidPow: "\u5DE5\u4F5C\u91CF\u8BC1\u660E\u65E0\u6548",
    errRequestFailed: "\u8BF7\u6C42\u5931\u8D25 ({status})",
    adminPanel: "\u7BA1\u7406\u9762\u677F",
    myVotes: "\u6211\u7684\u6295\u7968",
    allVotes: "\u5168\u90E8\u6295\u7968",
    edit: "\u7F16\u8F91",
    endVote: "\u7ED3\u675F\u6295\u7968",
    deleteVote: "\u5220\u9664\u6295\u7968",
    confirmDelete: "\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u4E2A\u6295\u7968\u5417\uFF1F",
    voteDeleted: "\u6295\u7968\u5DF2\u5220\u9664",
    voteEnded: "\u6295\u7968\u5DF2\u7ED3\u675F",
    editVote: "\u7F16\u8F91\u6295\u7968",
    shareLink: "\u5206\u4EAB",
    linkCopied: "\u94FE\u63A5\u5DF2\u590D\u5236",
    save: "\u4FDD\u5B58",
    voteUpdated: "\u6295\u7968\u5DF2\u66F4\u65B0",
    confirm: "\u786E\u8BA4",
    confirmLogout: "\u786E\u5B9A\u8981\u9000\u51FA\u767B\u5F55\u5417\uFF1F",
    voteMode: "\u6295\u7968\u6A21\u5F0F",
    modeNormal: "\u666E\u901A\u6A21\u5F0F",
    modeTiered: "\u672C\u547D/\u6B21\u672C\u547D/\u666E\u901A\u7968",
    tierConfigLabel: "\u5206\u7EC4\u6570\u91CF",
    tierConfigHint: "\u987A\u5E8F\uFF1A\u672C\u547D / \u6B21\u672C\u547D / \u666E\u901A\u7968",
    tierMain: "\u672C\u547D",
    tierSecondary: "\u6B21\u672C\u547D",
    tierNormal: "\u666E\u901A\u7968",
    tierWeightsLabel: "\u5206\u6570\u6743\u91CD",
    tierWeightsHint: "\u9ED8\u8BA4\uFF1A\u672C\u547D=4\uFF0C\u6B21\u672C\u547D=2\uFF0C\u666E\u901A=1",
    weightedScore: "\u5206\u6570",
    navRules: "\u89C4\u5219\u4ECB\u7ECD",
    navVote: "\u6295\u7968\u5165\u53E3",
    navResults: "\u7ED3\u679C\u516C\u793A",
    totalRanking: "\u603B\u4EBA\u6C14\u699C",
    mainRanking: "\u672C\u547D\u4EBA\u6C14\u699C",
    searchRole: "\u641C\u7D22\u89D2\u8272...",
    votesUnit: "\u7968",
    defaultRules: "\u4ECE\u5DE6\u4FA7\u5217\u8868\u9009\u62E9\u89D2\u8272\uFF0C\u7CFB\u7EDF\u4F1A\u6309\u4F18\u5148\u7EA7\u81EA\u52A8\u5206\u914D\u5230\u672C\u547D\u3001\u6B21\u672C\u547D\u6216\u666E\u901A\u7968\u3002\u70B9\u51FB\u5DF2\u9009\u89D2\u8272\u53EF\u53D6\u6D88\u3002\u81F3\u5C11\u9009\u62E91\u4E2A\u89D2\u8272\u5373\u53EF\u63D0\u4EA4\u3002",
    voteSubmitted: "\u6295\u7968\u63D0\u4EA4\u6210\u529F",
  },
};

function detectLang() {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved && SUPPORTED.includes(saved)) return saved;
  const nav = (navigator.language || "en").toLowerCase();
  if (nav.startsWith("zh")) return "zh";
  return "en";
}

let currentLang = detectLang();

export function t(key, params) {
  const translations = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  let str = translations[key] || TRANSLATIONS.en[key] || key;
  if (params) {
    Object.keys(params).forEach((k) => {
      str = str.replace(new RegExp("\\{" + k + "\\}", "g"), params[k]);
    });
  }
  return str;
}

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  if (!SUPPORTED.includes(lang)) return;
  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
}

export function useFormat() {
  const locale = currentLang === "zh" ? "zh-CN" : "en-US";
  return { locale };
}

export function formatDate(iso) {
  const d = new Date(iso);
  const locale = currentLang === "zh" ? "zh-CN" : "en-US";
  return d.toLocaleDateString(locale, { year: "numeric", month: "2-digit", day: "2-digit" });
}

export function formatDateTime(iso) {
  const d = new Date(iso);
  const locale = currentLang === "zh" ? "zh-CN" : "en-US";
  return d.toLocaleString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function statusLabel(status) {
  const map = { pending: t("pending"), active: t("active"), ended: t("ended") };
  return map[status] || status;
}

export function totalVotes(vote) {
  if (typeof vote.totalVotes === "number") return vote.totalVotes;
  return 0;
}

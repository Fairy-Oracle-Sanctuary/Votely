(function () {
  "use strict";

  // ── SVG Icons ──────────────────────────────────────────────
  const ICONS = {
    search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    clock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    users: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    arrowLeft: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
    x: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    plus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    barChart: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',
    inbox: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',
    share: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
    edit: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    stop: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>',
    trash: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    copy: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  };

  // ── i18n ────────────────────────────────────────────────────
  const LANG_KEY = "VOTELY_LANG";
  const SUPPORTED = ["en", "zh"];

  const TRANSLATIONS = {
    en: {
      // Header
      create: "Create",
      // List
      searchPlaceholder: "Search votes...",
      loading: "Loading...",
      noVotesFound: "No votes found",
      votes: "votes",
      // Status
      pending: "Not Started",
      active: "In Progress",
      ended: "Ended",
      // Detail
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
      // Result
      results: "Results",
      totalVotes: "Total Votes",
      optionsCount: "Options",
      maxChoices: "Max Choices",
      votesTotal: "votes total",
      // Not found
      voteNotFound: "Vote not found",
      // Create modal
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
      // Footer
      footerText: "Votely — Lightweight Voting Platform",
      // Language
      langEn: "EN",
      langZh: "中文",
      // Backend errors
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
      // Admin panel
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
      addOption: "Add Option",
      save: "Save",
      voteUpdated: "Vote updated",
      backToList: "Back to list",
      options: "Options",
      confirm: "Confirm",
      cancel: "Cancel",
      confirmLogout: "Are you sure you want to logout?",

      // Tiered mode
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
    },
    zh: {
      create: "创建",
      searchPlaceholder: "搜索投票...",
      loading: "加载中...",
      noVotesFound: "没有找到投票",
      votes: "票",
      pending: "未开始",
      active: "进行中",
      ended: "已结束",
      backToList: "返回列表",
      rules: "规则",
      ruleMaxChoices: "每人最多可选择 {n} 个选项",
      ruleActiveOnly: "仅在投票进行期间允许投票",
      ruleNoDuplicate: "同一用户不允许重复提交",
      ruleResultAfter: "提交投票后或投票结束后可查看结果",
      ruleResultAfterEnd: "投票结束后才能查看结果",
      options: "选项",
      viewResults: "查看结果",
      notStartedYet: "投票尚未开始",
      submitVote: "提交投票",
      maxOptionsWarning: "最多只能选择 {n} 个选项",
      submitSuccess: "投票提交成功",
      submitToView: "提交投票后才能查看结果",
      results: "结果",
      totalVotes: "总票数",
      optionsCount: "选项数",
      maxChoices: "最多选择",
      votesTotal: "票总计",
      voteNotFound: "投票不存在",
      createVote: "创建投票",
      adminToken: "管理令牌",
      adminTokenHint: "输入管理令牌以登录",
      login: "登录",
      logout: "退出",
      adminLogin: "管理员登录",
      enterToken: "输入管理令牌",
      loginSuccess: "已登录为 {name}",
      logoutSuccess: "已退出登录",
      invalidToken: "无效的令牌",
      title: "标题",
      enterVoteTitle: "输入投票标题",
      description: "描述",
      describeVote: "描述该投票",
      startTime: "开始时间",
      endTime: "结束时间",
      maxChoicesPerVoter: "每人最多选择数",
      resultVisibility: "结果可见性",
      afterVote: "投票后可见",
      afterEnd: "结束后才可见",
      optionN: "选项 {n}",
      addOption: "添加选项",
      cancel: "取消",
      createBtn: "创建",
      adminTokenRequired: "管理令牌不能为空",
      titleRequired: "标题不能为空",
      atLeast2Options: "至少需要 2 个选项",
      startEndRequired: "开始和结束时间不能为空",
      endAfterStart: "结束时间必须晚于开始时间",
      voteCreated: "投票创建成功",
      footerText: "Votely — 轻量投票平台",
      langEn: "EN",
      langZh: "中文",
      // Backend errors
      errVoteNotFound: "投票不存在",
      errVotingNotAllowed: "当前不允许投票",
      errChoicesRequired: "请选择选项",
      errTooManyChoices: "选择数量超出限制",
      errInvalidOption: "无效的选项",
      errAlreadyVoted: "你已经投过票了",
      errSubmitToView: "提交投票后才能查看结果",
      errEndAfterStart: "结束时间必须晚于开始时间",
      errAtLeast2Options: "至少需要 2 个选项",
      errUnauthorized: "未授权",
      errResultAfterEnd: "投票结束后才能查看结果",
      errTooManyRequests: "请求过于频繁，请稍后再试",
      errFingerprintRequired: "设备指纹不能为空",
      errTooManyVotesIP: "该网络下投票次数过多",
      errPowFailed: "验证失败，请重试",
      errInvalidPow: "工作量证明无效",
      errRequestFailed: "请求失败 ({status})",
      // Admin panel
      adminPanel: "管理面板",
      myVotes: "我的投票",
      allVotes: "全部投票",
      edit: "编辑",
      endVote: "结束投票",
      deleteVote: "删除投票",
      confirmDelete: "确定要删除这个投票吗？",
      voteDeleted: "投票已删除",
      voteEnded: "投票已结束",
      editVote: "编辑投票",
      shareLink: "分享",
      linkCopied: "链接已复制",
      addOption: "添加选项",
      save: "保存",
      voteUpdated: "投票已更新",
      backToList: "返回列表",
      options: "选项",
      confirm: "确认",
      cancel: "取消",
      confirmLogout: "确定要退出登录吗？",

      // Tiered mode
      voteMode: "投票模式",
      modeNormal: "普通模式",
      modeTiered: "本命/次本命/普通票",
      tierConfigLabel: "分组数量",
      tierConfigHint: "顺序：本命 / 次本命 / 普通票",
      tierMain: "本命",
      tierSecondary: "次本命",
      tierNormal: "普通票",
      tierWeightsLabel: "分数权重",
      tierWeightsHint: "默认：本命=4，次本命=2，普通=1",
      weightedScore: "分数",
      navRules: "规则介绍",
      navVote: "投票入口",
      navResults: "结果公示",
      totalRanking: "总人气榜",
      mainRanking: "本命人气榜",
      searchRole: "搜索角色...",
      votesUnit: "票",
      defaultRules: "从左侧列表选择角色，系统会按优先级自动分配到本命、次本命或普通票。点击已选角色可取消。至少选择1个角色即可提交。",
    },
  };

  function detectLang() {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && SUPPORTED.includes(saved)) return saved;
    const nav = (navigator.language || "en").toLowerCase();
    if (nav.startsWith("zh")) return "zh";
    return "en";
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function toLocalInputText(date) {
    const y = date.getFullYear();
    const m = pad2(date.getMonth() + 1);
    const d = pad2(date.getDate());
    const hh = pad2(date.getHours());
    const mm = pad2(date.getMinutes());
    return `${y}-${m}-${d} ${hh}:${mm}`;
  }

  function startOfMonth(d) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }

  function daysInMonth(d) {
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  }

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  function openDateTimePicker(params) {
    const { initialDate, onConfirm } = params;
    let selected = initialDate ? new Date(initialDate.getTime()) : new Date();
    let view = startOfMonth(selected);

    const overlay = document.createElement("div");
    overlay.className = "dtp-overlay";

    function render() {
      const first = startOfMonth(view);
      const startWeekday = (first.getDay() + 6) % 7; // Monday=0
      const dim = daysInMonth(view);

      const monthLabel = view.toLocaleString(currentLang === "zh" ? "zh-CN" : "en-US", {
        year: "numeric",
        month: "long",
      });

      const hour = selected.getHours();
      const minute = selected.getMinutes();

      const days = [];
      for (let i = 0; i < startWeekday; i++) days.push(null);
      for (let day = 1; day <= dim; day++) days.push(day);
      while (days.length % 7 !== 0) days.push(null);

      overlay.innerHTML = `
        <div class="dtp-backdrop"></div>
        <div class="dtp-panel" role="dialog" aria-modal="true">
          <div class="dtp-header">
            <button type="button" class="btn btn-ghost btn-sm" id="dtp-prev">${ICONS.arrowLeft}</button>
            <div class="dtp-title">${monthLabel}</div>
            <button type="button" class="btn btn-ghost btn-sm" id="dtp-next" aria-label="next">${ICONS.arrowLeft}</button>
          </div>

          <div class="dtp-week">
            ${["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
              .map((w) => `<div class="dtp-weekday">${w}</div>`)
              .join("")}
          </div>

          <div class="dtp-grid">
            ${days
              .map((day) => {
                if (!day) return `<div class="dtp-day empty"></div>`;
                const isSel =
                  selected.getFullYear() === view.getFullYear() &&
                  selected.getMonth() === view.getMonth() &&
                  selected.getDate() === day;
                return `<button type="button" class="dtp-day ${isSel ? "selected" : ""}" data-day="${day}">${day}</button>`;
              })
              .join("")}
          </div>

          <div class="dtp-time">
            <div class="dtp-time-col">
              <label class="dtp-time-label">${currentLang === "zh" ? "时" : "Hour"}</label>
              <input class="form-input" type="number" id="dtp-hour" min="0" max="23" value="${hour}" />
            </div>
            <div class="dtp-time-col">
              <label class="dtp-time-label">${currentLang === "zh" ? "分" : "Minute"}</label>
              <input class="form-input" type="number" id="dtp-minute" min="0" max="59" value="${minute}" />
            </div>
          </div>

          <div class="dtp-footer">
            <button type="button" class="btn btn-outline" id="dtp-cancel">${t("cancel")}</button>
            <button type="button" class="btn btn-primary" id="dtp-ok">OK</button>
          </div>
        </div>
      `;

      // Fix next icon by rotating the same arrow
      overlay.querySelector("#dtp-next svg").style.transform = "rotate(180deg)";
      overlay.querySelector("#dtp-next svg").style.transformOrigin = "50% 50%";

      overlay.querySelector(".dtp-backdrop").addEventListener("click", close);
      overlay.querySelector("#dtp-cancel").addEventListener("click", close);
      overlay.querySelector("#dtp-prev").addEventListener("click", () => {
        view = new Date(view.getFullYear(), view.getMonth() - 1, 1);
        render();
      });
      overlay.querySelector("#dtp-next").addEventListener("click", () => {
        view = new Date(view.getFullYear(), view.getMonth() + 1, 1);
        render();
      });
      overlay.querySelectorAll(".dtp-day[data-day]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const d = parseInt(btn.dataset.day);
          selected.setFullYear(view.getFullYear(), view.getMonth(), d);
          render();
        });
      });

      const hourEl = overlay.querySelector("#dtp-hour");
      const minuteEl = overlay.querySelector("#dtp-minute");
      const syncTime = () => {
        const h = clamp(parseInt(hourEl.value || "0"), 0, 23);
        const m = clamp(parseInt(minuteEl.value || "0"), 0, 59);
        hourEl.value = String(h);
        minuteEl.value = String(m);
        selected.setHours(h);
        selected.setMinutes(m);
        selected.setSeconds(0);
        selected.setMilliseconds(0);
      };
      hourEl.addEventListener("change", syncTime);
      minuteEl.addEventListener("change", syncTime);
      hourEl.addEventListener("input", syncTime);
      minuteEl.addEventListener("input", syncTime);

      overlay.querySelector("#dtp-ok").addEventListener("click", () => {
        syncTime();
        onConfirm(new Date(selected.getTime()));
        close();
      });
    }

    function close() {
      overlay.remove();
      document.removeEventListener("keydown", onKey);
    }

    function onKey(e) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);

    render();
    document.body.appendChild(overlay);
  }

  let currentLang = detectLang();

  function t(key, params) {
    let str = (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) || (TRANSLATIONS.en[key]) || key;
    if (params) {
      Object.keys(params).forEach((k) => {
        str = str.replace(new RegExp("\\{" + k + "\\}", "g"), params[k]);
      });
    }
    return str;
  }

  function esc(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function confirmDialog(message) {
    return new Promise((resolve) => {
      const overlay = document.createElement("div");
      overlay.className = "modal-overlay";
      overlay.innerHTML = `
        <div class="modal" style="max-width:400px">
          <div class="modal-body" style="padding:24px;text-align:center">
            <p style="font-size:1rem;line-height:1.6;margin:0">${esc(message)}</p>
          </div>
          <div class="modal-footer" style="justify-content:center;gap:12px">
            <button class="btn btn-outline" id="cf-cancel">${t("cancel")}</button>
            <button class="btn btn-primary" id="cf-confirm">${t("confirm")}</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      const close = (val) => { overlay.remove(); resolve(val); };
      overlay.querySelector("#cf-confirm").addEventListener("click", () => close(true));
      overlay.querySelector("#cf-cancel").addEventListener("click", () => close(false));
      overlay.addEventListener("click", (e) => { if (e.target === overlay) close(false); });
    });
  }

  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    // Re-render current view
    route();
    // Update toggle button text
    const btn = document.getElementById("btn-lang");
    if (btn) btn.textContent = lang === "zh" ? t("langEn") : t("langZh");
    // Update footer
    const footer = document.querySelector(".app-footer p");
    if (footer) footer.innerHTML = t("footerText");
    // Update create button
    const createSpan = document.querySelector("#btn-create span");
    if (createSpan) createSpan.textContent = t("create");
    // Update admin header
    updateHeaderAdmin();
  }

  // ── Backend API ────────────────────────────────────────────
  const API_BASE = "http://127.0.0.1:8000";

  // Admin state (resolved from cookie via /api/admin/me)
  const adminState = { loggedIn: false, name: "", role: "" };

  async function checkAdminLogin() {
    try {
      const data = await apiFetch("/api/admin/me");
      if (data && data.ok) {
        adminState.loggedIn = true;
        adminState.name = data.name;
        adminState.role = data.role;
      } else {
        adminState.loggedIn = false;
        adminState.name = "";
        adminState.role = "";
      }
    } catch {
      adminState.loggedIn = false;
    }
    updateHeaderAdmin();
  }

  async function doAdminLogin(token) {
    const data = await apiFetch("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
    if (data && data.ok) {
      adminState.loggedIn = true;
      adminState.name = data.name;
      adminState.role = data.role;
      updateHeaderAdmin();
      toast(t("loginSuccess", { name: data.name }), "success");
    }
  }

  function renderTieredDetail(root, vote) {
    const isEnded = vote.status === "ended";
    const isPending = vote.status === "pending";
    const isActive = vote.status === "active";

    const cfg = vote.tierConfig || { main: 1, secondary: 2, normal: 4 };
    const limits = {
      main: Math.max(0, parseInt(cfg.main || 0)),
      secondary: Math.max(0, parseInt(cfg.secondary || 0)),
      normal: Math.max(0, parseInt(cfg.normal || 0)),
    };

    const selectedSet = new Set();
    const main = [];
    const secondary = [];
    const normal = [];
    let currentTab = "vote"; // default tab

    function tierOf(id) {
      if (main.includes(id)) return "main";
      if (secondary.includes(id)) return "secondary";
      if (normal.includes(id)) return "normal";
      return "";
    }

    function removeId(id) {
      const t0 = tierOf(id);
      if (!t0) return;
      const arr = t0 === "main" ? main : t0 === "secondary" ? secondary : normal;
      const idx = arr.indexOf(id);
      if (idx >= 0) arr.splice(idx, 1);
      selectedSet.delete(id);
    }

    function nextTier() {
      if (main.length < limits.main) return "main";
      if (secondary.length < limits.secondary) return "secondary";
      if (normal.length < limits.normal) return "normal";
      return "";
    }

    function addId(id) {
      const t0 = nextTier();
      if (!t0) return;
      if (selectedSet.has(id)) return;
      selectedSet.add(id);
      if (t0 === "main") main.push(id);
      else if (t0 === "secondary") secondary.push(id);
      else normal.push(id);
    }

    function choicesInOrder() {
      return [...main, ...secondary, ...normal];
    }

    function optionText(id) {
      const o = vote.options.find((x) => x.id === id);
      return o ? o.text : id;
    }

    // ── Sub-page renderers ────────────────────────────────────

    function renderRulesPage() {
      const rulesContent = vote.rulesText
        ? `<div class="rules-custom-text">${esc(vote.rulesText).replace(/\n/g, "<br>")}</div>`
        : `<div class="rules-card"><ul>
            <li>${t("tierMain")}: ${limits.main} &nbsp; ${t("tierSecondary")}: ${limits.secondary} &nbsp; ${t("tierNormal")}: ${limits.normal}</li>
            <li>${t("defaultRules")}</li>
          </ul></div>`;
      return `
        <h2 class="tier-page-title">${t("navRules")}</h2>
        <div class="tier-page-body">${rulesContent}</div>
      `;
    }

    function renderVotePage() {
      return `
        <h2 class="tier-page-title">${t("navVote")}</h2>
        <div class="tier-page-body">
          <div class="tiered-vote-layout">
            <div class="tiered-vote-roles">
              <div class="search-bar" style="margin-bottom:12px">
                ${ICONS.search}
                <input type="text" id="tier-search" placeholder="${t("searchRole")}" />
              </div>
              <div class="options-list" id="tier-options"></div>
            </div>
            <div class="tiered-vote-buckets">
              <div class="tier-box">
                <div class="tier-title">${t("tierMain")} (${limits.main})</div>
                <div class="tier-items" id="tier-main"></div>
              </div>
              <div class="tier-box">
                <div class="tier-title">${t("tierSecondary")} (${limits.secondary})</div>
                <div class="tier-items" id="tier-secondary"></div>
              </div>
              <div class="tier-box">
                <div class="tier-title">${t("tierNormal")} (${limits.normal})</div>
                <div class="tier-items" id="tier-normal"></div>
              </div>
              <div class="vote-action" style="margin-top:16px">
                ${
                  isEnded
                    ? `<span class="badge badge-ended">${t("ended")}</span>`
                    : isPending
                    ? `<button class="btn btn-outline" disabled>${t("notStartedYet")}</button>`
                    : `<button class="btn btn-primary" id="btn-submit" disabled>${t("submitVote")}</button>`
                }
              </div>
            </div>
          </div>
        </div>
      `;
    }

    function renderResultsPage() {
      return `
        <h2 class="tier-page-title">${t("navResults")}</h2>
        <div class="tier-page-body">
          <div class="tier-results-loading" id="tier-results-loading">
            <div class="spinner"></div><p>${t("loading")}</p>
          </div>
          <div class="tier-results-content" id="tier-results-content" style="display:none"></div>
        </div>
      `;
    }

    // ── Main layout ────────────────────────────────────────────

    root.innerHTML = `
      <div class="detail-header">
        <a href="#/" class="detail-back">${ICONS.arrowLeft}${t("backToList")}</a>
        <div class="detail-title-row">
          <h1 class="detail-title">${esc(vote.title)}</h1>
          <button class="btn btn-ghost btn-sm btn-detail-share" title="${t("shareLink")}">${ICONS.copy}</button>
        </div>
        <div class="detail-meta">
          ${statusBadge(vote.status)}
          <span class="meta-item">${ICONS.clock}${formatDateTime(vote.startTime)} - ${formatDateTime(vote.endTime)}</span>
          <span class="meta-item">${ICONS.users}${totalVotes(vote)} ${t("votes")}</span>
        </div>
      </div>

      <div class="tiered-container">
        <nav class="tiered-nav" id="tiered-nav">
          <button class="tiered-nav-item active" data-tab="rules">${t("navRules")}</button>
          <button class="tiered-nav-item" data-tab="vote">${t("navVote")}</button>
          <button class="tiered-nav-item" data-tab="results">${t("navResults")}</button>
        </nav>
        <div class="tiered-content" id="tiered-content"></div>
      </div>
    `;

    // Share
    const shareBtn = root.querySelector(".btn-detail-share");
    if (shareBtn) {
      shareBtn.addEventListener("click", () => {
        const url = `${location.origin}${location.pathname}#/vote/${vote.id}`;
        navigator.clipboard.writeText(url).then(() => toast(t("linkCopied"), "success"));
      });
    }

    // ── Tab switching ──────────────────────────────────────────
    const contentEl = root.querySelector("#tiered-content");
    const navEl = root.querySelector("#tiered-nav");

    function switchTab(tab) {
      currentTab = tab;
      navEl.querySelectorAll(".tiered-nav-item").forEach((b) => {
        b.classList.toggle("active", b.dataset.tab === tab);
      });
      if (tab === "rules") {
        contentEl.innerHTML = renderRulesPage();
      } else if (tab === "vote") {
        contentEl.innerHTML = renderVotePage();
        bindVotePage();
      } else if (tab === "results") {
        contentEl.innerHTML = renderResultsPage();
        loadResultsPage();
      }
    }

    navEl.querySelectorAll(".tiered-nav-item").forEach((btn) => {
      btn.addEventListener("click", () => switchTab(btn.dataset.tab));
    });

    // Default tab
    switchTab(currentTab);

    // ── Vote page bindings ─────────────────────────────────────
    function bindVotePage() {
      const optionsEl = root.querySelector("#tier-options");
      const searchEl = root.querySelector("#tier-search");
      const mainEl = root.querySelector("#tier-main");
      const secEl = root.querySelector("#tier-secondary");
      const norEl = root.querySelector("#tier-normal");

      function renderBuckets() {
        function pill(id) {
          return `<button class="tier-pill" data-oid="${esc(id)}" type="button">${esc(optionText(id))}${ICONS.x}</button>`;
        }
        mainEl.innerHTML = main.map(pill).join("") || `<div class="tier-empty">-</div>`;
        secEl.innerHTML = secondary.map(pill).join("") || `<div class="tier-empty">-</div>`;
        norEl.innerHTML = normal.map(pill).join("") || `<div class="tier-empty">-</div>`;

        root.querySelectorAll(".tier-pill").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (!isActive) return;
            removeId(btn.dataset.oid);
            renderAll();
          });
        });
      }

      function renderOptions() {
        const q = (searchEl.value || "").trim().toLowerCase();
        const rows = vote.options
          .filter((o) => !q || (o.text || "").toLowerCase().includes(q))
          .map((o) => {
            const selected = selectedSet.has(o.id);
            return `
              <div class="option-item ${selected ? "disabled" : ""}" data-oid="${esc(o.id)}">
                <div class="option-radio"><div class="option-radio-inner"></div></div>
                <span class="option-label">${esc(o.text)}</span>
              </div>
            `;
          })
          .join("");
        optionsEl.innerHTML = rows;

        optionsEl.querySelectorAll(".option-item").forEach((item) => {
          item.addEventListener("click", () => {
            if (!isActive) return;
            const oid = item.dataset.oid;
            if (selectedSet.has(oid)) {
              removeId(oid);
              renderAll();
              return;
            }
            addId(oid);
            renderAll();
          });
        });
      }

      function updateSubmit() {
        const btn = root.querySelector("#btn-submit");
        if (!btn) return;
        btn.disabled = choicesInOrder().length === 0;
      }

      function renderAll() {
        renderBuckets();
        renderOptions();
        updateSubmit();
      }

      searchEl.addEventListener("input", renderOptions);
      renderAll();

      // Submit
      const submitBtn = root.querySelector("#btn-submit");
      if (submitBtn) {
        submitBtn.addEventListener("click", async () => {
          submitBtn.disabled = true;
          try {
            const fp = await generateFingerprint();
            const powData = await apiFetch("/api/pow/challenge");
            const nonce = await solvePow(powData.challenge, powData.difficulty);
            if (nonce < 0) {
              toast(t("errPowFailed"), "error");
              submitBtn.disabled = false;
              return;
            }
            await apiFetch(`/api/votes/${encodeURIComponent(vote.id)}/submit`, {
              method: "POST",
              body: JSON.stringify({
                choices: choicesInOrder(),
                fingerprint: fp,
                powChallenge: powData.challenge,
                powNonce: nonce,
              }),
            });
            toast(t("voteSubmitted"), "success");
            switchTab("results");
          } catch (e) {
            toast(e.message, "error");
          } finally {
            submitBtn.disabled = false;
          }
        });
      }
    }

    // ── Results page ───────────────────────────────────────────
    async function loadResultsPage() {
      const loadingEl = root.querySelector("#tier-results-loading");
      const contentEl = root.querySelector("#tier-results-content");
      try {
        const data = await apiFetch(`/api/votes/${encodeURIComponent(vote.id)}/results`);
        if (loadingEl) loadingEl.style.display = "none";
        if (!contentEl) return;

        const tiered = data.tieredItems || [];
        const total = data.total || 0;

        // Sort by weightedScore desc for total ranking
        const totalSorted = [...tiered].sort((a, b) => (b.weightedScore || 0) - (a.weightedScore || 0));
        // Sort by mainVotes desc for main ranking
        const mainSorted = [...tiered].sort((a, b) => b.mainVotes - a.mainVotes);

        function rankingList(items, voteKey) {
          return items.map((item, i) => `
            <div class="ranking-row">
              <span class="ranking-rank">${i + 1}</span>
              <span class="ranking-name">${esc(item.text)}</span>
              <span class="ranking-dots"></span>
              <span class="ranking-votes">${voteKey === "main" ? item.mainVotes : (item.weightedScore != null ? item.weightedScore : item.totalVotes)} ${voteKey === "main" ? t("votesUnit") : t("weightedScore")}</span>
            </div>
          `).join("");
        }

        contentEl.innerHTML = `
          <div class="ranking-section">
            <div class="ranking-header">
              <h3>${t("totalRanking")}</h3>
              <div class="search-bar" style="margin-bottom:8px;max-width:240px">
                ${ICONS.search}
                <input type="text" id="search-total" placeholder="${t("searchRole")}" />
              </div>
            </div>
            <div class="ranking-list" id="ranking-total">${rankingList(totalSorted, "total")}</div>
          </div>
          <div class="ranking-section">
            <div class="ranking-header">
              <h3>${t("mainRanking")}</h3>
              <div class="search-bar" style="margin-bottom:8px;max-width:240px">
                ${ICONS.search}
                <input type="text" id="search-main" placeholder="${t("searchRole")}" />
              </div>
            </div>
            <div class="ranking-list" id="ranking-main">${rankingList(mainSorted, "main")}</div>
          </div>
        `;
        contentEl.style.display = "block";

        // Search filtering
        function bindRankingSearch(inputId, listId, items, voteKey) {
          const input = root.querySelector(`#${inputId}`);
          const listEl = root.querySelector(`#${listId}`);
          if (!input || !listEl) return;
          input.addEventListener("input", () => {
            const q = input.value.trim().toLowerCase();
            const filtered = q ? items.filter((it) => (it.text || "").toLowerCase().includes(q)) : items;
            listEl.innerHTML = rankingList(filtered, voteKey);
          });
        }
        bindRankingSearch("search-total", "ranking-total", totalSorted, "total");
        bindRankingSearch("search-main", "ranking-main", mainSorted, "main");

      } catch (e) {
        if (loadingEl) loadingEl.style.display = "none";
        if (contentEl) {
          contentEl.innerHTML = `<div class="empty-state">${ICONS.inbox}<p>${esc(e.message)}</p></div>`;
          contentEl.style.display = "block";
        }
      }
    }
  }

  async function doAdminLogout() {
    if (!(await confirmDialog(t("confirmLogout")))) return;
    await apiFetch("/api/admin/logout", { method: "POST" });
    adminState.loggedIn = false;
    adminState.name = "";
    adminState.role = "";
    updateHeaderAdmin();
    toast(t("logoutSuccess"), "info");
    location.hash = "#/";
    location.reload();
  }

  function updateHeaderAdmin() {
    const btnAdmin = document.getElementById("btn-admin");
    if (!btnAdmin) return;
    if (adminState.loggedIn) {
      btnAdmin.outerHTML = `
        <a href="#/admin" id="btn-admin-panel" class="btn btn-ghost btn-sm" title="${t("adminPanel")}">${ICONS.edit} ${esc(adminState.name)}</a>
        <button id="btn-logout" class="btn btn-ghost btn-sm" title="${t("logout")}">${t("logout")}</button>
      `;
      const btnLogout = document.getElementById("btn-logout");
      if (btnLogout) btnLogout.addEventListener("click", doAdminLogout);
    } else {
      // Ensure clean state if previously logged in
      const existingPanel = document.getElementById("btn-admin-panel");
      const existingLogout = document.getElementById("btn-logout");
      if (existingPanel) existingPanel.remove();
      if (existingLogout) existingLogout.remove();
      if (!document.getElementById("btn-admin")) {
        const nav = document.querySelector(".nav-actions");
        if (nav) {
          const newBtn = document.createElement("button");
          newBtn.id = "btn-admin";
          newBtn.className = "btn btn-ghost btn-sm";
          newBtn.title = t("adminLogin");
          newBtn.textContent = t("login");
          newBtn.addEventListener("click", showLoginModal);
          nav.insertBefore(newBtn, document.getElementById("btn-create"));
        }
      } else {
        btnAdmin.textContent = t("login");
        btnAdmin.title = t("adminLogin");
        btnAdmin.onclick = () => showLoginModal();
      }
    }
  }

  function showLoginModal() {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2>${t("adminLogin")}</h2>
          <button class="btn btn-ghost btn-sm" id="login-close">${ICONS.x}</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>${t("adminToken")}</label>
            <input class="form-input" type="password" id="login-token" placeholder="${t("enterToken")}" />
            <div class="form-hint">${t("adminTokenHint")}</div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" id="login-cancel">${t("cancel")}</button>
          <button class="btn btn-primary" id="login-submit">${t("login")}</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    overlay.querySelector("#login-close").addEventListener("click", close);
    overlay.querySelector("#login-cancel").addEventListener("click", close);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });

    overlay.querySelector("#login-submit").addEventListener("click", async () => {
      const token = overlay.querySelector("#login-token").value.trim();
      if (!token) {
        toast(t("adminTokenRequired"), "error");
        return;
      }
      try {
        await doAdminLogin(token);
        close();
      } catch (e) {
        toast(e.message, "error");
      }
    });
  }

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

  const cache = {
    voteById: new Map(),
  };

  // ── Device Fingerprint ─────────────────────────────────────
  async function generateFingerprint() {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + "x" + screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      navigator.platform,
      navigator.hardwareConcurrency || 0,
      navigator.maxTouchPoints || 0,
    ];

    // Canvas fingerprint (lightweight)
    try {
      const c = document.createElement("canvas");
      c.width = 200;
      c.height = 50;
      const ctx = c.getContext("2d");
      ctx.textBaseline = "top";
      ctx.font = "14px Arial";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = "#069";
      ctx.fillText("VotelyFP", 2, 15);
      ctx.fillStyle = "rgba(102,204,0,0.7)";
      ctx.fillText("VotelyFP", 4, 17);
      components.push(c.toDataURL());
    } catch {
      components.push("no-canvas");
    }

    const raw = components.join("||");
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
    const arr = Array.from(new Uint8Array(buf));
    return arr.map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 64);
  }

  // ── Proof-of-Work solver ───────────────────────────────────
  async function solvePow(challenge, difficulty) {
    const zeroBytes = Math.floor(difficulty / 8);
    const zeroBitsRem = difficulty % 8;
    const mask = 0xff << (8 - zeroBitsRem);

    for (let nonce = 0; nonce < 5_000_000; nonce++) {
      const input = challenge + nonce;
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
      const h = new Uint8Array(buf);

      let ok = true;
      for (let i = 0; i < zeroBytes; i++) {
        if (h[i] !== 0) { ok = false; break; }
      }
      if (ok && zeroBitsRem && (h[zeroBytes] & mask) !== 0) ok = false;

      if (ok) return nonce;
    }
    return -1; // failed
  }

  async function apiFetch(path, options) {
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
          // FastAPI validation errors: [{loc, msg, type}, ...]
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

  function toVoteListVm(v) {
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

  function toVoteDetailVm(v) {
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

  // ── Helpers ────────────────────────────────────────────────
  const $ = (sel) => document.querySelector(sel);
  const app = () => $("#app");

  function formatDate(iso) {
    const d = new Date(iso);
    const locale = currentLang === "zh" ? "zh-CN" : "en-US";
    return d.toLocaleDateString(locale, { year: "numeric", month: "2-digit", day: "2-digit" });
  }

  function formatDateTime(iso) {
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

  function totalVotes(vote) {
    if (typeof vote.totalVotes === "number") return vote.totalVotes;
    return 0;
  }

  function statusLabel(status) {
    const map = { pending: t("pending"), active: t("active"), ended: t("ended") };
    return map[status] || status;
  }

  function statusBadge(status) {
    return `<span class="badge badge-${status}"><span class="badge-dot"></span>${statusLabel(status)}</span>`;
  }

  function toast(message, type = "info") {
    let container = $(".toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      document.body.appendChild(container);
    }
    const el = document.createElement("div");
    el.className = `toast toast-${type}`;
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateX(16px)";
      el.style.transition = "200ms ease";
      setTimeout(() => el.remove(), 200);
    }, 3000);
  }

  // ── Router ─────────────────────────────────────────────────
  async function route() {
    const hash = location.hash || "#/";
    const root = app();
    root.innerHTML = "";

    if (hash === "#/" || hash === "#") {
      await renderList(root);
    } else if (hash === "#/admin") {
      await renderAdmin(root);
    } else if (hash.startsWith("#/vote/")) {
      const id = hash.replace("#/vote/", "");
      await renderDetailById(root, id);
    } else if (hash.startsWith("#/result/")) {
      const id = hash.replace("#/result/", "");
      await renderResultById(root, id);
    } else {
      renderNotFound(root);
    }
  }

  window.addEventListener("hashchange", route);
  window.addEventListener("DOMContentLoaded", route);

  // ── List View ──────────────────────────────────────────────
  async function renderList(root) {
    root.innerHTML = `
      <div class="search-bar">
        ${ICONS.search}
        <input type="text" id="search-input" placeholder="${t("searchPlaceholder")}" />
      </div>
      <div class="vote-list" id="vote-list"></div>
    `;

    const input = $("#search-input");
    const listEl = $("#vote-list");

    async function render(query) {
      listEl.innerHTML = `
        <div class="empty-state">
          ${ICONS.inbox}
          <p>${t("loading")}</p>
        </div>
      `;

      let items;
      try {
        const qv = (query || "").trim();
        const data = await apiFetch(`/api/votes?q=${encodeURIComponent(qv)}&limit=50&offset=0`);
        items = data.map(toVoteListVm);
      } catch (e) {
        listEl.innerHTML = `
          <div class="empty-state">
            ${ICONS.inbox}
            <p>${e.message}</p>
          </div>
        `;
        return;
      }

      if (items.length === 0) {
        listEl.innerHTML = `
          <div class="empty-state">
            ${ICONS.inbox}
            <p>${t("noVotesFound")}</p>
          </div>
        `;
        return;
      }

      listEl.innerHTML = items
        .map(
          (v) => `
        <div class="vote-card" data-id="${esc(v.id)}">
          <div class="vote-card-header">
            <span class="vote-card-title">${esc(v.title)}</span>
            ${statusBadge(v.status)}
          </div>
          <div class="vote-card-meta">
            <span class="meta-item">${ICONS.clock}${formatDate(v.startTime)} - ${formatDate(v.endTime)}</span>
            <span class="meta-item">${ICONS.users}${totalVotes(v)} ${t("votes")}</span>
          </div>
        </div>
      `
        )
        .join("");

      listEl.querySelectorAll(".vote-card").forEach((card) => {
        card.addEventListener("click", () => {
          location.hash = `#/vote/${card.dataset.id}`;
        });
      });
    }

    let lastReq = 0;
    input.addEventListener("input", async () => {
      const reqId = ++lastReq;
      await render(input.value);
      if (reqId !== lastReq) return;
    });
    await render("");
  }

  // ── Detail View ────────────────────────────────────────────
  function renderLoading(root) {
    root.innerHTML = `
      <div class="loading-state">
        <div class="spinner"></div>
        <p>${t("loading")}</p>
      </div>
    `;
  }

  async function renderDetailById(root, voteId) {
    renderLoading(root);
    let vote;
    try {
      const data = await apiFetch(`/api/votes/${encodeURIComponent(voteId)}`);
      vote = toVoteDetailVm(data);
      cache.voteById.set(voteId, vote);
    } catch (e) {
      if (e.status === 404) renderNotFound(root);
      else {
        root.innerHTML = `
          <div class="empty-state">
            ${ICONS.inbox}
            <p>${e.message}</p>
          </div>
        `;
      }
      return;
    }
    renderDetail(root, vote);
  }

  function renderDetail(root, vote) {
    if (vote.mode === "tiered") {
      renderTieredDetail(root, vote);
      return;
    }
    const isEnded = vote.status === "ended";
    const isPending = vote.status === "pending";
    const isActive = vote.status === "active";

    let selectedOptions = new Set();

    root.innerHTML = `
      <div class="detail-header">
        <a href="#/" class="detail-back">${ICONS.arrowLeft}${t("backToList")}</a>
        <div class="detail-title-row">
          <h1 class="detail-title">${esc(vote.title)}</h1>
          <button class="btn btn-ghost btn-sm btn-detail-share" title="${t("shareLink")}">${ICONS.copy}</button>
        </div>
        <div class="detail-meta">
          ${statusBadge(vote.status)}
          <span class="meta-item">${ICONS.clock}${formatDateTime(vote.startTime)} - ${formatDateTime(vote.endTime)}</span>
          <span class="meta-item">${ICONS.users}${totalVotes(vote)} ${t("votes")}</span>
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-section-title">${t("rules")}</div>
        <div class="rules-card">
          <ul>
            <li>${t("ruleMaxChoices", { n: vote.maxChoices, s: vote.maxChoices > 1 ? "s" : "" })}</li>
            <li>${t("ruleActiveOnly")}</li>
            <li>${t("ruleNoDuplicate")}</li>
            <li>${vote.resultVisibility === "after_end" ? t("ruleResultAfterEnd") : t("ruleResultAfter")}</li>
          </ul>
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-section-title">${t("options")}</div>
        <div class="options-list" id="options-list">
          ${vote.options
            .map(
              (o) => `
            <div class="option-item" data-oid="${esc(o.id)}">
              <div class="option-radio"><div class="option-radio-inner"></div></div>
              <span class="option-label">${esc(o.text)}</span>
            </div>
          `
            )
            .join("")}
        </div>
      </div>

      <div class="vote-action" id="vote-action">
        ${
          isEnded
            ? `<a href="#/result/${vote.id}" class="btn btn-primary">${ICONS.barChart}${t("viewResults")}</a>`
            : isPending
            ? `<button class="btn btn-outline" disabled>${t("notStartedYet")}</button>`
            : `<button class="btn btn-ghost" id="btn-view-result">${ICONS.barChart}${t("viewResults")}</button>
               <button class="btn btn-primary" id="btn-submit" disabled>${t("submitVote")}</button>`
        }
      </div>
    `;

    // Share button
    const shareBtn = root.querySelector(".btn-detail-share");
    if (shareBtn) {
      shareBtn.addEventListener("click", () => {
        const url = `${location.origin}${location.pathname}#/vote/${vote.id}`;
        navigator.clipboard.writeText(url).then(() => toast(t("linkCopied"), "success"));
      });
    }

    // Option selection
    const optionItems = root.querySelectorAll(".option-item");
    optionItems.forEach((item) => {
      item.addEventListener("click", () => {
        if (!isActive) return;
        const oid = item.dataset.oid;
        if (vote.maxChoices === 1) {
          selectedOptions.clear();
          optionItems.forEach((i) => i.classList.remove("selected"));
          selectedOptions.add(oid);
          item.classList.add("selected");
        } else {
          if (selectedOptions.has(oid)) {
            selectedOptions.delete(oid);
            item.classList.remove("selected");
          } else if (selectedOptions.size < vote.maxChoices) {
            selectedOptions.add(oid);
            item.classList.add("selected");
          } else {
            toast(t("maxOptionsWarning", { n: vote.maxChoices }), "error");
            return;
          }
        }
        const submitBtn = $("#btn-submit");
        if (submitBtn) submitBtn.disabled = selectedOptions.size === 0;
      });
    });

    // Submit
    const submitBtn = $("#btn-submit");
    if (submitBtn) {
      submitBtn.addEventListener("click", async () => {
        if (selectedOptions.size === 0) return;
        submitBtn.disabled = true;
        try {
          const fp = await generateFingerprint();
          // Fetch PoW challenge
          const powData = await apiFetch("/api/pow/challenge");
          const nonce = await solvePow(powData.challenge, powData.difficulty);
          if (nonce < 0) {
            toast(t("errPowFailed"), "error");
            submitBtn.disabled = false;
            return;
          }
          await apiFetch(`/api/votes/${encodeURIComponent(vote.id)}/submit`, {
            method: "POST",
            body: JSON.stringify({
              choices: Array.from(selectedOptions),
              fingerprint: fp,
              powChallenge: powData.challenge,
              powNonce: nonce,
            }),
          });
          toast(t("submitSuccess"), "success");
          location.hash = `#/result/${vote.id}`;
        } catch (e) {
          toast(e.message, "error");
          submitBtn.disabled = false;
        }
      });
    }

    // View result link (for active votes)
    const viewResultBtn = $("#btn-view-result");
    if (viewResultBtn) {
      viewResultBtn.addEventListener("click", async () => {
        viewResultBtn.disabled = true;
        try {
          await apiFetch(`/api/votes/${encodeURIComponent(vote.id)}/results`);
          location.hash = `#/result/${vote.id}`;
        } catch (e) {
          if (e.status === 403) {
            toast(t("submitToView"), "error");
          } else {
            toast(e.message, "error");
          }
        } finally {
          viewResultBtn.disabled = false;
        }
      });
    }
  }

  // ── Result View ────────────────────────────────────────────
  async function renderResultById(root, voteId) {
    renderLoading(root);
    let vote;
    try {
      const v = cache.voteById.get(voteId);
      if (v) vote = v;
      else {
        const data = await apiFetch(`/api/votes/${encodeURIComponent(voteId)}`);
        vote = toVoteDetailVm(data);
      }
    } catch (e) {
      if (e.status === 404) renderNotFound(root);
      else {
        root.innerHTML = `
          <div class="empty-state">
            ${ICONS.inbox}
            <p>${e.message}</p>
          </div>
        `;
      }
      return;
    }

    let results;
    try {
      results = await apiFetch(`/api/votes/${encodeURIComponent(voteId)}/results`);
    } catch (e) {
      if (e.status === 403) {
        toast(t("submitToView"), "error");
        location.hash = `#/vote/${voteId}`;
        return;
      }
      root.innerHTML = `
        <div class="empty-state">
          ${ICONS.inbox}
          <p>${e.message}</p>
        </div>
      `;
      return;
    }

    renderResult(root, vote, results);
  }

  function renderResult(root, vote, results) {
    const total = results.total;
    const maxVotes = Math.max(...results.items.map((o) => o.votes), 0);

    root.innerHTML = `
      <div class="detail-header">
        <a href="#/" class="detail-back">${ICONS.arrowLeft}${t("backToList")}</a>
        <h1 class="detail-title">${vote.title}</h1>
        <div class="detail-meta">
          ${statusBadge(vote.status)}
          <span class="meta-item">${ICONS.users}${total} ${t("votesTotal")}</span>
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-section-title">${t("results")}</div>
        <div class="result-bars">
          ${results.items
            .map((o) => {
              const pct = o.percent;
              const isWinner = o.votes === maxVotes && maxVotes > 0;
              return `
              <div class="result-item">
                <div class="result-item-header">
                  <span class="result-item-label">${esc(o.text)}</span>
                  <span class="result-item-stats">${o.votes} ${t("votes")} (${pct.toFixed(1)}%)</span>
                </div>
                <div class="result-bar-track">
                  <div class="result-bar-fill ${isWinner ? "winner" : ""}" style="width: ${pct}%"></div>
                </div>
              </div>
            `;
            })
            .join("")}
        </div>
      </div>

      <div class="result-summary">
        <div class="result-summary-stat">
          <div class="stat-value">${total}</div>
          <div class="stat-label">${t("totalVotes")}</div>
        </div>
        <div class="result-summary-stat">
          <div class="stat-value">${vote.options.length}</div>
          <div class="stat-label">${t("optionsCount")}</div>
        </div>
        <div class="result-summary-stat">
          <div class="stat-value">${vote.maxChoices}</div>
          <div class="stat-label">${t("maxChoices")}</div>
        </div>
      </div>
    `;
  }

  // ── Admin Panel ────────────────────────────────────────────
  async function renderAdmin(root) {
    if (!adminState.loggedIn) {
      await checkAdminLogin();
    }
    if (!adminState.loggedIn) {
      showLoginModal();
      location.hash = "#/";
      return;
    }

    root.innerHTML = `
      <div class="admin-header">
        <h2>${t("adminPanel")}</h2>
        <span class="admin-role-badge">${esc(adminState.name)} (${adminState.role})</span>
      </div>
      <div class="admin-votes" id="admin-votes">
        <div class="empty-state">${ICONS.inbox}<p>${t("loading")}</p></div>
      </div>
    `;

    const listEl = document.getElementById("admin-votes");
    try {
      const data = await apiFetch("/api/admin/votes");
      const items = data.map(toVoteListVm);
      if (items.length === 0) {
        listEl.innerHTML = `<div class="empty-state">${ICONS.inbox}<p>${t("noVotesFound")}</p></div>`;
        return;
      }
      listEl.innerHTML = items.map((v) => `
        <div class="admin-vote-card" data-id="${esc(v.id)}">
          <div class="admin-vote-info">
            <a href="#/vote/${v.id}" class="vote-link">${esc(v.title)}</a>
            <div class="admin-vote-meta">
              <span class="badge badge-${v.status}">${t(v.status)}</span>
              <span>${v.totalVotes} ${t("votesTotal")}</span>
              <span>${formatDate(v.startTime)} → ${formatDate(v.endTime)}</span>
            </div>
          </div>
          <div class="admin-vote-actions">
            <button class="btn btn-ghost btn-sm btn-share" data-id="${esc(v.id)}" title="${t("shareLink")}">${ICONS.share}</button>
            <button class="btn btn-ghost btn-sm btn-edit" data-id="${esc(v.id)}" title="${t("edit")}">${ICONS.edit}</button>
            ${v.status !== "ended" ? `<button class="btn btn-ghost btn-sm btn-end" data-id="${esc(v.id)}" title="${t("endVote")}">${ICONS.stop}</button>` : ""}
            <button class="btn btn-ghost btn-sm btn-delete" data-id="${esc(v.id)}" title="${t("deleteVote")}">${ICONS.trash}</button>
          </div>
        </div>
      `).join("");

      // Bind actions
      listEl.querySelectorAll(".btn-share").forEach((btn) => {
        btn.addEventListener("click", () => {
          const vid = btn.dataset.id;
          const url = `${location.origin}${location.pathname}#/vote/${vid}`;
          navigator.clipboard.writeText(url).then(() => toast(t("linkCopied"), "success"));
        });
      });
      listEl.querySelectorAll(".btn-edit").forEach((btn) => {
        btn.addEventListener("click", () => showEditModal(btn.dataset.id));
      });
      listEl.querySelectorAll(".btn-end").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const vid = btn.dataset.id;
          try {
            await apiFetch(`/api/admin/votes/${encodeURIComponent(vid)}/status`, {
              method: "POST",
              body: JSON.stringify({ status: "ended" }),
            });
            toast(t("voteEnded"), "success");
            route();
          } catch (e) {
            if (e && (e.status === 401 || e.status === 403)) {
              adminState.loggedIn = false;
              updateHeaderAdmin();
              showLoginModal();
              return;
            }
            toast(e.message, "error");
          }
        });
      });
      listEl.querySelectorAll(".btn-delete").forEach((btn) => {
        btn.addEventListener("click", async () => {
          if (!(await confirmDialog(t("confirmDelete")))) return;
          const vid = btn.dataset.id;
          try {
            await apiFetch(`/api/admin/votes/${encodeURIComponent(vid)}`, { method: "DELETE" });
            toast(t("voteDeleted"), "success");
            route();
          } catch (e) {
            if (e && (e.status === 401 || e.status === 403)) {
              adminState.loggedIn = false;
              updateHeaderAdmin();
              showLoginModal();
              return;
            }
            toast(e.message, "error");
          }
        });
      });
    } catch (e) {
      listEl.innerHTML = `<div class="empty-state">${ICONS.inbox}<p>${e.message}</p></div>`;
    }
  }

  async function showEditModal(voteId) {
    let vote;
    try {
      const data = await apiFetch(`/api/votes/${encodeURIComponent(voteId)}`);
      vote = toVoteDetailVm(data);
    } catch (e) { toast(e.message, "error"); return; }

    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2>${t("editVote")}</h2>
          <button class="btn-ghost" id="edit-close">${ICONS.x}</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>${t("title")}</label>
            <input class="form-input" type="text" id="edit-title" value="${esc(vote.title)}" />
          </div>
          <div class="form-group">
            <label>${t("description")}</label>
            <textarea class="form-input" id="edit-desc">${esc(vote.description)}</textarea>
          </div>
          <div class="form-group" ${vote.mode === "tiered" ? 'style="display:none"' : ""}>
            <label>${t("maxChoicesPerVoter")}</label>
            <input class="form-input" type="number" id="edit-max" value="${vote.maxChoices}" min="1" max="50" />
          </div>
          ${vote.mode === "tiered" ? `<div class="form-group">
            <label>${t("tierWeightsLabel")}</label>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
              <input class="form-input" type="number" id="edit-weight-main" value="${(vote.tierWeights && vote.tierWeights.main != null) ? vote.tierWeights.main : 4}" min="0" />
              <input class="form-input" type="number" id="edit-weight-secondary" value="${(vote.tierWeights && vote.tierWeights.secondary != null) ? vote.tierWeights.secondary : 2}" min="0" />
              <input class="form-input" type="number" id="edit-weight-normal" value="${(vote.tierWeights && vote.tierWeights.normal != null) ? vote.tierWeights.normal : 1}" min="0" />
            </div>
            <div style="margin-top:6px;color:var(--text-muted);font-size:0.85rem">${t("tierWeightsHint")}</div>
          </div>` : ""}
          ${vote.mode === "tiered" ? `<div class="form-group">
            <label>${t("navRules")}</label>
            <textarea class="form-input" id="edit-rules-text" rows="4" style="resize:vertical">${esc(vote.rulesText || "")}</textarea>
          </div>` : ""}
          <div class="form-group">
            <label>${t("options")}</label>
            <div id="edit-option-inputs">
              ${vote.options.map((o, i) => `
                <div class="option-input-row" data-idx="${i}">
                  <input class="form-input" type="text" value="${esc(o.text)}" data-oid="${o.id}" />
                  ${vote.options.length > 2 ? `<button class="btn-remove" type="button">${ICONS.x}</button>` : ""}
                </div>
              `).join("")}
            </div>
            <button class="btn btn-ghost btn-sm" id="edit-add-option">+ ${t("addOption")}</button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" id="edit-cancel">${t("cancel")}</button>
          <button class="btn btn-primary" id="edit-submit">${t("save")}</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    overlay.querySelector("#edit-close").addEventListener("click", close);
    overlay.querySelector("#edit-cancel").addEventListener("click", close);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });

    // Add/remove option rows
    const optInputs = overlay.querySelector("#edit-option-inputs");
    const editOpts = vote.options.map((o) => ({ id: o.id, text: o.text }));

    function renderEditOpts() {
      optInputs.innerHTML = editOpts.map((o, i) => `
        <div class="option-input-row" data-idx="${i}">
          <input class="form-input" type="text" value="${esc(o.text)}" data-oid="${o.id}" />
          ${editOpts.length > 2 ? `<button class="btn-remove" type="button">${ICONS.x}</button>` : ""}
        </div>
      `).join("");
      optInputs.querySelectorAll(".btn-remove").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.closest(".option-input-row").dataset.idx);
          editOpts.splice(idx, 1);
          renderEditOpts();
        });
      });
    }

    overlay.querySelector("#edit-add-option").addEventListener("click", () => {
      editOpts.push({ id: `new-${editOpts.length}`, text: "" });
      renderEditOpts();
    });

    // Submit
    overlay.querySelector("#edit-submit").addEventListener("click", async () => {
      // Sync current values
      optInputs.querySelectorAll(".option-input-row").forEach((row, i) => {
        const input = row.querySelector("input");
        if (editOpts[i]) editOpts[i].text = input.value;
      });

      const title = overlay.querySelector("#edit-title").value.trim();
      const desc = overlay.querySelector("#edit-desc").value.trim();
      const maxChoices = parseInt(overlay.querySelector("#edit-max").value) || 1;
      const options = editOpts.map((o) => o.text.trim()).filter((v) => v);

      if (!title) { toast(t("titleRequired"), "error"); return; }
      if (options.length < 2) { toast(t("atLeast2Options"), "error"); return; }

      try {
        await apiFetch(`/api/admin/votes/${encodeURIComponent(voteId)}`, {
          method: "PUT",
          body: JSON.stringify({
            title,
            description: desc,
            maxChoices,
            options,
            ...(vote.mode === "tiered"
              ? {
                  rulesText: (overlay.querySelector("#edit-rules-text") || {}).value || "",
                  tierWeights: {
                    main: parseInt((overlay.querySelector("#edit-weight-main") || {}).value || "4") || 0,
                    secondary: parseInt((overlay.querySelector("#edit-weight-secondary") || {}).value || "2") || 0,
                    normal: parseInt((overlay.querySelector("#edit-weight-normal") || {}).value || "1") || 0,
                  },
                }
              : {}),
          }),
        });
        close();
        toast(t("voteUpdated") || "Updated", "success");
        route();
      } catch (e) {
        toast(e.message, "error");
      }
    });
  }

  // ── Not Found ──────────────────────────────────────────────
  function renderNotFound(root) {
    root.innerHTML = `
      <div class="empty-state">
        ${ICONS.inbox}
        <p>${t("voteNotFound")}</p>
        <a href="#/" class="btn btn-outline" style="margin-top:16px">${t("backToList")}</a>
      </div>
    `;
  }

  // ── Language Toggle ────────────────────────────────────────
  const btnLang = document.getElementById("btn-lang");
  if (btnLang) {
    btnLang.textContent = currentLang === "zh" ? t("langEn") : t("langZh");
    btnLang.addEventListener("click", () => {
      setLang(currentLang === "zh" ? "en" : "zh");
    });
  }

  // ── Create Vote Modal ──────────────────────────────────────
  const btnCreate = document.getElementById("btn-create");
  if (btnCreate) {
    btnCreate.addEventListener("click", () => showCreateModal());
  }

  function showCreateModal() {
    if (!adminState.loggedIn) {
      showLoginModal();
      return;
    }

    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";

    const optionRows = [
      { id: "opt-1", value: "" },
      { id: "opt-2", value: "" },
    ];

    function renderOptions() {
      return optionRows
        .map(
          (r, i) => `
        <div class="option-input-row" data-idx="${i}">
          <input class="form-input" type="text" placeholder="${t("optionN", { n: i + 1 })}" value="${r.value}" data-oid="${r.id}" />
          ${
            optionRows.length > 2
              ? `<button class="btn-remove" type="button">${ICONS.x}</button>`
              : ""
          }
        </div>
      `
        )
        .join("");
    }

    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2>${t("createVote")}</h2>
          <button class="btn-ghost" id="modal-close">${ICONS.x}</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>${t("title")}</label>
            <input class="form-input" type="text" id="create-title" placeholder="${t("enterVoteTitle")}" />
          </div>
          <div class="form-group">
            <label>${t("description")}</label>
            <textarea class="form-input" id="create-desc" placeholder="${t("describeVote")}"></textarea>
          </div>
          <div class="form-group">
            <label>${t("startTime")}</label>
            <input class="form-input" type="text" id="create-start" readonly placeholder="YYYY-MM-DD HH:mm" />
            <input type="hidden" id="create-start-iso" />
          </div>
          <div class="form-group">
            <label>${t("endTime")}</label>
            <input class="form-input" type="text" id="create-end" readonly placeholder="YYYY-MM-DD HH:mm" />
            <input type="hidden" id="create-end-iso" />
          </div>
          <div class="form-group" id="create-max-wrap">
            <label>${t("maxChoicesPerVoter")}</label>
            <input class="form-input" type="number" id="create-max" value="1" min="1" />
          </div>
          <div class="form-group">
            <label>${t("voteMode")}</label>
            <div class="select" id="create-mode">
              <input type="hidden" id="create-mode-value" value="normal" />
              <button type="button" class="select-trigger" aria-haspopup="listbox" aria-expanded="false">
                <span class="select-trigger-text">${t("modeNormal")}</span>
              </button>
              <div class="select-menu" role="listbox">
                <button type="button" class="select-option" role="option" data-value="normal">${t("modeNormal")}</button>
                <button type="button" class="select-option" role="option" data-value="tiered">${t("modeTiered")}</button>
              </div>
            </div>
          </div>
          <div class="form-group" id="tier-config-wrap" style="display:none">
            <label>${t("tierConfigLabel")}</label>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
              <input class="form-input" type="number" id="tier-main" value="1" min="0" />
              <input class="form-input" type="number" id="tier-secondary" value="2" min="0" />
              <input class="form-input" type="number" id="tier-normal" value="4" min="0" />
            </div>
            <div style="margin-top:6px;color:var(--text-muted);font-size:0.85rem">${t("tierConfigHint")}</div>
          </div>
          <div class="form-group" id="tier-weights-wrap" style="display:none">
            <label>${t("tierWeightsLabel")}</label>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
              <input class="form-input" type="number" id="weight-main" value="4" min="0" />
              <input class="form-input" type="number" id="weight-secondary" value="2" min="0" />
              <input class="form-input" type="number" id="weight-normal" value="1" min="0" />
            </div>
            <div style="margin-top:6px;color:var(--text-muted);font-size:0.85rem">${t("tierWeightsHint")}</div>
          </div>
          <div class="form-group" id="rules-text-wrap" style="display:none">
            <label>${t("navRules")}</label>
            <textarea class="form-input" id="create-rules-text" rows="4" placeholder="${t('defaultRules')}" style="resize:vertical"></textarea>
            <div style="margin-top:4px;color:var(--text-muted);font-size:0.8rem">${t("tierConfigHint")}</div>
          </div>
          <div class="form-group">
            <label>${t("resultVisibility")}</label>
            <div class="select" id="create-result-vis">
              <input type="hidden" id="create-result-vis-value" value="after_vote" />
              <button type="button" class="select-trigger" aria-haspopup="listbox" aria-expanded="false">
                <span class="select-trigger-text">${t("afterVote")}</span>
              </button>
              <div class="select-menu" role="listbox">
                <button type="button" class="select-option" role="option" data-value="after_vote">${t("afterVote")}</button>
                <button type="button" class="select-option" role="option" data-value="after_end">${t("afterEnd")}</button>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label>${t("options")}</label>
            <div class="option-inputs" id="option-inputs">
              ${renderOptions()}
            </div>
            <button class="btn btn-ghost btn-sm" id="add-option" style="margin-top:8px">${ICONS.plus}${t("addOption")}</button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" id="modal-cancel">${t("cancel")}</button>
          <button class="btn btn-primary" id="modal-submit">${t("createBtn")}</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Custom datetime pickers
    const startTextEl = overlay.querySelector("#create-start");
    const endTextEl = overlay.querySelector("#create-end");
    const startIsoEl = overlay.querySelector("#create-start-iso");
    const endIsoEl = overlay.querySelector("#create-end-iso");

    function openFor(textEl, isoEl) {
      const iso = isoEl.value;
      const initial = iso ? new Date(iso) : new Date();
      openDateTimePicker({
        initialDate: initial,
        onConfirm: (d) => {
          isoEl.value = d.toISOString();
          textEl.value = toLocalInputText(d);
        },
      });
    }

    if (startTextEl) {
      startTextEl.addEventListener("click", () => openFor(startTextEl, startIsoEl));
    }
    if (endTextEl) {
      endTextEl.addEventListener("click", () => openFor(endTextEl, endIsoEl));
    }

    // Custom select (result visibility)
    const visWrap = overlay.querySelector("#create-result-vis");
    const visTrigger = overlay.querySelector("#create-result-vis .select-trigger");
    const visText = overlay.querySelector("#create-result-vis .select-trigger-text");
    const visValue = overlay.querySelector("#create-result-vis-value");

    // Custom select (mode)
    const modeWrap = overlay.querySelector("#create-mode");
    const modeTrigger = overlay.querySelector("#create-mode .select-trigger");
    const modeText = overlay.querySelector("#create-mode .select-trigger-text");
    const modeValue = overlay.querySelector("#create-mode-value");
    const tierWrap = overlay.querySelector("#tier-config-wrap");
    const weightsWrap = overlay.querySelector("#tier-weights-wrap");
    const rulesWrap = overlay.querySelector("#rules-text-wrap");
    const maxWrap = overlay.querySelector("#create-max-wrap");

    if (modeWrap && modeTrigger && modeText && modeValue) {
      const menu = modeWrap.querySelector(".select-menu");
      modeTrigger.addEventListener("click", () => {
        modeWrap.classList.toggle("open");
      });
      menu.querySelectorAll(".select-option").forEach((opt) => {
        opt.addEventListener("click", () => {
          const v = opt.dataset.value;
          modeValue.value = v;
          modeText.textContent = v === "tiered" ? t("modeTiered") : t("modeNormal");
          modeWrap.classList.remove("open");
          if (tierWrap) tierWrap.style.display = v === "tiered" ? "block" : "none";
          if (weightsWrap) weightsWrap.style.display = v === "tiered" ? "block" : "none";
          if (rulesWrap) rulesWrap.style.display = v === "tiered" ? "block" : "none";
          if (maxWrap) maxWrap.style.display = v === "normal" ? "block" : "none";
        });
      });
    }

    function closeVisMenu() {
      if (!visWrap) return;
      visWrap.classList.remove("open");
      if (visTrigger) visTrigger.setAttribute("aria-expanded", "false");
    }

    function toggleVisMenu() {
      if (!visWrap) return;
      const willOpen = !visWrap.classList.contains("open");
      if (willOpen) {
        visWrap.classList.add("open");
        if (visTrigger) visTrigger.setAttribute("aria-expanded", "true");
      } else {
        closeVisMenu();
      }
    }

    if (visTrigger) {
      visTrigger.addEventListener("click", (e) => {
        e.preventDefault();
        toggleVisMenu();
      });
    }

    overlay.querySelectorAll("#create-result-vis .select-option").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const v = btn.dataset.value;
        if (v) visValue.value = v;
        if (visText) visText.textContent = btn.textContent || "";
        closeVisMenu();
      });
    });

    // Close
    const close = () => overlay.remove();
    overlay.querySelector("#modal-close").addEventListener("click", close);
    overlay.querySelector("#modal-cancel").addEventListener("click", close);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });

    window.addEventListener(
      "click",
      (e) => {
        if (!visWrap) return;
        const target = e.target;
        if (target instanceof Node && !visWrap.contains(target)) closeVisMenu();
      },
      { capture: true }
    );

    // Add option
    overlay.querySelector("#add-option").addEventListener("click", () => {
      // Sync current values
      syncOptionValues();
      optionRows.push({ id: `opt-${optionRows.length + 1}`, value: "" });
      overlay.querySelector("#option-inputs").innerHTML = renderOptions();
      bindRemoveButtons();
    });

    function syncOptionValues() {
      overlay.querySelectorAll(".option-input-row").forEach((row, i) => {
        const input = row.querySelector("input");
        if (optionRows[i]) optionRows[i].value = input.value;
      });
    }

    function bindRemoveButtons() {
      overlay.querySelectorAll(".btn-remove").forEach((btn) => {
        btn.addEventListener("click", () => {
          syncOptionValues();
          const row = btn.closest(".option-input-row");
          const idx = parseInt(row.dataset.idx);
          optionRows.splice(idx, 1);
          overlay.querySelector("#option-inputs").innerHTML = renderOptions();
          bindRemoveButtons();
        });
      });
    }
    bindRemoveButtons();

    // Submit
    overlay.querySelector("#modal-submit").addEventListener("click", () => {
      syncOptionValues();
      const title = overlay.querySelector("#create-title").value.trim();
      const desc = overlay.querySelector("#create-desc").value.trim();
      const start = overlay.querySelector("#create-start-iso").value;
      const end = overlay.querySelector("#create-end-iso").value;
      const maxChoices = parseInt(overlay.querySelector("#create-max").value) || 1;
      const resultVisibility = overlay.querySelector("#create-result-vis-value").value;
      const opts = optionRows
        .map((r) => r.value.trim())
        .filter((v) => v !== "");

      if (!title) {
        toast(t("titleRequired"), "error");
        return;
      }
      if (opts.length < 2) {
        toast(t("atLeast2Options"), "error");
        return;
      }
      if (!start || !end) {
        toast(t("startEndRequired"), "error");
        return;
      }
      if (new Date(end) <= new Date(start)) {
        toast(t("endAfterStart"), "error");
        return;
      }

      const submitBtn = overlay.querySelector("#modal-submit");
      submitBtn.disabled = true;

      (async () => {
        try {
          const mode = (overlay.querySelector("#create-mode-value") || {}).value || "normal";
          let tierConfig = null;
          let tierWeights = null;
          if (mode === "tiered") {
            const m = parseInt((overlay.querySelector("#tier-main") || {}).value || "1");
            const s = parseInt((overlay.querySelector("#tier-secondary") || {}).value || "2");
            const n = parseInt((overlay.querySelector("#tier-normal") || {}).value || "4");
            tierConfig = {
              main: isNaN(m) ? 1 : m,
              secondary: isNaN(s) ? 2 : s,
              normal: isNaN(n) ? 4 : n,
            };
            const wm = parseInt((overlay.querySelector("#weight-main") || {}).value || "4");
            const ws = parseInt((overlay.querySelector("#weight-secondary") || {}).value || "2");
            const wn = parseInt((overlay.querySelector("#weight-normal") || {}).value || "1");
            tierWeights = {
              main: isNaN(wm) ? 4 : wm,
              secondary: isNaN(ws) ? 2 : ws,
              normal: isNaN(wn) ? 1 : wn,
            };
          }

          const payload = {
            title,
            description: desc,
            startAt: start,
            endAt: end,
            mode,
            tierConfig,
            tierWeights,
            rulesText: (overlay.querySelector("#create-rules-text") || {}).value || "",
            maxChoices,
            resultVisibility,
            options: opts,
          };
          const created = await apiFetch("/api/admin/votes", {
            method: "POST",
            body: JSON.stringify(payload),
          });

          close();
          toast(t("voteCreated"), "success");
          location.hash = `#/vote/${created.id}`;
        } catch (e) {
          toast(e.message, "error");
          submitBtn.disabled = false;
        }
      })();
    });
  }

  // ── Initialize static elements ─────────────────────────────
  document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
  const footerEl = document.querySelector(".app-footer p");
  if (footerEl) footerEl.innerHTML = t("footerText");
  const createSpan = document.querySelector("#btn-create span");
  if (createSpan) createSpan.textContent = t("create");
  checkAdminLogin();
})();

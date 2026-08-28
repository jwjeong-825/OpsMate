const API_BASE = "https://xq4b-bkh8-ih5r.k7.xano.io/api:opsmate";

const form = document.querySelector("#incident-form");
const serviceInput = document.querySelector("#service-name");
const errorInput = document.querySelector("#raw-error");
const analyzeButton = document.querySelector("#analyze-button");
const formError = document.querySelector("#form-error");
const analysisPanel = document.querySelector("#analysis-panel");
const historyList = document.querySelector("#history-list");
const historyError = document.querySelector("#history-error");
const dialog = document.querySelector("#incident-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogContent = document.querySelector("#dialog-content");
const dialogClose = document.querySelector("#dialog-close");

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function bilingualLabel(tag, className, korean, english) {
  const node = element(tag, className);
  node.append(document.createTextNode(korean), element("span", "label-en", english));
  node.querySelector(".label-en").lang = "en";
  return node;
}

function showError(target, message) {
  target.textContent = message;
  target.hidden = false;
}

function clearError(target) {
  target.textContent = "";
  target.hidden = true;
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || `요청에 실패했습니다. 상태 코드: ${response.status}`);
  }
  return payload;
}

function severityBadge(severity) {
  const value = severity || "unknown";
  return element("span", `severity severity-${value}`, value);
}

function statusBadge(status) {
  return element("span", `status status-${status}`, status);
}

function appendList(parent, items) {
  const list = element("ol");
  for (const item of Array.isArray(items) ? items : []) {
    list.append(element("li", "", item));
  }
  parent.append(list);
}

function analysisBlock(title, englishTitle, content, isList = false) {
  const block = element("section", "analysis-block");
  block.append(bilingualLabel("h3", "", title, englishTitle));
  if (isList) appendList(block, content);
  else block.append(element("p", "", content || "분석 결과가 없습니다."));
  return block;
}

function renderAnalysis(incident) {
  analysisPanel.className = "panel result-panel";
  analysisPanel.replaceChildren();

  const header = element("div", "analysis-header");
  const titleWrap = element("div");
  titleWrap.append(element("span", "eyebrow", "분석 완료"));
  titleWrap.append(element("h2", "", incident.service_name));
  header.append(titleWrap, severityBadge(incident.severity));

  analysisPanel.append(
    header,
    analysisBlock("분석 요약", "Summary", incident.ai_summary),
    analysisBlock("가능한 원인", "Possible Causes", incident.possible_causes, true),
    analysisBlock("권장 조치", "Recommended Actions", incident.recommended_actions, true),
  );
}

function formatDate(timestamp) {
  if (!timestamp) return "—";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

function historySummary(incident) {
  return incident.ai_summary || incident.raw_error || "요약이 없습니다.";
}

function renderHistory(incidents) {
  historyList.replaceChildren();
  if (!incidents.length) {
    historyList.append(element("div", "history-empty", "아직 인시던트 기록이 없습니다. 오류를 분석해 첫 기록을 만들어 보세요."));
    return;
  }

  for (const incident of incidents) {
    const row = element("button", "incident-row");
    row.type = "button";
    row.setAttribute("aria-label", `${incident.service_name} 인시던트 ${incident.id} 상세 보기`);
    row.append(
      element("span", "incident-service", incident.service_name),
      element("span", "incident-summary", historySummary(incident)),
      element("span", "incident-meta", formatDate(incident.created_at)),
      statusBadge(incident.status),
    );
    row.addEventListener("click", () => openIncident(incident.id));
    historyList.append(row);
  }
}

async function loadHistory() {
  clearError(historyError);
  try {
    const incidents = await apiRequest("/incidents");
    renderHistory(incidents);
  } catch (error) {
    showError(historyError, `인시던트 기록을 불러오지 못했습니다. ${error.message}`);
  }
}

function detailSection(title, englishTitle, content, isList = false) {
  return analysisBlock(title, englishTitle, content, isList);
}

function renderDialog(incident) {
  dialogTitle.textContent = `${incident.service_name} · #${incident.id}`;
  dialogContent.replaceChildren();

  const metadata = element("div", "detail-grid");
  const severityItem = element("div");
  severityItem.append(bilingualLabel("span", "detail-label", "심각도", "Severity"), severityBadge(incident.severity));
  const statusItem = element("div");
  statusItem.append(bilingualLabel("span", "detail-label", "상태", "Status"), statusBadge(incident.status));
  const createdItem = element("div");
  createdItem.append(bilingualLabel("span", "detail-label", "생성 시각", "Created"), element("span", "", formatDate(incident.created_at)));
  const resolvedItem = element("div");
  resolvedItem.append(bilingualLabel("span", "detail-label", "해결 시각", "Resolved"), element("span", "", formatDate(incident.resolved_at)));
  metadata.append(severityItem, statusItem, createdItem, resolvedItem);

  const rawSection = element("section", "analysis-block");
  rawSection.append(bilingualLabel("h3", "", "원본 오류", "Original Error"), element("pre", "raw-log", incident.raw_error));

  dialogContent.append(
    metadata,
    rawSection,
    detailSection("분석 요약", "Summary", incident.ai_summary),
    detailSection("가능한 원인", "Possible Causes", incident.possible_causes, true),
    detailSection("권장 조치", "Recommended Actions", incident.recommended_actions, true),
  );

  if (incident.status === "open") {
    const resolveButton = element("button", "resolve-button", "해결됨으로 표시");
    resolveButton.type = "button";
    resolveButton.addEventListener("click", async () => {
      resolveButton.disabled = true;
      resolveButton.textContent = "처리 중…";
      try {
        const updated = await apiRequest(`/incidents/${incident.id}`, {
          method: "PATCH",
          body: JSON.stringify({ status: "resolved" }),
        });
        renderDialog(updated);
        renderAnalysis(updated);
        await loadHistory();
      } catch (error) {
        resolveButton.disabled = false;
        resolveButton.textContent = "다시 해결 처리하기";
        showError(historyError, `인시던트를 해결 처리하지 못했습니다. ${error.message}`);
      }
    });
    dialogContent.append(resolveButton);
  }
}

async function openIncident(id) {
  dialogTitle.textContent = "인시던트를 불러오는 중…";
  dialogContent.replaceChildren(element("div", "history-loading", "상세 정보를 불러오는 중…"));
  if (!dialog.open) dialog.showModal();
  try {
    const incident = await apiRequest(`/incidents/${id}`);
    renderDialog(incident);
  } catch (error) {
    dialogContent.replaceChildren(element("div", "alert", error.message));
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearError(formError);

  const serviceName = serviceInput.value.trim();
  const rawError = errorInput.value.trim();
  if (!serviceName || !rawError) {
    showError(formError, "서비스명과 오류 로그를 모두 입력해 주세요.");
    return;
  }

  analyzeButton.disabled = true;
  analyzeButton.classList.add("loading");
  analyzeButton.querySelector(".button-label").textContent = "분석 중";

  try {
    const incident = await apiRequest("/incidents", {
      method: "POST",
      body: JSON.stringify({ service_name: serviceName, raw_error: rawError }),
    });
    renderAnalysis(incident);
    await loadHistory();
    analysisPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch (error) {
    showError(formError, `오류 분석에 실패했습니다. ${error.message}`);
  } finally {
    analyzeButton.disabled = false;
    analyzeButton.classList.remove("loading");
    analyzeButton.querySelector(".button-label").textContent = "오류 분석";
  }
});

dialogClose.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

loadHistory();

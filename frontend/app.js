const API_BASE = "https://xq4b-bkh8-ih5r.k7.xano.io/api:opsmate";

const form = document.querySelector("#incident-form");
const serviceInput = document.querySelector("#service-name");
const errorInput = document.querySelector("#raw-error");
const analyzeButton = document.querySelector("#analyze-button");
const formError = document.querySelector("#form-error");
const analysisPanel = document.querySelector("#analysis-panel");
const historyList = document.querySelector("#history-list");
const historyError = document.querySelector("#history-error");
const refreshButton = document.querySelector("#refresh-button");
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
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || `Request failed with status ${response.status}.`);
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

function analysisBlock(title, content, isList = false) {
  const block = element("section", "analysis-block");
  block.append(element("h3", "", title));
  if (isList) appendList(block, content);
  else block.append(element("p", "", content || "No analysis available."));
  return block;
}

function renderAnalysis(incident) {
  analysisPanel.className = "panel result-panel";
  analysisPanel.replaceChildren();

  const header = element("div", "analysis-header");
  const titleWrap = element("div");
  titleWrap.append(element("span", "eyebrow", "ANALYSIS COMPLETE"));
  titleWrap.append(element("h2", "", incident.service_name));
  header.append(titleWrap, severityBadge(incident.severity));

  analysisPanel.append(
    header,
    analysisBlock("Summary", incident.ai_summary),
    analysisBlock("Possible causes", incident.possible_causes, true),
    analysisBlock("Recommended actions", incident.recommended_actions, true),
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
  return incident.ai_summary || incident.raw_error || "No summary";
}

function renderHistory(incidents) {
  historyList.replaceChildren();
  if (!incidents.length) {
    historyList.append(element("div", "history-empty", "No incidents yet. Analyze an error to create the first one."));
    return;
  }

  for (const incident of incidents) {
    const row = element("button", "incident-row");
    row.type = "button";
    row.setAttribute("aria-label", `Open incident ${incident.id} for ${incident.service_name}`);
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
  refreshButton.disabled = true;
  try {
    const incidents = await apiRequest("/incidents");
    renderHistory(incidents);
  } catch (error) {
    showError(historyError, `Could not load incident history. ${error.message}`);
  } finally {
    refreshButton.disabled = false;
  }
}

function detailSection(title, content, isList = false) {
  return analysisBlock(title, content, isList);
}

function renderDialog(incident) {
  dialogTitle.textContent = `${incident.service_name} · #${incident.id}`;
  dialogContent.replaceChildren();

  const metadata = element("div", "detail-grid");
  const severityItem = element("div");
  severityItem.append(element("span", "detail-label", "Severity"), severityBadge(incident.severity));
  const statusItem = element("div");
  statusItem.append(element("span", "detail-label", "Status"), statusBadge(incident.status));
  const createdItem = element("div");
  createdItem.append(element("span", "detail-label", "Created"), element("span", "", formatDate(incident.created_at)));
  const resolvedItem = element("div");
  resolvedItem.append(element("span", "detail-label", "Resolved"), element("span", "", formatDate(incident.resolved_at)));
  metadata.append(severityItem, statusItem, createdItem, resolvedItem);

  const rawSection = element("section", "analysis-block");
  rawSection.append(element("h3", "", "Original error"), element("pre", "raw-log", incident.raw_error));

  dialogContent.append(
    metadata,
    rawSection,
    detailSection("Summary", incident.ai_summary),
    detailSection("Possible causes", incident.possible_causes, true),
    detailSection("Recommended actions", incident.recommended_actions, true),
  );

  if (incident.status === "open") {
    const resolveButton = element("button", "resolve-button", "Mark as resolved");
    resolveButton.type = "button";
    resolveButton.addEventListener("click", async () => {
      resolveButton.disabled = true;
      resolveButton.textContent = "Resolving…";
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
        resolveButton.textContent = "Try resolving again";
        showError(historyError, `Could not resolve incident. ${error.message}`);
      }
    });
    dialogContent.append(resolveButton);
  }
}

async function openIncident(id) {
  dialogTitle.textContent = "Loading incident…";
  dialogContent.replaceChildren(element("div", "history-loading", "Fetching details…"));
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
    showError(formError, "Enter both a service name and an error log before analyzing.");
    return;
  }

  analyzeButton.disabled = true;
  analyzeButton.classList.add("loading");
  analyzeButton.querySelector(".button-label").textContent = "Analyzing";

  try {
    const incident = await apiRequest("/incidents", {
      method: "POST",
      body: JSON.stringify({ service_name: serviceName, raw_error: rawError }),
    });
    renderAnalysis(incident);
    await loadHistory();
    analysisPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch (error) {
    showError(formError, `Analysis failed. ${error.message}`);
  } finally {
    analyzeButton.disabled = false;
    analyzeButton.classList.remove("loading");
    analyzeButton.querySelector(".button-label").textContent = "Analyze incident";
  }
});

refreshButton.addEventListener("click", loadHistory);
dialogClose.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

loadHistory();

const reportForm = document.querySelector("#report-form");
const dateObservedInput = document.querySelector("#date-observed");
const photoInput = document.querySelector("#report-photo");
const descriptionInput = document.querySelector("#incident-description");
const characterCount = document.querySelector("#character-count");
const categoryInput = document.querySelector("#report-category");
const categoryDetailWrap = document.querySelector("#category-detail-wrap");
const categoryDetailInput = document.querySelector("#category-detail");
const categoryDetailLabel = document.querySelector("#category-detail-label");
const categoryDetailHelp = document.querySelector("#category-detail-help");
const formStatus = document.querySelector("#report-form-status");
const filePreview = document.querySelector("#file-preview");
const maxPhotoSize = 5 * 1024 * 1024;
const reportsStorageKey = "suriReports";

// Use the visitor's local date so a report cannot be dated in the future.
const localToday = new Date();
localToday.setMinutes(localToday.getMinutes() - localToday.getTimezoneOffset());
const todayValue = localToday.toISOString().slice(0, 10);
dateObservedInput.max = todayValue;
dateObservedInput.value = todayValue;

// Show a relevant optional detail prompt for categories that benefit from more context.
const categoryPrompts = {
  "Damaged facilities / waiting shed": {
    label: "What part of the facility is damaged?",
    placeholder: "e.g. broken bench, damaged roof, cracked structure",
    help: "Mention the affected part and whether the damage limits the use of the waiting area."
  },
  "Missing or damaged signs": {
    label: "What sign is missing or damaged?",
    placeholder: "e.g. missing route sign, unreadable stop marker",
    help: "If possible, describe the route, destination, or information that should appear on the sign."
  },
  "Lighting problems": {
    label: "Describe the lighting problem",
    placeholder: "e.g. streetlight is not working, waiting area is too dim",
    help: "Mention how many lights are affected and whether the area becomes difficult to see."
  },
  "Safety concerns": {
    label: "What safety concern did you observe?",
    placeholder: "e.g. obstructed pedestrian access, exposed wires",
    help: "Describe the potential hazard. For emergencies, contact the appropriate emergency services."
  },
  "Other issue": {
    label: "Additional issue details",
    placeholder: "Briefly identify the other concern",
    help: "Provide enough context for the issue to be understood."
  }
};

categoryInput.addEventListener("change", () => {
  const prompt = categoryPrompts[categoryInput.value];
  categoryDetailWrap.hidden = !prompt;
  if (prompt) {
    categoryDetailLabel.textContent = prompt.label;
    categoryDetailInput.placeholder = prompt.placeholder;
    categoryDetailHelp.textContent = prompt.help;
  } else {
    categoryDetailInput.value = "";
  }
});

descriptionInput.addEventListener("input", () => {
  characterCount.textContent = `${descriptionInput.value.length} / 500`;
});

photoInput.addEventListener("change", () => {
  const photo = photoInput.files[0];
  filePreview.textContent = photo ? `Selected: ${photo.name}` : "";
  photoInput.setCustomValidity("");
});

const clearCustomError = (event) => event.target.setCustomValidity("");
reportForm.addEventListener("input", clearCustomError);
reportForm.addEventListener("change", clearCustomError);

reportForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.hidden = true;

  const photo = photoInput.files[0];
  const photoIsValid = !photo || (
    ["image/jpeg", "image/png"].includes(photo.type) &&
    photo.size <= maxPhotoSize
  );
  photoInput.setCustomValidity(photoIsValid ? "" : "Upload a JPG or PNG image no larger than 5 MB.");

  dateObservedInput.setCustomValidity(
    dateObservedInput.value <= todayValue ? "" : "The date observed cannot be in the future."
  );

  reportForm.classList.add("was-validated");
  if (!reportForm.reportValidity()) return;

const reportNumber = `MH-${todayValue.replace(/-/g, "")}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  const report = {
    reportNumber,
    status: "pending",
    category: categoryInput.value,
    severity: reportForm.elements.severity.value,
    description: descriptionInput.value.trim(),
    categoryDetail: categoryDetailInput.value.trim(),
    sender: document.querySelector("#full-name").value.trim(),
    email: document.querySelector("#email-address").value.trim(),
    location: document.querySelector("#location").value.trim(),
    receivedDate: dateObservedInput.value,
    observedTime: document.querySelector("#time-observed").value,
    screenshotName: photo ? photo.name : "",
    submittedAt: new Date().toISOString(),
    verdict: ""
  };

  try {
    const savedReports = JSON.parse(localStorage.getItem(reportsStorageKey) || "{}");
    savedReports[reportNumber] = report;
    localStorage.setItem(reportsStorageKey, JSON.stringify(savedReports));
    // The existing Track Report page reads the same local-storage collection.
    window.location.href = `track.html?report=${encodeURIComponent(reportNumber)}`;
  } catch {
    formStatus.textContent = "Your browser could not save this demonstration report. Please check browser storage settings and try again.";
    formStatus.hidden = false;
  }
});

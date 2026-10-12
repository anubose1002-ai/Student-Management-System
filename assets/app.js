(() => {
  const $ = (selector) => document.querySelector(selector);
  const STORAGE_KEY = "student-os-demo-records-v1";
  const seed = [
    { id: "seed-1", name: "Aarav Mehta", roll: "BCA-001", course: "BCA", email: "aarav@example.com", status: "Active" },
    { id: "seed-2", name: "Ananya Rao", roll: "BCA-014", course: "BCA", email: "ananya@example.com", status: "Active" },
    { id: "seed-3", name: "Kabir Das", roll: "BSC-008", course: "B.Sc. CS", email: "kabir@example.com", status: "Active" },
    { id: "seed-4", name: "Meera Nair", roll: "BBA-021", course: "BBA", email: "meera@example.com", status: "Active" }
  ];
  let records = loadRecords();
  let toastTimer;

  function loadRecords() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : seed.map(item => ({ ...item }));
    } catch {
      return seed.map(item => ({ ...item }));
    }
  }
  function saveRecords() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); }
    catch { showToast("Browser storage unavailable; changes may not persist."); }
  }
  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, ch => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));
  }
  function initials(name) {
    return name.trim().split(/\s+/).slice(0, 2).map(part => part[0] || "").join("").toUpperCase();
  }
  function render() {
    const query = ($("#searchInput").value || "").trim().toLowerCase();
    const filtered = records.filter(record =>
      [record.name, record.roll, record.course, record.email].some(value => String(value || "").toLowerCase().includes(query))
    );
    $("#studentRows").innerHTML = filtered.map(record => `
      <tr>
        <td><div class="student-person"><span class="avatar">${escapeHtml(initials(record.name))}</span><span><strong>${escapeHtml(record.name)}</strong><small>Student</small></span></div></td>
        <td>${escapeHtml(record.roll)}</td>
        <td><span class="course-tag">${escapeHtml(record.course)}</span></td>
        <td>${escapeHtml(record.email || "—")}</td>
        <td><span class="status-tag"><i class="status-dot"></i> ${escapeHtml(record.status || "Active")}</span></td>
        <td><div class="row-actions"><button type="button" data-edit="${escapeHtml(record.id)}">Edit</button><button type="button" class="delete-btn" data-delete="${escapeHtml(record.id)}">Delete</button></div></td>
      </tr>`).join("");
    $("#emptyState").hidden = filtered.length > 0;
    $("#recordCount").textContent = `Showing ${filtered.length} of ${records.length} record${records.length === 1 ? "" : "s"}`;
    $("#totalMetric").textContent = String(records.length).padStart(2, "0");
    $("#courseMetric").textContent = String(new Set(records.map(r => r.course.trim().toLowerCase()).filter(Boolean)).size).padStart(2, "0");
    $("#addedMetric").textContent = String(records.filter(r => !String(r.id).startsWith("seed-")).length).padStart(2, "0");
  }
  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }
  function openDialog(record) {
    $("#studentForm").reset();
    $("#studentId").value = record?.id || "";
    $("#dialogTitle").textContent = record ? "Edit student" : "Add student";
    if (record) {
      $("#studentName").value = record.name;
      $("#studentRoll").value = record.roll;
      $("#studentCourse").value = record.course;
      $("#studentEmail").value = record.email || "";
    }
    $("#studentDialog").showModal();
    $("#studentName").focus();
  }
  function closeDialog() { $("#studentDialog").close(); }

  $("#addStudentBtn").addEventListener("click", () => openDialog(null));
  $("#closeDialog").addEventListener("click", closeDialog);
  $("#cancelDialog").addEventListener("click", closeDialog);
  $("#searchInput").addEventListener("input", render);
  $("#studentRows").addEventListener("click", event => {
    const editButton = event.target.closest("[data-edit]");
    const deleteButton = event.target.closest("[data-delete]");
    if (editButton) {
      const record = records.find(item => item.id === editButton.dataset.edit);
      if (record) openDialog(record);
    }
    if (deleteButton) {
      const record = records.find(item => item.id === deleteButton.dataset.delete);
      if (!record) return;
      if (window.confirm(`Delete demo record for ${record.name}?`)) {
        records = records.filter(item => item.id !== record.id);
        saveRecords(); render(); showToast("Demo record deleted.");
      }
    }
  });
  $("#studentForm").addEventListener("submit", event => {
    event.preventDefault();
    const id = $("#studentId").value;
    const name = $("#studentName").value.trim();
    const roll = $("#studentRoll").value.trim();
    const course = $("#studentCourse").value.trim();
    const email = $("#studentEmail").value.trim();
    if (!name || !roll || !course) { showToast("Name, roll number, and course are required."); return; }
    if (records.some(item => item.roll.toLowerCase() === roll.toLowerCase() && item.id !== id)) {
      showToast("That roll number already exists."); return;
    }
    if (id) {
      records = records.map(item => item.id === id ? { ...item, name, roll, course, email } : item);
      showToast("Demo record updated.");
    } else {
      records.unshift({ id: `local-${Date.now()}-${Math.random().toString(16).slice(2)}`, name, roll, course, email, status: "Active" });
      showToast("Demo record added.");
    }
    saveRecords(); render(); closeDialog();
  });

  const menuToggle = $("#menuToggle");
  const nav = $("#mainNav");
  menuToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open"); menuToggle.setAttribute("aria-expanded", "false");
  }));

  const revealTargets = document.querySelectorAll(".metric-card,.feature-card,.directory-panel,.docs-banner");
  revealTargets.forEach(element => element.classList.add("reveal"));
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    revealTargets.forEach(element => observer.observe(element));
  } else {
    revealTargets.forEach(element => element.classList.add("visible"));
  }

  render();
})();

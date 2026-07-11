(function () {
  "use strict";

  var STORAGE_KEY = "mcb-resources-v1";

  var RESOURCES = [
    { id: "people", name: "People", icon: "🧑‍🚀" },
    { id: "money", name: "Money", icon: "🪙" },
    { id: "food", name: "Food", icon: "🍎" },
    { id: "boxes", name: "Boxes", icon: "📦" }
  ];

  var MAX_DIGITS = 6;

  function loadState() {
    var state = {};
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
      RESOURCES.forEach(function (r) {
        var v = parseInt(saved[r.id], 10);
        state[r.id] = isNaN(v) || v < 0 ? 0 : v;
      });
    } catch (e) {
      RESOURCES.forEach(function (r) { state[r.id] = 0; });
    }
    return state;
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) { /* ignore storage errors */ }
  }

  function clamp(n) {
    n = Math.floor(n);
    return isNaN(n) || n < 0 ? 0 : n;
  }

  var state = loadState();
  var container = document.getElementById("resources");
  var valueEls = {};

  function renderValue(id) {
    if (valueEls[id]) valueEls[id].textContent = state[id];
  }

  function setValue(id, n) {
    state[id] = clamp(n);
    renderValue(id);
    saveState();
  }

  // ---- Build resource cards -------------------------------------------------

  RESOURCES.forEach(function (r) {
    var card = document.createElement("section");
    card.className = "card";

    var icon = document.createElement("div");
    icon.className = "card-icon";
    icon.textContent = r.icon;

    var name = document.createElement("div");
    name.className = "card-name";
    name.textContent = r.name;

    var value = document.createElement("div");
    value.className = "card-value";
    value.textContent = state[r.id];
    valueEls[r.id] = value;

    var minus = document.createElement("button");
    minus.type = "button";
    minus.className = "step down";
    minus.textContent = "−";
    minus.setAttribute("aria-label", "Subtract from " + r.name);
    minus.addEventListener("click", function () { openKeypad(r, -1); });

    var plus = document.createElement("button");
    plus.type = "button";
    plus.className = "step up";
    plus.textContent = "+";
    plus.setAttribute("aria-label", "Add to " + r.name);
    plus.addEventListener("click", function () { openKeypad(r, 1); });

    card.appendChild(icon);
    card.appendChild(name);
    card.appendChild(value);
    card.appendChild(minus);
    card.appendChild(plus);
    container.appendChild(card);
  });

  document.getElementById("reset").addEventListener("click", function () {
    if (!window.confirm("Reset all resources to zero?")) return;
    RESOURCES.forEach(function (r) { setValue(r.id, 0); });
  });

  // ---- Keypad sheet ---------------------------------------------------------

  var kp = { resource: null, sign: 1, entry: "" };

  var overlay = document.createElement("div");
  overlay.className = "sheet-overlay";
  overlay.innerHTML =
    '<div class="sheet" role="dialog" aria-modal="true" aria-label="Enter amount">' +
      '<div class="sheet-head">' +
        '<span class="sheet-icon"></span>' +
        '<span class="sheet-name"></span>' +
        '<span class="sheet-current"></span>' +
      '</div>' +
      '<div class="sheet-display">' +
        '<span class="sheet-entry"></span>' +
        '<span class="sheet-preview"></span>' +
      '</div>' +
      '<div class="keypad"></div>' +
      '<div class="sheet-actions">' +
        '<button type="button" class="action cancel">Cancel</button>' +
        '<button type="button" class="action confirm">Confirm</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);

  var sheetIcon = overlay.querySelector(".sheet-icon");
  var sheetName = overlay.querySelector(".sheet-name");
  var sheetCurrent = overlay.querySelector(".sheet-current");
  var sheetEntry = overlay.querySelector(".sheet-entry");
  var sheetPreview = overlay.querySelector(".sheet-preview");
  var keypad = overlay.querySelector(".keypad");

  var KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "C"];
  KEYS.forEach(function (k) {
    var key = document.createElement("button");
    key.type = "button";
    key.className = "key";
    key.textContent = k;
    if (k === "⌫") key.setAttribute("aria-label", "Delete last digit");
    if (k === "C") key.setAttribute("aria-label", "Clear");
    key.addEventListener("click", function () { pressKey(k); });
    keypad.appendChild(key);
  });

  function amount() {
    return parseInt(kp.entry, 10) || 0;
  }

  function updateDisplay() {
    var signChar = kp.sign > 0 ? "+" : "−";
    sheetEntry.textContent = signChar + (kp.entry === "" ? "0" : kp.entry);
    sheetEntry.classList.toggle("neg", kp.sign < 0);
    var current = state[kp.resource.id];
    var result = clamp(current + kp.sign * amount());
    sheetPreview.textContent = current + " → " + result;
  }

  function pressKey(k) {
    if (k === "C") {
      kp.entry = "";
    } else if (k === "⌫") {
      kp.entry = kp.entry.slice(0, -1);
    } else if (kp.entry.length < MAX_DIGITS) {
      // Avoid leading zeros.
      kp.entry = kp.entry === "" && k === "0" ? "" : kp.entry + k;
    }
    updateDisplay();
  }

  function openKeypad(resource, sign) {
    kp.resource = resource;
    kp.sign = sign;
    kp.entry = "";
    sheetIcon.textContent = resource.icon;
    sheetName.textContent = resource.name;
    sheetCurrent.textContent = "now " + state[resource.id];
    updateDisplay();
    overlay.classList.add("open");
  }

  function closeKeypad() {
    overlay.classList.remove("open");
    kp.resource = null;
  }

  overlay.querySelector(".confirm").addEventListener("click", function () {
    if (kp.resource) setValue(kp.resource.id, state[kp.resource.id] + kp.sign * amount());
    closeKeypad();
  });
  overlay.querySelector(".cancel").addEventListener("click", closeKeypad);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeKeypad(); // tap outside the sheet cancels
  });
  document.addEventListener("keydown", function (e) {
    if (!overlay.classList.contains("open")) return;
    if (e.key === "Escape") closeKeypad();
    else if (e.key === "Enter") overlay.querySelector(".confirm").click();
    else if (e.key === "Backspace") pressKey("⌫");
    else if (/^[0-9]$/.test(e.key)) pressKey(e.key);
  });
})();

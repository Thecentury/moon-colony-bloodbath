(function () {
  "use strict";

  var STORAGE_KEY = "mcb-resources-v1";

  var RESOURCES = [
    { id: "people", name: "People", icon: "🧑‍🚀" },
    { id: "money", name: "Money", icon: "🪙" },
    { id: "food", name: "Food", icon: "🍎" },
    { id: "boxes", name: "Boxes", icon: "📦" }
  ];

  // Adjustment steps offered per resource (down buttons and up buttons).
  var STEPS = [5, 1];

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

  var state = loadState();
  var container = document.getElementById("resources");
  var valueEls = {};
  var cardEls = {};

  function clamp(n) {
    n = Math.floor(n);
    return isNaN(n) || n < 0 ? 0 : n;
  }

  function setValue(id, n) {
    state[id] = clamp(n);
    render(id);
    saveState();
  }

  function render(id) {
    var el = valueEls[id];
    if (el && document.activeElement !== el) {
      el.value = state[id];
    }
    // Disable "down" buttons that would go below zero.
    var buttons = cardEls[id].querySelectorAll(".btn.down");
    buttons.forEach(function (b) {
      var step = parseInt(b.getAttribute("data-step"), 10);
      b.disabled = state[id] < step;
    });
  }

  function makeButton(id, delta) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn " + (delta > 0 ? "up" : "down");
    btn.textContent = (delta > 0 ? "+" : "−") + Math.abs(delta);
    btn.setAttribute("data-step", Math.abs(delta));
    btn.setAttribute("aria-label", (delta > 0 ? "Add " : "Subtract ") + Math.abs(delta));
    btn.addEventListener("click", function () {
      setValue(id, state[id] + delta);
    });
    return btn;
  }

  RESOURCES.forEach(function (r) {
    var card = document.createElement("section");
    card.className = "card";

    var top = document.createElement("div");
    top.className = "card-top";

    var icon = document.createElement("div");
    icon.className = "card-icon";
    icon.textContent = r.icon;

    var name = document.createElement("div");
    name.className = "card-name";
    name.textContent = r.name;

    var value = document.createElement("input");
    value.className = "card-value";
    value.type = "number";
    value.inputMode = "numeric";
    value.min = "0";
    value.setAttribute("aria-label", r.name + " count");
    value.value = state[r.id];
    value.addEventListener("focus", function () { value.select(); });
    value.addEventListener("input", function () {
      state[r.id] = clamp(value.value);
      saveState();
    });
    value.addEventListener("blur", function () {
      setValue(r.id, value.value);
    });
    value.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { value.blur(); }
    });
    valueEls[r.id] = value;

    top.appendChild(icon);
    top.appendChild(name);
    top.appendChild(value);

    var controls = document.createElement("div");
    controls.className = "controls";
    // Layout: -5  -1  +1  +5
    STEPS.forEach(function (s) { controls.appendChild(makeButton(r.id, -s)); });
    STEPS.slice().reverse().forEach(function (s) { controls.appendChild(makeButton(r.id, s)); });

    card.appendChild(top);
    card.appendChild(controls);
    container.appendChild(card);
    cardEls[r.id] = card;

    render(r.id);
  });

  document.getElementById("reset").addEventListener("click", function () {
    if (!window.confirm("Reset all resources to zero?")) return;
    RESOURCES.forEach(function (r) { setValue(r.id, 0); });
  });
})();

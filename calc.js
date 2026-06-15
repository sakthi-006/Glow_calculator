const display = document.getElementById('display');
const exprEl = document.getElementById('expr');
const container = document.getElementById('buttons-container');

let currentExpression = "";
let justEvaluated = false;

container.addEventListener('click', function (event) {
  if (!event.target.classList.contains('btn')) return;

  const btn = event.target;

  // ── Ripple effect ──
  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.width  = size + 'px';
  ripple.style.height = size + 'px';
  ripple.style.left   = (event.clientX - rect.left - size / 2) + 'px';
  ripple.style.top    = (event.clientY - rect.top  - size / 2) + 'px';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);

  // ── Pop animation ──
  btn.classList.remove('pop');
  void btn.offsetWidth; // force reflow to retrigger animation
  btn.classList.add('pop');

  const txt = btn.innerText;

  if (btn.classList.contains('clear')) {
    resetCalculator();
  } else if (btn.classList.contains('equal')) {
    performCalculation();
  } else {
    appendInput(txt);
  }
});

function appendInput(value) {
  // If previous action was = and user types a number, start fresh
  if (justEvaluated && !isNaN(value)) {
    currentExpression = value;
    exprEl.textContent = "";
    justEvaluated = false;
  } else {
    justEvaluated = false;
    if (display.value === "0" && !isNaN(value)) {
      currentExpression = value;
    } else {
      currentExpression += value;
    }
  }
  display.value = currentExpression;
}

function resetCalculator() {
  currentExpression = "";
  justEvaluated = false;
  display.value = "0";
  exprEl.textContent = "";
}

function performCalculation() {
  if (currentExpression === "") return;

  try {
    // Replace display symbols with JS operators
    const evalExpr = currentExpression
      .replace(/×/g, '*')
      .replace(/−/g, '-');

    const result = new Function(`return ${evalExpr}`)();

    if (result === Infinity || isNaN(result)) {
      exprEl.textContent = currentExpression + " =";
      display.value = "Error";
      currentExpression = "";
      justEvaluated = false;
    } else {
      exprEl.textContent = currentExpression + " =";
      const rounded = parseFloat(result.toFixed(10));
      display.value = rounded;
      currentExpression = rounded.toString();
      justEvaluated = true;
    }
  } catch (error) {
    display.value = "Syntax Error";
    currentExpression = "";
    exprEl.textContent = "";
    justEvaluated = false;
  }
}
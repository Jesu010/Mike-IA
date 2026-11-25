const $ = (s) => document.querySelector(s);
const messages = $("#messages");
function addMessage(text, who) {
  const el = document.createElement("div");
  el.className = `bubble ${who}`;
  el.textContent = text;
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
}
function demoReply(text) {
  const t = text.toLowerCase();
  if (t.includes("ganancia") || t.includes("venta") || t.includes("margen")) {
    return "¡Vamos con los números! Para calcular una ganancia real necesito el costo del producto, el precio de venta y los gastos o comisiones. Esta respuesta es una demostración; más adelante conectaremos el motor de IA.";
  }
  if (t.includes("clase") || t.includes("educación") || t.includes("educacion")) {
    return "Puedo ayudarte a preparar objetivos, contenidos, actividades y evaluación para una clase. En la versión conectada podremos generar propuestas adaptadas al año y al tiempo disponible.";
  }
  if (t.includes("día") || t.includes("dia") || t.includes("organizar")) {
    return "Podemos organizar tu día en tres pasos: definir prioridades, ordenar horarios y reservar tiempo para imprevistos. También podés cargar tus pendientes en «Mis tareas».";
  }
  return "¡Te leo! En esta primera versión puedo mostrarte cómo funciona la interfaz y guardar tus tareas en este dispositivo. La conexión con inteligencia artificial real será una próxima etapa.";
}
$("#chatForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = $("#chatInput");
  const value = input.value.trim();
  if (!value) return;
  addMessage(value, "user");
  input.value = "";
  window.setTimeout(() => addMessage(demoReply(value), "assistant"), 350);
});
document.querySelectorAll(".suggestion").forEach(b => b.addEventListener("click", () => {
  $("#chatInput").value = b.dataset.prompt;
  $("#chatInput").focus();
}));
document.querySelectorAll(".feature").forEach(b => b.addEventListener("click", () => {
  addMessage(`Quiero entrar en ${b.dataset.feature}.`, "user");
  addMessage(`El módulo ${b.dataset.feature} está previsto para la siguiente etapa de Mikey AI.`, "assistant");
}));
const modeToggle = $("#modeToggle");
modeToggle.addEventListener("click", () => {
  modeToggle.textContent = modeToggle.textContent.startsWith("Personal") ? "Empresarial ▾" : "Personal ▾";
});
let tasks = [];
try { tasks = JSON.parse(localStorage.getItem("mikeyTasks") || "[]"); } catch {}
function saveTasks() { localStorage.setItem("mikeyTasks", JSON.stringify(tasks)); renderTasks(); }
function renderTasks() {
  const list = $("#taskList");
  list.replaceChildren();
  $("#taskCount").textContent = tasks.filter(t => !t.done).length;
  if (!tasks.length) {
    const li = document.createElement("li"); li.className = "empty"; li.textContent = "Todavía no tenés tareas. Agregá la primera."; list.appendChild(li); return;
  }
  tasks.forEach(task => {
    const li = document.createElement("li");
    const cb = document.createElement("input"); cb.type = "checkbox"; cb.checked = task.done;
    cb.addEventListener("change", () => { task.done = cb.checked; saveTasks(); });
    const label = document.createElement("span"); label.textContent = task.text; if (task.done) label.className = "done";
    const del = document.createElement("button"); del.type = "button"; del.textContent = "×"; del.setAttribute("aria-label", "Eliminar tarea");
    del.style.cssText = "margin-left:auto;border:0;background:transparent;color:#9eb1ce;font-size:20px;padding:0 6px";
    del.addEventListener("click", () => { tasks = tasks.filter(t => t.id !== task.id); saveTasks(); });
    li.append(cb, label, del); list.appendChild(li);
  });
}
$("#taskForm").addEventListener("submit", e => {
  e.preventDefault(); const input = $("#taskInput"); const text = input.value.trim(); if (!text) return;
  tasks.push({id: Date.now(), text, done:false}); input.value = ""; saveTasks();
});
$("#navAssistant").addEventListener("click", () => $("#chatInput").focus());
renderTasks();
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
}
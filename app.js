const $ = (s) => document.querySelector(s);
const messages = $("#messages");
function addMessage(text, who) {
  const el = document.createElement("div");
  el.className = `bubble ${who}`;
  el.textContent = text;
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
}
async function consultarMikey(texto) {
  const respuesta = await fetch("https://mike-ia.onrender.com/charlar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ mensaje: texto })
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.detail || "No pude responder.");
  }

  return datos.respondedor;
}
$("#chatForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const input = $("#chatInput");
  const value = input.value.trim();

  if (!value) return;

  addMessage(value, "user");
  input.value = "";

  try {
    const respuesta = await consultarMikey(value);
    addMessage(respuesta, "assistant");
  } catch (error) {
    addMessage("No pude conectarme con Mikey. Revisá la conexión e intentá nuevamente.", "assistant");
  }
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

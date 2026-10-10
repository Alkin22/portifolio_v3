/* ===== CONFIGURAÇÃO: EDITE AQUI ===== */
const CONFIG = {
  nome: "Davi Correa Viana Lima",
  email: "22501258@aluno.cotemig.com.br",
  github: "https://github.com/Alkin22",
  frases: ["em formação", "Front-end", "Back-end"] // texto animado da home
};

// Remova o que você ainda não domina. Nada aqui é afirmação sobre você: confira tudo.
const SKILLS = {
  "Frontend": ["HTML", "CSS", "JavaScript"],
  "Backend": ["Node.js"],
  "Banco de Dados": ["MySQL"],
  "Ferramentas": ["Git", "GitHub", "VS Code", "Figma", "Lovable"]
};

// Projetos exibidos na seção "Projetos". Para adicionar outro, copie um bloco { ... } e edite.
// Deixe github/demo vazios ("") se o link ainda não existir.
const PROJECTS = [
  {
    nome: "Página de portfólio de fotógrafo",
    descricao: "Página web de apresentação para um fotógrafo, com menu, texto de apresentação e galeria de fotos, criada para praticar o layout com Flexbox.",
    imagem: "",            // ex.: "assets/projeto1.png"
    tecnologias: ["HTML", "CSS", "Flexbox"],
    funcionalidades: ["Menu de navegação", "Seção de apresentação", "Galeria de fotos"],
    categoria: "Frontend",
    status: "Concluído",
    github: "https://github.com/Alkin22/positron-2-temporada-display-flex-",
    demo: "https://alkin22.github.io/positron-2-temporada-display-flex-/"
  },
  {
    nome: "Tabela Periódica",
    descricao: "Tabela periódica dos elementos feita com HTML e CSS, com cada elemento exibindo número atômico, símbolo, nome e massa atômica.",
    imagem: "",
    tecnologias: ["HTML", "CSS"],
    funcionalidades: ["Elementos organizados em tabela", "Cores por categoria de elemento"],
    categoria: "Frontend",
    status: "Concluído",
    github: "https://github.com/Alkin22/tabela-p",
    demo: ""
  }
];
/* ===== FIM DA CONFIGURAÇÃO ===== */

const $ = (s, r = document) => r.querySelector(s);
const root = document.documentElement;

// Links (desabilita os que ainda não foram preenchidos)
const hrefs = {
  github: CONFIG.github,
  email: CONFIG.email && "mailto:" + CONFIG.email
};
document.querySelectorAll("[data-link]").forEach(a => setLink(a, hrefs[a.dataset.link]));
function setLink(a, url) {
  if (url) { a.href = url; return; }
  a.removeAttribute("href");
  a.setAttribute("aria-disabled", "true");
  a.title = "Link a ser preenchido em script.js";
  a.addEventListener("click", e => e.preventDefault());
}
document.querySelectorAll("#heroName,#logo").forEach(e => e.textContent = CONFIG.nome);
$("#year").textContent = new Date().getFullYear();

// Modo claro/escuro (preferência salva)
const themeBtn = $("#themeBtn");
function paintTheme() { themeBtn.textContent = root.dataset.theme === "dark" ? "☀️" : "🌙"; }
themeBtn.onclick = () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
  paintTheme();
};
paintTheme();

// Menu mobile
const menu = $("#menu"), menuBtn = $("#menuBtn");
menuBtn.onclick = () => {
  const open = menu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
};
menu.addEventListener("click", e => { if (e.target.tagName === "A") { menu.classList.remove("open"); menuBtn.setAttribute("aria-expanded", false); } });

// Interação 1: efeito de digitação
(function typing() {
  const el = $("#typing"); let i = 0, j = 0, del = false;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = CONFIG.frases[0]; return; }
  (function tick() {
    const f = CONFIG.frases[i];
    el.textContent = f.slice(0, j);
    if (!del && j === f.length) { del = true; return setTimeout(tick, 1400); }
    if (del && j === 0) { del = false; i = (i + 1) % CONFIG.frases.length; }
    j += del ? -1 : 1;
    setTimeout(tick, del ? 45 : 90);
  })();
})();

// Interação 2: animação ao rolar
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll(".reveal").forEach(s => io.observe(s));

// Habilidades
$("#skills").innerHTML = Object.entries(SKILLS).map(([cat, list]) =>
  `<article class="card"><h3>${cat}</h3><ul class="chips">${list.map(t => `<li class="chip"><i aria-hidden="true">${t.slice(0, 2)}</i>${t}</li>`).join("")}</ul></article>`).join("");

// Projetos + filtros
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function btn(url, label, extra = "") {
  return url ? `<a class="btn" href="${esc(url)}" target="_blank" rel="noopener">${label}</a>`
    : `<span class="btn" aria-disabled="true" title="Link a preencher">${label} (a preencher)</span>`;
}
function renderProjects(cat = "Todos") {
  $("#projects").innerHTML = PROJECTS.filter(p => cat === "Todos" || p.categoria === cat).map(p => `
    <article class="card project">
      ${p.imagem ? `<img class="thumb" src="${esc(p.imagem)}" alt="Captura de tela do projeto ${esc(p.nome)}" loading="lazy">` : `<div class="thumb">Imagem a preencher</div>`}
      <div class="pbody">
        <span class="status">${esc(p.status)}</span>
        <h3>${esc(p.nome)}</h3>
        <p>${esc(p.descricao)}</p>
        <ul class="chips">${p.tecnologias.map(t => `<li class="chip">${esc(t)}</li>`).join("")}</ul>
        <ul class="feat">${p.funcionalidades.map(f => `<li>${esc(f)}</li>`).join("")}</ul>
        <div class="pbtns">${btn(p.github, "Código")}${btn(p.demo, "Demo")}</div>
      </div>
    </article>`).join("") || "<p>Nenhum projeto nesta categoria.</p>";
}
const cats = ["Todos", ...new Set(PROJECTS.map(p => p.categoria))];
$("#filters").innerHTML = cats.map((c, i) => `<button type="button" aria-pressed="${i === 0}">${c}</button>`).join("");
$("#filters").onclick = e => {
  if (e.target.tagName !== "BUTTON") return;
  document.querySelectorAll("#filters button").forEach(b => b.setAttribute("aria-pressed", b === e.target));
  renderProjects(e.target.textContent);
};
renderProjects();

// Modal
const modal = $("#modal");
function showModal(t, m) { $("#mTitle").textContent = t; $("#mText").textContent = m; modal.showModal(); }
$("#mClose").onclick = () => modal.close();
modal.addEventListener("click", e => { if (e.target === modal) modal.close(); });

// Formulário: máscaras e validação
const f = $("#form");
f.telefone.addEventListener("input", e => {
  let d = e.target.value.replace(/\D/g, "").slice(0, 11), r = d;
  if (d.length > 6) r = d.length > 10 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  else if (d.length > 2) r = `(${d.slice(0, 2)}) ${d.slice(2)}`;
  else if (d.length) r = `(${d}`;
  e.target.value = r;
});
f.nome.addEventListener("input", e => e.target.value = e.target.value.replace(/[0-9]/g, ""));
f.mensagem.addEventListener("input", e => $("#count").textContent = e.target.value.length + "/500");

const rules = {
  nome: v => v.trim().split(/\s+/).filter(Boolean).length >= 2 && v.trim().length >= 3 || "Informe nome e sobrenome.",
  telefone: v => /^\(\d{2}\) \d{4,5}-\d{4}$/.test(v) || "Informe um telefone válido com DDD.",
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || "Informe um e-mail válido.",
  mensagem: v => v.trim().length >= 10 || "A mensagem deve ter ao menos 10 caracteres."
};
function check(name) {
  const r = rules[name](f[name].value), ok = r === true;
  f[name].setAttribute("aria-invalid", !ok);
  $("#e-" + name).textContent = ok ? "" : r;
  return ok;
}
Object.keys(rules).forEach(n => f[n].addEventListener("blur", () => check(n)));

f.addEventListener("submit", e => {
  e.preventDefault();
  const ok = Object.keys(rules).map(check).every(Boolean);
  if (!ok) return showModal("Verifique os campos", "Corrija os campos destacados e tente novamente.");
  if (!CONFIG.email) return showModal("Envio indisponível", "O e-mail de destino ainda não foi configurado no site.");
  const body = `Nome: ${f.nome.value}\nTelefone: ${f.telefone.value}\nE-mail: ${f.email.value}\n\n${f.mensagem.value}`;
  location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent("Contato pelo portfólio - " + f.nome.value)}&body=${encodeURIComponent(body)}`;
  showModal("Quase lá!", "Abrimos seu aplicativo de e-mail com a mensagem pronta. É só confirmar o envio por lá.");
  f.reset(); $("#count").textContent = "0/500";
});

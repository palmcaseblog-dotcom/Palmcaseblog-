const SUPABASE_URL = "https://kcxlwhojwdvbfjjnartw.supabase.co";
const SUPABASE_KEY = "sb_publishable_dfUPxIaPdguf8MlaZ8ZOpg_QHK4p0aP";

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

let posts = [];

const postsEl = document.getElementById("posts");
const trendingEl = document.getElementById("trending");
const popularEl = document.getElementById("popular");
const noResults = document.getElementById("noResults");

function card(p) {
  return `<article class="post">
    <img src="${escapeHtml(p.image || "")}" alt="${escapeHtml(p.headline || "")}"
      onerror="this.src='https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80'">
    <div class="post-body">
      <span class="tag">${escapeHtml(p.category || "News")}</span>
      <h3>${escapeHtml(p.headline || "")}</h3>
      <p>${escapeHtml(p.article || "")}</p>
      <div class="post-meta">Palmcaseblog · Published</div>
    </div>
  </article>`;
}

function trendCard(p) {
  return `<article class="trend">
    <img src="${escapeHtml(p.image || "")}" alt="">
    <div>
      <span class="eyebrow">${escapeHtml(p.category || "News")}</span>
      <h3>${escapeHtml(p.headline || "")}</h3>
    </div>
  </article>`;
}

function render(list = posts) {
  postsEl.innerHTML = list.map(card).join("");
  trendingEl.innerHTML = posts.slice(0, 4).map(trendCard).join("");

  popularEl.innerHTML = posts.slice(0, 5).map((p, i) => `
    <div class="popular-item">
      <img src="${escapeHtml(p.image || "")}" alt="">
      <div>
        <small>#${i + 1}</small>
        <h4>${escapeHtml(p.headline || "")}</h4>
      </div>
    </div>
  `).join("");

  noResults.hidden = list.length !== 0;
}

function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}

async function loadPosts() {
  const { data, error } = await db
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Could not load posts:", error);
    return;
  }

  posts = data || [];
  render();
}

function search() {
  const q = document.getElementById("searchInput").value.toLowerCase().trim();

  render(
    q
      ? posts.filter(p =>
          `${p.headline} ${p.category} ${p.article}`
            .toLowerCase()
            .includes(q)
        )
      : posts
  );

  document.getElementById("latest").scrollIntoView({
    behavior: "smooth"
  });
}

document.getElementById("searchBtn").addEventListener("click", search);

document.getElementById("searchInput").addEventListener("keydown", e => {
  if (e.key === "Enter") search();
});

document.getElementById("menuBtn").addEventListener("click", () => {
  document.getElementById("nav").classList.toggle("open");
});

document.getElementById("subscribeBtn").addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();

  document.getElementById("subscribeMsg").textContent =
    email.includes("@")
      ? "Thanks for subscribing!"
      : "Please enter a valid email.";
});

document.getElementById("year").textContent = new Date().getFullYear();

loadPosts();

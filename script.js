const initialPosts = [
  {title:"The stories shaping conversations across Nigeria today",category:"News",image:"https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=900&q=80",content:"A look at the latest developments and conversations attracting attention online and across communities.",popular:true},
  {title:"Entertainment stories fans cannot stop talking about",category:"Entertainment",image:"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80",content:"From music to celebrity culture, here are some of the stories generating attention.",popular:true},
  {title:"Technology is changing how people work and create",category:"Technology",image:"https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",content:"New technology continues to create opportunities for creators, businesses and everyday users.",popular:true},
  {title:"Sports: The moments and personalities making headlines",category:"Sports",image:"https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80",content:"Catch up on major sports conversations, performances and stories.",popular:false}
];

let posts = JSON.parse(localStorage.getItem("palmcase_posts") || "null") || initialPosts;

const postsEl = document.getElementById("posts");
const trendingEl = document.getElementById("trending");
const popularEl = document.getElementById("popular");
const noResults = document.getElementById("noResults");

function card(p){
  return `<article class="post">
    <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" onerror="this.src='https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80'">
    <div class="post-body">
      <span class="tag">${escapeHtml(p.category)}</span>
      <h3>${escapeHtml(p.title)}</h3>
      <p>${escapeHtml(p.content)}</p>
      <div class="post-meta">Palmcaseblog · Trending story</div>
    </div>
  </article>`;
}
function trendCard(p){
  return `<article class="trend"><img src="${escapeHtml(p.image)}" alt=""><div><span class="eyebrow">${escapeHtml(p.category)}</span><h3>${escapeHtml(p.title)}</h3></div></article>`;
}
function render(list=posts){
  postsEl.innerHTML = list.map(card).join("");
  trendingEl.innerHTML = posts.slice(0,4).map(trendCard).join("");
  popularEl.innerHTML = posts.filter(p=>p.popular).slice(0,5).map((p,i)=>`
    <div class="popular-item"><img src="${escapeHtml(p.image)}" alt=""><div><small>#${i+1}</small><h4>${escapeHtml(p.title)}</h4></div></div>`).join("");
  noResults.hidden = list.length !== 0;
}
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}
function search(){
  const q=document.getElementById("searchInput").value.toLowerCase().trim();
  render(q ? posts.filter(p=>(p.title+" "+p.category+" "+p.content).toLowerCase().includes(q)) : posts);
  document.getElementById("latest").scrollIntoView({behavior:"smooth"});
}
document.getElementById("searchBtn").addEventListener("click",search);
document.getElementById("searchInput").addEventListener("keydown",e=>{if(e.key==="Enter")search()});
document.getElementById("menuBtn").addEventListener("click",()=>document.getElementById("nav").classList.toggle("open"));

document.getElementById("postForm").addEventListener("submit",e=>{
  e.preventDefault();
  const post={
    title:document.getElementById("title").value,
    category:document.getElementById("category").value,
    image:document.getElementById("image").value || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80",
    content:document.getElementById("content").value,
    popular:true
  };
  posts.unshift(post);
  localStorage.setItem("palmcase_posts",JSON.stringify(posts));
  e.target.reset();
  render();
  document.getElementById("latest").scrollIntoView({behavior:"smooth"});
  alert("Story published on this browser.");
});

document.getElementById("subscribeBtn").addEventListener("click",()=>{
  const email=document.getElementById("email").value.trim();
  document.getElementById("subscribeMsg").textContent=email.includes("@") ? "Thanks for subscribing!" : "Please enter a valid email.";
});
document.getElementById("year").textContent=new Date().getFullYear();
render();

(() => {
  const data = window.PORTFOLIO_DATA;
  if (!data) return;
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const setLinks = () => {
    $$("[data-link]").forEach(el => {
      const key = el.dataset.link;
      if (key === "email") el.href = `mailto:${data.links.email}`;
      else if (data.links[key]) { el.href = data.links[key]; el.target = "_blank"; el.rel = "noreferrer"; }
    });
  };
  const chip = (label, active, fn) => {
    const b = document.createElement("button");
    b.className = `filter-chip${active ? " active" : ""}`; b.type="button"; b.textContent=label;
    b.setAttribute("aria-pressed", String(active)); b.addEventListener("click", fn); return b;
  };
  function renderSkills(category="All") {
    const grid=$("#skills-grid"); grid.innerHTML="";
    data.skills.filter(s=>category==="All"||s.category===category).forEach(s=>{
      const card=document.createElement("article"); card.className="skill-card";
      const top=document.createElement("div"); top.className="skill-top";
      const h=document.createElement("h3"); h.textContent=s.name;
      const level=document.createElement("span"); level.className=`level ${s.level==="Basic"||s.level==="Learning"?"basic":""}`; level.textContent=s.level;
      top.append(h,level); const p=document.createElement("p"); p.textContent=s.detail; card.append(top,p); grid.append(card);
    });
  }
  function setupSkillFilters() {
    const host=$("#skill-filters");
    data.skillCategories.forEach(c=>host.append(chip(c,c==="All",()=>{ $$("#skill-filters .filter-chip").forEach(b=>{b.classList.toggle("active",b.textContent===c);b.setAttribute("aria-pressed",String(b.textContent===c));});renderSkills(c); })));
  }
  function renderProjects(category="All") {
    const grid=$("#projects-grid"); grid.innerHTML="";
    data.projects.filter(p=>category==="All"||p.category===category).forEach(p=>{
      const card=document.createElement("article"); card.className="project-card"; card.tabIndex=0; card.setAttribute("role","button"); card.setAttribute("aria-label",`Open ${p.title} project details`);
      const meta=document.createElement("div");meta.className="project-meta";
      const icon=document.createElement("span");icon.className="project-icon";icon.textContent=p.icon;
      const cat=document.createElement("span");cat.className="project-category";cat.textContent=`${p.category} · ${p.year}`;meta.append(icon,cat);
      const title=document.createElement("h3");title.textContent=p.title;
      const desc=document.createElement("p");desc.textContent=p.summary;
      const tags=document.createElement("div");tags.className="tag-list";p.tags.forEach(t=>{const tag=document.createElement("span");tag.className="tag";tag.textContent=t;tags.append(tag);});
      const open=document.createElement("div");open.className="project-open";open.textContent="Explore case study ↗";
      card.append(meta,title,desc,tags,open);card.addEventListener("click",()=>showProject(p));card.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();showProject(p);}});
      grid.append(card);
    });
  }
  function setupProjectFilters() {
    const host=$("#project-filters");
    data.projectCategories.forEach(c=>host.append(chip(c,c==="All",()=>{ $$("#project-filters .filter-chip").forEach(b=>{b.classList.toggle("active",b.textContent===c);b.setAttribute("aria-pressed",String(b.textContent===c));});renderProjects(c); })));
  }
  function showProject(p) {
    const host=$("#project-detail"); host.replaceChildren();
    const eyebrow=document.createElement("p");eyebrow.className="eyebrow";eyebrow.textContent=`${p.category} / ${p.year}`;
    const title=document.createElement("h2");title.textContent=p.title;
    const summary=document.createElement("p");summary.textContent=p.summary;
    host.append(eyebrow,title,summary);
    [["Problem",p.problem],["Approach",p.approach]].forEach(([heading,body])=>{const h=document.createElement("h3");h.textContent=heading;const pEl=document.createElement("p");pEl.textContent=body;host.append(h,pEl);});
    const h=document.createElement("h3");h.textContent="Project highlights";const ul=document.createElement("ul");p.highlights.forEach(item=>{const li=document.createElement("li");li.textContent=item;ul.append(li);});host.append(h,ul);
    const note=document.createElement("p");note.className="project-note";note.textContent=p.note;host.append(note);
    $("#project-dialog").showModal();
  }
  const toggle=$(".menu-toggle"), nav=$("#nav-links");
  toggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));});
  $$("#nav-links a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");toggle.setAttribute("aria-expanded","false");}));
  $(".dialog-close").addEventListener("click",()=>$("#project-dialog").close());
  $("#project-dialog").addEventListener("click",e=>{if(e.target.id==="project-dialog")$("#project-dialog").close();});
  function renderExperience() {
    const host=$("#experience-list");
    data.experience.forEach(item=>{const row=document.createElement("article");row.className="timeline-item";const date=document.createElement("div");date.className="timeline-date";date.textContent=item.date;const body=document.createElement("div");const h=document.createElement("h3");h.textContent=item.role;const org=document.createElement("p");org.className="timeline-org";org.textContent=item.organization;const desc=document.createElement("p");desc.textContent=item.description;body.append(h,org,desc);row.append(date,body);host.append(row);});
  }
  // Reveal sections as they enter the viewport.
  const revealTargets = $$("[data-reveal], .section.reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    revealTargets.forEach(el => observer.observe(el));
  } else revealTargets.forEach(el => el.classList.add("is-visible"));
  // A subtle cursor glow on pointer devices; disabled on touch and reduced-motion preferences.
  const glow = $(".cursor-glow");
  if (glow && matchMedia("(hover:hover) and (pointer:fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener("pointermove", e => {
      glow.style.left = `${e.clientX}px`; glow.style.top = `${e.clientY}px`;
    }, {passive:true});
  }
  setLinks(); setupSkillFilters(); renderSkills(); setupProjectFilters(); renderProjects(); renderExperience(); $("#year").textContent=new Date().getFullYear();
})();
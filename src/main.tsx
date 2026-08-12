import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BarChart3, Bell, CalendarDays, Check, ChevronRight, CircleHelp, Clock3,
  Eye, Gift, Heart, Home, LayoutDashboard, MapPin, Menu, MessageSquare,
  Package, Search, Settings, ShieldCheck, Sparkles, Star, Store, Trophy,
  Upload, UserRound, X,
} from "lucide-react";
import "./styles.css";

type Mode = "pro" | "client";
type ProPage = "dashboard" | "informations" | "products" | "reviews";
type ClientPage = "dashboard" | "passport" | "visits" | "rewards";
type Page = ProPage | ClientPage;

const proNav: { id: ProPage; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { id: "informations", label: "Informations", icon: UserRound },
  { id: "products", label: "Produits & Services", icon: Package },
  { id: "reviews", label: "Avis clients", icon: Heart },
];
const clientNav: { id: ClientPage; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: "dashboard", label: "Tableau de bord", icon: Home },
  { id: "passport", label: "Passeport Local", icon: ShieldCheck },
  { id: "visits", label: "Mes visites", icon: Clock3 },
  { id: "rewards", label: "Récompenses", icon: Gift },
];
const products = [
  ["Pain au levain naturel", "Pains", "2,80 €", "🥖"],
  ["Croissant pur beurre", "Viennoiseries", "1,60 €", "🥐"],
  ["Tarte aux fruits de saison", "Pâtisseries", "3,50 €", "🥧"],
  ["Sandwich jambon-fromage", "Snacking", "5,20 €", "🥪"],
];
const reviews: [string, string, number, string][] = [
  ["Julie D.", "Excellent pain et service au top ! Toujours un plaisir de venir chez vous.", 5, "Publié"],
  ["Marc L.", "Les viennoiseries sont délicieuses mais le temps d’attente était un peu long.", 4, "Publié"],
  ["Sophie M.", "Produits frais, équipe accueillante et cadre chaleureux.", 5, "En attente"],
];
const visits = [
  ["Boulangerie Léon", "Boulangerie", "18 mai 2026", "🥖"],
  ["Café Hugo", "Café / Brasserie", "17 mai 2026", "☕"],
  ["Studio Camille", "Coiffure", "17 mai 2026", "✂️"],
  ["Fleur d’Emma", "Fleuriste", "16 mai 2026", "💐"],
  ["Librairie Atlas", "Librairie", "15 mai 2026", "📚"],
];

function Metric({ icon, value, label, trend }: { icon: React.ReactNode; value: string; label: string; trend?: string }) {
  return <div className="metric"><div className="metric-icon">{icon}</div><div><strong>{value}</strong><span>{label}</span>{trend && <small>{trend}</small>}</div></div>;
}
function Stars({ count = 5 }: { count?: number }) { return <span className="stars">{"★".repeat(count)}<i>{"★".repeat(5 - count)}</i></span>; }

function Sidebar({ mode, page, setPage, open, close }: { mode: Mode; page: Page; setPage: (p: Page) => void; open: boolean; close: () => void }) {
  const nav = mode === "pro" ? proNav : clientNav;
  return <aside className={`sidebar ${open ? "open" : ""}`}>
    <div className="brand">referio<span>.</span><button className="mobile-close" onClick={close}><X /></button></div>
    <div className="sidebar-label">{mode === "pro" ? "ESPACE INDÉPENDANT" : "ESPACE CLIENT"}</div>
    <nav>{nav.map(({ id, label, icon: Icon }) => <button key={id} className={page === id ? "active" : ""} onClick={() => { setPage(id); close(); }}><Icon size={19}/><span>{label}</span>{label.includes("Avis") && <b>128</b>}</button>)}</nav>
    {mode === "pro" && <><div className="sidebar-label">OUTILS</div><nav className="secondary"><button><BarChart3 size={19}/><span>Visibilité locale</span></button><button><Sparkles size={19}/><span>Assistant IA</span><em>Nouveau</em></button><button><CalendarDays size={19}/><span>Agenda des tâches</span></button><button><Settings size={19}/><span>Paramètres</span></button></nav></>}
    <div className="side-card">{mode === "pro" ? <><Trophy/><strong>Votre plan : Pro</strong><span>Valable jusqu’au 12/06/2026</span><button>Gérer mon abonnement</button></> : <><Trophy/><strong>Niveau Or</strong><span>125 visites locales</span><div className="mini-progress"><i/></div><button>Voir mes avantages</button></>}</div>
  </aside>;
}

function Header({ mode, setMode, menu }: { mode: Mode; setMode: (m: Mode) => void; menu: () => void }) {
  return <header><button className="menu-btn" onClick={menu}><Menu/></button><div className="business"><span>🥖</span><b>{mode === "pro" ? "Boulangerie Léon" : "Explorer Namur"}</b></div><div className="mode-switch"><button className={mode === "pro" ? "active" : ""} onClick={() => setMode("pro")}><Store size={16}/> Indépendant</button><button className={mode === "client" ? "active" : ""} onClick={() => setMode("client")}><UserRound size={16}/> Client</button></div><div className="header-actions"><button><CircleHelp size={19}/><span>Aide</span></button><button className="bell"><Bell size={19}/><i>3</i></button><div className="avatar">SL</div><div className="identity"><b>Sophie {mode === "pro" ? "L." : "Martin"}</b><span>{mode === "pro" ? "Propriétaire" : "Client vérifié"}</span></div></div></header>;
}

function ProDashboard({ go }: { go: (p: Page) => void }) {
  return <><PageTitle title="Bonjour Sophie ! 👋" sub="Voici un aperçu des performances de votre établissement." action="Voir mon profil public"/><section className="score-hero"><div><span>Score de visibilité</span><strong>85<small>/100</small></strong><b>Excellent</b><em>↗ +12 pts ce mois-ci</em></div><div className="chart-line"><i/><i/><i/><i/><i/><i/><i/><i/></div></section><div className="dashboard-grid"><section className="card actions"><CardTitle title="Mes actions prioritaires" badge="5"/><Action text="Répondre à 2 avis négatifs" meta="Impact élevé · 5 min" tone="coral" onClick={() => go("reviews")}/><Action text="Ajouter les horaires du lundi de Pâques" meta="Impact moyen · 2 min" tone="purple" onClick={() => go("informations")}/><Action text="Publier une nouvelle photo" meta="Impact moyen · 3 min" tone="blue"/><Action text="Mettre en avant vos produits" meta="Impact élevé · 4 min" tone="yellow" onClick={() => go("products")}/></section><section className="card stats"><CardTitle title="Statistiques clés"/><div className="metrics-2"><Metric icon={<Eye/>} value="324" label="Vues du profil" trend="+18%"/><Metric icon={<Search/>} value="215" label="Requêtes" trend="+22%"/><Metric icon={<MessageSquare/>} value="34" label="Appels" trend="+13%"/><Metric icon={<MapPin/>} value="28" label="Itinéraires" trend="+15%"/></div></section><section className="card reviews-card"><CardTitle title="Avis clients récents" badge="128"/><ReviewMini name="Julie D." text="Excellent pain et service au top !"/><ReviewMini name="Marc L." text="Des viennoiseries délicieuses."/></section><section className="card profile-preview"><CardTitle title="Ma fiche publique"/><div className="cover">BOULANGERIE <b>LÉON</b></div><h3>Boulangerie Léon</h3><span className="published"><Check size={13}/> Publié</span><p>Votre profil est visible et optimisé pour le référencement local.</p><button onClick={() => go("informations")}>Modifier ma fiche</button></section></div></>;
}
function PageTitle({ title, sub, action }: { title: string; sub: string; action?: string }) { return <div className="page-title"><div><h1>{title}</h1><p>{sub}</p></div>{action && <button className="outline">{action} <ChevronRight size={16}/></button>}</div>; }
function CardTitle({ title, badge }: { title: string; badge?: string }) { return <div className="card-title"><h2>{title}</h2>{badge && <span>{badge}</span>}<button>Voir tout <ChevronRight size={15}/></button></div>; }
function Action({ text, meta, tone, onClick }: { text: string; meta: string; tone: string; onClick?: () => void }) { return <button className="action-row" onClick={onClick}><i className={tone}>✦</i><span><b>{text}</b><small>{meta}</small></span><em>Agir</em></button>; }
function ReviewMini({ name, text }: { name: string; text: string }) { return <div className="review-mini"><div className="avatar small">{name[0]}</div><div><b>{name}</b><Stars/><p>{text}</p></div><button>Répondre</button></div>; }

function InformationPage() {
  const [saved, setSaved] = useState(false);
  return <><PageTitle title="Informations" sub="Gérez les informations principales de votre établissement."/><div className="two-col"><section className="card form-card"><h2>Informations générales</h2><Field label="Nom de l’établissement" value="Boulangerie Léon"/><div className="form-row"><Field label="Type d’établissement" value="Boulangerie"/><Field label="Année de création" value="1988"/></div><Field label="Slogan / Accroche" value="Le goût authentique du fait maison."/><label>Description courte<textarea defaultValue="Boulangerie artisanale depuis 1988 à Namur. Des produits faits maison avec des ingrédients locaux et beaucoup de passion."/></label><h2>Contact</h2><div className="form-row"><Field label="Adresse" value="Rue de Fer 35"/><Field label="Code postal" value="5000"/></div><div className="form-row"><Field label="Téléphone" value="081 25 66 65"/><Field label="Email" value="info@boulangerieleon.be"/></div><button className="primary" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 1800); }}>{saved ? "✓ Modifications enregistrées" : "Enregistrer les modifications"}</button></section><section><div className="card media-box"><h2>Logo et image de couverture</h2><div className="logo-preview">LÉON</div><button className="outline"><Upload size={16}/> Changer le logo</button><div className="cover wide">BOULANGERIE LÉON · DEPUIS 1988</div></div><div className="card practical"><h2>Informations pratiques</h2><Action text="Horaires d’ouverture" meta="Lun–ven · 06:30–18:00" tone="green"/><Action text="Langues parlées" meta="Français, anglais" tone="blue"/><Action text="Moyens de paiement" meta="Espèces, Bancontact, Visa" tone="yellow"/></div></section></div></>;
}
function Field({ label, value }: { label: string; value: string }) { return <label>{label}<input defaultValue={value}/></label>; }

function ProductsPage() {
  const [items, setItems] = useState(products); const [query, setQuery] = useState("");
  const filtered = items.filter(p => p[0].toLowerCase().includes(query.toLowerCase()));
  return <><PageTitle title="Produits & Services" sub="Présentez vos produits et services pour attirer plus de clients."/><section className="card table-card"><div className="toolbar"><div className="search"><Search size={18}/><input placeholder="Rechercher un produit…" value={query} onChange={e => setQuery(e.target.value)}/></div><button className="primary" onClick={() => setItems([...items, ["Nouveau produit", "Brouillon", "0,00 €", "✨"]])}>+ Ajouter un produit</button></div><div className="notice">Les établissements avec une liste complète reçoivent en moyenne 27% de vues en plus.</div>{filtered.map((p, i) => <div className="product-row" key={`${p[0]}-${i}`}><div className="product-photo">{p[3]}</div><div><b>{p[0]}</b><span>Produit artisanal préparé sur place.</span><strong>{p[2]}</strong></div><em>{p[1]}</em><span className={p[1] === "Brouillon" ? "draft" : "published"}>{p[1] === "Brouillon" ? "Brouillon" : "● Publié"}</span><button>Modifier</button></div>)}</section></>;
}
function ReviewsPage() {
  const [answered, setAnswered] = useState<string[]>([]);
  return <><PageTitle title="Avis clients" sub="Consultez et gérez les avis laissés par vos clients." action="Inviter un client à laisser un avis"/><div className="review-layout"><section className="card review-list"><div className="toolbar"><div className="search"><Search size={18}/><input placeholder="Rechercher un avis…"/></div><button className="outline">Tous les avis</button></div>{reviews.map((r, i) => <article className="full-review" key={r[0]}><div className="avatar">{r[0][0]}</div><div><div><b>{r[0]}</b><Stars count={Number(r[2])}/><span>Il y a {i + 1} jours</span></div><p>{r[1]}</p></div><span className="published">{answered.includes(String(r[0])) ? "Répondu" : r[3]}</span><button onClick={() => setAnswered([...answered, String(r[0])])}>{answered.includes(String(r[0])) ? "Voir" : "Répondre"}</button></article>)}</section><aside className="card rating"><h2>Note moyenne</h2><strong>4,8</strong><Stars/><p>Basé sur 128 avis</p>{[86,10,3,1,0].map((n,i)=><div className="rating-line" key={n}><span>{5-i} ★</span><i><b style={{width:`${n}%`}}/></i><em>{n}%</em></div>)}</aside></div></>;
}

function ClientDashboard({ go }: { go: (p: Page) => void }) { return <><PageTitle title="Votre espace client" sub="Découvrez vos visites, partagez vos avis et cumulez des récompenses."/><div className="metric-strip"><Metric icon={<Store/>} value="157" label="Visites enregistrées" trend="+12 ce mois-ci"/><Metric icon={<Star/>} value="96" label="Avis publiés"/><Metric icon={<Trophy/>} value="7 / 10" label="Stamps collectés"/><Metric icon={<Gift/>} value="3" label="Récompenses"/></div><div className="client-grid"><section className="card passport-summary"><CardTitle title="Passeport Local"/><StampProgress/><button className="primary" onClick={() => go("passport")}>Voir mon Passeport</button></section><section className="card reward-teaser"><h2>Prochaine récompense</h2><div className="gift">🎁</div><b>Vous êtes tout proche !</b><p>Plus que 3 stamps pour débloquer votre récompense.</p><button className="primary" onClick={() => go("rewards")}>Voir les récompenses</button></section><section className="card visits"><CardTitle title="Mes dernières visites"/><VisitList compact/><button className="text-link" onClick={() => go("visits")}>Voir toutes mes visites →</button></section><section className="card badges"><CardTitle title="Mes badges"/><div className="badge-row"><span>☕<b>Amateur de cafés</b></span><span>💝<b>Supporter local</b></span><span>🏅<b>Avis de confiance</b></span></div></section></div></> }
function StampProgress() { return <><div className="stamps">{["🥖","✂️","☕","💐","📚","🥐","🏠","8","9","10"].map((s,i)=><span key={s} className={i<7 ? "done" : ""}>{s}</span>)}</div><div className="progress"><i/></div><div className="progress-copy"><b>7 <small>/ 10 stamps</small></b><span>Plus que 3 stamps pour débloquer une récompense !</span></div></>; }
function VisitList({ compact = false }: { compact?: boolean }) { return <div className="visit-list">{visits.slice(0,compact?4:5).map(v=><div key={v[0]}><span className="visit-emoji">{v[3]}</span><b>{v[0]}</b><em>{v[1]}</em><small>{v[2]}</small><strong>+1 stamp</strong><ChevronRight size={16}/></div>)}</div>; }
function PassportPage() { return <><PageTitle title="Passeport Local" sub="Visitez, collectionnez des stamps et débloquez des récompenses."/><div className="client-grid"><section className="passport-card"><div className="passport-logo">referio.</div><div><h2>Passeport Local</h2><strong>Sophie Martin</strong><span>Client vérifié · Membre depuis fév. 2024</span></div><div className="qr">▦</div></section><section className="card reward-teaser"><h2>Prochaine récompense</h2><div className="gift">🎁</div><b>10 stamps</b><p>Choisissez votre récompense parmi 18 partenaires.</p></section><section className="card passport-detail"><h2>Ma progression</h2><StampProgress/><h2>Mes stamps collectés</h2><VisitList compact/></section><section className="card how"><h2>Comment ça marche ?</h2>{["Visitez un commerce partenaire","Collectez un stamp","Débloquez des récompenses"].map((x,i)=><div key={x}><b>{i+1}</b><span>{x}</span></div>)}</section></div></> }
function VisitsPage() { return <><PageTitle title="Mes visites" sub="Retrouvez l’historique de vos visites chez les commerçants partenaires."/><div className="review-layout"><section className="card"><div className="toolbar"><button className="outline">30 derniers jours</button><button className="outline">Tous les commerces</button></div><h2>Historique de vos visites</h2><VisitList/></section><aside className="card visit-stats"><h2>Vos statistiques</h2><div className="metrics-2"><Metric icon={<Store/>} value="28" label="Visites"/><Metric icon={<Trophy/>} value="28" label="Stamps"/><Metric icon={<Star/>} value="7" label="Commerces"/><Metric icon={<CalendarDays/>} value="9" label="Jours actifs"/></div><div className="fake-map"><MapPin/> Namur</div></aside></div></> }
function RewardsPage() { const [claimed,setClaimed]=useState<string[]>([]); const rewards=[["Café offert","Café Hugo","☕"],["10% de réduction","Boulangerie Léon","🥖"],["Bouquet découverte","Fleur d’Emma","💐"]]; return <><PageTitle title="Récompenses" sub="Choisissez un avantage auprès de vos commerces partenaires."/><div className="reward-grid">{rewards.map(r=><article className="card reward" key={r[0]}><div>{r[2]}</div><span>10 stamps</span><h2>{r[0]}</h2><p>{r[1]}</p><button className="primary" onClick={()=>setClaimed([...claimed,r[0]])}>{claimed.includes(r[0])?"✓ Récompense sélectionnée":"Choisir cette récompense"}</button></article>)}</div></> }

function App() {
  const [mode, setModeState] = useState<Mode>("pro"); const [proPage,setProPage]=useState<ProPage>("dashboard"); const [clientPage,setClientPage]=useState<ClientPage>("dashboard"); const [menu,setMenu]=useState(false);
  const page = mode === "pro" ? proPage : clientPage;
  const setMode=(m:Mode)=>{setModeState(m); setMenu(false)};
  const view=useMemo(()=>{ if(mode==="pro"){ if(page==="informations")return <InformationPage/>; if(page==="products")return <ProductsPage/>; if(page==="reviews")return <ReviewsPage/>; return <ProDashboard go={p=>setProPage(p as ProPage)}/>;} if(page==="passport")return <PassportPage/>; if(page==="visits")return <VisitsPage/>; if(page==="rewards")return <RewardsPage/>; return <ClientDashboard go={p=>setClientPage(p as ClientPage)}/>;},[mode,page]);
  return <div className="app"><Sidebar mode={mode} page={page} setPage={p=>mode==="pro"?setProPage(p as ProPage):setClientPage(p as ClientPage)} open={menu} close={()=>setMenu(false)}/><div className="shell"><Header mode={mode} setMode={setMode} menu={()=>setMenu(true)}/><main>{view}</main></div>{menu&&<button className="overlay" onClick={()=>setMenu(false)}/>}<div className="demo-badge">Prototype interactif · Données simulées</div></div>;
}

createRoot(document.getElementById("root")!).render(<React.StrictMode><App/></React.StrictMode>);

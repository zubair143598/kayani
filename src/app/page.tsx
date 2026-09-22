"use client";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Phone,
  MessageCircle,
  MapPin,
  Clock3,
  ShieldCheck,
  Truck,
  Wrench,
  CarFront,
  LifeBuoy,
  Menu,
  X,
  Check,
  LoaderCircle,
} from "lucide-react";
import translations from "@/lib/translations.json";
import { services } from "@/lib/contact-schema";
const phone = "tel:+966507963500",
  whatsapp = "https://wa.me/966507963500";
const descriptions = [
  "Quick and safe towing for cars, SUVs and other vehicles.",
  "Professional vehicle recovery for accidents and difficult situations.",
  "Secure flatbed transport for extra safety and care.",
  "Jump start, tire assistance, fuel delivery and more.",
];
const icons = [Truck, Wrench, CarFront, LifeBuoy];
const benefits = [
  ["24/7 Availability", "Emergency assistance whenever you need it."],
  ["Safe Service", "Careful handling of your vehicle."],
  ["Dammam Based", "Serving Dammam and nearby areas."],
  ["Reliable Support", "Clear communication and professional service."],
];
export default function Home() {
  const [ar, setAr] = useState(false),
    [menu, setMenu] = useState(false),
    [status, setStatus] = useState("idle");
  const t = (en: string, arabic?: string) =>
    ar ? arabic || (translations as Record<string, string>)[en] || en : en;
  useEffect(() => {
    try {
      setAr(localStorage.getItem("kayaniLang") === "ar");
    } catch {}
  }, []);
  useEffect(() => {
    document.documentElement.lang = ar ? "ar" : "en";
    document.documentElement.dir = ar ? "rtl" : "ltr";
  }, [ar]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  function toggle() {
    setAr(!ar);
    try {
      localStorage.setItem("kayaniLang", !ar ? "ar" : "en");
    } catch {}
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, consent: data.consent === "on" }),
        signal: AbortSignal.timeout(60000),
      });
      const result = await response.json();
      if (response.ok) {
        setStatus("success");
        form.reset();
      } else setStatus(result.error || "error");
    } catch {
      setStatus("error");
    }
  }
  return (
    <>
      <a className="skip" href="#main">
        {t("Skip to content", "انتقل إلى المحتوى")}
      </a>
      <div className="topbar">
        <div className="wrap">
          <span>
            <span className="live-dot" />
            {t("AVAILABLE 24/7")}
          </span>
          <span>
            <MapPin size={13} />
            {t("Dammam, Saudi Arabia")}
          </span>
        </div>
      </div>
      <header className="header">
        <div className="wrap nav">
          <a href="#home" aria-label="Kayani Towing Service home">
            <img
              className="logo"
              src="/logo-light.svg"
              alt="Kayani Towing Service"
              width="220"
              height="57"
            />
          </a>
          <nav
            className={menu ? "navlinks open" : "navlinks"}
            aria-label={t("Main navigation", "القائمة الرئيسية")}
          >
            {["Home", "Services", "About Us", "Contact Us"].map((label, i) => (
              <a
                key={label}
                href={["#home", "#services", "#about", "#contact"][i]}
                onClick={() => setMenu(false)}
              >
                {t(label)}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            <button
              className="language"
              onClick={toggle}
              aria-label={ar ? "Switch to English" : "التبديل إلى العربية"}
            >
              {ar ? "EN" : "العربية"}
            </button>
            <a className="button small nav-call" href={phone}>
              <Phone size={15} />
              <span dir="ltr">050 796 3500</span>
            </a>
            <button
              className="menu"
              aria-expanded={menu}
              aria-label={t("Toggle menu", "فتح القائمة")}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <main id="main">
        <section id="home" className="hero">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">
                <span /> {t("DAMMAM • SAUDI ARABIA")}
              </p>
              <h1>
                {t("A little roadside", "مساعدة على الطريق")}
                <br />{t("trouble?", "وقت الحاجة؟")}<br />
                <span>{t("We’re on your side.", "نحن بجانبك.")}</span>
              </h1>
              <p className="hero-description">
                {t(
                  "Fast, safe and reliable towing and recovery service in Dammam. Professional assistance whenever you need it.",
                )}
              </p>
              <div className="actions">
                <a className="button" href={phone}>
                  <Phone size={18} />
                  {t("Call now", "اتصل الآن")}
                  <ArrowUpRight size={18} />
                </a>
                <a className="button outline" href={whatsapp}>
                  <MessageCircle size={18} />
                  {t("WhatsApp")}
                </a>
              </div>
              <div className="hero-note">
                <ShieldCheck size={17} />
                {t("Your vehicle. In safe hands.", "مركبتك في أيدٍ أمينة.")}
              </div>
            </div>
            <div className="hero-visual">
              <img className="hero-photo" src="/towing-hero-v2.png"
                alt={t("Illustration of an orange flatbed truck carrying a car beside a Saudi coastal road", "صورة توضيحية لشاحنة نقل برتقالية تحمل سيارة بجوار طريق ساحلي سعودي")}
                width="1536" height="1024" fetchPriority="high" />
              <div className="image-location"><MapPin size={15}/>{t("Dammam, Saudi Arabia")}</div>
              <div className="availability"><div className="availability-icon"><Clock3 size={27}/></div><div><strong>{t("Day or night. We’re here.", "ليلاً ونهاراً. نحن هنا.")}</strong><small><span className="live-dot"/>{t("24/7 Emergency Service", "خدمة طوارئ على مدار الساعة")}</small></div><ArrowUpRight size={22}/></div>
              <div className="image-label">{t("TOWING & RECOVERY", "السحب والإنقاذ")}<span>01 — KAYANI</span></div>
            </div>
          </div>
          <a className="explore wrap" href="#services">
            {t("Explore our services", "اكتشف خدماتنا")} <span>↓</span>
          </a>
        </section>
        <div className="trustbar">
          <div className="wrap trust-grid">
            {[
              ["24/7", "Emergency Service"],
              ["SAFE", "Safe & Secure"],
              ["FAST", "Fast Response"],
              ["PRO", "Professional Equipment"],
            ].map(([heading, label]) => (
              <div key={heading}>
                <strong>
                  {t(
                    heading,
                    (
                      { SAFE: "آمن", FAST: "سريع", PRO: "احترافي" } as Record<
                        string,
                        string
                      >
                    )[heading],
                  )}
                </strong>
                <span>{t(label)}</span>
              </div>
            ))}
          </div>
        </div>
        <section id="services" className="section light">
          <div className="wrap">
            <div className="section-heading reveal">
              <div>
                <p className="eyebrow">{t("Towing & Recovery Services")}</p>
                <h2>{t("Whatever the road brings.", "مهما واجهتك ظروف الطريق.")}<br/><span className="heading-muted">{t("We have you covered.", "نحن هنا لمساعدتك.")}</span></h2>
              </div>
              <p>
                {t(
                  "Whatever the road brings, we’re here to help.",
                  "مهما واجهتك ظروف الطريق، نحن هنا لمساعدتك.",
                )}
              </p>
            </div>
            <div className="service-grid">
              {services.map((service, i) => {
                const Icon = icons[i];
                return (
                  <a
                    className="service-card reveal"
                    href="#contact"
                    key={service}
                  >
                    <div className="card-top">
                      <Icon size={32} strokeWidth={1.5} />
                      <span>0{i + 1}</span>
                    </div>
                    <h3>{t(service)}</h3>
                    <p>{t(descriptions[i])}</p>
                    <span className="card-link">
                      {t("Request assistance", "اطلب المساعدة")}
                      <ArrowUpRight size={19} />
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
        <section id="about" className="section about">
          <div className="wrap about-grid">
            <div className="about-art reveal">
              <div className="about-art-top"><img src="/icon.svg" alt="" width="70" height="66"/><span>{t("ALWAYS READY", "جاهزون دائماً")}</span></div>
              <strong className="around-clock">24<span>/</span>7</strong>
              <p>{t("Good days. Tough days.", "في الأيام السهلة والصعبة.")}<br/><span>{t("We’re a call away.", "نحن على بُعد مكالمة.")}</span></p>
              <div className="about-caption"><MapPin size={18}/>{t("Serving Dammam and nearby areas.")}</div>
              <svg className="route-art" viewBox="0 0 300 300" aria-hidden="true"><path d="M310 45H190q-70 0-70 70v20q0 50 50 50h35q45 0 45 45t-45 45H90" fill="none" stroke="currentColor" strokeWidth="40"/><path d="M310 45H190q-70 0-70 70v20q0 50 50 50h35q45 0 45 45t-45 45H90" fill="none" stroke="#ff7b33" strokeWidth="2" strokeDasharray="10 10"/></svg>
            </div>
            <div className="reveal">
              <p className="eyebrow">{t("About Us")}</p>
              <h2>{t("Reliable Help When You Need It")}</h2>
              <p className="about-description">
                {t(
                  "Kayani Towing Service provides professional towing and recovery solutions in Dammam, Saudi Arabia. We focus on fast response, safe vehicle handling and dependable customer service.",
                )}
              </p>
              <div className="about-checks">
                {[
                  "Fast Response",
                  "Safe & Secure",
                  "Professional Equipment",
                ].map((label) => (
                  <span key={label}>
                    <Check size={18} />
                    {t(label)}
                  </span>
                ))}
              </div>
              <a href="#contact" className="text-link">
                {t("Let’s get you moving", "دعنا نساعدك على الانطلاق")}
                <ArrowRight size={20} />
              </a>
            </div>
          </div>
        </section>
        <section className="section light">
          <div className="wrap">
            <div className="section-heading reveal">
              <div>
                <p className="eyebrow">{t("Why Choose Us")}</p>
                <h2>{t("Professional & Dependable")}</h2>
              </div>
            </div>
            <div className="benefit-grid">
              {benefits.map(([title, description], i) => {
                const Icon = [Clock3, ShieldCheck, MapPin, MessageCircle][i];
                return (
                  <div className="benefit reveal" key={title}>
                    <Icon size={27} />
                    <h3>{t(title)}</h3>
                    <p>{t(description)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        <section id="contact" className="section contact">
          <div className="wrap contact-grid">
            <div className="reveal">
              <p className="eyebrow">{t("Contact Us")}</p>
              <h2>{t("Need Towing? Call Now")}</h2>
              <p className="contact-intro">
                {t(
                  "For urgent help, call or WhatsApp us directly. For other enquiries, send us a message.",
                  "للمساعدة العاجلة، اتصل بنا أو تواصل عبر واتساب. للاستفسارات الأخرى، أرسل لنا رسالة.",
                )}
              </p>
              <a className="contact-detail" href={phone}>
                <Phone />
                <div>
                  <small>{t("Phone")}</small>
                  <strong dir="ltr">+966 50 796 3500</strong>
                </div>
                <ArrowUpRight />
              </a>
              <a className="contact-detail" href={whatsapp}>
                <MessageCircle />
                <div>
                  <small>{t("WhatsApp")}</small>
                  <strong>{t("Chat on WhatsApp")}</strong>
                </div>
                <ArrowUpRight />
              </a>
              <div className="contact-detail">
                <MapPin />
                <div>
                  <small>{t("Location")}</small>
                  <strong>{t("Dammam, Saudi Arabia")}</strong>
                </div>
              </div>
              <div className="contact-ready">
                <span className="live-dot" />
                {t("AVAILABLE 24/7")}
              </div>
            </div>
            <form className="contact-form reveal" onSubmit={submit}>
              <h3>{t("How can we help?", "كيف يمكننا مساعدتك؟")}</h3>
              <p>
                {t(
                  "Tell us what you need. We’ll take it from here.",
                  "أخبرنا بما تحتاج إليه وسنتولى الباقي.",
                )}
              </p>
              <div className="form-grid">
                <label>
                  {t("Full name", "الاسم الكامل")}
                  <input
                    name="name"
                    autoComplete="name"
                    required
                    minLength={2}
                    maxLength={100}
                    placeholder={t("Your name", "اسمك")}
                  />
                </label>
                <label>
                  {t("Phone number", "رقم الهاتف")}
                  <input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    minLength={7}
                    maxLength={25}
                    placeholder="+966"
                  />
                </label>
                <label>
                  {t("Email address", "البريد الإلكتروني")}
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    placeholder="you@example.com"
                  />
                </label>
                <label>
                  {t("Service needed", "الخدمة المطلوبة")}
                  <select name="service" required defaultValue="">
                    <option value="" disabled>
                      {t("Choose a service", "اختر الخدمة")}
                    </option>
                    {services.map((service) => (
                      <option key={service} value={service}>
                        {t(service)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="full">
                  {t("Your location", "موقعك")}
                  <input
                    name="location"
                    required
                    minLength={2}
                    maxLength={200}
                    placeholder={t(
                      "Area, street or nearby landmark",
                      "الحي أو الشارع أو أقرب معلم",
                    )}
                  />
                </label>
                <label className="full">
                  {t("Message", "الرسالة")}
                  <textarea
                    name="message"
                    required
                    minLength={10}
                    maxLength={3000}
                    rows={4}
                    placeholder={t(
                      "Tell us about your vehicle and how we can help…",
                      "أخبرنا عن مركبتك وكيف يمكننا مساعدتك…",
                    )}
                  />
                </label>
              </div>
              <div className="honeypot" aria-hidden="true">
                <label>
                  Website
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>
              <label className="consent">
                <input name="consent" type="checkbox" required />
                <span>
                  {t(
                    "I agree to have my details stored and emailed to Kayani Towing Service to respond to my enquiry.",
                    "أوافق على حفظ بياناتي وإرسالها بالبريد الإلكتروني إلى كاياني للرد على استفساري.",
                  )}
                </span>
              </label>
              <button
                className="button submit"
                disabled={status === "sending"}
                type="submit"
              >
                {status === "sending" ? (
                  <LoaderCircle className="spin" size={18} />
                ) : (
                  <ArrowUpRight size={18} />
                )}{" "}
                {status === "sending"
                  ? t("Sending…", "جارٍ الإرسال…")
                  : t("Send message", "إرسال الرسالة")}
              </button>
              <div aria-live="polite" role="status">
                {status === "success" && (
                  <p className="feedback success">
                    {t(
                      "Message sent. Thank you for contacting Kayani Towing Service.",
                      "تم إرسال رسالتك. شكراً لتواصلك مع كاياني.",
                    )}
                  </p>
                )}
                {!["idle", "sending", "success"].includes(status) && (
                  <p className="feedback error">
                    {status === "EMAIL_FAILED"
                      ? t(
                          "Your request was saved, but email delivery failed. Please call or WhatsApp us for assistance.",
                          "تم حفظ طلبك لكن تعذر إرسال البريد. يرجى الاتصال أو التواصل عبر واتساب.",
                        )
                      : status === "RATE_LIMIT"
                        ? t(
                            "Too many requests. Please wait 15 minutes or call us directly.",
                            "طلبات كثيرة. انتظر 15 دقيقة أو اتصل بنا مباشرة.",
                          )
                        : status === "INVALID"
                          ? t(
                              "Please check all fields and try again.",
                              "يرجى مراجعة جميع الحقول والمحاولة مرة أخرى.",
                            )
                          : t(
                              "We couldn’t confirm delivery. Please call or WhatsApp us for assistance.",
                              "تعذر تأكيد الإرسال. يرجى الاتصال أو التواصل عبر واتساب.",
                            )}
                  </p>
                )}
              </div>
            </form>
          </div>
        </section>
        <section className="closing">
          <div className="wrap">
            <div>
              <span>
                {t(
                  "A little help. A long way.",
                  "مساعدة صغيرة تصنع فرقاً كبيراً.",
                )}
              </span>
              <h2>
                {t("Back on the road, together.", "معاً نعود إلى الطريق.")}
              </h2>
            </div>
            <a className="button dark-button" href={phone}>
              <Phone size={18} />
              {t("Call now", "اتصل الآن")}
              <ArrowUpRight size={20} />
            </a>
          </div>
        </section>
      </main>
      <footer>
        <div className="wrap footer-main">
          <a href="#home">
            <img
              src="/logo.svg"
              width="210"
              height="54"
              alt="Kayani Towing Service"
            />
          </a>
          <p>
            {t("Dammam, Saudi Arabia")}
            <br />
            {t("AVAILABLE 24/7")}
          </p>
          <a href="#home" className="back-top">
            {t("Back to top", "العودة للأعلى")} ↑
          </a>
        </div>
        <div className="wrap footer-bottom">
          <span>© 2026 Kayani Towing Service. {t("All Rights Reserved.")}</span>
          <span>
            {t(
              "Towing • Recovery • Roadside assistance",
              "سحب • إنقاذ • مساعدة على الطريق",
            )}
          </span>
        </div>
      </footer>
    </>
  );
}

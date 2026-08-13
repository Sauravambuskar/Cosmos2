import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Save, RotateCcw, Building2, Phone, Share2, LayoutTemplate,
  PanelBottom, Search, ToggleLeft, MapPin, Plus, Trash2, AlertTriangle, Check,
} from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { adminJson } from "@/lib/adminAuth";
import { DEFAULT_SETTINGS, withDefaults, type SiteSettings } from "@/lib/site-settings";
import { SITE_SETTINGS_KEY } from "@/hooks/use-site-settings";

type Section =
  | "brand" | "contact" | "social" | "home" | "footer" | "seo" | "features" | "locations";

const SECTIONS: { key: Section; label: string; icon: typeof Building2; hint: string }[] = [
  { key: "brand",     label: "Brand",     icon: Building2,      hint: "Name, logo, footer blurb, credentials" },
  { key: "contact",   label: "Contact",   icon: Phone,          hint: "Phones, WhatsApp, email, address, hours" },
  { key: "social",    label: "Social",    icon: Share2,         hint: "Profile links shown in the footer" },
  { key: "home",      label: "Homepage",  icon: LayoutTemplate, hint: "Hero copy, stats bar, section headings" },
  { key: "footer",    label: "Footer",    icon: PanelBottom,    hint: "Footer link columns" },
  { key: "seo",       label: "SEO",       icon: Search,         hint: "Titles, description, analytics, indexing" },
  { key: "features",  label: "Features",  icon: ToggleLeft,     hint: "Switch site behaviour on and off" },
  { key: "locations", label: "Locations", icon: MapPin,         hint: "Localities offered in the listing form" },
];

const inputClass =
  "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";

function Field({
  label, value, onChange, placeholder, hint, type = "text",
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; hint?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function TextArea({
  label, value, onChange, rows = 3, hint,
}: { label: string; value: string; onChange: (v: string) => void; rows?: number; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function Toggle({
  label, description, checked, onChange, danger,
}: {
  label: string; description: string; checked: boolean;
  onChange: (v: boolean) => void; danger?: boolean;
}) {
  return (
    <label className="flex items-start justify-between gap-4 py-3 border-b border-gray-50 last:border-0 cursor-pointer">
      <span className="min-w-0">
        <span className={`block text-sm font-medium ${danger && checked ? "text-amber-700" : "text-gray-800"}`}>
          {label}
        </span>
        <span className="block text-xs text-gray-400 mt-0.5">{description}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 mt-0.5 ${
          checked ? (danger ? "bg-amber-500" : "bg-primary") : "bg-gray-200"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </label>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
      <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">{title}</h3>
      {children}
    </div>
  );
}

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [section, setSection] = useState<Section>("brand");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    adminJson<Partial<SiteSettings>>("/api/admin/settings")
      .then((data) => setSettings(withDefaults(data)))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load settings"))
      .finally(() => setLoading(false));
  }, []);

  // Warn before losing edits — the form holds a lot of copy that is tedious to retype.
  useEffect(() => {
    if (!dirty) return;
    const onLeave = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [dirty]);

  /** Patch one field inside one section. */
  function patch<K extends keyof SiteSettings>(key: K, value: Partial<SiteSettings[K]>) {
    setSettings((prev) => ({ ...prev, [key]: { ...(prev[key] as object), ...value } }));
    setDirty(true);
    setSaved(false);
  }

  function setRoot<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError("");
    try {
      const updated = await adminJson<SiteSettings>("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify(settings),
      });
      setSettings(withDefaults(updated));
      setDirty(false);
      setSaved(true);
      // Refresh the public site's copy so the change is visible immediately.
      await queryClient.invalidateQueries({ queryKey: SITE_SETTINGS_KEY });
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  async function reset() {
    setConfirmReset(false);
    setSaving(true);
    try {
      const defaults = await adminJson<SiteSettings>("/api/admin/settings/reset", { method: "POST" });
      setSettings(withDefaults(defaults));
      setDirty(false);
      await queryClient.invalidateQueries({ queryKey: SITE_SETTINGS_KEY });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to reset settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </AdminLayout>
    );
  }

  const { brand, contact, social, home, footer, seo, features, locations } = settings;

  return (
    <AdminLayout>
      {confirmReset && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="font-semibold text-gray-900 mb-2">Restore default content?</h3>
            <p className="text-sm text-gray-500 mb-5">
              Every setting on every tab goes back to the built-in values. Your properties,
              projects and leads are not affected.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmReset(false)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm">
                Cancel
              </button>
              <button onClick={reset} className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium">
                Restore defaults
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Site Settings</h2>
            <p className="text-sm text-gray-500">
              Everything on the public website that isn't a listing — edit it here, no code needed.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setConfirmReset(true)}
              className="flex items-center gap-2 border border-gray-200 bg-white text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
            >
              <RotateCcw size={14} /> Restore defaults
            </button>
            <button
              onClick={save}
              disabled={saving || !dirty}
              className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
              data-testid="button-save-settings"
            >
              {saved ? <Check size={15} /> : <Save size={15} />}
              {saving ? "Saving…" : saved ? "Saved" : dirty ? "Save changes" : "Saved"}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}
        {dirty && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded-lg px-4 py-2.5">
            You have unsaved changes.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Section nav */}
          <nav className="bg-white rounded-xl p-2 shadow-sm h-fit lg:sticky lg:top-6 flex lg:flex-col gap-1 overflow-x-auto">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              const active = section === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => setSection(s.key)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left transition-colors whitespace-nowrap flex-shrink-0 lg:w-full ${
                    active ? "bg-primary/10 text-primary font-medium" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  <span className="min-w-0">
                    <span className="block">{s.label}</span>
                    <span className="hidden lg:block text-[11px] text-gray-400 font-normal leading-tight">
                      {s.hint}
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Panels */}
          <div className="lg:col-span-3 space-y-5">
            {section === "brand" && (
              <Card title="Brand & Identity">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Logo text" value={brand.name} onChange={(v) => patch("brand", { name: v })} hint="Shown in the header and footer" />
                  <Field label="Logo sub-text" value={brand.tagline} onChange={(v) => patch("brand", { tagline: v })} />
                  <Field label="Business name" value={brand.legalName} onChange={(v) => patch("brand", { legalName: v })} hint="Used in page titles and structured data" />
                  <Field label="Logo image URL" value={brand.logoUrl} onChange={(v) => patch("brand", { logoUrl: v })} placeholder="/images/logo.png — leave blank for text logo" />
                </div>
                <TextArea label="Footer description" value={brand.footerAbout} onChange={(v) => patch("brand", { footerAbout: v })} />
                <Field
                  label="Credential badges"
                  value={brand.badges.join(", ")}
                  onChange={(v) => patch("brand", { badges: v.split(",").map((s) => s.trim()).filter(Boolean) })}
                  hint="Comma separated, e.g. NAR INDIA, FMP CERTIFIED"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Copyright name" value={brand.copyrightName} onChange={(v) => patch("brand", { copyrightName: v })} />
                  <Field label="Credit line" value={brand.designedBy} onChange={(v) => patch("brand", { designedBy: v })} hint="Shown as “Designed by …”" />
                </div>
              </Card>
            )}

            {section === "contact" && (
              <>
                <Card title="Phone & Email">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Primary phone" value={contact.phonePrimary} onChange={(v) => patch("contact", { phonePrimary: v })} />
                    <Field label="Secondary phone" value={contact.phoneSecondary} onChange={(v) => patch("contact", { phoneSecondary: v })} />
                    <Field label="WhatsApp number" value={contact.whatsapp} onChange={(v) => patch("contact", { whatsapp: v })} hint="Digits with country code, e.g. 919823056983" />
                    <Field label="Email" value={contact.email} onChange={(v) => patch("contact", { email: v })} type="email" />
                  </div>
                </Card>
                <Card title="Address">
                  <TextArea label="Address (as displayed)" value={contact.addressLine} onChange={(v) => patch("contact", { addressLine: v })} rows={2} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Street" value={contact.street} onChange={(v) => patch("contact", { street: v })} hint="Used for Google's business listing data" />
                    <Field label="City" value={contact.city} onChange={(v) => patch("contact", { city: v })} />
                    <Field label="State / region" value={contact.region} onChange={(v) => patch("contact", { region: v })} />
                    <Field label="PIN code" value={contact.postalCode} onChange={(v) => patch("contact", { postalCode: v })} />
                    <Field label="Latitude" value={contact.latitude} onChange={(v) => patch("contact", { latitude: v })} />
                    <Field label="Longitude" value={contact.longitude} onChange={(v) => patch("contact", { longitude: v })} />
                  </div>
                  <Field
                    label="Google Maps embed URL"
                    value={contact.mapEmbedUrl}
                    onChange={(v) => patch("contact", { mapEmbedUrl: v })}
                    placeholder="https://www.google.com/maps/embed?pb=…"
                    hint="Paste the src from Google Maps → Share → Embed a map. Blank shows a static placeholder."
                  />
                </Card>
                <Card title="Availability">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Working hours" value={contact.workingHours} onChange={(v) => patch("contact", { workingHours: v })} />
                    <Field label="Second line" value={contact.workingHoursNote} onChange={(v) => patch("contact", { workingHoursNote: v })} />
                  </div>
                  <Field label="Website URL" value={contact.website} onChange={(v) => patch("contact", { website: v })} />
                </Card>
              </>
            )}

            {section === "social" && (
              <Card title="Social Profiles">
                <p className="text-xs text-gray-400 -mt-2">
                  Leave a field blank to hide that icon from the footer.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Facebook" value={social.facebook} onChange={(v) => patch("social", { facebook: v })} placeholder="https://facebook.com/…" />
                  <Field label="Instagram" value={social.instagram} onChange={(v) => patch("social", { instagram: v })} placeholder="https://instagram.com/…" />
                  <Field label="LinkedIn" value={social.linkedin} onChange={(v) => patch("social", { linkedin: v })} placeholder="https://linkedin.com/company/…" />
                  <Field label="YouTube" value={social.youtube} onChange={(v) => patch("social", { youtube: v })} placeholder="https://youtube.com/@…" />
                  <Field label="X / Twitter" value={social.twitter} onChange={(v) => patch("social", { twitter: v })} placeholder="https://x.com/…" />
                </div>
              </Card>
            )}

            {section === "home" && (
              <>
                <Card title="Hero">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Headline" value={home.heroTitle} onChange={(v) => patch("home", { heroTitle: v })} />
                    <Field label="Highlighted word" value={home.heroHighlight} onChange={(v) => patch("home", { heroHighlight: v })} hint="Rendered in the accent colour after the headline" />
                  </div>
                  <TextArea label="Sub-headline" value={home.heroSubtitle} onChange={(v) => patch("home", { heroSubtitle: v })} rows={2} />
                  <Field label="Background image" value={home.heroImage} onChange={(v) => patch("home", { heroImage: v })} hint="Path or full URL" />
                </Card>
                <Card title="Sell tab pitch">
                  <Field label="Title" value={home.sellPitchTitle} onChange={(v) => patch("home", { sellPitchTitle: v })} />
                  <TextArea label="Text" value={home.sellPitchText} onChange={(v) => patch("home", { sellPitchText: v })} rows={2} />
                </Card>
                <Card title="Stats bar">
                  <div className="space-y-3">
                    {home.stats.map((stat, i) => (
                      <div key={i} className="flex gap-3 items-end">
                        <div className="w-32">
                          <label className="block text-xs text-gray-500 mb-1">Value</label>
                          <input
                            value={stat.value}
                            onChange={(e) => {
                              const stats = [...home.stats];
                              stats[i] = { ...stats[i], value: e.target.value };
                              patch("home", { stats });
                            }}
                            className={inputClass}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-1">Label</label>
                          <input
                            value={stat.label}
                            onChange={(e) => {
                              const stats = [...home.stats];
                              stats[i] = { ...stats[i], label: e.target.value };
                              patch("home", { stats });
                            }}
                            className={inputClass}
                          />
                        </div>
                        <button
                          onClick={() => patch("home", { stats: home.stats.filter((_, j) => j !== i) })}
                          className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Remove"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => patch("home", { stats: [...home.stats, { value: "", label: "" }] })}
                      className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                    >
                      <Plus size={14} /> Add stat
                    </button>
                  </div>
                </Card>
                <Card title="Section headings">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Featured properties title" value={home.featuredPropertiesTitle} onChange={(v) => patch("home", { featuredPropertiesTitle: v })} />
                    <Field label="Featured properties subtitle" value={home.featuredPropertiesSubtitle} onChange={(v) => patch("home", { featuredPropertiesSubtitle: v })} />
                    <Field label="Featured projects title" value={home.featuredProjectsTitle} onChange={(v) => patch("home", { featuredProjectsTitle: v })} />
                    <Field label="“Why us” title" value={home.whyTitle} onChange={(v) => patch("home", { whyTitle: v })} />
                  </div>
                  <TextArea label="“Why us” subtitle" value={home.whySubtitle} onChange={(v) => patch("home", { whySubtitle: v })} rows={2} />
                </Card>
              </>
            )}

            {section === "footer" && (
              <>
                {(["propertyLinks", "quickLinks"] as const).map((listKey) => {
                  const titleKey = listKey === "propertyLinks" ? "propertyLinksTitle" : "quickLinksTitle";
                  const list = footer[listKey];
                  return (
                    <Card key={listKey} title={listKey === "propertyLinks" ? "Property links column" : "Quick links column"}>
                      <Field
                        label="Column heading"
                        value={footer[titleKey]}
                        onChange={(v) => patch("footer", { [titleKey]: v } as Partial<SiteSettings["footer"]>)}
                      />
                      <div className="space-y-3">
                        {list.map((link, i) => (
                          <div key={i} className="flex gap-3 items-end">
                            <div className="flex-1">
                              <label className="block text-xs text-gray-500 mb-1">Text</label>
                              <input
                                value={link.label}
                                onChange={(e) => {
                                  const next = [...list];
                                  next[i] = { ...next[i], label: e.target.value };
                                  patch("footer", { [listKey]: next } as Partial<SiteSettings["footer"]>);
                                }}
                                className={inputClass}
                              />
                            </div>
                            <div className="flex-1">
                              <label className="block text-xs text-gray-500 mb-1">Link</label>
                              <input
                                value={link.href}
                                onChange={(e) => {
                                  const next = [...list];
                                  next[i] = { ...next[i], href: e.target.value };
                                  patch("footer", { [listKey]: next } as Partial<SiteSettings["footer"]>);
                                }}
                                className={inputClass}
                              />
                            </div>
                            <button
                              onClick={() =>
                                patch("footer", {
                                  [listKey]: list.filter((_, j) => j !== i),
                                } as Partial<SiteSettings["footer"]>)
                              }
                              className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                              title="Remove"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() =>
                            patch("footer", {
                              [listKey]: [...list, { label: "", href: "/" }],
                            } as Partial<SiteSettings["footer"]>)
                          }
                          className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                        >
                          <Plus size={14} /> Add link
                        </button>
                      </div>
                    </Card>
                  );
                })}
              </>
            )}

            {section === "seo" && (
              <>
                <Card title="Search & Sharing">
                  <Field label="Site URL" value={seo.siteUrl} onChange={(v) => patch("seo", { siteUrl: v })} hint="No trailing slash — used for canonical links and the sitemap" />
                  <Field label="Site name" value={seo.siteName} onChange={(v) => patch("seo", { siteName: v })} />
                  <Field label="Default page title" value={seo.defaultTitle} onChange={(v) => patch("seo", { defaultTitle: v })} hint={`${seo.defaultTitle.length} characters — keep under 60`} />
                  <TextArea label="Default description" value={seo.defaultDescription} onChange={(v) => patch("seo", { defaultDescription: v })} hint={`${seo.defaultDescription.length} characters — keep under 160`} />
                  <TextArea label="Keywords" value={seo.defaultKeywords} onChange={(v) => patch("seo", { defaultKeywords: v })} rows={2} />
                  <Field label="Share image" value={seo.ogImage} onChange={(v) => patch("seo", { ogImage: v })} hint="Shown when a link is posted to WhatsApp, Facebook, etc." />
                </Card>
                <Card title="Business data">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Founded" value={seo.foundingYear} onChange={(v) => patch("seo", { foundingYear: v })} />
                    <Field label="Google Analytics ID" value={seo.googleAnalyticsId} onChange={(v) => patch("seo", { googleAnalyticsId: v })} placeholder="G-XXXXXXX" />
                  </div>
                  <Field label="Areas served" value={seo.areaServed} onChange={(v) => patch("seo", { areaServed: v })} hint="Comma separated" />
                  <Toggle
                    label="Hide the site from search engines"
                    description="Adds noindex to every page. Use while staging, and remember to switch it back off."
                    checked={seo.noindexSite}
                    onChange={(v) => patch("seo", { noindexSite: v })}
                    danger
                  />
                </Card>
              </>
            )}

            {section === "features" && (
              <>
                <Card title="Visitor-facing features">
                  <div className="-my-1">
                    <Toggle label="WhatsApp chat button" description="The floating green button in the bottom-right corner." checked={features.whatsappWidget} onChange={(v) => patch("features", { whatsappWidget: v })} />
                    <Toggle label="Enquiry form" description="When off, the contact form is replaced with your phone number." checked={features.contactFormEnabled} onChange={(v) => patch("features", { contactFormEnabled: v })} />
                    <Toggle label="Stats bar on homepage" description="The “500+ properties / 20+ years” row under the hero." checked={features.showStatsBar} onChange={(v) => patch("features", { showStatsBar: v })} />
                    <Toggle label="Featured properties section" description="Homepage carousel of listings marked as featured." checked={features.showFeaturedProperties} onChange={(v) => patch("features", { showFeaturedProperties: v })} />
                    <Toggle label="Featured projects section" description="Homepage grid of projects marked as featured." checked={features.showFeaturedProjects} onChange={(v) => patch("features", { showFeaturedProjects: v })} />
                    <Toggle label="Projects in the menu" description="Hide if you have no projects to show yet." checked={features.showProjectsNav} onChange={(v) => patch("features", { showProjectsNav: v })} />
                  </div>
                </Card>

                <Card title="Announcement bar">
                  <Toggle label="Show announcement bar" description="A strip across the top of every page." checked={features.announcementEnabled} onChange={(v) => patch("features", { announcementEnabled: v })} />
                  <Field label="Message" value={features.announcementText} onChange={(v) => patch("features", { announcementText: v })} placeholder="New project launching in Kharadi — book a site visit" />
                  <Field label="Link (optional)" value={features.announcementLink} onChange={(v) => patch("features", { announcementLink: v })} placeholder="/projects" />
                </Card>

                <Card title="Maintenance">
                  <Toggle
                    label="Maintenance mode"
                    description="Visitors see a notice instead of the site. The admin panel keeps working."
                    checked={features.maintenanceMode}
                    onChange={(v) => patch("features", { maintenanceMode: v })}
                    danger
                  />
                  <TextArea label="Maintenance message" value={features.maintenanceMessage} onChange={(v) => patch("features", { maintenanceMessage: v })} rows={2} />
                  {features.maintenanceMode && (
                    <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg px-4 py-3">
                      <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                      <span>The public site is hidden from visitors while this is on.</span>
                    </div>
                  )}
                </Card>
              </>
            )}

            {section === "locations" && (
              <Card title="Localities">
                <p className="text-xs text-gray-400 -mt-2">
                  These fill the “Locality” dropdown when adding a property. One per line.
                </p>
                <textarea
                  value={locations.join("\n")}
                  rows={14}
                  onChange={(e) =>
                    setRoot("locations", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))
                  }
                  className={inputClass}
                />
                <p className="text-xs text-gray-400">{locations.length} localities</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

import {
  Accessibility,
  ArrowLeft,
  Check,
  ChevronRight,
  Eye,
  Gauge,
  Languages,
  Moon,
  Monitor,
  Palette,
  RotateCcw,
  Smartphone,
  Sun,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const languageOptions = [
  { value: "english", label: "English", description: "Use English across LoanPro." },
  { value: "hindi", label: "Hindi", description: "Use Hindi where supported." },
];

const themeOptions = [
  {
    value: "light",
    label: "Light",
    description: "Bright interface with a clean appearance.",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    description: "Darker interface for lower-light environments.",
    icon: Moon,
  },
  {
    value: "system",
    label: "System default",
    description: "Follow your device or browser preference.",
    icon: Monitor,
  },
];

function AppExperience() {
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("english");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const resetPreferences = () => {
    setTheme("light");
    setLanguage("english");
    setReducedMotion(false);
    setCompactMode(false);
    setLargeText(false);
    setSaved(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b bg-muted/30">
        <div className="page-container py-6 sm:py-8">
          <Link
            to="/menu"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Menu
          </Link>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                <Palette className="h-4 w-4" />
                App settings
              </div>

              <h1 className="mt-2 text-3xl font-bold tracking-tight">
                App Experience
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Personalize how LoanPro looks, feels, and behaves on your
                device.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              <Check className="h-4 w-4" />
              Save Preferences
            </button>
          </div>
        </div>
      </section>

      <main className="page-container py-8 lg:py-10">
        {saved && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <Check className="h-5 w-5 shrink-0" />
            <span>Your app preferences have been saved.</span>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* Main */}
          <div className="min-w-0 space-y-6">
            {/* Appearance */}
            <section className="rounded-2xl border bg-card p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Palette className="h-5 w-5" />
                </div>

                <div>
                  <p className="section-eyebrow">Appearance</p>
                  <h2 className="mt-1 text-lg font-semibold">
                    Choose how LoanPro looks
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Select the visual theme that feels most comfortable for
                    you.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const active = theme === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setTheme(option.value);
                        setSaved(false);
                      }}
                      className={[
                        "relative rounded-2xl border p-4 text-left transition",
                        active
                          ? "border-primary bg-primary/5 ring-2 ring-primary/15"
                          : "hover:bg-muted/50",
                      ].join(" ")}
                    >
                      {active && (
                        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="h-3 w-3" />
                        </span>
                      )}

                      <div
                        className={[
                          "flex h-10 w-10 items-center justify-center rounded-xl",
                          active
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground",
                        ].join(" ")}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <h3 className="mt-4 text-sm font-semibold">
                        {option.label}
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {option.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Language */}
            <section className="rounded-2xl border bg-card p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                  <Languages className="h-5 w-5" />
                </div>

                <div>
                  <p className="section-eyebrow">Language</p>

                  <h2 className="mt-1 text-lg font-semibold">
                    Preferred language
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Choose your preferred language for supported LoanPro
                    experiences.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                {languageOptions.map((option) => {
                  const active = language === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setLanguage(option.value);
                        setSaved(false);
                      }}
                      className={[
                        "flex w-full items-center justify-between rounded-xl border px-4 py-4 text-left transition",
                        active
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/50",
                      ].join(" ")}
                    >
                      <div>
                        <p className="text-sm font-semibold">{option.label}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {option.description}
                        </p>
                      </div>

                      <span
                        className={[
                          "flex h-5 w-5 items-center justify-center rounded-full border",
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/30",
                        ].join(" ")}
                      >
                        {active && <Check className="h-3 w-3" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Accessibility */}
            <section className="rounded-2xl border bg-card p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                  <Accessibility className="h-5 w-5" />
                </div>

                <div>
                  <p className="section-eyebrow">Accessibility</p>

                  <h2 className="mt-1 text-lg font-semibold">
                    Make the interface easier to use
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Adjust visual and motion preferences for a more comfortable
                    experience.
                  </p>
                </div>
              </div>

              <div className="mt-5 divide-y rounded-xl border">
                {/* Large text */}
                <PreferenceToggle
                  title="Larger text"
                  description="Increase text sizing in supported areas."
                  icon={Eye}
                  enabled={largeText}
                  onChange={() => {
                    setLargeText((current) => !current);
                    setSaved(false);
                  }}
                />

                {/* Reduced motion */}
                <PreferenceToggle
                  title="Reduce motion"
                  description="Use fewer animated transitions and effects."
                  icon={Gauge}
                  enabled={reducedMotion}
                  onChange={() => {
                    setReducedMotion((current) => !current);
                    setSaved(false);
                  }}
                />

                {/* Compact mode */}
                <PreferenceToggle
                  title="Compact layout"
                  description="Show more information with tighter spacing where supported."
                  icon={Smartphone}
                  enabled={compactMode}
                  onChange={() => {
                    setCompactMode((current) => !current);
                    setSaved(false);
                  }}
                />
              </div>
            </section>

            {/* Experience details */}
            <section className="rounded-2xl border bg-card p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                  <Zap className="h-5 w-5" />
                </div>

                <div>
                  <p className="section-eyebrow">Experience</p>

                  <h2 className="mt-1 text-lg font-semibold">
                    What these settings change
                  </h2>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {[
                  {
                    title: "Theme",
                    value:
                      theme === "system"
                        ? "System default"
                        : theme === "dark"
                          ? "Dark"
                          : "Light",
                  },
                  {
                    title: "Language",
                    value:
                      language === "english" ? "English" : "Hindi",
                  },
                  {
                    title: "Larger text",
                    value: largeText ? "On" : "Off",
                  },
                  {
                    title: "Reduced motion",
                    value: reducedMotion ? "On" : "Off",
                  },
                  {
                    title: "Compact layout",
                    value: compactMode ? "On" : "Off",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center justify-between rounded-xl border bg-muted/20 px-4 py-3"
                  >
                    <span className="text-sm text-muted-foreground">
                      {item.title}
                    </span>

                    <span className="text-sm font-semibold">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Reset */}
            <section className="rounded-2xl border border-dashed bg-card p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-semibold">Reset app preferences</h2>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Restore the default LoanPro experience settings.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetPreferences}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition hover:bg-muted"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
            {/* Current preference */}
            <section className="rounded-2xl border bg-card p-5">
              <p className="section-eyebrow">Current experience</p>

              <h2 className="mt-1 text-lg font-semibold">
                Your preferences
              </h2>

              <div className="mt-5 space-y-3">
                <SummaryRow
                  label="Theme"
                  value={
                    theme === "system"
                      ? "System"
                      : theme === "dark"
                        ? "Dark"
                        : "Light"
                  }
                />

                <SummaryRow
                  label="Language"
                  value={language === "english" ? "English" : "Hindi"}
                />

                <SummaryRow
                  label="Large text"
                  value={largeText ? "On" : "Off"}
                />

                <SummaryRow
                  label="Reduced motion"
                  value={reducedMotion ? "On" : "Off"}
                />

                <SummaryRow
                  label="Compact layout"
                  value={compactMode ? "On" : "Off"}
                />
              </div>
            </section>

            {/* Mobile note */}
            <section className="rounded-2xl border bg-primary p-5 text-primary-foreground">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/10">
                <Smartphone className="h-5 w-5" />
              </div>

              <h2 className="mt-4 font-semibold">
                Designed for every screen
              </h2>

              <p className="mt-2 text-sm leading-6 text-primary-foreground/75">
                LoanPro adapts its layout across mobile, tablet, and desktop
                screens so important financial information stays easy to
                access.
              </p>
            </section>

            {/* Related settings */}
            <section className="rounded-2xl border bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Related settings
              </p>

              <Link
                to="/notification-preferences"
                className="group mt-4 flex items-center justify-between rounded-xl border bg-background px-4 py-3 transition hover:bg-muted/50"
              >
                <div>
                  <p className="text-sm font-semibold">
                    Notification Preferences
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Manage alerts and notification channels.
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5" />
              </Link>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

function PreferenceToggle({
  title,
  description,
  icon: Icon,
  enabled,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between gap-5 px-4 py-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-4 w-4" />
        </div>

        <div>
          <p className="text-sm font-semibold">{title}</p>

          <p className="mt-1 max-w-xl text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={onChange}
        className={[
          "relative h-6 w-11 shrink-0 rounded-full transition",
          enabled ? "bg-primary" : "bg-muted-foreground/30",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-1 h-4 w-4 rounded-full bg-white transition",
            enabled ? "left-6" : "left-1",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

export default AppExperience;
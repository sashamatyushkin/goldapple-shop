import { useNav, type Screen } from "../store/useNav";
import { useCart } from "../store/useCart";
import { haptic } from "../telegram";

const tabs: { screen: Screen; label: string; icon: JSX.Element }[] = [
  {
    screen: "home",
    label: "главная",
    icon: (
      <path d="M4 11.5 12 4l8 7.5M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" />
    ),
  },
  {
    screen: "catalog",
    label: "каталог",
    icon: <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-3.5-3.5" /></>,
  },
  {
    screen: "cart",
    label: "корзина",
    icon: (
      <><path d="M6 8h12l-1 11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 8Z" /><path d="M9 8a3 3 0 0 1 6 0" /></>
    ),
  },
  {
    screen: "profile",
    label: "профиль",
    icon: <><circle cx="12" cy="8.5" r="3.5" /><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" /></>,
  },
];

export function TabBar() {
  const current = useNav((s) => s.current.screen);
  const selectTab = useNav((s) => s.selectTab);
  const count = useCart((s) => s.count());

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app bg-white/95 backdrop-blur border-t border-black/[0.06] z-40 pb-[var(--tg-safe-bottom)]">
      <div className="flex items-stretch h-[64px]">
        {tabs.map((t) => {
          const active = current === t.screen;
          return (
            <button
              key={t.screen}
              onClick={() => {
                haptic.select();
                selectTab(t.screen);
              }}
              className="flex-1 flex flex-col items-center justify-center gap-1 relative"
            >
              <span className="relative">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={active ? "#0A0A0A" : "#9A9A9A"}
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {t.icon}
                </svg>
                {t.screen === "cart" && count > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-lime text-ink text-[10px] font-bold grid place-items-center">
                    {count}
                  </span>
                )}
              </span>
              <span className={`text-[10px] lowercase ${active ? "text-ink font-semibold" : "text-black/40"}`}>
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

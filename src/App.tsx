import { useEffect } from "react";
import { useNav, TAB_ROOTS } from "./store/useNav";
import { useLoyalty } from "./store/useLoyalty";
import { backButton } from "./telegram";
import { TabBar } from "./components/TabBar";
import { ToastHost } from "./components/ui/Toast";
import { HomeScreen } from "./screens/HomeScreen";
import { CatalogScreen } from "./screens/CatalogScreen";
import { CartScreen } from "./screens/CartScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { ProductScreen } from "./screens/ProductScreen";
import { CheckoutScreen } from "./screens/CheckoutScreen";

export default function App() {
  const { current, pop, canGoBack } = useNav();
  const hydrate = useLoyalty((s) => s.hydrate);
  const isRoot = TAB_ROOTS.includes(current.screen);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  // Синхронизация нативной кнопки «назад» Telegram со стеком навигации
  useEffect(() => {
    const onBack = () => pop();
    if (canGoBack()) backButton.show(onBack);
    else backButton.hide(onBack);
    return () => backButton.hide(onBack);
  }, [current, pop, canGoBack]);

  return (
    <div className="min-h-full max-w-app mx-auto bg-white relative">
      {/* Топ-бар для вложенных экранов (работает и вне Telegram) */}
      {!isRoot && (
        <div className="sticky top-0 z-30 bg-white">
          <div className="h-[calc(48px+var(--tg-safe-top))] pt-[var(--tg-safe-top)] flex items-center px-2">
            <button
              onClick={pop}
              aria-label="назад"
              className="w-10 h-10 grid place-items-center rounded-full active:bg-black/5"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 5-7 7 7 7" />
              </svg>
            </button>
            <span className="text-[15px] font-bold lowercase">
              {current.screen === "product" ? "товар" : "оформление"}
            </span>
          </div>
        </div>
      )}

      <main className={isRoot ? "pb-[80px]" : ""}>
        {current.screen === "home" && <HomeScreen />}
        {current.screen === "catalog" && <CatalogScreen />}
        {current.screen === "cart" && <CartScreen />}
        {current.screen === "profile" && <ProfileScreen />}
        {current.screen === "product" && current.productId && <ProductScreen productId={current.productId} />}
        {current.screen === "checkout" && <CheckoutScreen />}
      </main>

      {isRoot && <TabBar />}
      <ToastHost />
    </div>
  );
}

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = "G-Z9GWNSL714";

export const gtagEvent = (action: string, params?: Record<string, any>) => {
  if (typeof window.gtag === "function") {
    window.gtag("event", action, params);
  }
};

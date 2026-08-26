export interface TourStep {
  key: string;
  /** data-tour values to search for, in priority order; first visible match wins. */
  targets: string[];
  title: string;
  body: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    key: "welcome",
    targets: [],
    title: "Welcome to FarmSet",
    body: "A quick tour of the essentials — takes about 20 seconds.",
  },
  {
    key: "farm-switcher",
    targets: ["farm-switcher"],
    title: "Switch farms",
    body: "Jump between farms, or view all of them rolled up together.",
  },
  {
    key: "stats",
    targets: ["tour-stats"],
    title: "At a glance",
    body: "Sick animals, milk logged, and tasks pending — the first things to check.",
  },
  {
    key: "analytics",
    targets: ["tour-analytics"],
    title: "Track trends",
    body: "Milk yield over the week, and how many tasks are getting done.",
  },
  {
    key: "nav",
    targets: ["tour-nav-desktop", "tour-nav-mobile"],
    title: "Get around",
    body: "Animals, Log, Alerts, and Farms are always one tap away.",
  },
  {
    key: "log",
    targets: ["tour-log-activity"],
    title: "Log from the field",
    body: "Managers log medicine, milk, and tasks here — built for a phone, in seconds. Replay this tour anytime from the menu under Guide me.",
  },
];

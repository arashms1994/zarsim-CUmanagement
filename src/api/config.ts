export const config = {
  BASE_URL: import.meta.env.VITE_BASE_URL,

  LIST_GUIDS: {
    DARKHAST_MAVAD: import.meta.env.VITE_DARKHAST_MAVAD_LIST_GUID,
    SUPPLIERS: import.meta.env.VITE_SUPPLIERS_LIST_GUID,
    PERSONNEL: import.meta.env.VITE_PERSONNEL_LIST_GUID,
    MATERIAL_PRODUCTION: import.meta.env.VITE_MATERIAL_PRODUCTION_LIST_GUID,
    MATERIAL_CHARGE: import.meta.env.VITE_MATERIAL_CHARGE_LIST_GUID,
    SUB_PRODUCTION_PLAN: import.meta.env.VITE_SUB_PRODUCTION_PLAN_LIST_GUID,
    PRINT_TAJMI: import.meta.env.VITE_PRINT_TAJMI_LIST_GUID,
    STOP_LIST: import.meta.env.VITE_STOP_LIST_GUID,
  },

  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT),
  CACHE_STALE_TIME: parseInt(import.meta.env.VITE_CACHE_STALE_TIME),

  APP_NAME: import.meta.env.VITE_APP_NAME,
  VERSION: import.meta.env.VITE_VERSION,

  DEBOUNCE_DELAY: parseInt(import.meta.env.VITE_DEBOUNCE_DELAY),
  SKELETON_ANIMATION_DURATION: parseInt(import.meta.env.VITE_SKELETON_DURATION),
} as const;

export const validateConfig = () => {
  const requiredVars = [
    "VITE_BASE_URL",
    "VITE_DARKHAST_MAVAD_LIST_GUID",
    "VITE_SUPPLIERS_LIST_GUID",
    "VITE_PERSONNEL_LIST_GUID",
  ];

  const missingVars = requiredVars.filter(
    (varName) => !import.meta.env[varName]
  );

  if (missingVars.length > 0) {
    console.warn("Missing environment variables:", missingVars);
    console.warn(
      "Using default values. Please set these variables in your .env file."
    );
  }

  return missingVars.length === 0;
};

validateConfig();

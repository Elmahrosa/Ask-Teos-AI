// *** Configurable variables for the app ***
// This file contains all the user-editable configuration values that can be updated when customizing the chatbot app.

export const APP_CONFIG = {
  // UPDATE: Set to the welcome message for the chatbot
  WELCOME_MESSAGE:
    "WELCOME TO TEOS WORLD!",

  // UPDATE: Set to the name of the chatbot app
  NAME: "ASK TEOS AI",

  // UPDATE: Set to the description of the chatbot app
  DESCRIPTION: "ASK-TEOS-AI is your gateway to Egypt's sovereign blockchain 👌",
} as const;

// Colors Configuration - UPDATE THESE VALUES BASED ON USER DESIGN PREFERENCES
export const COLORS = {
  // UPDATE: Set to the background color (hex format)
  BACKGROUND: "#FFFFFF",

  // UPDATE: Set to the primary color for buttons, links, etc. (hex format)
  PRIMARY: "#4B73FF",
} as const;

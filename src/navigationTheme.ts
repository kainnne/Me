export type NavigationTheme = {
  menu: "products" | "contact" | null;
  mood: "dream" | "dusk";
};

type NavigationAction =
  | { type: "toggle-menu"; menu: "products" | "contact" }
  | { type: "close-menu" }
  | { type: "toggle-mood" };

export function navigationThemeReducer(state: NavigationTheme, action: NavigationAction): NavigationTheme {
  if (action.type === "toggle-menu") {
    const menu = state.menu === action.menu ? null : action.menu;
    return { menu, mood: menu ? "dusk" : "dream" };
  }
  if (action.type === "close-menu") {
    return state.menu ? { menu: null, mood: "dream" } : state;
  }
  // An open menu always stays dark; the title toggles colors when menus are closed.
  return state.menu ? state : { ...state, mood: state.mood === "dream" ? "dusk" : "dream" };
}

export type RouteName =
  | "home"
  | "about"
  | "packages"
  | "journey"
  | "services"
  | "documents"
  | "chat"
  | "login"
  | "register";

export type Navigate = (route: RouteName) => void;

export type ScreenProps = {
  onNavigate: Navigate;
};

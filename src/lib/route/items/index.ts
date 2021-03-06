import CommonRoute from "./Common";
import ComponentRoute from "./Component";
import LayoutRoute from "./Layout";
import StyleRoute from "./Style";
import ThemeRoute from "./Theme";

export type RouteItem = {
  path: string;
  method: "get" | "post" | "put" | "delete" | "patch";
  next: Function;
  auth: boolean;
};

const item: RouteItem[] = [
  ...CommonRoute,
  ...ComponentRoute,
  ...LayoutRoute,
  ...StyleRoute,
  ...ThemeRoute,
];

export default item;

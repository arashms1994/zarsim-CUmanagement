import type { PropsWithChildren } from "react";
import QueryProvider from "./QueryProvider";

export default function AppProvider({ children }: PropsWithChildren) {
  return <QueryProvider>{children}</QueryProvider>;
}

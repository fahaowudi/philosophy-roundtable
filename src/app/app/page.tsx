import { Suspense } from "react";
import { Home } from "./AppContent";

export default function AppPage() {
  return (
    <Suspense>
      <Home />
    </Suspense>
  );
}

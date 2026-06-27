'use client';

// APP ROUTER UNMOUNTS THE OLD PAGE IMMEDIATELY ON NAVIGATION, WHICH WOULD MAKE ANIMATEPRESENCE ANIMATE THE *NEW* CONTENT DURING THE EXIT. FREEZING THE LAYOUTROUTERCONTEXT KEEPS THE EXITING SUBTREE RENDERING THE PREVIOUS PAGE UNTIL ITS EXIT ANIMATION FINISHES. THIS INTERNAL IMPORT IS THE ESTABLISHED WORKAROUND FOR EXIT TRANSITIONS IN THE APP ROUTER.
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useContext, useState, type ReactNode } from 'react';

export default function FrozenRouter({ children }: { children: ReactNode }) {
  const context = useContext(LayoutRouterContext);
  // CAPTURE THE CONTEXT FROM THE FIRST RENDER AND NEVER UPDATE IT, SO THE EXITING PAGE KEEPS RENDERING ITS OWN (NOW-STALE) ROUTE DURING THE EXIT. THIS IS THE ESTABLISHED WORKAROUND FOR EXIT TRANSITIONS IN THE APP ROUTER.
  const [frozen] = useState(context);

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {children}
    </LayoutRouterContext.Provider>
  );
}

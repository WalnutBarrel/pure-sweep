# PureSweep Modal & Overlay Guidelines

During development, we encountered significant UI clipping and layout bugs when building modals nested deep within the Next.js `layout.tsx` hierarchy. Specifically, `overflow: hidden` boundaries and flexbox alignment logic were causing modals to be cut off horizontally, or pushed off the top of the screen when their contents were too tall.

To prevent these issues from recurring in the future, all new modals, dialogs, and pop-outs in the PureSweep dashboard MUST follow this implementation pattern.

## 1. Always Use React Portals

Never render a fixed overlay directly inside a deeply nested component. Deeply nested layouts (like `<main>` with scrolling or clipping) can inadvertently create clipping masks or new containing blocks for fixed elements.

Always use `createPortal` to render the modal directly into `document.body`:

```tsx
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export function MyModal() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      
      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-50 ...">
          {/* Modal Content */}
        </div>
      , document.body)}
    </>
  );
}
```

## 2. Graceful Vertical Overflow (Flexbox)

Do not use `items-center` to vertically center a modal if there is *any* chance the modal could be taller than the viewport (e.g. forms). If a modal is taller than the viewport and `items-center` is applied, the top of the modal will overflow the top of the browser window and become inaccessible (it cannot be scrolled to).

Instead, use `items-start` on the wrapper, and apply `my-auto` and `shrink-0` to the modal card itself. This ensures it centers when there is enough space, but pins to the top and scrolls gracefully when space is constrained.

```tsx
{/* 
  Wrapper: 
  - items-start (pushes to top, allows my-auto to work)
  - overflow-y-auto (allows scrolling if modal is tall)
*/}
<div className="fixed inset-0 z-50 flex items-start justify-center bg-stone-900/40 p-4 sm:p-6 overflow-y-auto">
  
  {/* 
    Modal Card: 
    - my-auto (centers it vertically when space permits)
    - shrink-0 (prevents flexbox from squishing it when it exceeds viewport)
  */}
  <div className="relative bg-white w-full max-w-3xl flex flex-col my-auto shrink-0 shadow-2xl">
    
    {/* Sticky Header */}
    <div className="shrink-0 border-b p-5">
      <h3>Title</h3>
    </div>

    {/* Scrollable Body inside the card */}
    <div className="flex-1 overflow-y-auto p-6 min-h-0">
      {/* Content */}
    </div>
    
  </div>
</div>
```

## 3. The `min-h-0` Flex Constraint

If your modal has a `max-height` (e.g., `max-h-[90vh]`) and contains a flex column layout where the central content is supposed to be scrollable, you **must** apply `min-h-0` to the flex parents containing the scrollable area. 

Without `min-h-0`, CSS Flexbox prevents elements from shrinking below their intrinsic content size, causing the modal to completely ignore the `max-h-[90vh]` rule and overflow off the screen.

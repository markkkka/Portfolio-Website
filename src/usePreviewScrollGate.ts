import { useEffect, useRef, useState } from 'react';

export const isPreviewFullyVisible = (frame: HTMLElement | null) => {
  if (!frame) return false;
  const viewport = window.visualViewport;
  const visibleTop = Math.max(viewport?.offsetTop ?? 0, document.querySelector('nav')?.getBoundingClientRect().bottom ?? 0);
  const visibleBottom = (viewport?.offsetTop ?? 0) + (viewport?.height ?? window.innerHeight);
  const visibleLeft = viewport?.offsetLeft ?? 0;
  const visibleRight = visibleLeft + (viewport?.width ?? document.documentElement.clientWidth);
  const rect = frame.getBoundingClientRect();
  // One CSS pixel accounts for fractional layout rounding, not partially visible previews.
  return rect.height > 0 && rect.top >= visibleTop - 1 && rect.bottom <= visibleBottom + 1 &&
    rect.left >= visibleLeft - 1 && rect.right <= visibleRight + 1;
};

// Preview media stays mounted. Only input changes as the complete frame enters/leaves view.
export const usePreviewScrollGate = () => {
  const frameRef = useRef<HTMLDivElement>(null);
  const [canScrollPreview, setCanScrollPreview] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const header = document.querySelector<HTMLElement>('nav');
    const viewport = window.visualViewport;
    let animationFrame = 0;

    const updateVisibility = () => {
      animationFrame = 0;
      const viewportTop = viewport?.offsetTop ?? 0;
      const visibleTop = Math.max(viewportTop, header?.getBoundingClientRect().bottom ?? 0);
      const visibleBottom = viewportTop + (viewport?.height ?? window.innerHeight);
      // Leave enough page space to enter and leave a preview naturally, including on short phones.
      const availableHeight = `${Math.max(0, visibleBottom - visibleTop - 128)}px`;
      if (frame.style.getPropertyValue('--preview-available-height') !== availableHeight) {
        frame.style.setProperty('--preview-available-height', availableHeight);
      }

      const fullyVisible = isPreviewFullyVisible(frame);
      setCanScrollPreview(fullyVisible);
      if (!fullyVisible) {
        const focused = document.activeElement;
        if (focused instanceof HTMLElement && frame.contains(focused)) focused.blur();
      }
    };

    const scheduleUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateVisibility);
    };
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(frame);
    if (header) resizeObserver.observe(header);
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    viewport?.addEventListener('scroll', scheduleUpdate, { passive: true });
    viewport?.addEventListener('resize', scheduleUpdate);
    updateVisibility();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      viewport?.removeEventListener('scroll', scheduleUpdate);
      viewport?.removeEventListener('resize', scheduleUpdate);
    };
  }, []);

  return { frameRef, canScrollPreview };
};

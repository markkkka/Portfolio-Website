import { useCallback, useLayoutEffect, useRef } from 'react';
import { isPreviewFullyVisible, usePreviewScrollGate } from './usePreviewScrollGate';

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export const usePageScrollPreview = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const refreshRef = useRef<() => void>(() => undefined);
  const { frameRef, canScrollPreview } = usePreviewScrollGate();
  const onPreviewLoad = useCallback(() => refreshRef.current(), []);

  useLayoutEffect(() => {
    const scene = sceneRef.current;
    const pin = pinRef.current;
    const frame = frameRef.current;
    if (!scene || !pin || !frame) return;

    const header = document.querySelector<HTMLElement>('nav');
    const viewport = window.visualViewport;
    let pointerX: number | undefined;
    let animationFrame = 0;
    let lastPhase = 0;
    let progress = 0;
    let wasActive = false;

    const setStyle = (element: HTMLElement, name: string, value: string) => {
      if (element.style.getPropertyValue(name) !== value) element.style.setProperty(name, value);
    };

    const update = () => {
      animationFrame = 0;
      const visibleTop = Math.max(viewport?.offsetTop ?? 0, header?.getBoundingClientRect().bottom ?? 0);
      const visibleBottom = (viewport?.offsetTop ?? 0) + (viewport?.height ?? window.innerHeight);
      const pairedEmailRow = !!frame.closest('#email-campaigns') && window.matchMedia('(min-width: 1024px)').matches;
      const previewCount = pairedEmailRow ? 2 : 1;
      const travelPerPreview = Math.max(440, Math.min(900, (viewport?.height ?? window.innerHeight) * 0.8));
      // Reserve enough page travel for both cards, while moving only the chosen column.
      const travel = travelPerPreview * previewCount;
      const frameOffset = frame.getBoundingClientRect().top - pin.getBoundingClientRect().top;
      const previewTop = Math.max(visibleTop + 18, visibleBottom - frame.getBoundingClientRect().height - 18);
      const pinTop = previewTop - frameOffset;
      setStyle(pin, '--preview-pin-top', `${pinTop}px`);
      setStyle(scene, '--preview-scene-height', `${pin.getBoundingClientRect().height + travel}px`);

      const start = scene.getBoundingClientRect().top + window.scrollY - pinTop;
      const phase = clamp((window.scrollY - start) / travel);
      const frames = [...document.querySelectorAll<HTMLElement>('.preview-frame')];
      const visibleFrames = frames.filter(isPreviewFullyVisible);
      // Choose a column before checking visibility, so a clipped left card cannot start the right card.
      const pairedEmails = visibleFrames[0]?.closest('#email-campaigns') && window.matchMedia('(min-width: 1024px)').matches;
      const candidates = pairedEmails ? frames.filter(candidate => {
        const rect = candidate.getBoundingClientRect();
        return candidate.closest('#email-campaigns') && rect.bottom > visibleTop && rect.top < visibleBottom;
      }) : visibleFrames;
      const selected = pointerX === undefined ? candidates[0] : candidates.reduce<HTMLElement | undefined>((nearest, candidate) => {
        const rect = candidate.getBoundingClientRect();
        const distance = Math.abs((rect.left + rect.right) / 2 - pointerX!);
        if (!nearest) return candidate;
        const other = nearest.getBoundingClientRect();
        return distance < Math.abs((other.left + other.right) / 2 - pointerX!) ? candidate : nearest;
      }, undefined);
      const active = selected === frame && isPreviewFullyVisible(frame);

      if (phase === 0) progress = 0;
      else if (active || (wasActive && phase === 1 && lastPhase < 1)) {
        // Each preview keeps its position when the cursor moves to the other card.
        if (lastPhase === 1 && phase < 1 && active) progress = 1;
        progress = clamp(progress + (phase - lastPhase) * previewCount);
      }

      const iframe = frame.querySelector<HTMLIFrameElement>('iframe');
      const scrollTarget = iframe ? iframe.contentDocument?.scrollingElement :
        frame.querySelector<HTMLElement>('.landing-preview-canvas');
      if (scrollTarget) {
        const maxScroll = Math.max(0, scrollTarget.scrollHeight - scrollTarget.clientHeight);
        if (active || phase === 0 || (wasActive && phase === 1)) scrollTarget.scrollTop = progress * maxScroll;
        frame.dataset.pageScrollPosition = String(Math.round(scrollTarget.scrollTop));
        frame.dataset.pageScrollMaximum = String(maxScroll);
      }
      frame.dataset.pageScrollProgress = progress.toFixed(4);
      frame.dataset.pageScrollPhase = phase.toFixed(4);
      frame.dataset.pageScrollActive = String(active);
      lastPhase = phase;
      wasActive = active;
    };

    const scheduleUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(update);
    };
    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      scheduleUpdate();
    };
    refreshRef.current = scheduleUpdate;
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(pin);
    resizeObserver.observe(frame);
    if (header) resizeObserver.observe(header);
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerMove, { passive: true });
    viewport?.addEventListener('resize', scheduleUpdate);
    viewport?.addEventListener('scroll', scheduleUpdate, { passive: true });
    update();

    return () => {
      refreshRef.current = () => undefined;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerMove);
      viewport?.removeEventListener('resize', scheduleUpdate);
      viewport?.removeEventListener('scroll', scheduleUpdate);
    };
  }, [frameRef]);

  return { sceneRef, pinRef, frameRef, canScrollPreview, onPreviewLoad };
};

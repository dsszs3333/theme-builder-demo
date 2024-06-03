"use client";

import dynamic from "next/dynamic";
import { MutableRefObject, useMemo, useRef, useState } from "react";

const HuePicker = dynamic(() => import("simple-hue-picker/react"), {
  ssr: false,
});

export const FormContent = ({ hue }: { hue: string }) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const onChangeDebounced = useMemo(() => makeOnChange(rootRef), []);

  return (
    <div className="flex items-center" ref={rootRef}>
      <div className="sm:col-span-3">
        <div className="h-2">
          <HuePicker name="hue" onChange={onChangeDebounced} value={hue} />
        </div>
      </div>
    </div>
  );
};

function debounce<F extends (...args: any[]) => any>(
  func: F,
  delay: number
): F {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return ((...args: Parameters<F>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  }) as F;
}

function makeOnChange(rootRef: MutableRefObject<HTMLDivElement | null>) {
  return debounce(() => {
    if (!rootRef.current) return;

    let current: HTMLElement | null | undefined = rootRef.current;
    while (current?.tagName !== "FORM") {
      current = current?.parentElement;
    }
    if (current?.tagName === "FORM") {
      (current as HTMLFormElement).requestSubmit();
    }
  }, 300);
}

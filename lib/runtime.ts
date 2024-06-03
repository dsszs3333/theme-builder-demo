import {
  // @ts-expect-error Old typings for this module
  toGamut as _toGamut,
  Color,
  Hsl,
  converter,
  differenceEuclidean,
} from "culori";

import { makeVariable, shades } from "./common";

const toGamut = _toGamut as (...args: unknown[]) => (color: string) => Color;

/**
 * A map of CSS variable name to color
 */
type SingleVariable = [string, string];

export function getVariables({
  baseName,
  hue,
  mode = "consistent",
}: {
  baseName: string;
  hue: number;
  mode?: "bright" | "consistent";
}): SingleVariable[] {
  const calculator = mode === "bright" ? highestChroma : consistentChroma;
  return shades.map((shade, shadeIndex) => [
    makeVariable({ name: baseName, shade }),
    calculator(shadeIndex, hue),
  ]);
}

export function updateVariables(variables: SingleVariable[], el?: HTMLElement) {
  const target = el ?? document.documentElement;

  for (const [varName, value] of variables) {
    target.style.setProperty(varName, value + "");
  }
}

// const lightnessForShade = (shade: number) => {
//   const highestL = 89;
//   const lowestL = 13;
//   const diffL = highestL - lowestL;

//   const shadeDiff = shades[shades.length - 1] - shades[0];

//   // Maintaining the proximity of colors with a step of 50 and 100
//   const multiplier = shade / shadeDiff;

//   return (lowestL + (highestL - diffL * multiplier)) / 100;
// };
// const lightness = shades.map(lightnessForShade);

const lightness: Record<number, number> = {
  0: 1,
  1: 10,
  2: 20,
  3: 30,
  4: 40,
  5: 50,
  6: 60,
  7: 70,
  8: 80,
  9: 90,
  10: 99,
};

export const highestChroma = (shadeIndex: number, hue: number) => {
  const hsl = converter("hsl");

  // Setting a high saturation
  const color = `hsl(${hue}, 100%, ${lightness[shadeIndex] * 100}%)`;

  // Clamping it to the highest saturation possible
  return serializeColor(
    hsl(toGamut("p3", "hsl", differenceEuclidean("hsl"), 0)(color))
  );
};

export const consistentChroma = (i: number, hue: number) => {
  const hsl = converter("hsl");

  // Using a consistent saturation
  const color = `${hue} 90% ${lightness[i]}%`;

  //   return serializeColor(
  //     hsl(toGamut("p3", "hsl", differenceEuclidean("hsl"), 0)(color))
  //   );
  return color;
};

const serializeColor = (c: Hsl): string =>
  `${c.h?.toFixed(3)}, ${c.s.toFixed(3)}%, ${c.l.toFixed(3)}%`;

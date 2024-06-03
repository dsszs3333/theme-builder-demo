import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { FormContent } from "./Form";
import { getVariables } from "../../../lib/runtime";

const hueCookie = "theme-hue";

const getHue = () => cookies().get(hueCookie)?.value ?? "40";

export const getThemeDataFromCookies = () => {
  return {
    hue: getHue(),
  };
};

export function getThemeData(hue: string) {
  const accent = getVariables({
    baseName: "accent",
    hue: +hue,
  });

  return {
    style: Object.fromEntries(accent),
  };
}

export async function ThemePicker() {
  async function updateTheme(form: FormData) {
    "use server";

    cookies().set(hueCookie, form.get("hue") as string, {
      maxAge: 1704085200,
    });

    revalidatePath("/api/my-theme");
  }

  return (
    <form action={updateTheme} className="md:col-span-2">
      <FormContent hue={getHue()} />
    </form>
  );
}

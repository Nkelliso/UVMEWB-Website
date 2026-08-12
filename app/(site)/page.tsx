import { redirect } from "next/navigation";

// The immersive (Cal-Poly-style) edition is the live public site. The root path
// lands there; the other design editions stay reachable by URL / the switcher so
// their components can be salvaged. To restore the original default-edition home,
// delete this file's redirect and restore the ParallaxHero + PageRenderer version
// from git history.
export default function HomePage() {
  redirect("/immersive");
}

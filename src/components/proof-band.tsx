import { StatBand } from "@/components/motion/stat-band";
import { totalServices } from "@/lib/services";
import { totalProjects } from "@/lib/work";
import { shell } from "@/lib/layout";

const stats = [
  { value: "5", label: "Founders, one team" },
  { value: `${totalServices}`, label: "Services, end to end" },
  { value: `${totalProjects}`, label: "Projects shipped" },
  { value: "Global", label: "Local & international reach" },
];

/**
 * The proof strip directly under the hero — four figures on rising rules, no
 * boxes. It carries the same numbers the site has always shown; only the
 * treatment changed.
 */
export function ProofBand() {
  return (
    <section className="relative py-14 sm:py-16">
      <div className={shell}>
        <StatBand stats={stats} />
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PHILOSOPHERS } from "@/lib/ai/philosophers";

const philosopherColors: Record<string, string> = {
  "bg-blue-500": "#3b82f6",
  "bg-purple-500": "#a855f7",
  "bg-amber-500": "#f59e0b",
  "bg-red-500": "#ef4444",
  "bg-teal-500": "#14b8a6",
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export function PhilosophersShowcase() {
  return (
    <section className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-14 text-center font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          认识这些思想家
        </h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-5 md:overflow-visible md:pb-0"
        >
          {PHILOSOPHERS.map((p) => {
            const color = philosopherColors[p.color] ?? "#2D5A3A";
            return (
              <motion.div
                key={p.id}
                variants={item}
                className="group min-w-[260px] overflow-hidden rounded-[1.75rem] border border-border/40 bg-white/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/70 hover:shadow-lg md:min-w-0"
                style={{ ["--ph-color" as string]: color }}
              >
                <div className="relative aspect-[1/2] w-full overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-serif text-xl font-semibold text-foreground">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">{p.era}</p>
                  <div
                    className="mx-auto mt-3 h-1 w-8 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <p className="mt-3 text-sm italic leading-6 text-muted-foreground">
                    &ldquo;{p.quotes[0]}&rdquo;
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

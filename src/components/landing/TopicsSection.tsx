"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const SAMPLE_TOPICS = [
  "机器能有真正的意识吗？",
  "什么是真正的自由？",
  "我们该如何面对死亡？",
  "正义是客观存在的吗？",
  "科技进步会让人更幸福吗？",
  "幸福和意义有什么区别？",
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export function TopicsSection() {
  const router = useRouter();

  return (
    <section className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-14 text-center font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          试试这些问题
        </h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {SAMPLE_TOPICS.map((topic) => (
            <motion.button
              key={topic}
              variants={item}
              type="button"
              onClick={() =>
                router.push(`/app?topic=${encodeURIComponent(topic)}`)
              }
              className="group rounded-[1.5rem] border border-border/40 bg-white/40 p-6 text-left backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/60 hover:shadow-md hover:border-primary/30"
            >
              <span className="font-serif text-base leading-8 text-foreground sm:text-lg">
                {topic}
              </span>
              <span className="mt-2 block text-primary opacity-0 transition-opacity group-hover:opacity-100">
                →
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

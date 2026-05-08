"use client";

import { motion } from "framer-motion";
import { MessageCircle, Users, Sparkles } from "lucide-react";

const STEPS = [
  {
    icon: MessageCircle,
    title: "选择话题",
    desc: "提出一个你真正好奇的问题——越具体越好。",
  },
  {
    icon: Users,
    title: "邀请哲学家",
    desc: "从五位思想家中选择 1–5 位，组成你的圆桌阵容。",
  },
  {
    icon: Sparkles,
    title: "观看讨论",
    desc: "哲学家们轮流发言、回应彼此，让观点在碰撞中推进。",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function HowItWorks() {
  return (
    <section className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-14 text-center font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          三步开启哲学对话
        </h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-8 md:grid-cols-3"
        >
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              variants={item}
              className="relative rounded-[1.5rem] border border-border/40 bg-white/40 p-8 text-center backdrop-blur-sm"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {step.desc}
              </p>

              {i < STEPS.length - 1 && (
                <div className="absolute right-0 top-14 hidden h-px w-8 -translate-x-1/2 border-t-2 border-dashed border-primary/20 md:block" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

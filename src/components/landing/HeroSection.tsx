"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden px-4 py-28 sm:py-36">
      <div className="pointer-events-none absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-secondary/15 blur-[100px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-primary/8 blur-[80px]" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-4xl text-center"
      >
        <motion.p
          variants={fadeUp}
          className="mb-6 text-xs font-semibold uppercase tracking-[0.34em] text-primary/60"
        >
          PHILOSOPHY ROUNDTABLE
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="font-serif text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
        >
          让思想家们为你讨论
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl"
        >
          邀请苏格拉底、康德、孔子、尼采和老子围绕你的问题展开深度对话，
          让观点在碰撞中澄清，让思考在追问中深入。
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10">
          <Button
            onClick={() => router.push("/app")}
            size="lg"
            className="rounded-full px-10 text-base"
          >
            开始探索
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}

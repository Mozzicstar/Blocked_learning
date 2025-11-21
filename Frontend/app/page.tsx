import PageHeader from "@/components/PageHeader";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <PageHeader
        title="Welcome to BlockedLearning"
        subtitle="Learn with verifiable on-chain proof on Camp Network."
      />

      <p className="text-gray-700">Connect your wallet to start learning.</p>
    </motion.div>
  );
}

// "use client";
// import PageHeader from "@/components/PageHeader";
// import { motion } from "framer-motion";

import { redirect } from "next/navigation";

// export default function Home() {
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="space-y-6"
//     >
//       <PageHeader
//         title="Welcome to BlockedLearning"
//         subtitle="Learn with verifiable on-chain proof on Camp Network."
//       />

//       <p className="text-muted-foreground">Connect your wallet to start learning.</p>
//     </motion.div>
//   );
// }


const Home = () => redirect('/dashboard');
export default Home;
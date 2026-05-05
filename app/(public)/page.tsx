import Link from "next/link";

import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">Next.js Template</h1>
      <p className="text-muted-foreground max-w-md text-base">
        A clean Next.js 16 starter with shadcn/ui, Tailwind v4, Zustand, RHF + Zod, and a
        fetch-based API client.
      </p>
      <Button asChild>
        <Link href="/example">View example feature</Link>
      </Button>
    </div>
  );
};

export default Home;

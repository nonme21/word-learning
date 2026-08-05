import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, Trophy, Flame, Library } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 text-center space-y-8 mt-12">
        <div className="w-32 h-32 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mb-4">
          <Library className="w-20 h-20" />
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-foreground">
          Master any language with <span className="text-primary">LingoAnki</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          A beautiful, minimalist spaced repetition system to help you remember words forever.
        </p>
        <Button size="lg" className="rounded-2xl text-lg px-8 h-14 font-bold shadow-[0_4px_0_rgb(70,163,2)] hover:translate-y-1 hover:shadow-[0_0px_0_rgb(70,163,2)] transition-all" asChild>
          <Link href="/login">Start Learning Now</Link>
        </Button>
      </div>
    );
  }

  const userId = session.user.id;

  const totalWords = await prisma.word.count({
    where: { userId },
  });

  const now = new Date();
  const wordsToReview = await prisma.word.count({
    where: {
      userId,
      nextReview: {
        lte: now,
      },
    },
  });

  const learnedWords = await prisma.word.count({
    where: {
      userId,
      interval: {
        gt: 0,
      },
    },
  });

  const goal = 10;
  const reviewedToday = 0;
  const progressPercent = Math.min((reviewedToday / goal) * 100, 100);

  return (
    <div className="flex flex-col space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {session.user.name}!</h1>
        <p className="text-muted-foreground mt-1">Ready to learn some new words today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase text-muted-foreground">Words to Review</CardTitle>
            <Brain className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black">{wordsToReview}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Waiting for you right now
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase text-muted-foreground">Total Words</CardTitle>
            <Library className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black">{totalWords}</div>
            <p className="text-sm text-muted-foreground mt-1">
              In your dictionary
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase text-muted-foreground">Words Learned</CardTitle>
            <Trophy className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black">{learnedWords}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Moved past initial learning
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-border/50 shadow-sm bg-muted/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-orange-500" />
            Daily Goal
          </CardTitle>
          <CardDescription>Review {goal} words today</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progressPercent} className="h-4 bg-secondary" />
          <p className="text-sm font-medium text-muted-foreground">
            {reviewedToday} / {goal} words
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button 
          size="lg" 
          className="flex-1 rounded-2xl text-lg h-16 font-bold shadow-[0_4px_0_rgb(70,163,2)] hover:translate-y-1 hover:shadow-[0_0px_0_rgb(70,163,2)] transition-all" 
          asChild
        >
          <Link href="/learn">Start Review Session</Link>
        </Button>
        <Button 
          size="lg" 
          variant="outline" 
          className="flex-1 rounded-2xl text-lg h-16 font-bold border-2 shadow-[0_4px_0_var(--color-border)] hover:translate-y-1 hover:shadow-[0_0px_0_var(--color-border)] transition-all" 
          asChild
        >
          <Link href="/dictionary">Manage Dictionary</Link>
        </Button>
      </div>
    </div>
  );
}

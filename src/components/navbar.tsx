"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Library, PlayCircle, BookOpen } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { data: session } = authClient.useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center mx-auto px-4 sm:px-8 max-w-6xl">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-2xl tracking-tighter text-primary flex items-center gap-2">
              <Library className="w-8 h-8" />
              Frostudy
            </span>
          </Link>
          {session && (
            <nav className="flex items-center space-x-4 md:space-x-6 text-sm font-medium">
              <Link href="/learn" className="transition-colors hover:text-foreground/80 text-foreground flex items-center gap-2">
                <PlayCircle className="w-5 h-5" />
                <span className="hidden sm:inline">Обучение</span>
              </Link>
              <Link href="/dictionary" className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span className="hidden sm:inline">Словарь</span>
              </Link>
            </nav>
          )}
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2 md:space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Переключить тему</span>
          </Button>

          {session ? (
            <Button variant="outline" className="rounded-full font-bold" onClick={handleLogout}>
              Выйти
            </Button>
          ) : (
            <Button className="rounded-full font-bold shadow-md" nativeButton={false} render={<Link href="/login">Начать</Link>} />
          )}
        </div>
      </div>
    </header>
  );
}

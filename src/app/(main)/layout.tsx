import { ThemeProvider } from "next-themes";
import { Navbar } from "./navbar";
import { Toaster } from "sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Navbar />
      <main className="p-4">{children}</main>
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}

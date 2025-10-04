import { ThemeProvider } from "@/components/ui/theme-provider";

export default function Home() {
  return (
    <ThemeProvider>
      <div>
        <h1>Hello World</h1>
      </div>
    </ThemeProvider>
  );
}

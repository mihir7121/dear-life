import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <SignUp
      appearance={{
        elements: {
          rootBox: "w-full max-w-md",
          card: "bg-card border border-border shadow-depth rounded-2xl",
          headerTitle: "font-display text-2xl font-bold",
          headerSubtitle: "text-muted-foreground",
          socialButtonsBlockButton:
            "border border-border bg-background hover:bg-secondary transition-colors rounded-xl",
          dividerLine: "bg-border",
          dividerText: "text-muted-foreground text-xs",
          formFieldInput:
            "bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50",
          formFieldLabel: "text-sm font-medium text-foreground",
          formButtonPrimary:
            "bg-primary text-primary-foreground hover:opacity-90 rounded-xl font-medium",
          footerActionText: "text-muted-foreground text-sm",
          footerActionLink: "text-primary hover:text-primary/80 font-medium",
        },
      }}
    />
  );
}

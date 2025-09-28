import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const buttonVariants = {
  base: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background smooth-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
      hero: "hero-gradient text-cream hover:scale-105 warm-shadow font-semibold",
      coffee: "bg-coffee-dark text-cream hover:bg-coffee-medium warm-shadow",
      cream: "bg-cream text-coffee-dark hover:bg-milk-foam border border-coffee-light/20",
      caramel: "bg-caramel text-coffee-dark hover:bg-caramel/80 warm-shadow",
      "coffee-outline": "border-2 border-coffee-medium text-coffee-medium bg-transparent hover:bg-coffee-medium hover:text-cream",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      xl: "h-14 rounded-lg px-10 text-base",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "default" as const,
    size: "default" as const,
  },
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variants.variant;
  size?: keyof typeof buttonVariants.variants.size;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const variantClass = buttonVariants.variants.variant[variant];
    const sizeClass = buttonVariants.variants.size[size];
    
    return (
      <Comp 
        className={cn(buttonVariants.base, variantClass, sizeClass, className)} 
        ref={ref} 
        {...props} 
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

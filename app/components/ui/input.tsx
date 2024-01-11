import { VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "~/utils";

const inputVariants = cva(
  "flex w-full placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300 focus-visible:outline-none",
  {
    variants: {
      variant: {
        default:
          "rounded-md border border-neutral-200 bg-white ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950",
        minimal: "",
      },
      size: {
        default: "h-10 px-3 py-2 text-sm",
        lg: "h-8 text-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

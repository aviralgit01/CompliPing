"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  );
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
}

function DropdownMenuContent({
  className,
  sideOffset = 8, // Reduced sideOffset for a tighter feel
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          // Base styles with premium design
          "bg-white/95 backdrop-blur-xl text-neutral-900 border border-neutral-200/80 shadow-premium-elevated", // Slightly less intense shadow
          // Size and positioning
          "z-50 min-w-[12rem] max-w-[20rem] max-h-[calc(var(--radix-dropdown-menu-content-available-height)-20px)]", // Slightly smaller min/max width
          "origin-[var(--radix-dropdown-menu-content-transform-origin)]",
          // Shape and spacing
          "rounded-xl p-2 overflow-hidden", // Reduced padding and more subtle rounded corners
          // Enhanced animations with spring-like feel - adjusted for subtlety
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-98 data-[state=open]:zoom-in-100", // Subtler zoom
          "data-[state=open]:duration-150 data-[state=closed]:duration-100", // Faster animations
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2", // Subtler slide
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", // Subtler slide
          // Premium ring effect - slightly less prominent
          "ring-1 ring-black/3",
          // Dark mode
          "dark:bg-neutral-900/95 dark:text-neutral-100 dark:border-neutral-700/80 dark:ring-white/5",
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group
      data-slot="dropdown-menu-group"
      className={cn("space-y-0.5", className)} // Reduced space between items
      {...props}
    />
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive" | "success" | "warning" | "info";
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        // Base styles - IMPORTANT: Let external className override colors
        "relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium", // Reduced padding, gap, and rounded corners
        "outline-none select-none transition-all duration-150 ease-out", // Faster transition
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "transform active:scale-[0.99]", // Subtler active scale
        // Icon styles
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
        // Only apply default styles if no external className color is provided
        variant === "default" &&
          !className?.includes("text-") &&
          "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 focus:bg-neutral-100", // Lighter hover background
        variant === "destructive" &&
          !className?.includes("text-") &&
          "text-red-700 hover:bg-red-50 hover:text-red-800 focus:bg-red-50 [&_svg]:!text-red-600",
        variant === "success" &&
          !className?.includes("text-") &&
          "text-green-700 hover:bg-green-50 hover:text-green-800 focus:bg-green-50 [&_svg]:!text-green-600",
        variant === "warning" &&
          !className?.includes("text-") &&
          "text-amber-700 hover:bg-amber-50 hover:text-amber-800 focus:bg-amber-50 [&_svg]:!text-amber-600",
        variant === "info" &&
          !className?.includes("text-") &&
          "text-blue-700 hover:bg-blue-50 hover:text-blue-800 focus:bg-blue-50 [&_svg]:!text-blue-600",
        // Inset
        inset && "pl-8", // Adjusted inset padding
        // Dark mode
        "dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100",
        // Micro-interaction effects - removed hover:shadow-sm for minimalism
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "relative flex cursor-pointer items-center gap-2 rounded-lg py-2 pr-3 pl-8 text-sm font-medium", // Reduced padding and rounded corners
        "outline-none select-none transition-all duration-150", // Faster transition
        "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900", // Lighter hover background
        "focus:bg-neutral-100 focus:text-neutral-900", // Lighter focus background
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
        "dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100",
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className="absolute left-2.5 flex size-4 items-center justify-center">
        {" "}
        {/* Adjusted left position */}
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-3.5 text-brand-primary font-bold" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "relative flex cursor-pointer items-center gap-2 rounded-lg py-2 pr-3 pl-8 text-sm font-medium", // Reduced padding and rounded corners
        "outline-none select-none transition-all duration-150", // Faster transition
        "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900", // Lighter hover background
        "focus:bg-neutral-100 focus:text-neutral-900", // Lighter focus background
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
        "dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2.5 flex size-4 items-center justify-center">
        {" "}
        {/* Adjusted left position */}
        <DropdownMenuPrimitive.ItemIndicator>
          <div className="size-2 rounded-full bg-brand-primary" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-3 py-2 text-xs font-bold text-neutral-500 uppercase tracking-wider border-b border-neutral-100 mb-1", // Reduced padding
        inset && "pl-8", // Adjusted inset padding
        "dark:text-neutral-400 dark:border-neutral-800",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn(
        "bg-gradient-to-r from-transparent via-neutral-200 to-transparent -mx-1 my-2 h-px", // Reduced vertical margin
        "dark:via-neutral-700",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ml-auto text-xs tracking-wider text-neutral-400 font-medium",
        "dark:text-neutral-500",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium", // Reduced padding and rounded corners
        "outline-none select-none transition-all duration-150", // Faster transition
        "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900", // Lighter hover background
        "focus:bg-neutral-100 focus:text-neutral-900", // Lighter focus background
        "data-[state=open]:bg-neutral-100 data-[state=open]:text-neutral-900", // Lighter open state background
        "data-[inset]:pl-8", // Adjusted inset padding
        "dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100",
        "dark:data-[state=open]:bg-neutral-800 dark:data-[state=open]:text-neutral-100",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4 text-neutral-400" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        // Base styles with premium design
        "bg-white/95 backdrop-blur-xl text-neutral-900 border border-neutral-200/60 shadow-md", // Slightly less intense shadow
        // Size and positioning
        "z-50 min-w-[10rem] max-w-[18rem]",
        "origin-[var(--radix-dropdown-menu-content-transform-origin)]",
        // Shape and spacing
        "rounded-lg p-1.5 overflow-hidden", // Reduced padding and more subtle rounded corners
        // Animations
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-98 data-[state=open]:zoom-in-100", // Subtler zoom
        "data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1", // Subtler slide
        "data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1", // Subtler slide
        // Dark mode
        "dark:bg-neutral-900/95 dark:text-neutral-100 dark:border-neutral-800/60",
        className,
      )}
      {...props}
    />
  );
}

// Enhanced compound components for better UX
function DropdownMenuHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-3 py-2 border-b border-neutral-100 mb-1.5", // Reduced padding and margin
        "dark:border-neutral-800",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function DropdownMenuFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-3 py-1.5 border-t border-neutral-100 mt-1.5 bg-neutral-50/30", // Reduced padding and margin, lighter background
        "dark:border-neutral-800 dark:bg-neutral-800/30",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function DropdownMenuDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-xs text-neutral-500 leading-relaxed",
        "dark:text-neutral-400",
        className,
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuHeader,
  DropdownMenuFooter,
  DropdownMenuDescription,
};

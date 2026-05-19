"use client";
import React, { useState, useRef, useMemo, useEffect, useId } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { CircleFlag } from "react-circle-flags";
import { ChevronDown, Check, Search } from "lucide-react";
import countriesData from "@/country-code-list.json";
import { cn } from "@/lib/utils";

interface Country {
  alpha2: string;
  name: string;
  countryCallingCodes: string[];
  minLength: number;
  maxLength: number;
}

interface RawCountry {
  flagCode: string;
  country: string;
  countryCode: number;
  minLength: number;
  maxLength: number;
}

const rawCountries = countriesData as RawCountry[];

const countries: Country[] = rawCountries.map((item) => ({
  alpha2: item.flagCode,
  name: item.country,
  countryCallingCodes: [item.countryCode.toString()],
  minLength: item.minLength,
  maxLength: item.maxLength,
}));

interface ClassNames {
  popover?: string;
  triggerButton?: string;
  triggerContent?: string;
  triggerFlag?: string;
  triggerLabel?: string;
  triggerPlaceholder?: string;
  triggerArrow?: string;
  popoverContent?: string;
  commandWrapper?: string;
  searchInput?: string;
  list?: string;
  emptyMessage?: string;
  listItem?: string;
  listItemFlag?: string;
  listItemLabel?: string;
  labelClassName?: string;
  containerClassname?: string;
  checkIcon?: string;
}

interface Props {
  classNames?: ClassNames;
  label?: string;
  defaultCountry?: string;
  selected?: Country | null;
  onChange?: (country: Country) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

const CountryCodeSelector: React.FC<Props> = ({
  classNames = {},
  label,
  defaultCountry,
  selected,
  onChange,
  disabled = false,
  required = false,
  error = "",
}) => {
  const initialCountry = defaultCountry
    ? (countries.find((c) => c.alpha2 === defaultCountry) ?? null)
    : null;

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(
    selected?.name ? selected : initialCountry,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // const filteredCountries = useMemo(() => {
  //   const lowerSearch = searchTerm.toLowerCase();
  //   return countries.filter(
  //     country =>
  //       country.name.toLowerCase().includes(lowerSearch) ||
  //       country.countryCallingCodes[0].includes(searchTerm)
  //   );
  // }, [searchTerm]);

  const INDIA_ALPHA2 = "IN";

  const orderedCountries: Country[] = [
    ...countries.filter((c) => c.alpha2 === INDIA_ALPHA2),
    ...countries
      .filter((c) => c.alpha2 !== INDIA_ALPHA2)
      .sort((a, b) => a.name.localeCompare(b.name)),
  ];

  const filteredCountries = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();

    return orderedCountries.filter(
      (country) =>
        country.name.toLowerCase().includes(lowerSearch) ||
        country.countryCallingCodes[0].includes(searchTerm),
    );
  }, [searchTerm]);

  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
    setSearchTerm("");
    setOpen(false);
    onChange?.(country);
    triggerRef.current?.focus();
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (disabled) return;
    setOpen(newOpen);
    if (!newOpen) {
      setSearchTerm("");
    }
  };

  useEffect(() => {
    if (selected?.name) {
      setSelectedCountry(selected);
    }
  }, [selected]);

  // const inputId = `country-selector-${Math.random().toString(36).slice(2, 8)}`;
  const inputId = useId();
  const hasError = Boolean(error);

  return (
    <div className={cn("w-full space-y-1", classNames.containerClassname)}>
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            "block text-sm font-medium transition-colors duration-200",
            hasError ? "text-red-700" : "text-neutral-700",
            classNames.labelClassName,
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <button
            ref={triggerRef}
            id={inputId}
            disabled={disabled}
            className={cn(
              // Base styles
              "h-8! relative flex w-full items-center justify-between rounded-lg border bg-white px-1 py-2 text-sm font-medium transition-all duration-200 text-left",
              // Focus and hover states
              "hover:bg-neutral-50/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary",
              // Error states
              hasError && "border-red-400 ring-2 ring-red-100",
              // Default states
              !hasError &&
                !open &&
                "border-neutral-300 hover:border-neutral-400",
              // Open state
              !hasError &&
                open &&
                "border-brand-primary ring-2 ring-brand-primary/20",
              // Disabled state
              disabled &&
                "bg-neutral-50 border-neutral-200 cursor-not-allowed opacity-60",
              // Custom classes
              classNames.triggerButton,
            )}
            aria-label={label || "Select a country"}
            aria-expanded={open}
            aria-haspopup="listbox"
            type="button"
          >
            {selectedCountry ? (
              <div
                className={cn(
                  "flex items-center gap-2 text-neutral-900",
                  classNames.triggerContent,
                )}
              >
                {/* <CircleFlag
                  countryCode={selectedCountry.alpha2.toLowerCase()}
                  className={cn('w-5 h-5 rounded-sm shadow-sm', classNames.triggerFlag)}
                /> */}
                <span className={cn("font-medium", classNames.triggerLabel)}>
                  +{selectedCountry.countryCallingCodes[0]}
                </span>
              </div>
            ) : (
              <span
                className={cn(
                  "text-neutral-500",
                  classNames.triggerPlaceholder,
                )}
              >
                Select country
              </span>
            )}
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 transition-transform duration-200",
                open && "rotate-180",
                hasError ? "text-red-400" : "text-neutral-400",
                classNames.triggerArrow,
              )}
            />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={2}
          className={cn(
            "w-64 p-0 shadow-md border border-neutral-200 bg-white",
            classNames.popoverContent,
          )}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command className={cn("rounded-lg", classNames.commandWrapper)}>
            {/* Compact Search Header */}
            <div className="flex items-center border-b border-neutral-100 px-2 py-1 w-full">
              {/* <Search className='h-3 w-3 shrink-0 text-neutral-400 mr-2' /> */}
              <CommandInput
                placeholder="Search..."
                value={searchTerm}
                onValueChange={setSearchTerm}
                className={cn(
                  "flex h-7 !w-full rounded-md bg-transparent text-xs outline-none placeholder:text-neutral-400 border-0 focus:ring-0",
                  classNames.searchInput,
                )}
                autoFocus
              />
            </div>

            <CommandList
              className={cn("max-h-48 overflow-y-auto p-1", classNames.list)}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {filteredCountries.length === 0 ? (
                <CommandEmpty
                  className={cn(
                    "py-4 text-center text-xs text-neutral-500",
                    classNames.emptyMessage,
                  )}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Search className="h-4 w-4 text-neutral-300" />
                    <p className="font-medium text-xs">No countries found</p>
                  </div>
                </CommandEmpty>
              ) : (
                filteredCountries.map((country) => {
                  const isSelected = selectedCountry?.alpha2 === country.alpha2;
                  return (
                    <CommandItem
                      key={`${country.alpha2}-${country.name}`}
                      value={`${country.name} +${country.countryCallingCodes[0]}`}
                      onSelect={() => handleSelectCountry(country)}
                      className={cn(
                        "flex items-center justify-between px-2 py-1.5 text-xs cursor-pointer rounded transition-colors duration-150",
                        "hover:bg-neutral-50 focus:bg-neutral-50 aria-selected:bg-neutral-50",
                        isSelected && "bg-brand-primary/10 text-brand-primary",
                        classNames.listItem,
                      )}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <CircleFlag
                          countryCode={country.alpha2.toLowerCase()}
                          className={cn(
                            "w-4 h-4 rounded-sm flex-shrink-0",
                            classNames.listItemFlag,
                          )}
                        />
                        <span
                          className={cn(
                            "font-medium text-neutral-900 truncate text-xs",
                            isSelected && "text-brand-primary",
                            classNames.listItemLabel,
                          )}
                        >
                          {country.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span
                          className={cn(
                            "text-xs text-neutral-500 font-mono",
                            isSelected && "text-brand-primary/70",
                          )}
                        >
                          +{country.countryCallingCodes[0]}
                        </span>
                        {isSelected && (
                          <Check
                            className={cn(
                              "h-3 w-3 text-brand-primary flex-shrink-0",
                              classNames.checkIcon,
                            )}
                          />
                        )}
                      </div>
                    </CommandItem>
                  );
                })
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Error Message */}
      {hasError && (
        <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default CountryCodeSelector;

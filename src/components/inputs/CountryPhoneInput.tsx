import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { COUNTRIES, Country, getCountryByIso2, getCountryByDialCode } from "@/data/countries";
import { ChevronDown } from "lucide-react";
import * as Flags from 'country-flag-icons/react/3x2';

export type CountryPhoneInputProps = {
  value: string; // E.164 like "+919812345678" or empty
  onChange: (value: string) => void;
  defaultCountry?: string; // iso2 e.g. "in"
  preferredCountries?: string[]; // iso2 array
  id?: string;
  name?: string;
  placeholder?: string;
  className?: string;
};

function normalizeE164(raw: string): string {
  // Keep plus and digits only; remove spaces, hyphens, parentheses
  const cleaned = raw.replace(/[^+\d]/g, "");
  if (!cleaned) return "";
  return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
}

function stripDial(value: string, dial: string): string {
  const v = value.replace(/^\+/, "");
  if (v.startsWith(dial)) return v.slice(dial.length);
  return v;
}

export const CountryPhoneInput: React.FC<CountryPhoneInputProps> = ({
  value,
  onChange,
  defaultCountry = "in",
  preferredCountries = ["in", "us", "gb", "ae", "sa"],
  id,
  name,
  placeholder = "E.g. +919812345678",
  className,
}) => {
  const initialCountry: Country = useMemo(() => {
    const fromValue = getCountryByDialCode(value.replace(/^\+/, ""));
    return fromValue || getCountryByIso2(defaultCountry) || COUNTRIES.find(c => c.iso2 === "in")!;
  }, [value, defaultCountry]);

  const [selected, setSelected] = useState<Country>(initialCountry);
  const [open, setOpen] = useState(false);

  const composedValue = useMemo(() => normalizeE164(value), [value]);
  const national = useMemo(() => stripDial(composedValue, selected.dialCode), [composedValue, selected.dialCode]);

  const handleCountrySelect = (country: Country) => {
    setSelected(country);
    const rest = stripDial(composedValue, country.dialCode);
    const next = rest ? `+${country.dialCode}${rest}` : `+${country.dialCode}`;
    onChange(next);
    setOpen(false);
  };

  const handleNumberChange = (nv: string) => {
    const digits = nv.replace(/\D/g, "");
    const next = digits ? `+${selected.dialCode}${digits}` : `+${selected.dialCode}`;
    onChange(next);
  };

  const preferred = COUNTRIES.filter(c => preferredCountries.includes(c.iso2));
  const others = COUNTRIES.filter(c => !preferredCountries.includes(c.iso2));

  return (
    <div className={`relative ${className || ""}`}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-2 pr-2 w-32 border-r border-border/30">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              aria-label={`Select country, currently ${selected.name}`}
              className="h-10 pl-2 pr-0 gap-2 hover:bg-transparent focus-visible:ring-0"
            >
              {(() => {
                const Key = selected.iso2.toUpperCase() as keyof typeof Flags;
                const Flag = (Flags as any)[Key] as React.ComponentType<{ title?: string; className?: string }> | undefined;
                return Flag ? (
                  <Flag title={selected.name} className="h-4 w-6 rounded-[2px] shadow-sm" />
                ) : (
                  <span className="text-xs font-mono">{selected.iso2.toUpperCase()}</span>
                );
              })()}
              <span className="text-xs font-medium text-foreground">+{selected.dialCode}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-72" align="start">
            <Command>
              <CommandInput placeholder="Search country" />
              <CommandEmpty>No country found.</CommandEmpty>
              <div className="max-h-64 overflow-y-auto">
                {preferred.length > 0 && (
                  <CommandGroup heading="Preferred">
                    {preferred.map((c) => (
                      <CommandItem key={c.iso2} value={`${c.name} ${c.dialCode}`} onSelect={() => handleCountrySelect(c)}>
                        {(() => {
                          const Key = c.iso2.toUpperCase() as keyof typeof Flags;
                          const Flag = (Flags as any)[Key] as React.ComponentType<{ title?: string; className?: string }> | undefined;
                          return Flag ? (
                            <Flag className="mr-2 h-4 w-6 rounded-[2px]" />
                          ) : (
                            <span className="mr-2 text-xs font-mono">{c.iso2.toUpperCase()}</span>
                          );
                        })()}
                        <span className="flex-1">{c.name}</span>
                        <span className="text-muted-foreground">+{c.dialCode}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                <CommandGroup heading="All countries">
                  {others.map((c) => (
                    <CommandItem key={c.iso2} value={`${c.name} ${c.dialCode}`} onSelect={() => handleCountrySelect(c)}>
                      {(() => {
                        const Key = c.iso2.toUpperCase() as keyof typeof Flags;
                        const Flag = (Flags as any)[Key] as React.ComponentType<{ title?: string; className?: string }> | undefined;
                        return Flag ? (
                          <Flag className="mr-2 h-4 w-6 rounded-[2px]" />
                        ) : (
                          <span className="mr-2 text-xs font-mono">{c.iso2.toUpperCase()}</span>
                        );
                      })()}
                      <span className="flex-1">{c.name}</span>
                      <span className="text-muted-foreground">+{c.dialCode}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </div>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <Input
        id={id}
        name={name}
        value={national}
        inputMode="numeric"
        placeholder={placeholder}
        onChange={(e) => handleNumberChange(e.target.value)}
        className="pl-[136px] h-10 bg-muted/20 border-border/30 focus:border-primary/50"
      />
    </div>
  );
};

export default CountryPhoneInput;

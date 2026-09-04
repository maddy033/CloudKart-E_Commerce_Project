/**
 * Project: CloudKart
 * File: SearchBar.tsx
 * Description: React component with TypeScript.
 * How to use: Rendered as part of the UI.
 * Why it exists: To build the frontend user interface.
 * When it's used: In the browser during user interaction.
 */

"use client";

import React, {
  Dispatch,
  SetStateAction,
  Suspense,
  useState,
} from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "./ui/button";
import { IoSearch } from "react-icons/io5";
import { cn } from "@/lib/utils";
import shops from "@/data/shops.json";

type SearchBarProps = {
  setIsSearchOpen?: Dispatch<SetStateAction<boolean>>;
  className?: string;
  useSelect?: boolean;
};

const SearchBarForm = ({
  setIsSearchOpen,
  className,
  useSelect,
}: SearchBarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("q")?.toString() || ""
  );
  const [selectedShop, setSelectedShop] = useState<string>("gadgets");

  const handleSelectShop = (shopSlug: string) => {
    const slug = shopSlug.toLowerCase();
    setSelectedShop(slug);

    const query = searchValue.trim()
      ? `?q=${encodeURIComponent(searchValue.trim())}`
      : "";
    router.push(`/shops/${slug}${query}`);

    if (setIsSearchOpen) {
      setIsSearchOpen(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const targetShop = (selectedShop || "gadgets").toLowerCase();
    const query = searchValue.trim()
      ? `?q=${encodeURIComponent(searchValue.trim())}`
      : "";

    router.push(`/shops/${targetShop}${query}`);

    if (setIsSearchOpen) {
      setIsSearchOpen(false);
    }
  };

  return (
    <form
      className={cn(
        "searchBar flex items-center border-input border rounded-lg focus-within:border-primary overflow-hidden bg-secondary",
        className
      )}
      onSubmit={handleSubmit}
    >
      {useSelect && (
        <Select onValueChange={handleSelectShop} value={selectedShop}>
          <SelectTrigger className="min-w-[70px] max-w-fit border-none rounded-none bg-accent">
            <SelectValue placeholder="Select Shop" className="capitalize" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel className="text-muted-foreground">Shops</SelectLabel>
              {shops.map((shop: any, index: number) => {
                const valueSlug = (
                  shop.slug || shop.title
                ).toLowerCase();

                return (
                  <SelectItem
                    value={valueSlug}
                    key={index}
                    className="px-4 [&>.indicator]:hidden capitalize cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={shop.icon}
                        width={20}
                        height={20}
                        alt={shop.title}
                      />
                      <span>{shop.title}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}

      <Input
        placeholder="Search products..."
        className="border-none rounded-none"
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />

      <Button className="text-xl" type="submit">
        <IoSearch />
      </Button>
    </form>
  );
};

const SearchBar = ({
  setIsSearchOpen,
  className,
  useSelect = true,
}: SearchBarProps) => {
  return (
    <Suspense>
      <SearchBarForm
        setIsSearchOpen={setIsSearchOpen}
        className={className}
        useSelect={useSelect}
      />
    </Suspense>
  );
};

export default SearchBar;

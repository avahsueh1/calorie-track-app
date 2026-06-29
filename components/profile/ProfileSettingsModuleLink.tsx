"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { profileSettingsModuleLinkButtonStyle } from "./shared";

interface ProfileSettingsModuleLinkProps {
  href: string;
  children: ReactNode;
}

export function ProfileSettingsModuleLink({
  href,
  children,
}: ProfileSettingsModuleLinkProps) {
  return (
    <Link
      href={href}
      style={{
        ...profileSettingsModuleLinkButtonStyle,
        boxSizing: "border-box",
        cursor: "pointer",
      }}
    >
      {children}
    </Link>
  );
}

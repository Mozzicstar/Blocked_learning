"use client";

import { usePathname } from "next/navigation";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const routeNameMap: Record<string, string> = {
  dashboard: "Dashboard",
  courses: "Courses",
  creator: "Creator",
  upload: "Upload",
  "my-courses": "My Courses",
  module: "Module",
};

export default function DynamicBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter((segment) => segment !== "");

  // Don't show breadcrumbs on root if you want, but user asked for them.
  // If we are at root, segments is empty.

  if (segments.length === 0) {
    return null;
  }

  return (
    <div className="px-4 py-3 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Breadcrumb>
        <BreadcrumbList>
          {/* <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem> */}
          {/* <BreadcrumbSeparator /> */}

          {segments.map((segment, index) => {
            const isLast = index === segments.length - 1;
            const href = `/${segments.slice(0, index + 1).join("/")}`;

            // Format name: use map or capitalize
            let name = routeNameMap[segment];
            if (!name) {
              // If it looks like an ID (long alphanumeric), truncate it
              if (segment.length > 20) {
                name = `${segment.slice(0, 6)}...${segment.slice(-4)}`;
              } else {
                // Capitalize first letter
                name = segment.charAt(0).toUpperCase() + segment.slice(1);
              }
            }

            return (
              <Fragment key={href}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={href}>{name}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

"use client";
import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { DashboardProvider } from "../contexts/DashboardContext";
import { PersonalizedDashboardProvider } from "../contexts/PersonalizedDashboardContext";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
        <NextUIProvider>
          <NextThemesProvider
            defaultTheme='system'
            attribute='class'
            enableSystem={true}
            disableTransitionOnChange={false}
            {...themeProps}>
            <DashboardProvider>
              <PersonalizedDashboardProvider>
                {children}
              </PersonalizedDashboardProvider>
            </DashboardProvider>
          </NextThemesProvider>
        </NextUIProvider>
  );
}

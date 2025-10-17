
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConversionInterface } from "@/components/conversion-interface";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Scale, Loader } from "lucide-react";
import { fetchConversionData, ConversionData } from "@/lib/conversion-data";
import { useLanguage } from "@/hooks/use-language";

export default function HomePage() {
  const { t, isInitialized } = useLanguage();
  const [conversionData, setConversionData] = useState<ConversionData | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const loadData = async () => {
      const data = await fetchConversionData();
      setConversionData(data);
    };
    loadData();
  }, []);
  
  if (!isMounted || !isInitialized || !conversionData) {
    return (
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 font-body">
        {isMounted && <Loader className="h-12 w-12 text-primary animate-spin" />}
      </main>
    );
  }
  
  const categories = ['length', 'area', 'mass', 'volume', 'time'];

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 font-body relative">
      <LanguageSwitcher />
      <Card className="w-full max-w-2xl shadow-lg border-2 border-primary/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Scale className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl text-foreground">{t.heritageConverter}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {t.converterDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={categories[0]} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-primary/10">
              {categories.map((categoryId) => (
                <TabsTrigger key={categoryId} value={categoryId} className="capitalize data-[state=active]:bg-accent data-[state=active]:text-white">
                  {t.categories[categoryId as keyof typeof t.categories]}
                </TabsTrigger>
              ))}
            </TabsList>
            {categories.map((categoryId) => (
              <TabsContent key={categoryId} value={categoryId} className="mt-6">
                <ConversionInterface categoryId={categoryId} conversionData={conversionData}/>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}

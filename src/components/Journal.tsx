import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TradingLayout } from "./layout/TradingLayout";

export function Journal() {
  return (
    <TradingLayout>
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trading Journal</h1>
          <p className="text-muted-foreground mt-1">Track and analyze your trading performance</p>
        </div>
        <Button className="mt-4 md:mt-0 bg-gradient-primary hover:bg-primary-hover">
          <Plus className="h-4 w-4 mr-2" />
          New Entry
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Search and Filter */}
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search entries..."
                  className="pl-10 bg-background/50"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        <Card className="border-dashed border-2 bg-transparent">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No journal entries yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Start documenting your trades to track performance and improve your strategy.
            </p>
            <Button className="bg-gradient-primary hover:bg-primary-hover">
              <Plus className="h-4 w-4 mr-2" />
              Create your first entry
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
    </TradingLayout>
  );
}
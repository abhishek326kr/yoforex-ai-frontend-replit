
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from "./ui/accordion";
import { AccordionHeader } from "@radix-ui/react-accordion";
function AiModelsSelection() {
    const [selectedModels, setSelectedModels] = useState<string[]>([]);
    const toggleModel = (modelName: string) => {
        setSelectedModels(prev =>
            prev.includes(modelName)
                ? prev.filter(m => m !== modelName)
                : [...prev, modelName]
        );
    };

    const aiModels = {
        free: [
            { name: "YoForex AI", description: "Full detailed analysis", credits: 1, accuracy: 71 },
            { name: "Claude Haiku", description: "Fast technical analysis", credits: 1, accuracy: 78, status: "coming soon" },
            { name: "Gemini 1.5 Flash", description: "Market sentiment", credits: 1, accuracy: 75, status: "coming soon" },
            { name: "Mistral 7B", description: "Pattern recognition", credits: 1, accuracy: 72, status: "coming soon" },
            { name: "Llama 3.1 8B", description: "Support/resistance", credits: 1, accuracy: 74, status: "coming soon" }
        ],
        pro: [
            { name: "GPT-4 Omni", description: "Advanced analysis", credits: 150, accuracy: 89, status: "coming soon" },
            { name: "Claude 3.5 Sonnet", description: "Deep patterns", credits: 150, accuracy: 91, status: "coming soon" },
            { name: "Gemini 1.5 Pro", description: "News integration", credits: 150, accuracy: 87, status: "coming soon" }
        ],
        max: [
            { name: "GPT-4 Turbo", description: "Institutional analysis", credits: 100, accuracy: 94, status: "coming soon" },
            { name: "Claude 3 Opus", description: "Deep reasoning", credits: 100, accuracy: 92, status: "coming soon" },
            { name: "Grok AI", description: "Pay-per-use", credits: "Variable", accuracy: 88, status: "coming soon" }
        ]
    };
    return (
        <Accordion type="single" collapsible className="border rounded-lg overflow-hidden">
            <AccordionItem value="ai-models" className="border-b">
                <AccordionTrigger className="px-4 py-3 text-left font-medium flex justify-between items-center w-full hover:bg-secondary/30 transition-colors">
                    <span>AI Models</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                    <Card className="p-4 bg-gradient-glass backdrop-blur-sm border-border/20 flex-shrink-0 overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <Badge variant="secondary">2,153 credits</Badge>
                        </div>

                        <Accordion
                            type="multiple"
                            defaultValue={['free']}
                            className="space-y-2"
                        >
                            {/* Free Tier */}
                            <AccordionItem value="free" className="overflow-hidden rounded-lg border border-border/20">
                                <AccordionHeader className="flex">
                                    <AccordionTrigger className="group flex flex-1 items-center justify-between p-3 text-sm font-medium transition-all hover:bg-secondary/30 [&[data-state=open]>svg]:rotate-180">
                                        <div className="flex items-center space-x-2">
                                            <span>Free Tier</span>
                                            <Badge variant="outline" className="text-xs">{aiModels.free.length} models</Badge>
                                        </div>
                                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                                    </AccordionTrigger>
                                </AccordionHeader>
                                <AccordionContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                                    <div className="p-3 pt-0 space-y-2">
                                        {aiModels.free.map((model) => (
                                            <div
                                                key={model.name}
                                                className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedModels.includes(model.name)
                                                    ? 'border-primary bg-gradient-secondary'
                                                    : 'border-border/20 hover:border-border/40 bg-gradient-secondary/50'
                                                    }`}
                                                onClick={() => toggleModel(model.name)}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm font-medium text-foreground">{model.name}</span>
                                                        {model.status && model.name !== 'YoForex AI' && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                {model.status}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <Badge variant="outline" className="text-xs">
                                                        {model.credits} {model.credits === 1 ? 'credit' : 'credits'}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground">{model.description}</p>
                                                <p className="text-xs text-trading-neutral mt-1">{model.accuracy}% accuracy</p>
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            {/* Pro Tier */}
                            <AccordionItem value="pro" className="overflow-hidden rounded-lg border border-primary/30">
                                <AccordionHeader className="flex">
                                    <AccordionTrigger className="group flex flex-1 items-center justify-between p-3 text-sm font-medium transition-all hover:bg-primary/5 [&[data-state=open]>svg]:rotate-180">
                                        <div className="flex items-center space-x-2">
                                            <span>Pro Tier</span>
                                            <Badge variant="secondary" className="text-xs">{aiModels.pro.length} models</Badge>
                                        </div>
                                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                                    </AccordionTrigger>
                                </AccordionHeader>
                                <AccordionContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                                    <div className="p-3 pt-0 space-y-2">
                                        {aiModels.pro.map((model) => (
                                            <div
                                                key={model.name}
                                                className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedModels.includes(model.name)
                                                    ? 'border-primary bg-gradient-primary/20'
                                                    : 'border-primary/30 hover:border-primary/50 bg-gradient-primary/10'
                                                    }`}
                                                onClick={() => toggleModel(model.name)}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm font-medium text-foreground">{model.name}</span>
                                                        {model.status && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                {model.status}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <Badge className="bg-gradient-primary text-xs">
                                                        {model.credits} credits
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground">{model.description}</p>
                                                <p className="text-xs text-primary mt-1">{model.accuracy}% accuracy</p>
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            {/* Max Tier */}
                            <AccordionItem value="max" className="overflow-hidden rounded-lg border border-amber-500/30">
                                <AccordionHeader className="flex">
                                    <AccordionTrigger className="group flex flex-1 items-center justify-between p-3 text-sm font-medium transition-all hover:bg-amber-500/5 [&[data-state=open]>svg]:rotate-180">
                                        <div className="flex items-center space-x-2">
                                            <span>Max Tier</span>
                                            <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-500 border-amber-500/20">
                                                {aiModels.max.length} premium models
                                            </Badge>
                                        </div>
                                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                                    </AccordionTrigger>
                                </AccordionHeader>
                                <AccordionContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                                    <div className="p-3 pt-0 space-y-2">
                                        {aiModels.max.map((model) => (
                                            <div
                                                key={model.name}
                                                className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedModels.includes(model.name)
                                                    ? 'border-amber-500 bg-amber-500/10'
                                                    : 'border-amber-500/30 hover:border-amber-500/50 bg-amber-500/5'
                                                    }`}
                                                onClick={() => toggleModel(model.name)}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm font-medium text-foreground">{model.name}</span>
                                                        {model.status && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                {model.status}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <Badge className="bg-amber-500 text-white text-xs">
                                                        {model.credits} {typeof model.credits === 'number' ? 'credits' : ''}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground">{model.description}</p>
                                                <p className="text-xs text-amber-500 mt-1">{model.accuracy}% accuracy</p>
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </Card>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}

export default AiModelsSelection;



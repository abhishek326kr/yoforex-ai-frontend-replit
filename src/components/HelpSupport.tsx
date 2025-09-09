import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";
import { Paperclip, Info, Search } from "lucide-react";
import { TradingLayout } from "./layout/TradingLayout";
import { useMemo, useState } from "react";

export default function HelpSupport() {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    service: "",
    priority: "",
    subject: "",
    message: "",
  });
  
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  type Ticket = {
    id: string;
    subject: string;
    service: string;
    priority: "low" | "medium" | "high" | "urgent";
    status: "Open" | "In Progress" | "Closed";
    createdAt: string;
  };

  const [activeTab, setActiveTab] = useState<string>("new");
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: "TKT-0012", subject: "Withdrawal delay", service: "Trading Platform", priority: "medium", status: "Closed", createdAt: "2025-05-15" },
    { id: "TKT-0009", subject: "API key not working", service: "API Integration", priority: "high", status: "In Progress", createdAt: "2025-05-02" },
    { id: "TKT-0008", subject: "Billing discrepancy", service: "Web Platform", priority: "urgent", status: "Closed", createdAt: "2025-04-22" },
    { id: "TKT-0005", subject: "App crash on login", service: "Mobile App", priority: "high", status: "Open", createdAt: "2025-03-30" },
  ]);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const MAX_TOTAL_BYTES = 75 * 1024 * 1024; // 75MB

  const totalAttachmentBytes = useMemo(
    () => attachments.reduce((sum, f) => sum + f.size, 0),
    [attachments]
  );

  // Recent tickets data (could be fetched from API)
  const recentTickets = [
    { id: "TKT-0012", status: "Closed", date: "2023-05-15" },
    { id: "TKT-0008", status: "Closed", date: "2023-04-22" },
    { id: "TKT-0005", status: "Closed", date: "2023-03-30" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isAllowedFile = (file: File) => {
    const allowed = ["image/jpeg", "image/png", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    return allowed.includes(file.type);
  };

  const addFiles = (files: File[]) => {
    const filtered = files.filter(isAllowedFile);
    if (filtered.length !== files.length) {
      toast({ title: "Some files were skipped", description: "Only JPG, PNG, PDF, DOC, DOCX are allowed.", variant: "default" });
    }

    const newTotal = filtered.reduce((sum, f) => sum + f.size, totalAttachmentBytes) ;
    if (newTotal > MAX_TOTAL_BYTES) {
      toast({ title: "Attachment limit exceeded", description: "Total attachments must be within 75MB.", variant: "destructive" });
      return;
    }
    setAttachments(prev => [...prev, ...filtered]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // This would be replaced with actual API call
    console.log("Submitting ticket:", formData);
    console.log("Attachments:", attachments);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      const newId = `TKT-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, "0")}`;
      setTickets(prev => [
        {
          id: newId,
          subject: formData.subject || "New Ticket",
          service: formData.service ?
            (formData.service === "trading" ? "Trading Platform" : formData.service === "api" ? "API Integration" : formData.service === "mobile" ? "Mobile App" : "Web Platform") : "General",
          priority: (formData.priority || "low") as Ticket["priority"],
          status: "Open",
          createdAt: new Date().toISOString().slice(0, 10),
        },
        ...prev,
      ]);
      toast({ title: "Ticket submitted", description: `${newId} created successfully.` });
      setActiveTab("my");
      // Reset form
      setFormData({
        name: "",
        email: "",
        department: "",
        service: "",
        priority: "",
        subject: "",
        message: "",
      });
      setAttachments([]);
    }, 1500);
  };

  return (
    <TradingLayout>
      <TooltipProvider>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-3">Support Ticket Submission</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Submit a support ticket and our team will assist you as soon as possible.
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Recent Tickets Panel */}
            <div className="lg:w-1/4">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Your Recent Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTickets.map((ticket, index) => (
                      <div key={index} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{ticket.id}</span>
                          <span className="text-xs px-2 py-1 bg-muted rounded">{ticket.status}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{ticket.date}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right: Tabs */}
            <div className="lg:w-3/4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="new">New Ticket</TabsTrigger>
                  <TabsTrigger value="my">My Tickets</TabsTrigger>
                  <TabsTrigger value="faq">FAQ</TabsTrigger>
                </TabsList>

                {/* New Ticket */}
                <TabsContent value="new">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Open New Ticket</CardTitle>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Info className="h-4 w-4" />
                        <span>
                          SLA: Low 48h • Medium 24h • High 12h • Urgent 4h
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => handleInputChange("name", e.target.value)}
                              placeholder="Your full name"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                              placeholder="your.email@example.com"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="technical">Technical Support</SelectItem>
                                <SelectItem value="billing">Billing</SelectItem>
                                <SelectItem value="account">Account Management</SelectItem>
                                <SelectItem value="general">General Inquiry</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="service">Related Service</Label>
                            <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select service" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="trading">Trading Platform</SelectItem>
                                <SelectItem value="api">API Integration</SelectItem>
                                <SelectItem value="mobile">Mobile App</SelectItem>
                                <SelectItem value="web">Web Platform</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="priority">Priority</Label>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="text-xs text-muted-foreground underline-offset-2 hover:underline cursor-help">What should I pick?</span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs text-xs">
                                    Low: minor issue • Medium: normal • High: business impact • Urgent: critical outage
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                              id="subject"
                              value={formData.subject}
                              onChange={(e) => handleInputChange("subject", e.target.value)}
                              placeholder="Brief description of your issue"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="message">Message</Label>
                            <span className="text-xs text-muted-foreground">{formData.message.length}/1000</span>
                          </div>
                          <Textarea
                            id="message"
                            value={formData.message}
                            onChange={(e) => handleInputChange("message", e.target.value.slice(0, 1000))}
                            placeholder="Please provide detailed information about your issue..."
                            rows={5}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="attachment">Attachments</Label>
                            <span className="text-xs text-muted-foreground">{(totalAttachmentBytes / (1024*1024)).toFixed(1)} / 75 MB</span>
                          </div>
                          <div
                            className="border border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                          >
                            <input
                              type="file"
                              id="attachment"
                              className="hidden"
                              onChange={handleFileChange}
                              multiple
                            />
                            <label htmlFor="attachment" className="cursor-pointer block">
                              <Paperclip className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">
                                Drag & drop files here or click to browse
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Supported formats: JPG, PNG, PDF, DOC, DOCX (Max 75MB total)
                              </p>
                            </label>
                          </div>
                          
                          {attachments.length > 0 && (
                            <div className="mt-4 space-y-2">
                              <p className="text-sm font-medium">Selected files:</p>
                              <div className="space-y-2">
                                {attachments.map((file, index) => (
                                  <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                                    <span className="text-sm truncate max-w-xs">{file.name}</span>
                                    <span className="text-xs text-muted-foreground mr-2">{(file.size / (1024*1024)).toFixed(2)} MB</span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeAttachment(index)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-end items-center gap-4 pt-4">
                          <Button type="button" variant="outline">
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit Ticket"}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* My Tickets */}
                <TabsContent value="my">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Tickets</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-4">
                        <div className="relative w-full md:w-1/2">
                          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by ID or subject"
                            className="pl-8"
                          />
                        </div>
                        <div className="w-full md:w-48">
                          <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                              <SelectValue placeholder="Filter status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="Open">Open</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Created</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tickets
                            .filter(t => statusFilter === "all" ? true : t.status === statusFilter)
                            .filter(t => `${t.id} ${t.subject}`.toLowerCase().includes(query.toLowerCase()))
                            .map((t) => (
                              <TableRow key={t.id} className="hover:bg-muted/40">
                                <TableCell className="font-medium">{t.id}</TableCell>
                                <TableCell>{t.subject}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{t.service}</TableCell>
                                <TableCell>
                                  <Badge variant={
                                    t.priority === "urgent" ? "destructive" :
                                    t.priority === "high" ? "secondary" :
                                    t.priority === "medium" ? "default" : "outline"
                                  } className={t.priority === "urgent" ? "uppercase" : ""}>
                                    {t.priority}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={t.status === "Closed" ? "outline" : "default"}>{t.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right text-sm text-muted-foreground">{t.createdAt}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* FAQ */}
                <TabsContent value="faq">
                  <Card>
                    <CardHeader>
                      <CardTitle>Frequently Asked Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                          <AccordionTrigger>How do I set ticket priority?</AccordionTrigger>
                          <AccordionContent>
                            Choose based on impact and urgency. Urgent is only for critical outages affecting trading execution.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                          <AccordionTrigger>What is the typical response time?</AccordionTrigger>
                          <AccordionContent>
                            Our SLA targets are: Low 48h, Medium 24h, High 12h, Urgent 4h during business hours.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                          <AccordionTrigger>Which files can I attach?</AccordionTrigger>
                          <AccordionContent>
                            We support JPG, PNG, PDF, DOC, DOCX with a combined size up to 75MB.
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p> 2025 YoForex AI. All rights reserved. | English</p>
          </div>
        </div>
      </TooltipProvider>
    </TradingLayout>
  );
}
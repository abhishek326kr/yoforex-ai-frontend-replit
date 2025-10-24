<<<<<<< HEAD
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { showApiError } from '@/lib/ui/errorToast';
import { Paperclip, Info, Search } from "lucide-react";
import { TradingLayout } from "./layout/TradingLayout";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { createTicket, fetchSupportMetadata, fetchMyTickets, fetchTicketById, createTicketComment, fetchTicketComment, type SupportMetadata, type TicketDTO, type TicketCommentDTO } from "@/lib/api/support";
import { profileStorage } from "@/utils/profileStorage";

export default function HelpSupport() {
  const [, navigate] = useLocation();
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
  const [metadata, setMetadata] = useState<SupportMetadata | null>(null);
  const [loadingMeta, setLoadingMeta] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  type Ticket = {
    id: string;
    subject: string;
    service: string;
    priority: "low" | "medium" | "high" | "urgent";
    status: "Open" | "In Progress" | "Closed";
    createdAt: string;
    backendId: string | number;
  };

  const [activeTab, setActiveTab] = useState<string>("new");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [ticketsLoaded, setTicketsLoaded] = useState(false);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const MAX_TOTAL_BYTES = 7.5 * 1024 * 1024; // 7.5MB (matches backend)

  const totalAttachmentBytes = useMemo(
    () => attachments.reduce((sum, f) => sum + f.size, 0),
    [attachments]
  );

  // Load departments/services metadata
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingMeta(true);
        const data = await fetchSupportMetadata();
        if (mounted) setMetadata(data);
      } catch (e: any) {
        showApiError(e, { title: 'Failed to load support metadata', defaultMessage: 'Failed to load support metadata. Please try again.' });
      } finally {
        if (mounted) setLoadingMeta(false);
      }
    })();
    return () => { mounted = false; };
  }, [toast]);

  // Map backend TicketDTO to UI Ticket row
  const mapTicket = (t: TicketDTO): Ticket => {
    const numericId = typeof t.id === 'number' ? t.id : parseInt(String(t.id).replace(/\D/g, ''), 10);
    const uiId = isNaN(numericId) ? `TKT-${String(t.id)}` : `TKT-${String(numericId).padStart(4, '0')}`;
    const uiPriority = String(t.priority || 'low').toLowerCase() as Ticket['priority'];
    const rawStatus = String(t.status || 'open').toLowerCase();
    const uiStatus: Ticket['status'] = rawStatus === 'closed' ? 'Closed' : (rawStatus === 'in_progress' || rawStatus === 'in-progress') ? 'In Progress' : 'Open';
    const created = t.created_at ? new Date(t.created_at).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
    const serviceLabel = t.related_service || t.department || 'General';
    return {
      id: uiId,
      subject: t.subject || 'Support Ticket',
      service: serviceLabel,
      priority: ['low', 'medium', 'high', 'urgent'].includes(uiPriority) ? uiPriority : 'low',
      status: uiStatus,
      createdAt: created,
      backendId: t.id,
    };
  };

  // Ticket details dialog state
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | number | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [ticketDetails, setTicketDetails] = useState<TicketDTO | null>(null);
  const [comments, setComments] = useState<TicketCommentDTO[]>([]);
  const [commentInput, setCommentInput] = useState<string>("");
  const [commentSubmitting, setCommentSubmitting] = useState<boolean>(false);

  // Extract attachment URLs from common shapes
  const getAttachmentUrls = (t: any): string[] => {
    if (!t) return [];
    const candidates = [
      t.attachment_urls,
      t.attachments,
      t.files,
      t.assets,
      t.data?.attachments,
    ];
    for (const c of candidates) {
      if (!c) continue;
      if (Array.isArray(c)) {
        // Could be array of strings or array of objects with url
        const urls = c
          .map((x: any) => typeof x === 'string' ? x : (x?.secure_url || x?.url || x?.href))
          .filter(Boolean);
        if (urls.length) return urls as string[];
      }
    }
    return [];
  };

  // Fetch ticket details when dialog opens
  useEffect(() => {
    let active = true;
    (async () => {
      if (!detailsOpen || selectedTicketId == null) return;
      try {
        setDetailsLoading(true);
        const data = await fetchTicketById(selectedTicketId);
        if (!active) return;
        setTicketDetails(data);
        // Initialize comments if backend embeds them
        const embedded = (data as any)?.comments || (data as any)?.messages || (data as any)?.conversation || [];
        if (Array.isArray(embedded)) {
          const mapped: TicketCommentDTO[] = embedded.map((c: any) => ({
            id: c?.id ?? c?.comment_id ?? Math.random().toString(36).slice(2),
            ticket_id: (data as any)?.id,
            author: c?.author || c?.user || c?.by || 'User',
            role: c?.role || (c?.is_admin ? 'admin' : 'user'),
            message: c?.message || c?.text || c?.body || '',
            created_at: c?.created_at || c?.createdAt || c?.time || undefined,
            attachments: Array.isArray(c?.attachments) ? c.attachments : undefined,
          }));
          setComments(mapped);
        } else {
          setComments([]);
        }
      } catch (e: any) {
        setTicketDetails(null);
        showApiError(e, { title: 'Failed to load ticket details', defaultMessage: 'Failed to load ticket details. Please try again.' });
      } finally {
        if (active) setDetailsLoading(false);
      }
    })();
    return () => { active = false; };
  }, [detailsOpen, selectedTicketId, toast]);

  // Submit a new comment
  const submitComment = async () => {
    if (!selectedTicketId) return;
    const msg = commentInput.trim();
    if (!msg) return;
    try {
      setCommentSubmitting(true);
      const created = await createTicketComment(selectedTicketId, msg);
      const newId = (created as any)?.id;
      let full: TicketCommentDTO | null = null;
      try {
        if (newId != null) {
          full = await fetchTicketComment(selectedTicketId, newId);
        }
      } catch { }
      const fallback: TicketCommentDTO = full || {
        id: newId ?? Math.random().toString(36).slice(2),
        ticket_id: String(selectedTicketId),
        author: 'You',
        role: 'user',
        message: msg,
        created_at: new Date().toISOString(),
      };
      setComments(prev => [fallback, ...prev]);
      setCommentInput("");
      } catch (e: any) {
        showApiError(e, { title: 'Failed to add comment', defaultMessage: 'Failed to add comment. Please try again.' });
    } finally {
      setCommentSubmitting(false);
    }
  };

  // Fetch user's tickets when switching to My Tickets tab (lazy)
  useEffect(() => {
    let active = true;
    (async () => {
      if (activeTab !== 'my' || ticketsLoaded) return;
      try {
        setTicketsLoading(true);
        const data = await fetchMyTickets();
        if (!active) return;
        const rows = Array.isArray(data) ? data.map(mapTicket) : [];
        setTickets(rows);
        setTicketsLoaded(true);
      } catch (e: any) {
        showApiError(e, { title: 'Failed to load tickets', defaultMessage: 'Failed to load tickets. Please try again.' });
      } finally {
        if (active) setTicketsLoading(false);
      }
    })();
    return () => { active = false; };
  }, [activeTab, ticketsLoaded, toast]);

  // Recent tickets panel removed; showing only tabs content

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Load user profile to prefill name and email
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingProfile(true);
        const profile = await profileStorage.getProfile();
        if (mounted && profile) {
          setFormData(prev => ({
            ...prev,
            name: profile.name || prev.name,
            email: profile.email || prev.email,
          }));
        }
      } catch (e) {
        // silent fail; form remains editable
      } finally {
        if (mounted) setLoadingProfile(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const isAllowedFile = (file: File) => {
    const allowed = ["image/jpeg", "image/png", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    return allowed.includes(file.type);
  };

  const addFiles = (files: File[]) => {
    const filtered = files.filter(isAllowedFile);
    if (filtered.length !== files.length) {
      toast({ title: "Some files were skipped", description: "Only JPG, PNG, PDF, DOC, DOCX are allowed.", variant: "default" });
    }

    const newTotal = filtered.reduce((sum, f) => sum + f.size, totalAttachmentBytes);
    if (newTotal > MAX_TOTAL_BYTES) {
      toast({ title: "Attachment limit exceeded", description: "Total attachments must be within 7.5MB.", variant: "destructive" });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const apiTicket = await createTicket({
        department: formData.department || undefined,
        related_service: formData.service || undefined,
        priority: (formData.priority as any) || 'low',
        subject: formData.subject,
        message: formData.message,
        attachments,
        name: formData.name || undefined,
        email: formData.email || undefined,
      });

      // Switch to My Tickets first
      setActiveTab("my");
      // Refetch from backend to ensure persistence and real IDs with brief retry (eventual consistency)
      try {
        let attempts = 0;
        let rows: typeof tickets = [];
        while (attempts < 3) {
          const list = await fetchMyTickets();
          rows = Array.isArray(list) ? list.map(mapTicket) : [];
          if (rows.length > 0) break;
          attempts++;
          await new Promise(r => setTimeout(r, 500));
        }
        setTickets(rows);
        setTicketsLoaded(true);
      } catch { }
      toast({ title: "Ticket submitted", description: `Ticket created successfully.` });
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
    } catch (err: any) {
      showApiError(err, { title: 'Failed to submit ticket', defaultMessage: 'Failed to submit ticket. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
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
            {/* Tabs */}
            <div className="w-full">
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
                              placeholder={loadingProfile ? "Loading..." : "Your full name"}
                              readOnly
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
                              placeholder={loadingProfile ? "Loading..." : "your.email@example.com"}
                              readOnly
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Select
                              value={formData.department}
                              onValueChange={(value) => {
                                // value is the backend label (e.g., "Technical Support")
                                handleInputChange("department", value);
                                // Clear service if not in selected dept
                                const dept = metadata?.departments.find(d => d.department === value);
                                if (!dept?.services.includes(formData.service)) {
                                  handleInputChange("service", "");
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={loadingMeta ? "Loading..." : "Select department"} />
                              </SelectTrigger>
                              <SelectContent>
                                {(metadata?.departments || []).map((d) => (
                                  <SelectItem key={d.department} value={d.department}>{d.department}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="service">Related Service</Label>
                            <Select
                              value={formData.service}
                              onValueChange={(value) => handleInputChange("service", value)}
                              disabled={!formData.department || loadingMeta}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={!formData.department ? "Select department first" : (loadingMeta ? "Loading..." : "Select service")} />
                              </SelectTrigger>
                              <SelectContent>
                                {(metadata?.departments.find(d => d.department === formData.department)?.services || []).map((s) => (
                                  <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
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
                            <span className="text-xs text-muted-foreground">{(totalAttachmentBytes / (1024 * 1024)).toFixed(1)} / 7.5 MB</span>
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
                                Supported formats: JPG, PNG, PDF, DOC, DOCX (Max 7.5MB total)
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
                                    <span className="text-xs text-muted-foreground mr-2">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
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
                          {ticketsLoading && (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">Loading tickets...</TableCell>
                            </TableRow>
                          )}
                          {!ticketsLoading && tickets.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">No tickets found.</TableCell>
                            </TableRow>
                          )}
                          {!ticketsLoading && tickets
                            .filter(t => statusFilter === "all" ? true : t.status === statusFilter)
                            .filter(t => `${t.id} ${t.subject}`.toLowerCase().includes(query.toLowerCase()))
                            .map((t) => (
                              <TableRow
                                key={t.id}
                                className="hover:bg-muted/40 cursor-pointer"
                                onClick={() => navigate(`/help/tickets/${t.backendId}`)}
                              >
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
                            We support JPG, PNG, PDF, DOC, DOCX with a combined size up to 7.5MB.
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              {/* Ticket Details Dialog (kept for backward compatibility but navigation is preferred) */}
              <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>
                      Ticket Details {ticketDetails?.id != null ? `#${ticketDetails.id}` : (selectedTicketId != null ? `#${selectedTicketId}` : '')}
                    </DialogTitle>
                    <DialogDescription>
                      View the full details of your support ticket
                    </DialogDescription>
                  </DialogHeader>
                  {detailsLoading && (
                    <div className="text-sm text-muted-foreground">Loading details...</div>
                  )}
                  {!detailsLoading && ticketDetails && (
                    <div className="space-y-4 text-sm">
                      <div>
                        <span className="font-medium">Subject: </span>
                        <span>{ticketDetails.subject}</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="font-medium">Status:</span>
                        <Badge variant={String(ticketDetails.status).toLowerCase() === 'closed' ? 'outline' : 'default'}>
                          {String(ticketDetails.status || 'open').replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="font-medium">Priority:</span>
                        <Badge variant={String(ticketDetails.priority).toLowerCase() === 'urgent' ? 'destructive' : 'default'}>
                          {String(ticketDetails.priority || 'low')}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium">Department / Service: </span>
                        <span>{ticketDetails.related_service || ticketDetails.department || '—'}</span>
                      </div>
                      <div>
                        <span className="font-medium">Created: </span>
                        <span>{ticketDetails.created_at ? new Date(ticketDetails.created_at).toLocaleString() : '—'}</span>
                      </div>
                      {/* If backend returns message/body/details, try to show */}
                      {(ticketDetails as any).message && (
                        <div>
                          <span className="font-medium">Message: </span>
                          <div className="mt-1 whitespace-pre-wrap text-muted-foreground">{String((ticketDetails as any).message)}</div>
                        </div>
                      )}
                      {/* Attachments */}
                      {(() => {
                        const urls = getAttachmentUrls(ticketDetails);
                        if (urls.length === 0) return null;
                        const imageUrls = urls.filter(u => /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(u));
                        const otherUrls = urls.filter(u => !/\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(u));
                        return (
                          <div className="space-y-2">
                            <div className="font-medium">Attachments</div>
                            {(imageUrls.length > 0) && (
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {imageUrls.map((u, i) => (
                                  <a key={i} href={u} target="_blank" rel="noreferrer" className="block">
                                    <img src={u} alt={`attachment-${i}`} className="w-full h-28 object-cover rounded border" />
                                  </a>
                                ))}
                              </div>
                            )}
                            {(otherUrls.length > 0) && (
                              <ul className="list-disc pl-5 space-y-1">
                                {otherUrls.map((u, i) => (
                                  <li key={i}>
                                    <a href={u} target="_blank" rel="noreferrer" className="underline text-blue-400 hover:text-blue-300 break-all">{u}</a>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })()}
                      {/* Comments Section (moved to details dialog) */}
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">Comments</div>
                        </div>
                        <div className="space-y-3">
                          {/* New comment input */}
                          <div className="space-y-2">
                            <Textarea
                              value={commentInput}
                              onChange={(e) => setCommentInput(e.target.value)}
                              placeholder="Write a comment..."
                              rows={3}
                            />
                            <div className="flex justify-end">
                              <Button type="button" size="sm" onClick={submitComment} disabled={commentSubmitting || !commentInput.trim()}>
                                {commentSubmitting ? 'Posting...' : 'Post Comment'}
                              </Button>
                            </div>
                          </div>
                          {/* Comments list */}
                          <div className="space-y-2">
                            {comments.length === 0 ? (
                              <div className="text-xs text-muted-foreground">No comments yet.</div>
                            ) : (
                              comments.map((c) => (
                                <div key={String(c.id)} className="p-3 border rounded-md bg-muted/30">
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="text-xs font-medium">
                                      {c.author || 'User'}
                                      {c.role && (
                                        <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded ${String(c.role).toLowerCase() === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                          {String(c.role).toUpperCase()}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground">{c.created_at ? new Date(c.created_at).toLocaleString() : ''}</div>
                                  </div>
                                  <div className="mt-1 text-sm whitespace-pre-wrap">{c.message}</div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Raw JSON intentionally omitted per requirements */}
                    </div>
                  )}
                  {!detailsLoading && !ticketDetails && (
                    <div className="text-sm text-muted-foreground">No details available.</div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p> 2025 YoForex AI. All rights reserved. | English</p>
          </div>
        </div>
      </TooltipProvider>
=======
import { Card, CardContent} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, BookOpen, AlertCircle } from "lucide-react";
import { TradingLayout } from "./layout/TradingLayout";

export default function HelpSupport() {
  const supportItems = [
    {
      title: "Contact Support",
      description: "Get in touch with our support team for immediate assistance.",
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      buttonText: "Start Chat",
    },
    {
      title: "Email Us",
      description: "Send us an email and we'll get back to you within 24 hours.",
      icon: <Mail className="h-6 w-6 text-primary" />,
      buttonText: "Send Email",
    },
    {
      title: "Knowledge Base",
      description: "Browse our comprehensive guides and documentation.",
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      buttonText: "View Articles",
    },
  ];

  return (
    <TradingLayout>
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-foreground mb-3">How can we help you?</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We're here to help you get the most out of YoForex AI. Choose an option below or search our knowledge base.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
        {supportItems.map((item, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground mb-4">{item.description}</p>
              <Button variant="outline" className="w-full">
                {item.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4 md:mb-0 md:mr-6">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-1">Need urgent help?</h3>
              <p className="text-muted-foreground mb-4 md:mb-0">
                Our support team is available 24/7 to assist you with any urgent issues.
              </p>
            </div>
            <Button className="w-full md:w-auto mt-4 md:mt-0 md:ml-auto bg-gradient-primary hover:bg-primary-hover">
              Emergency Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
    </TradingLayout>
  );
}
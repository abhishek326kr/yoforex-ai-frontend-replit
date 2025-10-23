import { useEffect, useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { TradingLayout } from "@/components/layout/TradingLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { showApiError } from "@/lib/ui/errorToast";
import { fetchTicketById, createTicketComment, type TicketDTO, type TicketCommentDTO } from "@/lib/api/support";
import { Paperclip } from "lucide-react";

function formatId(id: number | string | undefined) {
  if (id == null) return "";
  const n = typeof id === 'number' ? id : parseInt(String(id).replace(/\D/g, ''), 10);
  return isNaN(n) ? `TKT-${String(id)}` : `TKT-${String(n).padStart(4, '0')}`;
}

function StatusBadge({ status }: { status?: string }) {
  const s = String(status || 'open').toLowerCase();
  const label = s === 'closed' ? 'Closed' : s.includes('progress') ? 'In Progress' : 'Open';
  return <Badge variant={s === 'closed' ? 'outline' : 'default'}>{label}</Badge>;
}

function PriorityBadge({ priority }: { priority?: string }) {
  const p = String(priority || 'low').toLowerCase();
  const variant = p === 'urgent' ? 'destructive' : p === 'high' ? 'secondary' : p === 'medium' ? 'default' : 'outline';
  return <Badge variant={variant} className={p === 'urgent' ? 'uppercase' : ''}>{p}</Badge>;
}

export default function TicketView() {
  const [, params] = useRoute("/help/tickets/:id");
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const ticketId = params?.id as string | undefined;

  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<TicketDTO & { comments?: TicketCommentDTO[]; attachments?: any[] } | null>(null);
  const [comments, setComments] = useState<TicketCommentDTO[]>([]);
  const [reply, setReply] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!ticketId) return;
      try {
        setLoading(true);
        const data = await fetchTicketById(ticketId);
        if (!active) return;
        setTicket(data as any);
        const embedded = (data as any)?.comments || [];
        setComments(Array.isArray(embedded) ? embedded.slice().reverse() : []); // oldest at top like typical threads
      } catch (e: any) {
        showApiError(e, { title: 'Failed to load ticket', defaultMessage: 'Failed to load ticket. Please try again.' });
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [ticketId, toast]);

  const createdAt = useMemo(() => {
    if (!ticket?.created_at) return '';
    const d = new Date(ticket.created_at);
    return d.toLocaleString();
  }, [ticket]);

  const handlePostReply = async () => {
    const msg = reply.trim();
    if (!msg || !ticketId) return;
    try {
      setPosting(true);
      const created = await createTicketComment(ticketId, msg);
      const newComment: TicketCommentDTO = {
        id: (created as any)?.id ?? Math.random().toString(36).slice(2),
        ticket_id: ticketId,
        message: msg,
        role: 'user',
        created_at: new Date().toISOString(),
      };
      setComments(prev => [...prev, newComment]);
      setReply("");
      toast({ title: 'Reply posted' });
    } catch (e: any) {
      showApiError(e, { title: 'Failed to post reply', defaultMessage: 'Failed to post reply. Please try again.' });
    } finally {
      setPosting(false);
    }
  };

  return (
    <TradingLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb / Back */}
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <button className="hover:underline" onClick={() => navigate('/help')}>Support</button>
          <span>/</span>
          <span>Ticket {formatId(ticket?.id)}</span>
        </div>

        {/* Title and Meta */}
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Ticket {formatId(ticket?.id)} - [{String(ticket?.priority || 'low').toUpperCase()}] {ticket?.subject || (loading ? 'Loading…' : '—')}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <StatusBadge status={ticket?.status} />
            <span>Created: {createdAt || '—'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Conversation */}
          <div className="lg:col-span-8 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Conversation</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Original Message */}
                <div className="space-y-2">
                  <div className="border-l-2 pl-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">You</div>
                      <div className="text-xs text-muted-foreground">{createdAt || '—'}</div>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-sm">{ticket?.message}</p>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Comments Thread */}
                <div className="space-y-6">
                  {comments.length === 0 && (
                    <div className="text-sm text-muted-foreground">No replies yet.</div>
                  )}
                  {comments.map((c) => (
                    <div key={String(c.id)} className="border-l-2 pl-4">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{c.role === 'admin' ? 'Support' : 'You'}</div>
                        <div className="text-xs text-muted-foreground">{c.created_at ? new Date(c.created_at).toLocaleString() : ''}</div>
                      </div>
                      <p className="mt-1 whitespace-pre-wrap text-sm">{c.message}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Box */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Add a reply</h3>
                  <Textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your message…"
                    rows={4}
                  />
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Paperclip className="h-4 w-4" /> Attachments coming soon
                    </div>
                    <Button onClick={handlePostReply} disabled={posting || !reply.trim()}>
                      {posting ? 'Posting…' : 'Post Reply'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Sidebar Details */}
          <div className="lg:col-span-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ticket Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Status</span><StatusBadge status={ticket?.status} /></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Priority</span><PriorityBadge priority={ticket?.priority} /></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Department</span><span>{ticket?.department || '—'}</span></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Service</span><span>{(ticket as any)?.related_service || '—'}</span></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Created</span><span>{createdAt || '—'}</span></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {Array.isArray((ticket as any)?.attachments) && (ticket as any).attachments.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {(ticket as any).attachments.map((a: any) => (
                      <li key={a.id}>
                        <a className="underline" href={a.file_url} target="_blank" rel="noreferrer">{a.filename || 'Attachment'}</a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-muted-foreground">No attachments</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TradingLayout>
  );
}

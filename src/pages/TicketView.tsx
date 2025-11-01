import { useEffect, useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { TradingLayout } from "@/components/layout/TradingLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { showApiError } from "@/lib/ui/errorToast";
import { fetchTicketById, createTicketComment, type TicketDTO, type TicketCommentDTO } from "@/lib/api/support";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { 
  Paperclip, 
  ArrowLeft, 
  Clock, 
  Calendar, 
  User, 
  CheckCircle2, 
  XCircle, 
  Share2,
  MessageSquare,
  FileText
} from "lucide-react";

function formatId(id: number | string | undefined) {
  if (id == null) return "";
  const n = typeof id === 'number' ? id : parseInt(String(id).replace(/\D/g, ''), 10);
  return isNaN(n) ? `TKT-${String(id)}` : `TKT-${String(n).padStart(4, '0')}`;
}

function getTimeAgo(dateString?: string): string {
  if (!dateString) return '—';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
}

function StatusBadge({ status }: { status?: string }) {
  const s = String(status || 'open').toLowerCase();
  let label = 'Open';
  let className = 'bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20';
  
  if (s === 'closed') {
    label = 'Closed';
    className = 'bg-gray-500/10 text-gray-500 border-gray-500/20 hover:bg-gray-500/20';
  } else if (s.includes('progress')) {
    label = 'In Progress';
    className = 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20';
  } else if (s === 'resolved') {
    label = 'Resolved';
    className = 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20';
  }
  
  return <Badge variant="outline" className={className}>{label}</Badge>;
}

function PriorityBadge({ priority }: { priority?: string }) {
  const p = String(priority || 'low').toLowerCase();
  let className = 'bg-gray-500/10 text-gray-500 border-gray-500/20 hover:bg-gray-500/20';
  let label = 'Low';
  
  if (p === 'urgent') {
    className = 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20';
    label = 'URGENT';
  } else if (p === 'high') {
    className = 'bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20';
    label = 'High';
  } else if (p === 'medium') {
    className = 'bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20';
    label = 'Medium';
  }
  
  return <Badge variant="outline" className={className}>{label}</Badge>;
}

function DepartmentBadge({ department }: { department?: string }) {
  if (!department) return null;
  const className = 'bg-purple-500/10 text-purple-500 border-purple-500/20 hover:bg-purple-500/20';
  return <Badge variant="outline" className={className}>{department}</Badge>;
}

export default function TicketView() {
  const [, params] = useRoute("/help/tickets/:id");
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const ticketId = params?.id as string | undefined;

  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<TicketDTO & { comments?: TicketCommentDTO[]; attachments?: any[]; updated_at?: string } | null>(null);
  const [comments, setComments] = useState<TicketCommentDTO[]>([]);
  const [reply, setReply] = useState("");
  const [posting, setPosting] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);

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
        setComments(Array.isArray(embedded) ? embedded.slice().reverse() : []);
      } catch (e: any) {
        showApiError(e, { title: 'Failed to load ticket', defaultMessage: 'Failed to load ticket. Please try again.' });
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [ticketId]);

  const createdAt = useMemo(() => {
    if (!ticket?.created_at) return '';
    const d = new Date(ticket.created_at);
    return d.toLocaleString();
  }, [ticket]);

  const updatedAt = useMemo(() => {
    if (!ticket?.updated_at) return createdAt;
    const d = new Date(ticket.updated_at);
    return d.toLocaleString();
  }, [ticket, createdAt]);

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
      toast({ title: 'Reply posted successfully' });
    } catch (e: any) {
      showApiError(e, { title: 'Failed to post reply', defaultMessage: 'Failed to post reply. Please try again.' });
    } finally {
      setPosting(false);
    }
  };

  const handleShareTicket = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast({ title: 'Link copied!', description: 'Ticket link copied to clipboard' });
    }).catch(() => {
      toast({ title: 'Failed to copy', description: 'Could not copy link to clipboard', variant: 'destructive' });
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const isTicketClosed = ticket?.status?.toLowerCase() === 'closed';
  const isTicketResolved = ticket?.status?.toLowerCase() === 'resolved';

  return (
    <TradingLayout>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Button
          variant="ghost"
          className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/help')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Support
        </Button>

        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge className="text-xs font-mono bg-gradient-to-r from-blue-600 to-purple-600">
                  {formatId(ticket?.id)}
                </Badge>
                <StatusBadge status={ticket?.status} />
                <PriorityBadge priority={ticket?.priority} />
                <DepartmentBadge department={ticket?.department} />
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {ticket?.subject || (loading ? 'Loading ticket...' : 'Ticket Details')}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>Created {getTimeAgo(ticket?.created_at)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>Updated {getTimeAgo(ticket?.updated_at || ticket?.created_at)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareTicket}
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              {!isTicketClosed && !isTicketResolved && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCloseDialog(true)}
                  className="gap-2 text-green-600 border-green-600/20 hover:bg-green-600/10"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Mark as Resolved
                </Button>
              )}
              {isTicketClosed && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-blue-600 border-blue-600/20 hover:bg-blue-600/10"
                >
                  Reopen Ticket
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <Card className="shadow-lg border-border/50">
              <CardHeader className="border-b bg-gradient-to-r from-card to-card/50">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <CardTitle>Conversation</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">You</span>
                          <Badge variant="outline" className="text-xs">Author</Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">{getTimeAgo(ticket?.created_at)}</span>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4 border">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{ticket?.message || 'No message content'}</p>
                      </div>
                    </div>
                  </div>

                  {comments.length > 0 && (
                    <>
                      <Separator className="my-6" />
                      <div className="space-y-6">
                        {comments.map((c) => {
                          const isAdmin = c.role === 'admin' || c.role === 'support' || c.role === 'staff';
                          return (
                            <div key={String(c.id)} className="flex gap-4">
                              <Avatar className={`h-10 w-10 border-2 ${isAdmin ? 'border-orange-500/20' : 'border-primary/20'}`}>
                                <AvatarFallback className={isAdmin 
                                  ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white font-semibold' 
                                  : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold'
                                }>
                                  {getInitials(c.author || (isAdmin ? 'Support' : 'User'))}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold">{c.author || (isAdmin ? 'Support Team' : 'You')}</span>
                                    {isAdmin && <Badge className="text-xs bg-gradient-to-r from-orange-500 to-red-600">Staff</Badge>}
                                  </div>
                                  <span className="text-xs text-muted-foreground">{getTimeAgo(c.created_at)}</span>
                                </div>
                                <div className={`rounded-lg p-4 border ${
                                  isAdmin 
                                    ? 'bg-orange-500/5 border-orange-500/20' 
                                    : 'bg-muted/50'
                                }`}>
                                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{c.message}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {!isTicketClosed && (
                    <>
                      <Separator className="my-6" />
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Add your reply
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            {reply.length} / 2000 characters
                          </span>
                        </div>
                        <Textarea
                          value={reply}
                          onChange={(e) => setReply(e.target.value.slice(0, 2000))}
                          placeholder="Type your message here..."
                          rows={5}
                          className="resize-none"
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Paperclip className="h-4 w-4" />
                            <span>File attachments coming soon</span>
                          </div>
                          <Button 
                            onClick={handlePostReply} 
                            disabled={posting || !reply.trim()}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            {posting ? 'Posting...' : 'Post Reply'}
                          </Button>
                        </div>
                      </div>
                    </>
                  )}

                  {isTicketClosed && (
                    <div className="mt-6 p-4 bg-muted/50 rounded-lg border text-center">
                      <XCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        This ticket is closed. Reopen it to add more replies.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Card className="shadow-lg border-border/50">
              <CardHeader className="border-b bg-gradient-to-r from-card to-card/50">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle>Ticket Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Status</span>
                    <StatusBadge status={ticket?.status} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Priority</span>
                    <PriorityBadge priority={ticket?.priority} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Department</span>
                    <span className="font-medium">{ticket?.department || 'General'}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Service</span>
                    <span className="font-medium">{(ticket as any)?.related_service || '—'}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Created</span>
                    <span className="font-medium text-xs">{createdAt || '—'}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Last Updated</span>
                    <span className="font-medium text-xs">{updatedAt || '—'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-border/50">
              <CardHeader className="border-b bg-gradient-to-r from-card to-card/50">
                <div className="flex items-center gap-2">
                  <Paperclip className="h-5 w-5 text-primary" />
                  <CardTitle>Attachments</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {Array.isArray((ticket as any)?.attachments) && (ticket as any).attachments.length > 0 ? (
                  <div className="space-y-2">
                    {(ticket as any).attachments.map((a: any, idx: number) => (
                      <a
                        key={a.id || idx}
                        className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 transition-colors text-sm group"
                        href={a.file_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Paperclip className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                        <span className="text-muted-foreground group-hover:text-foreground truncate">
                          {a.filename || `Attachment ${idx + 1}`}
                        </span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Paperclip className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">No attachments</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AlertDialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark ticket as resolved?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark your ticket as resolved. You can reopen it later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                toast({ title: 'Feature coming soon', description: 'Ticket status update will be available soon.' });
                setShowCloseDialog(false);
              }}
            >
              Mark as Resolved
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TradingLayout>
  );
}

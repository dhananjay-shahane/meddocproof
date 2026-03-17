"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Send,
  MessageSquare,
  Phone,
  User,
  CheckCheck,
  Check,
  Loader2,
  FileText,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useAdminWhatsApp } from "@/hooks/use-admin-whatsapp";
import type { WhatsAppConversation, WhatsAppTemplate } from "@/types";

export default function WhatsAppChatPage() {
  const { conversations, templates, loading, sending, sendMessage } =
    useAdminWhatsApp();
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [showMobileChat, setShowMobileChat] = useState(false);

  const selectedConversation = conversations.find(
    (c) => c.phoneNumber === selectedPhone
  );

  // Filter conversations by search
  const filteredConversations = conversations.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.phoneNumber.includes(q) ||
      (c.userName && c.userName.toLowerCase().includes(q))
    );
  });

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation?.messages.length]);

  const handleSend = async () => {
    if (!messageText.trim() || !selectedPhone) return;
    const success = await sendMessage({
      phoneNumber: selectedPhone,
      message: messageText.trim(),
      userId: selectedConversation?.userId || undefined,
    });
    if (success) {
      setMessageText("");
    } else {
      toast.error("Failed to send message");
    }
  };

  const handleTemplateSelect = (template: WhatsAppTemplate) => {
    setMessageText(template.body);
    setShowTemplates(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">WhatsApp Chat</h2>
        <p className="text-muted-foreground">
          Manage WhatsApp conversations and templates.
        </p>
      </div>

      <div className="flex h-[calc(100vh-220px)] min-h-[500px] overflow-hidden rounded-xl border bg-card shadow-sm">
        {/* Left sidebar — Conversation list */}
        <div className={`flex flex-col border-r w-full lg:w-80 lg:flex ${showMobileChat ? "hidden lg:flex" : "flex"}`}>
          {/* Search */}
          <div className="border-b p-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm"
              />
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageSquare className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? "No matching conversations" : "No conversations yet"}
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <ConversationItem
                  key={conv.phoneNumber}
                  conversation={conv}
                  isSelected={selectedPhone === conv.phoneNumber}
                  onClick={() => {
                    setSelectedPhone(conv.phoneNumber);
                    setShowMobileChat(true);
                  }}
                />
              ))
            )}
          </div>
        </div>

        {/* Right side — Chat area */}
        <div className={`flex-col flex-1 ${showMobileChat ? "flex" : "hidden lg:flex"}`}>
          {selectedConversation ? (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 border-b px-4 py-3">
                <button
                  onClick={() => setShowMobileChat(false)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-muted lg:hidden"
                  title="Back to conversations"
                >
                  <ChevronDown className="h-5 w-5 rotate-90" />
                </button>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    {selectedConversation.userName || selectedConversation.phoneNumber}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {selectedConversation.phoneNumber}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {selectedConversation.messages.length} messages
                </span>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto bg-muted/20 p-4">
                <div className="mx-auto max-w-2xl space-y-3">
                  {selectedConversation.messages.map((msg) => {
                    const isOutgoing = msg.direction === "outgoing";
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                            isOutgoing
                              ? "rounded-br-md bg-green-600 text-white"
                              : "rounded-bl-md bg-background shadow-sm"
                          }`}
                        >
                          <p className="whitespace-pre-wrap text-sm">{msg.message}</p>
                          <div
                            className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                              isOutgoing ? "text-green-100" : "text-muted-foreground"
                            }`}
                          >
                            <span>{format(new Date(msg.createdAt), "h:mm a")}</span>
                            {isOutgoing && (
                              <>
                                {msg.status === "delivered" || msg.status === "read" ? (
                                  <CheckCheck className="h-3 w-3" />
                                ) : (
                                  <Check className="h-3 w-3" />
                                )}
                              </>
                            )}
                          </div>
                          {msg.templateName && (
                            <p
                              className={`mt-0.5 text-[10px] ${
                                isOutgoing ? "text-green-200" : "text-muted-foreground"
                              }`}
                            >
                              Template: {msg.templateName}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message input */}
              <div className="border-t p-3">
                {/* Template dropdown */}
                {showTemplates && templates.length > 0 && (
                  <div className="mb-2 max-h-40 overflow-y-auto rounded-lg border bg-background p-2 shadow-lg">
                    {templates.map((tpl) => (
                      <button
                        key={tpl.id}
                        onClick={() => handleTemplateSelect(tpl)}
                        className="flex w-full items-start gap-2 rounded-md p-2 text-left hover:bg-muted"
                      >
                        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{tpl.displayName}</p>
                          <p className="line-clamp-1 text-xs text-muted-foreground">
                            {tpl.body}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex items-end gap-2">
                  <button
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                    title="Templates"
                  >
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${showTemplates ? "rotate-180" : ""}`}
                    />
                  </button>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    rows={1}
                    className="max-h-24 min-h-[40px] flex-1 resize-none rounded-2xl border bg-background px-4 py-2.5 text-sm"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!messageText.trim() || sending}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {sending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Empty state */
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <MessageSquare className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold">WhatsApp Chat</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Select a conversation from the sidebar to view messages and send
                replies.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function ConversationItem({
  conversation,
  isSelected,
  onClick,
}: {
  conversation: WhatsAppConversation;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60 ${
        isSelected ? "bg-muted" : ""
      }`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
        <User className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="truncate text-sm font-medium">
            {conversation.userName || conversation.phoneNumber}
          </p>
          <span className="ml-2 shrink-0 text-[10px] text-muted-foreground">
            {format(new Date(conversation.lastMessageAt), "MMM d")}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="truncate text-xs text-muted-foreground">
            {conversation.lastMessage}
          </p>
          {conversation.unreadCount > 0 && (
            <span className="ml-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold text-white">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

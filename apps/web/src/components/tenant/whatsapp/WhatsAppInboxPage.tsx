"use client";

import { useMemo, useState } from "react";
import { MessageCircle, Search, Send } from "lucide-react";
import type { WhatsAppConversation, WhatsAppMessage } from "@leadpro/types";
import {
  useSendWhatsAppMessage,
  useWhatsAppConversations,
  useWhatsAppMessages,
} from "@/hooks/useSettings";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

export function WhatsAppInboxPage() {
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string>();
  const [draft, setDraft] = useState("");
  const { data, isLoading, isError } = useWhatsAppConversations(search);
  const conversations: WhatsAppConversation[] = useMemo(
    () => data?.data ?? data ?? [],
    [data],
  );
  const active = useMemo(
    () => conversations.find((conversation) => conversation.id === activeId),
    [activeId, conversations],
  );
  const { data: messageData, isLoading: loadingMessages } =
    useWhatsAppMessages(activeId);
  const messages: WhatsAppMessage[] = messageData?.data ?? messageData ?? [];
  const { mutate: sendMessage, isPending } = useSendWhatsAppMessage(activeId);

  const send = () => {
    const text = draft.trim();
    if (!text || !activeId) return;
    sendMessage({ text }, { onSuccess: () => setDraft("") });
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] overflow-hidden rounded-xl border border-slate-200 bg-white">
      <aside className="w-80 shrink-0 border-r border-slate-200">
        <div className="border-b border-slate-200 p-4">
          <h1 className="text-lg font-semibold text-slate-900">WhatsApp inbox</h1>
          <p className="mb-3 text-xs text-slate-400">
            Chat with prospects from connected business numbers
          </p>
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search conversations"
              className="pl-8"
            />
          </div>
        </div>
        <ScrollArea className="h-[calc(100%-7.5rem)]">
          {isLoading && <InboxNote>Loading conversations...</InboxNote>}
          {isError && <InboxNote>Unable to load conversations.</InboxNote>}
          {!isLoading && !isError && conversations.length === 0 && (
            <InboxNote>No conversations yet.</InboxNote>
          )}
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setActiveId(conversation.id)}
              className={`flex w-full gap-3 border-b border-slate-100 p-4 text-left hover:bg-slate-50 ${
                activeId === conversation.id ? "bg-green-50" : ""
              }`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-700">
                {conversation.prospectName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-2">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {conversation.prospectName}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <span className="rounded-full bg-green-600 px-1.5 text-[10px] text-white">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-slate-400">
                  {conversation.lastMessage ?? conversation.prospectPhone}
                </p>
              </div>
            </button>
          ))}
        </ScrollArea>
      </aside>

      {!active ? (
        <div className="flex flex-1 flex-col items-center justify-center text-slate-400">
          <MessageCircle className="mb-3 h-10 w-10" />
          <p className="text-sm">Select a conversation to start chatting</p>
        </div>
      ) : (
        <section className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-slate-200 px-5 py-3">
            <p className="font-medium text-slate-900">{active.prospectName}</p>
            <p className="text-xs text-slate-400">
              {active.prospectPhone} · via {active.phoneNumber ?? "WhatsApp"}
            </p>
          </header>
          <ScrollArea className="flex-1 bg-[#efeae2] p-5">
            {loadingMessages && <InboxNote>Loading messages...</InboxNote>}
            <div className="space-y-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.direction === "outbound"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[72%] rounded-lg px-3 py-2 text-sm shadow-sm ${
                      message.direction === "outbound"
                        ? "bg-[#d9fdd3]"
                        : "bg-white"
                    }`}
                  >
                    <p>{message.text ?? `[${message.type}]`}</p>
                    <p className="mt-1 text-right text-[10px] text-slate-400">
                      {new Date(message.sentAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      · {message.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <footer className="border-t border-slate-200 p-3">
            {!active.canSendFreeform && (
              <p className="mb-2 text-xs text-amber-700">
                The 24-hour customer-service window is closed. Send an approved
                template to reopen the conversation.
              </p>
            )}
            <div className="flex items-end gap-2">
              <Textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Type a message"
                disabled={!active.canSendFreeform || isPending}
                className="min-h-10"
              />
              <Button
                size="icon-lg"
                onClick={send}
                disabled={!active.canSendFreeform || isPending || !draft.trim()}
                aria-label="Send WhatsApp message"
              >
                <Send />
              </Button>
            </div>
          </footer>
        </section>
      )}
    </div>
  );
}

function InboxNote({ children }: { children: React.ReactNode }) {
  return <p className="p-4 text-sm text-slate-400">{children}</p>;
}

"use client";

import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { FC, HTMLAttributes, KeyboardEvent, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Message } from "@/lib/validators/message";

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {
  className: string;
}

const ChatInput: FC<ChatInputProps> = ({ className, ...props }) => {
  const [input, setInput] = useState<string>("");

  const { mutate: sendMessage } = useMutation({
    mutationFn: async (message: Message) => {
      const response = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({ messages: [message] }),
        headers: { "Content-Type": "application/json" },
      });

      return response.body;
    },
    onSuccess: async stream => {
      if (!stream) throw new Error("No stream data!");

      const reader = stream.getReader();

      const decoder = new TextDecoder();

      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        console.log(value);

        done = doneReading;

        const chunkValue = decoder.decode(value);

        console.log(chunkValue);
      }
    },
  });

  const keydownHandler = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      const message = {
        id: nanoid(),
        isUserMessage: true,
        text: input,
      };

      sendMessage(message);
    }
  };

  return (
    <div {...props} className={cn("border-t border-zinc-300", className)}>
      <div className="relative mt-4 flex-1 overflow-hidden rounded-lg border-none outline-none">
        <TextareaAutosize
          rows={2}
          maxRows={4}
          onKeyDown={keydownHandler}
          autoFocus
          placeholder="Write a message..."
          className="peer disabled:opacity-50 pr-14 resize-none block w-full border-0 outline-0 bg-zinc-100 py-1.5 pl-3 text-gray-900 text-sm leading-6 font-medium"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ChatInput;

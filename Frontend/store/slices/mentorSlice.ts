import { StateCreator } from "zustand";
import { mentorApi } from "../../lib/api/mentor";

export interface Message {
  role: "user" | "ai";
  content: string;
}

export interface MentorSlice {
  messages: Message[];
  isMentorLoading: boolean;
  mentorError: string | null;
  askMentor: (context: string, question: string) => Promise<void>;
  clearChat: () => void;
}

export const mentorSlice: StateCreator<MentorSlice> = (set, get) => ({
  messages: [],
  isMentorLoading: false,
  mentorError: null,

  askMentor: async (context, question) => {
    set({
      isMentorLoading: true,
      mentorError: null,
      messages: [...get().messages, { role: "user", content: question }],
    });
    try {
      const response = await mentorApi.explain(context, question);
      set({
        messages: [
          ...get().messages,
          { role: "ai", content: response.explanation || response.answer },
        ],
        isMentorLoading: false,
      });
    } catch (error: any) {
      set({
        messages: [
          ...get().messages,
          {
            role: "ai",
            content:
              error.response?.data?.message || "Mentor failed to respond",
          },
        ],
        mentorError:
          error.response?.data?.message || "Mentor failed to respond",
        isMentorLoading: false,
      });
    }
  },

  clearChat: () => set({ messages: [] }),
});

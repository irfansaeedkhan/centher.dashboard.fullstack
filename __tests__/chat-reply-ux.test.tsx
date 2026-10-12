/**
 * Chat reply UX regressions (Irfan 2026-10-12):
 * - quoted reply preview must be readable in the dark theme
 * - ReplyPreview must be an obviously interactive button that jumps to the
 *   quoted message with its id
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { ReplyPreview } from "@/pages/chat/_components/message/message-content";

describe("chat reply UX", () => {
  const reply = {
    id: "msg-123",
    body: "New proposal is up for voting",
    kind: "text",
    sender_name: "Centher Demo",
  };

  it("ReplyPreview renders as an interactive button", () => {
    render(<ReplyPreview reply={reply} mine={false} />);
    const btn = screen.getByRole("button", {
      name: "Jump to message from Centher Demo",
    });
    expect(btn.tagName).toBe("BUTTON");
    expect(btn.className).toContain("cursor-pointer");
  });

  it("clicking ReplyPreview calls onReplyClick with the quoted id", () => {
    const onReplyClick = jest.fn();
    render(
      <ReplyPreview reply={reply} mine={false} onReplyClick={onReplyClick} />
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Jump to message from Centher Demo" })
    );
    expect(onReplyClick).toHaveBeenCalledTimes(1);
    expect(onReplyClick).toHaveBeenCalledWith("msg-123");
  });

  it("quoted body uses the readable dark-theme text color", () => {
    const { container } = render(<ReplyPreview reply={reply} mine={false} />);
    const body = container.querySelector("button > p:last-child");
    expect(body?.className).toContain("text-white/70");
    expect(body?.className).not.toContain("text-gray-shade-7");
  });
});

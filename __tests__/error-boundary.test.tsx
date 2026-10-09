/**
 * Phase 1 regression test: a single component crash must not take down the
 * whole app. (The post-login first-paint crash — a wrong-shaped user object
 * seeded into SWR — rendered Next.js "Application error" for the entire page.)
 */
import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorBoundary } from "@/components/error-boundary";

const Boom: React.FC = () => {
  throw new Error("simulated render crash");
};

const Healthy: React.FC = () => <div>healthy content</div>;

// jsdom prints React error logs; silence them for the throwing test.
const silenceConsole = () => {
  const err = console.error;
  beforeEach(() => {
    console.error = jest.fn();
  });
  afterEach(() => {
    console.error = err;
  });
};

describe("ErrorBoundary", () => {
  silenceConsole();

  test("renders children normally when nothing throws", () => {
    render(
      <ErrorBoundary>
        <Healthy />
      </ErrorBoundary>
    );
    expect(screen.getByText("healthy content")).toBeInTheDocument();
  });

  test("catches a crashing child and renders the fallback instead", () => {
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );
    // The crash is contained: fallback UI shows, no full-app error.
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reload" })).toBeInTheDocument();
    expect(screen.queryByText("healthy content")).not.toBeInTheDocument();
  });

  test("renders a custom fallback when provided", () => {
    render(
      <ErrorBoundary fallback={<div>custom fallback</div>}>
        <Boom />
      </ErrorBoundary>
    );
    expect(screen.getByText("custom fallback")).toBeInTheDocument();
  });

  test("reload button refreshes the page", () => {
    const reload = jest.fn();
    Object.defineProperty(window, "location", {
      value: { ...window.location, reload },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole("button", { name: "Reload" }));
    expect(reload).toHaveBeenCalledTimes(1);
  });
});

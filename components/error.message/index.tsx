// React, Next, NPM Packages
import React from "react";

interface ErrorMessageProps {
  message?: string;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  className = "",
}) => {
  if (!message) return null;

  return <p className={`text-danger ${className}`}>{message}</p>;
};

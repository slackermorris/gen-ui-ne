import { useState } from "react";

export const useShowErrorBoundary = () => {
  const [error, setError] = useState(null);

  if (error) {
    throw error;
  }

  return setError;
}

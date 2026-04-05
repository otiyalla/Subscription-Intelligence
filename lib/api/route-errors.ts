import { ZodError } from "zod";

type RouteErrorDetails = {
  message: string;
  status: number;
};

export function getRouteErrorDetails(
  error: unknown,
  fallbackMessage: string,
): RouteErrorDetails {
  if (error instanceof ZodError) {
    return {
      message: "Invalid request payload.",
      status: 400,
    };
  }

  if (error instanceof Error) {
    if (error.message.startsWith("RevenueCat request failed with")) {
      return {
        message: error.message,
        status: 502,
      };
    }

    return {
      message: error.message,
      status: 500,
    };
  }

  return {
    message: fallbackMessage,
    status: 500,
  };
}

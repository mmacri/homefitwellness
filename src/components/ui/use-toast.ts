
// Re-export from the hooks directory
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";

// Combined toast API that offers both shadcn/ui toast and sonner toast
const toast = {
  // Original toast methods
  ...useToast().toast,
  // Add sonner toast variants
  success: (message: string, options?: any) => sonnerToast.success(message, options),
  error: (message: string, options?: any) => sonnerToast.error(message, options),
  info: (message: string, options?: any) => sonnerToast.info(message, options),
  warning: (message: string, options?: any) => sonnerToast.warning(message, options),
};

export { useToast, toast };

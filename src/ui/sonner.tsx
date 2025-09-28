import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import { toasterConfig } from "./sonner-config";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className={toasterConfig.className}
      toastOptions={toasterConfig.toastOptions}
      {...props}
    />
  );
};

export { Toaster };

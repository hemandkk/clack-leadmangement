import { CheckCircle2, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const REQUIREMENTS = [
  "A Meta Business Portfolio with admin access",
  "A Meta developer app with the WhatsApp product enabled",
  "A WhatsApp Business Account and at least one phone number",
  "A permanent system-user access token stored securely on your server",
];

export function WhatsAppPrerequisites() {
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <AlertDescription className="space-y-3 text-xs text-blue-800">
        <p className="font-semibold">Before you connect your account</p>
        <ul className="space-y-2">
          {REQUIREMENTS.map((requirement) => (
            <li key={requirement} className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600" />
              <span>{requirement}</span>
            </li>
          ))}
        </ul>
        <a
          href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium underline"
        >
          Open Meta Cloud API setup guide <ExternalLink className="h-3 w-3" />
        </a>
      </AlertDescription>
    </Alert>
  );
}

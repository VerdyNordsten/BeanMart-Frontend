import { ContactHero } from "@/features/contact/ContactHero";
import { ContactForm } from "@/features/contact/ContactForm";
import { ContactInfo } from "@/features/contact/ContactInfo";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <ContactHero />

      <div className="container max-w-screen-2xl py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <ContactForm />
          </div>
          <ContactInfo />
        </div>
      </div>
    </div>
  );
}
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import { getSettings, getSchedule, s } from "@/lib/settings";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  const footerProps = {
    schedule: getSchedule(settings),
    whatsapp: s(settings, "whatsapp_number", "+213054247224"),
    instagram: s(settings, "instagram_url"),
    facebook: s(settings, "facebook_url"),
    tiktok: s(settings, "tiktok_url"),
  };

  const whatsappNumber = s(settings, "whatsapp_number", "+213054247224");

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer {...footerProps} />
      <WhatsAppButton number={whatsappNumber} />
    </>
  );
}

import { ConfigAside } from "@/app/components/aside/configuration-aside";

export default function ConfigurationsPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="h-full w-full flex flex-1 max-h-[calc(100dvh_-_69px)] items-stretch">
        <ConfigAside />
        <section className="flex-1 bg-white max-h-[calc(100dvh_-_69px)] h-full overflow-y-auto">
          {children}
        </section>
      </div>
    </>
  );
}

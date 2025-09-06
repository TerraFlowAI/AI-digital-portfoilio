import { HeaderNav } from '@/components/portfolio/header-nav';
import { ContactFooter } from '@/components/portfolio/contact-footer';
import { ContactSection } from '@/components/portfolio/contact-section';

export default function Home() {
  return (
    <div className="bg-neutral-950 text-white">
      <HeaderNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <section className="text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter mb-4">
            A New Beginning
          </h1>
          <p className="text-lg sm:text-xl text-neutral-400 max-w-3xl mx-auto">
            This is a placeholder for your new home page. You can start building your amazing application from here.
          </p>
        </section>
        <ContactSection />
      </main>
      <ContactFooter />
    </div>
  );
}

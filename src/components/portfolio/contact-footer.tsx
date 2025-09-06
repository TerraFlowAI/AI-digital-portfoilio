import { Linkedin, Twitter, Dribbble, Github, Mail, Calendar, Handshake, Globe } from 'lucide-react';

interface ContactFooterProps {
  quote?: string;
  author?: string;
}

export function ContactFooter({ quote = '“The details are not the details.<br /> <span class="text-white/70">They make </span><span class="text-yellow-500">the </span><span class="text-orange-500">design.”</span>', author = '— Charles Eames' }: ContactFooterProps) {
    return (
        <footer className="mt-20">
            <p className="text-center text-sm text-stone-400">&copy; {new Date().getFullYear()} Shamanth. All rights reserved.</p>
        </footer>
    );
}

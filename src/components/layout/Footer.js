import Link from 'next/link';
import { FaFacebook, FaInstagram, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-accent-dark text-white">
      <div className="container-wide py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Health, Healing, and Hope</h3>
            <p className="mb-4">
              Join me as I catalog my journey of health, healing, and hope. Find paleo, gluten-free, refined sugar-free, 
              and egg-free recipes along with wellness tips for your own health journey.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="https://www.facebook.com/h3withlaura" icon={<FaFacebook size={20} />} label="Facebook" />
              <SocialLink href="https://www.instagram.com/lauramsanders" icon={<FaInstagram size={20} />} label="Instagram" />
              <SocialLink href="mailto:laura@h3withlaura.com" icon={<FaEnvelope size={20} />} label="Email" />
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink href="/" label="Home" />
              <FooterLink href="/recipes" label="Recipes" />
              <FooterLink href="/topics" label="Topics" />
              <FooterLink href="/recommended-items" label="Recommended Items" />
              <FooterLink href="/about" label="About Me" />
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Popular Categories</h3>
            <ul className="space-y-2">
              <FooterLink href="/topics/paleo" label="Paleo" />
              <FooterLink href="/topics/desserts" label="Desserts" />
              <FooterLink href="/topics/gluten-free" label="Gluten Free" />
              <FooterLink href="/topics/topic-tuesday" label="Topic Tuesday" />
              <FooterLink href="/topics/tip-thursday" label="Tip Thursday" />
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} Health, Healing, and Hope with Laura. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon, label }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-white hover:text-accent-light transition-colors"
      aria-label={label}
    >
      {icon}
    </a>
  );
}

function FooterLink({ href, label }) {
  return (
    <li>
      <Link href={href} className="text-white hover:text-accent-light transition-colors">
        {label}
      </Link>
    </li>
  );
} 
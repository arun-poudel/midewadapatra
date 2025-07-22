// components/ui/footer.tsx
import Link from "next/link";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4">
                <span className="text-black font-bold text-xl">e</span>
              </div>
              <h3 className="text-xl font-bold mb-2">eWadapatra</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                डिजिटल सरकारी सेवा प्लेटफर्म - सबै सरकारी र निजी सेवाहरूको जानकारी एकै ठाउँमा।
              </p>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Phone className="h-4 w-4" />
                <span>+977-1-XXXXXXX</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Mail className="h-4 w-4" />
                <span>info@ewadapatra.gov.np</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>काठमाडौं, नेपाल</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/" className="block text-gray-300 hover:text-white transition-colors text-sm">
                गृह पृष्ठ
              </Link>
              <Link href="/government" className="block text-gray-300 hover:text-white transition-colors text-sm">
                सरकारी सेवाहरू
              </Link>
              <Link href="/about" className="block text-gray-300 hover:text-white transition-colors text-sm">
                हाम्रो बारेमा
              </Link>
              <Link href="/contact" className="block text-gray-300 hover:text-white transition-colors text-sm">
                सम्पर्क
              </Link>
              <Link href="/help" className="block text-gray-300 hover:text-white transition-colors text-sm">
                सहायता
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">सेवाहरू</h4>
            <div className="space-y-2">
              <Link href="/government" className="block text-gray-300 hover:text-white transition-colors text-sm">
                जिल्ला प्रशासन कार्यालय
              </Link>
              <Link href="/government" className="block text-gray-300 hover:text-white transition-colors text-sm">
                वडा कार्यालय
              </Link>
              <Link href="/government" className="block text-gray-300 hover:text-white transition-colors text-sm">
                नगरपालिका
              </Link>
              <Link href="/government" className="block text-gray-300 hover:text-white transition-colors text-sm">
                बैंक तथा वित्तीय संस्था
              </Link>
              <Link href="/government" className="block text-gray-300 hover:text-white transition-colors text-sm">
                शिक्षा संस्थान
              </Link>
            </div>
          </div>

          {/* Legal & Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">कानुनी</h4>
            <div className="space-y-2">
              <Link href="/privacy" className="block text-gray-300 hover:text-white transition-colors text-sm">
                गोपनीयता नीति
              </Link>
              <Link href="/terms" className="block text-gray-300 hover:text-white transition-colors text-sm">
                सेवाका सर्तहरू
              </Link>
              <Link href="/accessibility" className="block text-gray-300 hover:text-white transition-colors text-sm">
                पहुँच
              </Link>
              <Link href="/sitemap" className="block text-gray-300 hover:text-white transition-colors text-sm">
                साइट म्याप
              </Link>
              <Link href="/feedback" className="block text-gray-300 hover:text-white transition-colors text-sm">
                प्रतिक्रिया
              </Link>
            </div>
          </div>
        </div>

        {/* Government Links Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <h4 className="text-lg font-semibold mb-4">महत्वपूर्ण लिङ्कहरू</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Link 
              href="https://www.nepal.gov.np" 
              target="_blank"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
            >
              <span>Nepal.gov.np</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
            <Link 
              href="https://nagarikapp.com" 
              target="_blank"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
            >
              <span>Nagarik App</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
            <Link 
              href="https://nid.gov.np" 
              target="_blank"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
            >
              <span>राष्ट्रिय परिचयपत्र</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
            <Link 
              href="https://dop.gov.np" 
              target="_blank"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
            >
              <span>राहदानी विभाग</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
            <Link 
              href="https://ird.gov.np" 
              target="_blank"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
            >
              <span>आन्तरिक राजस्व</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
            <Link 
              href="https://ocmcm.gov.np" 
              target="_blank"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
            >
              <span>मुख्यमन्त्री कार्यालय</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © २०२५ eWadapatra. सबै अधिकार सुरक्षित। | 
              <span className="ml-2">
                Developed by <Link href="#" className="text-white hover:underline">Team eWadapatra</Link>
              </span>
            </div>
            
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-400">भाषा:</span>
              <button className="text-sm text-white hover:underline">नेपाली</button>
              <button className="text-sm text-gray-400 hover:text-white hover:underline">English</button>
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-xs text-gray-500 text-center">
              यो साइट नेपाल सरकारको डिजिटल नेपाल अभियानको भाग हो। 
              सबै सरकारी सेवाहरूको पारदर्शी र सहज पहुँचका लागि डिजाइन गरिएको।
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
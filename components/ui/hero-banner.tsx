// components/ui/hero-banner.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Users, Building2, FileText } from "lucide-react";
import Link from "next/link";

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Animation trigger
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Auto-sliding text
  const slides = [
    "सबै सरकारी सेवाहरू एकै ठाउँमा",
    "पारदर्शी र छिटो सेवा प्रदान",
    "डिजिटल नेपालको भविष्य",
    "सहज र सुरक्षित सेवा"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const stats = [
    { icon: Building2, label: "संस्थाहरू", value: "500+", color: "text-blue-600" },
    { icon: FileText, label: "सेवाहरू", value: "1000+", color: "text-green-600" },
    { icon: Users, label: "प्रयोगकर्ताहरू", value: "50K+", color: "text-purple-600" },
    { icon: MapPin, label: "स्थानहरू", value: "77", color: "text-orange-600" }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-[80vh]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-green-500 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-20 left-32 w-24 h-24 bg-purple-500 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-32 right-10 w-12 h-12 bg-orange-500 rounded-full animate-bounce delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="relative container mx-auto px-4 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Content */}
          <div className={`space-y-8 transition-all duration-1000 transform ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
          }`}>
            
            {/* Main Heading */}
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium animate-fade-in">
                🇳🇵 डिजिटल नेपाल
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  eWadapatra
                </span>
              </h1>
              
              {/* Animated Subtitle */}
              <div className="h-16 flex items-center">
                <p className="text-xl lg:text-2xl text-gray-600 font-medium">
                  {slides.map((slide, index) => (
                    <span
                      key={index}
                      className={`absolute transition-all duration-500 ${
                        index === currentSlide 
                          ? 'opacity-100 transform translate-y-0' 
                          : 'opacity-0 transform translate-y-4'
                      }`}
                    >
                      {slide}
                    </span>
                  ))}
                </p>
              </div>
              
              <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                नेपालको पहिलो एकीकृत डिजिटल सेवा प्लेटफर्म। सबै सरकारी र निजी संस्थाका सेवाहरूको 
                विस्तृत जानकारी, आवश्यक कागजातहरू र प्रक्रियाहरू एकै ठाउँमा।
              </p>
            </div>

            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild
                size="lg" 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl transform hover:scale-105 transition-all duration-200"
              >
                <Link href="/government">
                  सेवाहरू अन्वेषण गर्नुहोस्
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                asChild 
                className="px-8 py-4 rounded-xl hover:scale-105 transition-transform border-2"
              >
                <Link href="/about">
                  थप जान्नुहोस्
                </Link>
              </Button>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" asChild className="rounded-full hover:scale-105 transition-transform">
                <Link href="/government">
                  <Building2 className="mr-2 w-4 h-4" />
                  सरकारी सेवाहरू
                </Link>
              </Button>
              <Button variant="outline" asChild className="rounded-full hover:scale-105 transition-transform">
                <Link href="/help">
                  <FileText className="mr-2 w-4 h-4" />
                  सहायता केन्द्र
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Side - Visual */}
          <div className={`relative transition-all duration-1000 delay-300 transform ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
          }`}>
            
            {/* Main Visual Container */}
            <div className="relative">
              
              {/* Central Hub */}
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 transform hover:scale-105 transition-all duration-300">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center animate-pulse">
                    <span className="text-white font-bold text-2xl">e</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">eWadapatra</h3>
                  <p className="text-gray-600 text-sm">केन्द्रीकृत सेवा प्लेटफर्म</p>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-4 -left-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow-lg animate-float">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  <span className="text-sm font-medium">जिल्ला कार्यालय</span>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl shadow-lg animate-float delay-500">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span className="text-sm font-medium">वडा कार्यालय</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl shadow-lg animate-float delay-1000">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span className="text-sm font-medium">नगरपालिका</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl shadow-lg animate-float delay-700">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  <span className="text-sm font-medium">बैंक सेवा</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className={`mt-16 lg:mt-24 transition-all duration-1000 delay-700 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center group hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-lg group-hover:shadow-xl transition-shadow mb-4 ${stat.color}`}>
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" className="w-full h-20 fill-current text-white">
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </section>
  );
}
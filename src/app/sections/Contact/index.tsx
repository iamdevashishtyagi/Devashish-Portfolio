"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/src/app/data/profile";
import { Mail, MapPin, Send } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-item", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submit
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative isolate overflow-hidden section-layout"
    >
      <div className="contact-atmosphere" aria-hidden="true" />
      <div className="relative z-10 container-narrow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Section */}
          <div>
            <span className="text-sm uppercase tracking-widest text-gray-400">
              Contact
            </span>

            <h2 className="contact-heading-2 mt-4 mb-6">Let's build something</h2>

            <p className="body-large max-w-2xl mb-12 text-current">
              Got a project, a problem, or just want to talk systems? I'm
              always open to interesting conversations.
            </p>

            <div className="space-y-8">
              <div className="contact-item flex items-start gap-4">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="font-medium">{profile.location}</p>
                </div>
              </div>

              <a
                href={`mailto:${profile.email}`}
                className="contact-item flex items-start gap-4 hover:text-gray-300 transition-colors group"
              >
                <Mail className="w-5 h-5 text-gray-400 mt-1 group-hover:text-cream transition-colors" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="font-medium">{profile.email}</p>
                </div>
              </a>

              <div className="contact-item contact-divider flex gap-4 border-t pt-4">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social rounded-full p-3 transition-colors"
                >
                  <FaGithub className="w-5 h-5" />
                </a>

                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social rounded-full p-3 transition-colors"
                >
                  <FaLinkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <form onSubmit={handleSubmit} className="contact-item space-y-4">
            <div>
              <label className="contact-label mb-1 block text-sm">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="contact-field w-full rounded-lg border px-4 py-3 transition-colors focus:outline-none"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="contact-label mb-1 block text-sm">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="contact-field w-full rounded-lg border px-4 py-3 transition-colors focus:outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="contact-label mb-1 block text-sm">
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
                rows={4}
                className="contact-field w-full resize-none rounded-lg border px-4 py-3 transition-colors focus:outline-none"
                placeholder="Leave a message or Tell me about your project..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-cream text-charcoal rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                "Sending..."
              ) : isSubmitted ? (
                "Sent! 🎉"
              ) : (
                <>
                  Send message
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/src/app/data/profile";
import { Mail, MapPin, Send, CheckCircle } from "lucide-react";
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
  const [error, setError] = useState<string | null>(null);

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
    
    // Prevent submission if already submitted or submitting
    if (isSubmitted || isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const json = await res.json();
      
      if (res.ok && json?.success) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        setError(json?.error || "Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error("Contact submit error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setError(null);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative isolate overflow-hidden section-layout"
    >
      <div className="contact-atmosphere" aria-hidden="true">
        {CONTACT_STARS.map((star, index) => (
          <span
            key={index}
            className={`contact-star${star.bright ? " contact-star--bright" : ""}`}
            style={
              {
                left: star.left,
                top: star.top,
                width: star.size,
                height: star.size,
                animationDelay: star.delay,
                animationDuration: star.duration,
                "--star-min": star.min,
                "--star-max": star.max,
              } as React.CSSProperties
            }
          />
        ))}
        {SHOOTING_STARS.map((star, index) => (
          <span
            key={index}
            className="contact-shooting-star"
            style={
              {
                top: star.top,
                width: star.length,
                animationDelay: star.delay,
                animationDuration: star.duration,
                "--angle": star.angle,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <div className="relative z-10 container-narrow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Section */}
          <div>
            <span className="text-sm uppercase tracking-widest text-gray-400">
              Start a conversation
            </span>

            <h2 className="contact-heading-2 mt-4 mb-6">
              Have a system{" "}
              <span className="text-current/50">worth building?</span>
            </h2>

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

          {/* Right Section - Form */}
          <form onSubmit={handleSubmit} className="contact-item space-y-4">
            {isSubmitted ? (
              // Success state - show message with option to send another
              <div className="text-center py-8 space-y-4">
                <div className="flex justify-center">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold">Message Sent! 🎉</h3>
                <p className="text-gray-400">
                  Thanks for reaching out. I'll get back to you soon.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2 text-sm bg-cream/20 hover:bg-cream/30 rounded-lg transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              // Form fields
              <>
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                </div>

                {error && (
                  <div className="text-red-500 text-sm p-3 bg-red-500/10 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-cream text-charcoal rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-charcoal border-t-transparent rounded-full"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send message
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function pseudoRandom(seed: number) {
  // Deterministic 0..1 "random" value from an integer seed.
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const CONTACT_STARS = Array.from({ length: 46 }, (_, index) => {
  const r1 = pseudoRandom(index * 3.1 + 1);
  const r2 = pseudoRandom(index * 5.7 + 2);
  const r3 = pseudoRandom(index * 7.3 + 3);
  const r4 = pseudoRandom(index * 2.3 + 4);
  const r5 = pseudoRandom(index * 9.1 + 5);

  const bright = index % 5 === 0;
  const size = bright ? 2 + r3 * 1.5 : 1 + r3 * 1.2;

  return {
    left: `${(r1 * 100).toFixed(2)}%`,
    top: `${(r2 * 96).toFixed(2)}%`,
    size: `${size.toFixed(2)}px`,
    delay: `-${(r4 * 6).toFixed(2)}s`,
    duration: `${(2.2 + r5 * 3.6).toFixed(2)}s`,
    min: bright ? 0.25 : 0.1,
    max: bright ? 1 : 0.75,
    bright,
  };
});

const SHOOTING_STARS = Array.from({ length: 6 }, (_, index) => {
  const r1 = pseudoRandom(index * 4.4 + 11);
  const r2 = pseudoRandom(index * 6.6 + 12);
  const r3 = pseudoRandom(index * 8.8 + 13);
  const r4 = pseudoRandom(index * 3.3 + 14);

  return {
    top: `${(6 + r1 * 80).toFixed(2)}%`,
    angle: `${(32 + r2 * 20).toFixed(1)}deg`,
    length: `${(6 + r3 * 5).toFixed(1)}rem`,
    delay: `-${(r4 * 14).toFixed(2)}s`,
    duration: `${(9 + r4 * 8).toFixed(2)}s`,
  };
});
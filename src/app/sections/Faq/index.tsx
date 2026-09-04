"use client";

import { useState } from "react";
import { faqs } from "@/src/app/data/profile";
import { ChevronDown } from "lucide-react";

export default function Faq() {
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggleFaq = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section id="faq" className="section-layout border-t border-current/10">
      <div className="container-narrow">
        <div className="max-w-4xl">
          <span className="text-sm uppercase tracking-widest text-current/50">
            Frequently Asked Questions
          </span>
          <h2 className="heading-2 mt-2 mb-4 text-current transition-colors duration-700">
            SEARCH &amp; RECRUITER FAQ
          </h2>
          <p className="body-large text-current/60 mb-10 max-w-2xl">
            Direct answers to common questions regarding Devashish Tyagi&apos;s
            engineering experience, technical expertise, and project architecture.
          </p>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndices.includes(index);
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-current/10 bg-white/40 dark:bg-white/[0.03] backdrop-blur-sm overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    id={`faq-question-${index}`}
                    className="w-full flex items-center justify-between p-6 text-left font-medium text-lg text-current transition-colors hover:text-current/80 focus:outline-none"
                  >
                    <span className="pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 text-current/60 ${
                        isOpen ? "rotate-180 text-current" : ""
                      }`}
                    />
                  </button>

                  <div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    className={`px-6 transition-all duration-300 ease-in-out ${
                      isOpen ? "pb-6 opacity-100 max-h-96" : "max-h-0 opacity-0 overflow-hidden"
                    }`}
                  >
                    <p className="text-current/75 leading-relaxed text-base">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

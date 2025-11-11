"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { toast } from "react-hot-toast";
import { ArrowRight, Check, X } from "lucide-react";
import logoMain from "@/app/logo-main.png";
import Image from "next/image";

interface BetaWaitlistFormProps {
  onClose: () => void;
  preselectedSubject?: string | null;
}

const COUNTRIES = [
  "USA",
  "UK",
  "Canada",
  "India",
  "Philippines/ Indonesia",
  "Australia / New Zealand",
  "Middle East",
  "Rest of the World*",
];

const GRADES = [
  "Kindergarten",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9+",
];

const SUBJECTS = [
  { id: "coding", label: "Coding" },
  { id: "math", label: "Math" },
  { id: "ai", label: "Artificial Intelligence" },
  { id: "english", label: "English" },
  { id: "science", label: "Science" },
  { id: "other", label: "Other" },
];

export default function BetaWaitlistForm({
  onClose,
  preselectedSubject,
}: BetaWaitlistFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    kidsName: "",
    email: "",
    phone: "",
    country: "",
    grade: "",
    subject: preselectedSubject || "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!formData.kidsName.trim()) {
      toast.error("Please enter your kid's name");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    // Validate phone number (remove non-digits and check length)
    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    if (!formData.country) {
      toast.error("Please select a country");
      return;
    }
    if (!formData.grade) {
      toast.error("Please select a grade");
      return;
    }
    if (!formData.subject) {
      toast.error("Please select a subject");
      return;
    }

    setIsLoading(true);

    try {
      const currentUrl =
        typeof window !== "undefined" ? window.location.href : "";

      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parentName: formData.name.trim(),
          kidsName: formData.kidsName.trim(),
          email: formData.email.trim(),
          phone: phoneDigits,
          country: formData.country,
          grade: formData.grade,
          subject: formData.subject,
          currentUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      toast.success("Beta submission successful!");
      onClose();
      // Reset form
      setFormData({
        name: "",
        kidsName: "",
        email: "",
        phone: "",
        country: "",
        grade: "",
        subject: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit form. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubjectSelect = (subjectId: string) => {
    setFormData({
      ...formData,
      subject: subjectId,
    });
  };

  const handleCountrySelect = (country: string) => {
    setFormData({
      ...formData,
      country: country,
    });
  };

  const handleGradeSelect = (grade: string) => {
    setFormData({
      ...formData,
      grade: grade,
    });
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative h-10 w-36">
              <Image
                src={logoMain}
                alt="AIFORJR Logo"
                fill
                className="object-contain object-left w-full h-full"
                priority
              />
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Close panel"
            >
              <X className="w-6 h-6 text-gray-600 cursor-pointer" />
            </button>
          </div>
          <h2 className="text-xl font-nord font-bold mb-4 text-gray-900">
            Join Beta Waitlist
          </h2>
          {/* Introduction */}
          <p className="text-sm text-gray-600 mb-8 leading-relaxed">
            We&apos;ll notify you via email once we go live. As part of our Beta
            waitlist program, the first 1000 users will receive 1-6 months of AI
            Tutor access for free.
          </p>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                What is your name? <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Smith"
                required
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black outline-none transition-colors text-sm"
              />
            </div>

            {/* Kids Name Field */}
            <div>
              <label
                htmlFor="kidsName"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                What is your kids name? <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="kidsName"
                name="kidsName"
                value={formData.kidsName}
                onChange={handleInputChange}
                placeholder="Emma Smith"
                required
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black outline-none transition-colors text-sm"
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                What is your email? <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="smith@gmail.com"
                required
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black outline-none transition-colors text-sm"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                What is your Phone Number{" "}
                <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91"
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black outline-none transition-colors text-sm"
              />
            </div>

            {/* Country Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                In which country are you based?{" "}
                <span className="text-red-600">*</span>
              </label>
              <div className="grid grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
                {COUNTRIES.map((country) => (
                  <button
                    key={country}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className={`relative px-2 py-2 md:px-3 md:py-2 rounded-lg border font-regular text-xs md:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                      formData.country === country
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-white text-gray-900 border-gray-200 hover:border-black"
                    }`}
                  >
                    {formData.country === country && (
                      <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                        <Check
                          className="w-3 h-3 text-red-600"
                          strokeWidth={4}
                        />
                      </div>
                    )}
                    <span>{country}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Grade Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Select your kids Grade/class{" "}
                <span className="text-red-600">*</span>
              </label>
              <div className="grid grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
                {GRADES.map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => handleGradeSelect(grade)}
                    className={`relative px-2 py-2 md:px-3 md:py-2 rounded-lg border font-regular text-xs md:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                      formData.grade === grade
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-white text-gray-900 border-gray-200 hover:border-black"
                    }`}
                  >
                    {formData.grade === grade && (
                      <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                        <Check
                          className="w-3 h-3 text-red-600"
                          strokeWidth={4}
                        />
                      </div>
                    )}
                    <span>{grade}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Which subject is most important for your kids right now?{" "}
                <span className="text-red-600">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                {SUBJECTS.map((subject) => (
                  <button
                    key={subject.id}
                    type="button"
                    onClick={() => handleSubjectSelect(subject.id)}
                    className={`relative px-2 py-2 md:px-3 md:py-2 rounded-lg border border-gray-200 font-regular text-xs md:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                      formData.subject === subject.id
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-white text-gray-900 hover:border-black"
                    }`}
                  >
                    {formData.subject === subject.id && (
                      <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                        <Check
                          className="w-3 h-3 text-red-600"
                          strokeWidth={4}
                        />
                      </div>
                    )}
                    <span>{subject.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <p className="text-xs text-gray-400">
              We will follow up with you shortly after submission. We follow a
              strict no-spam policy and will never share your information with
              anyone.
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white px-8 cursor-pointer py-4 rounded-lg font-semibold text-lg hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                "Submitting..."
              ) : (
                <>
                  Submit <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import logoMain from "@/app/logo-main.png";

// Known countries list
const COUNTRIES = [
  "USA",
  "UK",
  "Canada",
  "India",
  "Philippines",
  "Indonesia",
  "Philippines/ Indonesia",
  "Australia",
  "New Zealand",
  "Middle East",
];

// Known subjects list
const SUBJECTS = ["math", "english", "coding", "ai", "science"];

interface ParsedData {
  parentName: string;
  kidsName: string;
  email: string;
  phone: string;
  grade: string;
  country: string;
  subject: string;
}

function parseInput(input: string): ParsedData[] | null {
  try {
    const originalInput = input.trim();

    // Check if input contains tabs (Google Sheets format)
    // Format: parent_name (tab) kids_name (tab) email (tab) phone (tab) grade (tab) country (tab) subject
    if (originalInput.includes("\t")) {
      return parseMultipleTabSeparatedInput(originalInput);
    }

    // Fall back to concatenated format parsing (single row)
    const parsed = parseConcatenatedInput(originalInput);
    return parsed ? [parsed] : null;
  } catch (error) {
    console.error("Parsing error:", error);
    return null;
  }
}

function parseMultipleTabSeparatedInput(input: string): ParsedData[] | null {
  try {
    // Split by newlines to get multiple rows
    const lines = input
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) {
      throw new Error("No valid lines found in input");
    }

    const results: ParsedData[] = [];
    const errors: string[] = [];

    // Parse each line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      try {
        const parsed = parseTabSeparatedInput(line);
        if (parsed) {
          results.push(parsed);
        }
      } catch (error) {
        errors.push(
          `Row ${i + 1}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }

    if (results.length === 0) {
      throw new Error(`Failed to parse any rows. Errors: ${errors.join("; ")}`);
    }

    if (errors.length > 0) {
      console.warn("Some rows failed to parse:", errors);
    }

    return results;
  } catch (error) {
    console.error("Multiple row parsing error:", error);
    throw error;
  }
}

function parseTabSeparatedInput(input: string): ParsedData | null {
  try {
    // Split by tabs (input should be a single line at this point)
    const parts = input
      .split("\t")
      .map((part) => part.trim())
      .filter((part) => part.length > 0);

    if (parts.length < 7) {
      throw new Error(
        `Expected 7 tab-separated values but found ${parts.length}. Format: parent_name (tab) kids_name (tab) email (tab) phone (tab) grade (tab) country (tab) subject`
      );
    }

    const parentName = parts[0].trim();
    const kidsName = parts[1].trim();
    const email = parts[2].trim();
    const phone = parts[3].trim().replace(/\D/g, ""); // Remove non-digits
    const gradeInput = parts[4].trim().toLowerCase();
    const countryInput = parts[5].trim();
    const subjectInput = parts[6].trim().toLowerCase();

    // Validate email
    if (!email.match(/[\w._-]+@[\w._-]+\.[\w]+/i)) {
      throw new Error("Invalid email format");
    }

    // Validate phone
    if (phone.length < 10) {
      throw new Error("Phone number must be at least 10 digits");
    }

    // Format grade
    let grade = "";
    if (gradeInput === "kindergarten") {
      grade = "Kindergarten";
    } else if (gradeInput === "pre-k" || gradeInput === "prek") {
      grade = "Pre-K";
    } else if (gradeInput === "preschool") {
      grade = "Preschool";
    } else if (gradeInput.match(/^grade\s*(\d+)$/i)) {
      const match = gradeInput.match(/^grade\s*(\d+)$/i);
      grade = `Grade ${match ? match[1] : gradeInput.replace(/grade\s*/i, "")}`;
    } else if (gradeInput.match(/^\d+$/)) {
      // Just a number
      grade = `Grade ${gradeInput}`;
    } else {
      // Try to extract number or use as-is
      const numberMatch = gradeInput.match(/\d+/);
      if (numberMatch) {
        grade = `Grade ${numberMatch[0]}`;
      } else {
        // Capitalize first letter
        grade = gradeInput.charAt(0).toUpperCase() + gradeInput.slice(1);
      }
    }

    // Format country - match against known countries (handle "Philippines/ Indonesia" format)
    let country = countryInput.trim();
    // Normalize country input (remove extra spaces, normalize slash spacing)
    // Handle variations like "Philippines/ Indonesia", "Philippines/Indonesia", "Philippines / Indonesia"
    const normalizedCountryInput = country
      .replace(/\s*\/\s*/g, "/ ") // Normalize slash spacing: "/ " or " /" or "/" -> "/ "
      .replace(/\s+/g, " ") // Normalize multiple spaces
      .trim();

    for (const knownCountry of COUNTRIES) {
      const normalizedKnownCountry = knownCountry
        .replace(/\s*\/\s*/g, "/ ") // Normalize slash spacing
        .replace(/\s+/g, " ") // Normalize multiple spaces
        .trim();

      // Exact match (case-insensitive) or match when input contains the known country
      if (
        normalizedCountryInput.toLowerCase() ===
          normalizedKnownCountry.toLowerCase() ||
        normalizedCountryInput
          .toLowerCase()
          .includes(normalizedKnownCountry.toLowerCase()) ||
        normalizedKnownCountry
          .toLowerCase()
          .includes(normalizedCountryInput.toLowerCase())
      ) {
        country = knownCountry; // Use the standardized format from our list
        break;
      }
    }

    // If no match found, use the input as-is but normalize spaces
    if (country === countryInput) {
      country = normalizedCountryInput;
    }

    // Format subject - special handling for "ai" (all uppercase), others capitalize first letter
    let subject = subjectInput;
    if (subjectInput === "ai") {
      subject = "AI"; // All uppercase for AI
    } else {
      for (const knownSubject of SUBJECTS) {
        if (subjectInput === knownSubject.toLowerCase()) {
          subject =
            knownSubject.charAt(0).toUpperCase() + knownSubject.slice(1);
          break;
        }
      }
      if (subject === subjectInput) {
        // If not found in known subjects, capitalize first letter
        subject = subjectInput.charAt(0).toUpperCase() + subjectInput.slice(1);
      }
    }

    // Format names - capitalize first letter of each word
    const formatName = (name: string): string => {
      return name
        .split(/\s+/)
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    };

    return {
      parentName: formatName(parentName),
      kidsName: formatName(kidsName),
      email: email.trim(),
      phone: phone.trim(),
      grade: grade.trim(),
      country: country.trim(),
      subject: subject.trim(),
    };
  } catch (error) {
    console.error("Tab-separated parsing error:", error);
    throw error;
  }
}

function parseConcatenatedInput(originalInput: string): ParsedData | null {
  try {
    const lowerInput = originalInput.toLowerCase();
    let remaining = lowerInput;

    // Extract email (pattern: something@something.something)
    const emailMatch = originalInput.match(/[\w._-]+@[\w._-]+\.[\w]+/i);
    if (!emailMatch) {
      throw new Error("Could not find email in input");
    }
    const email = emailMatch[0];
    const emailIndex = lowerInput.indexOf(email.toLowerCase());
    const beforeEmail = originalInput.substring(0, emailIndex);
    remaining = lowerInput.substring(emailIndex + email.length);

    // Extract phone number (10+ digits, could have country code)
    const phoneMatch = remaining.match(/\d{10,}/);
    if (!phoneMatch) {
      throw new Error("Could not find phone number in input");
    }
    const phone = phoneMatch[0];
    const phoneIndex = remaining.indexOf(phone);
    remaining = remaining.substring(phoneIndex + phone.length);

    // Extract grade (pattern: "grade" followed by number, or standalone "kindergarten"/"pre-k"/"preschool")
    // Try matching "grade X" format first, then try standalone special grades
    let gradeMatch = remaining.match(
      /grade\s*(\d+|kindergarten|pre-k|preschool)/i
    );
    let gradeFull = "";
    let gradeValue = "";
    let grade = "";

    if (gradeMatch) {
      // Found "grade X" format (e.g., "grade 2", "grade kindergarten", "grade2")
      gradeFull = gradeMatch[0];
      gradeValue = gradeMatch[1].toLowerCase();
    } else {
      // Try matching standalone special grades (case-insensitive)
      // These appear directly after the phone number in the input format
      const specialGrades = ["kindergarten", "pre-k", "preschool"];
      const remainingLower = remaining.toLowerCase();

      for (const specialGrade of specialGrades) {
        const index = remainingLower.indexOf(specialGrade);
        if (
          index === 0 ||
          (index > 0 && !/[a-z]/i.test(remaining[index - 1]))
        ) {
          // Found at start or after non-letter (like digit or whitespace)
          gradeFull = remaining.substring(index, index + specialGrade.length);
          gradeValue = specialGrade.toLowerCase();
          break;
        }
      }
    }

    if (!gradeFull || !gradeValue) {
      throw new Error("Could not find grade in input");
    }

    // Format grade appropriately
    if (gradeValue === "kindergarten") {
      grade = "Kindergarten";
    } else if (gradeValue === "pre-k") {
      grade = "Pre-K";
    } else if (gradeValue === "preschool") {
      grade = "Preschool";
    } else {
      // Numeric grade: "Grade X"
      grade = `Grade ${gradeValue}`;
    }

    // Find the position of the grade in the remaining string (case-insensitive)
    const gradeIndex = remaining.toLowerCase().indexOf(gradeFull.toLowerCase());
    if (gradeIndex === -1) {
      throw new Error("Could not locate grade in input");
    }
    remaining = remaining.substring(gradeIndex + gradeFull.length);

    // Extract country (check known countries - handle "Philippines/ Indonesia" format)
    let country = "";

    // Try to match known countries (check longest first for "Philippines/ Indonesia")
    const sortedCountries = [...COUNTRIES].sort((a, b) => b.length - a.length);
    for (const knownCountry of sortedCountries) {
      const countryLower = knownCountry.toLowerCase();
      const index = remaining.toLowerCase().indexOf(countryLower);
      if (index !== -1) {
        country = knownCountry; // Use standardized format from our list
        remaining = remaining.substring(index + knownCountry.length);
        break;
      }
    }

    // If no exact match, try partial matching (e.g., "Philippines" in "Philippines/ Indonesia")
    if (!country) {
      for (const knownCountry of COUNTRIES) {
        const countryLower = knownCountry.toLowerCase();
        if (remaining.toLowerCase().includes(countryLower)) {
          // Found partial match - extract the full country string
          const index = remaining.toLowerCase().indexOf(countryLower);
          // Try to extract up to 30 chars after to catch "Philippines/ Indonesia" format
          const extracted = remaining.substring(
            index,
            Math.min(index + knownCountry.length + 20, remaining.length)
          );
          // Normalize spaces
          const normalized = extracted.replace(/\s+/g, " ").trim();
          // Check if it matches our known format
          for (const known of COUNTRIES) {
            if (normalized.toLowerCase().includes(known.toLowerCase())) {
              country = known;
              remaining = remaining.substring(index + extracted.length);
              break;
            }
          }
          if (country) break;
        }
      }
    }

    if (!country) {
      throw new Error("Could not find country in input");
    }

    // Extract subject (check known subjects) - handle "ai" → "AI"
    let subject = "";
    for (const knownSubject of SUBJECTS) {
      if (remaining.toLowerCase().includes(knownSubject.toLowerCase())) {
        subject = knownSubject;
        remaining = remaining.replace(new RegExp(knownSubject, "i"), "");
        break;
      }
    }
    if (!subject) {
      throw new Error("Could not find subject in input");
    }

    // Parse parent name and kids name from beforeEmail
    // The pattern is: parentname + kidsname (concatenated, no separator)
    // Example: "kumarvaishnavi" -> "kumar" (parent) + "vaishnavi" (kids)
    const namePart = beforeEmail.trim().toLowerCase();

    let parentName = "";
    let kidsName = "";

    if (namePart.length === 0) {
      // No names found, use defaults
      parentName = "Parent";
      kidsName = "Child";
    } else if (namePart.length <= 6) {
      // Very short, assume it's just the parent name
      parentName = namePart;
      kidsName = "Child";
    } else {
      // Strategy: Intelligently split concatenated names
      // For "kumarvaishnavi" (14 chars): split at position 5 -> "kumar" (5) + "vaishnavi" (9)
      // Common pattern: parent names are typically 35-45% of total length

      const totalLength = namePart.length;
      const minParentLength = 4;
      const minKidsLength = 4;

      // Calculate optimal split point (around 35-40% for parent name)
      // This handles common cases like "kumarvaishnavi" -> "kumar" + "vaishnavi"
      const optimalSplitRatio = 0.36; // 36% for parent, 64% for kids
      let bestSplit = Math.max(
        minParentLength,
        Math.floor(totalLength * optimalSplitRatio)
      );

      // Ensure both parts meet minimum length requirements
      if (
        bestSplit < minParentLength ||
        totalLength - bestSplit < minKidsLength
      ) {
        // Adjust split point to meet minimum requirements
        bestSplit = Math.max(
          minParentLength,
          Math.min(bestSplit, totalLength - minKidsLength)
        );
      }

      // Try different split points around the optimal to find the best one
      let bestScore = -1;
      const optimalSplit = Math.floor(totalLength * optimalSplitRatio); // Recalculate optimal for clarity
      const startPos = Math.max(minParentLength, optimalSplit - 2);
      const endPos = Math.min(totalLength - minKidsLength, optimalSplit + 2);

      for (let i = startPos; i <= endPos; i++) {
        const potentialParent = namePart.substring(0, i);
        const potentialKids = namePart.substring(i);

        if (
          potentialParent.length >= minParentLength &&
          potentialKids.length >= minKidsLength
        ) {
          let score = 0;

          // Ideal parent name is 5 characters (most common for Indian names)
          if (potentialParent.length === 5) {
            score += 30; // Highest score for ideal length of 5
          } else if (potentialParent.length === 6) {
            score += 25; // High score for length 6
          } else if (potentialParent.length === 4) {
            score += 15;
          } else if (potentialParent.length === 7) {
            score += 10;
          } else if (
            potentialParent.length === 3 ||
            potentialParent.length === 8
          ) {
            score += 5;
          }

          // Prefer longer kids names (they're usually full names, 8+ chars ideal)
          if (potentialKids.length >= 9) {
            score += 15; // Very long kids names get bonus
          } else if (potentialKids.length >= 8) {
            score += 10;
          } else if (potentialKids.length >= 6) {
            score += 5;
          }

          // Bonus if split matches the optimal ratio exactly (around 36%)
          const actualRatio = i / totalLength;
          const ratioDiff = Math.abs(actualRatio - optimalSplitRatio);
          if (ratioDiff < 0.02) {
            score += 10; // Exact match bonus
          } else if (ratioDiff < 0.05) {
            score += 5; // Close match bonus
          }

          // Update best split if this score is better
          if (score > bestScore) {
            bestScore = score;
            bestSplit = i;
          } else if (score === bestScore) {
            // Tiebreaker: prefer positions closer to optimal split point
            const currentDiff = Math.abs(i - optimalSplit);
            const bestDiff = Math.abs(bestSplit - optimalSplit);
            if (currentDiff < bestDiff) {
              bestSplit = i; // Closer to optimal wins
            }
          }
        }
      }

      // Apply the best split
      if (bestSplit > 0 && bestSplit < totalLength) {
        parentName = namePart.substring(0, bestSplit);
        kidsName = namePart.substring(bestSplit);
      } else {
        // Fallback: split at 35% of length
        const fallbackSplit = Math.max(
          minParentLength,
          Math.floor(totalLength * 0.35)
        );
        parentName = namePart.substring(0, fallbackSplit);
        kidsName = namePart.substring(fallbackSplit);
      }
    }

    // Capitalize first letters properly
    parentName = parentName.charAt(0).toUpperCase() + parentName.slice(1);
    kidsName = kidsName.charAt(0).toUpperCase() + kidsName.slice(1);

    // Format subject - special handling for "ai" (all uppercase), others capitalize first letter
    if (subject.toLowerCase() === "ai") {
      subject = "AI"; // All uppercase for AI
    } else {
      subject = subject.charAt(0).toUpperCase() + subject.slice(1);
    }

    return {
      parentName: parentName.trim() || "Parent",
      kidsName: kidsName.trim() || "Child",
      email: email.trim(),
      phone: phone.trim(),
      grade: grade.trim(),
      country: country.trim(),
      subject: subject.trim(),
    };
  } catch (error) {
    console.error("Parsing error:", error);
    return null;
  }
}

function formatWhatsAppMessage(data: ParsedData): string {
  return `Hi ${data.parentName},

Thank you for showing intrest in aiforjr's Free beta program for ${data.kidsName} (${data.grade}) for a ${data.subject} subject.

Our team will reachout to you today via call on this number: ${data.phone}

Make sure to pickup the call, Thank you!

AIFORJR - AI Tutor for kids
https://aiforjr.com/`;
}

export default function WhatsAppPage() {
  const [input, setInput] = useState("");
  const [parsedDataList, setParsedDataList] = useState<ParsedData[]>([]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim()) {
      toast.error("Please enter the input text");
      return;
    }

    const parsed = parseInput(input);
    if (!parsed || parsed.length === 0) {
      toast.error("Could not parse input. Please check the format.");
      return;
    }

    setParsedDataList(parsed);
    toast.success(`Successfully parsed ${parsed.length} row(s)!`);
  };

  const handleOpenWhatsApp = (data: ParsedData) => {
    const message = formatWhatsAppMessage(data);
    const encodedMessage = encodeURIComponent(message);

    // Remove any non-digit characters from phone number for WhatsApp URL
    const cleanPhone = data.phone.replace(/\D/g, "");

    if (!cleanPhone || cleanPhone.length < 10) {
      toast.error("Invalid phone number");
      return;
    }

    // Format: wa.me/PHONENUMBER?text=MESSAGE
    // This opens a chat with the specific phone number and pre-fills the message
    // Works on both mobile (opens app) and web (opens WhatsApp Web)
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="relative h-10 w-36">
            <Image
              src={logoMain}
              alt="AIFORJR Logo"
              fill
              className="object-contain object-left w-full h-full"
              priority
            />
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-nord font-bold text-gray-900 mb-4">
            WhatsApp Message Generator
          </h1>
          <p className="text-gray-600 mb-3">Supports two formats:</p>
          <div className="mb-4 space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                1. Google Sheets (Tab-separated) - Multiple rows supported:
              </p>

              <p className="text-sm font-medium text-gray-700 mb-1">
                2. Concatenated format:
              </p>
              <p className="text-sm text-gray-600">
                parent_name (tab) kids_name (tab) email (tab) phone (tab) grade
                (tab) country (tab) subject
              </p>
            </div>
            <div></div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-4">
            <label
              htmlFor="input"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Input Text
            </label>
            <textarea
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste from Google Sheets (tab-separated, multiple rows supported) or concatenated format..."
              rows={10}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none transition-colors font-mono text-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Parse Input
          </button>
        </form>

        {/* Parsed Data Display */}
        {parsedDataList.length > 0 && (
          <div className="mb-8 space-y-6">
            <h2 className="text-xl font-nord font-bold text-gray-900">
              Parsed Data ({parsedDataList.length} row
              {parsedDataList.length > 1 ? "s" : ""})
            </h2>
            {parsedDataList.map((data, index) => (
              <div
                key={index}
                className="p-6 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Row {index + 1}
                  </h3>
                  <button
                    onClick={() => handleOpenWhatsApp(data)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    Open in WhatsApp
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Parent Name:
                    </span>
                    <p className="text-gray-900">{data.parentName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Kids Name:
                    </span>
                    <p className="text-gray-900">{data.kidsName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Email:
                    </span>
                    <p className="text-gray-900">{data.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Phone:
                    </span>
                    <p className="text-gray-900">{data.phone}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Grade:
                    </span>
                    <p className="text-gray-900">{data.grade}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Country:
                    </span>
                    <p className="text-gray-900">{data.country}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Subject:
                    </span>
                    <p className="text-gray-900">{data.subject}</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-white rounded border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Message Preview:
                  </h4>
                  <pre className="whitespace-pre-wrap text-xs text-gray-600">
                    {formatWhatsAppMessage(data)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

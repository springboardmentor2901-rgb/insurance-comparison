// ================= IMPORT RAW DATA =================
import { providers, policies as rawPolicies } from "./insuranceData.js";

// ================= HELPER MAPS =================
const segmentToTypeMap = {
  Motor: "Auto",
  Health: "Health",
  Fire: "Property",
  Marine: "Travel"
};

const defaultBenefitsByType = {
  Life: ["Death benefit", "Tax benefits", "Long-term security"],
  Health: ["Cashless hospitalization", "Pre & post hospitalization", "Annual health check-up"],
  Auto: ["Own damage cover", "Third-party liability", "Roadside assistance"],
  Property: ["Fire & disaster protection", "Theft & burglary cover"],
  Travel: ["Medical emergency", "Trip cancellation", "Baggage loss"],
  Cyber: ["Online fraud protection", "Identity theft cover"]
};

// ================= POLICIES (ADAPTER) =================
export const policies = rawPolicies.map((p, index) => {
  const provider = providers.find(pr => pr.id === p.provider_id);

  const type = segmentToTypeMap[p.segment] || "General";

  return {
    id: index + 1,
    name: p.name,
    type,
    coverage: p.coverage_amount,
    premium: p.premium,
    duration: p.term_years,
    rating: provider?.rating || 4.0,
    status: "Active",
    benefits: defaultBenefitsByType[type] || ["Standard coverage"],
    description: `${p.name} offered by ${provider?.name || "trusted insurer"} with reliable ${type.toLowerCase()} coverage.`
  };
});

// ================= OTHER DATA (UNCHANGED) =================

export let claims = [
  // 🔴 unchanged – exactly same as your original file
];

export const policyTypes = ["All", "Life", "Health", "Auto", "Property", "Travel", "Cyber"];

export const agents = [
  // 🔴 unchanged
];

export const invoices = [
  // 🔴 unchanged
];

export const complianceData = {
  // 🔴 unchanged
};

export const supportTickets = [
  // 🔴 unchanged
];

// ================= FUNCTIONS (UNCHANGED) =================

export function getRecommendations(profile) {
  const { age, income, riskLevel } = profile;
  let recommended = [];

  if (age < 30) {
    recommended.push({ ...policies.find(p => p.type === "Life"), matchScore: 90, reason: "Early financial protection." });
    recommended.push({ ...policies.find(p => p.type === "Health"), matchScore: 85, reason: "Health coverage at low premiums." });
  } else if (age < 45) {
    recommended.push({ ...policies.find(p => p.type === "Health"), matchScore: 92, reason: "Family medical security." });
    recommended.push({ ...policies.find(p => p.type === "Auto"), matchScore: 88, reason: "Vehicle protection." });
  } else {
    recommended.push({ ...policies.find(p => p.type === "Health"), matchScore: 95, reason: "Comprehensive health coverage." });
    recommended.push({ ...policies.find(p => p.type === "Property"), matchScore: 85, reason: "Asset protection." });
  }

  if (income === "high") {
    recommended = recommended.map(r => ({ ...r, matchScore: Math.min(r.matchScore + 3, 99) }));
  }

  return recommended;
}

export function calculatePremium(age, coverage, duration, policyType) {
  const baseRates = { Life: 0.005, Health: 0.012, Auto: 0.018, Property: 0.003, Travel: 0.008, Cyber: 0.004 };
  const base = baseRates[policyType] || 0.008;

  let ageFactor = age < 25 ? 0.8 : age < 35 ? 1.0 : age < 45 ? 1.3 : age < 55 ? 1.6 : 2.0;
  let durationFactor = duration <= 1 ? 1.2 : duration <= 5 ? 1.0 : duration <= 15 ? 0.9 : 0.85;

  const annualPremium = Math.round(coverage * base * ageFactor * durationFactor);
  const monthlyPremium = Math.round(annualPremium / 12);
  const totalPremium = annualPremium * duration;

  return { annualPremium, monthlyPremium, totalPremium, duration };
}

let claimCounter = claims.length;
export function addClaim(claimData) {
  claimCounter++;
  const claimId = `CLM-2025-${String(claimCounter).padStart(3, "0")}`;
  const today = new Date().toISOString().split("T")[0];

  const newClaim = {
    id: claimId,
    policyName: claimData.policyNumber || "N/A",
    policyNumber: claimData.policyNumber,
    type: claimData.claimType || "General",
    claimType: claimData.claimType,
    amount: null,
    filedDate: today,
    status: "Submitted",
    fullName: claimData.fullName,
    email: claimData.email,
    phone: claimData.phone,
    userId: claimData.userId || null,
    description: claimData.description,
    filesCount: claimData.filesCount || 0,
    timeline: [
      { step: "Claim Filed", date: today, status: "completed", description: "Claim submitted successfully." },
      { step: "Documents Verification", date: "", status: "current", description: "Documents under review." },
      { step: "Under Review", date: "", status: "pending", description: "Claim assessment pending." },
      { step: "Decision", date: "", status: "pending", description: "Final decision awaited." },
      { step: "Settlement", date: "", status: "pending", description: "Amount will be disbursed after approval." }
    ]
  };

  claims.unshift(newClaim);
  return newClaim;
}
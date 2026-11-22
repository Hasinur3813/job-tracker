const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-email": "ইমেইল ঠিকানাটি সঠিক নয়। আবার যাচাই করুন।",
  "auth/missing-email": "আপনার ইমেইল ঠিকানাটি লিখুন।",
  "auth/user-disabled":
    "এই অ্যাকাউন্টটি নিষ্ক্রিয় করা হয়েছে। সহায়তার জন্য যোগাযোগ করুন।",
  "auth/user-not-found": "এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি।",
  "auth/wrong-password": "পাসওয়ার্ডটি সঠিক নয়। আবার চেষ্টা করুন।",
  "auth/invalid-credential": "ইমেইল বা পাসওয়ার্ড সঠিক নয়। আবার চেষ্টা করুন।",
  "auth/email-already-in-use":
    "এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট আছে। লগইন করুন অথবা পাসওয়ার্ড রিসেট করুন।",
  "auth/weak-password": "পাসওয়ার্ডটি যথেষ্ট শক্তিশালী নয়। কমপক্ষে ৬ অক্ষর দিন।",
  "auth/too-many-requests":
    "অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।",
  "auth/network-request-failed":
    "ইন্টারনেট সংযোগে সমস্যা হচ্ছে। সংযোগ যাচাই করে আবার চেষ্টা করুন।",
  "auth/popup-blocked":
    "ব্রাউজার পপ-আপ ব্লক করেছে। পপ-আপ অনুমোদন করে আবার চেষ্টা করুন।",
  "auth/popup-closed-by-user": "Google সাইন-ইন বাতিল করা হয়েছে।",
  "auth/cancelled-popup-request": "Google সাইন-ইন বাতিল করা হয়েছে।",
  "auth/account-exists-with-different-credential":
    "এই ইমেইল অন্য একটি লগইন পদ্ধতিতে ব্যবহৃত হচ্ছে। সেই পদ্ধতিতে লগইন করুন।",
  "auth/operation-not-allowed":
    "এই লগইন পদ্ধতিটি এখনো চালু করা হয়নি। Firebase Console থেকে চালু করুন।",
  "auth/unauthorized-domain":
    "এই ডোমেইন থেকে Google লগইন অনুমোদিত নয়। Firebase-এ ডোমেইনটি অনুমোদন করুন।",
  "auth/requires-recent-login":
    "নিরাপত্তার জন্য আবার লগইন করে এই কাজটি করুন।",
  "auth/internal-error": "সার্ভারে একটি সাময়িক সমস্যা হয়েছে। আবার চেষ্টা করুন।",
  "auth/invalid-api-key": "Firebase কনফিগারেশনে সমস্যা আছে। সহায়তা নিন।",
  "auth/invalid-continue-uri": "রিসেট লিংকের গন্তব্য সঠিক নয়।",
  "auth/unauthorized-continue-uri": "রিসেট লিংকের ডোমেইন অনুমোদিত নয়।",
};

export function getAuthErrorCode(error: unknown): string {
  if (typeof error === "object" && error !== null && "code" in error) {
    return String((error as { code: unknown }).code);
  }
  return "";
}

export function getAuthErrorMessage(error: unknown): string {
  const code = getAuthErrorCode(error);
  return (
    AUTH_ERROR_MESSAGES[code] ??
    "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।"
  );
}

export function isAuthCancellation(error: unknown): boolean {
  const code = getAuthErrorCode(error);
  return (
    code === "auth/popup-closed-by-user" ||
    code === "auth/cancelled-popup-request"
  );
}

export type FirestoreOperation = "list" | "create" | "update" | "delete";

const USER_MESSAGES: Record<FirestoreOperation, string> = {
  list: "আবেদনগুলো লোড করা যায়নি। ইন্টারনেট সংযোগ যাচাই করে আবার চেষ্টা করুন।",
  create: "নতুন আবেদন সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।",
  update: "তথ্য আপডেট করা যায়নি। আবার চেষ্টা করুন।",
  delete: "তথ্য মুছে ফেলা যায়নি। আবার চেষ্টা করুন।",
};

export function reportFirestoreError(
  error: unknown,
  operation: FirestoreOperation,
  path: string | null,
) {
  console.error(`Firestore ${operation} failed`, { path, error });
}

export function getFirestoreErrorMessage(
  operation: FirestoreOperation,
): string {
  return USER_MESSAGES[operation];
}

export function getFirestoreQueryErrorMessage(error: unknown): string {
  const code = (error as { code?: string } | null)?.code;

  if (code === "failed-precondition") {
    return "ডেটাবেস সূচি (index) এখনো প্রস্তুত হয়নি। কয়েক মিনিট পর আবার চেষ্টা করুন।";
  }

  return getFirestoreErrorMessage("list");
}

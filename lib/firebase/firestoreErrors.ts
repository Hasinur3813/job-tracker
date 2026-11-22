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

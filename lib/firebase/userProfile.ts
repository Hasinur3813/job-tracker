import type { User } from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export async function syncUserProfile(user: User): Promise<void> {
  const profileRef = doc(db, "users", user.uid, "profile", "main");
  const existing = await getDoc(profileRef);

  const profile = {
    uid: user.uid,
    email: user.email ?? null,
    display_name: user.displayName ?? null,
    photo_url: user.photoURL ?? null,
    provider_ids: user.providerData.map((provider) => provider.providerId),
    last_login_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };

  await setDoc(
    profileRef,
    existing.exists()
      ? profile
      : { ...profile, created_at: serverTimestamp() },
    { merge: true },
  );
}

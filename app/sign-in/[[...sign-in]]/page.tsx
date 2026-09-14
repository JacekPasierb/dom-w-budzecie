import { SignIn } from "@clerk/nextjs";
import { AuthScreen } from "@/components/AuthScreen/AuthScreen";
import { clerkAppearance } from "@/lib/clerkAppearance";

export default function SignInPage() {
  return (
    <AuthScreen>
      <SignIn appearance={clerkAppearance} />
    </AuthScreen>
  );
}

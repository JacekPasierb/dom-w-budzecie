import { SignUp } from "@clerk/nextjs";
import { AuthScreen } from "@/components/AuthScreen/AuthScreen";
import { clerkAppearance } from "@/lib/clerkAppearance";

export default function SignUpPage() {
  return (
    <AuthScreen>
      <SignUp appearance={clerkAppearance} />
    </AuthScreen>
  );
}

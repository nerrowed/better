import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "react-router";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { requestPasswordReset } from "@/api/auth";

export function LoginPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login, user, isLoading } = useAuth();
  const [email, setEmail] = useState<string>();

  if (user?.id) return <Navigate to={"/"} />;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const identifier = formData.get("identifier") as string;
    const password = formData.get("password") as string;

    try {
      await login(identifier, password);
      toast.success("Login success.");
    } catch (error) {
      toast.error(String(error));
    }
  };

  const handleForgotPassword = async () => {
    if (!email) return;
    try {
      await requestPasswordReset(email);
      toast.success(`Password reset email requested for: ${email}`);
    } catch (error) {
      toast.error("Gagal mengirim email reset kata sandi. " + error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6 min-h-96 justify-center">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="identifier">Identifier</Label>
                <Input
                  name="identifier"
                  id="identifier"
                  placeholder="Your nim or nip"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Kata sandi</Label>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      {/* <Button variant={"link"}>Lupa kata sandi?</Button> */}
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader className="space-y-2">
                        <AlertDialogTitle>Reset Kata Sandi</AlertDialogTitle>
                        <AlertDialogDescription>
                          Untuk mereset kata sandi masukan email akun kamu. Jika
                          lupa email hubungi admin.
                        </AlertDialogDescription>
                        <Input
                          placeholder="emailkamu@gmail.com"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleForgotPassword}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Your password"
                />
              </div>
              <Button disabled={isLoading} type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/images/manajemen-informatika.jpeg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.9]"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}

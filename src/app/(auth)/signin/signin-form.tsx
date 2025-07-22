"use client";

import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthFormValues, signinSchema } from "../schema";
import { IconBrandGoogle } from "@tabler/icons-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";

export function SigninForm() {
  const [step, setStep] = useState<"signIn" | "signUp">("signIn");

  const { signIn } = useAuthActions();
  const [loading, setLoading] = useState(false);
  const [googleloading, setGoogleLoading] = useState(false);

  const router = useRouter();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    try {
      await signIn("google");
      toast.success("Logging you in...");
    } catch (error) {
      console.error(error);
      toast.error("Sign in with google failed!");
    } finally {
      setGoogleLoading(false);
    }
  }

  async function onSubmit(values: AuthFormValues) {
    // TODO: Sign in
    setLoading(true);
    try {
      await signIn("password", {
        ...values,
        flow: step,
      });
      toast.success(
        step === "signIn"
          ? "Signed in successfully"
          : "Account created successfully"
      );
      router.push("/notes");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/50">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-card-foreground">
            {step === "signIn" ? "Login" : "Create Account"}
          </h1>
          <p className="text-muted-foreground">
            {step === "signIn"
              ? "Enter your credentials to access your account."
              : "Enter your details to create a new account."}
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      {...field}
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
              <div className="text-sm text-destructive">
                {form.formState.errors.root.message}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <LoaderIcon className="animate-spin size-5" />
              ) : step === "signIn" ? (
                "Sign In"
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
        <Button
          variant="link"
          type="button"
          className="w-full text-sm text-muted-foreground cursor-pointer mb-1"
          onClick={() => {
            setStep(step === "signIn" ? "signUp" : "signIn");
            form.reset(); // Reset form errors and values when switching modes
          }}
        >
          {step === "signIn"
            ? "Don't have an account? Sign Up"
            : "Already have an account? Sign In"}
        </Button>
        {/* --or-- separator */}
        <div className="flex items-center my-2">
          <div className="flex-grow border-t border-muted-foreground/30" />
          <span className="mx-4 text-muted-foreground text-xs font-medium">
            or
          </span>
          <div className="flex-grow border-t border-muted-foreground/30" />
        </div>
        {/* Sign in with Google button */}
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-2 mt-2"
          onClick={handleGoogleLogin}
        >
          {googleloading ? (
            <LoaderIcon className="size-5 animate-spin" />
          ) : (
            <>
              <IconBrandGoogle className="size-5" />
              <p>Sign in with Google </p>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useActionState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { login } from "@/actions/actions";
import { toast } from "sonner";
import AuthContext from "./auth-context";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [res, action, isPending] = useActionState(login, null);
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (res?.code) {
      console.log({ res });
      if (res.code == 200) {
        toast(res.message.split("-")[0], {
          description: res.message.split("-")[1],
        });
        if (res.data) {
          console.log({ use: res.data });
          setUser(res.data);
          router.replace("/");
        }
      }
      if (res?.code < 300) {
        console.log({ res });
      } else if (res?.message) {
        toast.error("Login failed", {
          description: res?.message,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [res]);

  useEffect(() => {
    if (user && !res?.data) {
      toast("You are already logged in");
      router.replace("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome</CardTitle>
          <CardDescription>
            Enter your details to log in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6" action={action}>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email/username</Label>
                <Input placeholder="email/username" required name="email" />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input type="password" required name="password" />
              </div>
              <Button disabled={isPending} className="w-full">
                {isPending && <Loader className="animate-spin" />}
                Login
              </Button>
            </div>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

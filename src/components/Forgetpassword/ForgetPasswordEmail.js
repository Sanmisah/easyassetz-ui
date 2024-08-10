import React from "react";

import { Button } from "@com/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@com/ui/card";
import { Input } from "@com/ui/input";
import { Label } from "@com/ui/label";
import { useNavigate } from "react-router-dom";
const ForgetPassword = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full h-[100vh]">
      <Card className="mx-auto max-w-sm ">
        <CardHeader>
          <CardTitle className="text-2xl">Password Reset</CardTitle>
          <CardDescription>
            Enter Your Email to Reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 w-full h-full">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Send Reset Link
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            {/* <Link href="#" className="underline">
              Sign up
            </Link> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgetPassword;

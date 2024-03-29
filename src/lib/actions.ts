"use server";

import { redirect, RedirectType } from "next/navigation";
import { cookies } from "next/headers";

export const handleLogin = async (
  _currentState: unknown,
  formData: FormData,
) => {
  const userData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const results = await fetch(process.env.REACT_APP_BASE_URL + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const response = await results.json();
    if (results.ok) {
      if (response.token) {
        cookies().set("x-token", response.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7, // One week
          path: "/",
        });
        console.log("successfully logged in");
      }
    } else return response;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    throw error;
  }
  redirect("/", RedirectType.replace);
};

export const handleRegistration = async (
  _currentState: unknown,
  formData: FormData,
) => {
  const userData = {
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("password2"),
  };

  if (userData.password !== userData.confirmPassword) {
    return "passwords do not match";
  }

  try {
    const results = await fetch(process.env.REACT_APP_BASE_URL + "/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
      }),
    });
    const response = await results.json();

    if (results.ok) {
      cookies().set("session", btoa(response.username), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // One week
        path: "/",
      });
    } else return response;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    throw error;
  }
  redirect("/login");
};

export const handleAddMember = async (
  _currentState: unknown,
  formData: FormData,
) => {
  const userId = formData.get("friendId");
  const chatId = formData.get("chatId");

  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/add_user_to_group",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          chatId,
        }),
      },
    );
    if (!res.ok) {
      return res;
    }
  } catch (error) {
    throw error;
  }
  redirect(`/chat/${chatId}`);
};

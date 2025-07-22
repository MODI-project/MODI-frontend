export async function signupUser(nickname: string, character: string) {
  const accessToken = localStorage.getItem("accessToken");
  const res = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ nickname, character }),
  });

  if (!res.ok) {
    throw new Error("회원가입 실패");
  }
  return res.json();
}

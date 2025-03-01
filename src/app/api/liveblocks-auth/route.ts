import { request } from "@/lib/request";

export async function POST() {
  try {
    const res = await request.get("/user/profile");
    const { user } = res;
    const name = user.username;
    const nameToNumber = name
      .split("")
      .reduce((acc: string, char: string) => acc + char.charCodeAt(0), 0);
    const hue = Math.abs(nameToNumber) % 360;
    const color = `hsl(${hue}, 80%, 60%)`;

    return Response.json({
      token:
        "sk_dev__q5WmoFA5VIBz-bUpuv3pZ0_i50GAanrVrQ8rmhViXbrAm6QOTSKMTsUQ0J_tBTO",
      userId: user.id,
      userInfo: {
        name: name,
        avatar: user.imageUrl,
        color,
      },
    });
  } catch (err) {
    console.error(err);
    return new Response("Unauthorized", { status: 401 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  console.log("🔥 [TEST DATA] Creating test users");

  try {
    // Create test users
    const testUsers = [
      {
        id: "current-user-id",
        name: "Current User",
        email: "current@test.com",
        image:
          "https://ui-avatars.com/api/?name=Current+User&background=random",
      },
      {
        id: "1",
        name: "Betelhem Dessie",
        email: "betelhem@test.com",
        image:
          "https://media.licdn.com/dms/image/v2/D4E22AQFdV5OlAEJanQ/feedshare-shrink_800/feedshare-shrink_800/0/1682073741589?e=2147483647&v=beta&t=NjvSCUK7wtiAdc-CZyvUZ37HUsIfLi_X3pxOnh7yogM",
      },
      {
        id: "2",
        name: "Timnit Gebru",
        email: "timnit@test.com",
        image:
          "https://radcliffe-harvard-edu.imgix.net/a7bba5e2-7668-44eb-be5d-03bed343dc0b/Timnit-Gebru_COURTESY.jpg",
      },
      {
        id: "3",
        name: "Henok Tsegaye",
        email: "henok@test.com",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Henok_Tsegaye.jpg/256px-Henok_Tsegaye.jpg",
      },
      {
        id: "4",
        name: "Lewam Kefela",
        email: "lewam@test.com",
        image:
          "https://partechpartners.com/_next/image?url=https%3A%2F%2Fpartech-admin.prod.unomena.io%2Fmedia%2Fimages%2FLewam_Kafela.format-webp.webp&w=3840&q=75",
      },
      {
        id: "5",
        name: "Yadesa Bojia",
        email: "yadesa@test.com",
        image:
          "https://images.squarespace-cdn.com/content/v1/5894e2861b10e3ecf54d5465/1521057709578-5WJSM0NUTAMPVR53W06F/Yaddie.jpg",
      },
      {
        id: "6",
        name: "KinfeMichael Tariku",
        email: "kinfemichael@test.com",
        image:
          "https://images.crunchbase.com/image/upload/c_thumb,h_680,w_680,f_auto,g_face,z_0.7,b_white,q_auto:eco,dpr_1/5076dac89a5f495684084a4c0303e5cf",
      },
      {
        id: "7",
        name: "Dagmawi Esayas",
        email: "dagmawi@test.com",
        image: "https://i.imgur.com/6YkKydE.png",
      },
      {
        id: "8",
        name: "Temkin Mengistu",
        email: "temkin@test.com",
        image: "https://i.imgur.com/TSFDVcR.jpeg",
      },
    ];

    const createdUsers = [];

    for (const userData of testUsers) {
      try {
        const user = await prisma.user.upsert({
          where: { id: userData.id },
          update: userData,
          create: {
            ...userData,
            emailVerified: true,
            onBoardingComplete: true,
            connectBalance: 100, // Give them some connects
            preferencesSet: true,
          },
        });
        createdUsers.push(user);
        console.log(
          `✅ [TEST DATA] Created/Updated user: ${user.name} (${user.id})`
        );
      } catch (error) {
        console.error(
          `❌ [TEST DATA] Failed to create user ${userData.name}:`,
          error
        );
      }
    }

    console.log(
      `🎉 [TEST DATA] Successfully created/updated ${createdUsers.length} users`
    );

    return NextResponse.json({
      success: true,
      message: `Created/updated ${createdUsers.length} test users`,
      users: createdUsers.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
      })),
    });
  } catch (error) {
    console.error("💥 [TEST DATA] Error creating test users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  console.log("🔥 [TEST DATA] Fetching all users");

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`📊 [TEST DATA] Found ${users.length} users in database`);

    return NextResponse.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("💥 [TEST DATA] Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

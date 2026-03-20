const BASE_URL = "http://localhost:3000";

const ROUTES = [
  "/",
  "/library",
  "/analysis",
  "/influencers",
  "/pricing",
  "/profile",
  "/login",
  "/register",
  "/terms",
  "/removal",
  "/planner",
  "/admin/login",
  "/admin/dashboard",
  "/admin/ads",
  "/admin/users",
  "/admin/influencers",
  "/admin/strategies",
  "/admin/guide",
];

interface RouteResult {
  route: string;
  passed: boolean;
  status?: number;
  error?: string;
}

async function checkRoute(route: string): Promise<RouteResult> {
  try {
    const res = await fetch(`${BASE_URL}${route}`, { redirect: "follow" });
    return {
      route,
      passed: res.status === 200,
      status: res.status,
    };
  } catch (err: any) {
    return {
      route,
      passed: false,
      error: err.message ?? "خطأ غير معروف",
    };
  }
}

function checkEnvVars() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔑  فحص متغيرات البيئة (Supabase)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url) {
    console.log("  ✅  NEXT_PUBLIC_SUPABASE_URL موجود");
  } else {
    console.log("  ❌  NEXT_PUBLIC_SUPABASE_URL غير موجود");
  }

  if (key) {
    console.log("  ✅  NEXT_PUBLIC_SUPABASE_ANON_KEY موجود");
  } else {
    console.log("  ❌  NEXT_PUBLIC_SUPABASE_ANON_KEY غير موجود");
  }
}

async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🧪  AdVault — فحص جميع المسارات");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const results = await Promise.allSettled(ROUTES.map(checkRoute));

  let passed = 0;
  const total = ROUTES.length;

  for (const result of results) {
    if (result.status === "fulfilled") {
      const { route, passed: ok, status, error } = result.value;
      if (ok) {
        passed++;
        console.log(`  ✅  ${route}  (${status})`);
      } else {
        console.log(
          `  ❌  ${route}  ${status ? `(${status})` : `— ${error}`}`
        );
      }
    } else {
      console.log(`  ❌  خطأ غير متوقع: ${result.reason}`);
    }
  }

  checkEnvVars();

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`📊  النتيجة: ${passed}/${total} اجتياز`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  process.exit(passed === total ? 0 : 1);
}

main();

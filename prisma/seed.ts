import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Demo user — replace clerkId with your actual Clerk user ID after first sign-in
const DEMO_CLERK_ID = "user_demo_seed_replace_me";

const seedMemories = [
  {
    title: "Radiohead at Madison Square Garden",
    description:
      "One of the most transcendent nights of my life. Thom Yorke floated across the stage like a specter, and when Pyramid Song started I genuinely wept. The entire crowd became one organism breathing together.",
    category: "concert",
    date: new Date("2023-06-15"),
    locationName: "Madison Square Garden",
    latitude: 40.7505,
    longitude: -73.9934,
    city: "New York",
    country: "United States",
    address: "4 Pennsylvania Plaza, New York, NY 10001",
    tags: ["radiohead", "music", "nyc", "emotional"],
    mood: "transcendent",
    colorTheme: "#8b5cf6",
    rating: 5,
    favorite: true,
    mediaItems: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80",
        caption: "The crowd before the show",
        orderIndex: 0,
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80",
        caption: "Stage lights during Karma Police",
        orderIndex: 1,
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&q=80",
        caption: "The encore — all lights out",
        orderIndex: 2,
      },
    ],
  },
  {
    title: "Dinner at Sukiyabashi Jiro",
    description:
      "20 courses of pure perfection in a tiny basement restaurant in Ginza. Jiro himself supervised every piece. The tuna alone changed my understanding of what food can be. I still dream about it.",
    category: "restaurant",
    date: new Date("2023-09-08"),
    locationName: "Sukiyabashi Jiro",
    latitude: 35.6717,
    longitude: 139.7643,
    city: "Tokyo",
    country: "Japan",
    address: "Tsukamoto Sogyo Bldg. B1F, 2-15 Ginza, Chuo-ku",
    tags: ["sushi", "tokyo", "michelin", "omakase", "jiro"],
    mood: "reverent",
    colorTheme: "#f97316",
    rating: 5,
    favorite: true,
    mediaItems: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=1200&q=80",
        caption: "The counter — only 10 seats",
        orderIndex: 0,
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=1200&q=80",
        caption: "Course 7 — fatty tuna",
        orderIndex: 1,
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1582450871972-ab5ca641643d?w=1200&q=80",
        caption: "Ginza at night after",
        orderIndex: 2,
      },
    ],
  },
  {
    title: "Solo sunrise hike — Machu Picchu",
    description:
      "Woke at 3:30 AM and hiked up through thick cloud forest, arriving just as the sun cracked over Huayna Picchu. I was completely alone for 20 minutes with one of the most important places on Earth.",
    category: "landmark",
    date: new Date("2022-11-20"),
    locationName: "Machu Picchu",
    latitude: -13.1631,
    longitude: -72.545,
    city: "Machu Picchu",
    country: "Peru",
    tags: ["machu-picchu", "peru", "inca", "sunrise", "solo-travel", "bucket-list"],
    mood: "awe",
    colorTheme: "#10b981",
    rating: 5,
    favorite: true,
    mediaItems: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=80",
        caption: "Sunrise breaking over the ruins",
        orderIndex: 0,
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1200&q=80",
        caption: "Looking down the agricultural terraces",
        orderIndex: 1,
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=1200&q=80",
        caption: "The cloud forest trail up",
        orderIndex: 2,
      },
    ],
  },
  {
    title: "Lost afternoon at Shakespeare and Company",
    description:
      "Wandered in at noon, left at 5 PM. Read half a novel in a dusty chair upstairs while the Seine shimmered outside. Bought three books I didn't need. This is the most Parisian afternoon I'll ever have.",
    category: "landmark",
    date: new Date("2023-04-22"),
    locationName: "Shakespeare and Company",
    latitude: 48.8526,
    longitude: 2.3471,
    city: "Paris",
    country: "France",
    address: "37 Rue de la Bûcherie, 75005 Paris",
    tags: ["paris", "books", "shakespeare-and-company", "afternoon", "reading"],
    mood: "peaceful",
    colorTheme: "#f59e0b",
    rating: 5,
    favorite: true,
    mediaItems: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80",
        caption: "The iconic storefront",
        orderIndex: 0,
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
        caption: "The reading nook upstairs",
        orderIndex: 1,
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=1200&q=80",
        caption: "Books acquired",
        orderIndex: 2,
      },
    ],
  },
  {
    title: "Northern Lights, Tromsø",
    description:
      "Stood in -20°C silence on a frozen fjord and watched curtains of green and purple light fold across the entire sky. My camera couldn't capture it. No camera could. Some things just have to live in your eyes.",
    category: "nature",
    date: new Date("2023-01-14"),
    locationName: "Tromsø Fjord",
    latitude: 69.6496,
    longitude: 18.9553,
    city: "Tromsø",
    country: "Norway",
    tags: ["northern-lights", "norway", "arctic", "aurora", "winter"],
    mood: "cosmic",
    colorTheme: "#22c55e",
    rating: 5,
    favorite: true,
    mediaItems: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&q=80",
        caption: "Aurora over the fjord",
        orderIndex: 0,
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&q=80",
        caption: "Green curtains across the sky",
        orderIndex: 1,
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1520769669658-f07657f5a307?w=1200&q=80",
        caption: "The frozen fjord beneath",
        orderIndex: 2,
      },
    ],
  },
  {
    title: "Coffee at Café Central, Vienna",
    description:
      "Arrived at 8 AM, ordered a Melange, wrote 4 pages of my journal while reading Zweig's memoir. A string quartet played in the corner. Freud used to sit in this same room. Time works differently in Vienna.",
    category: "cafe",
    date: new Date("2023-05-03"),
    locationName: "Café Central",
    latitude: 48.2103,
    longitude: 16.3665,
    city: "Vienna",
    country: "Austria",
    address: "Herrengasse 14, 1010 Wien",
    tags: ["vienna", "cafe", "coffee", "writing", "history"],
    mood: "contemplative",
    colorTheme: "#f59e0b",
    rating: 5,
    favorite: false,
    mediaItems: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80",
        caption: "The grand arched ceiling",
        orderIndex: 0,
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&q=80",
        caption: "Melange and journal",
        orderIndex: 1,
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
        caption: "Vienna streets after",
        orderIndex: 2,
      },
    ],
  },
  {
    title: "Turning 30 in Lisbon",
    description:
      "I didn't want to make it a big deal but my friends flew in from four countries. We ate bacalhau, drank wine on a rooftop as the sun set over the Tagus, and a fado singer at the next table started playing without being asked. Perfect.",
    category: "milestone",
    date: new Date("2022-09-17"),
    locationName: "Rooftop Bar do Rio",
    latitude: 38.7169,
    longitude: -9.1395,
    city: "Lisbon",
    country: "Portugal",
    tags: ["birthday", "lisbon", "30", "friends", "fado", "milestone"],
    mood: "joyful",
    colorTheme: "#eab308",
    rating: 5,
    favorite: true,
    mediaItems: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=80",
        caption: "Sunset over the Tagus River",
        orderIndex: 0,
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1200&q=80",
        caption: "The whole crew at dinner",
        orderIndex: 1,
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
        caption: "Pastéis de nata for breakfast",
        orderIndex: 2,
      },
    ],
  },
  {
    title: "First morning in Kyoto",
    description:
      "Checked in at 6 AM after a night train from Osaka. Too tired to sleep. Walked to Fushimi Inari before the tourists arrived. The thousands of torii gates turned orange in the morning light and I walked alone for two hours.",
    category: "travel",
    date: new Date("2023-09-04"),
    locationName: "Fushimi Inari Taisha",
    latitude: 34.9671,
    longitude: 135.7727,
    city: "Kyoto",
    country: "Japan",
    tags: ["kyoto", "japan", "fushimi-inari", "morning", "torii"],
    mood: "meditative",
    colorTheme: "#f97316",
    rating: 5,
    favorite: true,
    mediaItems: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80",
        caption: "The endless torii gates",
        orderIndex: 0,
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=80",
        caption: "Morning mist through the bamboo",
        orderIndex: 1,
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200&q=80",
        caption: "Looking back down the mountain",
        orderIndex: 2,
      },
    ],
  },
  {
    title: "The Uffizi, alone on a Tuesday",
    description:
      "Arrived at opening time on a Tuesday in November — barely anyone there. Stood in front of Botticelli's Birth of Venus for 15 uninterrupted minutes. Art history classes don't prepare you for the actual scale of it.",
    category: "art",
    date: new Date("2022-11-08"),
    locationName: "Galleria degli Uffizi",
    latitude: 43.7677,
    longitude: 11.2553,
    city: "Florence",
    country: "Italy",
    address: "Piazzale degli Uffizi, 6, 50122 Firenze FI",
    tags: ["florence", "art", "uffizi", "botticelli", "museum"],
    mood: "reverent",
    colorTheme: "#a855f7",
    rating: 5,
    favorite: false,
    mediaItems: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1612532275214-e4ca76d0e4d1?w=1200&q=80",
        caption: "The Uffizi corridor",
        orderIndex: 0,
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
        caption: "Florence from Piazzale Michelangelo",
        orderIndex: 1,
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=1200&q=80",
        caption: "Duomo at sunset after",
        orderIndex: 2,
      },
    ],
  },
  {
    title: "Taylor Swift — Eras Tour, Sydney",
    description:
      "Three and a half hours. 44 songs. Cried three times (Champagne Problems, The 1, and Clean, since you're asking). Went with my best friend who's known me since we were 12. Some concerts are actually life events.",
    category: "concert",
    date: new Date("2024-02-23"),
    locationName: "Accor Stadium",
    latitude: -33.8469,
    longitude: 151.0638,
    city: "Sydney",
    country: "Australia",
    address: "Edwin Flack Ave, Sydney Olympic Park NSW 2127",
    tags: ["taylor-swift", "eras-tour", "sydney", "concert", "friendship"],
    mood: "euphoric",
    colorTheme: "#8b5cf6",
    rating: 5,
    favorite: true,
    mediaItems: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&q=80",
        caption: "Stadium filling up — friendship bracelets everywhere",
        orderIndex: 0,
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80",
        caption: "The light show during Midnight Rain",
        orderIndex: 1,
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&q=80",
        caption: "The crowd during All Too Well (10 min version)",
        orderIndex: 2,
      },
    ],
  },
  {
    title: "Ramen at Ichiran, Fukuoka",
    description:
      "Solo dining booth with a bamboo curtain, a paper order form, and the best bowl of tonkotsu I've ever had in my life. The broth had been cooking for 18 hours. I came back the next morning for breakfast.",
    category: "restaurant",
    date: new Date("2023-09-11"),
    locationName: "Ichiran Fukuoka",
    latitude: 33.5904,
    longitude: 130.4017,
    city: "Fukuoka",
    country: "Japan",
    tags: ["ramen", "fukuoka", "tonkotsu", "ichiran", "japan", "solo-dining"],
    mood: "satisfied",
    colorTheme: "#f97316",
    rating: 5,
    favorite: false,
    mediaItems: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=1200&q=80",
        caption: "The famous solo booth",
        orderIndex: 0,
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1614563637806-1d0e645e0940?w=1200&q=80",
        caption: "The tonkotsu bowl",
        orderIndex: 1,
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1578469645742-46cae010e5d4?w=1200&q=80",
        caption: "Nakasu canal after dinner",
        orderIndex: 2,
      },
    ],
  },
  {
    title: "Safari at Masai Mara — The Great Migration",
    description:
      "Watched thousands of wildebeest pour into the Mara River for 45 minutes while crocodiles waited. Something ancient and terrifying and beautiful happening exactly as it has for millions of years. I couldn't speak afterward.",
    category: "nature",
    date: new Date("2023-08-02"),
    locationName: "Masai Mara National Reserve",
    latitude: -1.5064,
    longitude: 35.1437,
    city: "Narok",
    country: "Kenya",
    tags: ["safari", "kenya", "masai-mara", "migration", "wildlife", "bucket-list"],
    mood: "primal",
    colorTheme: "#22c55e",
    rating: 5,
    favorite: true,
    mediaItems: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=80",
        caption: "The migration crossing begins",
        orderIndex: 0,
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80",
        caption: "Mara River at sunrise",
        orderIndex: 1,
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1551009175-15bdf9dcb580?w=1200&q=80",
        caption: "Lions on the savanna at dusk",
        orderIndex: 2,
      },
    ],
  },
  {
    title: "Barcelona, born from rain",
    description:
      "The trip started badly — lost my bag, rained for 2 days. But then the sun came out and I wandered into the Gothic Quarter and ate paella on a terrace and watched a flamenco dancer in a bar with no cover charge. Everything turned.",
    category: "travel",
    date: new Date("2022-07-18"),
    endDate: new Date("2022-07-25"),
    locationName: "Barri Gòtic, Barcelona",
    latitude: 41.3825,
    longitude: 2.1769,
    city: "Barcelona",
    country: "Spain",
    tags: ["barcelona", "spain", "gothic-quarter", "paella", "travel"],
    mood: "resilient",
    colorTheme: "#3b82f6",
    rating: 4,
    favorite: false,
    mediaItems: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200&q=80",
        caption: "La Sagrada Família in the morning",
        orderIndex: 0,
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1464790719320-516ecd75af6c?w=1200&q=80",
        caption: "Gothic Quarter streets after rain",
        orderIndex: 1,
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=80",
        caption: "Sunset from Bunkers del Carmel",
        orderIndex: 2,
      },
    ],
  },
  {
    title: "New Year's Eve on the Bosphorus",
    description:
      "Watched fireworks explode over two continents from a rooftop in Beyoğlu. Istanbul is the only city in the world where Europe and Asia share a shoreline. The ferries kept running through it all — honking in celebration.",
    category: "moment",
    date: new Date("2023-12-31"),
    locationName: "Beyoğlu, Istanbul",
    latitude: 41.0362,
    longitude: 28.9774,
    city: "Istanbul",
    country: "Turkey",
    tags: ["istanbul", "new-years", "bosphorus", "turkey", "celebration"],
    mood: "celebratory",
    colorTheme: "#f43f5e",
    rating: 5,
    favorite: true,
    mediaItems: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80",
        caption: "Fireworks over the Bosphorus",
        orderIndex: 0,
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=1200&q=80",
        caption: "Galata Tower at midnight",
        orderIndex: 1,
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1527838832700-5059252407fa?w=1200&q=80",
        caption: "The ferry crossing at 2 AM",
        orderIndex: 2,
      },
    ],
  },
];

async function main() {
  console.log("Seeding Atlas of Me database...");

  // Create or upsert demo user
  const user = await prisma.user.upsert({
    where: { clerkId: DEMO_CLERK_ID },
    update: {},
    create: {
      clerkId: DEMO_CLERK_ID,
      name: "Alex Rivera",
      email: "alex@atlasdemo.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
      bio: "Chasing sunrises and Michelin stars. 34 countries and counting.",
    },
  });

  console.log(`Created user: ${user.name} (${user.id})`);

  // Clear existing demo memories
  await prisma.mediaItem.deleteMany({ where: { memory: { userId: user.id } } });
  await prisma.memory.deleteMany({ where: { userId: user.id } });

  // Create memories with media
  for (const memoryData of seedMemories) {
    const { mediaItems, ...memoryFields } = memoryData;

    const memory = await prisma.memory.create({
      data: {
        ...memoryFields,
        userId: user.id,
        published: true,
        mediaItems: {
          create: mediaItems.map((item) => ({
            type: item.type,
            url: item.url,
            caption: item.caption,
            orderIndex: item.orderIndex,
          })),
        },
      },
      include: { mediaItems: true },
    });

    // Set the first media item as cover
    if (memory.mediaItems.length > 0) {
      await prisma.memory.update({
        where: { id: memory.id },
        data: { coverMediaId: memory.mediaItems[0].id },
      });
    }

    console.log(`  Created: "${memory.title}" (${memory.city}, ${memory.country})`);
  }

  console.log(`\nSeed complete! ${seedMemories.length} memories created.`);
  console.log(`\nIMPORTANT: Update DEMO_CLERK_ID in prisma/seed.ts with your actual Clerk user ID.`);
  console.log(`You can find your Clerk user ID by signing in and checking the Clerk dashboard.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

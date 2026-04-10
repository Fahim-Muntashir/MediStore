const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

async function main() {
  await prisma.blog.createMany({
    data: [
      {
        title: "10 Essential OTC Medicines for Your Home Kit",
        excerpt: "Learn which medicines you should always have at home for emergencies.",
        content: "Every home should be equipped with a basic set of over-the-counter medicines. A well-stocked medicine cabinet can save you a trip to the pharmacy during an unexpected cold or minor injury. In this article, we cover the top 10 essentials, including pain relievers, antihistamines, and antiseptic creams.",
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500&auto=format&fit=crop",
        author: "Dr. Sarah Johnson"
      },
      {
        title: "The Importance of Vitamin D in Winter",
        excerpt: "Why staying topped up on Vitamin D is crucial for your bone health and immunity.",
        content: "During the winter months, shorter days and less sun exposure can lead to a significant drop in our body's Vitamin D levels. This vitamin is essential for maintaining healthy bones and a robust immune system. Let's discuss dietary sources and supplements to keep you healthy all winter long.",
        image: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?q=80&w=500&auto=format&fit=crop",
        author: "Dr. Mark Wilson"
      },
      {
        title: "How to Manage Seasonal Allergies Naturally",
        excerpt: "Practical tips to keep your allergies at bay during the spring season.",
        content: "Spring brings blooming flowers and beautiful weather, but for many, it also means the start of seasonal allergies. Beyond over-the-counter antihistamines, there are natural remedies and lifestyle changes that can help you reduce symptoms effectively.",
        image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=500&auto=format&fit=crop",
        author: "Dr. Elena Rodriguez"
      }
    ]
  });
  console.log("Blog data seeded!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

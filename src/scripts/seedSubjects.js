import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { runBulkSeed } from '../services/seeder.service.js';

const initialCurriculumData = {
  subjects: [
    {
      name: 'physics',
      nameBn: 'পদার্থবিজ্ঞান',
      nameEn: 'Physics',
      description: 'নবম-দশম শ্রেণির পদার্থবিজ্ঞান (গতি, বল, কাজ, শক্তি ও আধুনিক পদার্থবিজ্ঞান)',
      classLevels: [9, 10],
      chapterCount: 14,
      color: '#2563eb',
      order: 1,
      isPublished: true,
    },
    {
      name: 'chemistry',
      nameBn: 'রসায়ন',
      nameEn: 'Chemistry',
      description: 'নবম-দশম শ্রেণির রসায়ন (পদার্থের গঠন, পর্যায় সারণি, রাসায়নিক বন্ধন ও বিক্রিয়া)',
      classLevels: [9, 10],
      chapterCount: 12,
      color: '#059669',
      order: 2,
      isPublished: true,
    },
    {
      name: 'biology',
      nameBn: 'জীববিজ্ঞান',
      nameEn: 'Biology',
      description: 'নবম-দশম শ্রেণির জীববিজ্ঞান (জীবকোষ, টিস্যু, কোষ বিভাজন, শারীরতত্ত্ব ও জিনতত্ত্ব)',
      classLevels: [9, 10],
      chapterCount: 14,
      color: '#d97706',
      order: 3,
      isPublished: true,
    },
  ],
  chapters: [
    {
      subjectName: 'physics',
      chapterNumber: 2,
      slug: 'motion',
      title: 'গতি',
      titleEn: 'Motion',
      description: 'স্থিতি ও গতি, বিভিন্ন প্রকার গতি, স্কেলার ও ভেক্টর রাশি, দ্রুতি, বেগ, ত্বরণ এবং গতির সমীকরণ।',
      summary: 'এই অধ্যায়ে বস্তুর গতি, বেগ, ত্বরণ এবং লেখচিত্রের সাহায্যে গতির বিশ্লেষণ আলোচনা করা হয়েছে।',
      estimatedMinutes: 45,
      order: 2,
      isPublished: true,
    },
    {
      subjectName: 'chemistry',
      chapterNumber: 3,
      slug: 'structure-of-matter',
      title: 'পদার্থের গঠন',
      titleEn: 'Structure of Matter',
      description: 'মৌলিক ও যৌগিক পদার্থ, পরমাণু ও অণু, পরমাণুর কণিকা, রাদারফোর্ড ও বোর পরমাণু মডেল এবং ইলেকট্রন বিন্যাস।',
      summary: 'পরমাণুর অভ্যন্তরীণ গঠন, আইসোটোপ এবং শক্তিস্তরে ইলেকট্রন বিন্যাসের বিস্তারিত আলোচনা।',
      estimatedMinutes: 50,
      order: 3,
      isPublished: true,
    },
    {
      subjectName: 'biology',
      chapterNumber: 2,
      slug: 'cells-and-tissues-of-organisms',
      title: 'জীবকোষ ও টিস্যু',
      titleEn: 'Cells and Tissues of Organisms',
      description: 'উদ্ভিদ ও প্রাণিকোষের প্রধান অঙ্গাণু, মাইটোকন্ড্রিয়া, প্লাস্টিড, নিউক্লিয়াস এবং বিভিন্ন প্রকার টিস্যু।',
      summary: 'জীবদেহের গঠন ও কাজের একক কোষ এবং বিভিন্ন টিস্যুর গঠন ও কাজ।',
      estimatedMinutes: 55,
      order: 2,
      isPublished: true,
    },
  ],
};

const executeSeeder = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('🌱 Connected to MongoDB. Running Bulk Seeder...');

    const summary = await runBulkSeed(initialCurriculumData);
    console.log('✅ Seeding Completed Successfully!');
    console.table({
      Subjects: summary.subjects.upserted,
      Chapters: summary.chapters.upserted,
    });
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Failed:', error.message);
    process.exit(1);
  }
};

executeSeeder();
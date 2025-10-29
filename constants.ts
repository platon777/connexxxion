
import type { Category } from './types';

export const MOCK_DATA: Category[] = [
  {
    id: 'cat1',
    name: 'Conseils',
    userId: 'admin',
    subjects: [
      {
        id: 'sub1',
        categoryId: 'cat1',
        userId: 'admin',
        title: 'Kijan mk rekonkeri ex mw',
        confessions: [
          {
            id: 'conf1',
            subjectId: 'sub1',
            author: 'Anonyme',
            userId: 'user2',
            timestamp: 'il y a 2 mois',
            content: "Mezanmi, yeswa m te nan telefòn avèk menaj mwen, epi m resevwa yon mesaj tèks avèk yon ti jèn gason 19 an kote lap di m jan l anvi wè m, li pa ka tann pou nou rewè, depi lè m fin li l, m bèbè...",
            peach_likes: 0,
            grape_likes: 0,
            comments: [],
          },
          {
            id: 'conf2',
            subjectId: 'sub1',
            author: 'Anonyme',
            userId: 'user1',
            timestamp: 'il y a 2 mois',
            content: "Eskeu se mwen ki pa anfòm, ki pa bèl ki fè yon move bagay ki fè menaj mwen kite m pou yon fanm ki pi gran ke ni mwen ni li?",
            peach_likes: 1,
            grape_likes: 0,
            comments: [],
          }
        ],
      },
      {
        id: 'sub2',
        categoryId: 'cat1',
        userId: 'admin',
        title: 'Kijan poum kenbe relasyon a distans poul mache',
        confessions: [
           {
            id: 'conf3',
            subjectId: 'sub2',
            author: 'Anonyme',
            userId: 'user2',
            timestamp: 'il y a 1 mois',
            content: "Mwen nan yon relasyon a distans e m santi menaj mwen ap vin frèt avè m. Li pa ekri m menm jan ankò. Kisa pou m fè?",
            peach_likes: 5,
            grape_likes: 1,
            comments: [],
          },
           {
            id: 'conf4',
            subjectId: 'sub2',
            author: 'Anonyme',
            userId: 'user2',
            timestamp: 'il y a 3 semaines',
            content: "Menaj mwen ap viv lòt bò dlo, nou gen 2 zan depi nou ansanm men nou pa janm wè. M kòmanse pèdi espwa. Èske sa nòmal?",
            peach_likes: 12,
            grape_likes: 2,
            comments: [],
          },
           {
            id: 'conf5',
            subjectId: 'sub2',
            author: 'Anonyme',
            userId: 'user1',
            timestamp: 'il y a 1 semaine',
            content: "Gen yon zanmi menaj mwen ki toujou ap draguer m sou rezo yo. M pa vle di menaj mwen sa pou pa gen pwoblèm. Sa pou m fè?",
            peach_likes: 8,
            grape_likes: 0,
            comments: [],
          },
           {
            id: 'conf6',
            subjectId: 'sub2',
            author: 'Anonyme',
            userId: 'user2',
            timestamp: 'il y a 2 jours',
            content: "Mwen renmen mennaj mwen anpil men fanmi m pa vle wè l paske li pa gen menm relijyon avèk nou. M pa konn sa pou m fè, èske m dwe koute yo?",
            peach_likes: 22,
            grape_likes: 3,
            comments: [],
          }
        ],
      }
    ]
  },
  {
    id: 'cat2',
    name: 'Expériences et Fantasmes',
    userId: 'admin',
    subjects: [
      {
        id: 'sub3',
        categoryId: 'cat2',
        userId: 'admin',
        title: 'Premye fwa m te...',
        confessions: [
          {
            id: 'conf7',
            subjectId: 'sub3',
            author: 'Anonyme',
            userId: 'user1',
            timestamp: 'il y a 25 jours',
            content: "M poko janm fè yon Quickie nan vi m. M ta renmen eseye men m pè pou yo pa bare m. Ki pi bon kote pou moun fè sa san ris?",
            peach_likes: 3,
            grape_likes: 6,
            comments: [
              {
                id: 'com1',
                confessionId: 'conf7',
                author: 'Wooddick',
                userId: 'user2',
                content: 'Heheeyyyyy',
                timestamp: 'il y a 25 jours',
                likes: 0,
              },
              {
                id: 'com2',
                confessionId: 'conf7',
                author: 'Wooddick',
                userId: 'user2',
                content: 'Saw dim la',
                timestamp: 'il y a 25 jours',
                likes: 1,
              }
            ],
          }
        ],
      },
       {
        id: 'sub4',
        categoryId: 'cat2',
        userId: 'admin',
        title: 'Pi gwo fantasm mwen se...',
        confessions: [],
      }
    ]
  }
];

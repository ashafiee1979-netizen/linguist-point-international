export interface ReviewMock {
  id: string;
  orderNumber?: string;
  clientName: string;
  initials: string;
  location: string;
  languagePair: string;
  useCase: string;
  rating: number;
  comments: string;
  dateAgo: string;
  isVerified?: boolean;
  isApproved?: boolean;
}

export const INITIAL_REVIEWS: ReviewMock[] = [
  {
    id: 'rev-1',
    clientName: 'Mateo Rodriguez',
    initials: 'MR',
    location: 'Miami, FL',
    languagePair: 'Spanish to English',
    useCase: 'USCIS Adjustment of Status (I-485)',
    rating: 5,
    comments: 'Needed an urgent certified translation of my birth and marriage certificates for my green card interview. Linguist Point completed everything in 16 hours. The signed Certificate of Accuracy met every USCIS regulation with zero RFEs!',
    dateAgo: '3 days ago'
  },
  {
    id: 'rev-2',
    clientName: 'Dr. Sophia Keller',
    initials: 'SK',
    location: 'Boston, MA',
    languagePair: 'German to English',
    useCase: 'WES Academic Credential Evaluation',
    rating: 5,
    comments: 'As a medical researcher submitting credential evaluations to WES, exact technical terminology was non-negotiable. The layout preservation of my German university diploma and transcripts was exceptional down to each stamp.',
    dateAgo: '1 week ago'
  },
  {
    id: 'rev-3',
    clientName: 'Oksana Petrenko',
    initials: 'OP',
    location: 'Chicago, IL',
    languagePair: 'Ukrainian to English',
    useCase: 'Legal Court Filings & Notarization',
    rating: 5,
    comments: 'Translated my Ukrainian civil records, diplomas, and power of attorney with expedited notarization. Everything arrived stamped, signed, and formatted identically to the originals. Flawless experience.',
    dateAgo: '2 weeks ago'
  },
  {
    id: 'rev-4',
    clientName: 'Tarek Al-Mansoor',
    initials: 'TA',
    location: 'Houston, TX',
    languagePair: 'Arabic to English',
    useCase: 'Consular Visa & Affidavit Filing',
    rating: 5,
    comments: 'Super fast turnaround and transparent pricing with no hidden fees. I needed an official translation for consular visa processing, and the embassy accepted the certificate without any questions.',
    dateAgo: '2 weeks ago'
  },
  {
    id: 'rev-5',
    clientName: 'Claire Dubois',
    initials: 'CD',
    location: 'New York, NY',
    languagePair: 'French to English',
    useCase: "State DMV Driver's License",
    rating: 5,
    comments: "The DMV in New York is notoriously strict about foreign driver's licenses. Linguist Point's certified translation with the official accuracy stamp was approved at the counter in minutes.",
    dateAgo: '3 weeks ago'
  },
  {
    id: 'rev-6',
    clientName: 'Ahmad Karimi',
    initials: 'AK',
    location: 'Washington, DC',
    languagePair: 'Dari to English',
    useCase: 'Special Immigrant Visa (SIV) Case',
    rating: 5,
    comments: 'Our immigration law firm relies on Linguist Point for Dari and Pashto translations. Their legal accuracy, fast delivery, and USCIS-compliant certification make them our #1 trusted partner.',
    dateAgo: '1 month ago'
  }
];

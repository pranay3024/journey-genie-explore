
export type HeritageSite = {
  id: string;
  name: string;
  location: string;
  country: string;
  description: string;
  image: string;
  yearEstablished: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

export const heritageSites: HeritageSite[] = [
  {
    id: "1",
    name: "Machu Picchu",
    location: "Cusco Region",
    country: "Peru",
    description: "Machu Picchu is an ancient Incan citadel set high in the Andes Mountains, above the Urubamba River valley. Built in the 15th century and later abandoned, it's renowned for its sophisticated dry-stone walls that fuse huge blocks without the use of mortar, intriguing buildings that play on astronomical alignments, and panoramic views.",
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1200",
    yearEstablished: 1450,
    coordinates: {
      latitude: -13.1631,
      longitude: -72.5450
    }
  },
  {
    id: "2",
    name: "Taj Mahal",
    location: "Agra",
    country: "India",
    description: "The Taj Mahal is an ivory-white marble mausoleum on the south bank of the Yamuna river in the Indian city of Agra. It was commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favorite wife, Mumtaz Mahal; it also houses the tomb of Shah Jahan himself.",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200",
    yearEstablished: 1643,
    coordinates: {
      latitude: 27.1751,
      longitude: 78.0421
    }
  },
  {
    id: "3",
    name: "Colosseum",
    location: "Rome",
    country: "Italy",
    description: "The Colosseum is an oval amphitheatre in the centre of the city of Rome, Italy. Built of travertine limestone, tuff, and brick-faced concrete, it was the largest amphitheatre ever built at the time and held 50,000 to 80,000 spectators.",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1200",
    yearEstablished: 80,
    coordinates: {
      latitude: 41.8902,
      longitude: 12.4922
    }
  },
  {
    id: "4",
    name: "Angkor Wat",
    location: "Siem Reap",
    country: "Cambodia",
    description: "Angkor Wat is a temple complex in Cambodia and the largest religious monument in the world. Originally constructed as a Hindu temple dedicated to the god Vishnu for the Khmer Empire, it was gradually transformed into a Buddhist temple toward the end of the 12th century.",
    image: "https://images.unsplash.com/photo-1553697388-94e804e2f0f6?q=80&w=1200",
    yearEstablished: 1150,
    coordinates: {
      latitude: 13.4125,
      longitude: 103.8670
    }
  },
  {
    id: "5",
    name: "Petra",
    location: "Ma'an Governorate",
    country: "Jordan",
    description: "Petra is a famous archaeological site in Jordan's southwestern desert. Dating to around 300 B.C., it was the capital of the Nabatean Kingdom. Accessed via a narrow canyon called Al Siq, it contains tombs and temples carved into pink sandstone cliffs, earning its nickname, the 'Rose City.'",
    image: "https://images.unsplash.com/photo-1579606608915-a8a87201feb8?q=80&w=1200",
    yearEstablished: 312,
    coordinates: {
      latitude: 30.3285,
      longitude: 35.4444
    }
  }
];

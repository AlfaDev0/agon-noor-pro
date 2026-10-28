import { hafsSurah, BASMALA } from './riwayat';

export type AzkarCategory = 'morning' | 'evening' | 'sleep';

export interface Zikr {
  id: string;
  ar: string;
  en: string;
  count: number;
  source: string;
}

const surah = (n: number) => `${BASMALA} ${hafsSurah(n).join(' ')}`;
const baqaraEnd = () => hafsSurah(2).slice(284).join(' ');

const KURSI = 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلۡحَيُّ ٱلۡقَيُّومُۚ لَا تَأۡخُذُهُۥ سِنَةٞ وَلَا نَوۡمٞۚ لَّهُۥ مَا فِي ٱلسَّمَٰوَٰتِ وَمَا فِي ٱلۡأَرۡضِۗ مَن ذَا ٱلَّذِي يَشۡفَعُ عِندَهُۥٓ إِلَّا بِإِذۡنِهِۦۚ يَعۡلَمُ مَا بَيۡنَ أَيۡدِيهِمۡ وَمَا خَلۡفَهُمۡۖ وَلَا يُحِيطُونَ بِشَيۡءٖ مِّنۡ عِلۡمِهِۦٓ إِلَّا بِمَا شَآءَۚ وَسِعَ كُرۡسِيُّهُ ٱلسَّمَٰوَٰتِ وَٱلۡأَرۡضَۖ وَلَا يَـُٔودُهُۥ حِفۡظُهُمَاۚ وَهُوَ ٱلۡعَلِيُّ ٱلۡعَظِيمُ';

const common = {
  kursi: (): Zikr => ({
    id: 'kursi', ar: KURSI, count: 1, source: 'Al-Baqarah 255',
    en: 'Allah! There is no god but He, the Ever-Living, the Sustainer of all existence. Neither drowsiness nor sleep overtakes Him. To Him belongs whatever is in the heavens and the earth. Who can intercede with Him except by His permission? He knows what is before them and what is behind them, and they encompass nothing of His knowledge except what He wills. His Throne extends over the heavens and the earth, and preserving them does not weary Him. He is the Most High, the Most Great.',
  }),
  ikhlas: (): Zikr => ({
    id: 'ikhlas', ar: surah(112), count: 3, source: 'Al-Ikhlas',
    en: 'In the name of Allah, the Most Gracious, the Most Merciful. Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born, nor is there anyone equal to Him.',
  }),
  falaq: (): Zikr => ({
    id: 'falaq', ar: surah(113), count: 3, source: 'Al-Falaq',
    en: 'Say: I seek refuge in the Lord of daybreak, from the evil of what He has created, from the evil of darkness when it settles, from the evil of those who blow on knots, and from the evil of an envier when he envies.',
  }),
  nas: (): Zikr => ({
    id: 'nas', ar: surah(114), count: 3, source: 'An-Nas',
    en: 'Say: I seek refuge in the Lord of mankind, the King of mankind, the God of mankind, from the evil of the sneaking whisperer, who whispers in the hearts of mankind, from among jinn and mankind.',
  }),
};

export const MORNING: Zikr[] = [
  common.kursi(), common.ikhlas(), common.falaq(), common.nas(),
  {
    id: 'm_asbahna', count: 1, source: 'Muslim',
    ar: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
    en: 'We have reached the morning and the dominion belongs to Allah. Praise is to Allah. None has the right to be worshipped but Allah alone, with no partner. His is the dominion and His is the praise, and He is over all things capable. My Lord, I ask You for the good of this day and the good after it, and I seek refuge in You from the evil of this day and the evil after it. My Lord, I seek refuge in You from laziness and helpless old age; from punishment in the Fire and punishment in the grave.',
  },
  {
    id: 'm_bika', count: 1, source: 'At-Tirmidhi',
    ar: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
    en: 'O Allah, by You we have reached the morning, by You we reach the evening, by You we live and by You we die, and to You is the resurrection.',
  },
  {
    id: 'sayyid', count: 1, source: 'Al-Bukhari',
    ar: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    en: 'O Allah, You are my Lord. None has the right to be worshipped but You. You created me and I am Your servant, and I keep Your covenant and promise as best I can. I seek refuge in You from the evil I have done. I acknowledge Your favor upon me and I acknowledge my sin, so forgive me, for none forgives sins except You. (Sayyid al-Istighfar)',
  },
  {
    id: 'm_ushhiduka', count: 4, source: 'Abu Dawud',
    ar: 'اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ',
    en: 'O Allah, I have reached the morning and call on You, the bearers of Your Throne, Your angels and all creation to witness that You are Allah, none has the right to be worshipped but You alone, with no partner, and that Muhammad is Your servant and Messenger.',
  },
  {
    id: 'bismillah', count: 3, source: 'Abu Dawud, At-Tirmidhi',
    ar: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    en: 'In the name of Allah, with whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.',
  },
  {
    id: 'radeetu', count: 3, source: 'Abu Dawud, At-Tirmidhi',
    ar: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا',
    en: 'I am pleased with Allah as my Lord, with Islam as my religion and with Muhammad ﷺ as my Prophet.',
  },
  {
    id: 'hasbi', count: 7, source: 'Abu Dawud',
    ar: 'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
    en: 'Allah is sufficient for me. None has the right to be worshipped but Him. I have placed my trust in Him, and He is the Lord of the Mighty Throne.',
  },
  {
    id: 'afini', count: 3, source: 'Abu Dawud',
    ar: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ',
    en: 'O Allah, grant me health in my body. O Allah, grant me health in my hearing. O Allah, grant me health in my sight. None has the right to be worshipped but You.',
  },
  {
    id: 'kufr', count: 3, source: 'Abu Dawud',
    ar: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ',
    en: 'O Allah, I seek refuge in You from disbelief and poverty, and I seek refuge in You from the punishment of the grave. None has the right to be worshipped but You.',
  },
  {
    id: 'afw', count: 1, source: 'Abu Dawud, Ibn Majah',
    ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي',
    en: 'O Allah, I ask You for well-being in this world and the Hereafter. O Allah, I ask You for pardon and well-being in my religion, my worldly affairs, my family and my wealth. O Allah, conceal my faults and calm my fears.',
  },
  {
    id: 'subhan100', count: 100, source: 'Muslim',
    ar: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    en: 'Glory is to Allah and praise is to Him.',
  },
  {
    id: 'tahlil', count: 10, source: 'Al-Bukhari, Muslim',
    ar: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    en: 'None has the right to be worshipped but Allah alone, with no partner. His is the dominion and His is the praise, and He is over all things capable.',
  },
  {
    id: 'istighfar', count: 100, source: 'Al-Bukhari, Muslim',
    ar: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    en: 'I seek forgiveness from Allah and repent to Him.',
  },
  {
    id: 'salawat', count: 10, source: 'At-Tabarani',
    ar: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
    en: 'O Allah, send prayers and peace upon our Prophet Muhammad.',
  },
];

export const EVENING: Zikr[] = [
  common.kursi(), common.ikhlas(), common.falaq(), common.nas(),
  {
    id: 'e_amsayna', count: 1, source: 'Muslim',
    ar: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
    en: 'We have reached the evening and the dominion belongs to Allah. Praise is to Allah. None has the right to be worshipped but Allah alone, with no partner. His is the dominion and His is the praise, and He is over all things capable. My Lord, I ask You for the good of this night and the good after it, and I seek refuge in You from the evil of this night and the evil after it. My Lord, I seek refuge in You from laziness and helpless old age; from punishment in the Fire and punishment in the grave.',
  },
  {
    id: 'e_bika', count: 1, source: 'At-Tirmidhi',
    ar: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',
    en: 'O Allah, by You we have reached the evening, by You we reach the morning, by You we live and by You we die, and to You is the final return.',
  },
  { ...MORNING.find((z) => z.id === 'sayyid')! },
  {
    id: 'e_ushhiduka', count: 4, source: 'Abu Dawud',
    ar: 'اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ',
    en: 'O Allah, I have reached the evening and call on You, the bearers of Your Throne, Your angels and all creation to witness that You are Allah, none has the right to be worshipped but You alone, with no partner, and that Muhammad is Your servant and Messenger.',
  },
  { ...MORNING.find((z) => z.id === 'bismillah')! },
  { ...MORNING.find((z) => z.id === 'radeetu')! },
  { ...MORNING.find((z) => z.id === 'hasbi')! },
  {
    id: 'e_audhu', count: 3, source: 'Muslim',
    ar: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    en: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
  },
  { ...MORNING.find((z) => z.id === 'afini')! },
  { ...MORNING.find((z) => z.id === 'kufr')! },
  { ...MORNING.find((z) => z.id === 'afw')! },
  { ...MORNING.find((z) => z.id === 'subhan100')! },
  { ...MORNING.find((z) => z.id === 'tahlil')! },
  { ...MORNING.find((z) => z.id === 'istighfar')! },
  { ...MORNING.find((z) => z.id === 'salawat')! },
];

export const SLEEP: Zikr[] = [
  common.kursi(),
  {
    id: 'baqara_end', count: 1, source: 'Al-Baqarah 285-286',
    ar: baqaraEnd(),
    en: 'The Messenger believes in what was revealed to him from his Lord, as do the believers… Allah does not burden a soul beyond its capacity… Our Lord, do not impose blame upon us if we forget or make a mistake… and grant us victory over the disbelieving people.',
  },
  { ...common.ikhlas(), id: 's_ikhlas' },
  { ...common.falaq(), id: 's_falaq' },
  { ...common.nas(), id: 's_nas' },
  {
    id: 's_bismika', count: 1, source: 'Al-Bukhari, Muslim',
    ar: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ',
    en: 'In Your name, my Lord, I lay down my side and by You I raise it. If You take my soul, have mercy on it, and if You release it, protect it as You protect Your righteous servants.',
  },
  {
    id: 's_amutu', count: 1, source: 'Al-Bukhari',
    ar: 'اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا',
    en: 'O Allah, in Your name I die and I live.',
  },
  {
    id: 's_qini', count: 3, source: 'Abu Dawud, At-Tirmidhi',
    ar: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
    en: 'O Allah, protect me from Your punishment on the Day You resurrect Your servants.',
  },
  {
    id: 's_subhan', count: 33, source: 'Al-Bukhari, Muslim',
    ar: 'سُبْحَانَ اللَّهِ',
    en: 'Glory be to Allah.',
  },
  {
    id: 's_hamd', count: 33, source: 'Al-Bukhari, Muslim',
    ar: 'الْحَمْدُ لِلَّهِ',
    en: 'All praise is for Allah.',
  },
  {
    id: 's_akbar', count: 34, source: 'Al-Bukhari, Muslim',
    ar: 'اللَّهُ أَكْبَرُ',
    en: 'Allah is the Greatest.',
  },
];

export const AZKAR: Record<AzkarCategory, Zikr[]> = { morning: MORNING, evening: EVENING, sleep: SLEEP };

export const TASBEEH_PRESETS: { id: string; ar: string; en: string; target: number }[] = [
  { id: 'subhan', ar: 'سُبْحَانَ اللَّهِ', en: 'SubhanAllah', target: 33 },
  { id: 'hamd', ar: 'الْحَمْدُ لِلَّهِ', en: 'Alhamdulillah', target: 33 },
  { id: 'akbar', ar: 'اللَّهُ أَكْبَرُ', en: 'Allahu Akbar', target: 34 },
  { id: 'tahlil', ar: 'لَا إِلَهَ إِلَّا اللَّهُ', en: 'La ilaha illallah', target: 100 },
  { id: 'istighfar', ar: 'أَسْتَغْفِرُ اللَّهَ', en: 'Astaghfirullah', target: 100 },
  { id: 'salawat', ar: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ', en: 'Salawat', target: 100 },
  { id: 'hawqala', ar: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', en: 'La hawla wa la quwwata', target: 100 },
];

export function dateKey(d: Date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

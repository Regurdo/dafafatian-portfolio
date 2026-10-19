export type Language = 'en' | 'id';

export interface Translations {
  nav: {
    about: string;
    projects: string;
    photography: string;
    skills: string;
    experience: string;
    contact: string;
  };
  hero: {
    bio: string;
    title: string;
    status: string;
    scroll: string;
    ticker: string[];
  };
  about: {
    tag: string;
    title: string;
    philosophy: string;
    connect: string;
  };
  projects: {
    tag: string;
    title: string;
    subtitle: string;
    viewProject: string;
    live: string;
    code: string;
    details: string;
    featured: string;
    techStack: string;
    visitLiveSite: string;
    viewSource: string;
    closeDetails: string;
    items: Record<
      string,
      {
        title?: string;
        description: string;
        longDescription?: string;
      }
    >;
  };
  photography: {
    tag: string;
    title: string;
    description: string;
    instruction: string;
    leftButton: string;
    rightButton: string;
    keyboardHint: string;
    fullView: string;
    closeLightbox: string;
    camera: string;
    lens: string;
    shutter: string;
    aperture: string;
    sensitivity: string;
    prev: string;
    next: string;
    frameOf: (curr: number, total: number) => string;
  };
  skills: {
    tag: string;
    title: string;
    subtitle: string;
    levels: {
      expert: string;
      advanced: string;
      proficient: string;
      experienced: string;
    };
    categories: Record<string, string>;
  };
  experience: {
    tag: string;
    title: string;
    current: string;
    present: string;
    items: Record<
      string,
      {
        title?: string;
        description: string;
      }
    >;
  };
  contact: {
    tag: string;
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    subjectLabel: string;
    subjectPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    sendButton: string;
    sending: string;
    successMessage: string;
    errorMessage: string;
  };
  footer: {
    builtWith: string;
    using: string;
  };
}

export const translations: Record<Language, Translations> = {
  id: {
    nav: {
      about: 'Tentang',
      projects: 'Proyek',
      photography: 'Fotografi',
      skills: 'Keahlian',
      experience: 'Pengalaman',
      contact: 'Kontak',
    },
    hero: {
      bio: 'Saya merancang pengalaman digital dengan kode yang bersih dan desain sinematik. Berdedikasi membangun website yang indah, fungsional, dan berkesan.',
      title: 'Creative Developer',
      status: 'Tersedia untuk proyek',
      scroll: 'GULIR',
      ticker: ['Pengembang Kreatif', 'Antusias Keamanan Siber', 'Pemecah Masalah'],
    },
    about: {
      tag: 'Tentang',
      title: 'Tentang Saya',
      philosophy:
        'Saya percaya pada perpaduan fungsionalitas dan estetika. Setiap proyek yang saya bangun bertujuan memecahkan masalah nyata sekaligus menghadirkan pengalaman pengguna yang tak terlupakan.',
      connect: 'Mari Terhubung',
    },
    projects: {
      tag: 'Portofolio',
      title: 'Proyek Pilihan',
      subtitle:
        'Koleksi proyek pilihan yang menunjukkan pendekatan saya dalam memecahkan masalah melalui perpaduan desain dan kode.',
      viewProject: 'Lihat Proyek',
      live: 'Live Demo',
      code: 'Kode',
      details: 'Detail →',
      featured: 'Unggulan',
      techStack: 'Teknologi',
      visitLiveSite: 'Kunjungi Situs',
      viewSource: 'Lihat Kode Sumber',
      closeDetails: 'Tutup detail proyek',
      items: {
        '1': {
          title: 'Platform E-Commerce',
          description:
            'Solusi e-commerce full-stack dengan manajemen inventaris real-time dan integrasi pembayaran yang lancar.',
        },
        '2': {
          title: 'AI Content Studio',
          description:
            'Platform pembuatan konten berbasis AI dengan fitur kolaborasi real-time untuk kreator modern.',
        },
        '3': {
          title: 'Dashboard Analisis Sosial',
          description:
            'Analisis media sosial real-time dengan visualisasi data yang indah dan pelaporan interaktif.',
        },
        '4': {
          title: 'Aplikasi Manajemen Tugas',
          description:
            'Aplikasi manajemen tugas minimalis namun andal dengan papan Kanban drag-and-drop.',
        },
        '5': {
          title: 'Prototipe Streaming Musik',
          description:
            'Antarmuka streaming musik modern dengan visualisasi waveform dan manajemen playlist dinamis.',
        },
        '6': {
          title: 'DevOps Monitor',
          description:
            'Alat pemantauan infrastruktur dengan notifikasi real-time, agregasi log, dan halaman status.',
        },
      },
    },
    photography: {
      tag: 'Galeri',
      title: 'Fotografi',
      description:
        'Koleksi visual pilihan yang ditangkap melalui lensa — momen berharga, suasana jalanan, dan kenangan abadi.',
      instruction: 'Pakai tombol kiri dan kanan pada dial kamera untuk berpindah foto',
      leftButton: '◀ Tombol Kiri',
      rightButton: 'Tombol Kanan ▶',
      keyboardHint: '• atau panah keyboard ‹ ›',
      fullView: 'Lihat Penuh',
      closeLightbox: 'Tutup lightbox',
      camera: 'Kamera',
      lens: 'Lensa',
      shutter: 'Kecepatan Rana',
      aperture: 'Diafragma',
      sensitivity: 'Sensitivitas',
      prev: 'Sebelumnya',
      next: 'Selanjutnya',
      frameOf: (curr, total) => `Foto ${String(curr).padStart(2, '0')} dari ${String(total).padStart(2, '0')}`,
    },
    skills: {
      tag: 'Keahlian',
      title: 'Keahlian & Alat',
      subtitle: 'Teknologi, framework, dan perangkat yang saya gunakan untuk mewujudkan ide digital.',
      levels: {
        expert: 'Ahli',
        advanced: 'Mahir',
        proficient: 'Terampil',
        experienced: 'Berpengalaman',
      },
      categories: {
        Frontend: 'Frontend',
        Backend: 'Backend',
        DevOps: 'DevOps',
        Design: 'Desain',
      },
    },
    experience: {
      tag: 'Perjalanan',
      title: 'Pengalaman',
      current: 'Saat Ini',
      present: 'Sekarang',
      items: {
        '1': {
          title: 'Senior Frontend Developer',
          description:
            'Memimpin tim frontend dalam membangun platform SaaS modern. Menerapkan komponen UI kompleks, mengoptimalkan performa web, dan membimbing developer junior.',
        },
        '2': {
          title: 'Fullstack Developer',
          description:
            'Membangun aplikasi web responsif untuk berbagai klien. Menggunakan React, Node.js, dan PostgreSQL untuk memberikan solusi digital berkualitas tinggi.',
        },
        '3': {
          title: 'Ilmu Komputer',
          description:
            'Sarjana Ilmu Komputer dengan fokus pada rekayasa perangkat lunak dan pengembangan teknologi web modern.',
        },
      },
    },
    contact: {
      tag: 'Hubungi Saya',
      title: 'Mari Bekerja Sama',
      subtitle:
        'Punya ide proyek menarik atau ingin berdiskusi? Kirimkan pesan dan mari ciptakan sesuatu yang luar biasa bersama.',
      nameLabel: 'Nama',
      namePlaceholder: 'Nama Anda',
      emailLabel: 'Email',
      emailPlaceholder: 'email@anda.com',
      subjectLabel: 'Subjek',
      subjectPlaceholder: 'Tujuan pesan Anda',
      messageLabel: 'Pesan',
      messagePlaceholder: 'Ceritakan tentang proyek atau ide Anda...',
      sendButton: 'Kirim Pesan',
      sending: 'Mengirim...',
      successMessage: 'Pesan berhasil terkirim! Terima kasih, saya akan segera membalasnya.',
      errorMessage: 'Gagal mengirim pesan. Silakan coba lagi atau hubungi via email langsung.',
    },
    footer: {
      builtWith: 'Dibuat dengan',
      using: 'menggunakan Next.js & Supabase',
    },
  },
  en: {
    nav: {
      about: 'About',
      projects: 'Projects',
      photography: 'Photography',
      skills: 'Skills',
      experience: 'Experience',
      contact: 'Contact',
    },
    hero: {
      bio: 'I craft digital experiences with clean code and cinematic design. Passionate about building beautiful, functional websites that leave a lasting impression.',
      title: 'Creative Developer',
      status: 'Available for work',
      scroll: 'SCROLL',
      ticker: ['Creative Developer', 'Cybersecurity Enthusiast', 'Problem Solver'],
    },
    about: {
      tag: 'About',
      title: 'Who I Am',
      philosophy:
        'I believe in the intersection of functionality and aesthetics. Every project I build aims to solve real problems while delivering an unforgettable user experience.',
      connect: "Let's Connect",
    },
    projects: {
      tag: 'Portfolio',
      title: 'Selected Projects',
      subtitle:
        'A curated collection of projects that showcase my approach to solving problems through design and code.',
      viewProject: 'View Project',
      live: 'Live Demo',
      code: 'Code',
      details: 'Details →',
      featured: 'Featured',
      techStack: 'Tech Stack',
      visitLiveSite: 'Visit Live Site',
      viewSource: 'View Source',
      closeDetails: 'Close project details',
      items: {
        '1': {
          title: 'E-Commerce Platform',
          description:
            'A full-stack e-commerce solution with real-time inventory management and seamless payment integration.',
        },
        '2': {
          title: 'AI Content Studio',
          description:
            'An AI-powered content creation platform with real-time collaboration features for modern creators.',
        },
        '3': {
          title: 'Social Analytics Dashboard',
          description:
            'Real-time social media analytics with beautiful data visualizations and interactive reporting.',
        },
        '4': {
          title: 'Task Management App',
          description:
            'A minimal yet powerful task management application with drag-and-drop Kanban boards.',
        },
        '5': {
          title: 'Music Streaming Prototype',
          description:
            'A sleek music streaming interface with waveform visualization and dynamic playlist management.',
        },
        '6': {
          title: 'DevOps Monitor',
          description:
            'Infrastructure monitoring tool with real-time alerts, logs aggregation, and status pages.',
        },
      },
    },
    photography: {
      tag: 'Gallery',
      title: 'Photography',
      description:
        'A curated visual collection captured through the lens — moments, street atmosphere, and timeless memories.',
      instruction: 'Use left and right buttons on the camera dial to change photos',
      leftButton: '◀ Left Button',
      rightButton: 'Right Button ▶',
      keyboardHint: '• or arrow keys ‹ ›',
      fullView: 'Full View',
      closeLightbox: 'Close lightbox',
      camera: 'Camera',
      lens: 'Lens',
      shutter: 'Shutter',
      aperture: 'Aperture',
      sensitivity: 'Sensitivity',
      prev: 'Prev',
      next: 'Next',
      frameOf: (curr, total) => `Frame ${String(curr).padStart(2, '0')} of ${String(total).padStart(2, '0')}`,
    },
    skills: {
      tag: 'Expertise',
      title: 'Skills & Tools',
      subtitle: 'Technologies, frameworks, and tools I use to bring digital ideas to life.',
      levels: {
        expert: 'Expert',
        advanced: 'Advanced',
        proficient: 'Proficient',
        experienced: 'Experienced',
      },
      categories: {
        Frontend: 'Frontend',
        Backend: 'Backend',
        DevOps: 'DevOps',
        Design: 'Design',
      },
    },
    experience: {
      tag: 'Journey',
      title: 'Experience',
      current: 'Current',
      present: 'Present',
      items: {
        '1': {
          title: 'Senior Frontend Developer',
          description:
            'Led the frontend team in building a modern SaaS platform. Implemented complex UI components, optimized web performance, and mentored junior developers.',
        },
        '2': {
          title: 'Fullstack Developer',
          description:
            'Built responsive web applications for various clients. Worked with React, Node.js, and PostgreSQL to deliver high-quality digital solutions.',
        },
        '3': {
          title: 'Computer Science',
          description:
            'Bachelor of Computer Science with focus on software engineering and modern web technologies.',
        },
      },
    },
    contact: {
      tag: 'Get in Touch',
      title: "Let's Work Together",
      subtitle:
        "Have a project in mind or want to collaborate? Send me a message and let's create something amazing together.",
      nameLabel: 'Name',
      namePlaceholder: 'Your name',
      emailLabel: 'Email',
      emailPlaceholder: 'your@email.com',
      subjectLabel: 'Subject',
      subjectPlaceholder: 'Project inquiry',
      messageLabel: 'Message',
      messagePlaceholder: 'Tell me about your project or idea...',
      sendButton: 'Send Message',
      sending: 'Sending...',
      successMessage: "Message sent successfully! Thank you, I'll get back to you soon.",
      errorMessage: 'Failed to send message. Please try again or reach out via email directly.',
    },
    footer: {
      builtWith: 'Built with',
      using: 'using Next.js & Supabase',
    },
  },
};

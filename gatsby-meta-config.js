module.exports = {
  title: `winter-love.dev`,
  description: `윈터의 개발 블로그`,
  language: `ko`, // `ko`, `en` => currently support versions for Korean and English
  siteUrl: `https://www.winter-love.dev`,
  ogImage: `/og-image.png`, // Path to your in the 'static' folder
  comments: {
    utterances: {
      repo: `winter-love-dev/winter-love-dev.github.io`,
    },
  },
  ga: 'G-LMTR2L9LZS', //  Google Analytics tracking ID
  author: {
    name: `김성훈`,
    nickname: `Winter`,
    bio: {
      role: `안드로이드 개발자`,
      description: ['겨울과 코딩을 사랑하는', '행복과 성장을 추구하는', '코딩과 위스키를 즐기는'],
      thumbnail: 'memoji_winter.gif', // Path to the image in the 'asset' folder
      residence: 'Bundang-gu, Seongnam, South Korea',
    },
    social: {
      github: `https://github.com/winter-love-dev`,
      linkedIn: `https://www.linkedin.com/in/sam-winter-h`,
      email: `hun230402@gmail.com`,
    },
  },

  /**
   * metadata for About Page
   */
  about: {
    timestamps: [
      // =====       [Timestamp Sample and Structure]      =====
      // ===== 🚫 Don't erase this sample (여기 지우지 마세요!) =====
      {
        date: '',
        activity: '',
        links: {
          github: '',
          post: '',
          googlePlay: '',
          appStore: '',
          demo: '',
        },
      },
      // ========================================================
      // ========================================================
      {
        date: '2019.11 ~ 2020.03',
        activity: 'AI 해커톤 7위 달성 (57팀 참여). WeKnowNothing 팀으로 활동',
        links: {
          demo: 'https://dacon.io/competitions/official/235492/leaderboard',
        },
      },
      {
        date: '2020.08 ~ 2021.01',
        activity: '주식회사 오퍼튜니티 근무. 종합 웨딩 플래닝 플랫폼 "행부케" 개발 (현 폐업)',
      },
      {
        date: '2021.02 ~ 2023.02',
        activity: '블록체인 연구소 헥슬란트 앱 개발자 (산업기능요원)',
      },
      {
        date: '2021.03 ~ 2023.11',
        activity: 'LG ThinQ Kiosk 개발 (프리랜서)',
      },
      {
        date: '2023.12 ~ ',
        activity: '글로벌 차량 모빌리티 서비스 TADA(MVL) 팀에서 근무중',
      }
    ],

    /**
     * metadata for career page
     */
    career: [
      // =====        [Project Sample and Structure]        =====
      // ===== 🚫 Don't erase this sample (여기 지우지 마세요!)  =====
      {
        title: '',
        description: '',
        techStack: ['', ''],
        thumbnailUrl: '',
        links: {
          post: '',
          github: '',
          googlePlay: '',
          appStore: '',
          demo: '',
        },
      },
      // ========================================================
      // ========================================================

      {
        title: '행부케 - 종합 웨딩 플래닝 플랫폼',
        description:
          '웨딩 관련 사업체들을 어그리게이팅 한 쇼핑 플랫폼입니다. \n ' +
          '혼수, 스드메, 예식장, 상견례 식당 예약. 각종 사업체를 예약해서 혼인을 준비할 수 있습니다.',
        techStack: ['Android', 'Java', 'NodeJs', 'React'],
        thumbnailUrl: 'project_heng_bouquet_0.png',
        links: {
          demo: 'https://ohiwallet.com/',
        }
      },
      {
        title: '토큰뱅크 (현 오하이월렛)',
        description:
          '블록체인 지갑 서비스의 앱 개발을 담당했습니다. (안드로이드, iOS)\n ' +
          '합법적 국내 운영을 위해 가상자산 사업자 VASP(바스프) 자격 취득 대응 업무\n ' +
          'ISMS 취득을 위한 보안 대응, KYC, AML, STR 시스템 개발에 참여했습니다.',
        techStack: ['Web3', 'Android', 'Kotlin', 'iOS', 'SnapKit', 'RX', 'MVVM'],
        thumbnailUrl: 'project_o_hi_wallet_0.png',
        links: {
          googlePlay: 'https://play.google.com/store/apps/details?id=com.hexlant.ohi',
          appStore: 'https://apps.apple.com/app/id6466569377',
          demo: 'https://ohiwallet.com/',
        }
      },
      {
        title: 'LG ThinQ Kiosk (IoT) 체험 앱',
        description:
          'LG Bestshop 매장에 전시된 가전을 고객님이 직접 조작, 체험해볼 수 있는 앱입니다. 전국 주요 매장에서 체험해볼 수 있습니다.',
        techStack: ['Android', 'AAC', 'MVVM', 'Coroutines', 'Modularization Architecture'],
        thumbnailUrl: 'project_lg_thinq_kiosk_0.png',
      },
      {
        title: 'TADA - Taxi, Cab, Ride Hailing',
        description:
          '한국에선 잘 알려지지 않고, 해외에서만 운영중인 차량 모빌리티 서비스 입니다. \n' +
          '한국의 택시 앱과 같이 승객에게 운전 기사를 배차 해주고 있어요. \n' +
          '싱가폴, 캄보디아, 베트남, 태국, 홍콩에서 운영중입니다. \n' +
          '승객, 기사 앱 개발 및 전 지역 이슈 대응 업무를 하고있습니다. \n' +
          '9년간 관리 되어온 모놀리틱 프로젝트를 멀티모듈 아키텍처(레이어드)로 리팩토링 했습니다.'
        ,
        techStack: ['Android', 'AAC', 'MVVM', 'Coroutines', 'Modularization Architecture'],
        thumbnailUrl: 'project_tada_0.png',
        links: {
          googlePlay: 'https://play.google.com/store/apps/details?id=io.mvlchain.tada',
          appStore: 'https://apps.apple.com/app/tada-ride-hailing/id1412329684',
          demo: 'https://tada.global/?language=en',
        },
      },
    ],

    /**
     * metadata for projects page
     */
    projects: [
      // =====        [Project Sample and Structure]        =====
      // ===== 🚫 Don't erase this sample (여기 지우지 마세요!)  =====
      {
        title: '',
        description: '',
        techStack: ['', ''],
        thumbnailUrl: '',
        links: {
          post: '',
          github: '',
          googlePlay: '',
          appStore: '',
          demo: '',
        },
      },
      // ========================================================
      // ========================================================
      {
        title: 'Catch Bottle',
        description:
          'Catch Bottle은 위스키 애호가들을 위한 커뮤니티 앱입니다. \n' +
          '위스키 리뷰/평가 기능과 함께, 주변 리쿼샵의 재고 현황을 실시간으로 확인할 수 있는 서비스를 개발 중입니다.',
        techStack: ['Android', 'AAC', 'MVVM', 'Modularization Architecture'],
        thumbnailUrl: 'project_catch_bottle_0.png',
        links: {
          github: 'https://github.com/winter-love-dev/CatchBottle',
        },
      }
    ],
  },

  /**
   * metadata for Buy Me A Coffee
   */
  remittances: {
    toss: {
      qrCode: 'qr_toss.svg', // Path to your in the 'assets' folder
    },
    kakaopay: {
      qrCode: 'qr_kakao.svg', // Path to your in the 'assets' folder
    },
  },
};

module.exports = {
  title: `winter-love.dev`,
  description: `윈터의 블로그`,
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
    bio: {
      role: `안드로이드 개발자`,
      description: ['겨울과 코딩을 사랑하는', '행복과 성장을 추구하는', '코딩과 위스키를 즐기는'],
      thumbnail: 'winter.gif', // Path to the image in the 'asset' folder
    },
    social: {
      github: `https://github.com/winter-love-dev`,
      linkedIn: `https://www.linkedin.com/in/sam-winter-h`,
      email: `hun230402@gmail.com`,
    },
  },


  // metadata for About Page
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
        date: '2019.11 ~ 2020.07',
        activity: 'AI 해커톤 WeKnowNothing 팀으로 활동. 7위 달성 (57팀 중) & 개발 공부',
        links: {
          demo: 'https://dacon.io/competitions/official/235492/leaderboard',
        },
      },
      {
        date: '2021.02 ~ ',
        activity: '산업기능 요원으로 개발자 커리어 시작',
      },
    ],

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
        title: 'Catch Bottle 개인 프로젝트 앱 개발',
        description:
          'Catch Bottle 은 위스키 입문자부터 마니아들까지 이 주제에 대해 소통하는 커뮤니티 입니다. 또한 주변 리쿼샵, 원하는 술의 재고를 탐색하여 원하는 바틀의 Catch (구매)를 돕는 주변 위스키 탐색 기능까지 개발 목표로 관리중인 프로젝트입니다.',
        techStack: ['Android', 'Kotlin', 'AAC', 'MVVM', 'Modularization Architecture'],
        thumbnailUrl: 'mandao.png',
      },
      {
        title: 'Picky(글로벌 스킨 케어 커뮤니티 모바일 앱) 개발',
        description:
          'Picky는 글로벌 스킨 케어 커뮤니티 모바일 어플리케이션입니다. 한국 뿐 아니라 세계적으로 스킨 케어와 K-뷰티에 대한 관심이 높아짐에 따라 제품에 대한 정보를 제공하고 공유하는 플랫폼을 제공하고자 프로젝트를 시작하게 되었습니다. 인턴십으로 참여했던 스타트업의 피벗팅으로 진행된 사업으로 5명과 함께 프로젝트를 진행했습니다. 개발을 홀로 담당하게 되어 모든 개발과 인프라 구축을 담당했으며, Picky를 통해 서비스의 시작과 초기 성장 과정을 경험할 수 있었습니다.',
        techStack: ['flutter', 'nodejs'],
        thumbnailUrl: 'picky.png',
        links: {
          post: '/start-up-app-development',
          googlePlay: 'https://play.google.com/store/apps/details?id=care.jivaka.picky',
          appStore: 'https://apps.apple.com/app/picky-skincare-made-smarter/id1504197356',
        },
      },
    ],

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
        title: '에포드(전락 카드 게임 모바일 앱) 개발',
        description:
          '에포드는 전략형 카드 게임 모바일 어플리케이션입니다. 좋아하는 보드게임을 온라인으로 플레이할 수 있는 방법을 제공하고자 디자이너 1명과 함께 프로젝트를 시작하게 되었습니다. 22년 8월에 앱스토어에 처음 앱을 출시했고 23년 9월 기준 7만명 이상의 유저를 보유하고 있습니다. 1인 개발로 모든 개발 및 인프라 구축을 진행하고 있으며 서비스 운영 및 기능 기획 모두 담당하고 있습니다.',
        techStack: ['dart', 'flutter', 'typescript', 'nestjs'],
        thumbnailUrl: 'ephod.png',
        links: {
          post: 'https://namu.wiki/w/%EC%97%90%ED%8F%AC%EB%93%9C',
          googlePlay: 'https://play.google.com/store/apps/details?id=com.zoomkoding.ephod',
          appStore: 'https://apps.apple.com/kr/app/the-ephod/id1633480108',
        },
      },
      {
        title: '공모주닷컴(공모주 청약 정보 웹 앱) 개발',
        description:
          '공모주닷컴은 공모주 청약과 관련한 정보를 제공하는 웹 서비스입니다. 공모주 청약 관련된 정보를 찾아 주변에 공유하다 보니 공모주를 평가하고, 증권사별 청약 경쟁률을 보여주고, 더 나아가 공모주 관련 커뮤니티를 만들어보고자 프로젝트를 구상하게 되었습니다. 2달의 개발 기간을 거쳐 웹사이트 개발, 공모주 정보 및 각 증권사별 청약 경쟁률을 가져오는 봇을 개발하여 공모주닷컴이란 이름으로 서비스를 출시했습니다. 점차 검색을 통해 사용자가 유입되기 시작했으나 주식 시장 악화로 서비스를 중단했습니다.',
        techStack: ['typescript', 'nextjs', 'react', 'nestjs'],
        thumbnailUrl: 'gongmojoo.com.png',
        links: {
          github: 'https://github.com/zoomkoding/gongmojoo.com',
        },
      },
      {
        title: '개발 블로그 테마 개발',
        description:
          '개발 블로그를 운영하는 기간이 조금씩 늘어나고 점점 많은 생각과 경험이 블로그에 쌓아가면서 제 이야기를 담고 있는 블로그를 직접 만들어보고 싶게 되었습니다. 그동안 여러 개발 블로그를 보면서 좋았던 부분과 불편했던 부분들을 바탕으로 레퍼런스를 참고하여 직접 블로그 테마를 만들게 되었습니다.',
        techStack: ['javascript', 'gatsby', 'react'],
        thumbnailUrl: 'blog.png',
        links: {
          post: '/gatsby-starter-zoomkoding-introduction',
          github: 'https://github.com/zoomkoding/zoomkoding-gatsby-blog',
          demo: 'https://www.zoomkoding.com',
        },
      },
      {
        title: '대학시간(대학교 수강신청 보조 웹 앱) 개발',
        description:
          '학생들이 예비 수강 신청 과정에서 겪게 되는 불편함을 개선하고자 예비 수강 신청을 도와줄 수 있는 웹사이트를 만들게 되었습니다. 특히 학기가 시작되기 전 빈번하게 바뀌는 과목 정보들을 주기적으로 최신화하고 수강 신청을 시작한 후에는 수강 공석(이삭)을 발견하여 이를 이메일로 알려주는 서비스를 진행했습니다. 2021년 1학기부터 운영했으며 2년간 매학기 1000명이 넘는 재학생이 사용하고 있습니다.',
        techStack: ['javascript', 'react', 'nodejs'],
        thumbnailUrl: 'timetable.png',
        links: {
          post: '/gatsby-starter-zoomkoding-introduction',
          github: 'https://github.com/zoomkoding/zoomkoding-gatsby-blog',
          demo: 'https://www.zoomkoding.com',
        },
      },
    ],
  },
};

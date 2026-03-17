import type { Level } from "./types";

const level2: Level = {
  id: 2,
  title: "중급 - CFOP 기초 (Fridrich Method)",
  subtitle: "1분 이하를 목표로 하는 중급 방법",
  description:
    "CFOP는 Cross → F2L → OLL → PLL의 약자로, 스피드큐빙의 가장 대중적인 방법입니다. 이 레벨에서는 직관적 F2L과 2-Look OLL/PLL을 배워 1분 벽을 깨겠습니다.",
  targetTime: "30초~1분",
  difficulty: "intermediate",
  color: "#fdcb6e",
  steps: [
    {
      title: "Step 1: 효율적인 크로스 (Efficient Cross)",
      description:
        "크로스를 8무브 이내로 완성하는 것을 목표로 합니다. 기존 LBL에서는 직관적으로 풀었지만, 이제는 계획적으로 풀어야 합니다.",
      algorithms: [
        {
          name: "크로스 계획 수립",
          algorithm: "인스펙션 15초 활용",
          moveCount: 0,
          description:
            "큐브를 관찰하는 15초 동안 크로스 전체를 미리 계획합니다. 4개의 엣지가 어디에 있는지 파악하고, 최적의 순서를 결정합니다.",
          tips: [
            "크로스는 아래에서 만드세요 (White on Bottom)",
            "인스펙션에서 최소 2~3개 엣지 계획을 세우세요",
            "평균 8무브 이내로 크로스 완성을 목표로 하세요",
            "엣지를 넣는 순서를 바꾸면 무브 수가 크게 줄어들 수 있습니다",
            "이미 있는 엣지 위에 다른 엣지를 삽입하는 기술을 익히세요",
          ],
        },
        {
          name: "크로스 엣지 동시 처리",
          algorithm: "예: D R F' (2개 엣지 동시 삽입)",
          moveCount: 3,
          description:
            "한 번의 동작으로 2개의 엣지를 동시에 처리하면 무브를 크게 절약할 수 있습니다.",
          tips: [
            "크로스 엣지를 넣는 순서가 핵심입니다",
            "매일 크로스만 연습하는 시간을 가지세요",
            "다양한 색 크로스도 연습하면 유연성이 늘어납니다",
          ],
        },
      ],
    },
    {
      title: "Step 2: 직관적 F2L (First Two Layers)",
      description:
        "F2L은 코너와 엣지를 페어로 묶어서 한 번에 삽입하는 기술입니다. LBL에서 코너와 엣지를 따로 넣던 것을 하나로 합쳐 효율을 높입니다.",
      algorithms: [
        {
          name: "기본 F2L 삽입 (Case 1: Easy Insert)",
          algorithm: "U R U' R'",
          moveCount: 4,
          description:
            "코너의 흰색이 오른쪽을 향하고, 엣지가 이미 페어링된 가장 기본적인 경우입니다.",
          fingerTrick: true,
          tips: [
            "코너와 엣지가 자연스럽게 붙어있는 경우 그대로 삽입",
          ],
        },
        {
          name: "기본 F2L 삽입 (Case 2: Easy Insert Left)",
          algorithm: "U' L' U L",
          moveCount: 4,
          description: "왼쪽 슬롯에 삽입하는 기본 케이스입니다.",
          fingerTrick: true,
        },
        {
          name: "코너 위, 엣지 위 (같은 방향)",
          algorithm: "U R U2 R' U R U' R'",
          moveCount: 8,
          description:
            "코너와 엣지가 모두 윗층에 있고 같은 색이 같은 방향을 향할 때. 먼저 분리한 후 페어링하여 삽입합니다.",
          fingerTrick: true,
          tips: [
            "핵심: 코너의 흰색 방향을 먼저 확인하세요",
            "엣지를 숨기고(Hide) → 코너를 가져온 후 → 엣지와 만나게(Join) 합니다",
          ],
        },
        {
          name: "코너 위, 엣지 위 (반대 방향)",
          algorithm: "U' R U R' U R U' R'",
          moveCount: 8,
          description:
            "코너와 엣지가 모두 윗층에 있지만 반대 방향을 향할 때.",
          fingerTrick: true,
        },
        {
          name: "코너 슬롯 안, 엣지 위",
          algorithm: "R U R' U' R U R' U' R U R'",
          moveCount: 11,
          description:
            "코너가 이미 슬롯에 있지만 방향이 틀리고, 엣지가 윗층에 있을 때. 코너를 먼저 빼낸 후 재조합합니다.",
          tips: [
            "먼저 코너를 빼내는 것이 핵심",
            "빼낼 때 엣지 위치를 고려하면 더 짧은 해법을 찾을 수 있습니다",
          ],
        },
        {
          name: "코너와 엣지 모두 슬롯 안 (잘못된 방향)",
          algorithm: "R U' R' U R U2 R' U R U' R'",
          moveCount: 11,
          description:
            "둘 다 이미 삽입되어 있지만 틀린 경우. 하나를 빼내면서 다른 하나와 페어링합니다.",
        },
      ],
      tips: [
        "직관적 F2L: 공식 암기보다 '왜 이렇게 되는지' 이해하는 것이 중요합니다",
        "4개 슬롯 중 가장 쉬운 케이스부터 먼저 해결하세요",
        "무한 로테이션(y/y')을 줄이면 시간이 크게 단축됩니다",
        "빈 슬롯을 활용한 자유로운 공간 확보가 핵심입니다",
      ],
    },
    {
      title: "Step 3: 2-Look OLL (Orientation of Last Layer)",
      description:
        "OLL을 2단계로 나누어 적용합니다. 먼저 윗면 십자가를 만든 후, 코너 방향을 맞춥니다. 57개의 전체 OLL 대신 9개 공식만 외우면 됩니다.",
      algorithms: [
        {
          name: "OLL 십자가: 점 → ㄴ",
          algorithm: "F R U R' U' F'",
          moveCount: 6,
          description: "노란색 점만 있을 때 ㄴ자 모양을 만듭니다.",
          fingerTrick: true,
          facePattern: [
            "X", "X", "X",
            "X", "Y", "X",
            "X", "X", "X",
          ],
          patternLabel: "점 → ㄴ",
        },
        {
          name: "OLL 십자가: ㄴ → 십자가",
          algorithm: "F R U R' U' F'",
          moveCount: 6,
          description: "ㄴ자를 왼쪽 위에 두고 같은 공식을 적용하면 일자가 됩니다.",
          fingerTrick: true,
          facePattern: [
            "X", "X", "X",
            "Y", "Y", "X",
            "X", "Y", "X",
          ],
          patternLabel: "ㄴ → 일자",
        },
        {
          name: "OLL 십자가: 일자 → 십자가",
          algorithm: "F R U R' U' F'",
          moveCount: 6,
          description: "일자를 가로로 놓고 같은 공식을 적용하면 십자가 완성.",
          fingerTrick: true,
          facePattern: [
            "X", "X", "X",
            "Y", "Y", "Y",
            "X", "X", "X",
          ],
          patternLabel: "일자 → 십자가",
        },
        {
          name: "OLL 코너: Sune",
          algorithm: "R U R' U R U2 R'",
          moveCount: 7,
          description: "윗면 노란색이 1개일 때 (왼쪽 앞에 노란색). 가장 자주 나오는 코너 OLL.",
          fingerTrick: true,
          facePattern: [
            "X", "Y", "X",
            "Y", "Y", "Y",
            "Y", "Y", "X",
          ],
          patternLabel: "Sune",
        },
        {
          name: "OLL 코너: Anti-Sune",
          algorithm: "R U2 R' U' R U' R'",
          moveCount: 7,
          description: "Sune의 반대 케이스. 오른쪽 앞에 노란색이 있을 때.",
          fingerTrick: true,
          facePattern: [
            "X", "Y", "Y",
            "Y", "Y", "Y",
            "X", "Y", "X",
          ],
          patternLabel: "Anti-Sune",
        },
        {
          name: "OLL 코너: 물고기 왼쪽 (L)",
          algorithm: "F R U' R' U' R U R' F'",
          moveCount: 9,
          description: "왼쪽 물고기 모양. 노란색 2개가 대각선.",
          fingerTrick: true,
          facePattern: [
            "Y", "Y", "X",
            "Y", "Y", "Y",
            "X", "Y", "Y",
          ],
          patternLabel: "Fish L",
        },
        {
          name: "OLL 코너: 물고기 오른쪽 (R)",
          algorithm: "R U R' U' R' F R F'",
          moveCount: 8,
          description: "오른쪽 물고기 모양. 노란색 2개가 대각선.",
          fingerTrick: true,
          facePattern: [
            "X", "Y", "Y",
            "Y", "Y", "Y",
            "Y", "Y", "X",
          ],
          patternLabel: "Fish R",
        },
        {
          name: "OLL 코너: Headlights",
          algorithm: "R2 D R' U2 R D' R' U2 R'",
          moveCount: 9,
          description: "한 면에 노란색 코너 2개가 나란히 있는 경우.",
          facePattern: [
            "Y", "Y", "X",
            "Y", "Y", "Y",
            "Y", "Y", "X",
          ],
          patternLabel: "Headlights",
        },
        {
          name: "OLL 코너: Bruno (방향 맞음 0개)",
          algorithm: "R U2 R2 U' R2 U' R2 U2 R",
          moveCount: 9,
          description: "코너 4개 모두 방향이 틀린 경우.",
          facePattern: [
            "X", "Y", "X",
            "Y", "Y", "Y",
            "X", "Y", "X",
          ],
          patternLabel: "No corners",
        },
      ],
    },
    {
      title: "Step 4: 2-Look PLL (Permutation of Last Layer)",
      description:
        "PLL을 2단계로 나누어 적용합니다. 먼저 코너 위치를 맞춘 후, 엣지 위치를 맞춥니다. 21개의 전체 PLL 대신 6개 공식만 외우면 됩니다.",
      algorithms: [
        {
          name: "PLL 코너: A-perm (시계)",
          algorithm: "x R' U R' D2 R U' R' D2 R2 x'",
          moveCount: 9,
          description: "3개의 코너를 시계 방향으로 순환시킵니다.",
          fingerTrick: true,
          tips: [
            "맞는 코너(헤드라이트)를 왼쪽에 두고 실행",
            "헤드라이트가 없으면 아무 곳에서 1번 실행",
          ],
        },
        {
          name: "PLL 코너: A-perm (반시계)",
          algorithm: "x R2 D2 R U R' D2 R U' R x'",
          moveCount: 9,
          description: "3개의 코너를 반시계 방향으로 순환시킵니다.",
          fingerTrick: true,
        },
        {
          name: "PLL 엣지: U-perm (시계)",
          algorithm: "R U' R U R U R U' R' U' R2",
          moveCount: 11,
          description: "3개의 엣지를 시계 방향으로 순환. 코너가 모두 맞은 후 적용.",
          fingerTrick: true,
          tips: [
            "맞는 엣지(바)를 뒤에 두고 실행",
          ],
        },
        {
          name: "PLL 엣지: U-perm (반시계)",
          algorithm: "R2 U R U R' U' R' U' R' U R'",
          moveCount: 11,
          description: "3개의 엣지를 반시계 방향으로 순환.",
          fingerTrick: true,
        },
        {
          name: "PLL 엣지: H-perm",
          algorithm: "M2 U M2 U2 M2 U M2",
          moveCount: 7,
          description: "대각선 엣지 2쌍을 동시에 교환. M슬라이스를 활용합니다.",
          fingerTrick: true,
          probability: "1/72",
        },
        {
          name: "PLL 엣지: Z-perm",
          algorithm: "M2 U M2 U M' U2 M2 U2 M' U2",
          moveCount: 10,
          description: "인접한 엣지 2쌍을 동시에 교환.",
          probability: "1/36",
        },
      ],
    },
  ],
};

export default level2;

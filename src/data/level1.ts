import type { Level } from "./types";

const level1: Level = {
  id: 1,
  title: "입문 - Layer By Layer (LBL)",
  subtitle: "처음 큐브를 맞추는 사람을 위한 기초 방법",
  description:
    "LBL 방법은 큐브를 위층, 중간층, 아래층 순서로 맞추는 가장 기본적인 방법입니다. 약 7단계로 나뉘며, 이 방법만으로도 2~3분 내에 큐브를 맞출 수 있습니다.",
  targetTime: "2~5분",
  difficulty: "beginner",
  color: "#00b894",
  steps: [
    {
      title: "Step 1: 흰색 십자가 (White Cross)",
      description:
        "흰색 면을 위로 두고, 흰색 엣지 조각 4개를 맞춰 십자가를 만듭니다. 이 단계는 직관적으로 해결할 수 있으며, 별도의 공식이 필요하지 않습니다.",
      algorithms: [
        {
          name: "기본 원리",
          algorithm: "직관적 풀이 (공식 불필요)",
          moveCount: 0,
          description:
            "흰색 엣지를 찾아서 윗면으로 가져옵니다. 흰색 센터를 기준으로 각 엣지의 두 번째 색이 해당 면의 센터 색과 일치하도록 맞춥니다.",
          tips: [
            "흰색 면을 위로 두고 시작하세요",
            "엣지 조각의 두 번째 색을 해당 면의 센터 색과 맞추세요",
            "아래층에 있는 엣지는 해당 면을 180도 돌려서 올리세요",
            "중간층에 있는 엣지는 해당 면을 90도 돌려서 가져오세요",
          ],
          facePattern: [
            "X", "W", "X",
            "W", "W", "W",
            "X", "W", "X",
          ],
          patternLabel: "윗면 목표",
        },
      ],
    },
    {
      title: "Step 2: 흰색 코너 맞추기 (White Corners)",
      description:
        "흰색 십자가를 만든 후, 4개의 흰색 코너 조각을 올바른 위치에 넣어 흰색 면을 완성합니다.",
      algorithms: [
        {
          name: "코너 삽입 (오른쪽)",
          algorithm: "R U R' U'",
          moveCount: 4,
          description:
            "코너가 목표 위치의 바로 아래 (아랫면)에 있을 때, 이 공식을 1~5번 반복하면 코너가 제자리에 들어갑니다.",
          tips: [
            "코너가 정확한 위치에 올 때까지 아랫면(D)을 돌려 위치를 맞추세요",
            "이 공식을 최대 5번 반복하면 반드시 들어갑니다",
            "흰색 스티커가 오른쪽을 향할 때: 1번이면 됩니다",
            "흰색 스티커가 앞면을 향할 때: 3번 반복",
          ],
          fingerTrick: true,
          facePattern: [
            "W", "W", "W",
            "W", "W", "W",
            "W", "W", "W",
          ],
          patternLabel: "윗면 목표",
        },
        {
          name: "코너 삽입 (왼쪽)",
          algorithm: "L' U' L U",
          moveCount: 4,
          description: "코너가 왼쪽 앞 위치에 있을 때 사용합니다.",
          fingerTrick: true,
        },
        {
          name: "코너가 윗면에 잘못 들어간 경우",
          algorithm: "R U R' U' (코너 빼내기) → 재삽입",
          moveCount: 4,
          description:
            "이미 윗면에 있지만 방향이 틀린 코너는, 먼저 R U R' U'로 빼낸 다음 올바르게 다시 넣습니다.",
        },
      ],
    },
    {
      title: "Step 3: 2층 엣지 맞추기 (Second Layer / F2L Lite)",
      description:
        "큐브를 뒤집어서 흰색 면을 아래로 두고, 중간층의 엣지 4개를 맞춥니다. 노란색이 없는 엣지를 찾아 정확한 위치에 넣습니다.",
      algorithms: [
        {
          name: "엣지를 오른쪽으로 삽입",
          algorithm: "U R U' R' U' F' U F",
          moveCount: 8,
          description:
            "윗면의 엣지를 오른쪽 슬롯에 넣을 때 사용합니다. 엣지의 앞면 색이 앞면 센터와 일치하고, 윗면 색이 오른쪽 면과 일치할 때 적용합니다.",
          tips: [
            "먼저 엣지의 앞면 색을 해당 센터와 맞추세요 (U면 돌려서)",
            "엣지를 오른쪽으로 보내야 하면 이 공식 사용",
          ],
          fingerTrick: true,
          facePattern: [
            "X", "Y", "X",
            "X", "Y", "X",
            "X", "X", "X",
          ],
          patternLabel: "윗면 (노란색이 없는 엣지)",
        },
        {
          name: "엣지를 왼쪽으로 삽입",
          algorithm: "U' L' U L U F U' F'",
          moveCount: 8,
          description:
            "윗면의 엣지를 왼쪽 슬롯에 넣을 때 사용합니다. 엣지를 왼쪽으로 보내야 할 때 적용합니다.",
          fingerTrick: true,
        },
        {
          name: "엣지가 이미 중간층에 잘못 들어간 경우",
          algorithm: "위 공식 중 하나를 실행하여 잘못된 엣지를 빼낸 후 재삽입",
          moveCount: 8,
          description:
            "중간층에 이미 있지만 방향이 틀린 엣지는, 아무 엣지나 해당 슬롯에 넣는 공식을 실행하여 빼낸 다음, 올바르게 재삽입합니다.",
        },
      ],
    },
    {
      title: "Step 4: 노란색 십자가 (Yellow Cross)",
      description:
        "윗면(이제 노란색)에 십자가를 만듭니다. 이 단계에서는 노란색 엣지의 방향만 맞추면 되고, 위치는 아직 신경쓰지 않습니다.",
      algorithms: [
        {
          name: "노란색 십자가 공식",
          algorithm: "F R U R' U' F'",
          moveCount: 6,
          description:
            "이 공식을 윗면의 노란색 패턴에 따라 1~3번 적용합니다.",
          tips: [
            "점(·) 상태: 공식을 3번 적용",
            "ㄴ자 모양: ㄴ을 왼쪽 위로 두고 1번 적용 → 일자",
            "일자(ㅡ) 모양: 가로로 놓고 1번 적용 → 십자가 완성",
            "이미 십자가: 다음 단계로!",
          ],
          fingerTrick: true,
          facePattern: [
            "X", "Y", "X",
            "Y", "Y", "Y",
            "X", "Y", "X",
          ],
          patternLabel: "윗면 목표",
        },
      ],
    },
    {
      title: "Step 5: 노란색 십자가 엣지 위치 맞추기",
      description:
        "노란색 십자가의 엣지 조각들이 각 면의 센터 색과 일치하도록 위치를 맞춥니다.",
      algorithms: [
        {
          name: "엣지 순환 (시계방향)",
          algorithm: "R U R' U R U2 R' U",
          moveCount: 9,
          description:
            "인접한 두 엣지를 교환합니다. 이미 맞는 면을 뒤로 두고 실행하세요.",
          tips: [
            "먼저 U면을 돌려서 최소 1개의 엣지가 맞는지 확인",
            "맞는 면이 없으면 공식을 1번 실행하면 1개가 맞게 됩니다",
            "맞는 면을 뒤(B)로 두고 공식 실행",
            "대각선 교환이 필요하면 공식을 2번 실행",
          ],
          fingerTrick: true,
        },
      ],
    },
    {
      title: "Step 6: 노란색 코너 위치 맞추기 (PLL Corner Permutation)",
      description:
        "노란색 코너 4개를 올바른 위치로 이동시킵니다. 아직 방향(회전)은 신경쓰지 않습니다.",
      algorithms: [
        {
          name: "코너 순환",
          algorithm: "U R U' L' U R' U' L",
          moveCount: 8,
          description:
            "3개의 코너를 순환시킵니다. 이미 올바른 위치에 있는 코너를 왼쪽 앞에 두고 실행합니다.",
          tips: [
            "코너의 색 조합(3색)을 보고 올바른 위치인지 판단",
            "방향은 달라도, 3가지 색이 주변 센터와 일치하면 올바른 위치",
            "올바른 코너가 없으면 아무 위치에서 1번 실행 후 다시 확인",
          ],
          fingerTrick: true,
        },
      ],
    },
    {
      title: "Step 7: 노란색 코너 방향 맞추기 (OLL Corner Orientation)",
      description:
        "마지막 단계! 코너의 노란색 스티커가 위를 향하도록 방향을 맞춥니다. 이 단계를 완료하면 큐브가 완성됩니다!",
      algorithms: [
        {
          name: "코너 방향 공식",
          algorithm: "R U R' U R U2 R'",
          moveCount: 7,
          description:
            "방향이 틀린 코너를 오른쪽 앞에 두고 이 공식을 적용합니다. 노란색이 위를 향할 때까지 반복한 후, D면을 돌려 다음 틀린 코너를 가져옵니다.",
          tips: [
            "⚠️ 중요: 공식 도중에 큐브가 엉망으로 보여도 절대 당황하지 마세요!",
            "코너 하나가 맞으면 U면은 절대 돌리지 말고 D면만 돌려서 다음 코너를 가져오세요",
            "모든 코너가 맞으면 D면을 돌려 최종 정렬하면 완성!",
            "노란색이 위를 향할 때까지 공식을 2번 또는 4번 반복",
          ],
          fingerTrick: true,
          facePattern: [
            "Y", "Y", "Y",
            "Y", "Y", "Y",
            "Y", "Y", "Y",
          ],
          patternLabel: "최종 목표",
        },
      ],
    },
  ],
};

export default level1;

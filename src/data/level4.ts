import type { Level } from "./types";

const level4: Level = {
  id: 4,
  title: "스피드큐빙 최적화",
  subtitle: "Sub-15를 향한 고급 테크닉",
  description:
    "이미 CFOP를 완전히 익힌 큐버를 위한 최적화 기술입니다. 핑거트릭, Look-Ahead, 크로스+1 계획, 멀티슬롯팅 등 실전에서 시간을 깎아내는 핵심 테크닉을 다룹니다.",
  targetTime: "10~15초 (Sub-15)",
  difficulty: "expert",
  color: "#e94560",
  steps: [
    {
      title: "핑거트릭 (Finger Tricks) 마스터",
      description:
        "손가락의 움직임을 최적화하여 무브당 소요 시간을 줄입니다. 좋은 핑거트릭은 TPS(Turns Per Second)를 6~10까지 올려줍니다.",
      algorithms: [
        {
          name: "R / R' 핑거트릭",
          algorithm: "R → 오른 검지로 밀기 | R' → 오른 엄지로 밀기",
          moveCount: 1,
          description:
            "R은 오른손 검지(또는 약지)로, R'은 오른손 엄지로 실행합니다. 손목이 아닌 손가락만 사용하세요.",
          tips: [
            "R: 오른 검지로 오른면 아래→위 밀기 (또는 약지로 위→아래 당기기)",
            "R': 오른 엄지로 오른면 위→아래 밀기",
            "손목 회전을 최소화하면 TPS가 크게 오릅니다",
          ],
          fingerTrick: true,
        },
        {
          name: "U / U' / U2 핑거트릭",
          algorithm: "U → 오른 검지 | U' → 왼 검지 | U2 → 더블 플릭",
          moveCount: 1,
          description:
            "U-move는 가장 자주 사용되므로 핑거트릭이 특히 중요합니다.",
          tips: [
            "U: 오른 검지로 뒤→앞 밀기",
            "U': 왼 검지로 뒤→앞 밀기 (또는 오른 약지)",
            "U2: 오른 검지 + 왼 검지 연속 플릭 (더블 플릭)",
            "검지 플릭이 손목 회전보다 항상 빠릅니다",
          ],
          fingerTrick: true,
        },
        {
          name: "F / F' 핑거트릭",
          algorithm: "F → 오른 검지 감아올리기 | F' → 오른 엄지 감아내리기",
          moveCount: 1,
          description:
            "F-move는 그립 조정이 필요하므로, 가능하면 알고리즘 시작/끝에만 배치합니다.",
          tips: [
            "F: 오른 검지로 앞면을 시계 방향으로 감아올리기",
            "F': 오른 엄지로 앞면을 반시계 방향으로",
            "F-move가 중간에 오면 regrip이 필요 → 알고리즘 선택 시 고려",
          ],
          fingerTrick: true,
        },
        {
          name: "D / D' 핑거트릭",
          algorithm: "D → 오른 약지 | D' → 왼 약지",
          moveCount: 1,
          description: "D-move는 약지(또는 중지)로 실행하여 그립을 유지합니다.",
          tips: [
            "D: 오른 약지로 아랫면을 시계 방향",
            "D': 왼 약지로 아랫면을 반시계 방향",
            "PLL에서 D-move가 나올 때 regrip 없이 실행하는 것이 핵심",
          ],
          fingerTrick: true,
        },
        {
          name: "M / M' 슬라이스 무브",
          algorithm: "M → 왼 약지 위로 | M' → 왼 약지 아래로",
          moveCount: 1,
          description:
            "M-move는 왼 약지로 실행합니다. H-perm, Z-perm, OLL 57 등에서 핵심.",
          tips: [
            "M: 왼 약지로 중간층 위→아래 (또는 오른 검지로 뒤→앞)",
            "M': 왼 약지로 중간층 아래→위",
            "M2: 빠른 더블 플릭으로 연습",
            "M-move 연습이 H-perm과 Z-perm 속도를 결정합니다",
          ],
          fingerTrick: true,
        },
      ],
    },
    {
      title: "Look-Ahead 트레이닝",
      description:
        "현재 동작을 실행하면서 다음 조각을 미리 찾는 기술입니다. Look-Ahead가 좋으면 F2L에서 멈춤 없이 연속으로 풀 수 있습니다.",
      algorithms: [
        {
          name: "Slow Solving 연습법",
          algorithm: "천천히 풀면서 멈추지 않기",
          moveCount: 0,
          description:
            "일부러 느리게 풀되, 절대 멈추지 않는 연습입니다. 현재 F2L 페어를 삽입하면서 다음 페어를 눈으로 추적합니다.",
          tips: [
            "목표: 30초 안에 멈춤 없이 풀기 (속도보다 연속성이 중요)",
            "F2L 삽입할 때 시선을 이미 다음 조각에 두세요",
            "U면을 돌릴 때 다음에 풀 페어가 어디 있는지 체크",
            "매일 10분 Slow Solving → 자연스러운 Look-Ahead 형성",
            "메트로놈 앱으로 일정 속도 유지 연습도 효과적",
          ],
        },
        {
          name: "빈 슬롯 관리",
          algorithm: "전략적 F2L 순서 결정",
          moveCount: 0,
          description:
            "F2L 슬롯을 넣는 순서를 전략적으로 결정하여 Look-Ahead를 쉽게 만듭니다.",
          tips: [
            "쉬운 케이스(Free Pair)를 먼저 해결",
            "앞쪽 슬롯(FR, FL)을 나중에 풀면 뒤쪽 조각을 더 잘 볼 수 있음",
            "삽입 방향에 따라 다음 조각이 보이는 위치가 달라짐",
            "U2 삽입(뒤쪽 슬롯)은 Look-Ahead에 유리",
          ],
        },
      ],
    },
    {
      title: "Cross+1 & Extended Cross",
      description:
        "인스펙션 15초 동안 크로스뿐 아니라 첫 번째 F2L 페어까지 계획하는 기술입니다.",
      algorithms: [
        {
          name: "Cross+1 계획법",
          algorithm: "인스펙션에서 크로스 + 첫 F2L까지 계획",
          moveCount: 0,
          description:
            "크로스 해법을 실행하면서 첫 번째 F2L 페어의 위치를 추적합니다.",
          tips: [
            "크로스 해법이 6무브 이하일 때 Cross+1 시도",
            "크로스를 풀 때 코너와 엣지가 어디로 이동하는지 추적",
            "처음에는 크로스 후 쉬운 F2L이 바로 보이는 경우만 시도",
            "연습 방법: 크로스 해법 실행 후 눈 감고 첫 페어 위치 말하기",
          ],
        },
        {
          name: "다양한 크로스 색 연습 (Color Neutral)",
          algorithm: "6가지 색 크로스 모두 연습",
          moveCount: 0,
          description:
            "한 가지 색에 의존하지 않고, 6가지 크로스 중 가장 쉬운 것을 선택합니다. 평균 1~2무브 절약.",
          tips: [
            "처음에는 반대색 2가지 (흰+노)로 시작 → Dual CN",
            "익숙해지면 4가지 → 6가지로 확장",
            "CN은 빠를수록 배우기 쉽습니다 (나중에 바꾸기 매우 어려움)",
            "CN 전환 초기에는 시간이 느려지지만 장기적으로 큰 이점",
          ],
        },
      ],
    },
    {
      title: "고급 F2L 테크닉",
      description:
        "F2L에서 시간을 줄이는 고급 기술들입니다. 멀티슬롯팅, 키홀, 윈터 바리에이션 등을 다룹니다.",
      algorithms: [
        {
          name: "멀티슬롯팅 (Multi-Slotting)",
          algorithm: "F2L 삽입 시 다른 조각을 동시에 셋업",
          moveCount: 0,
          description:
            "하나의 F2L 페어를 삽입하면서, 다음 페어를 유리한 위치로 이동시킵니다.",
          tips: [
            "삽입 직전에 U/U' 한 번으로 다음 페어를 좋은 위치에 놓기",
            "빈 슬롯이 2개일 때 가장 효과적",
            "무리하지 말 것 - 잘못하면 오히려 느려집니다",
          ],
        },
        {
          name: "키홀 F2L (Keyhole)",
          algorithm: "엣지 먼저 삽입 → 코너 나중에 삽입",
          moveCount: 0,
          description:
            "빈 슬롯(키홀)에 엣지를 먼저 넣고, 나중에 코너를 삽입하는 기법. 특정 케이스에서 무브를 크게 절약.",
          tips: [
            "코너가 어려운 위치에 있고, 엣지가 쉬운 경우에 사용",
            "마지막 슬롯에서는 사용 불가 (빈 키홀이 필요)",
          ],
        },
        {
          name: "Winter Variation (WV)",
          algorithm: "마지막 F2L + OLL Skip을 유도",
          moveCount: 0,
          description:
            "마지막 F2L 삽입 시 윗면 코너 방향도 동시에 맞추어 OLL을 스킵하는 고급 기법. 27개 알고리즘.",
          tips: [
            "마지막 F2L 페어가 연결된 상태에서만 적용 가능",
            "코너가 오른쪽을 향할 때 가장 많은 WV 케이스 존재",
            "OLL Skip 확률을 크게 높여줌 (정상 1/216 → WV 시 항상)",
            "Sub-12를 목표로 할 때 배우는 것을 추천",
          ],
        },
        {
          name: "ZBLS (Zborowski-Bruchem Last Slot)",
          algorithm: "마지막 슬롯에서 엣지 방향도 동시 해결",
          moveCount: 0,
          description:
            "마지막 F2L + OLL 엣지를 동시에 해결하여 ZBLL(코너만 남은 OLL+PLL)로 연결. 302개 알고리즘.",
          tips: [
            "WV의 확장판. Sub-10을 목표로 할 때 고려",
            "전체를 외우기보다 자주 나오는 케이스만 선별적으로 학습",
          ],
        },
      ],
    },
    {
      title: "연습 루틴 & 시간 관리",
      description:
        "체계적인 연습 방법과 시간 기록 관리로 꾸준히 실력을 향상시킵니다.",
      algorithms: [
        {
          name: "일일 연습 루틴 (30분)",
          algorithm: "크로스 5분 → F2L 10분 → LL 10분 → 타임어택 5분",
          moveCount: 0,
          description: "매일 30분 체계적인 연습 루틴입니다.",
          tips: [
            "크로스 (5분): 인스펙션에서 크로스 계획 → 눈 감고 실행",
            "F2L (10분): Slow Solving + Look-Ahead 연습",
            "LL (10분): OLL/PLL 드릴 (약한 케이스 집중)",
            "타임어택 (5분): Ao5, Ao12 측정",
            "주 1회: 약한 부분만 집중 연습하는 날",
          ],
        },
        {
          name: "기록 분석법",
          algorithm: "스플릿 타임 분석",
          moveCount: 0,
          description:
            "전체 시간을 각 단계별로 나눠 분석하여 가장 큰 개선 포인트를 찾습니다.",
          tips: [
            "이상적인 스플릿: Cross 15% / F2L 50% / OLL 15% / PLL 20%",
            "15초 기준: Cross 2.3s / F2L 7.5s / OLL 2.3s / PLL 3s",
            "F2L이 가장 큰 비중 → F2L 개선이 전체 시간에 가장 큰 영향",
            "PB(Personal Best)보다 Ao100 개선에 집중하세요",
            "주간 Ao100 추이를 기록하면 성장이 보입니다",
          ],
        },
      ],
    },
  ],
};

export default level4;

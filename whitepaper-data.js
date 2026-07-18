function createWhitepaperEntry(entry) {
  return {
    id: entry.id,
    publishedAt: entry.publishedAt,
    monthLabel: entry.monthLabel,
    category: entry.category || "생명보험 활용백서",
    title: entry.title,
    subtitle: entry.subtitle,
    summary: entry.summary,
    teaserPoints: entry.teaserPoints || [],
    need: entry.need || [],
    definition: entry.definition || [],
    classes: entry.classes || [],
    checks: entry.checks || [],
    quote: entry.quote || [],
    consult: entry.consult || "",
    disclaimer: entry.disclaimer || "",
  };
}

window.whitepaperLibrary = [
  /*
    새 백서를 추가할 때는 아래 형식을 그대로 복사해 한 덩어리 추가하면 됩니다.

    createWhitepaperEntry({
      id: "2026-07",
      publishedAt: "2026-07-01",
      monthLabel: "2026년 7월편",
      category: "생명보험 활용백서",
      title: "알고보면 유익한 생명보험 활용백서",
      subtitle: "여기에 이번 달 주제를 입력하세요",
      summary: "백서 핵심 요약",
      teaserPoints: ["포인트 1", "포인트 2", "포인트 3"],
      need: ["왜 필요한지 1", "왜 필요한지 2"],
      definition: ["정의 1", "정의 2"],
      classes: [
        { label: "항목 1", feature: "핵심 특징", description: "설명" },
      ],
      checks: [
        { title: "체크포인트 1", body: "설명" },
      ],
      quote: ["강조 문장 1", "강조 문장 2"],
      consult: "상담 안내 문구",
      disclaimer: "유의사항",
    }),
  */
  createWhitepaperEntry({
    id: "2026-06",
    publishedAt: "2026-06-01",
    monthLabel: "2026년 6월편",
    category: "생명보험 활용백서",
    title: "알고보면 유익한 생명보험 활용백서",
    subtitle: "의료 고비용 시대 필수템, 종별 수술보장",
    summary:
      "생명보험 활용백서 6월편에서는 남녀노소 누구나 준비해두면 좋은 보장 중 하나인 수술보장에 대해 알아봅니다.",
    teaserPoints: [
      "예상치 못한 수술비 부담을 줄일 수 있는 보장 구조",
      "1종부터 5종까지 수술 분류에 따른 핵심 차이",
      "가입 전에 꼭 확인해야 할 3가지 체크포인트",
    ],
    need: [
      "다양한 의료비 항목 중 가장 부담이 큰 비용을 꼽자면 단연 수술비용입니다.",
      "특히 5세대 실손보험 출시로 보장 공백이 발생하면서, 예상치 못한 수술비에 대비할 수 있는 보장의 필요성은 더욱 커지고 있습니다.",
      "미리 수술보장을 준비해두면 의료비 부담을 줄이고 치료에 더 집중할 수 있습니다.",
    ],
    definition: [
      "종별 수술보장은 수술의 난이도와 치료비 수준 등을 고려해 수술을 1종부터 5종까지 분류하고, 해당 분류에 따라 보험금을 지급하는 구조입니다.",
      "간단한 수술은 낮은 종으로, 생명과 직결되거나 고난도 치료가 필요한 수술은 높은 종으로 분류되어 더 큰 보험금이 지급됩니다.",
    ],
    classes: [
      {
        label: "1종 수술",
        feature: "외래 위주의 간단한 수술",
        description: "비교적 부담이 적고 회복이 빠른 수준의 수술",
      },
      {
        label: "2종 수술",
        feature: "비교적 단순한 저난도 수술",
        description: "치료 난이도가 높지 않은 기본적인 수술",
      },
      {
        label: "3종 수술",
        feature: "일정 수준 치료가 필요한 수술",
        description: "치료 과정과 회복에 일정한 관리가 필요한 수술",
      },
      {
        label: "4종 수술",
        feature: "전문기술과 입원이 필요한 중증수술",
        description: "전문적인 의료기술과 입원 치료가 필요한 수술",
      },
      {
        label: "5종 수술",
        feature: "생명과 직결되는 고난도 수술",
        description: "장기 절제 등 생명과 밀접한 고난도 수술",
      },
    ],
    checks: [
      {
        title: "비갱신 보험료 여부",
        body: "보험료가 일정 기간마다 오르는 갱신형인지, 보험료 변동 없이 유지되는 비갱신형인지 확인해야 합니다.",
      },
      {
        title: "종신보장 여부",
        body: "일정 기간만 보장되는 상품인지, 평생 보장이 가능한 상품인지 확인하는 것이 중요합니다.",
      },
      {
        title: "회당보장 여부",
        body: "수술 1회에 한 번만 보장되는지, 반복 수술 시에도 회당 보장이 가능한지 확인해야 합니다.",
      },
    ],
    quote: [
      "보험은 부자가 되기 위한 수단이 아닙니다.",
      "만약의 불행으로부터 가장 소중한 가치를 지키는 지혜입니다.",
      "수술비는 예고 없이 찾아오는 큰 부담이 될 수 있습니다. 미리 준비한 수술보장은 치료비 걱정을 덜고, 나와 가족의 생활을 지키는 든든한 안전장치가 될 수 있습니다.",
    ],
    consult:
      "종별 수술보장에 대해 더 자세히 알고 싶거나 내 상황에 맞는 보장을 점검하고 싶다면 교보생명 경북중앙FP지점 전문FP 김원자와 상담해보세요.",
    disclaimer:
      "위 내용은 보험에 대한 전반적인 안내이며, 보험사 및 상품에 따라 세부 보장 내용은 달라질 수 있습니다. 가입 전 반드시 약관과 상품설명서를 확인하시기 바랍니다.",
  }),
]
  .filter((entry) => entry && entry.id && entry.title)
  .sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));

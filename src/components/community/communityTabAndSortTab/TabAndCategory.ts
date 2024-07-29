export const handleTabIntroduction = (tab: string) => {
  switch (tab) {
    case "전체":
      return "모든 주제의 게시글을 볼 수 있는 공간입니다.";
    case "인기글":
      return "가장 인기 있는 게시글을 모아놓은 공간입니다.(미구현)";
    case "자유게시판":
      return "여러분의 반려 이야기를 자유롭게 들려주세요";
    case "고양이":
      return "야옹야옹";
    case "강아지":
      return "멍멍";
    case "희귀동물":
      return "희귀동물";
    case "자랑하기":
      return "자랑하고 싶은 것이 있다면 여기서 자랑하세요!";
    case "고민있어요":
      return "고민을 나누고 조언을 구할 수 있는 공간입니다.";
    case "실종/신고":
      return "잃어버린 가족을 찾아주세요!! 😥";
    default:
      return "모든 주제의 게시글을 볼 수 있는 공간입니다.";
  }
};

export const tabs = [
  "전체",
  "인기글",
  "자유게시판",
  "고양이",
  "강아지",
  "희귀동물",
  "자랑하기",
  "고민있어요",
  "실종/신고"
];
export const sortCategory = ["최신순", "인기순", "댓글많은순"];

// store.js
// 기본 예제를 넣어놓았습니다!

// 세팅예제
import { create } from 'zustand'

type Store = {
  count: number
  inc: () => void
}

export const useStore = create<Store>()((set) => ({
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
}))

// 다른 컴포넌트에서 사용할 경우 예제
// function Counter() {
//   const { count, inc } = useStore()
//   return (
//     <div>
//       <span>{count}</span>
//       <button onClick={inc}>one up</button>
//     </div>
//   )
// }
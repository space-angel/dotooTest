// 기본 task 데이터 (공통으로 사용)
export const TASK_PRESETS = {
  living: {
    tasks: [
      { id: 'living_organize', name: '정리정돈', level: 'MIN' },
      { id: 'living_trash', name: '쓰레기통 비우기', level: 'MORE' },
      { id: 'living_vacuum', name: '진공청소기 돌리기', level: 'MORE' },
      { id: 'living_mop', name: '바닥 걸레질', level: 'MAX' },
      { id: 'living_window', name: '창문 닦기', level: 'MAX' }
    ],
    name: '거실',
    id: 'living'
  },
  kitchen: {
    tasks: [
      { id: 'kitchen_dishes', name: '설거지', level: 'MIN' },
      { id: 'kitchen_food_waste', name: '음쓰 처리하기', level: 'MORE' },
      { id: 'kitchen_fridge', name: '냉장고 정리', level: 'MORE' },
      { id: 'kitchen_microwave', name: '전자레인지 청소', level: 'MAX' },
      { id: 'kitchen_vent', name: '환풍기 필터 청소', level: 'MAX' }
    ],
    name: '주방',
    id: 'kitchen'
  },
  bathroom: {
    tasks: [
      { id: 'bathroom_shower', name: '샤워기 및 욕조 물기 닦기', level: 'MIN' },
      { id: 'bathroom_hair', name: '머리카락 치우기', level: 'MIN' },
      { id: 'bathroom_trash', name: '휴지통 비우기', level: 'MIN' },
      { id: 'bathroom_floor', name: '바닥 및 타일 청소', level: 'MORE' },
      { id: 'bathroom_drain', name: '배수구 청소', level: 'MAX' }
    ],
    name: '화장실',
    id: 'bathroom'
  },
  bedroom: {
    tasks: [
      { id: 'bedroom_bedding', name: '침구 정리', level: 'MIN' },
      { id: 'bedroom_ventilation', name: '환기하기', level: 'MIN' },
      { id: 'bedroom_floor', name: '바닥 진공청소기 및 걸레질', level: 'MORE' },
      { id: 'bedroom_clothes', name: '옷정리', level: 'MORE' },
      { id: 'bedroom_mattress', name: '매트리스 청소', level: 'MAX' }
    ],
    name: '침실',
    id: 'bedroom'
  }
}

// 테스트1 환경용 변환 함수
export const getTest1Tasks = () => {
  return Object.values(TASK_PRESETS).flatMap(space => 
    space.tasks.map(task => ({
      id: task.id,
      name: task.name,
      space: { id: space.id, name: space.name }
    }))
  )
}

// 테스트2 환경용 변환 함수
export const getTest2Tasks = () => {
  const result: Record<string, Array<{
    id: string;
    spaceId: string;
    level: string;
    title: string;
  }>> = {}
  
  Object.entries(TASK_PRESETS).forEach(([spaceId, space]) => {
    result[spaceId] = ['MIN', 'MORE', 'MAX'].map(level => ({
      id: `${spaceId}-${level.toLowerCase()}`,
      spaceId: spaceId,
      level: level,
      title: space.tasks
        .filter(task => task.level === level)
        .map(task => task.name)
        .join('\n')
    }))
  })
  
  return result
}

export interface Space {
  id: string;
  name: string;
  color?: string;
}

export const SPACES: Space[] = [
  {
    id: 'home',
    name: '집',
    color: '#FF5733'
  },
  {
    id: 'work',
    name: '직장',
    color: '#33FF57'
  },
  {
    id: 'personal',
    name: '개인',
    color: '#3357FF'
  }
];

// before: (param: any) => { ... }
// after: (param: TaskParams) => { ... } 
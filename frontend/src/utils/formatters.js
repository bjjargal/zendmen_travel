import { News } from '@/data/News'
import { computed } from 'vue'

let projectFormatters = {}
export function projectTitle(project) {
  if (project == null) {
    return ''
  }

  let projectId = project.toString()
  if (!projectFormatters[projectId]) {
    projectFormatters[projectId] = computed(() => {
      if (News.data.length > 0) {
        const project = News.data.find((p) => p.name.toString() === projectId)
        if (project) {
          return project.title
        }
      }
      return projectId
    })
  }
  return projectFormatters[projectId]
}

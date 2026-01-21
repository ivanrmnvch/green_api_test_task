import './style.css'
import { initLayout } from './ui/layout'
import { bindHandlers } from './ui/bindings'

const root = document.querySelector<HTMLDivElement>('#app')

if (!root) {
  throw new Error('Root element #app not found')
}

const layout = initLayout(root)
bindHandlers(layout)

import './style.css'
import { initLayout } from './ui/layout'

const root = document.querySelector<HTMLDivElement>('#app')

if (!root) {
  throw new Error('Root element #app not found')
}

initLayout(root)

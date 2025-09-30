import React, { useEffect, useMemo, useState } from 'react'

type Todo = {
  id: string
  text: string
  done: boolean
  createdAt: number
}

type Filter = 'all' | 'active' | 'completed'

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36)

export default function App() {
  const [items, setItems] = useState<Todo[]>(() => {
    try { return JSON.parse(localStorage.getItem('todo-items') || '[]') as Todo[] } catch { return [] }
  })
  const [text, setText] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => { localStorage.setItem('todo-items', JSON.stringify(items)) }, [items])

  const remaining = useMemo(() => items.filter(i => !i.done).length, [items])
  const filtered = useMemo(() => {
    if (filter === 'active') return items.filter(i => !i.done)
    if (filter === 'completed') return items.filter(i => i.done)
    return items
  }, [items, filter])

  function addItem(e: React.FormEvent) {
    e.preventDefault()
    const t = text.trim()
    if (!t) return
    setItems(prev => [{ id: uid(), text: t, done: false, createdAt: Date.now() }, ...prev])
    setText('')
  }
  function toggle(id: string) {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, done: !i.done } : i)))
  }
  function remove(id: string) {
    setItems(prev => prev.filter(i => i.id !== id))
  }
  function clearCompleted() {
    setItems(prev => prev.filter(i => !i.done))
  }

  const btnBase =
    'px-3 py-2 rounded-md text-sm font-medium transition shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2'
  const pill =
    'px-2 py-1 rounded-md text-sm transition'

  return (
<div className="min-h-screen bg-[#fdf0d5] text-[#003049] flex items-center">
  <div className="w-full">
    <div className="mx-auto max-w-xl px-4 py-10">
      <div className="bg-white/80 backdrop-blur border border-black/5 shadow-xl rounded-2xl p-6">
          <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-2">
            <span className="inline-block size-6 rounded bg-[#669bbc]"></span>
            ToDo
          </h1>

          <form onSubmit={addItem} className="mt-6 flex gap-3">
            <input
              className="flex-1 rounded-lg border border-black/10 bg-white px-3 py-2 text-base placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-[#669bbc] focus:border-[#669bbc]"
              placeholder="Add a task…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              aria-label="New todo text"
            />
            <button
              type="submit"
              disabled={!text.trim()}
              className={`${btnBase} bg-[#003049] text-white hover:brightness-110 disabled:opacity-50 focus:ring-[#669bbc]`}
            >
              Add
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm opacity-80">{remaining} left</div>
            <div className="flex gap-2">
              {(['all','active','completed'] as Filter[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`${pill} ${
                    filter === f
                      ? 'bg-[#669bbc]/20 text-[#003049] ring-1 ring-[#669bbc]/40'
                      : 'hover:bg-black/5'
                  }`}
                >
                  {f[0].toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <ul className="mt-4 divide-y divide-black/10">
            {filtered.length === 0 && (
              <li className="py-8 text-center text-black/60">No items here, add one above.</li>
            )}
            {filtered.map(item => (
              <li key={item.id} className="py-3 flex items-center gap-3">
                <input
                  id={`todo-${item.id}`}
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggle(item.id)}
                  className="size-4 accent-[#669bbc]"
                />
                <label
                  htmlFor={`todo-${item.id}`}
                  className={`flex-1 ${item.done ? 'line-through text-black/40' : ''}`}
                >
                  {item.text}
                </label>
                <button
                  onClick={() => remove(item.id)}
                  className="text-sm px-2 py-1 rounded-md bg-[#fef2f2] text-[#c1121f] hover:bg-[#fde3e3] ring-1 ring-[#c1121f]/10"
                  aria-label={`Delete ${item.text}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex justify-end">
            <button
              onClick={clearCompleted}
              className={`${btnBase} bg-[#c1121f] text-white hover:bg-[#780000] focus:ring-[#c1121f]`}
            >
              Clear completed
            </button>
          </div>
        </div>
      </div>
    </div>
</div>
  )
}

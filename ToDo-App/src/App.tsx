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
    try {
      return JSON.parse(localStorage.getItem('todo-items') || '[]') as Todo[]
    } catch {
      return []
    }
  })
  const [text, setText] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    localStorage.setItem('todo-items', JSON.stringify(items))
  }, [items])

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
    setItems(prev => [
      { id: uid(), text: t, done: false, createdAt: Date.now() },
      ...prev,
    ])
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

  // Just a quick UI, tailwind ill do later
  return (
    <div>
      <h1>ToDo</h1>

      <form onSubmit={addItem}>
        <input
          placeholder="Add a task…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="New todo text"
        />
        <button type="submit" disabled={!text.trim()}>
          Add
        </button>
      </form>

      <div>
        <div>{remaining} left</div>
        <div>
          {(['all','active','completed'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
            >
              {f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <ul>
        {filtered.length === 0 && (
          <li>No items here, add one above.</li>
        )}
        {filtered.map(item => (
          <li key={item.id}>
            <input
              id={`todo-${item.id}`}
              type="checkbox"
              checked={item.done}
              onChange={() => toggle(item.id)}
            />
            <label
              htmlFor={`todo-${item.id}`}
              style={{
                textDecoration: item.done ? 'line-through' : 'none',
                color: item.done ? '#777' : 'inherit',
              }}
            >
              {item.text}
            </label>
            <button onClick={() => remove(item.id)} aria-label={`Delete ${item.text}`}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      <div>
        <button onClick={clearCompleted}>Clear completed</button>
      </div>
    </div>
  )
}

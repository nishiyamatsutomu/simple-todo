"use client";

import { useEffect, useState } from "react";

type Todo = {
  id: string;
  text: string;
  done: boolean;
};

const STORAGE_KEY = "simple-todo:items";

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [loaded, setLoaded] = useState(false);

  // 初回マウント時に localStorage から読み込む
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setTodos(JSON.parse(saved));
    } catch {
      // 破損データなどは無視
    }
    setLoaded(true);
  }, []);

  // 変更のたびに localStorage へ保存する
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
  }, [todos, loaded]);

  const addTodo = () => {
    const value = text.trim();
    if (!value) return;
    setTodos((prev) => [
      { id: crypto.randomUUID(), text: value, done: false },
      ...prev,
    ]);
    setText("");
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addTodo();
  };

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <section className="card">
      <div className="input-row">
        <input
          className="input"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="新しいタスクを入力…"
          aria-label="新しいタスク"
        />
        <button
          className="add-btn"
          onClick={addTodo}
          disabled={!text.trim()}
        >
          追加
        </button>
      </div>

      {todos.length === 0 ? (
        <p className="empty">まだタスクがありません 🎉</p>
      ) : (
        <ul className="list">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`item${todo.done ? " done" : ""}`}
            >
              <input
                className="checkbox"
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
                aria-label={`${todo.text} を完了にする`}
              />
              <span className="item-text">{todo.text}</span>
              <button
                className="delete-btn"
                onClick={() => deleteTodo(todo.id)}
                aria-label={`${todo.text} を削除`}
                title="削除"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {todos.length > 0 && (
        <p className="footer">残り {remaining} 件のタスク</p>
      )}
    </section>
  );
}

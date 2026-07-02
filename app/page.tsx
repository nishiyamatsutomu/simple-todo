import TodoApp from "./TodoApp";

export default function Home() {
  return (
    <main className="container">
      <header className="header">
        <h1 className="title">シンプル TODO</h1>
        <p className="subtitle">やることを追加して、こなしていきましょう</p>
      </header>
      <TodoApp />
    </main>
  );
}

const layout = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <main className="w-screen h-screen overflow-hidden flex p-10">
      <div className="w-[35%]">{children}</div>
      <div className="w-[65%] px-20">Tasqit Logo</div>
    </main>
  )
}

export default layout

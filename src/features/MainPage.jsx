import Sidebar from '../components/Sidebar';

function NotePage() {
  return (
    <>
      <div className="flex w-full h-screen">
        <Sidebar />
        <div className="bg-[var(--color-primary)] w-full min-w-52 flex flex-col items-center justify-center h-full">
        <h1 className='text-[var(--color-text)] text-4xl'>Choose a note to start.</h1>
        </div>
      </div>
    </>
  )
}

export default NotePage;